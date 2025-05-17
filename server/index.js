const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Load env vars
dotenv.config();

// Connect DB
connectDB();

// Create app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with frontend URL if needed
    methods: ['GET', 'POST'],
  }
});

// Store io reference for emitting notifications later
global._io = io;

// On connection
io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
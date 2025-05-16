const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ 
      message: "User already exists" 
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role 
    });
    await user.save();

    res.status(201).json({ 
      message: "User registered successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user
    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ 
      message: "Invalid credentials" 
    });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ 
      message: "Invalid credentials" 
    });

    // Generate token
    const token = generateToken(user);

    res.status(200).json({ 
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
};

module.exports = {
  register,
  login,
};
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log('Auth middleware - Headers:', req.headers);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('Auth middleware - No token provided');
    return res.status(401).json({ 
      message: "Unauthorized - No token provided" 
    });
  }

  const token = authHeader.split(" ")[1];
  console.log('Auth middleware - Token:', token.substring(0, 10) + '...');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Decoded token:', decoded);
    req.user = decoded; // Attach user to request
    next();
  } catch (err) {
    console.error('Auth middleware - Token verification error:', err);
    return res.status(401).json({ 
      message: "Unauthorized - Invalid token" 
    });
  }
};

module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded; // Attach the user data to the request object
    next();
  });
};

// Middleware to check if the user is a super admin
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied, only super admins can perform this action' });
  }
  next();
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, only admins can perform this action' });
  }
  next();
};

// Middleware to check if the user is a regular user
const isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Access denied, only users can perform this action' });
  }
  next();
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, jwtConfig.secret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

module.exports = { verifyToken, isAdmin, isSuperAdmin, isUser, authenticateToken };

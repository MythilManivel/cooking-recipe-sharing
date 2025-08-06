const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user account is active
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated'
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

// Optional authentication - don't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      // Only set user if account is active
      if (req.user && !req.user.isActive) {
        req.user = null;
      }
    } catch (error) {
      // Silently fail for optional auth
      req.user = null;
    }
  }

  next();
};

// Check if user owns the resource
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'User role is not authorized to access this route'
      });
    }

    next();
  };
};

// Check if user owns the resource or is admin
const checkOwnership = (Model, paramName = 'id', userField = 'author') => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params[paramName]);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Check if user owns the resource
      const resourceUserId = resource[userField]?.toString() || resource[userField];
      const currentUserId = req.user.id.toString();

      if (resourceUserId !== currentUserId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this resource'
        });
      }

      // Attach resource to request for use in the route handler
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error checking resource ownership'
      });
    }
  };
};

// Verify email middleware
const requireEmailVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address before accessing this resource'
    });
  }
  next();
};

// Rate limiting for sensitive operations
const sensitiveOperationLimit = (req, res, next) => {
  // This would typically use Redis or similar for production
  // For now, we'll use a simple in-memory store
  const userOperations = global.userOperations || {};
  const userId = req.user.id;
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  if (!userOperations[userId]) {
    userOperations[userId] = { count: 0, resetTime: now + oneHour };
  }

  const userOps = userOperations[userId];

  // Reset if time expired
  if (now > userOps.resetTime) {
    userOps.count = 0;
    userOps.resetTime = now + oneHour;
  }

  // Check limit (e.g., 5 sensitive operations per hour)
  if (userOps.count >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many sensitive operations. Please try again later.'
    });
  }

  userOps.count++;
  global.userOperations = userOperations;
  next();
};

module.exports = {
  protect,
  optionalAuth,
  authorize,
  checkOwnership,
  requireEmailVerification,
  sensitiveOperationLimit
};
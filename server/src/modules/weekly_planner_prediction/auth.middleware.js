const { protect } = require('../../middlewares/auth.middleware');

/**
 * Authentication middleware for Progress Tracking
 * Extracts user ID from JWT token and attaches to request
 */
const authenticateUser = (req, res, next) => {
  // Call the existing protect middleware
  protect(req, res, (err) => {
    if (err) return next(err);
    
    // Add user ID to request body for existing controllers
    if (req.user && req.user._id) {
      req.body.userId = req.user._id.toString();
      req.userId = req.user._id.toString();
    }
    
    next();
  });
};

/**
 * Role-based authorization middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized - No user found' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Forbidden - Insufficient permissions' 
      });
    }

    next();
  };
};

/**
 * Middleware to extract user ID from params for user-specific routes
 */
const extractUserIdFromParams = (req, res, next) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ 
      success: false,
      message: 'User ID is required' 
    });
  }

  // Verify that the authenticated user can access this resource
  if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Forbidden - Cannot access other users data' 
    });
  }

  req.userId = userId;
  next();
};

module.exports = {
  authenticateUser,
  authorize,
  extractUserIdFromParams
};

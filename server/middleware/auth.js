function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, allow access to the next middleware
    }
    res.status(401).json({ message: 'You must be logged in to access this route' });
  }
  
  function hasAdminRole(req, res, next) {
    if (req.user && req.user.role === 'Admin') {
      return next(); // User is authenticated and has Admin role
    }
    res.status(403).json({ message: 'You do not have permission to access this route' });
  }
  
  module.exports = { isAuthenticated, hasAdminRole };
  
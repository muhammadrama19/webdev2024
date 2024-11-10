const jwt = require("jsonwebtoken");

// Middleware to authenticate the token
const isAuthenticated = (req, res, next) => {
  // Try to get the token from the cookie or the Authorization header
  const token =
    req.cookies.token ||
    (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]);

  if (!token) {
    // If token is missing, return a 401 Unauthorized response
    return res.status(401).json({ error: "Access Denied: No token provided." });
  }

  // Verify the token
  jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
  
    // console.log("Decoded token:", decoded); // Log the decoded token for debugging
    req.user = decoded;
    next();
  });  
};
// Middleware to authorize only admins
const hasAdminRole = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    return next();
  } else {
    return res.status(403).json({ error: "Access Denied: Admins only." });
  }
};


module.exports = { isAuthenticated, hasAdminRole };

const jwt = require("jsonwebtoken");

// Middleware to authenticate the token
const isAuthenticated = (req, res, next) => {
    // Skip middleware during testing
    if (process.env.NODE_ENV === "test") {
        req.user = { id: 1, role: "Admin" }; // Mock user yang valid
        return next();
    }

    const token =
        req.cookies.token ||
        (req.headers["authorization"] &&
            req.headers["authorization"].split(" ")[1]);

    if (!token) {
        return res.status(401).json({ error: "Access Denied: No token provided." });
    }

    jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token." });
        }
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

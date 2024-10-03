module.exports = {
    secret: process.env.JWT_SECRET || "supersecretkey",
    expiresIn: "1h", // JWT expiry time
  };
  
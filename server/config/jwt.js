const jwt = require("jsonwebtoken");


function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role, // Include role in the payload
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

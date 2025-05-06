// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Geen token meegegeven" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Zorg dat dit { userId: ... } bevat
    next();
  } catch (err) {
    console.error("❌ Token verificatie mislukt:", err);
    return res.status(403).json({ message: "Token is ongeldig of verlopen" });
  }
}

module.exports = authenticateToken;

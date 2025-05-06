// middleware/auth.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Geen token, toegang geweigerd" });
  }

  try {
    const decoded = jwt.verify(token, "geheime_sleutel");
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token verificatie mislukt", err);
    res.status(403).json({ message: "Ongeldig of verlopen token" });
  }
};

module.exports = authenticateToken;

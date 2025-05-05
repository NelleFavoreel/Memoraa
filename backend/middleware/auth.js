const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Haal "Bearer TOKEN" uit de header

  if (!token) {
    return res.status(401).json({ message: "Geen toegangstoken meegegeven." });
  }

  jwt.verify(token, "geheime_sleutel", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Ongeldige token." });
    }

    req.user = user; // Zet gebruiker in de request, bijvoorbeeld: { userId: "..." }
    next();
  });
}

module.exports = authenticateToken;

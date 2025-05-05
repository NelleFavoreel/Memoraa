// backend/routes/users.js
const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const { ObjectId } = require("mongodb"); // Correcte manier om ObjectId te importeren

// Gebruiker ophalen op basis van userId
router.get("/:userId", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("users");

    const userId = req.params.userId; // Haal de userId uit de request parameters
    console.log(`Op zoek naar gebruiker met ID: ${userId}`); // Log de userId

    // Zoek de gebruiker op basis van de userId
    const user = await collection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).send("Gebruiker niet gevonden");
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Fout bij ophalen van gebruiker:", err);
    res.status(500).send("Fout bij ophalen van gebruiker.");
  }
});

module.exports = router;

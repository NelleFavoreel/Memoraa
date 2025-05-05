// backend/routes/trips.js
const express = require("express");
const router = express.Router();
const { getDB } = require("../db");

// Alle reizen ophalen
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("trips");

    const trips = await collection.find().toArray(); // haal alles op als array

    res.json(trips); // stuur terug naar frontend
  } catch (err) {
    console.error("❌ Fout bij ophalen van trips:", err);
    res.status(500).send("Fout bij ophalen van reizen.");
  }
});

module.exports = router;

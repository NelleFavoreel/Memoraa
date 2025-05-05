// backend/routes/trips.js
const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const { ObjectId } = require("mongodb"); // Correcte manier om ObjectId te importeren

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

// Reis verwijderen
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("trips");

    const tripId = req.params.id; // Haal het ID uit de URL parameters

    // Verwijder de reis met het gegeven _id
    const result = await collection.deleteOne({ _id: new ObjectId(tripId) }); // Gebruik 'new ObjectId'

    if (result.deletedCount === 1) {
      res.status(200).send("Reis succesvol verwijderd.");
    } else {
      res.status(404).send("Reis niet gevonden.");
    }
  } catch (err) {
    console.error("❌ Fout bij verwijderen van reis:", err);
    res.status(500).send("Fout bij verwijderen van reis.");
  }
});

module.exports = router;

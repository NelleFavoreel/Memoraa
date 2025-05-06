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

// Reis toevoegen (POST)
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("trips");
    const usersCollection = db.collection("users"); // Referentie naar de users collectie

    const { place, country, imageUrl, startDate, endDate, screenNames, familyId } = req.body;

    // Controleer of alle noodzakelijke gegevens aanwezig zijn
    if (!place || !country || !startDate || !endDate || !screenNames || !familyId) {
      return res.status(400).json({ message: "Fout: Alle velden zijn vereist." });
    }

    // Zoek de gebruikers met de opgegeven screenNames
    const users = await usersCollection.find({ screenName: { $in: screenNames } }).toArray();
    const travelerIds = users.map((user) => user._id);

    // Maak een nieuw reisobject
    const newTrip = {
      place,
      country,
      imageUrl,
      startDate: new Date(startDate), // Zorg ervoor dat de datums als Date object worden opgeslagen
      endDate: new Date(endDate),
      travelers: travelerIds, // Voeg de gevonden user _id's toe aan de travelers array
      familyId,
    };

    // Voeg de reis toe aan de MongoDB collectie
    const result = await collection.insertOne(newTrip);

    // Geef een succesbericht terug
    res.status(201).json({ message: "Reis succesvol toegevoegd.", tripId: result.insertedId });
  } catch (err) {
    console.error("❌ Fout bij toevoegen van reis:", err);
    res.status(500).json({ message: "Fout bij het toevoegen van reis." });
  }
});
// Reis detailpagina met bijbehorende dagen ophalen
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Haal tripId uit de URL
    const db = getDB();
    const tripsCollection = db.collection("trips");
    const tripDaysCollection = db.collection("tripDays");

    // Zet tripId om naar een geldig ObjectId
    const tripObjectId = new ObjectId(id);

    // Haal de reisgegevens op uit de trips collectie
    const trip = await tripsCollection.findOne({ _id: tripObjectId });

    if (!trip) {
      return res.status(404).json({ message: "Reis niet gevonden" });
    }

    // Haal de tripdagen op die bij deze reis horen
    const tripDays = await tripDaysCollection.find({ tripId: tripObjectId }).toArray();

    // Stuur de gegevens terug
    res.json({
      trip,
      tripDays,
    });
  } catch (err) {
    console.error("❌ Fout bij ophalen van reis detail:", err);
    res.status(500).json({ message: "Fout bij ophalen van reis details." });
  }
});

module.exports = router;

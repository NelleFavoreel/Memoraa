const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const authenticateToken = require("../middleware/auth");
const jwt = require("jsonwebtoken");

// Zoek familieleden binnen dezelfde familyId
router.get("/search-family-members", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const db = getDB();
  const collection = db.collection("users");

  try {
    const user = await collection.findOne({ _id: new ObjectId(req.user.userId) });

    if (!user) {
      return res.status(404).json({ message: "Gebruiker niet gevonden." });
    }

    const results = await collection
      .find({
        familyId: user.familyId,
        screenName: { $regex: query, $options: "i" },
        _id: { $ne: user._id }, // zichzelf niet tonen
      })
      .project({ _id: 1, screenName: 1 })
      .toArray();

    res.json(results);
  } catch (err) {
    console.error("❌ Fout bij zoeken naar familieleden:", err);
    res.status(500).json({ message: "Zoeken mislukt." });
  }
});
// Familielid toevoegen aan friend list
router.post("/add-friend", authenticateToken, async (req, res) => {
  const { friendId } = req.body;
  const db = getDB();
  const collection = db.collection("users");

  try {
    const user = await collection.findOne({ _id: new ObjectId(req.user.userId) });
    const friend = await collection.findOne({ _id: new ObjectId(friendId) });

    if (!user || !friend) {
      return res.status(404).json({ message: "Gebruiker of vriend niet gevonden." });
    }

    // Voeg toe aan vriendenlijst, alleen als nog niet toegevoegd
    await collection.updateOne(
      { _id: new ObjectId(user._id) },
      { $addToSet: { friends: friend._id } } // $addToSet voorkomt dubbele items
    );

    res.json({ message: "Familielid succesvol toegevoegd als vriend." });
  } catch (err) {
    console.error("❌ Fout bij toevoegen familielid:", err);
    res.status(500).json({ message: "Toevoegen mislukt." });
  }
});
module.exports = router;

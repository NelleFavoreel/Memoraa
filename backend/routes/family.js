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
    const userId = new ObjectId(req.user.userId);
    const friendObjectId = new ObjectId(friendId);

    const user = await collection.findOne({ _id: userId });
    const friend = await collection.findOne({ _id: friendObjectId });

    if (!user || !friend) {
      return res.status(404).json({ message: "Gebruiker of vriend niet gevonden." });
    }

    // Voeg een verzoek toe bij de andere gebruiker
    await collection.updateOne(
      { _id: friendObjectId },
      { $addToSet: { familyRequests: userId } } // gebruiker stuurt verzoek
    );

    res.json({ message: "Familieverzoek verzonden." });
  } catch (err) {
    console.error("❌ Fout bij verzenden verzoek:", err);
    res.status(500).json({ message: "Verzoek verzenden mislukt." });
  }
});
router.post("/accept-family-request", authenticateToken, async (req, res) => {
  const { requesterId } = req.body;
  const db = getDB();
  const collection = db.collection("users");

  const userId = new ObjectId(req.user.userId);
  const requesterObjectId = new ObjectId(requesterId);

  try {
    // Voeg elkaar toe aan elkaars familieleden
    await collection.updateOne(
      { _id: userId },
      {
        $addToSet: { familyMembers: requesterObjectId },
        $pull: { familyRequests: requesterObjectId },
      }
    );

    await collection.updateOne({ _id: requesterObjectId }, { $addToSet: { familyMembers: userId } });

    res.json({ message: "Familieverzoek geaccepteerd." });
  } catch (err) {
    console.error("❌ Fout bij accepteren verzoek:", err);
    res.status(500).json({ message: "Kon verzoek niet accepteren." });
  }
});
router.get("/family-requests", authenticateToken, async (req, res) => {
  const db = getDB();
  const collection = db.collection("users");
  const userId = new ObjectId(req.user.userId);

  try {
    const user = await collection.findOne({ _id: userId });

    if (!user || !user.familyRequests || user.familyRequests.length === 0) {
      return res.json([]); // geen verzoeken
    }

    const requests = await collection
      .find({ _id: { $in: user.familyRequests } })
      .project({ _id: 1, screenName: 1 })
      .toArray();

    res.json(requests);
  } catch (err) {
    console.error("❌ Fout bij ophalen verzoeken:", err);
    res.status(500).json({ message: "Ophalen mislukt." });
  }
});
router.get("/friends", authenticateToken, async (req, res) => {
  const db = getDB();
  const collection = db.collection("users");
  const userId = new ObjectId(req.user.userId);

  try {
    const user = await collection.findOne({ _id: userId });

    if (!user || !user.familyMembers || user.familyMembers.length === 0) {
      return res.json([]); // Geen familieleden
    }

    const friends = await collection
      .find({ _id: { $in: user.familyMembers } })
      .project({ _id: 1, screenName: 1 })
      .toArray();

    res.json(friends);
  } catch (err) {
    console.error("❌ Fout bij ophalen familieleden:", err);
    res.status(500).json({ message: "Ophalen familieleden mislukt." });
  }
});
router.delete("/remove-friend", authenticateToken, async (req, res) => {
  const db = getDB();
  const collection = db.collection("users");

  try {
    const userId = new ObjectId(req.user.userId);
    const { friendId } = req.body;
    const friendObjectId = new ObjectId(friendId);

    // Verwijder vriend bij gebruiker
    await collection.updateOne({ _id: userId }, { $pull: { familyMembers: friendObjectId } });

    // Verwijder gebruiker bij vriend
    await collection.updateOne({ _id: friendObjectId }, { $pull: { familyMembers: userId } });

    res.json({ message: "Familielid verwijderd." });
  } catch (err) {
    console.error("❌ Fout bij verwijderen familielid:", err);
    res.status(500).json({ message: "Verwijderen mislukt." });
  }
});

module.exports = router;

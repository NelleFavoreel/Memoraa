const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const authenticateToken = require("../middleware/auth");
const jwt = require("jsonwebtoken");

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
        _id: { $ne: user._id },
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
  const notifications = db.collection("notifications");

  try {
    const userId = new ObjectId(req.user.userId);
    const friendObjectId = new ObjectId(friendId);

    const user = await collection.findOne({ _id: userId });
    const friend = await collection.findOne({ _id: friendObjectId });

    if (!user || !friend) {
      return res.status(404).json({ message: "Gebruiker of vriend niet gevonden." });
    }
    if (friend.familyRequests?.includes(userId) || friend.familyMembers?.includes(userId)) {
      return res.status(400).json({ message: "Je hebt al een verzoek gestuurd of bent al verbonden." });
    }

    await collection.updateOne({ _id: friendObjectId }, { $addToSet: { familyRequests: userId } });
    await notifications.insertOne({
      userId: friendObjectId,
      type: "familyRequest",
      sender: userId,
      date: new Date(),
      read: false,
    });

    res.json({ message: "Familieverzoek verzonden." });
  } catch (err) {
    console.error("❌ Fout bij verzenden verzoek:", err);
    res.status(500).json({ message: "Verzoek verzenden mislukt." });
  }
});
router.put("/accept-family-request", authenticateToken, async (req, res) => {
  const db = getDB();
  const usersCollection = db.collection("users");
  const notificationsCollection = db.collection("notifications");
  const userId = new ObjectId(req.user.userId);
  const { requestSenderId } = req.body;

  const requesterId = new ObjectId(requestSenderId);

  try {
    // Voeg elkaar toe aan elkaars familieleden
    await usersCollection.updateOne(
      { _id: userId },
      {
        $addToSet: { familyMembers: requesterId },
        $pull: { familyRequests: requesterId },
      }
    );

    await usersCollection.updateOne(
      { _id: requesterId },
      {
        $addToSet: { familyMembers: userId },
      }
    );

    // ✅ Notificatie naar verzoeker
    await notificationsCollection.insertOne({
      recipients: [requesterId],
      type: "familyRequestAccepted",
      sender: userId,
      date: new Date(),
      readBy: [],
    });

    // ✅ Notificatie naar jezelf
    await notificationsCollection.insertOne({
      recipients: [userId],
      type: "familyRequestAccepted",
      sender: userId,
      date: new Date(),
      readBy: [],
    });

    res.status(200).json({ message: "Familieverzoek geaccepteerd en notificaties verzonden." });
  } catch (error) {
    console.error("❌ Fout bij accepteren familieverzoek:", error);
    res.status(500).json({ message: "Fout bij accepteren familieverzoek." });
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
// Voorbeeld route voor acceptatie familieverzoek (in bv routes/family.js)
router.post("/accept", authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const notificationsCollection = db.collection("notifications");

    const { requesterId } = req.body; // wie het verzoek stuurde
    const currentUserId = new ObjectId(req.user.userId);

    // Update familieleden van beide users (vereist)
    // Voeg hier je logica toe om familyMembers up te daten, bv:
    await usersCollection.updateOne({ _id: currentUserId }, { $addToSet: { familyMembers: new ObjectId(requesterId) } });
    await usersCollection.updateOne({ _id: new ObjectId(requesterId) }, { $addToSet: { familyMembers: currentUserId } });

    // Maak notificatie voor de oorspronkelijke verzoeker
    const notification = {
      userId: new ObjectId(requesterId), // die moet dit zien
      type: "familyAccepted",
      sender: currentUserId,
      date: new Date(),
      read: false,
    };

    await notificationsCollection.insertOne(notification);

    res.status(200).json({ message: "Familieverzoek geaccepteerd en notificatie verstuurd." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fout bij accepteren familieverzoek." });
  }
});
router.post("/reject-family-request", authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const { requesterId } = req.body;
    const currentUserId = new ObjectId(req.user.userId);
    const requesterObjectId = new ObjectId(requesterId);

    // Verwijder het verzoek van de array familyRequests van de huidige gebruiker
    await usersCollection.updateOne({ _id: currentUserId }, { $pull: { familyRequests: requesterObjectId } });

    res.status(200).json({ message: "Familieverzoek geweigerd." });
  } catch (err) {
    console.error("❌ Fout bij weigeren familieverzoek:", err);
    res.status(500).json({ message: "Fout bij weigeren familieverzoek." });
  }
});

module.exports = router;

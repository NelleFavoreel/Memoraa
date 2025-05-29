const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const { ObjectId } = require("mongodb");
const authenticateToken = require("../middleware/auth");

// Notificatie aanmaken
router.post("/", authenticateToken, async (req, res) => {
  const db = getDB();
  const notificationsCollection = db.collection("notifications");

  const { friendId } = req.body;
  const userId = new ObjectId(req.user.userId);

  if (!friendId || !ObjectId.isValid(friendId)) {
    return res.status(400).json({ message: "Ongeldige friendId." });
  }

  try {
    await notificationsCollection.insertOne({
      userId: new ObjectId(friendId), // Voeg dit toe
      recipients: [new ObjectId(friendId)],
      type: "familyRequest",
      sender: userId,
      date: new Date(),
      readBy: [],
    });

    res.status(201).json({ message: "Notificatie aangemaakt." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kon notificatie niet aanmaken." });
  }
});

// Notificaties ophalen voor ingelogde gebruiker
router.get("/", authenticateToken, async (req, res) => {
  const db = getDB();
  const usersCollection = db.collection("users");
  const notificationsCollection = db.collection("notifications");

  try {
    // Zoek notificaties waarbij de ingelogde gebruiker in recipients zit
    const notifications = await notificationsCollection
      .find({
        $or: [{ userId: new ObjectId(req.user.userId) }, { recipients: new ObjectId(req.user.userId) }],
      })

      .sort({ date: -1 })
      .toArray();

    // Verrijk notificaties met afzender naam etc.
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        const sender = await usersCollection.findOne({ _id: notif.sender });
        return {
          _id: notif._id.toString(),
          type: notif.type,
          sender: notif.sender.toString(),
          senderName: sender ? sender.name : "Onbekende gebruiker",
          tripId: notif.tripId ? notif.tripId.toString() : null,
          date: notif.date,
          readBy: notif.readBy || [],
          userId: notif.userId ? notif.userId.toString() : null, // hier toevoegen
          recipients: notif.recipients ? notif.recipients.map((r) => r.toString()) : [], // zodat frontend het ook heeft
        };
      })
    );

    res.json(enrichedNotifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kon notificaties niet ophalen." });
  }
});

// Ongelezen notificaties tellen
router.get("/unread-count", authenticateToken, async (req, res) => {
  const db = getDB();
  const notificationsCollection = db.collection("notifications");

  try {
    const count = await notificationsCollection.countDocuments({
      recipients: new ObjectId(req.user.userId),
      readBy: { $ne: new ObjectId(req.user.userId) }, // gebruiker heeft notificatie nog niet gelezen
    });

    res.json({ unreadCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kon ongelezen notificaties niet tellen." });
  }
});

module.exports = router;

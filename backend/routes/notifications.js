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
      userId: new ObjectId(friendId),
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
    const notifications = await notificationsCollection
      .find({
        $or: [{ userId: new ObjectId(req.user.userId) }, { recipients: new ObjectId(req.user.userId) }],
      })

      .sort({ date: -1 })
      .toArray();

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
          userId: notif.userId ? notif.userId.toString() : null,
          recipients: notif.recipients ? notif.recipients.map((r) => r.toString()) : [],
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
  const userId = new ObjectId(req.user.userId);
  try {
    const count = await notificationsCollection.countDocuments({
      recipients: userId,
      readBy: { $ne: userId },
    });

    res.json({ unreadCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kon ongelezen notificaties niet tellen." });
  }
});

// Markeer notificatie(s) als gelezen
router.put("/mark-as-read", authenticateToken, async (req, res) => {
  const db = getDB();
  const notificationsCollection = db.collection("notifications");

  const userId = new ObjectId(req.user.userId);
  const { notificationIds } = req.body;

  if (!Array.isArray(notificationIds) || notificationIds.some((id) => !ObjectId.isValid(id))) {
    return res.status(400).json({ message: "Ongeldige notificatie-ID(s)." });
  }

  try {
    const result = await notificationsCollection.updateMany({ _id: { $in: notificationIds.map((id) => new ObjectId(id)) } }, { $addToSet: { readBy: userId } });

    res.json({ message: "Notificaties gemarkeerd als gelezen.", modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kon notificaties niet bijwerken." });
  }
});

module.exports = router;

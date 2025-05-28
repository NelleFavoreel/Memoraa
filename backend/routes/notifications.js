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
  const userId = req.user.userId;

  if (!friendId || !ObjectId.isValid(friendId)) {
    return res.status(400).json({ message: "Ongeldige friendId." });
  }

  try {
    await notificationsCollection.insertOne({
      userId: new ObjectId(friendId),
      type: "familyRequest",
      sender: new ObjectId(userId),
      date: new Date(),
      read: false,
    });

    res.status(201).json({ message: "Notificatie aangemaakt." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kon notificatie niet aanmaken." });
  }
});

// Notificaties ophalen
router.get("/", authenticateToken, async (req, res) => {
  const db = getDB();
  const usersCollection = db.collection("users");
  const notificationsCollection = db.collection("notifications");

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });

    const idsToSearch = [new ObjectId(req.user.userId)];
    if (user && user.friends && Array.isArray(user.friends)) {
      user.friends.forEach((friendId) => {
        if (ObjectId.isValid(friendId)) {
          idsToSearch.push(new ObjectId(friendId));
        }
      });
    }

    const notifications = await notificationsCollection
      .find({ userId: { $in: idsToSearch } })
      .sort({ date: -1 })
      .toArray();

    const enrichedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        const sender = await usersCollection.findOne({ _id: notif.sender });
        return {
          _id: notif._id.toString(),
          userId: notif.userId.toString(),
          type: notif.type,
          sender: notif.sender.toString(),
          senderName: sender ? sender.name : "Onbekende gebruiker",
          tripId: notif.tripId ? notif.tripId.toString() : null,
          date: notif.date,
          read: notif.read,
        };
      })
    );

    res.json(enrichedNotifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kon notificaties niet ophalen." });
  }
});

router.get("/notifications/unread-count", authenticateToken, async (req, res) => {
  const db = getDB();
  const count = await db.collection("notifications").countDocuments({
    userId: new ObjectId(req.user.userId),
    read: false,
  });

  res.json({ unreadCount: count });
});

module.exports = router;

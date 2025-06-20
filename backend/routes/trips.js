// backend/routes/trips.js
const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const { ObjectId } = require("mongodb");
const authenticateToken = require("../middleware/auth");

// Alle reizen ophalen
router.get("/", authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const tripsCollection = db.collection("trips");
    const usersCollection = db.collection("users");

    const userId = new ObjectId(req.user.userId);
    const user = await usersCollection.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "Gebruiker niet gevonden." });
    }

    const familyMemberIds = (user.familyMembers || []).filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));

    const trips = await tripsCollection
      .find({
        $or: [{ familyId: user.familyId }, { travelers: userId }, { travelers: { $in: familyMemberIds } }],
      })
      .toArray();

    const tripDaysCollection = db.collection("tripDays");

    const tripsWithPhotos = await Promise.all(
      trips.map(async (trip) => {
        const tripDays = await tripDaysCollection.find({ tripId: trip._id }).toArray();
        const allPhotos = tripDays.flatMap((day) => day.photos || []);
        const shuffled = allPhotos.sort(() => 0.5 - Math.random());
        const randomPhotos = shuffled.slice(0, 2);
        return { ...trip, randomPhotos };
      })
    );
    res.json(tripsWithPhotos);
  } catch (err) {
    console.error("❌ Fout bij ophalen van trips:", err);
    res.status(500).send("Fout bij ophalen van reizen.");
  }
});
// Reis verwijderen
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("trips");
    const tripDaysCollection = db.collection("tripDays");
    const notificationsCollection = db.collection("notifications");
    const usersCollection = db.collection("users");

    const tripId = req.params.id;
    const currentUserId = new ObjectId(req.user.userId);

    const trip = await collection.findOne({ _id: new ObjectId(tripId) });
    if (!trip) return res.status(404).send("Reis niet gevonden.");

    const result = await collection.deleteOne({ _id: new ObjectId(tripId) });

    if (result.deletedCount === 1) {
      await tripDaysCollection.deleteMany({ tripId: new ObjectId(tripId) });
      const recipients = trip.travelers.filter((id) => !id.equals(currentUserId));
      const notification = {
        recipients: recipients,
        type: "tripDeleted",
        sender: currentUserId,
        tripId: new ObjectId(tripId),
        tripPlace: trip.place,
        date: new Date(),
        readBy: [],
      };
      await notificationsCollection.insertOne(notification);
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
    const usersCollection = db.collection("users");
    const notificationsCollection = db.collection("notifications");

    const { tripType, place, country, countries, imageUrl, startDate, endDate, screenNames, familyId, userId, selectedFriend = [] } = req.body;

    if (!tripType || !startDate || !endDate || !familyId || !userId) {
      return res.status(400).json({ message: "Fout: Alle verplichte velden moeten ingevuld zijn." });
    }

    if (tripType === "staytrip") {
      if (!place || !country) {
        return res.status(400).json({ message: "Plaats en land zijn verplicht voor staytrip." });
      }
    } else if (tripType === "citytrip") {
      if (!place) {
        return res.status(400).json({ message: "Plaats is verplicht voor citytrip." });
      }
    } else if (tripType === "roadtrip") {
      if (!Array.isArray(countries) || countries.length === 0 || countries.every((c) => !c.trim())) {
        return res.status(400).json({ message: "Minstens één land is verplicht voor roadtrip." });
      }
    } else {
      return res.status(400).json({ message: "Ongeldig tripType." });
    }

    const users = await usersCollection.find({ screenName: { $in: screenNames || [] } }).toArray();
    const travelerIds = users.map((user) => user._id);

    const selectedFriendObjectIds = selectedFriend.map((friendId) => new ObjectId(friendId));
    travelerIds.push(...selectedFriendObjectIds);

    const currentUserObjectId = new ObjectId(userId);

    if (!travelerIds.some((id) => id.equals(currentUserObjectId))) {
      travelerIds.push(currentUserObjectId);
    }

    const newTrip = {
      tripType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      travelers: travelerIds,
      familyId,
      imageUrl,
    };

    if (tripType === "staytrip") {
      newTrip.place = place;
      newTrip.country = country;
    } else if (tripType === "citytrip") {
      newTrip.place = place;
      newTrip.country = "";
    } else if (tripType === "roadtrip") {
      newTrip.countries = countries.filter((c) => c.trim() !== "");
      newTrip.place = "";
      newTrip.country = "";
    }

    const result = await collection.insertOne(newTrip);

    const currentUser = await usersCollection.findOne({ _id: currentUserObjectId });
    const familyMemberIds = (currentUser.familyMembers || []).filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));

    const recipientsSet = new Set(travelerIds.map((id) => id.toString()));

    familyMemberIds.forEach((fmId) => {
      if (!recipientsSet.has(fmId.toString()) && !fmId.equals(currentUserObjectId)) {
        recipientsSet.add(fmId.toString());
      }
    });

    const finalRecipients = Array.from(recipientsSet)
      .map((idStr) => new ObjectId(idStr))
      .filter((id) => !id.equals(currentUserObjectId));

    if (finalRecipients.length > 0) {
      const notification = {
        recipients: finalRecipients,
        type: "tripAdded",
        sender: currentUserObjectId,
        tripId: result.insertedId,
        date: new Date(),
        readBy: [],
      };

      await notificationsCollection.insertOne(notification);
    }

    res.status(201).json({ message: "Reis succesvol toegevoegd.", tripId: result.insertedId });
  } catch (err) {
    console.error("❌ Fout bij toevoegen van reis:", err);
    res.status(500).json({ message: "Fout bij het toevoegen van reis." });
  }
});
// Reis detailpagina met bijbehorende dagen ophalen
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const tripsCollection = db.collection("trips");
    const tripDaysCollection = db.collection("tripDays");

    const tripObjectId = new ObjectId(id);

    const trip = await tripsCollection.findOne({ _id: tripObjectId });

    if (!trip) {
      return res.status(404).json({ message: "Reis niet gevonden" });
    }

    let tripDays = await tripDaysCollection.find({ tripId: tripObjectId }).toArray();

    if (!tripDays.length) {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const newTripDays = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        newTripDays.push({
          tripId: tripObjectId,
          date: new Date(d),
          description: "",
          activities: [],
          photos: [],
        });
      }

      if (newTripDays.length > 0) {
        await tripDaysCollection.insertMany(newTripDays);
        tripDays = newTripDays;
      }
    }

    res.json({
      trip,
      tripDays,
    });
  } catch (err) {
    console.error("❌ Fout bij ophalen van reis detail:", err);
    res.status(500).json({ message: "Fout bij ophalen van reis details." });
  }
});
// Reis bewerken
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { place, country, startDate, endDate, travelers, familyId, imageUrl, tripDays } = req.body;

    if (!place && !country && !startDate && !endDate && !familyId && !travelers && !imageUrl && !tripDays) {
      return res.status(400).json({ message: "Geen wijzigingen gevonden." });
    }

    const db = getDB();
    const tripsCollection = db.collection("trips");
    const usersCollection = db.collection("users");
    const notificationsCollection = db.collection("notifications");
    const tripObjectId = new ObjectId(id);

    const trip = await tripsCollection.findOne({ _id: tripObjectId });
    if (!trip) {
      return res.status(404).json({ message: "Reis niet gevonden." });
    }

    const travelerObjectIds = travelers ? travelers.map((id) => new ObjectId(id)) : trip.travelers;

    const updatedTrip = {
      place: place || trip.place,
      country: country || trip.country,
      startDate: startDate ? new Date(startDate) : trip.startDate,
      endDate: endDate ? new Date(endDate) : trip.endDate,
      travelers: travelerObjectIds,
      familyId: familyId || trip.familyId,
      imageUrl: imageUrl || trip.imageUrl,
    };

    const result = await tripsCollection.updateOne({ _id: tripObjectId }, { $set: updatedTrip });

    if (tripDays) {
      const tripDaysCollection = db.collection("tripDays");
      await tripDaysCollection.deleteMany({ tripId: tripObjectId });

      const tripDaysInsert = tripDays.map((day) => ({
        ...day,
        tripId: tripObjectId,
      }));
      await tripDaysCollection.insertMany(tripDaysInsert);
    }

    const currentUserId = new ObjectId(req.user.userId);
    const currentUser = await usersCollection.findOne({ _id: currentUserId });
    const familyMemberIds = (currentUser.familyMembers || []).filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));

    const recipientSet = new Set(travelerObjectIds.map((id) => id.toString()));

    familyMemberIds.forEach((fmId) => {
      if (!recipientSet.has(fmId.toString()) && !fmId.equals(currentUserId)) {
        recipientSet.add(fmId.toString());
      }
    });

    const finalRecipients = Array.from(recipientSet)
      .map((idStr) => new ObjectId(idStr))
      .filter((id) => !id.equals(currentUserId));

    if (finalRecipients.length > 0) {
      const notification = {
        recipients: finalRecipients,
        type: "tripUpdated",
        sender: currentUserId,
        tripId: tripObjectId,
        tripPlace: updatedTrip.place || trip.place,
        date: new Date(),
        readBy: [],
      };
      await notificationsCollection.insertOne(notification);
    }

    res.status(200).json({ message: "Reis succesvol bijgewerkt." });
  } catch (err) {
    console.error("❌ Fout bij het bijwerken van reis:", err);
    res.status(500).json({ message: "Fout bij het bijwerken van reis." });
  }
});
// Voeg een foto's toe aan een reis
router.post("/:id/photos", authenticateToken, async (req, res) => {
  try {
    const tripId = new ObjectId(req.params.id);
    const { imageUrl, imageBase64, description } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "ImageUrl is verplicht." });
    }

    const db = getDB();
    const tripsCollection = db.collection("trips");

    if (!imageBase64 && !imageUrl) {
      return res.status(400).json({ message: "Base64 is verplicht." });
    }

    const result = await tripsCollection.updateOne(
      { _id: tripId },
      {
        $push: {
          photos: {
            imageUrl,
            description: description || "",
            addedAt: new Date(),
          },
        },
      }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Foto succesvol toegevoegd." });
    } else {
      res.status(404).json({ message: "Reis niet gevonden." });
    }
  } catch (error) {
    console.error("Fout bij toevoegen foto:", error);
    res.status(500).json({ message: "Fout bij toevoegen foto." });
  }
});

module.exports = router;

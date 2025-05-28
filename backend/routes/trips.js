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

    // ✅ Alleen deze mag overblijven
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
      const notifications = trip.travelers
        .filter((id) => !id.equals(currentUserId))
        .map((travelerId) => ({
          userId: travelerId,
          type: "tripDeleted",
          sender: currentUserId,
          tripId: new ObjectId(tripId),
          date: new Date(),
          read: false,
        }));

      if (notifications.length > 0) {
        await notificationsCollection.insertMany(notifications);
      }
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

    // Basisvalidatie
    if (!tripType || !startDate || !endDate || !familyId || !userId) {
      return res.status(400).json({ message: "Fout: Alle verplichte velden moeten ingevuld zijn." });
    }

    // Validatie per tripType
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

    // Haal gebruikers op basis van screenNames
    const users = await usersCollection.find({ screenName: { $in: screenNames || [] } }).toArray();
    const travelerIds = users.map((user) => user._id);

    const selectedFriendObjectIds = selectedFriend.map((friendId) => new ObjectId(friendId));
    travelerIds.push(...selectedFriendObjectIds);

    const currentUserObjectId = new ObjectId(userId);

    if (!travelerIds.some((id) => id.equals(currentUserObjectId))) {
      travelerIds.push(currentUserObjectId);
    }

    // Maak nieuw trip object aan
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

    const notificationInserts = travelerIds
      .filter((id) => !id.equals(currentUserObjectId))
      .map((id) => ({
        userId: id,
        type: "tripAdded",
        sender: currentUserObjectId,
        tripId: result.insertedId,
        date: new Date(),
        read: false,
      }));

    if (notificationInserts.length > 0) {
      await notificationsCollection.insertMany(notificationInserts);
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

    // Als er geen tripDays bestaan: automatisch aanmaken
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

// Reis bewerken (PUT)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { place, country, startDate, endDate, travelers, familyId, imageUrl, tripDays } = req.body;

    // Valideer of alle benodigde velden aanwezig zijn
    if (!place && !country && !startDate && !endDate && !familyId && !travelers && !imageUrl && !tripDays) {
      return res.status(400).json({ message: "Geen wijzigingen gevonden." });
    }

    const db = getDB();
    const tripsCollection = db.collection("trips");
    const notificationsCollection = db.collection("notifications");
    const currentUserId = new ObjectId(req.user.userId);
    const tripObjectId = new ObjectId(id);

    // Zoek de reis op
    const trip = await tripsCollection.findOne({ _id: tripObjectId });

    if (!trip) {
      return res.status(404).json({ message: "Reis niet gevonden." });
    }

    // Update de reisgegevens
    const travelerObjectIds = travelers ? travelers.map((id) => new ObjectId(id)) : null;

    const updatedTrip = {
      place: place || trip.place,
      country: country || trip.country,
      startDate: startDate ? new Date(startDate) : trip.startDate,
      endDate: endDate ? new Date(endDate) : trip.endDate,
      travelers: travelerObjectIds || trip.travelers,
      familyId: familyId || trip.familyId,
      imageUrl: imageUrl || trip.imageUrl,
    };

    const result = await tripsCollection.updateOne({ _id: tripObjectId }, { $set: updatedTrip });

    // Werk de tripDays bij
    if (tripDays) {
      const tripDaysCollection = db.collection("tripDays");
      // Verwijder oude tripdagen van de reis
      await tripDaysCollection.deleteMany({ tripId: tripObjectId });

      // Voeg de nieuwe tripdagen toe
      const tripDaysInsert = tripDays.map((day) => ({
        ...day,
        tripId: tripObjectId, // Zorg ervoor dat tripId correct wordt gekoppeld
      }));
      await tripDaysCollection.insertMany(tripDaysInsert);
    }

    const notifications = travelers
      .filter((id) => !id.equals(currentUserId))
      .map((travelerId) => ({
        userId: travelerId,
        type: "tripUpdated",
        sender: currentUserId,
        tripId: tripObjectId,
        date: new Date(),
        read: false,
      }));

    if (notifications.length > 0) {
      await notificationsCollection.insertMany(notifications);
    }
    res.status(200).json({ message: "Reis succesvol bijgewerkt." });
  } catch (err) {
    console.error("❌ Fout bij het bijwerken van reis:", err);
    res.status(500).json({ message: "Fout bij het bijwerken van reis." });
  }
});

module.exports = router;

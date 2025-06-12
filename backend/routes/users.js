// backend/routes/users.js
const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const authenticateToken = require("../middleware/auth");
const jwt = require("jsonwebtoken");

// Gebruiker ophalen op basis van userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDB();
    const collection = db.collection("users");

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Ongeldig gebruikers-ID formaat" });
    }

    const user = await collection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "Gebruiker niet gevonden" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Fout bij ophalen van gebruiker:", err);
    res.status(500).json({ message: "Fout bij ophalen van gebruiker." });
  }
});
//Krijg profiel van gebruiker op basis van userId
router.get("/profile", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Geen gebruikers-ID opgegeven" });
  }

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Ongeldig gebruikers-ID formaat" });
  }

  try {
    const db = getDB();
    const collection = db.collection("users");

    const user = await collection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "Gebruiker niet gevonden" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Fout bij ophalen van gebruiker:", err);
    res.status(500).json({ message: "Fout bij ophalen van gebruiker." });
  }
});
// Registratie van een nieuwe gebruiker
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, familyId } = req.body;
    const db = getDB();
    const collection = db.collection("users");

    const emailExists = await collection.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Er bestaat al een account met dit e-mailadres." });
    }

    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ");

    const duplicateFirstName = await collection.findOne({
      screenName: firstName,
      familyId,
    });

    const screenName = duplicateFirstName && lastName ? `${firstName} ${lastName}` : firstName;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      passwordHash,
      familyId,
      screenName,
      familyMembers: [screenName],
    };

    const result = await collection.insertOne(newUser);

    res.status(201).json({ message: "Gebruiker succesvol geregistreerd", userId: result.insertedId });
  } catch (err) {
    console.error("❌ Fout bij registratie:", err);
    res.status(500).json({ message: "Fout bij registratie." });
  }
});
// Inloggen van een gebruiker
router.post("/login", async (req, res) => {
  console.log("Inlogverzoek ontvangen");
  try {
    const { email, password } = req.body;
    const db = getDB();
    const collection = db.collection("users");
    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Gebruiker niet gevonden" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: "Ongeldig wachtwoord" });
    }

    // JWT token genereren
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Inloggen succesvol",
      userId: user._id,
      name: user.name,
      screenName: user.screenName,
      token,
    });
  } catch (err) {
    console.error("❌ Fout bij inloggen:", err);
    res.status(500).send("Fout bij inloggen.");
  }
});
// Controleer of e-mailadres of voornaam al bestaat
router.get("/check", async (req, res) => {
  const { email, firstName, familyId } = req.query;

  try {
    const db = getDB();
    const collection = db.collection("users");

    const emailExists = await collection.findOne({ email });
    const firstNameExists = await collection.findOne({
      screenName: firstName,
      familyId,
    });

    res.json({
      emailExists: !!emailExists,
      firstNameExists: !!firstNameExists,
    });
  } catch (err) {
    console.error("❌ Fout bij check route:", err);
    res.status(500).json({ message: "Fout bij controle." });
  }
});
// Wijzig wachtwoord van ingelogde gebruiker
router.post("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Vul alle velden in." });
  }

  try {
    const db = getDB();
    const collection = db.collection("users");

    const user = await collection.findOne({ _id: new ObjectId(req.user.userId) });

    if (!user) {
      return res.status(404).json({ message: "Gebruiker niet gevonden." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Huidig wachtwoord is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await collection.updateOne({ _id: new ObjectId(req.user.userId) }, { $set: { passwordHash: newPasswordHash } });

    res.json({ message: "Wachtwoord succesvol gewijzigd." });
  } catch (err) {
    console.error("❌ Fout bij wachtwoord wijzigen:", err);
    res.status(500).json({ message: "Fout bij wachtwoord wijzigen." });
  }
});

module.exports = router;

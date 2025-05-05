// db.js
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://nellefavoreel:eKVVoazRlRrQYtxL@web2.gaz0k0d.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("Memoraa");
    console.log("✅ Verbonden met MongoDB");
  } catch (err) {
    console.error("❌ MongoDB verbinding mislukt:", err);
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database is nog niet verbonden.");
  }
  return db;
}

module.exports = { connectDB, getDB };

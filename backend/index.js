// backend/index.js
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const tripsRoutes = require("./routes/trips");
app.use("/trips", tripsRoutes);

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

const userRoutes = require("./routes/family");
app.use("/family", userRoutes);

// MongoDB connectie opstarten en daarna server starten
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server draait op http://localhost:${port}`);
  });
});

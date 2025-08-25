import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Fixture from "./models/Fixtures.js";

import { scrapeAndSaveEPLFixtures } from "./Scrapers/eplScraper.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

// Home route
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to Sports Fixtures API</h1>
    <p><a href="/api/epl">Click here to view EPL Fixtures</a></p>
  `);
});

// EPL Fixtures route
app.get("/api/epl", async (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Check DB for cached fixtures
    let fixtures = await Fixture.find({
      league: "EPL",
      updatedAt: { $gt: oneDayAgo },
    });

    if (fixtures.length === 0) {
      // Scrape & save if no cached data
      fixtures = await scrapeAndSaveEPLFixtures();
    }

    res.json({ fixtures });
  } catch (error) {
    console.error("Error fetching EPL fixtures:", error.message);
    res.status(500).json({ error: "Failed to fetch EPL fixtures" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

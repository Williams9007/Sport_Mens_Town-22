import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Fixture from "./models/Fixtures.js";
import { scrapeAndSaveEPLFixtures } from "./Scrapers/eplScraper.js";
import { scrapeAndSaveLaLigaFixtures } from "./Scrapers/laLigaScraper.js";
import { scrapeAndSaveLigue1Fixtures } from "./Scrapers/ligue1Scraper.js";
import { scrapeAndSaveSerieAFixtures } from "./Scrapers/serieAScraper.js";
import { scrapeAndSaveBundesligaFixtures } from "./Scrapers/bundesligaScraper.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS so frontend can fetch data
app.use(cors());

// MongoDB connection
await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("MongoDB connected");

// Home route
app.get("/", (req, res) => {
  res.send(`
    <h1>Sports Fixtures API</h1>
    <p>Access EPL: <a href="/api/epl">/api/epl</a></p>
    <p>Access La Liga: <a href="/api/laliga">/api/laliga</a></p>
    <p>Access Ligue 1: <a href="/api/ligue1">/api/ligue1</a></p>
    <p>Access Serie A: <a href="/api/seriea">/api/seriea</a></p>
    <p>Access Bundesliga: <a href="/api/bundesliga">/api/bundesliga</a></p>
  `);
});

// Generic handler to fetch fixtures
async function getFixtures(league, scraperFn) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let fixtures = await Fixture.find({
    league,
    updatedAt: { $gt: oneDayAgo },
  });
  if (!fixtures.length) {
    fixtures = await scraperFn();
  }
  return fixtures;
}

// Routes for each league
app.get("/api/epl", async (req, res) => {
  try {
    const fixtures = await getFixtures("EPL", scrapeAndSaveEPLFixtures);
    res.json({ fixtures });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch EPL fixtures" });
  }
});

app.get("/api/laliga", async (req, res) => {
  try {
    const fixtures = await getFixtures("La Liga", scrapeAndSaveLaLigaFixtures);
    res.json({ fixtures });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch La Liga fixtures" });
  }
});

app.get("/api/ligue1", async (req, res) => {
  try {
    const fixtures = await getFixtures("Ligue 1", scrapeAndSaveLigue1Fixtures);
    res.json({ fixtures });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch Ligue 1 fixtures" });
  }
});

app.get("/api/seriea", async (req, res) => {
  try {
    const fixtures = await getFixtures("Serie A", scrapeAndSaveSerieAFixtures);
    res.json({ fixtures });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch Serie A fixtures" });
  }
});

app.get("/api/bundesliga", async (req, res) => {
  try {
    const fixtures = await getFixtures("Bundesliga", scrapeAndSaveBundesligaFixtures);
    res.json({ fixtures });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch Bundesliga fixtures" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

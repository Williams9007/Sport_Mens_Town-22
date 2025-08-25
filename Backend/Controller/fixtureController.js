import { scrapeAndSaveEPLFixtures } from "../Scrapers/eplScraper.js";
import Fixture from "../models/Fixture.js";

export async function getEPLFixtures(req, res) {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Check DB for cached data
    let fixtures = await Fixture.find({ league: "EPL", updatedAt: { $gt: oneWeekAgo } });

    if (!fixtures.length) {
      // Scrape and save to DB if no cache
      fixtures = await scrapeAndSaveEPLFixtures();
    }

    res.json({ fixtures });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch EPL fixtures" });
  }
}

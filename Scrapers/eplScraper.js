import axios from "axios";
import * as cheerio from "cheerio";
import Fixture from "../models/Fixtures.js";

const EPL_URL = "https://www.theguardian.com/football/premierleague/fixtures";

export async function scrapeAndSaveEPLFixtures() {
  try {
    const { data } = await axios.get(EPL_URL);
    const $ = cheerio.load(data);

    const fixtures = [];

    $(".dcr-jjtqpb").each((i, element) => {
      const date = $(element).find("h2").first().text().trim();

      $(element).find("ul li").each((j, matchEl) => {
        const home = $(matchEl).find("div span").first().text().trim();
        const away = $(matchEl).find("div:last-child").text().trim();
        const time = $(matchEl).find("time").attr("datetime");

        // Extracting the crest URLs
        const homeCrest = $(matchEl).find(".dcr-1rdax43 img").first().attr("src");
        const awayCrest = $(matchEl).find(".dcr-1rdax43 img").last().attr("src");

        if (home && away) {
          fixtures.push({
            league: "EPL",
            date,
            home,
            away,
            time,
            homeCrest: homeCrest ? `https:${homeCrest}` : null,
            awayCrest: awayCrest ? `https:${awayCrest}` : null,
          });
        }
      });
    });

    if (fixtures.length) {
      console.log("Fixtures ready to save:", fixtures.length);

      // Remove old EPL fixtures first
      await Fixture.deleteMany({ league: "EPL" });

      // Save new fixtures to MongoDB
      const saved = await Fixture.insertMany(fixtures);
      console.log(`✅ Saved ${saved.length} EPL fixtures to MongoDB`);
      return saved;
    } else {
      console.log("⚠️ No fixtures found for EPL");
      return [];
    }
  } catch (error) {
    console.error("❌ Error scraping EPL fixtures:", error.message);
    return [];
  }
}

import axios from "axios";
import * as cheerio from "cheerio";
import Fixture from "../models/Fixtures.js";

const LALIGA_URL = "https://www.theguardian.com/football/laligafootball/fixtures";

export async function scrapeAndSaveLaLigaFixtures() {
  try {
    const { data } = await axios.get(LALIGA_URL);
    const $ = cheerio.load(data);

    const fixtures = [];

    $("ul.dcr-1rqutn2 li.dcr-1vtelzf").each((_, el) => {
      const time = $(el).find("time").text().trim();
      const dateReadable = $(el).find("time").text().trim(); // human-readable date

      const home = $(el).find("div.dcr-3l4pru span.dcr-iqim6o").text().trim();
      const homeCrest = $(el).find("div.dcr-3l4pru img").attr("src");

      // Extract away team text reliably
      const awayDiv = $(el).find("div.dcr-rm7qtf");
      let away = "";
      awayDiv.contents().each(function () {
        if (this.type === "text") {
          away += $(this).text().trim();
        }
      });
      away = away.trim();
      const awayCrest = awayDiv.find("img").attr("src");

      if (home && away) {
        fixtures.push({
          league: "La Liga",
          date: dateReadable,
          time,
          home,
          homeCrest,
          away,
          awayCrest,
        });
      }
    });

    if (fixtures.length) {
      console.log("Fixtures ready to save:", fixtures);

      // Remove old La Liga fixtures
      await Fixture.deleteMany({ league: "La Liga" });

      // Save new fixtures
      const saved = await Fixture.insertMany(fixtures);
      console.log(`✅ Saved ${saved.length} La Liga fixtures to MongoDB`);
      return saved;
    } else {
      console.log("⚠️ No fixtures found for La Liga");
      return [];
    }
  } catch (error) {
    console.error("❌ Error scraping La Liga fixtures:", error.message);
    return [];
  }
}

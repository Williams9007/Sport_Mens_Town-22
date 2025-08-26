import axios from "axios";
import * as cheerio from "cheerio";
import Fixture from "../models/Fixtures.js";

const SERIEA_URL = "https://www.theguardian.com/football/serieafootball/fixtures"; // Update to correct Serie A URL

export async function scrapeAndSaveSerieAFixtures() {
  try {
    const { data } = await axios.get(SERIEA_URL);
    const $ = cheerio.load(data);

    const fixtures = [];

    $("ul.dcr-1rqutn2 li.dcr-1vtelzf").each((_, el) => {
      const time = $(el).find("time").text().trim();
      const dateReadable = $(el).find("time").text().trim(); // human-readable date

      // Home team
      const home = $(el).find("div.dcr-3l4pru span.dcr-iqim6o").text().trim();
      const homeCrest = $(el).find("div.dcr-3l4pru img").attr("src");

      // Away team
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
          league: "Serie A",
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

      // Remove old Serie A fixtures
      await Fixture.deleteMany({ league: "Serie A" });

      // Save new fixtures
      const saved = await Fixture.insertMany(fixtures);
      console.log(`✅ Saved ${saved.length} Serie A fixtures to MongoDB`);
      return saved;
    } else {
      console.log("⚠️ No fixtures found for Serie A");
      return [];
    }
  } catch (error) {
    console.error("❌ Error scraping Serie A fixtures:", error.message);
    return [];
  }
}

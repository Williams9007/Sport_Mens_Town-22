import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

async function scrapeData() {
  const url = "https://example.com"; // change this to your source
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  let results = [];
  $("h2").each((i, el) => {
    results.push($(el).text().trim());
  });

  fs.writeFileSync("data.json", JSON.stringify(results, null, 2));
  console.log("✅ Data scraped and saved to data.json");
}

scrapeData();

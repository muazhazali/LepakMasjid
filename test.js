import axios from "axios";
import * as cheerio from "cheerio";

async function scrape() {
  const url =
    "https://sedekah.je/mosque/masjid-sultan-salahuddin-abdul-aziz-shah";

  const res = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html",
    },
  });

  // HTML string
  const html = res.data;

  // Load into cheerio
  const $ = cheerio.load(html);

  // Same selector logic as DOMParser version
  const svg = $("button > div > svg").first();

  if (!svg.length) {
    console.log("❌ SVG not found");
    return;
  }

  // Optional: add classes
  svg.attr("class", "w-full h-full");

  console.log("✅ SVG found:");
  console.log($.html(svg));
}

scrape().catch(console.error);

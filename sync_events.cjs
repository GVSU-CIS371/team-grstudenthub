const admin = require("firebase-admin");
const axios = require("axios");
const xml2js = require("xml2js");
const serviceAccount = require("./serviceAccountKey.json");
const fs = require("fs");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const GVSU_FEED = "https://www.gvsu.edu/events/rss-feed.xml?type=all&days=180";
const GR_CITY_FEED =
  "https://www.experiencegr.com/events/rss/?start_date=2026-04-19&end_date=2026-10-19";
function parseIcsDate(icsDate) {
  if (!icsDate || typeof icsDate !== "string") return new Date().toISOString();
  try {
    const year = icsDate.substring(0, 4);
    const month = icsDate.substring(4, 6);
    const day = icsDate.substring(6, 8);
    const timePart = icsDate.includes("T") ? icsDate.split("T")[1] : "000000";
    const hour = timePart.substring(0, 2);
    const min = timePart.substring(2, 4);
    // Returns YYYY-MM-DDTHH:mm:00Z
    return `${year}-${month}-${day}T${hour}:${min}:00Z`;
  } catch (e) {
    return new Date().toISOString();
  }
}

function standardize(event) {
  let finalStart = event.start;
  if (event.source === "ExperienceGR") {
    finalStart = event.start.split("T")[0];
  }

  return {
    title: event.title || "Untitled Event",
    description: event.description || "No description available.",
    location: event.location || "Grand Rapids, MI",
    start: finalStart || new Date().toISOString(),
    link: event.link || "",
    image: event.image || "https://via.placeholder.com/400x200?text=GR+Event",
    source: event.source,
    category: event.category || "General",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

async function syncFeed(url, sourceName, categoryName) {
  console.log(`🔄 Fetching ${sourceName} Events...`);
  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const result = await xml2js.parseStringPromise(response.data);
    const items = result.rss.channel[0].item || [];

    const batch = db.batch();
    items.forEach((item) => {
      const clean = standardize({
        title: item.title[0],
        description: item.description
          ? item.description[0].replace(/<[^>]*>?/gm, "").substring(0, 300)
          : "",
        location: sourceName === "GVSU" ? "GVSU Campus" : "Grand Rapids, MI",
        start: item.pubDate
          ? new Date(item.pubDate[0]).toISOString()
          : new Date().toISOString(),
        link: item.link[0],
        source: sourceName,
        category: categoryName,
      });

      const docId =
        `${sourceName.toLowerCase()}-${clean.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`.substring(
          0,
          120,
        );
      batch.set(db.collection("events").doc(docId), clean, { merge: true });
    });
    await batch.commit();
    console.log(`✅ ${sourceName}: Synced ${items.length} events.`);
  } catch (err) {
    console.error(`❌ ${sourceName} Sync Error:`, err.message);
  }
}

async function syncLocalIcs() {
  console.log("📅 Reading local .ics file...");
  try {
    const data = fs.readFileSync("./gvsu_events.ics", "utf-8");
    const lines = data.split(/\r?\n/);
    const batch = db.batch();
    let count = 0;
    let currentEvent = null;

    lines.forEach((line) => {
      if (line.startsWith("BEGIN:VEVENT")) {
        currentEvent = {};
      } else if (line.startsWith("END:VEVENT")) {
        if (currentEvent?.SUMMARY) {
          const clean = standardize({
            title: currentEvent.SUMMARY,
            description:
              currentEvent.DESCRIPTION?.substring(0, 500) || "GVSU Event",
            location: currentEvent.LOCATION || "GVSU Campus",
            start: parseIcsDate(currentEvent.DTSTART),
            source: "GVSU",
            category: "Campus",
          });
          const docId =
            `gvsu-${(currentEvent.UID || clean.title).replace(/[^a-z0-9]/gi, "-").toLowerCase()}`.substring(
              0,
              100,
            );
          batch.set(db.collection("events").doc(docId), clean, { merge: true });
          count++;
        }
        currentEvent = null;
      } else if (currentEvent) {
        const match = line.match(/^([A-Z]+):(.*)$/);
        if (match) currentEvent[match[1]] = match[2];
      }
    });

    if (count > 0) {
      await batch.commit();
      console.log(`✅ GVSU (Manual): Synced ${count} events.`);
    }
  } catch (err) {
    console.error("❌ ICS Error:", err.message);
  }
}

async function runAll() {
  console.log("🚀 Starting 6-Month Sync...");

  await syncLocalIcs();
  await syncFeed(GVSU_FEED, "GVSU", "Campus");
  await syncFeed(GR_CITY_FEED, "ExperienceGR", "City");

  console.log("🏁 All sync tasks complete!");
  process.exit();
}

runAll();

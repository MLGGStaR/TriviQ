// For charades_general and charades_scenarios entries in qualityBackfill,
// strip verbose prefixes ("Doing X", "Playing X", "Taking X", "Riding X" ...) → "X".
import fs from "node:fs";
import path from "node:path";

const BACKFILL_PATH = "src/qualityBackfill.js";
const mod = await import(`file:///${path.resolve(BACKFILL_PATH).replace(/\\/g, "/")}?c=${Date.now()}`);
const backfill = JSON.parse(JSON.stringify(mod.default || {}));

const prefixes = /^(doing|playing|riding|driving a|cooking|taking a|washing|lifting|throwing a|shooting|flying a|tying|brushing|opening a|blowing|reading a|writing a|doing the|painting a|making|preparing|eating a|drinking a|walking a)\s+/i;

const rules = {
  "Playing guitar": "Guitar",
  "Playing violin": "Violin",
  "Playing piano": "Piano",
  "Playing chess": "Chess",
  "Playing harmonica": "Harmonica",
  "Playing bagpipes": "Bagpipes",
  "Doing laundry": "Laundry",
  "Doing yoga": "Yoga",
  "Painting a wall": "Painting",
  "Painting a portrait": "Portrait",
  "Riding a bike": "Bike",
  "Driving a car": "Driving",
  "Eating pizza": "Pizza",
  "Cooking eggs": "Cooking",
  "Washing dishes": "Dishes",
  "Throwing a ball": "Throwing ball",
  "Lifting weights": "Weightlifting",
  "Taking a photo": "Taking photo",
  "Shooting basketball": "Basketball shot",
  "Flying a kite": "Kite",
  "Tying shoes": "Shoelaces",
  "Brushing teeth": "Teeth brushing",
  "Blowing candles": "Candles",
  "Reading a book": "Reading",
  "Writing a letter": "Writing",
  "Jumping rope": "Jump rope",
  "Rowing a boat": "Rowing",
  "Ice skating": "Ice skating",
  "Roller skating": "Roller skating",
  "Line dancing": "Line dance",
  "Tap dancing": "Tap dance",
  "Sword fighting": "Sword fight",
  "Milking a cow": "Milking",
  "Fire breathing": "Fire breather",
  "Chainsaw cutting": "Chainsaw",
  "Sewing a button": "Sewing",
  "Mountain biking": "Mountain bike",
  "Horseback riding": "Horse ride",
  "Playing chess": "Chess",
  "Stomping grapes": "Grape stomp",
};

const cats = ["charades_general", "charades_scenarios"];
let changed = 0;
for (const cat of cats) {
  if (!backfill[cat]) continue;
  for (const tier of [200, 400, 600]) {
    if (!backfill[cat][tier]) continue;
    backfill[cat][tier] = backfill[cat][tier].map((entry) => {
      let a = entry.a;
      if (rules[a]) { changed++; a = rules[a]; }
      return { ...entry, a };
    });
  }
}

fs.writeFileSync(BACKFILL_PATH, `const QUALITY_BACKFILL = ${JSON.stringify(backfill, null, 2)};\n\nexport default QUALITY_BACKFILL;\n`);
console.log(`Simplified ${changed} charades entries.`);

// Blacklist charades entries >5 words, then backfill with short actable prompts.
import fs from "node:fs";
import path from "node:path";

const BLACKLIST_PATH = "src/qualityBlacklist.js";
const BACKFILL_PATH = "src/qualityBackfill.js";

const sourceFiles = [
  "triviaExpansions","triviaMinimums","triviaMegaExpansions","triviaUltraExpansions",
  "triviaTierBalanceExpansions","triviaTierParityExpansions","triviaTierFinalParityExpansions",
  "triviaTierFinalTopoffExpansions","newCategoriesBank","newCategoriesPack2",
  "moreTriviaExpansions","megaNewExpansions",
];

const charadesByCat = { charades_general: { 200: [], 400: [], 600: [] }, charades_scenarios: { 200: [], 400: [], 600: [] } };
for (const f of sourceFiles) {
  const mod = await import(`../src/${f}.js`);
  const bank = mod.default || {};
  for (const cat of Object.keys(charadesByCat)) {
    const c = bank[cat];
    if (!c) continue;
    for (const t of [200, 400, 600]) {
      (c[t] || []).forEach((e) => { if (e?.q && e?.a) charadesByCat[cat][t].push(e); });
    }
  }
}
const qr = await import("../src/questionRefinements.js");
if (qr.QUESTION_REFINEMENT_ADDITIONS) {
  for (const cat of Object.keys(charadesByCat)) {
    const c = qr.QUESTION_REFINEMENT_ADDITIONS[cat];
    if (!c) continue;
    for (const t of [200, 400, 600]) {
      (c[t] || []).forEach((e) => { if (e?.q && e?.a) charadesByCat[cat][t].push(e); });
    }
  }
}

// Load existing blacklist + backfill
const existingBlacklistSrc = fs.readFileSync(BLACKLIST_PATH, "utf8");
const existingBlacklistMatch = existingBlacklistSrc.match(/const entries = (\[[\s\S]*?\]);/);
const existingBlacklist = existingBlacklistMatch ? eval(existingBlacklistMatch[1]) : [];
const blKeys = new Set(existingBlacklist.map((e) => `${e.cat}|${(e.q||"").toLowerCase().trim()}|${(e.a||"").toLowerCase().trim()}`));

const backfillMod = await import(`file:///${path.resolve(BACKFILL_PATH).replace(/\\/g, "/")}?c=${Date.now()}`);
const backfill = JSON.parse(JSON.stringify(backfillMod.default || {}));

let blAdded = 0;
for (const cat of Object.keys(charadesByCat)) {
  for (const t of [200, 400, 600]) {
    for (const e of charadesByCat[cat][t]) {
      const wc = (e.a || "").split(/\s+/).filter(Boolean).length;
      if (wc > 5) {
        const k = `${cat}|${(e.q||"").toLowerCase().trim()}|${(e.a||"").toLowerCase().trim()}`;
        if (blKeys.has(k)) continue;
        blKeys.add(k);
        existingBlacklist.push({ cat, q: e.q, a: e.a, reason: ">5 words" });
        blAdded++;
      }
    }
  }
}

// Backfill: short, iconic, word-for-word actable charades
const backfillAdds = {
  charades_general: {
    200: [
      "Brushing teeth", "Eating pizza", "Tying shoes", "Playing guitar", "Swimming",
      "Dancing", "Driving a car", "Reading a book", "Cooking eggs", "Jumping rope",
      "Washing dishes", "Sleeping", "Singing", "Riding a bike", "Fishing",
      "Typing", "Flying a kite", "Shooting basketball", "Throwing a ball", "Lifting weights",
      "Taking a photo", "Clapping", "Waving goodbye", "Blowing candles", "Writing a letter",
    ],
    400: [
      "Skateboarding", "Doing laundry", "Playing violin", "Surfing", "Skiing",
      "Golfing", "Gardening", "Painting a portrait", "Baking a cake", "Sweeping",
      "Vacuuming", "Doing yoga", "Playing piano", "Fencing", "Juggling",
      "Boxing", "Rowing a boat", "Ice skating", "Roller skating", "Breakdancing",
    ],
    600: [
      "Parkour", "Sword fighting", "Milking a cow", "Playing harmonica", "Windsurfing",
      "Hang gliding", "Skydiving", "Yodeling", "Tap dancing", "Tightrope walking",
      "Fire breathing", "Pottery wheel", "Knitting", "Welding", "Fly fishing",
      "Rock climbing", "Chainsaw cutting", "Horseback riding", "Mountain biking", "Trapeze swinging",
      "Bull riding", "Line dancing", "Tango", "Playing bagpipes", "Banjo picking",
    ],
  },
  charades_scenarios: {
    200: [
      "Running late", "Getting a haircut", "Ordering food", "Watching TV", "Doing homework",
      "Missing the bus", "Falling asleep", "Crying at a movie", "Laughing hard", "Being scared",
    ],
    400: [
      "Stuck in traffic", "Winning a race", "Losing your keys", "Cold shower", "Stubbing a toe",
      "Sneezing loudly", "Yawning", "Hiccupping", "Catching a cold", "Getting a shot",
      "Biting ice cream", "Sunburn pain", "Foot falling asleep", "Brain freeze", "Swallowing a fly",
      "Picking a splinter", "Itchy sweater", "Bug in your ear", "Stepping on Lego", "Nose bleed",
      "Chipped tooth", "Pulling a muscle", "Eating lemon", "Sneaking a yawn", "Butterfly nerves",
    ],
    600: [
      "Dodging paparazzi", "Catwalk strut", "Robot dance", "Ventriloquist act", "Lip sync battle",
      "Magic trick", "Mime trapped in box", "Statue pose", "Bowling strike", "Limbo dance",
      "Conga line", "Chicken dance", "Moonwalk", "Floss dance", "Twist dance",
      "Sprinkler dance", "Cabbage patch dance", "Running man", "Shoulder shimmy", "Belly dance",
      "Sumo wrestling", "Capoeira", "Haka", "Kabuki pose", "Flamenco stomp",
      "Tarantella spin", "Irish step dance", "Tango dip", "Waltz twirl", "Foxtrot glide",
    ],
  },
};

let bfAdded = 0;
for (const cat of Object.keys(backfillAdds)) {
  if (!backfill[cat]) backfill[cat] = {};
  for (const tier of [200, 400, 600]) {
    const list = backfillAdds[cat][tier] || [];
    if (!backfill[cat][tier]) backfill[cat][tier] = [];
    const existingKeys = new Set(backfill[cat][tier].map((e) => `${(e.q||"").toLowerCase()}|${(e.a||"").toLowerCase()}`));
    for (const word of list) {
      const entry = { q: "Act it out — no talking, no sounds!", a: word };
      const k = `${entry.q.toLowerCase()}|${entry.a.toLowerCase()}`;
      if (existingKeys.has(k)) continue;
      existingKeys.add(k);
      backfill[cat][tier].push(entry);
      bfAdded++;
    }
  }
}

fs.writeFileSync(BLACKLIST_PATH, `// Auto-generated: quality pass + charades cleanup.\n\nconst entries = ${JSON.stringify(existingBlacklist, null, 2)};\n\nfunction normalizeKey(cat, q, a) {\n  return [cat, (q || "").toLowerCase().replace(/\\s+/g, " ").trim(), (a || "").toLowerCase().replace(/\\s+/g, " ").trim()].join("|");\n}\n\nexport const QUESTION_BLACKLIST = new Set(entries.map((e) => normalizeKey(e.cat, e.q, e.a)));\nexport function isBlacklisted(catId, q, a) {\n  return QUESTION_BLACKLIST.has(normalizeKey(catId, q, a));\n}\n\nexport default QUESTION_BLACKLIST;\n`);

fs.writeFileSync(BACKFILL_PATH, `// Auto-generated backfill for the quality pass.\n\nconst QUALITY_BACKFILL = ${JSON.stringify(backfill, null, 2)};\n\nexport default QUALITY_BACKFILL;\n`);

console.log(`Blacklisted ${blAdded} charades (>5 words). Total blacklist: ${existingBlacklist.length}.`);
console.log(`Added ${bfAdded} short charades backfill entries.`);

// Expand charades_countries, charades_scenarios, charades_general
// in qualityBackfill.js with unique entries (no factual research needed).
import fs from "node:fs";
import path from "node:path";

const BACKFILL_PATH = "src/qualityBackfill.js";
const mod = await import(`file:///${path.resolve(BACKFILL_PATH).replace(/\\/g, "/")}?c=${Date.now()}`);
const backfill = JSON.parse(JSON.stringify(mod.default || {}));

// Collect existing a-values across all sources per (cat, tier).
const existing = {};
function ensure(cat, tier) {
  if (!existing[cat]) existing[cat] = { 200: new Set(), 400: new Set(), 600: new Set() };
  return existing[cat][tier];
}
async function loadSource(rel) {
  const m = await import(`../src/${rel}.js`);
  const bank = m.default || m;
  for (const [cat, data] of Object.entries(bank)) {
    for (const t of [200, 400, 600]) {
      const rows = Array.isArray(data?.[t]) ? data[t] : [];
      rows.forEach((e) => e?.a && ensure(cat, t).add(e.a.toLowerCase().trim()));
    }
  }
}
for (const f of ["newCategoriesBank","newCategoriesPack2","megaNewExpansions","moreTriviaExpansions","triviaExpansions","triviaMegaExpansions","triviaUltraExpansions","triviaMinimums","triviaTierBalanceExpansions","triviaTierParityExpansions","triviaTierFinalParityExpansions","triviaTierFinalTopoffExpansions","qualityBackfill"]) {
  try { await loadSource(f); } catch {}
}

function addUnique(cat, tier, answers, qText = "Act it out — no talking, no sounds!") {
  if (!backfill[cat]) backfill[cat] = {};
  if (!backfill[cat][tier]) backfill[cat][tier] = [];
  const tierSet = ensure(cat, tier);
  let added = 0;
  for (const a of answers) {
    const key = a.toLowerCase().trim();
    if (tierSet.has(key)) continue;
    tierSet.add(key);
    backfill[cat][tier].push({ q: qText, a });
    added++;
  }
  return added;
}

// ---- CHARADES_COUNTRIES additions ----
addUnique("charades_countries", 200, [
  "Kuwait","Turkey","Vietnam","Morocco","Philippines","Malaysia","Cuba","Jamaica",
  "Iceland","Colombia","Chile","Peru","Finland","Romania","Poland","Hungary",
]);
addUnique("charades_countries", 400, [
  "Ghana","Senegal","Ukraine","Slovakia","Slovenia","Bulgaria","Armenia","Georgia",
  "Kazakhstan","Uzbekistan","Mongolia","Nepal","Sri Lanka","Bangladesh","Afghanistan","Panama",
]);
addUnique("charades_countries", 600, [
  "Paraguay","Uruguay","Ecuador","Bolivia","Honduras","Guatemala","Nicaragua","Costa Rica",
  "Dominican Republic","Haiti","Trinidad and Tobago","Fiji","Papua New Guinea","Samoa","Brunei","Laos",
]);

// ---- CHARADES_SCENARIOS additions ----
addUnique("charades_scenarios", 200, [
  "Brushing your hair","Tying a tie","Buckling a seatbelt","Pouring coffee",
  "Turning on a lamp","Blowing a bubble","Reading a map","Packing a suitcase",
  "Trying on shoes","Opening a jar","Wiping a window","Making a sandwich",
  "Taking a selfie","Licking an ice cream","Checking the mirror","Stretching in bed",
]);
addUnique("charades_scenarios", 400, [
  "Solving a puzzle","Doing a jigsaw","Teaching a class","Conducting an orchestra",
  "Fly-fishing","Pitching a tent","Paddling a canoe","Climbing a rope",
  "Changing a flat tire","Fixing a leaky faucet","Herding sheep","Doing a crossword",
  "Hailing a taxi","Catching a frisbee","Planting a tree","Rolling out dough",
]);
addUnique("charades_scenarios", 600, [
  "Conducting surgery","Rescuing a cat from a tree","Disarming a bomb","Juggling flaming torches",
  "Tightrope walking","Training a lion","Performing CPR","Delivering a baby",
  "Shearing a sheep","Tracking animal prints","Panning for gold","Sculpting a statue",
  "Spinning plates","Throwing pottery","Blacksmithing","Tea ceremony",
]);

// ---- CHARADES_GENERAL additions ----
addUnique("charades_general", 200, [
  "Helicopter","Train","Airplane","Rocket","Submarine","Truck","Motorbike","Tractor",
  "Elephant","Giraffe","Monkey","Penguin","Duck","Rabbit","Snake","Frog",
  "Butterfly","Spider","Crab","Shark",
]);
addUnique("charades_general", 400, [
  "Chopsticks","Microphone","Camera","Binoculars","Flashlight","Stopwatch","Calculator","Scissors",
  "Paintbrush","Stapler","Hammer","Screwdriver","Saw","Shovel","Rake","Wrench",
  "Compass","Magnifying glass","Telescope","Thermometer",
]);
addUnique("charades_general", 600, [
  "Harpsichord","Accordion","Didgeridoo","Sitar","Banjo","Ukulele","Tambourine","Xylophone",
  "Chess","Backgammon","Jenga","Pictionary","Rubik's cube","Pinball","Pachinko","Jai alai",
  "Falconry","Beekeeping","Taxidermy","Archery",
]);

fs.writeFileSync(BACKFILL_PATH, `const QUALITY_BACKFILL = ${JSON.stringify(backfill, null, 2)};\n\nexport default QUALITY_BACKFILL;\n`);
console.log("Expanded charades categories in qualityBackfill.js");

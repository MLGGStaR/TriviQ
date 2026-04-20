// Merge all agent-results JSON files into qualityBlacklist.js and qualityBackfill.js.
// Smart apply: for each (cat, tier), only apply blacklist entries up to the count
// that keeps the tier at >= 30 after backfill is added.
import fs from "node:fs";
import path from "node:path";

const RESULTS_DIR = "audit/agent-results";
const BLACKLIST_PATH = "src/qualityBlacklist.js";
const BACKFILL_PATH = "src/qualityBackfill.js";

// 1. Load all bank sources and count current questions per (cat, tier)
const sourceFiles = [
  "triviaExpansions","triviaMinimums","triviaMegaExpansions","triviaUltraExpansions",
  "triviaTierBalanceExpansions","triviaTierParityExpansions","triviaTierFinalParityExpansions",
  "triviaTierFinalTopoffExpansions","newCategoriesBank","newCategoriesPack2",
  "moreTriviaExpansions","megaNewExpansions","emojiGuessCategories","logoCategoriesBank",
];

const byCat = {};
function pushEntry(cat, tier, e) {
  if (!byCat[cat]) byCat[cat] = { 200: [], 400: [], 600: [] };
  byCat[cat][tier].push(e);
}

for (const f of sourceFiles) {
  const mod = await import(`../src/${f}.js`);
  const bank = mod.default || {};
  for (const [catId, data] of Object.entries(bank)) {
    for (const t of [200, 400, 600]) {
      const rows = Array.isArray(data?.[t]) ? data[t] : [];
      rows.forEach((e) => { if (e?.q) pushEntry(catId, t, e); });
    }
  }
}
const qr = await import("../src/questionRefinements.js");
if (qr.QUESTION_REFINEMENT_ADDITIONS) {
  for (const [catId, data] of Object.entries(qr.QUESTION_REFINEMENT_ADDITIONS)) {
    for (const t of [200,400,600]) {
      const rows = Array.isArray(data?.[t]) ? data[t] : [];
      rows.forEach((e) => { if (e?.q) pushEntry(catId, t, e); });
    }
  }
}
// App.jsx inline
const app = fs.readFileSync("src/App.jsx","utf8");
const catRe = /^  ([a-z_]+):\{([\s\S]*?)^  \},?$/gm;
let m;
while ((m = catRe.exec(app)) !== null) {
  const id = m[1];
  const body = m[2];
  for (const t of [200,400,600]) {
    const tierRe = new RegExp("\\b" + t + ":\\[([\\s\\S]*?)\\](?=,|\\s*\\})");
    const tm = body.match(tierRe);
    if (!tm) continue;
    const itemRe = /\{q:"((?:[^"\\]|\\.)*)",a:"((?:[^"\\]|\\.)*)"/g;
    let im;
    while ((im = itemRe.exec(tm[1])) !== null) {
      pushEntry(id, t, { q: im[1], a: im[2] });
    }
  }
}

// 2. Load existing blacklist and backfill
function readExistingBlacklistEntries() {
  const src = fs.readFileSync(BLACKLIST_PATH, "utf8");
  const m = src.match(/const entries = (\[[\s\S]*?\]);/);
  if (!m) return [];
  try { return eval(m[1]); } catch { return []; }
}
const existingBlacklist = readExistingBlacklistEntries();
const backfillMod = await import(`file:///${path.resolve(BACKFILL_PATH).replace(/\\/g, "/")}?c=${Date.now()}`);
const backfill = JSON.parse(JSON.stringify(backfillMod.default || {}));

// 3. Collect agent results
const proposedBlacklist = []; // [{cat, q, a, reason, tier(guessed)}]
const proposedBackfill = {}; // {cat: {200: [...], 400: [...], 600: [...]}}

function getTierForQ(cat, q, a) {
  const cats = byCat[cat];
  if (!cats) return null;
  const qLow = (q || "").toLowerCase().trim();
  const aLow = (a || "").toLowerCase().trim();
  for (const t of [200, 400, 600]) {
    if (cats[t].some((e) => (e.q || "").toLowerCase().trim() === qLow && (e.a || "").toLowerCase().trim() === aLow)) {
      return t;
    }
  }
  return null;
}

const files = fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith(".json"));
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, f), "utf8"));
  for (const [cat, payload] of Object.entries(data)) {
    if (payload.blacklist) {
      for (const e of payload.blacklist) {
        const t = getTierForQ(cat, e.q, e.a);
        if (t === null) continue; // question not found in source - skip
        proposedBlacklist.push({ cat, tier: t, q: e.q, a: e.a, reason: e.reason || "agent" });
      }
    }
    if (payload.backfill) {
      if (!proposedBackfill[cat]) proposedBackfill[cat] = { 200: [], 400: [], 600: [] };
      for (const tier of ["200", "400", "600"]) {
        if (Array.isArray(payload.backfill[tier])) {
          for (const e of payload.backfill[tier]) {
            proposedBackfill[cat][tier].push(e);
          }
        }
      }
    }
  }
}

// 4. Merge proposed backfill into backfill (dedupe by q+a)
for (const [cat, tiers] of Object.entries(proposedBackfill)) {
  if (!backfill[cat]) backfill[cat] = {};
  for (const tier of ["200", "400", "600"]) {
    const arr = tiers[tier] || [];
    if (!arr.length) continue;
    if (!backfill[cat][tier]) backfill[cat][tier] = [];
    const existingKeys = new Set(backfill[cat][tier].map((e) => `${e.q}|${e.a}`));
    for (const e of arr) {
      const k = `${e.q}|${e.a}`;
      if (existingKeys.has(k)) continue;
      existingKeys.add(k);
      backfill[cat][tier].push(e);
    }
  }
}

// 5. Compute per-(cat, tier) current count = source + backfill - already-blacklisted
const existingBlacklistKeys = new Set(existingBlacklist.map((e) => `${e.cat}|${(e.q||"").toLowerCase().trim()}|${(e.a||"").toLowerCase().trim()}`));

const BAD_Q = /\bsignificance\b|\bdifference between\b|\bdescribe\b|\bexplain\b|\bdeeper theme\b|\bpsychological\b|\breal meaning\b|\bsatire target\b|\bcontribution\b|\bcontroversy\b|\bcosmology\b|\bdeepest lore\b|\bcritical reception\b|\bhistorical accuracy\b|\baccuracy level\b/i;
const MULTIPART_Q = /\band what\b|\band why\b|\band who\b|\bdifference between\b|\bwhat opened it\b/i;

function tierCount(cat, tier) {
  // Simulate count-questions dedup filter
  const seen = new Set();
  let count = 0;
  const all = [...(byCat[cat]?.[tier] || []), ...((backfill[cat]?.[tier]) || [])];
  for (const e of all) {
    const q = (e.q || "").trim();
    if (!q) continue;
    if (BAD_Q.test(q) || MULTIPART_Q.test(q)) continue;
    const key = (q + "|" + (e.a || "") + "|" + (e.wiki || e.videoId || "")).toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) continue;
    // Check if already blacklisted
    const blKey = `${cat}|${q.toLowerCase().trim()}|${(e.a||"").toLowerCase().trim()}`;
    if (existingBlacklistKeys.has(blKey)) continue;
    seen.add(key);
    count++;
  }
  return count;
}

// 6. Apply proposed blacklist entries greedily, capped at tier count >= 30
const finalBlacklist = [...existingBlacklist];
const finalBlacklistKeys = new Set(existingBlacklistKeys);
const perTierAvailable = {}; // cat -> tier -> count available to remove

for (const cat of Object.keys(byCat)) {
  perTierAvailable[cat] = {};
  for (const t of [200, 400, 600]) {
    perTierAvailable[cat][t] = Math.max(0, tierCount(cat, t) - 32); // safety buffer
  }
}

let appliedCount = 0;
let cappedCount = 0;

for (const entry of proposedBlacklist) {
  const key = `${entry.cat}|${(entry.q||"").toLowerCase().trim()}|${(entry.a||"").toLowerCase().trim()}`;
  if (finalBlacklistKeys.has(key)) continue;
  const avail = perTierAvailable[entry.cat]?.[entry.tier] ?? 0;
  if (avail <= 0) { cappedCount++; continue; }
  perTierAvailable[entry.cat][entry.tier]--;
  finalBlacklist.push({ cat: entry.cat, q: entry.q, a: entry.a, reason: entry.reason });
  finalBlacklistKeys.add(key);
  appliedCount++;
}

// 7. Write files
const blacklistSource = `// Auto-generated: base blacklist + agent review (capped to preserve 30/30/30).

const entries = ${JSON.stringify(finalBlacklist, null, 2)};

function normalizeKey(cat, q, a) {
  return [cat, (q || "").toLowerCase().replace(/\\s+/g, " ").trim(), (a || "").toLowerCase().replace(/\\s+/g, " ").trim()].join("|");
}

export const QUESTION_BLACKLIST = new Set(entries.map((e) => normalizeKey(e.cat, e.q, e.a)));
export function isBlacklisted(catId, q, a) {
  return QUESTION_BLACKLIST.has(normalizeKey(catId, q, a));
}

export default QUESTION_BLACKLIST;
`;
fs.writeFileSync(BLACKLIST_PATH, blacklistSource);

const backfillSource = `// Auto-generated backfill for the quality pass.

const QUALITY_BACKFILL = ${JSON.stringify(backfill, null, 2)};

export default QUALITY_BACKFILL;
`;
fs.writeFileSync(BACKFILL_PATH, backfillSource);

console.log(`Proposed blacklist entries: ${proposedBlacklist.length}`);
console.log(`Applied (within 30/30/30 cap): ${appliedCount}`);
console.log(`Capped (would drop tier below 30): ${cappedCount}`);
console.log(`Total blacklist entries: ${finalBlacklist.length}`);
console.log(`Backfill categories: ${Object.keys(backfill).length}`);

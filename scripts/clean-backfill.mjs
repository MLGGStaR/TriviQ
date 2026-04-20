// Cleans qualityBackfill.js:
//   - removes answer leaks (answer substring in question, or all significant answer words in question)
//   - removes internal dupes (same cat, similar question + same answer)
//   - removes entries that duplicate existing source content (by per-cat audit files)
//   - removes placeholder / weird entries missed earlier
import fs from "node:fs";
import path from "node:path";

const BACKFILL_PATH = "src/qualityBackfill.js";

const backfillMod = await import(`file:///${path.resolve(BACKFILL_PATH).replace(/\\/g, "/")}?c=${Date.now()}`);
const backfill = JSON.parse(JSON.stringify(backfillMod.default || {}));

const GENERIC = new Set([
  "the","a","an","of","is","it","in","on","at","to","and","or","for","with","by","his","her","its","their",
  "ocean","sea","lake","river","mountain","mountains","island","islands","desert","forest","valley",
  "empire","kingdom","dynasty","republic","state","country","city","town","village","province","region",
  "war","battle","revolution","treaty","agreement","project","operation","mission","campaign","party",
  "first","second","third","fourth","fifth","last","final","initial","original",
  "name","title","date","year","century","era","age","period","day","week","month",
  "color","size","number","time","place","type","form","kind","way","shape",
  "show","movie","film","book","song","album","game","series","season","episode","chapter","volume",
  "character","player","team","group","band","family","house","clan","cast","squad",
  "one","two","three","four","five","six","seven","eight","nine","ten","many","some","few","all","most",
  "major","minor","large","small","tall","short","long","big","little","main","prime","key","common",
  "royal","grand","great","new","old","young","famous","popular","well",
  "what","which","who","when","where","why","how","does","this","that","these","those",
  "are","was","were","have","has","had","will","can","could","should","would","may","might","did",
  "said","called","known","named","made","born","died","built","created","wrote","directed","produced","voiced","played",
  "from","about","into","onto","over","under","above","below","across","along","around","through",
  "only","also","even","than","then","when","while","before","after","during",
  "like","such","very","just","much","many","more","less","least","some","other","another",
]);

function tokens(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
}
function sigWords(s) {
  return tokens(s).filter(w => w.length >= 4 && !GENERIC.has(w));
}
function isLeak(q, a) {
  if (!q || !a) return false;
  const qLow = q.toLowerCase();
  const aLow = a.toLowerCase();
  // substring leak (answer is a whole word in question)
  if (aLow.length > 3 && qLow.includes(aLow)) return true;
  // all significant answer words present in question
  const aSig = sigWords(a);
  if (aSig.length === 0) return false;
  const qTokens = new Set(tokens(q));
  if (aSig.every(w => qTokens.has(w))) return true;
  return false;
}

function normQ(q) {
  return q.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}
function normA(a) {
  return a.toLowerCase().replace(/\s+/g, " ").trim();
}
function qStem(q) {
  return normQ(q).split(" ").filter(w => w.length > 3 && !GENERIC.has(w)).slice(0, 6).join(" ");
}

// Placeholder/bad answer detection
function isBadAnswer(a) {
  const aLow = a.toLowerCase().trim();
  const bad = [
    "skip", "correction", "not sure", "none", "n/a", "na", "tbd", "unknown", "unclear",
    "not applicable", "not specified", "not named", "not revealed", "not canon",
    "not established", "not provided", "no data",
  ];
  if (bad.includes(aLow)) return true;
  if (aLow.includes("placeholder")) return true;
  if (aLow.startsWith("not ")) return true;
  return false;
}

function isBadQuestion(q) {
  const qLow = q.toLowerCase().trim();
  if (qLow.startsWith("wait,") || qLow.startsWith("wait ") || qLow.startsWith("actually,")) return true;
  if (qLow.length < 8) return true;
  return false;
}

// Load existing per-cat content for cross-source dedup
const existingByCat = {};
if (fs.existsSync("audit/per-cat")) {
  for (const f of fs.readdirSync("audit/per-cat")) {
    if (!f.endsWith(".json")) continue;
    const cat = f.replace(/\.json$/, "");
    try {
      const data = JSON.parse(fs.readFileSync(`audit/per-cat/${f}`, "utf8"));
      const byAns = new Map();
      for (const t of [200, 400, 600]) {
        for (const e of data[t] || []) {
          const aKey = normA(e.a || "");
          if (!byAns.has(aKey)) byAns.set(aKey, []);
          byAns.get(aKey).push({ q: e.q || "", a: e.a || "" });
        }
      }
      existingByCat[cat] = byAns;
    } catch {}
  }
}

function isSimilarQuestion(q1, q2) {
  const w1 = new Set(tokens(q1).filter(w => w.length > 3 && !GENERIC.has(w)));
  const w2 = new Set(tokens(q2).filter(w => w.length > 3 && !GENERIC.has(w)));
  if (w1.size === 0 || w2.size === 0) return false;
  let overlap = 0;
  for (const w of w1) if (w2.has(w)) overlap++;
  const smaller = Math.min(w1.size, w2.size);
  return overlap / smaller >= 0.5;
}

let removedLeak = 0, removedBad = 0, removedDupeInternal = 0, removedDupeSource = 0, kept = 0;

for (const [cat, tiers] of Object.entries(backfill)) {
  const sourceByAns = existingByCat[cat] || new Map();
  const seenByAns = new Map();
  for (const tier of ["200", "400", "600"]) {
    if (!tiers[tier]) continue;
    const cleaned = [];
    for (const e of tiers[tier]) {
      const q = (e.q || "").trim();
      const a = (e.a || "").trim();
      if (!q || !a) { removedBad++; continue; }
      if (isBadAnswer(a) || isBadQuestion(q)) { removedBad++; continue; }
      if (isLeak(q, a)) { removedLeak++; continue; }
      const aKey = normA(a);
      // Check dupe against source
      const sourceMatches = sourceByAns.get(aKey) || [];
      let dupeSrc = false;
      for (const s of sourceMatches) {
        if (isSimilarQuestion(q, s.q)) { dupeSrc = true; break; }
      }
      if (dupeSrc) { removedDupeSource++; continue; }
      // Check dupe within backfill (across all tiers of same cat)
      const seenMatches = seenByAns.get(aKey) || [];
      let dupeInt = false;
      for (const s of seenMatches) {
        if (isSimilarQuestion(q, s.q)) { dupeInt = true; break; }
      }
      if (dupeInt) { removedDupeInternal++; continue; }
      seenMatches.push({ q, a });
      seenByAns.set(aKey, seenMatches);
      const out = { q, a };
      if (e.wiki) out.wiki = e.wiki;
      cleaned.push(out);
      kept++;
    }
    backfill[cat][tier] = cleaned;
  }
}

fs.writeFileSync(
  BACKFILL_PATH,
  `const QUALITY_BACKFILL = ${JSON.stringify(backfill, null, 2)};\n\nexport default QUALITY_BACKFILL;\n`
);

console.log(`Kept: ${kept}`);
console.log(`Removed leaks: ${removedLeak}`);
console.log(`Removed bad entries: ${removedBad}`);
console.log(`Removed internal dupes: ${removedDupeInternal}`);
console.log(`Removed source dupes: ${removedDupeSource}`);
console.log(`Total removed: ${removedLeak + removedBad + removedDupeInternal + removedDupeSource}`);

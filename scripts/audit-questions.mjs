// Quality audit: lists duplicates, leaks, short questions, potentially-dumb prompts.
import fs from "node:fs";

const sourceFiles = [
  "triviaExpansions",
  "triviaMinimums",
  "triviaMegaExpansions",
  "triviaUltraExpansions",
  "triviaTierBalanceExpansions",
  "triviaTierParityExpansions",
  "triviaTierFinalParityExpansions",
  "triviaTierFinalTopoffExpansions",
  "newCategoriesBank",
  "newCategoriesPack2",
  "moreTriviaExpansions",
  "megaNewExpansions",
  "emojiGuessCategories",
  "logoCategoriesBank",
  "qualityBackfill",
];

// byCat[catId] = { [tier]: [{q, a, wiki, file}, ...] }
const byCat = {};

for (const f of sourceFiles) {
  const mod = await import(`../src/${f}.js`);
  const bank = mod.default || {};
  for (const [catId, catData] of Object.entries(bank)) {
    if (!byCat[catId]) byCat[catId] = { 200: [], 400: [], 600: [] };
    for (const t of [200, 400, 600]) {
      const rows = Array.isArray(catData?.[t]) ? catData[t] : [];
      rows.forEach((e) => {
        if (e?.q) byCat[catId][t].push({ ...e, file: f });
      });
    }
  }
}

// App.jsx inline categories
const app = fs.readFileSync("src/App.jsx", "utf8");
const catRe = /^  ([a-z_]+):\{([\s\S]*?)^  \},?$/gm;
let m;
while ((m = catRe.exec(app)) !== null) {
  const id = m[1];
  const body = m[2];
  if (!byCat[id]) byCat[id] = { 200: [], 400: [], 600: [] };
  for (const t of [200, 400, 600]) {
    const tierRe = new RegExp("\\b" + t + ":\\[([\\s\\S]*?)\\](?=,|\\s*\\})");
    const tm = body.match(tierRe);
    if (!tm) continue;
    const itemRe = /\{q:"((?:[^"\\]|\\.)*)",a:"((?:[^"\\]|\\.)*)"(?:,wiki:"((?:[^"\\]|\\.)*)")?/g;
    let im;
    while ((im = itemRe.exec(tm[1])) !== null) {
      byCat[id][t].push({ q: im[1], a: im[2], wiki: im[3], file: "App.jsx" });
    }
  }
}

// Analysis
const DUMB_PATTERNS = [
  /what color is/i,
  /what animal is/i,
  /is (.+) animated or live-action/i,
  /^what instrument has/i,
  /what number is tattooed/i,
];

const issues = {
  leaks: [],           // answer text appears inside question
  internalDupes: [],   // same answer in same category (any tier)
  shortQ: [],          // very short question (likely low-info)
  dumbPatterns: [],    // matches a known-dumb pattern
  crossDupes: [],      // same answer + similar question across categories
};

// Build normalized-question -> cats map for cross-dupe detection
const questionMap = new Map();

for (const [cat, tiers] of Object.entries(byCat)) {
  const ansByTier = { 200: new Map(), 400: new Map(), 600: new Map() };
  const allAns = new Map();
  for (const t of [200, 400, 600]) {
    for (const e of tiers[t]) {
      const q = (e.q || "").trim();
      const a = (e.a || "").trim();
      if (!q || !a) continue;

      // Leak detection: answer word appears in question
      const aWords = a.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      const qLow = q.toLowerCase();
      // Skip multiple-words answers where we just check primary noun
      const aLow = a.toLowerCase();
      if (aLow.length > 3 && qLow.includes(aLow)) {
        issues.leaks.push({ cat, tier: t, q, a, file: e.file });
      } else if (aWords.length && aWords.every((w) => qLow.includes(w)) && aWords.length <= 3) {
        issues.leaks.push({ cat, tier: t, q, a, file: e.file, note: "all answer words in q" });
      }

      // Internal duplicates — require SIMILAR question too (not just same answer)
      const qStem = qLow.replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
      const dupeKey = qStem.slice(0, 30) + "|" + aLow; // first 30 chars of question + answer
      if (allAns.has(dupeKey)) {
        issues.internalDupes.push({ cat, tier: t, q, a, prevTier: allAns.get(dupeKey).tier, prevQ: allAns.get(dupeKey).q });
      } else {
        allAns.set(dupeKey, { q, tier: t });
      }
      // Also exact-answer+similar-intent detection
      const answerKey = "A:" + aLow;
      if (allAns.has(answerKey)) {
        const prev = allAns.get(answerKey);
        // Consider dupe only if questions share significant overlap (not just same answer)
        const prevStem = prev.q.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(w=>w.length>3);
        const curStem = qLow.replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(w=>w.length>3);
        const overlap = prevStem.filter(w => curStem.includes(w)).length;
        const minLen = Math.min(prevStem.length, curStem.length);
        if (minLen > 0 && overlap / minLen >= 0.5) {
          issues.internalDupes.push({ cat, tier: t, q, a, prevTier: prev.tier, prevQ: prev.q, similar: true });
        }
      } else {
        allAns.set(answerKey, { q, tier: t });
      }

      // Short questions
      if (q.length < 20) {
        issues.shortQ.push({ cat, tier: t, q, a, file: e.file });
      }

      // Known dumb patterns
      if (DUMB_PATTERNS.some((p) => p.test(q))) {
        issues.dumbPatterns.push({ cat, tier: t, q, a, file: e.file });
      }

      // Cross-dupe tracking (same answer + similar question stem)
      const stem = q.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
      const fullKey = stem + "|" + aLow;
      if (!questionMap.has(fullKey)) questionMap.set(fullKey, []);
      questionMap.get(fullKey).push({ cat, tier: t, q, a });
    }
  }
}

for (const [key, list] of questionMap.entries()) {
  if (list.length > 1) {
    // Only flag if across different cats
    const cats = new Set(list.map((x) => x.cat));
    if (cats.size > 1) {
      issues.crossDupes.push({ key, list });
    }
  }
}

// Counts per category/tier after dedup filtering
const BAD_Q = /\bsignificance\b|\bdifference between\b|\bdescribe\b|\bexplain\b|\bdeeper theme\b|\bpsychological\b|\breal meaning\b|\bsatire target\b|\bcontribution\b|\bcontroversy\b|\bcosmology\b|\bdeepest lore\b|\bcritical reception\b|\bhistorical accuracy\b|\baccuracy level\b/i;
const MULTIPART_Q = /\band what\b|\band why\b|\band who\b|\bdifference between\b|\bwhat opened it\b/i;

const counts = {};
for (const [cat, tiers] of Object.entries(byCat)) {
  counts[cat] = { 200: 0, 400: 0, 600: 0 };
  for (const t of [200, 400, 600]) {
    const seen = new Set();
    for (const e of tiers[t]) {
      const q = (e.q || "").trim();
      if (!q) continue;
      if (BAD_Q.test(q) || MULTIPART_Q.test(q)) continue;
      const key = (q + "|" + (e.a || "")).toLowerCase().replace(/\s+/g, " ").trim();
      if (seen.has(key)) continue;
      seen.add(key);
      counts[cat][t]++;
    }
  }
}

console.log("\n================ SUMMARY ================");
console.log(`Total categories: ${Object.keys(byCat).length}`);
console.log(`LEAKS: ${issues.leaks.length}`);
console.log(`INTERNAL DUPES: ${issues.internalDupes.length}`);
console.log(`SHORT Qs (<20 chars): ${issues.shortQ.length}`);
console.log(`DUMB PATTERNS: ${issues.dumbPatterns.length}`);
console.log(`CROSS-CAT DUPES: ${issues.crossDupes.length}`);

console.log("\n---- CATEGORIES UNDER 30/30/30 ----");
for (const [cat, c] of Object.entries(counts)) {
  if (c[200] < 30 || c[400] < 30 || c[600] < 30) {
    console.log(`  ${cat}: ${c[200]}/${c[400]}/${c[600]}`);
  }
}

console.log("\n---- LEAKS (first 30) ----");
issues.leaks.slice(0, 30).forEach((x) => console.log(`  [${x.cat}/${x.tier}] "${x.q}" -> "${x.a}"${x.note ? " ("+x.note+")" : ""}`));

console.log("\n---- INTERNAL DUPES (first 30) ----");
issues.internalDupes.slice(0, 30).forEach((x) => console.log(`  [${x.cat}] tier ${x.tier}: "${x.q}" -> "${x.a}" (prev tier ${x.prevTier}: "${x.prevQ}")`));

console.log("\n---- CROSS-CAT DUPES (first 30) ----");
issues.crossDupes.slice(0, 30).forEach((x) => {
  const cats = [...new Set(x.list.map((l) => l.cat))];
  console.log(`  A:"${x.list[0].a}" | Q:"${x.list[0].q}" | cats: ${cats.join(",")}`);
});

fs.writeFileSync("audit-report.json", JSON.stringify({ issues, counts }, null, 2));
console.log("\nFull report: audit-report.json");

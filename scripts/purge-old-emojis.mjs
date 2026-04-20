// Blacklist all emoji-category entries that aren't in the canonical rebus file.
import fs from "node:fs";
import path from "node:path";

const BLACKLIST_PATH = "src/qualityBlacklist.js";

// Canonical rebus entries (keep these)
const canonical = (await import("../src/emojiGuessCategories.js")).default;
const canonicalKeys = new Set();
for (const cat of Object.keys(canonical)) {
  for (const t of [200, 400, 600]) {
    for (const e of canonical[cat][t] || []) {
      canonicalKeys.add(`${cat}|${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`);
    }
  }
}

// Scan every other source file for emoji-category entries and blacklist anything
// whose (cat, q, a) key isn't in the canonical set.
const sourceFiles = [
  "triviaExpansions","triviaMinimums","triviaMegaExpansions","triviaUltraExpansions",
  "triviaTierBalanceExpansions","triviaTierParityExpansions","triviaTierFinalParityExpansions",
  "triviaTierFinalTopoffExpansions","newCategoriesBank","newCategoriesPack2",
  "moreTriviaExpansions","megaNewExpansions",
];

// Load existing blacklist
const src = fs.readFileSync(BLACKLIST_PATH, "utf8");
const m = src.match(/const entries = (\[[\s\S]*?\]);/);
const entries = m ? eval(m[1]) : [];
const existingKeys = new Set(entries.map((e) => `${e.cat}|${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`));

const emojiCats = new Set(["movie_show_emoji", "country_emoji", "general_emoji"]);
let added = 0;
for (const f of sourceFiles) {
  const mod = await import(`../src/${f}.js`);
  const bank = mod.default || {};
  for (const cat of emojiCats) {
    const c = bank[cat];
    if (!c) continue;
    for (const t of [200, 400, 600]) {
      for (const e of c[t] || []) {
        const key = `${cat}|${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`;
        if (canonicalKeys.has(key)) continue;
        if (existingKeys.has(key)) continue;
        existingKeys.add(key);
        entries.push({ cat, q: e.q, a: e.a, reason: "legacy representational emoji" });
        added++;
      }
    }
  }
}
// Also App.jsx questionRefinements?
const qr = await import("../src/questionRefinements.js");
if (qr.QUESTION_REFINEMENT_ADDITIONS) {
  for (const cat of emojiCats) {
    const c = qr.QUESTION_REFINEMENT_ADDITIONS[cat];
    if (!c) continue;
    for (const t of [200, 400, 600]) {
      for (const e of c[t] || []) {
        const key = `${cat}|${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`;
        if (canonicalKeys.has(key)) continue;
        if (existingKeys.has(key)) continue;
        existingKeys.add(key);
        entries.push({ cat, q: e.q, a: e.a, reason: "legacy representational emoji" });
        added++;
      }
    }
  }
}

fs.writeFileSync(BLACKLIST_PATH, `// Auto-generated.\n\nconst entries = ${JSON.stringify(entries, null, 2)};\n\nfunction normalizeKey(cat, q, a) {\n  return [cat, (q || "").toLowerCase().replace(/\\s+/g, " ").trim(), (a || "").toLowerCase().replace(/\\s+/g, " ").trim()].join("|");\n}\n\nexport const QUESTION_BLACKLIST = new Set(entries.map((e) => normalizeKey(e.cat, e.q, e.a)));\nexport function isBlacklisted(catId, q, a) {\n  return QUESTION_BLACKLIST.has(normalizeKey(catId, q, a));\n}\n\nexport default QUESTION_BLACKLIST;\n`);

console.log(`Purged ${added} legacy representational emoji entries. Total blacklist: ${entries.length}.`);

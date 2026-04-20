// Appends entries to src/qualityBlacklist.js:
//   1. Too-easy tier-200 questions from audit/easy-200-blacklist.json
//   2. All existing concept-based country_emoji entries (replaced with phonetic ones)
import fs from "node:fs";

const BL_PATH = "src/qualityBlacklist.js";

// Parse existing entries from qualityBlacklist.js by importing as a module.
const blMod = await import(`file:///${process.cwd().replace(/\\/g, "/")}/${BL_PATH}?c=${Date.now()}`);
// qualityBlacklist.js likely exports isBlacklisted + has internal `entries`. Pull entries by reading the file.

const src = fs.readFileSync(BL_PATH, "utf8");
// Naive extraction: find the "const entries = [...]" literal.
const entriesMatch = src.match(/const entries\s*=\s*(\[[\s\S]*?\n\]);/);
if (!entriesMatch) {
  throw new Error("Couldn't locate `const entries = [...]` in qualityBlacklist.js");
}
const existing = JSON.parse(entriesMatch[1]);
console.log(`Existing blacklist entries: ${existing.length}`);

// Build dedup key set
const keyOf = (e) => `${e.cat}|${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`;
const seen = new Set(existing.map(keyOf));

// 1. Add easy-200 entries
const easy = JSON.parse(fs.readFileSync("audit/easy-200-blacklist.json", "utf8"));
let easyAdded = 0;
for (const e of easy.tooEasy || []) {
  const entry = { cat: e.cat, q: e.q, a: e.a, reason: e.reason || "too easy" };
  const k = keyOf(entry);
  if (seen.has(k)) continue;
  seen.add(k);
  existing.push(entry);
  easyAdded++;
}

// 2. Add all existing concept-based country_emoji entries
const ceSrc = JSON.parse(fs.readFileSync("audit/per-cat/country_emoji.json", "utf8"));
let ceAdded = 0;
for (const tier of [200, 400, 600]) {
  for (const e of ceSrc[tier] || []) {
    const entry = { cat: "country_emoji", q: e.q, a: e.a, reason: "replaced by phonetic emoji set" };
    const k = keyOf(entry);
    if (seen.has(k)) continue;
    seen.add(k);
    existing.push(entry);
    ceAdded++;
  }
}

// Write back
const newEntries = JSON.stringify(existing, null, 2);
const newSrc = src.replace(/const entries\s*=\s*\[[\s\S]*?\n\];/, `const entries = ${newEntries};`);
fs.writeFileSync(BL_PATH, newSrc);

console.log(`Added ${easyAdded} easy-200 entries`);
console.log(`Added ${ceAdded} concept country_emoji entries`);
console.log(`New blacklist total: ${existing.length}`);

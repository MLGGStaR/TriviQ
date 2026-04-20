// Apply bad-wiki-slugs audit: remove from backfill, blacklist from source files.
import fs from "node:fs";
import path from "node:path";

const BF_PATH = "src/qualityBackfill.js";
const BL_PATH = "src/qualityBlacklist.js";

const { badEntries } = JSON.parse(fs.readFileSync("audit/bad-wiki-slugs.json", "utf8"));

// 1. Remove bad entries from qualityBackfill
const bfMod = await import(`file:///${path.resolve(BF_PATH).replace(/\\/g, "/")}?c=${Date.now()}`);
const bf = JSON.parse(JSON.stringify(bfMod.default));
let bfRemoved = 0;
const bfKeys = new Set(badEntries.filter((e) => e.file === "qualityBackfill").map((e) => `${e.cat}|${e.wiki}|${e.a}`));
for (const [cat, tiers] of Object.entries(bf)) {
  for (const tier of ["200", "400", "600"]) {
    if (!tiers[tier]) continue;
    const before = tiers[tier].length;
    tiers[tier] = tiers[tier].filter((e) => !bfKeys.has(`${cat}|${e.wiki || ""}|${e.a || ""}`));
    bfRemoved += before - tiers[tier].length;
  }
}
fs.writeFileSync(BF_PATH, `const QUALITY_BACKFILL = ${JSON.stringify(bf, null, 2)};\n\nexport default QUALITY_BACKFILL;\n`);

// 2. Add non-backfill bad entries to qualityBlacklist
const blSrc = fs.readFileSync(BL_PATH, "utf8");
const entriesMatch = blSrc.match(/const entries\s*=\s*(\[[\s\S]*?\n\]);/);
const existing = JSON.parse(entriesMatch[1]);
const keyOf = (e) => `${e.cat}|${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`;
const seen = new Set(existing.map(keyOf));

let blAdded = 0;
for (const e of badEntries) {
  if (e.file === "qualityBackfill") continue;
  const entry = { cat: e.cat, q: e.q, a: e.a, reason: `bad wiki image: ${e.reason}` };
  const k = keyOf(entry);
  if (seen.has(k)) continue;
  seen.add(k);
  existing.push(entry);
  blAdded++;
}

const newEntries = JSON.stringify(existing, null, 2);
const newSrc = blSrc.replace(/const entries\s*=\s*\[[\s\S]*?\n\];/, `const entries = ${newEntries};`);
fs.writeFileSync(BL_PATH, newSrc);

console.log(`Removed from backfill: ${bfRemoved}`);
console.log(`Added to blacklist: ${blAdded}`);
console.log(`New blacklist total: ${existing.length}`);

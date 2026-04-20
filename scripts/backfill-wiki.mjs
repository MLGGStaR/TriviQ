// For image-lookup who_* categories in qualityBackfill.js, backfill missing `wiki` fields
// by matching against agent15-who-image.json (and any other expansion files that include wiki).
import fs from "node:fs";
import path from "node:path";

const BACKFILL_PATH = "src/qualityBackfill.js";
const RESULTS_DIR = "audit/expansion-results";

const backfillMod = await import(`file:///${path.resolve(BACKFILL_PATH).replace(/\\/g, "/")}?c=${Date.now()}`);
const backfill = JSON.parse(JSON.stringify(backfillMod.default || {}));

const wikiMap = {};
for (const f of fs.readdirSync(RESULTS_DIR)) {
  if (!f.endsWith(".json")) continue;
  const data = JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, f), "utf8"));
  for (const [cat, tiers] of Object.entries(data)) {
    for (const tier of ["200", "400", "600"]) {
      for (const e of tiers?.[tier] || []) {
        if (!e.wiki) continue;
        const key = `${cat}|${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`;
        wikiMap[key] = e.wiki;
      }
    }
  }
}

let updated = 0;
for (const [cat, tiers] of Object.entries(backfill)) {
  for (const tier of ["200", "400", "600"]) {
    const arr = tiers?.[tier] || [];
    for (const e of arr) {
      if (e.wiki) continue;
      const key = `${cat}|${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`;
      if (wikiMap[key]) {
        e.wiki = wikiMap[key];
        updated++;
      }
    }
  }
}

fs.writeFileSync(
  BACKFILL_PATH,
  `const QUALITY_BACKFILL = ${JSON.stringify(backfill, null, 2)};\n\nexport default QUALITY_BACKFILL;\n`
);

console.log(`Backfilled wiki on ${updated} entries.`);

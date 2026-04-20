// Applies quality-fixes.json to qualityBackfill.js (remove / replace / move tier).
import fs from "node:fs";
import path from "node:path";

const BACKFILL_PATH = "src/qualityBackfill.js";
const FIXES_PATH = "audit/quality-fixes.json";

const backfillMod = await import(`file:///${path.resolve(BACKFILL_PATH).replace(/\\/g, "/")}?c=${Date.now()}`);
const backfill = JSON.parse(JSON.stringify(backfillMod.default || {}));
const fixes = JSON.parse(fs.readFileSync(FIXES_PATH, "utf8"));

let removed = 0, replaced = 0, moved = 0, missed = 0;

function findEntry(cat, tier, q) {
  const list = backfill[cat]?.[tier] || [];
  const idx = list.findIndex((e) => (e.q || "").trim() === q.trim());
  return idx;
}

// Removals
for (const r of fixes.remove || []) {
  const idx = findEntry(r.cat, r.tier, r.q);
  if (idx >= 0) {
    backfill[r.cat][r.tier].splice(idx, 1);
    removed++;
  } else {
    missed++;
    console.log(`REMOVE not found: ${r.cat}/${r.tier} "${r.q}"`);
  }
}

// Replacements
for (const r of fixes.replace || []) {
  const idx = findEntry(r.cat, r.tier, r.oldQ);
  if (idx >= 0) {
    backfill[r.cat][r.tier][idx] = { q: r.newQ, a: r.newA };
    replaced++;
  } else {
    missed++;
    console.log(`REPLACE not found: ${r.cat}/${r.tier} "${r.oldQ}"`);
  }
}

// Moves
for (const r of fixes.move || []) {
  const idx = findEntry(r.cat, r.fromTier, r.q);
  if (idx >= 0) {
    const [entry] = backfill[r.cat][r.fromTier].splice(idx, 1);
    if (!backfill[r.cat][r.toTier]) backfill[r.cat][r.toTier] = [];
    backfill[r.cat][r.toTier].push(entry);
    moved++;
  } else {
    missed++;
    console.log(`MOVE not found: ${r.cat}/${r.fromTier} "${r.q}"`);
  }
}

fs.writeFileSync(
  BACKFILL_PATH,
  `const QUALITY_BACKFILL = ${JSON.stringify(backfill, null, 2)};\n\nexport default QUALITY_BACKFILL;\n`
);

console.log(`\nRemoved: ${removed}`);
console.log(`Replaced: ${replaced}`);
console.log(`Moved: ${moved}`);
console.log(`Missed: ${missed}`);

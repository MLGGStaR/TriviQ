// Merge all audit/expansion-results/*.json into qualityBackfill.js.
// Deduplicates against existing backfill and against the blacklist.
import fs from "node:fs";
import path from "node:path";

const BACKFILL_PATH = "src/qualityBackfill.js";
const BLACKLIST_PATH = "src/qualityBlacklist.js";
const RESULTS_DIR = "audit/expansion-results";

// Load current backfill
const backfillMod = await import(`file:///${path.resolve(BACKFILL_PATH).replace(/\\/g, "/")}?c=${Date.now()}`);
const backfill = JSON.parse(JSON.stringify(backfillMod.default || {}));

// Load blacklist
const blacklistMod = await import(`file:///${path.resolve(BLACKLIST_PATH).replace(/\\/g, "/")}?c=${Date.now()}`);
const isBlacklisted = blacklistMod.isBlacklisted || (() => false);

// Load all category JSON exports so we can dedupe against existing source content
const existingByCat = {};
if (fs.existsSync("audit/per-cat")) {
  for (const f of fs.readdirSync("audit/per-cat")) {
    if (!f.endsWith(".json")) continue;
    const cat = f.replace(/\.json$/, "");
    try {
      const data = JSON.parse(fs.readFileSync(`audit/per-cat/${f}`, "utf8"));
      const set = new Set();
      for (const t of [200, 400, 600]) {
        for (const e of data[t] || []) {
          set.add(`${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`);
        }
      }
      existingByCat[cat] = set;
    } catch {}
  }
}

// Gather keys currently in backfill so we don't double-add
const backfillKeys = {};
for (const [cat, tiers] of Object.entries(backfill)) {
  backfillKeys[cat] = new Set();
  for (const tier of [200, 400, 600]) {
    for (const e of tiers?.[tier] || []) {
      backfillKeys[cat].add(`${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`);
    }
  }
}

let added = 0, skippedBL = 0, skippedExisting = 0, skippedDuplicateNew = 0, skippedBadEntry = 0;

const files = fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith(".json"));
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, f), "utf8"));
  for (const [cat, tiers] of Object.entries(data)) {
    if (!backfill[cat]) backfill[cat] = {};
    if (!backfillKeys[cat]) backfillKeys[cat] = new Set();
    for (const tier of ["200", "400", "600"]) {
      const arr = tiers?.[tier] || [];
      if (!backfill[cat][tier]) backfill[cat][tier] = [];
      for (const e of arr) {
        const q = (e.q || "").trim();
        const a = (e.a || "").trim();
        if (!q || !a) { skippedBadEntry++; continue; }
        // Reject entries with obvious placeholder text
        const aLow = a.toLowerCase();
        if (
          aLow.includes("skip") ||
          aLow.includes("correction") ||
          aLow.includes("not sure") ||
          aLow.includes("; skip") ||
          aLow.startsWith("not ") ||
          aLow === "none" ||
          aLow === "n/a" ||
          aLow === "na" ||
          aLow === "tbd" ||
          aLow === "unknown" ||
          aLow === "unclear" ||
          aLow.includes("placeholder") ||
          aLow.includes("not specified") ||
          aLow.includes("not named") ||
          aLow.includes("not applicable") ||
          aLow.includes("not revealed") ||
          aLow.includes("not canon") ||
          aLow.includes("not established")
        ) {
          skippedBadEntry++;
          continue;
        }
        // Reject questions that reference a previous question ("Wait, ...", "Actually, ...")
        const qLow = q.toLowerCase();
        if (qLow.startsWith("wait,") || qLow.startsWith("wait ") || qLow.startsWith("actually,")) {
          skippedBadEntry++;
          continue;
        }
        // Reject answer leaks
        if (a.length > 3 && qLow.includes(aLow)) { skippedBadEntry++; continue; }
        const key = `${qLow}|${aLow}`;
        if (backfillKeys[cat].has(key)) { skippedDuplicateNew++; continue; }
        if ((existingByCat[cat] || new Set()).has(key)) { skippedExisting++; continue; }
        if (isBlacklisted(cat, q, a)) { skippedBL++; continue; }
        const entry = { q, a };
        if (e.wiki) entry.wiki = e.wiki;
        backfill[cat][tier].push(entry);
        backfillKeys[cat].add(key);
        added++;
      }
    }
  }
}

fs.writeFileSync(BACKFILL_PATH, `const QUALITY_BACKFILL = ${JSON.stringify(backfill, null, 2)};\n\nexport default QUALITY_BACKFILL;\n`);

console.log(`Added ${added} new questions`);
console.log(`  skipped (already in backfill): ${skippedDuplicateNew}`);
console.log(`  skipped (already in source): ${skippedExisting}`);
console.log(`  skipped (blacklisted): ${skippedBL}`);
console.log(`  skipped (bad entry): ${skippedBadEntry}`);

// Remove country_emoji, general_emoji, movie_show_emoji blocks from all source files.
import fs from "node:fs";
import path from "node:path";

const FILES = [
  "src/emojiGuessCategories.js",
  "src/moreTriviaExpansions.js",
  "src/triviaTierFinalParityExpansions.js",
  "src/triviaTierParityExpansions.js",
  "src/triviaMegaExpansions.js",
];
const CATS = ["country_emoji", "general_emoji", "movie_show_emoji"];

for (const f of FILES) {
  let src = fs.readFileSync(f, "utf8");
  let totalRemoved = 0;
  for (const cat of CATS) {
    // Match the cat block: `  cat: { ... },` at top level (indented with 2 spaces).
    // Strategy: find start marker, then walk braces to find matching close.
    const startRe = new RegExp(`^  ${cat}:\\s*\\{`, "m");
    let m;
    while ((m = startRe.exec(src)) !== null) {
      const start = m.index;
      let i = start + m[0].length; // position right after `{`
      let depth = 1;
      while (i < src.length && depth > 0) {
        const ch = src[i];
        if (ch === "{") depth++;
        else if (ch === "}") depth--;
        i++;
      }
      // Consume trailing comma + newline if present.
      while (i < src.length && /[,\s]/.test(src[i])) i++;
      // Remove from start to end of trailing whitespace.
      const removed = src.slice(start, i);
      src = src.slice(0, start) + src.slice(i);
      totalRemoved += removed.length;
      startRe.lastIndex = 0; // reset for next iteration
    }
  }
  fs.writeFileSync(f, src);
  console.log(`${f}: removed ${totalRemoved} chars`);
}

// Also purge from qualityBackfill
const bfMod = await import(`file:///${path.resolve("src/qualityBackfill.js").replace(/\\/g, "/")}?c=${Date.now()}`);
const bf = JSON.parse(JSON.stringify(bfMod.default || {}));
let bfRemoved = 0;
for (const cat of CATS) {
  if (bf[cat]) {
    delete bf[cat];
    bfRemoved++;
  }
}
fs.writeFileSync("src/qualityBackfill.js", `const QUALITY_BACKFILL = ${JSON.stringify(bf, null, 2)};\n\nexport default QUALITY_BACKFILL;\n`);
console.log(`qualityBackfill: removed ${bfRemoved} cat keys`);

// Purge blacklist entries that target these cats
let bl = fs.readFileSync("src/qualityBlacklist.js", "utf8");
const entries = JSON.parse(bl.match(/const entries\s*=\s*(\[[\s\S]*?\n\]);/)[1]);
const before = entries.length;
const filtered = entries.filter((e) => !CATS.includes(e.cat));
bl = bl.replace(/const entries\s*=\s*\[[\s\S]*?\n\];/, `const entries = ${JSON.stringify(filtered, null, 2)};`);
fs.writeFileSync("src/qualityBlacklist.js", bl);
console.log(`qualityBlacklist: removed ${before - filtered.length} entries`);

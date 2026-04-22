// Finds and blacklists all entries matching essay-style / bad-pattern question regex
// that the user has repeatedly said should never exist.
import fs from "node:fs";
import path from "node:path";

const BAD_Q = /\bsignificance\b|\bdifference between\b|\bdescribe\b|\bexplain\b|\bdeeper theme\b|\bpsychological\b|\breal meaning\b|\bsatire target\b|\bcontribution\b|\bcontroversy\b|\bcosmology\b|\bdeepest lore\b|\bcritical reception\b|\bhistorical accuracy\b|\baccuracy level\b|\bwhy is.*important\b|\bwhy is.*significant\b|\bwhat makes.*unique\b|\bwhat is the meaning of\b/i;
const MULTIPART_Q = /\band what\b|\band why\b|\band who\b|\bdifference between\b|\bwhat opened it\b/i;

const BANKS = [
  "triviaExpansions","triviaMinimums","triviaMegaExpansions","triviaUltraExpansions",
  "triviaTierBalanceExpansions","triviaTierParityExpansions","triviaTierFinalParityExpansions",
  "triviaTierFinalTopoffExpansions","newCategoriesBank","megaNewExpansions","moreTriviaExpansions",
  "newCategoriesPack2","logoCategoriesBank","emojiGuessCategories","qualityBackfill",
];

const flagged = [];
for (const f of BANKS) {
  const mod = await import(`../src/${f}.js`);
  const bank = mod.default || {};
  for (const [cat, obj] of Object.entries(bank)) {
    for (const t of [200, 400, 600]) {
      for (const e of obj?.[t] || []) {
        const q = e.q || "";
        if (BAD_Q.test(q) || MULTIPART_Q.test(q)) {
          flagged.push({ cat, q, a: e.a, reason: "essay/multipart pattern", file: f });
        }
      }
    }
  }
}
// Also scan App.jsx inline
const app = fs.readFileSync("src/App.jsx", "utf8");
const catRe = /^  ([a-z_]+):\{([\s\S]*?)^  \},?$/gm;
let m;
while ((m = catRe.exec(app)) !== null) {
  const id = m[1];
  const body = m[2];
  for (const t of [200, 400, 600]) {
    const tierRe = new RegExp("\\b" + t + ":\\[([\\s\\S]*?)\\](?=,|\\s*\\})");
    const tm = body.match(tierRe);
    if (!tm) continue;
    const itemRe = /\{q:"((?:[^"\\]|\\.)*)",a:"((?:[^"\\]|\\.)*)"/g;
    let im;
    while ((im = itemRe.exec(tm[1])) !== null) {
      if (BAD_Q.test(im[1]) || MULTIPART_Q.test(im[1])) {
        flagged.push({ cat: id, q: im[1], a: im[2], reason: "essay/multipart pattern", file: "App.jsx" });
      }
    }
  }
}

fs.writeFileSync("audit/essay-pattern-blacklist.json", JSON.stringify({ flagged }, null, 2));
console.log(`Flagged ${flagged.length} essay-style/multipart entries.`);

// Append to qualityBlacklist.js
const BL_PATH = "src/qualityBlacklist.js";
const blSrc = fs.readFileSync(BL_PATH, "utf8");
const entriesMatch = blSrc.match(/const entries\s*=\s*(\[[\s\S]*?\n\]);/);
const existing = JSON.parse(entriesMatch[1]);
const keyOf = (e) => `${e.cat}|${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`;
const seen = new Set(existing.map(keyOf));

let added = 0;
for (const e of flagged) {
  const entry = { cat: e.cat, q: e.q, a: e.a, reason: e.reason };
  const k = keyOf(entry);
  if (seen.has(k)) continue;
  seen.add(k);
  existing.push(entry);
  added++;
}

const newSrc = blSrc.replace(/const entries\s*=\s*\[[\s\S]*?\n\];/, `const entries = ${JSON.stringify(existing, null, 2)};`);
fs.writeFileSync(BL_PATH, newSrc);

console.log(`Added ${added} new blacklist entries. Total: ${existing.length}.`);

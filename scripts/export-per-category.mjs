// Export each category's full question list to a JSON file for agents to review.
import fs from "node:fs";
import path from "node:path";

const sourceFiles = [
  "triviaExpansions","triviaMinimums","triviaMegaExpansions","triviaUltraExpansions",
  "triviaTierBalanceExpansions","triviaTierParityExpansions","triviaTierFinalParityExpansions",
  "triviaTierFinalTopoffExpansions","newCategoriesBank","newCategoriesPack2",
  "moreTriviaExpansions","megaNewExpansions","emojiGuessCategories","logoCategoriesBank",
  "qualityBackfill",
];
const qr = await import("../src/questionRefinements.js");

const byCat = {};
function pushEntry(catId, tier, entry, file) {
  if (!byCat[catId]) byCat[catId] = { 200: [], 400: [], 600: [] };
  byCat[catId][tier].push({ ...entry, file });
}

for (const f of sourceFiles) {
  const mod = await import(`../src/${f}.js`);
  const bank = mod.default || {};
  for (const [catId, catData] of Object.entries(bank)) {
    for (const t of [200,400,600]) {
      const rows = Array.isArray(catData?.[t]) ? catData[t] : [];
      rows.forEach((e) => { if (e?.q) pushEntry(catId, t, e, f); });
    }
  }
}

// questionRefinements QUESTION_REFINEMENT_ADDITIONS
if (qr.QUESTION_REFINEMENT_ADDITIONS) {
  for (const [catId, catData] of Object.entries(qr.QUESTION_REFINEMENT_ADDITIONS)) {
    for (const t of [200,400,600]) {
      const rows = Array.isArray(catData?.[t]) ? catData[t] : [];
      rows.forEach((e) => { if (e?.q) pushEntry(catId, t, e, "questionRefinements"); });
    }
  }
}

// App.jsx inline
const app = fs.readFileSync("src/App.jsx","utf8");
const catRe = /^  ([a-z_]+):\{([\s\S]*?)^  \},?$/gm;
let m;
while ((m = catRe.exec(app)) !== null) {
  const id = m[1];
  const body = m[2];
  for (const t of [200,400,600]) {
    const tierRe = new RegExp("\\b" + t + ":\\[([\\s\\S]*?)\\](?=,|\\s*\\})");
    const tm = body.match(tierRe);
    if (!tm) continue;
    const itemRe = /\{q:"((?:[^"\\]|\\.)*)",a:"((?:[^"\\]|\\.)*)"(?:,wiki:"((?:[^"\\]|\\.)*)")?/g;
    let im;
    while ((im = itemRe.exec(tm[1])) !== null) {
      pushEntry(id, t, { q: im[1], a: im[2], wiki: im[3] }, "App.jsx");
    }
  }
}

const outDir = "audit/per-cat";
fs.mkdirSync(outDir, { recursive: true });
for (const [cat, tiers] of Object.entries(byCat)) {
  fs.writeFileSync(path.join(outDir, cat + ".json"), JSON.stringify(tiers, null, 2));
}
console.log(`Wrote ${Object.keys(byCat).length} category files to ${outDir}/`);

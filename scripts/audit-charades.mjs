// Audit all charades entries: flag anything >5 words or with vague phrasing.
import fs from "node:fs";

const sourceFiles = [
  "triviaExpansions","triviaMinimums","triviaMegaExpansions","triviaUltraExpansions",
  "triviaTierBalanceExpansions","triviaTierParityExpansions","triviaTierFinalParityExpansions",
  "triviaTierFinalTopoffExpansions","newCategoriesBank","newCategoriesPack2",
  "moreTriviaExpansions","megaNewExpansions",
];

const byCat = { charades_general: { 200: [], 400: [], 600: [] }, charades_scenarios: { 200: [], 400: [], 600: [] }, charades_movies: { 200: [], 400: [], 600: [] } };

for (const f of sourceFiles) {
  const mod = await import(`../src/${f}.js`);
  const bank = mod.default || {};
  for (const cat of Object.keys(byCat)) {
    const c = bank[cat];
    if (!c) continue;
    for (const t of [200, 400, 600]) {
      const rows = Array.isArray(c[t]) ? c[t] : [];
      rows.forEach((e) => { if (e?.q && e?.a) byCat[cat][t].push({ ...e, file: f }); });
    }
  }
}
const qr = await import("../src/questionRefinements.js");
if (qr.QUESTION_REFINEMENT_ADDITIONS) {
  for (const cat of Object.keys(byCat)) {
    const c = qr.QUESTION_REFINEMENT_ADDITIONS[cat];
    if (!c) continue;
    for (const t of [200, 400, 600]) {
      const rows = Array.isArray(c[t]) ? c[t] : [];
      rows.forEach((e) => { if (e?.q && e?.a) byCat[cat][t].push({ ...e, file: "questionRefinements" }); });
    }
  }
}

for (const cat of Object.keys(byCat)) {
  console.log(`\n===== ${cat} =====`);
  for (const t of [200, 400, 600]) {
    const long = byCat[cat][t].filter((e) => (e.a || "").split(/\s+/).length > 5);
    console.log(`-- tier ${t}: ${byCat[cat][t].length} entries, ${long.length} over 5 words`);
    long.slice(0, 15).forEach((e) => {
      console.log(`  ${(e.a || "").split(/\s+/).length}w: "${e.a}"`);
    });
  }
}

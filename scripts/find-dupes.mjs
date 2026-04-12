// Finds questions with the same answer within the same category (different phrasing = duplicates)
import fs from "node:fs";

const files = [
  "src/App.jsx",
  "src/newCategoriesBank.js",
  "src/megaNewExpansions.js",
  "src/triviaExpansions.js",
  "src/triviaMegaExpansions.js",
  "src/triviaUltraExpansions.js",
  "src/triviaMinimums.js",
  "src/triviaTierBalanceExpansions.js",
  "src/triviaTierParityExpansions.js",
  "src/triviaTierFinalParityExpansions.js",
  "src/triviaTierFinalTopoffExpansions.js",
  "src/moreTriviaExpansions.js",
  "src/questionRefinements.js",
  "src/emojiGuessCategories.js",
];

const entries = [];

for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const lines = src.split("\n");

  let currentCat = null;
  let currentTier = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect category
    const catMatch = line.match(/^\s*([a-z_]+)\s*:\s*\{/);
    if (catMatch && !["200", "400", "600", "label", "icon", "color"].includes(catMatch[1])) {
      currentCat = catMatch[1];
    }

    // Detect tier
    const tierMatch = line.match(/\b(200|400|600)\s*:\s*[\[(]/);
    if (tierMatch) currentTier = tierMatch[1];

    // Extract Q/A — inline {q:"...",a:"..."}
    const re1 = /\{q:"([^"]*)",a:"([^"]*)"/g;
    let m;
    while ((m = re1.exec(line)) !== null) {
      if (currentCat) entries.push({ cat: currentCat, tier: currentTier, q: m[1], a: m[2], file: f, line: i + 1 });
    }

    // Extract Q/A — array ["...", "..."]
    const re2 = /\["([^"]*)",\s*"([^"]*)"\]/g;
    while ((m = re2.exec(line)) !== null) {
      // Skip non-question arrays (who entries have wiki as 3rd element checked separately)
      if (currentCat) entries.push({ cat: currentCat, tier: currentTier, q: m[1], a: m[2], file: f, line: i + 1 });
    }
  }
}

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

// Group by category + normalized answer
const groups = {};
for (const e of entries) {
  const key = e.cat + "|" + norm(e.a);
  if (!groups[key]) groups[key] = [];
  groups[key].push(e);
}

// Find groups with >1 entry AND different question text
let count = 0;
for (const [key, group] of Object.entries(groups)) {
  if (group.length <= 1) continue;
  const uniqueQs = new Set(group.map((e) => norm(e.q)));
  if (uniqueQs.size <= 1) continue; // exact same question text, handled by dedup

  console.log(`\n--- ${group[0].cat} | answer: "${group[0].a}" (${group.length}x) ---`);
  for (const e of group) {
    console.log(`  ${e.file}:${e.line} [${e.tier}] "${e.q}"`);
  }
  count++;
}
console.log(`\n\nTotal duplicate-answer groups: ${count}`);

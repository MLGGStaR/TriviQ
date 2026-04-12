// Removes duplicate questions (same answer + similar question text) from expansion files.
// Keeps the RAW_BANK (App.jsx) version as the "original", removes from expansion files.
import fs from "node:fs";

// Extract all Q/A from App.jsx RAW_BANK as the baseline
const appSrc = fs.readFileSync("src/App.jsx", "utf8");

function extractQA(src) {
  const results = [];
  const re1 = /\{q:"([^"]*)",a:"([^"]*)"/g;
  let m;
  while ((m = re1.exec(src)) !== null) results.push({ q: m[1], a: m[2] });
  const re2 = /\["([^"]*)",\s*"([^"]*)"\]/g;
  while ((m = re2.exec(src)) !== null) results.push({ q: m[1], a: m[2] });
  return results;
}

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function normAnswer(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Get important words (>3 chars, not stop words)
const STOP = new Set("what which when where does that this with from have been into they them their whose whom about these those also just very most more than some were before after each every only other over such just then will back also been call come could even find first give have here just know last look make many most must name only over part some take tell than that them then they this come want year your".split(" "));
function keyWords(s) {
  return norm(s).split(" ").filter(w => w.length > 3 && !STOP.has(w));
}

function isSimilar(q1, q2) {
  const w1 = new Set(keyWords(q1));
  const w2 = new Set(keyWords(q2));
  if (w1.size === 0 || w2.size === 0) return false;
  let overlap = 0;
  for (const w of w1) if (w2.has(w)) overlap++;
  const smaller = Math.min(w1.size, w2.size);
  return overlap / smaller >= 0.5; // 50%+ key word overlap
}

// Build baseline from App.jsx
const baseline = extractQA(appSrc);
const baselineByAnswer = {};
for (const e of baseline) {
  const key = normAnswer(e.a);
  if (!baselineByAnswer[key]) baselineByAnswer[key] = [];
  baselineByAnswer[key].push(e);
}

// Process each expansion file
const expansionFiles = [
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
];

// Also cross-check expansion files against each other
const allSeen = {};
for (const e of baseline) {
  const key = normAnswer(e.a);
  if (!allSeen[key]) allSeen[key] = [];
  allSeen[key].push({ ...e, file: "src/App.jsx" });
}

let totalRemoved = 0;

for (const file of expansionFiles) {
  let src = fs.readFileSync(file, "utf8");
  const lines = src.split("\n");
  const toRemove = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match ["q", "a"] format
    const m2 = line.match(/\["([^"]*)",\s*"([^"]*)"\]/);
    // Match {q:"...",a:"..."} format
    const m1 = line.match(/\{q:"([^"]*)",a:"([^"]*)"/);
    const m = m2 || m1;
    if (!m) continue;
    const q = m[1];
    const a = m[2];
    const aKey = normAnswer(a);

    // Check against all previously seen questions with same answer
    const group = allSeen[aKey] || [];
    let isDupe = false;
    for (const prev of group) {
      if (prev.file === file && prev.q === q) continue; // same exact entry
      if (isSimilar(q, prev.q)) {
        isDupe = true;
        console.log(`REMOVE ${file}:${i + 1}  "${q}" => "${a}"`);
        console.log(`  DUPE OF ${prev.file}: "${prev.q}"`);
        break;
      }
    }

    if (isDupe) {
      toRemove.add(i);
      totalRemoved++;
    } else {
      if (!allSeen[aKey]) allSeen[aKey] = [];
      allSeen[aKey].push({ q, a, file });
    }
  }

  if (toRemove.size > 0) {
    const newLines = lines.filter((_, i) => !toRemove.has(i));
    // Clean up dangling commas / empty arrays
    let cleaned = newLines.join("\n");
    // Remove empty qa([]) or empty arrays left behind
    cleaned = cleaned.replace(/qa\(\[\s*\]\)/g, "qa([])");
    fs.writeFileSync(file, cleaned);
    console.log(`\n  → Removed ${toRemove.size} from ${file}\n`);
  }
}

console.log(`\nTotal duplicates removed: ${totalRemoved}`);

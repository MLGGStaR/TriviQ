// Removes entries where the answer (or significant answer phrase) appears verbatim in the question.
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
];

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

// Returns true if the core answer phrase (dropping leading "the/a/an") is a substring of question
function isLeak(q, a) {
  const nq = " " + norm(q) + " ";
  // Core answer — strip articles and common qualifiers
  let core = norm(a).replace(/^(the |a |an )/, "").trim();
  // Also try dropping parenthetical like "(raw)"
  core = core.replace(/\s*\(.*\)/g, "").trim();
  if (core.length < 3) return false;
  // If the full core phrase is in the question
  if (nq.includes(" " + core + " ")) return true;
  // Also try without trailing "s"
  if (core.endsWith("s") && nq.includes(" " + core.slice(0, -1) + " ")) return true;
  return false;
}

// Lines to PROTECT — these are image-guess who() entries where q gets defaulted
// Check: files with `const who = (pairs) => pairs.map(([a, wiki, q`
const WHO_FORMAT_FILES = new Set();
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  if (/const who = \(pairs\) =>.*\[a, wiki/.test(src)) WHO_FORMAT_FILES.add(f);
}

let removed = 0;
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const lines = src.split("\n");
  const out = [];
  let inWhoBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Track if we're inside a who([ block
    if (/\bwho\(\[/.test(line)) inWhoBlock = true;
    if (inWhoBlock && /\]\)/.test(line)) inWhoBlock = false;

    // For array-format line with exactly 2 strings in who context, skip leak check (it's image-guess)
    if (WHO_FORMAT_FILES.has(f) && inWhoBlock) {
      out.push(line);
      continue;
    }

    const re1 = /\{q:"([^"]*)",a:"([^"]*)"/;
    const re2 = /\["([^"]*)",\s*"([^"]*)"\]/;
    const m = line.match(re1) || line.match(re2);
    if (!m) {
      out.push(line);
      continue;
    }
    const q = m[1];
    const a = m[2];
    if (!q || q.length < 12) { out.push(line); continue; }
    if (isLeak(q, a)) {
      removed++;
      console.log(`[${f}:${i+1}] "${q}" => "${a}"`);
      continue; // drop line
    }
    out.push(line);
  }
  fs.writeFileSync(f, out.join("\n"));
}
console.log(`\nRemoved ${removed} leaked entries`);

// Apply language off-topic + broken-answers blacklists.
import fs from "node:fs";

const BL_PATH = "src/qualityBlacklist.js";
const blSrc = fs.readFileSync(BL_PATH, "utf8");
const m = blSrc.match(/const entries\s*=\s*(\[[\s\S]*?\n\]);/);
const existing = JSON.parse(m[1]);
const keyOf = (e) => `${e.cat}|${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`;
const seen = new Set(existing.map(keyOf));

function append(arr, reasonLabel) {
  let n = 0;
  for (const e of arr || []) {
    const entry = { cat: e.cat, q: e.q, a: e.a, reason: e.reason || reasonLabel };
    const k = keyOf(entry);
    if (seen.has(k)) continue;
    seen.add(k);
    existing.push(entry);
    n++;
  }
  return n;
}

const lang = JSON.parse(fs.readFileSync("audit/language-blacklist.json", "utf8"));
const broken = JSON.parse(fs.readFileSync("audit/broken-answers.json", "utf8"));

const langAdded = append(lang.offTopic, "off-topic for language category");
const brokenAdded = append(broken.broken, "answer doesn't answer the question");

// Also optionally apply v2 easy-200 if it exists
let easyAdded = 0;
if (fs.existsSync("audit/easy-200-blacklist-v2.json")) {
  const easy = JSON.parse(fs.readFileSync("audit/easy-200-blacklist-v2.json", "utf8"));
  easyAdded = append(easy.tooEasy, "too easy for tier 200 (second pass)");
}

const newSrc = blSrc.replace(/const entries\s*=\s*\[[\s\S]*?\n\];/, `const entries = ${JSON.stringify(existing, null, 2)};`);
fs.writeFileSync(BL_PATH, newSrc);

console.log(`Added: lang ${langAdded}, broken ${brokenAdded}, easy-v2 ${easyAdded}`);
console.log(`Total blacklist entries: ${existing.length}`);

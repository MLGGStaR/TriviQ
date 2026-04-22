// Wire more young-celeb entries: add DIRECT_URL_OVERRIDES, append to App.jsx cat block.
import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("audit/young-celeb-urls-more.json", "utf8"));
const celebs = data.celebrities || [];

// Build new entries + URL overrides
const byTier = { 200: [], 400: [], 600: [] };
const directUrls = {};
for (const c of celebs) {
  const slug = `Young_${c.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "")}`;
  byTier[c.tier] ||= [];
  byTier[c.tier].push({ slug, name: c.name });
  directUrls[slug] = c.youngImageUrl;
}

// 1. Add to generate-whoami-images.mjs DIRECT_URL_OVERRIDES
let genScript = fs.readFileSync("scripts/generate-whoami-images.mjs", "utf8");
const additions = Object.entries(directUrls).map(([k, v]) => `  ${k}: "${v}",`).join("\n");
genScript = genScript.replace(/(const DIRECT_URL_OVERRIDES = \{[\s\S]*?)\n\};/, `$1\n${additions}\n};`);
fs.writeFileSync("scripts/generate-whoami-images.mjs", genScript);
console.log(`Added ${Object.keys(directUrls).length} DIRECT_URL_OVERRIDES`);

// 2. Append entries to App.jsx guess_young_celebrity cat
let app = fs.readFileSync("src/App.jsx", "utf8");
function escQ(s) { return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }
function appendTier(src, catName, tier, linesToAppend) {
  const re = new RegExp(`(^\\s*${catName}:\\{[\\s\\S]*?\\b${tier}:\\[[\\s\\S]*?)(\\n\\s*\\],)`, "m");
  return src.replace(re, `$1\n${linesToAppend}$2`);
}

let applied = 0;
for (const tier of [200, 400, 600]) {
  const arr = byTier[tier] || [];
  if (arr.length === 0) continue;
  const lines = arr.map((c) =>
    `    {q:"Guess the celebrity from this young photo",a:"${escQ(c.name)}",wiki:"${c.slug}"},`
  ).join("\n");
  const before = app.length;
  app = appendTier(app, "guess_young_celebrity", tier, lines);
  if (app.length !== before) {
    applied++;
    console.log(`appended ${arr.length} to guess_young_celebrity/${tier}`);
  } else {
    console.log(`FAILED to find block for guess_young_celebrity/${tier}`);
  }
}
fs.writeFileSync("src/App.jsx", app);
console.log(`Applied ${applied} tiers.`);

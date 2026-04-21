// Append entries from -more.json files into existing cat blocks in App.jsx.
import fs from "node:fs";

const artistMore = JSON.parse(fs.readFileSync("audit/expansion-results/cat-who-artist-more.json", "utf8"));
const capitalsMore = JSON.parse(fs.readFileSync("audit/expansion-results/cat-country-capitals-more.json", "utf8"));
const spellMore = JSON.parse(fs.readFileSync("audit/expansion-results/cat-spelling-bee-more.json", "utf8"));

function escQ(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// Build a mapping: catName → { tier → lines_to_append }
function buildInserts(data, catName) {
  const out = {};
  for (const tier of [200, 400, 600]) {
    const arr = data[catName][tier] || [];
    out[tier] = arr.map((e) => {
      const parts = [`q:"${escQ(e.q)}"`, `a:"${escQ(e.a)}"`];
      if (e.wiki) parts.push(`wiki:"${escQ(e.wiki)}"`);
      return `    {${parts.join(",")}},`;
    }).join("\n");
  }
  return out;
}

let app = fs.readFileSync("src/App.jsx", "utf8");

// Appends new lines inside the tier array of a given cat. Finds "<cat>:{...200:[...]...}".
function appendTier(src, catName, tier, linesToAppend) {
  // Match the cat block up to its closing "},\n\n" or "},"
  const re = new RegExp(
    `(^\\s*${catName}:\\{[\\s\\S]*?\\b${tier}:\\[[\\s\\S]*?)(\\n\\s*\\],)`,
    "m"
  );
  return src.replace(re, `$1\n${linesToAppend}$2`);
}

const inserts = {
  who_artist: buildInserts(artistMore, "who_artist"),
  country_capitals: buildInserts(capitalsMore, "country_capitals"),
  spelling_bee: buildInserts(spellMore, "spelling_bee"),
};

let applied = 0;
for (const [cat, tiers] of Object.entries(inserts)) {
  for (const tier of [200, 400, 600]) {
    if (!tiers[tier]) continue;
    const before = app.length;
    app = appendTier(app, cat, tier, tiers[tier]);
    if (app.length === before) {
      console.warn(`WARN: couldn't append to ${cat}/${tier}`);
    } else {
      applied++;
    }
  }
}

fs.writeFileSync("src/App.jsx", app);
console.log(`Applied tiers: ${applied}/9`);

// Report new totals
const artistCount = Object.values(artistMore.who_artist).reduce((s, a) => s + a.length, 0);
const capitalsCount = Object.values(capitalsMore.country_capitals).reduce((s, a) => s + a.length, 0);
const spellCount = Object.values(spellMore.spelling_bee).reduce((s, a) => s + a.length, 0);
console.log(`Added: who_artist +${artistCount}, country_capitals +${capitalsCount}, spelling_bee +${spellCount}`);

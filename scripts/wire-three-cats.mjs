// Generate inline App.jsx blocks for who_artist, country_capitals, spelling_bee.
import fs from "node:fs";

const artistData = JSON.parse(fs.readFileSync("audit/expansion-results/cat-who-artist.json", "utf8"));
const capitalData = JSON.parse(fs.readFileSync("audit/expansion-results/cat-country-capitals.json", "utf8"));
const spellData = JSON.parse(fs.readFileSync("audit/expansion-results/cat-spelling-bee.json", "utf8"));

function escQ(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildBlock(catName, header, data) {
  const lines = [`  ${catName}:${header}`];
  for (const tier of [200, 400, 600]) {
    const arr = data[catName][tier] || [];
    lines.push(`  ${tier}:[`);
    for (const e of arr) {
      const parts = [`q:"${escQ(e.q)}"`, `a:"${escQ(e.a)}"`];
      if (e.wiki) parts.push(`wiki:"${escQ(e.wiki)}"`);
      lines.push(`    {${parts.join(",")}},`);
    }
    lines.push("  ],");
  }
  lines.push("  },");
  return lines.join("\n");
}

const artistBlock = buildBlock(
  "who_artist",
  `{label:"Which Artist Am I?",icon:"\\u{1F3A4}",color:"#9333EA",isWhoAmI:true,`,
  artistData
);

const capitalBlock = buildBlock(
  "country_capitals",
  `{label:"Country Capitals",icon:"\\u{1F5FA}\\uFE0F",color:"#0EA5E9",capitalsMode:true,`,
  capitalData
);

const spellBlock = buildBlock(
  "spelling_bee",
  `{label:"Spelling Bee",icon:"\\u{1F41D}",color:"#D97706",isSpellingBee:true,`,
  spellData
);

const combined = [artistBlock, capitalBlock, spellBlock].join("\n\n") + "\n";
fs.writeFileSync("audit/three-cats-block.txt", combined);

console.log("who_artist:", artistData.who_artist[200].length, "/", artistData.who_artist[400].length, "/", artistData.who_artist[600].length);
console.log("country_capitals:", capitalData.country_capitals[200].length, "/", capitalData.country_capitals[400].length, "/", capitalData.country_capitals[600].length);
console.log("spelling_bee:", spellData.spelling_bee[200].length, "/", spellData.spelling_bee[400].length, "/", spellData.spelling_bee[600].length);
console.log("Wrote audit/three-cats-block.txt");

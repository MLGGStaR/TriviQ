// Generates JS snippets to insert guess_the_price and guess_young_celebrity into App.jsx,
// plus DIRECT_URL_OVERRIDES entries for the generate-whoami-images.mjs script.
import fs from "node:fs";

const priceData = JSON.parse(fs.readFileSync("audit/expansion-results/cat-guess-price.json", "utf8"));
const celebData = JSON.parse(fs.readFileSync("audit/young-celeb-urls.json", "utf8"));

function escQ(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// --- guess_the_price cat block (inline App.jsx style) ---
const priceLines = [
  `  guess_the_price:{label:"Guess The Price",icon:"\\u{1F4B0}",color:"#F59E0B",isWhoAmI:true,priceMode:true,`,
];
for (const tier of [200, 400, 600]) {
  const arr = priceData.guess_the_price[tier] || [];
  priceLines.push(`  ${tier}:[`);
  for (const e of arr) {
    priceLines.push(`    {q:"${escQ(e.q)}",a:"${escQ(e.a)}",wiki:"${escQ(e.wiki)}"},`);
  }
  priceLines.push("  ],");
}
priceLines.push("  },");

// --- guess_young_celebrity cat block ---
// Unique wiki slug prefix so it doesn't conflict with real Wikipedia lookups.
const celebLines = [
  `  guess_young_celebrity:{label:"Guess The Young Celebrity",icon:"\\u{1F6BC}",color:"#F472B6",isWhoAmI:true,`,
];
const byTier = { 200: [], 400: [], 600: [] };
for (const c of celebData.celebrities) {
  byTier[c.tier] ||= [];
  byTier[c.tier].push(c);
}
const directUrls = {};
for (const tier of [200, 400, 600]) {
  const arr = byTier[tier] || [];
  celebLines.push(`  ${tier}:[`);
  for (const c of arr) {
    const slug = `Young_${c.name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "")}`;
    celebLines.push(`    {q:"Guess the celebrity from this young photo",a:"${escQ(c.name)}",wiki:"${slug}"},`);
    directUrls[slug] = c.youngImageUrl;
  }
  celebLines.push("  ],");
}
celebLines.push("  },");

fs.writeFileSync("audit/new-cats-block.txt", priceLines.join("\n") + "\n\n" + celebLines.join("\n") + "\n");
fs.writeFileSync("audit/new-cats-direct-urls.json", JSON.stringify(directUrls, null, 2));

console.log("guess_the_price entries:", priceData.guess_the_price[200].length, "/", priceData.guess_the_price[400].length, "/", priceData.guess_the_price[600].length);
console.log("guess_young_celebrity entries:", byTier[200].length, "/", byTier[400].length, "/", byTier[600].length);
console.log("DIRECT_URL_OVERRIDES to add:", Object.keys(directUrls).length);
console.log("Wrote audit/new-cats-block.txt + audit/new-cats-direct-urls.json");

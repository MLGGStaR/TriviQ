// Append entries from cat-floor-backfill.json into matching inline App.jsx cat blocks.
import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("audit/expansion-results/cat-floor-backfill.json", "utf8"));
let app = fs.readFileSync("src/App.jsx", "utf8");

function escQ(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function appendTier(src, catName, tier, linesToAppend) {
  const re = new RegExp(`(^\\s*${catName}:\\{[\\s\\S]*?\\b${tier}:\\[[\\s\\S]*?)(\\n\\s*\\],)`, "m");
  return src.replace(re, `$1\n${linesToAppend}$2`);
}

let applied = 0;
for (const [cat, tierObj] of Object.entries(data)) {
  for (const tier of ["200", "400", "600"]) {
    const arr = tierObj[tier] || [];
    if (arr.length === 0) continue;
    const lines = arr
      .map((e) => {
        const parts = [`q:"${escQ(e.q)}"`, `a:"${escQ(e.a)}"`];
        if (e.wiki) parts.push(`wiki:"${escQ(e.wiki)}"`);
        return `    {${parts.join(",")}},`;
      })
      .join("\n");
    const before = app.length;
    app = appendTier(app, cat, tier, lines);
    if (app.length !== before) {
      applied++;
      console.log(`appended ${arr.length} to ${cat}/${tier}`);
    } else {
      console.log(`FAILED to find block for ${cat}/${tier}`);
    }
  }
}

fs.writeFileSync("src/App.jsx", app);
console.log(`Applied ${applied} tiers.`);

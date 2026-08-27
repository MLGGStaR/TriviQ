// Emit the active category list (id, label, icon, group, current preview srcs) as JSON for tooling/agents.
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

// 1. Category metadata from RAW_BANK literals in App.jsx:  id:{ label:"...",icon:"...",color:"...",
const meta = {};
const metaRe = /^  ([a-z_0-9]+):\{\s*label:"((?:[^"\\]|\\.)*)",\s*icon:"((?:[^"\\]|\\.)*)"/gm;
let m;
const unescape = (s) => { try { return Function(`return "${s}"`)(); } catch { return s; } };
while ((m = metaRe.exec(app)) !== null) meta[m[1]] = { id: m[1], label: unescape(m[2]), icon: unescape(m[3]) };

// 2. Category packs that live in separate modules (label/icon objects keyed by id)
const packFiles = ["newCategoriesBank", "newCategoriesPack2", "logoCategoriesBank", "megaNewExpansions"];
for (const f of packFiles) {
  try {
    const mod = await import(`../src/${f}.js`);
    const bank = mod.default || Object.values(mod)[0] || {};
    for (const [id, obj] of Object.entries(bank)) {
      if (obj && typeof obj === "object" && obj.label && !meta[id]) meta[id] = { id, label: obj.label, icon: obj.icon || "" };
    }
  } catch {}
}

// 3. Groups from CATEGORY_GROUPS (label + ids)
const groups = {};
const groupBlock = app.match(/const CATEGORY_GROUPS\s*=\s*\[([\s\S]*?)\n\];/);
if (groupBlock) {
  const gRe = /\{\s*(?:id|key)?:?"?([a-z_]*)"?,?\s*label:"([^"]+)"[^\]]*?(?:ids|cats|categories):\[([^\]]*)\]/g;
  let g;
  while ((g = gRe.exec(groupBlock[1])) !== null) {
    for (const id of g[3].split(",").map((s) => s.trim().replace(/^"|"$/g, "")).filter(Boolean)) groups[id] = g[2];
  }
}

// 4. Current preview sources
const previews = {};
const pBlock = app.match(/const CATEGORY_PREVIEWS = \{([\s\S]*?)\n\};/);
if (pBlock) {
  const pRe = /^\s*([a-z_0-9]+):\{src:"([^"]+)"(?:,boardSrc:"([^"]+)")?/gm;
  let p;
  while ((p = pRe.exec(pBlock[1])) !== null) previews[p[1]] = { src: p[2], boardSrc: p[3] || null };
}

// 5. Removed categories (never list these)
const REMOVED = new Set(["general_emoji", "country_emoji", "movie_show_emoji", "guess_the_price", "who_dinosaur", "who_movie", "who_tv_show"]);

// 6. Active = has a preview entry OR bank metadata, minus removed. Prefer the preview key list as the UI source of truth.
const ids = Array.from(new Set([...Object.keys(previews), ...Object.keys(meta)])).filter((id) => !REMOVED.has(id)).sort();
const out = ids.map((id) => ({ id, label: meta[id]?.label || id, icon: meta[id]?.icon || "", group: groups[id] || null, src: previews[id]?.src || null, boardSrc: previews[id]?.boardSrc || null }));
fs.mkdirSync("audit", { recursive: true });
fs.writeFileSync("audit/category-list.json", JSON.stringify(out, null, 2));
console.log(`${out.length} categories -> audit/category-list.json`);
console.log(out.map((c) => `${c.id} | ${c.label}`).join("\n"));

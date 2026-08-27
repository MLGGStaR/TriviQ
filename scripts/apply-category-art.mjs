// Wire accepted category art (audit/category-art-manifest.json) into CATEGORY_PREVIEWS in src/App.jsx.
// Each accepted id gets: src + boardSrc = new file, cover fit everywhere, the verifier's object-position, dark board plate.
import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync("audit/category-art-manifest.json", "utf8"));
const accepted = manifest.accepted || {};
let app = fs.readFileSync("src/App.jsx", "utf8");
const start = app.indexOf("const CATEGORY_PREVIEWS = {");
const end = app.indexOf("\n};", start);
if (start < 0 || end < 0) throw new Error("CATEGORY_PREVIEWS block not found");
const block = app.slice(start, end);
let updated = block;
let n = 0, missingFile = [];
for (const [id, art] of Object.entries(accepted)) {
  const src = art.src || (art.file ? "/" + art.file.replace(/^public\//, "") : null);
  if (!src) continue;
  if (!fs.existsSync("public" + src)) { missingFile.push(id); continue; }
  const pos = /top/i.test(art.position || "") ? "center top" : "center";
  const lineRe = new RegExp(`^  ${id}:\\{[^\\n]*\\},?$`, "m");
  const m = updated.match(lineRe);
  const caption = m ? (m[0].match(/caption:"((?:[^"\\]|\\.)*)"/) || [])[1] : null;
  const line = `  ${id}:{src:"${src}",boardSrc:"${src}",fit:"cover",cardFit:"cover",cardPosition:"${pos}",boardFit:"cover",boardPosition:"${pos}",boardBg:"#05070D"${caption ? `,caption:"${caption}"` : ""}},`;
  if (m) { updated = updated.replace(lineRe, line); n++; }
  else { updated = updated + "\n" + line; n++; }
}
app = app.slice(0, start) + updated + app.slice(end);
fs.writeFileSync("src/App.jsx", app);
console.log(`wired ${n} categories; missing files: ${missingFile.join(", ") || "none"}`);

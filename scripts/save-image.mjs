// Download an image to public/category-art/<id>.<ext> and print its probed dimensions.
// Usage: node scripts/save-image.mjs <id> "<url>"
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

const [,, id, url] = process.argv;
if (!id || !url) { console.error("usage: node scripts/save-image.mjs <id> \"<url>\""); process.exit(1); }
if (!/^[a-z0-9_]+$/.test(id)) { console.error("bad id"); process.exit(1); }
const UA = "TrivicCategoryArt/1.0 (https://github.com/MLGGStaR/TriviQ; thememesofdoom@gmail.com)";
const res = await fetch(url, { headers: { "User-Agent": UA } });
if (!res.ok) { console.error("HTTP", res.status); process.exit(2); }
const buf = Buffer.from(await res.arrayBuffer());
let dims;
try { dims = imageSize(buf); } catch (e) { console.error("not an image:", e.message); process.exit(3); }
const ext = dims.type === "png" ? "png" : dims.type === "webp" ? "webp" : "jpg";
if (!["jpg", "png", "webp"].includes(ext)) { console.error("unsupported type", dims.type); process.exit(4); }
fs.mkdirSync("public/category-art", { recursive: true });
for (const old of ["jpg", "png", "webp"]) { const p = path.join("public/category-art", `${id}.${old}`); if (fs.existsSync(p)) fs.unlinkSync(p); }
const file = path.join("public/category-art", `${id}.${ext}`);
fs.writeFileSync(file, buf);
console.log(JSON.stringify({ id, file: file.replace(/\\/g, "/"), src: `/category-art/${id}.${ext}`, width: dims.width, height: dims.height, type: dims.type, bytes: buf.length }));

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import NCB2 from "../src/newCategoriesPack2.js";

const OUTPUT_DIR = path.join(process.cwd(), "public", "whoami");
const MANIFEST_PATH = path.join(process.cwd(), "src", "whoamiImageManifest.js");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const BAD_URL = /poster|logo|wordmark|title[_-]card|cover|dvd|blu-ray|bluray|soundtrack|promo[_-]?shot|billboard|cast[_-]?photo/i;
const SCENE_HINTS = /scene|still|screenshot|screencap|screen_cap|gif|production|filming|set_photo|filming_set/i;

function cleanUrl(src) {
  if (!src) return "";
  const c = src.replace(/&amp;/g, "&");
  return c.startsWith("//") ? `https:${c}` : c;
}
function upgradeThumb(url) { return url.replace(/\/(\d+)px-/, "/1280px-"); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithRetry(url, tries = 4) {
  let last;
  for (let i = 1; i <= tries; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA, "accept": "text/html,image/*,*/*" } });
      if (r.ok) return r;
      last = new Error(`HTTP ${r.status}`);
      if (r.status === 429 || r.status >= 500) await sleep(i * 2500);
      else break;
    } catch (e) { last = e; await sleep(i * 2500); }
  }
  throw last;
}
async function fetchText(url) { return (await fetchWithRetry(url)).text(); }

async function resolveWikipediaSceneImage(wikiTitle) {
  const html = await fetchText(`https://en.wikipedia.org/wiki/${wikiTitle}`);
  // Infobox image — the poster. Capture to exclude.
  const infobox = cleanUrl(html.match(/<table class="infobox[\s\S]*?<img[^>]+src="([^"]+)"/i)?.[1] || "");
  const og = cleanUrl(html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1] || "");
  const excluded = new Set([infobox, og].filter(Boolean).map(u => u.split("/revision/")[0]));

  // Collect all figure images with captions
  const figureRe = /<figure[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[^>]*>[\s\S]*?<figcaption[^>]*>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/gi;
  const candidates = [];
  let m;
  while ((m = figureRe.exec(html)) !== null) {
    const src = cleanUrl(m[1]);
    const caption = m[2].replace(/<[^>]+>/g, "").trim();
    if (!src) continue;
    if (excluded.has(src.split("/revision/")[0])) continue;
    if (BAD_URL.test(src)) continue;
    candidates.push({ src, caption });
  }

  // Prefer captions that hint at a scene
  const scene = candidates.find(c => SCENE_HINTS.test(c.caption) || SCENE_HINTS.test(c.src));
  if (scene) return upgradeThumb(scene.src);
  if (candidates.length) return upgradeThumb(candidates[0].src);
  return "";
}

function safeFileStem(wiki) {
  const decoded = (() => { try { return decodeURIComponent(wiki); } catch { return wiki; } })();
  const slug = decoded.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "whoami";
  const hash = crypto.createHash("sha1").update(wiki).digest("hex").slice(0, 8);
  return `${slug}-${hash}`;
}
function fileExtensionFor(url, contentType = "") {
  const p = new URL(url).pathname;
  const ext = path.extname(p).toLowerCase();
  if ([".jpg",".jpeg",".png",".webp",".gif"].includes(ext)) return ext;
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  return ".jpg";
}
async function downloadImage(url) {
  const r = await fetchWithRetry(url);
  const buffer = Buffer.from(await r.arrayBuffer());
  return { buffer, finalUrl: r.url || url, contentType: r.headers.get("content-type") || "" };
}

const entries = [];
for (const cat of ["who_movie", "who_tv_show"]) {
  const c = NCB2[cat];
  if (!c) continue;
  [200, 400, 600].forEach(t => (c[t] || []).forEach(e => entries.push({ wiki: e.wiki, answer: e.a, cat })));
}

process.stdout.write(`Found ${entries.length} movie/tv entries.\n`);

const manifestMod = await import(`file:///${MANIFEST_PATH.replace(/\\/g, "/")}?cache=${Date.now()}`);
const manifest = { ...manifestMod.default };
let ok = 0, fail = 0, noScene = 0;

for (const entry of entries) {
  const stem = safeFileStem(entry.wiki);
  try {
    const src = await resolveWikipediaSceneImage(entry.wiki);
    if (!src) { noScene++; process.stdout.write(`NO_SCENE ${entry.wiki}\n`); continue; }
    const { buffer, finalUrl, contentType } = await downloadImage(src);
    if (buffer.length < 4000) throw new Error(`too small (${buffer.length}B)`);
    for (const f of fs.readdirSync(OUTPUT_DIR)) if (f.startsWith(`${stem}.`)) fs.unlinkSync(path.join(OUTPUT_DIR, f));
    const ext = fileExtensionFor(finalUrl, contentType);
    const fileName = `${stem}${ext}`;
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), buffer);
    manifest[entry.wiki] = `/whoami/${fileName}`;
    ok++;
    process.stdout.write(`OK ${entry.wiki} -> ${fileName} (${buffer.length}B)\n`);
  } catch (e) {
    fail++;
    process.stdout.write(`FAIL ${entry.wiki}: ${e.message}\n`);
  }
  await sleep(400);
}

fs.writeFileSync(MANIFEST_PATH, `const WHOAMI_IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n\nexport default WHOAMI_IMAGE_MANIFEST;\n`);
process.stdout.write(`Done. OK=${ok} FAIL=${fail} NO_SCENE=${noScene}\n`);

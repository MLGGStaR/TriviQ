import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const APP_PATH = path.join(process.cwd(), "src", "App.jsx");
const OUTPUT_DIR = path.join(process.cwd(), "public", "whoami");
const MANIFEST_PATH = path.join(process.cwd(), "src", "whoamiImageManifest.js");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const BAD_URL_TOKENS = ["skeleton","skull","fossil","bone","mount","museum","tooth","teeth","jaw","femur","vertebra","claw","holotype","specimen","excavat","scan","diagram","chart","cladogram","silhouette","size_comparison","phylogen","map"];
const GOOD_CAPTION = /(restoration|reconstruction|life|artist|paleoart|alive)/i;

function cleanImageUrl(src) {
  if (!src) return "";
  const c = src.replace(/&amp;/g, "&");
  return c.startsWith("//") ? `https:${c}` : c;
}
function isBadUrl(url) {
  const u = (url || "").toLowerCase();
  return BAD_URL_TOKENS.some((t) => u.includes(t));
}
function upgradeThumb(url) {
  return url.replace(/\/(\d+)px-/, "/1024px-");
}
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function fetchWithRetry(url, tries = 4) {
  let last;
  for (let i = 1; i <= tries; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA, "accept": "text/html,image/*,*/*" } });
      if (r.ok) return r;
      last = new Error(`HTTP ${r.status}`);
      if (r.status === 429 || r.status >= 500) await sleep(i * 1800);
      else break;
    } catch (e) { last = e; await sleep(i * 1800); }
  }
  throw last;
}

async function fetchText(url) {
  const r = await fetchWithRetry(url);
  return r.text();
}

async function resolveFandom(host, wikiTitle) {
  const url = `https://${host}/wiki/${encodeURIComponent(wikiTitle)}`;
  let html;
  try { html = await fetchText(url); } catch { return ""; }
  const og = cleanImageUrl(html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1] || "");
  if (og && !isBadUrl(og) && !og.includes("Wiki-wordmark") && !og.includes("Site-logo")) {
    return og.split("/revision/")[0];
  }
  return "";
}

async function resolveWikipediaBody(wikiTitle) {
  let html;
  try { html = await fetchText(`https://en.wikipedia.org/wiki/${wikiTitle}`); } catch { return ""; }
  // Parse figures with captions
  const figureRe = /<figure[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[^>]*>[\s\S]*?<figcaption[^>]*>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/gi;
  const figs = [];
  let m;
  while ((m = figureRe.exec(html)) !== null) {
    const src = cleanImageUrl(m[1]);
    const caption = m[2].replace(/<[^>]+>/g, "").trim();
    if (src && !isBadUrl(src) && !BAD_URL_TOKENS.some(t => caption.toLowerCase().includes(t))) {
      figs.push({ src, caption });
    }
  }
  const restoration = figs.find(f => GOOD_CAPTION.test(f.caption));
  if (restoration) return upgradeThumb(restoration.src);
  if (figs.length) return upgradeThumb(figs[0].src);
  return "";
}

async function resolveDinosaurImage(wikiTitle, answer) {
  const candidates = [wikiTitle, answer.replace(/\s+/g, "_"), wikiTitle.replace(/_\(dinosaur\)/, "")];
  const uniq = [...new Set(candidates)];
  for (const host of ["jurassicpark.fandom.com", "jurassic-park.fandom.com", "jurassicworld.fandom.com"]) {
    for (const t of uniq) {
      const src = await resolveFandom(host, t);
      if (src) return { src, source: host };
    }
  }
  const wp = await resolveWikipediaBody(wikiTitle);
  if (wp) return { src: wp, source: "wikipedia-body" };
  return null;
}

function parseDinosaurEntries(source) {
  const lines = source.split(/\r?\n/);
  const entries = [];
  let inCategory = false;
  for (const line of lines) {
    if (/^\s*who_dinosaur:\{/.test(line)) { inCategory = true; continue; }
    if (inCategory && /^\s*\},?\s*$/.test(line) && !/wiki:/.test(line) && !/[a-z]+:\[/.test(line)) {
      if (/^\s*\},\s*$/.test(line)) { inCategory = false; continue; }
    }
    if (!inCategory) continue;
    const m = line.match(/\{q:".*?",a:"(.*?)",wiki:"(.*?)"\}/);
    if (m) entries.push({ answer: m[1], wiki: m[2] });
  }
  return entries;
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

const entries = parseDinosaurEntries(fs.readFileSync(APP_PATH, "utf8"));
process.stdout.write(`Found ${entries.length} dinosaur entries.\n`);

const manifestMod = await import(`file:///${MANIFEST_PATH.replace(/\\/g, "/")}?cache=${Date.now()}`);
const manifest = { ...manifestMod.default };
let ok = 0, fail = 0;

for (const entry of entries) {
  const stem = safeFileStem(entry.wiki);
  try {
    const res = await resolveDinosaurImage(entry.wiki, entry.answer);
    if (!res) throw new Error("no sources");
    const { buffer, finalUrl, contentType } = await downloadImage(res.src);
    if (buffer.length < 4000) throw new Error(`too small (${buffer.length}B) — likely error page`);
    // Only now delete old image(s) for this stem
    for (const f of fs.readdirSync(OUTPUT_DIR)) if (f.startsWith(`${stem}.`)) fs.unlinkSync(path.join(OUTPUT_DIR, f));
    const ext = fileExtensionFor(finalUrl, contentType);
    const fileName = `${stem}${ext}`;
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), buffer);
    manifest[entry.wiki] = `/whoami/${fileName}`;
    ok++;
    process.stdout.write(`OK ${entry.wiki} [${res.source}] -> ${fileName} (${buffer.length}B)\n`);
  } catch (e) {
    fail++;
    process.stdout.write(`FAIL ${entry.wiki}: ${e.message}\n`);
  }
  await sleep(350);
}

fs.writeFileSync(MANIFEST_PATH, `const WHOAMI_IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n\nexport default WHOAMI_IMAGE_MANIFEST;\n`);
process.stdout.write(`Done. OK=${ok} FAIL=${fail}\n`);

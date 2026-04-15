import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import NCB2 from "../src/newCategoriesPack2.js";

const API_KEY = process.env.TMDB_API_KEY;
if (!API_KEY) {
  console.error("Set TMDB_API_KEY env var. Get a free key at https://www.themoviedb.org → Settings → API → Request (choose Developer).");
  process.exit(1);
}

const OUTPUT_DIR = path.join(process.cwd(), "public", "whoami");
const MANIFEST_PATH = path.join(process.cwd(), "src", "whoamiImageManifest.js");
const IMG_CDN = "https://image.tmdb.org/t/p/w1280";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function tmdb(url) {
  for (let i = 1; i <= 4; i++) {
    const r = await fetch(url);
    if (r.ok) return r.json();
    if (r.status === 429 || r.status >= 500) { await sleep(i * 2000); continue; }
    throw new Error(`TMDb HTTP ${r.status}`);
  }
  throw new Error("TMDb max retries");
}

// Clean wiki title into a search query and extract year if present.
function parseWiki(wiki) {
  const decoded = decodeURIComponent(wiki).replace(/_/g, " ");
  const yearMatch = decoded.match(/\((\d{4})[^)]*\)/);
  const year = yearMatch ? yearMatch[1] : null;
  const query = decoded.replace(/\s*\([^)]*\)\s*/g, "").trim();
  return { query, year };
}

async function searchTmdb(kind, query, year) {
  const yearParam = year ? (kind === "movie" ? `&year=${year}` : `&first_air_date_year=${year}`) : "";
  const url = `https://api.themoviedb.org/3/search/${kind}?api_key=${API_KEY}&query=${encodeURIComponent(query)}${yearParam}`;
  const data = await tmdb(url);
  return data?.results?.[0]?.id || null;
}

async function pickBackdrop(kind, id) {
  const data = await tmdb(`https://api.themoviedb.org/3/${kind}/${id}/images?api_key=${API_KEY}&include_image_language=null,en`);
  const backdrops = data?.backdrops || [];
  // Prefer language-neutral (no text), then English, sorted by votes.
  const sorted = backdrops.slice().sort((a, b) => {
    const na = a.iso_639_1 === null ? 2 : a.iso_639_1 === "en" ? 1 : 0;
    const nb = b.iso_639_1 === null ? 2 : b.iso_639_1 === "en" ? 1 : 0;
    if (na !== nb) return nb - na;
    return (b.vote_average || 0) - (a.vote_average || 0);
  });
  return sorted[0]?.file_path || null;
}

function safeFileStem(wiki) {
  const d = (() => { try { return decodeURIComponent(wiki); } catch { return wiki; } })();
  const slug = d.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "whoami";
  return `${slug}-${crypto.createHash("sha1").update(wiki).digest("hex").slice(0,8)}`;
}
async function download(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`CDN HTTP ${r.status}`);
  const buffer = Buffer.from(await r.arrayBuffer());
  return { buffer, finalUrl: r.url || url, contentType: r.headers.get("content-type") || "" };
}
function ext(url, ct) {
  const p = new URL(url).pathname;
  const e = path.extname(p).toLowerCase();
  if ([".jpg",".jpeg",".png",".webp"].includes(e)) return e;
  if (ct.includes("png")) return ".png";
  if (ct.includes("webp")) return ".webp";
  return ".jpg";
}

const entries = [];
for (const cat of ["who_movie", "who_tv_show"]) {
  const kind = cat === "who_movie" ? "movie" : "tv";
  const c = NCB2[cat];
  if (!c) continue;
  [200, 400, 600].forEach(t => (c[t] || []).forEach(e => entries.push({ wiki: e.wiki, answer: e.a, kind })));
}

console.log(`Processing ${entries.length} entries via TMDb.`);

const manifestMod = await import(`file:///${MANIFEST_PATH.replace(/\\/g, "/")}?cache=${Date.now()}`);
const manifest = { ...manifestMod.default };
let ok = 0, fail = 0;
const failures = [];

for (const entry of entries) {
  const stem = safeFileStem(entry.wiki);
  try {
    const { query, year } = parseWiki(entry.wiki);
    let id = await searchTmdb(entry.kind, query, year);
    if (!id) id = await searchTmdb(entry.kind, query, null); // retry without year
    if (!id) throw new Error("no TMDb match");
    const filePath = await pickBackdrop(entry.kind, id);
    if (!filePath) throw new Error("no backdrops on TMDb");
    const { buffer, finalUrl, contentType } = await download(IMG_CDN + filePath);
    if (buffer.length < 4000) throw new Error(`tiny file (${buffer.length}B)`);
    for (const f of fs.readdirSync(OUTPUT_DIR)) if (f.startsWith(`${stem}.`)) fs.unlinkSync(path.join(OUTPUT_DIR, f));
    const fileName = stem + ext(finalUrl, contentType);
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), buffer);
    manifest[entry.wiki] = `/whoami/${fileName}`;
    ok++;
    console.log(`OK ${entry.wiki} -> ${fileName}`);
  } catch (e) {
    fail++;
    failures.push({ wiki: entry.wiki, reason: e.message });
    console.log(`FAIL ${entry.wiki}: ${e.message}`);
  }
  await sleep(300);
}

fs.writeFileSync(MANIFEST_PATH, `const WHOAMI_IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n\nexport default WHOAMI_IMAGE_MANIFEST;\n`);
console.log(`\nDone. OK=${ok} FAIL=${fail}`);
if (failures.length) console.log("Failures:\n" + failures.map(f => `  ${f.wiki}: ${f.reason}`).join("\n"));

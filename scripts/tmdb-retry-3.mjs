import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KEY = process.env.TMDB_API_KEY;
const targets = [
  { wiki: "Shoplifters_(film)", kind: "movie", query: "Shoplifters" },
  { wiki: "Burning_(2018_film)", kind: "movie", query: "Burning", year: "2018" },
  { wiki: "A_Separation", kind: "movie", query: "A Separation" },
];

function stem(w){
  const d = decodeURIComponent(w);
  const s = d.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  return s + "-" + crypto.createHash("sha1").update(w).digest("hex").slice(0, 8);
}

const MANIFEST_PATH = "src/whoamiImageManifest.js";
const m = await import(`file:///${path.resolve(MANIFEST_PATH).replace(/\\/g, "/")}?c=${Date.now()}`);
const manifest = { ...m.default };

for (const t of targets) {
  const yearParam = t.year ? `&year=${t.year}` : "";
  const sr = await (await fetch(`https://api.themoviedb.org/3/search/${t.kind}?api_key=${KEY}&query=${encodeURIComponent(t.query)}${yearParam}`)).json();
  const id = sr?.results?.[0]?.id;
  if (!id) { console.log("no id", t.wiki); continue; }
  const im = await (await fetch(`https://api.themoviedb.org/3/${t.kind}/${id}/images?api_key=${KEY}`)).json();
  const bd = (im.backdrops || []).slice().sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))[0];
  if (!bd) { console.log("no backdrop", t.wiki); continue; }
  const url = "https://image.tmdb.org/t/p/w1280" + bd.file_path;
  const r = await fetch(url);
  const buffer = Buffer.from(await r.arrayBuffer());
  const st = stem(t.wiki);
  for (const f of fs.readdirSync("public/whoami")) if (f.startsWith(st + ".")) fs.unlinkSync("public/whoami/" + f);
  const ext = path.extname(new URL(url).pathname) || ".jpg";
  const fn = st + ext;
  fs.writeFileSync("public/whoami/" + fn, buffer);
  manifest[t.wiki] = "/whoami/" + fn;
  console.log("OK", t.wiki, "->", fn, buffer.length);
}

fs.writeFileSync(MANIFEST_PATH, `const WHOAMI_IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n\nexport default WHOAMI_IMAGE_MANIFEST;\n`);
console.log("done");

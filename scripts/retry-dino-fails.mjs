import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const OUTPUT_DIR = path.join(process.cwd(), "public", "whoami");
const MANIFEST_PATH = path.join(process.cwd(), "src", "whoamiImageManifest.js");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

// Direct URLs curated for the 7 failed dinosaurs (Fandom CGI / Wikipedia life restorations)
const TARGETS = {
  "Velociraptor": "https://static.wikia.nocookie.net/jurassicpark/images/9/92/Blue_portrait_jwd.png",
  "Mapusaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Mapusaurus_roseae.jpg/1024px-Mapusaurus_roseae.jpg",
  "Qianzhousaurus": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Qianzhousaurus_restoration.jpg/1024px-Qianzhousaurus_restoration.jpg",
  "Jeholornis": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Jeholornis_NT_small.jpg/1024px-Jeholornis_NT_small.jpg",
  "Yi_qi": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Yi_qi_restoration.jpg/1024px-Yi_qi_restoration.jpg",
  "Nasutoceratops": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Nasutoceratops_titusi_life_restoration.jpg/1024px-Nasutoceratops_titusi_life_restoration.jpg",
  "Yinlong": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Yinlong_downsi_restoration.jpg/1024px-Yinlong_downsi_restoration.jpg",
};

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
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function dl(url) {
  for (let i = 1; i <= 6; i++) {
    const r = await fetch(url, { headers: { "user-agent": UA, "accept": "image/*,*/*" } });
    if (r.ok) {
      const buffer = Buffer.from(await r.arrayBuffer());
      return { buffer, finalUrl: r.url || url, contentType: r.headers.get("content-type") || "" };
    }
    if (r.status === 429 || r.status >= 500) {
      console.log(`retry ${i} for ${url} (${r.status})`);
      await sleep(i * 3000);
      continue;
    }
    throw new Error(`HTTP ${r.status}`);
  }
  throw new Error("max retries");
}

const manifestMod = await import(`file:///${MANIFEST_PATH.replace(/\\/g, "/")}?cache=${Date.now()}`);
const manifest = { ...manifestMod.default };

for (const [wiki, url] of Object.entries(TARGETS)) {
  const stem = safeFileStem(wiki);
  try {
    const { buffer, finalUrl, contentType } = await dl(url);
    if (buffer.length < 4000) throw new Error(`too small (${buffer.length}B)`);
    for (const f of fs.readdirSync(OUTPUT_DIR)) if (f.startsWith(`${stem}.`)) fs.unlinkSync(path.join(OUTPUT_DIR, f));
    const ext = fileExtensionFor(finalUrl, contentType);
    const fileName = `${stem}${ext}`;
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), buffer);
    manifest[wiki] = `/whoami/${fileName}`;
    console.log(`OK ${wiki} -> ${fileName} (${buffer.length}B)`);
    await sleep(1500);
  } catch (e) {
    console.log(`FAIL ${wiki}: ${e.message}`);
  }
}

fs.writeFileSync(MANIFEST_PATH, `const WHOAMI_IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n\nexport default WHOAMI_IMAGE_MANIFEST;\n`);
console.log("done.");

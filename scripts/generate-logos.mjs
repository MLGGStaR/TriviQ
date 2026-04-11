import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import LOGO_CATEGORIES_BANK from "../src/logoCategoriesBank.js";

const OUTPUT_DIR = path.join(process.cwd(), "public", "logos");
const MANIFEST_PATH = path.join(process.cwd(), "src", "logoManifest.js");

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, attempts = 4) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": "LogoBot/1.0" } });
      if (r.ok) return r;
      if (r.status === 429 || r.status >= 500) { await sleep(i * 2000); continue; }
      throw new Error(`${url} → ${r.status}`);
    } catch (e) {
      if (i === attempts) throw e;
      await sleep(i * 1500);
    }
  }
}

// Collect all unique domains from all logo categories
const allEntries = [];
for (const [catId, cat] of Object.entries(LOGO_CATEGORIES_BANK)) {
  if (!cat.isLogoGuess) continue;
  for (const tier of [200, 400, 600]) {
    for (const entry of cat[tier] || []) {
      if (entry.q) allEntries.push({ domain: entry.q, answer: entry.a, catId });
    }
  }
}

const uniqueDomains = [...new Map(allEntries.map(e => [e.domain, e])).values()];
console.log(`Found ${uniqueDomains.length} unique domains to fetch logos for.`);

const manifest = {};

// Try to reuse existing logos
for (const file of fs.readdirSync(OUTPUT_DIR)) {
  // file format: domain-hash.ext
  const match = file.match(/^(.+)-[a-f0-9]{8}\.(png|jpg|jpeg|svg|webp)$/);
  if (match) {
    // We'll rebuild manifest from scratch
  }
}

for (const entry of uniqueDomains) {
  const domain = entry.domain;
  const slug = domain.replace(/[^a-z0-9]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const hash = crypto.createHash("sha1").update(domain).digest("hex").slice(0, 8);

  // Check if already downloaded
  const existing = fs.readdirSync(OUTPUT_DIR).find(f => f.startsWith(`${slug}-${hash}.`));
  if (existing) {
    manifest[domain] = `/logos/${existing}`;
    console.log(`Reused ${domain} → ${existing}`);
    continue;
  }

  // Try Google's high-res favicon
  const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
  try {
    const res = await fetchWithRetry(url);
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get("content-type") || "";
    const ext = ct.includes("png") ? ".png" : ct.includes("svg") ? ".svg" : ct.includes("webp") ? ".webp" : ".png";
    const fileName = `${slug}-${hash}${ext}`;
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), buf);
    manifest[domain] = `/logos/${fileName}`;
    console.log(`Saved ${domain} → ${fileName} (${buf.length} bytes)`);
  } catch (e) {
    console.log(`FAILED ${domain}: ${e.message}`);
  }
  await sleep(100);
}

const manifestSource = `const LOGO_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n\nexport default LOGO_MANIFEST;\n`;
fs.writeFileSync(MANIFEST_PATH, manifestSource);
console.log(`\nGenerated manifest with ${Object.keys(manifest).length} logos.`);

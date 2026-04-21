// Fetch themed preview images for country_capitals + spelling_bee from Wikipedia.
import fs from "node:fs";
import path from "node:path";

const targets = [
  { slug: "Capital_city", out: "country_capitals.jpg" },
  { slug: "Scripps_National_Spelling_Bee", out: "spelling_bee.jpg" },
];

async function fetchWithRetry(url) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res;
}

async function resolveWikipediaImage(title) {
  const html = await (await fetchWithRetry(`https://en.wikipedia.org/wiki/${title}`)).text();
  const og = html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1];
  if (og) return og.replace(/&amp;/g, "&");
  const infobox = html.match(/<table class="infobox[\s\S]*?<img[^>]+src="([^"]+)"/i)?.[1];
  if (infobox) {
    const src = infobox.replace(/&amp;/g, "&");
    return src.startsWith("//") ? `https:${src}` : src;
  }
  throw new Error(`No image on ${title}`);
}

const outDir = path.join("public", "category-previews");
for (const t of targets) {
  try {
    const url = await resolveWikipediaImage(t.slug);
    const buf = Buffer.from(await (await fetchWithRetry(url)).arrayBuffer());
    fs.writeFileSync(path.join(outDir, t.out), buf);
    console.log(`Saved ${t.out} from ${t.slug} (${url})`);
  } catch (e) {
    console.error(`FAILED ${t.slug}: ${e.message}`);
  }
}

import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/category-previews';

const TARGETS = [
  { id: 'logo_fast_food', title: "McDonald's", ext: 'jpg' },
  { id: 'logo_tech', title: 'Apple_Inc.', ext: 'jpg' },
  { id: 'logo_cars', title: 'BMW', ext: 'jpg' },
  { id: 'logo_fashion', title: 'Gucci', ext: 'jpg' },
  { id: 'logo_sports', title: 'FIFA', ext: 'jpg' },
  { id: 'logo_entertainment', title: 'Netflix', ext: 'jpg' },
  { id: 'logo_airlines', title: 'Emirates_(airline)', ext: 'jpg' },
  { id: 'logo_gaming', title: 'PlayStation', ext: 'jpg' },
  { id: 'logo_social', title: 'Instagram', ext: 'jpg' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchWithRetry(url, attempts = 5) {
  for (let i = 1; i <= attempts; i++) {
    const r = await fetch(url, { headers: { 'user-agent': 'TriviaBot/1.0 (preview-fetcher)' } });
    if (r.ok) return r;
    if (r.status === 429 || r.status >= 500) { await sleep(i * 2000); continue; }
    throw new Error(`${url} → ${r.status}`);
  }
  throw new Error(`giving up: ${url}`);
}

async function getOgImage(title) {
  const r = await fetchWithRetry(`https://en.wikipedia.org/wiki/${title}`);
  const html = await r.text();
  const m = html.match(/<meta property="og:image" content="([^"]+)"/i);
  if (m) return m[1].replace(/&amp;/g, '&');
  // try infobox
  const m2 = html.match(/<table class="infobox[\s\S]*?<img[^>]+src="([^"]+)"/i);
  if (m2) {
    let src = m2[1].replace(/&amp;/g, '&');
    if (src.startsWith('//')) src = 'https:' + src;
    return src;
  }
  return null;
}

for (const t of TARGETS) {
  try {
    console.log(`fetching ${t.id} (${t.title})...`);
    const url = await getOgImage(t.title);
    if (!url) { console.log(`  no image found`); continue; }
    console.log(`  → ${url}`);
    const r = await fetchWithRetry(url);
    const buf = Buffer.from(await r.arrayBuffer());
    const dest = path.join(OUT, `${t.id}.${t.ext}`);
    fs.writeFileSync(dest, buf);
    console.log(`  saved ${dest} (${buf.length} bytes)`);
    await sleep(1500);
  } catch (e) {
    console.log(`  ERROR: ${e.message}`);
  }
}

// Research script: query Wikimedia Commons for young celebrity photos
// Usage: node scripts/research-young-celebs.mjs "search term" [limit]

const term = process.argv[2] || '';
const limit = parseInt(process.argv[3] || '8', 10);

async function search(q) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&format=json&srlimit=${limit}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'TriviaResearch/1.0 (contact: thememesofdoom@gmail.com)' } });
  return res.json();
}

async function getInfo(title) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|mime|size|extmetadata&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'TriviaResearch/1.0 (contact: thememesofdoom@gmail.com)' } });
  return res.json();
}

const data = await search(term);
const hits = data?.query?.search || [];
for (const h of hits) {
  const info = await getInfo(h.title);
  const page = Object.values(info.query.pages)[0];
  const ii = page.imageinfo?.[0];
  if (!ii) continue;
  const license = ii.extmetadata?.LicenseShortName?.value || '?';
  const date = ii.extmetadata?.DateTimeOriginal?.value || ii.extmetadata?.DateTime?.value || '?';
  console.log(`${h.title}`);
  console.log(`  url: ${ii.url}`);
  console.log(`  size: ${ii.width}x${ii.height} ${ii.mime}`);
  console.log(`  date: ${date}  license: ${license}`);
  console.log('');
}

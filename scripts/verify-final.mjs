// Verify final URLs via HEAD (sequential with delay)
import fs from 'fs';
const data = JSON.parse(fs.readFileSync('audit/young-celeb-urls.json', 'utf8'));
const results = [];
let ok = 0, bad = 0;
for (const c of data.celebrities) {
  try {
    const res = await fetch(c.youngImageUrl, { method: 'HEAD', headers: { 'User-Agent': 'TriviaResearch/1.0 (thememesofdoom@gmail.com)' }, redirect: 'follow' });
    const status = res.status;
    const ct = res.headers.get('content-type');
    const len = res.headers.get('content-length');
    if (status === 200 && ct && ct.startsWith('image/')) ok++; else bad++;
    console.log(`${status} ${ct} ${len}B ${c.name}`);
    results.push({ name: c.name, status, ct, len });
  } catch (e) {
    bad++;
    console.log(`ERR ${e.message} ${c.name}`);
  }
  await new Promise(r => setTimeout(r, 1500));
}
console.log(`\nVerified: ${ok} OK / ${bad} bad out of ${data.celebrities.length}`);
fs.writeFileSync('audit/young-celeb-verify-final.json', JSON.stringify(results, null, 2));

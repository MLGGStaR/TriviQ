// Final verify: HEAD-check every youngImageUrl in the output JSON.
const https = require('https');
const fs = require('fs');

function head(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const req = https.request({ host: u.host, path: u.pathname + u.search, method: 'HEAD',
      headers: { 'User-Agent': 'trivia-audit/1.0 (thememesofdoom@gmail.com)' } },
      (res) => resolve({ status: res.statusCode, ct: res.headers['content-type'] }));
    req.on('error', (e) => resolve({ status: 0, ct: null, err: e.message }));
    req.end();
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  let ok = 0, bad = 0;
  const failed = [];
  for (const c of data.celebrities) {
    const h = await head(c.youngImageUrl);
    const good = h.status === 200 && (h.ct || '').startsWith('image/');
    if (good) { ok++; } else { bad++; failed.push({ name: c.name, url: c.youngImageUrl, status: h.status, ct: h.ct }); }
    console.log(`${good ? 'OK ' : 'BAD'} [${h.status}] ${c.name} ${h.ct || ''}`);
    await sleep(600);
  }
  console.log(`\nTotals: ok=${ok} bad=${bad}`);
  if (failed.length) console.log('FAILED: ' + JSON.stringify(failed, null, 2));
})();

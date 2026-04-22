// Re-verify HEAD status with 1s delay between requests for rate limit avoidance.
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
async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const lines = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    let obj; try { obj = JSON.parse(line); } catch { continue; }
    if (!obj.url) { console.log(line); continue; }
    const h = await head(obj.url);
    obj.ok = h.status === 200 && (h.ct || '').startsWith('image/');
    obj.status = h.status; obj.ct = h.ct;
    console.log(JSON.stringify(obj));
    await sleep(800);
  }
})();

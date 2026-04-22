#!/usr/bin/env node
// Verify many titles from a file, one per line.
const https = require('https');
const fs = require('fs');

function api(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'trivia-audit/1.0 (thememesofdoom@gmail.com)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('bad json: ' + data.slice(0, 200))); } });
    }).on('error', reject);
  });
}
function head(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const req = https.request({ host: u.host, path: u.pathname + u.search, method: 'HEAD', headers: { 'User-Agent': 'trivia-audit/1.0' } },
      (res) => resolve({ status: res.statusCode, ct: res.headers['content-type'] }));
    req.on('error', () => resolve({ status: 0, ct: null }));
    req.end();
  });
}
async function verifyTitle(title) {
  const t = title.startsWith('File:') ? title : 'File:' + title;
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(t)}&prop=imageinfo&iiprop=url|mime|extmetadata`;
  try {
    const d = await api(url);
    const pages = d.query?.pages || {};
    for (const p of Object.values(pages)) {
      if (p.missing !== undefined || !p.imageinfo) return { title, ok: false, reason: 'missing' };
      const ii = p.imageinfo[0];
      const lic = ii.extmetadata?.LicenseShortName?.value || '';
      const desc = ii.extmetadata?.ImageDescription?.value || '';
      const date = ii.extmetadata?.DateTimeOriginal?.value || '';
      const h = await head(ii.url);
      return { title, ok: h.status === 200 && (h.ct||'').startsWith('image/'),
        url: ii.url, license: lic.replace(/<[^>]+>/g, '').trim(),
        description: desc.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 250),
        date: date.replace(/<[^>]+>/g, '').trim().slice(0, 60),
        status: h.status, ct: h.ct };
    }
  } catch (e) { return { title, ok: false, reason: e.message }; }
}
(async () => {
  const file = process.argv[2];
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(l => l.trim() && !l.startsWith('#'));
  for (const line of lines) {
    const r = await verifyTitle(line.trim());
    console.log(JSON.stringify(r));
  }
})();

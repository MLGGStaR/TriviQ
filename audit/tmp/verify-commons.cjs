#!/usr/bin/env node
// Verify Wikimedia Commons file titles, return URL + license metadata.
// Usage: node verify-commons.js <title1> <title2> ...
// Titles should be the File: title portion (e.g. "Arnold_Schwarzenegger_1974.jpg")

const https = require('https');

function api(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'trivia-audit/1.0 (thememesofdoom@gmail.com)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('bad json: ' + data.slice(0, 200))); }
      });
    }).on('error', reject);
  });
}

function head(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const req = https.request({
      host: u.host, path: u.pathname + u.search, method: 'HEAD',
      headers: { 'User-Agent': 'trivia-audit/1.0 (thememesofdoom@gmail.com)' }
    }, (res) => {
      resolve({ status: res.statusCode, ct: res.headers['content-type'] });
    });
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
      const lic = ii.extmetadata?.LicenseShortName?.value || ii.extmetadata?.UsageTerms?.value || '';
      const desc = ii.extmetadata?.ImageDescription?.value || '';
      const date = ii.extmetadata?.DateTimeOriginal?.value || '';
      const h = await head(ii.url);
      return {
        title, ok: h.status === 200 && (h.ct || '').startsWith('image/'),
        url: ii.url, license: lic.replace(/<[^>]+>/g, '').trim(),
        description: desc.replace(/<[^>]+>/g, '').trim().slice(0, 200),
        date: date.replace(/<[^>]+>/g, '').trim(),
        mime: ii.mime, status: h.status, ct: h.ct
      };
    }
  } catch (e) {
    return { title, ok: false, reason: e.message };
  }
}

async function searchTitles(q, limit = 10) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&srlimit=${limit}`;
  const d = await api(url);
  return (d.query?.search || []).map(r => r.title);
}

(async () => {
  const args = process.argv.slice(2);
  const mode = args[0] === '--search' ? 'search' : 'verify';
  const items = mode === 'search' ? args.slice(1) : args;
  if (mode === 'search') {
    for (const q of items) {
      const hits = await searchTitles(q, 8);
      console.log(`# ${q}`);
      hits.forEach(h => console.log('  ' + h));
    }
    return;
  }
  const out = [];
  for (const t of items) {
    const r = await verifyTitle(t);
    out.push(r);
    console.log(JSON.stringify(r));
  }
})();

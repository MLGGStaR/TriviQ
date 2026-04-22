#!/usr/bin/env node
// List images used on a given Wikipedia/Commons article, with metadata.
// Usage: node wiki-images.cjs <article-title> [<article-title> ...]
//  -- queries en.wikipedia.org for images used on page, filters to Commons-hosted.
const https = require('https');

function api(host, path) {
  return new Promise((resolve, reject) => {
    https.get({ host, path, headers: { 'User-Agent': 'trivia-audit/1.0 (thememesofdoom@gmail.com)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('bad json: ' + data.slice(0, 200))); }
      });
    }).on('error', reject);
  });
}

async function listPageImages(title) {
  const q = `/w/api.php?action=query&format=json&titles=${encodeURIComponent(title)}&generator=images&gimlimit=50&prop=imageinfo&iiprop=url|mime|extmetadata`;
  const d = await api('en.wikipedia.org', q);
  const pages = d.query?.pages || {};
  return Object.values(pages).filter(p => p.imageinfo).map(p => {
    const ii = p.imageinfo[0];
    return {
      title: p.title,
      url: ii.url,
      mime: ii.mime,
      license: (ii.extmetadata?.LicenseShortName?.value || '').replace(/<[^>]+>/g, '').trim(),
      desc: (ii.extmetadata?.ImageDescription?.value || '').replace(/<[^>]+>/g, '').trim().slice(0, 200),
      date: (ii.extmetadata?.DateTimeOriginal?.value || '').replace(/<[^>]+>/g, '').trim().slice(0, 40),
      isCommons: (ii.url || '').includes('/commons/')
    };
  });
}

(async () => {
  const titles = process.argv.slice(2);
  for (const t of titles) {
    console.log(`\n=== ${t} ===`);
    try {
      const imgs = await listPageImages(t);
      for (const i of imgs) {
        if (!i.isCommons) continue;
        // skip flags, logos, svg icons etc
        if (/flag|logo|signature|icon|coat.of.arms|arms of|\.svg$/i.test(i.title)) continue;
        if (/autograph/i.test(i.title)) continue;
        console.log(`  ${i.title}\n    lic=${i.license} date=${i.date}\n    url=${i.url}\n    desc=${i.desc}`);
      }
    } catch (e) {
      console.log('  ERROR: ' + e.message);
    }
  }
})();

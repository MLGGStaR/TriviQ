// Verify Commons image URLs return 200 OK (with delay to avoid rate limiting)
const urls = process.argv.slice(2);
for (const u of urls) {
  try {
    const res = await fetch(u, { method: 'HEAD', headers: { 'User-Agent': 'TriviaResearch/1.0 (thememesofdoom@gmail.com)' }, redirect: 'follow' });
    console.log(`${res.status} ${res.headers.get('content-type')} ${res.headers.get('content-length')} ${u}`);
  } catch (e) {
    console.log(`ERR ${e.message} ${u}`);
  }
  await new Promise(r => setTimeout(r, 800));
}

// Quickly check which channels uploaded our fetched trailers
import fs from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function getMeta(videoId) {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "manual" });
    if (res.status !== 200) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const data = JSON.parse(fs.readFileSync("scripts/movie-trailers-fetched.json", "utf8"));
const all = [...(data.t200 || []), ...(data.t400 || []), ...(data.t600 || [])];

const channels = {};
const suspicious = [];
for (let i = 0; i < all.length; i++) {
  const e = all[i];
  const meta = await getMeta(e.videoId);
  if (!meta) {
    console.log(`${e.title.padEnd(30)} FAILED`);
    continue;
  }
  const ch = meta.author_name || "?";
  channels[ch] = (channels[ch] || 0) + 1;
  // Known-good studio/aggregator channels
  const OFFICIAL = /Paramount|Universal|Sony Pictures|20th Century|Warner Bros|Disney|Pixar|Marvel|DC Entertainment|Lionsgate|Focus Features|A24|Searchlight|New Line|DreamWorks|MGM|Tristar|Columbia|Legendary|Blumhouse|Miramax|STX|Studiocanal|BBC|HBO|Netflix|Amazon|Apple TV|Movieclips|Rotten Tomatoes|JoBlo|FilmSpot|IGN|Illumination|Pictures|Entertainment|Studios|Trailers|Cinema|Films|Filmstudio|Umbrella/i;
  if (!OFFICIAL.test(ch)) {
    suspicious.push({ title: e.title, videoId: e.videoId, channel: ch });
    console.log(`SUSPECT ${e.title.padEnd(28)} ${ch}`);
  }
  await sleep(120);
}

console.log("\n=== Suspicious (potentially fan-made) ===");
for (const s of suspicious) {
  console.log(`  ${s.title} | ${s.channel} | https://youtu.be/${s.videoId}`);
}

console.log("\n=== Channel counts ===");
for (const [ch, count] of Object.entries(channels).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${count}  ${ch}`);
}

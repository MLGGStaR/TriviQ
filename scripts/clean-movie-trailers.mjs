// Reads current movieScenes.js, filters out entries from untrusted channels,
// re-searches replacements, and writes a cleaned file.
import fs from "node:fs";
import path from "node:path";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

// Strict allowlist
const TRUSTED_CHANNELS = new RegExp([
  "Paramount","Universal (Pictures|Kids|Pictures At Home|Pictures Ireland)",
  "Sony Pictures","20th Century","Warner Bros","Disney","Pixar","Marvel",
  "Lionsgate","Focus Features","\\bA24\\b","Searchlight","New Line","DreamWorks",
  "MGM","Amazon MGM","Illumination","Legendary","Studiocanal","Magnolia Pictures",
  "Netflix","HBO","Apple TV","Blumhouse","STXfilms","Amblin","Voltage Pictures",
  "Sony Pictures Classics","RLJE Films","Roadshow Films","ANNAPURNA","BFI","Curzon",
  "MUBI","Shout! Studios","Madman Films","Umbrella Entertainment","CBS Films",
  "GSC Movies","Walt Disney","Rotten Tomatoes","Movieclips","JoBlo",
  "\\bIGN\\b","HD Retro Trailers","TrailersPlaygroundHD","Focus Features",
  "20th Century Fox","20th Century Studios","Filmstudio","Pictures Entertainment",
  "Legendary Pictures","Rogue Pictures","Universal Studios","Dimension Films",
  "Working Title","Participant","Plan B","Sidney Kimmel","Metro-Goldwyn-Mayer",
  "Open Road","The Weinstein","Orion Pictures","Well Go USA","IFC Films",
  "Oscilloscope","Kino Lorber","Neon","Vertical Entertainment","Entertainment One",
  "Saban Films","DC Entertainment","Paramount Vantage","Fox Searchlight",
  "Searchlight Pictures","Fox 2000","DreamWorks Pictures","Lionsgate Movies",
  "Sony Pictures Home","Sony Pictures Animation","Channel 4","BBC Films",
  "Film4","Hulu","Peacock","Criterion Collection","Mongrel Media","eOne Films",
  "Entertainment Film","STUDIOCANAL","Shudder","AMC",
].join("|"), "i");

function isTrusted(channel) {
  if (!channel) return false;
  return TRUSTED_CHANNELS.test(channel);
}

async function getChannel(videoId) {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(url, {
      headers: { "user-agent": UA, "connection": "close" },
      keepalive: false,
      redirect: "manual",
    });
    if (res.status !== 200) return null;
    const data = await res.json();
    return data.author_name || null;
  } catch {
    return null;
  }
}

async function searchIds(title) {
  const q = `${title} official trailer`;
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": UA,
        "accept-language": "en-US,en;q=0.9",
        "cookie": "CONSENT=YES+1",
        "connection": "close",
      },
      keepalive: false,
      redirect: "manual",
    });
    if (res.status !== 200) return [];
    const html = await res.text();
    const ids = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
    return [...new Set(ids)];
  } catch {
    return [];
  }
}

async function findTrustedReplacement(title, skipIds) {
  const ids = (await searchIds(title)).filter(id => !skipIds.has(id));
  for (let i = 0; i < Math.min(10, ids.length); i++) {
    const ch = await getChannel(ids[i]);
    if (ch && isTrusted(ch)) return { id: ids[i], channel: ch };
    await sleep(80);
  }
  return { id: null, channel: null };
}

// Parse current movieScenes.js
const movieScenesPath = path.join(process.cwd(), "src", "movieScenes.js");
const src = fs.readFileSync(movieScenesPath, "utf8");

function parseTier(tier) {
  const re = new RegExp(`${tier}:\\s*\\[([\\s\\S]*?)\\]`);
  const m = src.match(re);
  if (!m) return [];
  const body = m[1];
  const entries = [];
  const entryRe = /(easy|medium|hard)\("((?:[^"\\]|\\.)*)",\s*"([a-zA-Z0-9_-]{11})"(?:,\s*(\{[^}]*\}))?\)/g;
  let em;
  while ((em = entryRe.exec(body)) !== null) {
    const extras = em[4] ? em[4].trim() : null;
    entries.push({ level: em[1], title: em[2], videoId: em[3], extras });
  }
  return entries;
}

const t200 = parseTier(200);
const t400 = parseTier(400);
const t600 = parseTier(600);
console.log(`Parsed ${t200.length} / ${t400.length} / ${t600.length} entries`);

const allIds = new Set([...t200, ...t400, ...t600].map(e => e.videoId));

async function processTier(name, entries, level) {
  console.log(`\n=== ${name} ===`);
  const cleaned = [];
  for (const e of entries) {
    const ch = await getChannel(e.videoId);
    if (ch && isTrusted(ch)) {
      cleaned.push({ ...e, channel: ch });
      // console.log(`  ✓ ${e.title} [${ch}]`);
    } else {
      console.log(`  ✗ ${e.title} [${ch || "unreachable"}]`);
      const repl = await findTrustedReplacement(e.title, allIds);
      if (repl.id) {
        allIds.add(repl.id);
        cleaned.push({ ...e, videoId: repl.id, channel: repl.channel });
        console.log(`    → ${repl.id} [${repl.channel}]`);
      } else {
        console.log(`    → NO TRUSTED REPLACEMENT`);
      }
    }
    await sleep(150);
  }
  return cleaned;
}

const cleaned200 = await processTier("TIER 200", t200, "easy");
const cleaned400 = await processTier("TIER 400", t400, "medium");
const cleaned600 = await processTier("TIER 600", t600, "hard");

// Rebuild movieScenes.js
const formatEntry = (e) => {
  const safe = e.title.replace(/"/g, '\\"');
  const extras = e.extras ? `, ${e.extras}` : "";
  return `    ${e.level}("${safe}", "${e.videoId}"${extras}),`;
};

const rebuilt = `const DEFAULT_START = 2;

const scene = (title, videoId, { start = DEFAULT_START, duration, sourceUrl } = {}) => ({
  q: "Clip",
  a: title,
  videoId,
  start,
  duration,
  sourceUrl: sourceUrl || \`https://www.youtube.com/watch?v=\${videoId}\`,
});

const easy = (title, videoId, options = {}) => scene(title, videoId, { duration: 18, ...options });
const medium = (title, videoId, options = {}) => scene(title, videoId, { duration: 16, ...options });
const hard = (title, videoId, options = {}) => scene(title, videoId, { duration: 14, ...options });

const MOVIE_SCENE_BANK = {
  label: "Movie Scenes",
  icon: "🎞️",
  color: "#F97316",
  isMovieScene: true,
  200: [
${cleaned200.map(formatEntry).join("\n")}
  ],
  400: [
${cleaned400.map(formatEntry).join("\n")}
  ],
  600: [
${cleaned600.map(formatEntry).join("\n")}
  ],
};

export default MOVIE_SCENE_BANK;
`;

fs.writeFileSync(movieScenesPath, rebuilt);
console.log(`\nWrote cleaned movieScenes.js`);
console.log(`  Tier 200: ${cleaned200.length}`);
console.log(`  Tier 400: ${cleaned400.length}`);
console.log(`  Tier 600: ${cleaned600.length}`);

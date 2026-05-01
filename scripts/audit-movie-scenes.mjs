// Audit movie scene videoIds: fetch YouTube titles via noembed and flag mismatches/trailers.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "")), "..");
const bankPath = path.join(repoRoot, "src", "movieScenes.js");
const outPath = path.join(repoRoot, "audit", "movie-scenes-titles.json");

const bankModule = await import(pathToFileURL(bankPath).href);
const BANK = bankModule.default;

const entries = [];
for (const tier of [200, 400, 600]) {
  for (const e of BANK[tier] || []) {
    entries.push({ tier, videoId: e.videoId, answer: e.a });
  }
}

console.error(`[audit] total entries: ${entries.length}`);

async function fetchTitle(videoId) {
  const url = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 audit-script" } });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const j = await res.json();
    if (j.error) return { error: j.error };
    return { title: j.title, author: j.author_name };
  } catch (err) {
    return { error: String(err && err.message || err) };
  }
}

const results = [];
const concurrency = 6;
let inFlight = 0;
let idx = 0;
let done = 0;

async function worker() {
  while (idx < entries.length) {
    const myIdx = idx++;
    const e = entries[myIdx];
    inFlight++;
    const t = await fetchTitle(e.videoId);
    inFlight--;
    done++;
    results.push({ ...e, ...t });
    if (done % 20 === 0) console.error(`[audit] ${done}/${entries.length}`);
  }
}

const workers = [];
for (let i = 0; i < concurrency; i++) workers.push(worker());
await Promise.all(workers);

results.sort((a, b) => a.tier - b.tier || a.answer.localeCompare(b.answer));
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.error(`[audit] wrote ${results.length} -> ${outPath}`);

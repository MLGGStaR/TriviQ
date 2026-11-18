// Pick the 14-second window of each Arabic song preview that carries the most singing, and store it as
// clipStart in audit/arabic/<id>.final.json (then rerun scripts/build-arabic-bank.mjs).
// Input: a vocals log from Demucs, one JSON line per clip: {"id": trackId, "per_sec": "..##+#..."} where each
// character is one second of the 30 s iTunes preview: "#" clear vocals, "+" faint vocals, "." none.
// Usage: node scripts/set-arabic-clip-starts.mjs <vocals.log>
import fs from "node:fs";

const WINDOW = 14;
const log = process.argv[2];
if (!log) { console.error("usage: node scripts/set-arabic-clip-starts.mjs <vocals.log>"); process.exit(1); }
const perSec = new Map();
for (const line of fs.readFileSync(log, "utf8").split(/\r?\n/)) {
  if (!line.trim().startsWith("{")) continue;
  const x = JSON.parse(line);
  perSec.set(String(x.id), x.per_sec);
}

function bestStart(map) {
  const score = (c) => (c === "#" ? 1 : c === "+" ? 0.5 : 0);
  let best = 0, bestScore = -1;
  for (let s = 0; s + WINDOW <= map.length; s++) {
    let sc = 0;
    for (let i = s; i < s + WINDOW; i++) sc += score(map[i]);
    if (sc > bestScore + 1e-9) { best = s; bestScore = sc; } // ties keep the earliest start
  }
  // Start one second before the singing comes in, so the first word isn't clipped.
  if (best > 0 && map[best - 1] === ".") best -= 1;
  return { start: best, score: bestScore };
}

const weak = [];
for (const id of ["ar_egyptian_songs", "ar_iraqi_songs", "ar_songs_2016"]) {
  const file = `audit/arabic/${id}.final.json`;
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  let moved = 0, total = 0;
  for (const tier of [200, 400, 600]) for (const e of data[tier] || []) {
    if (!e.previewUrl) continue;
    total++;
    const map = perSec.get(String(e.trackId));
    if (!map) { weak.push(`${id} ${tier}: no vocal map → ${e.a}`); continue; }
    const { start, score } = bestStart(map);
    e.clipStart = start;
    if (start) moved++;
    if (score < 5) weak.push(`${id} ${tier}: only ${score}s of singing in the best window (start ${start}) → ${e.a} / ${e.artist}  ${map}`);
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`${id}: ${moved}/${total} clips start after 0`);
}
if (weak.length) { console.log(`\n${weak.length} clip(s) with little singing:`); weak.forEach((w) => console.log("  " + w)); }

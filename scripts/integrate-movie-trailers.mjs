// Reads scripts/movie-trailers-fetched.json and regenerates src/movieScenes.js
// with the existing scenes plus the newly fetched ones, aiming for 100/100/100.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const movieScenesPath = path.join(root, "src", "movieScenes.js");
const fetchedPath = path.join(root, "scripts", "movie-trailers-fetched.json");

if (!fs.existsSync(fetchedPath)) {
  console.error("movie-trailers-fetched.json not found — run fetch-movie-trailers.mjs first");
  process.exit(1);
}

const fetched = JSON.parse(fs.readFileSync(fetchedPath, "utf8"));

// Parse existing movieScenes.js to get current entries
const existingSrc = fs.readFileSync(movieScenesPath, "utf8");
const existingIds = new Set();
const idMatches = [...existingSrc.matchAll(/"([a-zA-Z0-9_-]{11})"/g)];
for (const m of idMatches) existingIds.add(m[1]);

// Filter out duplicates from fetched
const t200 = (fetched.t200 || []).filter(e => !existingIds.has(e.videoId));
const t400 = (fetched.t400 || []).filter(e => !existingIds.has(e.videoId));
const t600 = (fetched.t600 || []).filter(e => !existingIds.has(e.videoId));

console.log(`Fetched: ${t200.length} / ${t400.length} / ${t600.length}`);

// Build new entries using the existing helpers
const formatEntry = (level, title, id) => {
  const safe = title.replace(/"/g, '\\"');
  return `    ${level}("${safe}", "${id}"),`;
};

const existingT200 = existingSrc.match(/200:\s*\[([\s\S]*?)\],\s*400:/)?.[1] || "";
const existingT400 = existingSrc.match(/400:\s*\[([\s\S]*?)\],\s*600:/)?.[1] || "";
const existingT600 = existingSrc.match(/600:\s*\[([\s\S]*?)\],?\s*\}/)?.[1] || "";

const newT200 = t200.map(e => formatEntry("easy", e.title, e.videoId)).join("\n");
const newT400 = t400.map(e => formatEntry("medium", e.title, e.videoId)).join("\n");
const newT600 = t600.map(e => formatEntry("hard", e.title, e.videoId)).join("\n");

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
  200: [${existingT200}
${newT200}
  ],
  400: [${existingT400}
${newT400}
  ],
  600: [${existingT600}
${newT600}
  ],
};

export default MOVIE_SCENE_BANK;
`;

fs.writeFileSync(movieScenesPath, rebuilt);
console.log(`Wrote ${movieScenesPath}`);
console.log(`Total new entries added: ${t200.length + t400.length + t600.length}`);

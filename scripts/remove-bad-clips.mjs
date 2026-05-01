import fs from "node:fs";
const sourcePath = process.argv[2] || "audit/movie-scenes-issues.json";
const audit = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const list = audit.wrongClips || audit.remove || [];
const badIds = new Set(list.map((c) => c.videoId));
let src = fs.readFileSync("src/movieScenes.js", "utf8");
let removed = 0;
for (const vid of badIds) {
  const esc = vid.replace(/[-.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^\\s*(?:easy|medium|hard|scene)\\("[^"]*",\\s*"${esc}".*?\\),?\\n`, "gm");
  const before = src.length;
  src = src.replace(re, "");
  if (src.length < before) {
    removed++;
    console.log("Removed", vid);
  } else {
    console.log("NOT FOUND", vid);
  }
}
fs.writeFileSync("src/movieScenes.js", src);
console.log("Total removed:", removed, "/", badIds.size);

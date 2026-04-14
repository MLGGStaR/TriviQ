// Finds duplicates across categories (same subject, different category).
// Removes from less-specific categories, keeps in more-specific ones.
import fs from "node:fs";

const CATEGORY_PRIORITY = {
  // More specific categories win over general ones
  marvel: 100, dc: 100, spider_man: 100, star_wars: 100, harry_potter: 100,
  breaking_bad: 100, game_thrones: 100, the_office: 100, friends: 100,
  stranger_things: 100, prison_break: 100, big_bang_theory: 100, suits: 100,
  brooklyn_99: 100, dexter: 100, vikings: 100, the_flash: 100, arrow: 100,
  the_walking_dead: 100, himym: 100, modern_family: 100, family_guy: 100,
  invincible: 100, the_boys: 100, blacklist: 100,
  disney: 100, lord_rings: 100, anime: 100, pokemon: 100, dragon_ball: 100,
  one_piece_show: 100, solo_leveling: 100, ark_survival: 100, fortnite: 100,
  minecraft: 100, valorant: 100, video_games: 90,
  movies: 50, movie_scenes: 80, songs: 80, music: 50, sports: 50,
  pop_culture: 40, technology: 40, science: 50, history: 50, geography: 50,
  general: 10,
  country_facts: 80, country_emoji: 80, movie_show_emoji: 80, general_emoji: 80,
  logos: 80, flags: 80, country_map: 80,
  who_footballer: 100, who_tv_character: 100, who_anime_character: 100,
  who_movie_character: 100, who_historic_figure: 100, who_animal: 100,
  who_country_landmark: 100,
};

const files = [
  "src/App.jsx",
  "src/newCategoriesBank.js",
  "src/megaNewExpansions.js",
  "src/triviaExpansions.js",
  "src/triviaMegaExpansions.js",
  "src/triviaUltraExpansions.js",
  "src/triviaMinimums.js",
  "src/triviaTierBalanceExpansions.js",
  "src/triviaTierParityExpansions.js",
  "src/triviaTierFinalParityExpansions.js",
  "src/triviaTierFinalTopoffExpansions.js",
  "src/moreTriviaExpansions.js",
  "src/questionRefinements.js",
];

const STOP = new Set("what which when where does that this with from have been into they them their whose whom about these those also just very most more than some were before after each every only other over such just then will back also been call come could even find first give have here just know last look make many most must name only over part some take tell than that them then they this come want year your the and for are but not you all can had her his him its our out was who".split(" "));
function keyWords(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(w => w.length > 3 && !STOP.has(w));
}
function normAnswer(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function similarity(q1, q2) {
  const w1 = new Set(keyWords(q1));
  const w2 = new Set(keyWords(q2));
  if (!w1.size || !w2.size) return 0;
  let o = 0;
  for (const w of w1) if (w2.has(w)) o++;
  return o / Math.min(w1.size, w2.size);
}

// Collect entries
const entries = [];
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const lines = src.split("\n");
  let currentCat = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const catMatch = line.match(/^\s*([a-z_]+)\s*:\s*\{/);
    if (catMatch && !["200","400","600","label","icon","color"].includes(catMatch[1])) {
      currentCat = catMatch[1];
    }
    const re1 = /\{q:"([^"]*)",a:"([^"]*)"/g;
    let m;
    while ((m = re1.exec(line)) !== null) {
      if (currentCat) entries.push({ cat: currentCat, q: m[1], a: m[2], file: f, line: i + 1 });
    }
    const re2 = /\["([^"]*)",\s*"([^"]*)"\]/g;
    while ((m = re2.exec(line)) !== null) {
      if (currentCat) entries.push({ cat: currentCat, q: m[1], a: m[2], file: f, line: i + 1 });
    }
  }
}

// Group by answer
const byAnswer = {};
for (const e of entries) {
  const key = normAnswer(e.a);
  if (!key) continue;
  if (!byAnswer[key]) byAnswer[key] = [];
  byAnswer[key].push(e);
}

// Find cross-category dupes
const toRemove = new Set(); // keys: file + ':' + line
let groups = 0;
for (const group of Object.values(byAnswer)) {
  if (group.length < 2) continue;
  // Build pairs of same-answer entries in DIFFERENT categories with similar questions
  const dupeGroup = [];
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      if (group[i].cat === group[j].cat) continue;
      if (similarity(group[i].q, group[j].q) >= 0.3) {
        dupeGroup.push([group[i], group[j]]);
      }
    }
  }
  if (!dupeGroup.length) continue;
  groups++;

  // Sort group by priority — highest wins
  const uniqueEntries = [...new Set(dupeGroup.flat())];
  uniqueEntries.sort((a, b) => (CATEGORY_PRIORITY[b.cat] || 0) - (CATEGORY_PRIORITY[a.cat] || 0));
  const keeper = uniqueEntries[0];
  for (const e of uniqueEntries) {
    if (e === keeper) continue;
    toRemove.add(e.file + ':' + e.line + ':' + e.q);
  }
}

console.log(`Found ${groups} cross-category dupe groups, removing ${toRemove.size} entries`);

// Remove from files
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const lines = src.split("\n");
  const newLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if any removal target matches this line
    let remove = false;
    for (const r of toRemove) {
      if (!r.startsWith(f + ':' + (i+1) + ':')) continue;
      const q = r.slice((f + ':' + (i+1) + ':').length);
      if (line.includes(`"${q}"`)) {
        remove = true;
        break;
      }
    }
    if (!remove) newLines.push(line);
  }
  if (newLines.length !== lines.length) {
    fs.writeFileSync(f, newLines.join("\n"));
    console.log(`  ${f}: removed ${lines.length - newLines.length}`);
  }
}

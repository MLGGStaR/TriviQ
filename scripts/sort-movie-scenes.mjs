// Re-sorts movieScenes.js tiers by movie popularity (most popular first in 200, least in 600).
// Also redistributes: tier 200 = most popular third, 400 = middle, 600 = least popular.
import fs from "node:fs";

// Global popularity ranking — lower = more popular/famous.
// Based on box office, cultural impact, and general recognizability.
const POPULARITY = {
  // Tier 200 — universally known blockbusters
  "Avatar": 1, "Avengers Endgame": 2, "Titanic": 3, "Star Wars A New Hope": 4,
  "The Lion King": 5, "Jurassic Park": 6, "Frozen": 7, "The Avengers": 8,
  "Harry Potter": 9, "Spider-Man": 10, "Finding Nemo": 11, "Toy Story": 12,
  "The Dark Knight Rises": 13, "Shrek": 14, "The Matrix": 15, "Forrest Gump": 16,
  "Iron Man": 17, "Avengers Infinity War": 18, "Home Alone": 19, "Pirates of the Caribbean": 20,
  "Back to the Future": 21, "The Hunger Games": 22, "Transformers": 23,
  "Gladiator": 24, "The Incredibles": 25, "Jaws": 26,
  "Men in Black": 27, "Moana": 28, "Aladdin": 29, "The Little Mermaid": 30,
  "Beauty and the Beast": 31, "Independence Day": 32, "Die Hard": 33,
  "Up": 34, "Monsters Inc": 35, "Cars": 36, "Finding Dory": 37,
  "Despicable Me": 38, "Minions": 39, "Madagascar": 40,
  "The Godfather": 41, "Black Panther": 42, "Thor Ragnarok": 43,
  "Deadpool": 44, "Wonder Woman": 45, "Aquaman": 46,
  "Ice Age": 47, "Kung Fu Panda": 48, "How to Train Your Dragon": 49,
  "Shrek 2": 50, "Man of Steel": 51, "Ratatouille": 52, "Wall-E": 53,
  "Zootopia": 54, "Mission Impossible": 55, "The Bourne Identity": 56,
  "Taken": 57, "Rush Hour": 58, "Bad Boys": 59,
  "The Fast and the Furious": 60, "Fast Five": 61,
  "Captain America The First Avenger": 62, "Doctor Strange": 63,
  "Guardians of the Galaxy": 64, "Joker": 65,
  "The Terminator": 66, "Alien": 67, "Predator": 68,
  "Mulan": 69, "Hercules": 70, "The Jungle Book": 71,
  "Tarzan": 72, "King Kong": 73, "2012": 74, "The Day After Tomorrow": 75,
  "Pulp Fiction": 76, "Fight Club": 77, "Armageddon": 78,

  // Tier 400 — well-known, recognized by most movie fans
  "Inception": 80, "Interstellar": 81, "The Silence of the Lambs": 82,
  "Saving Private Ryan": 83, "Goodfellas": 84, "Scarface": 85,
  "Top Gun Maverick": 86, "John Wick": 87, "Rocky": 88,
  "The Departed": 89, "Full Metal Jacket": 90, "Casino Royale": 91,
  "Terminator 2": 92, "The Sixth Sense": 93, "Apocalypse Now": 94,
  "Taxi Driver": 95, "The Truman Show": 96, "Mad Max Fury Road": 97,
  "Heat": 98, "Seven": 99, "Creed": 100,
  "Trainspotting": 101, "American Psycho": 102, "The Social Network": 103,
  "La La Land": 104, "Whiplash": 105, "Baby Driver": 106,
  "No Country for Old Men": 107, "Black Swan": 108,
  "Good Will Hunting": 109, "Argo": 110,
  "The Big Short": 111, "Raging Bull": 112,
  "Hacksaw Ridge": 113, "American Sniper": 114,
  "Blade Runner 2049": 115, "The Grand Budapest Hotel": 116,
  "Prisoners": 117, "Nightcrawler": 118, "Drive": 119,
  "Hot Fuzz": 120, "Shaun of the Dead": 121,
  "Scott Pilgrim": 122, "Kick-Ass": 123,
  "The Fifth Element": 124, "Snatch": 125,
  "A Beautiful Mind": 126, "Moneyball": 127,
  "American Gangster": 128, "Casino": 129,
  "Knives Out": 130, "Hell or High Water": 131,
  "Sicario": 132, "Collateral": 133, "The Town": 134,
  "Mystic River": 135, "Leon The Professional": 136,
  "Munich": 137, "Platoon": 138, "Donnie Brasco": 139,
  "The Untouchables": 140, "The Irishman": 141,
  "The Pursuit of Happyness": 142, "Lucy": 143,
  "Atomic Blonde": 144, "The Wrestler": 145,
  "The Founder": 146, "Steve Jobs": 147,
  "Warrior": 148, "Black Hawk Down": 149,

  // Tier 600 — niche, art house, cult, less mainstream
  "The Shawshank Redemption": 160, "Get Out": 161,
  "The Wolf of Wall Street": 162, "Parasite": 163,
  "Logan": 164, "Skyfall": 165, "Gone Girl": 166,
  "The Batman": 167, "The Revenant": 168, "Dunkirk": 169,
  "A Quiet Place": 170, "The Martian": 171,
  "Ford v Ferrari": 172, "Shutter Island": 173,
  "The Conjuring": 174, "Mission Impossible Fallout": 175,
  "The Bourne Ultimatum": 176, "Gravity": 177,
  "The Imitation Game": 178, "1917": 179,
  "Spirited Away": 180, "Eternal Sunshine of the Spotless Mind": 181,
  "Her": 182, "Uncut Gems": 183, "Poor Things": 184,
  "The Favourite": 185, "Mulholland Drive": 186,
  "Boogie Nights": 187, "Boyhood": 188,
  "Lost in Translation": 189, "Before Sunrise": 190,
  "Memories of Murder": 191, "The Handmaiden": 192,
  "Blue Velvet": 193, "The Elephant Man": 194,
  "Bronson": 195, "The Tree of Life": 196,
  "Princess Mononoke": 197, "Roma": 198,
  "The Place Beyond the Pines": 199, "Blue Valentine": 200,
  "The Master": 201, "Phantom Thread": 202,
  "Good Time": 203, "Magnolia": 204,
  "Licorice Pizza": 205, "The Neon Demon": 206,
  "Moonrise Kingdom": 207, "The French Dispatch": 208,
  "Fantastic Mr Fox": 209, "The Lobster": 210,
  "The Killing of a Sacred Deer": 211, "Inherent Vice": 212,
  "The Virgin Suicides": 213, "Black Mass": 214,
  "Before Sunset": 215, "Amores Perros": 216,
  "Pan's Labyrinth": 217,
};

const movieScenesPath = "src/movieScenes.js";
const src = fs.readFileSync(movieScenesPath, "utf8");

// Parse all entries from all tiers into one pool
function parseTier(tierNum) {
  const re = new RegExp(`${tierNum}:\\s*\\[([\\s\\S]*?)\\]`);
  const m = src.match(re);
  if (!m) return [];
  const entries = [];
  const entryRe = /(easy|medium|hard)\("((?:[^"\\]|\\.)*)",\s*"([a-zA-Z0-9_-]{11})"(?:,\s*(\{[^}]*\}))?\)/g;
  let em;
  while ((em = entryRe.exec(m[1])) !== null) {
    entries.push({ title: em[2], videoId: em[3], extras: em[4] || null });
  }
  return entries;
}

// Collect all entries
const all = [...parseTier(200), ...parseTier(400), ...parseTier(600)];
console.log(`Total entries: ${all.length}`);

// Sort by popularity (lower = more popular)
all.sort((a, b) => {
  const pa = POPULARITY[a.title] ?? 999;
  const pb = POPULARITY[b.title] ?? 999;
  return pa - pb;
});

// Split into 3 equal tiers
const per = Math.ceil(all.length / 3);
const t200 = all.slice(0, per);
const t400 = all.slice(per, per * 2);
const t600 = all.slice(per * 2);

console.log(`Tier 200: ${t200.length} (${t200[0]?.title} ... ${t200[t200.length-1]?.title})`);
console.log(`Tier 400: ${t400.length} (${t400[0]?.title} ... ${t400[t400.length-1]?.title})`);
console.log(`Tier 600: ${t600.length} (${t600[0]?.title} ... ${t600[t600.length-1]?.title})`);

// Rebuild
const fmt = (level, e) => {
  const safe = e.title.replace(/"/g, '\\"');
  const extras = e.extras ? `, ${e.extras}` : "";
  return `    ${level}("${safe}", "${e.videoId}"${extras}),`;
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
${t200.map(e => fmt("easy", e)).join("\n")}
  ],
  400: [
${t400.map(e => fmt("medium", e)).join("\n")}
  ],
  600: [
${t600.map(e => fmt("hard", e)).join("\n")}
  ],
};

export default MOVIE_SCENE_BANK;
`;

fs.writeFileSync(movieScenesPath, rebuilt);
console.log("\nWrote sorted movieScenes.js");

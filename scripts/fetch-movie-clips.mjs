// Fetches actual movie CLIPS (scenes from the movie), NOT trailers.
// Prefers the "Movieclips" channel which uploads real scenes.
import fs from "node:fs";
import path from "node:path";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

// Trusted clip channels (actual movie scenes, not trailers or fan edits)
const CLIP_CHANNELS = /Movieclips|Rotten Tomatoes|Sony Pictures|Warner Bros|Universal Pictures|Disney|Pixar|Paramount|20th Century|Lionsgate|MGM|Amazon MGM|A24|Focus Features|Searchlight|HBO|Netflix|Marvel|DC|DreamWorks|Illumination|Madman|Studiocanal|Magnolia|BBC|BFI|Miramax|Shout! Studios|Amblin/i;

// Reject trailer-only channels and fan channels
const REJECT_TITLE = /official trailer|teaser trailer|final trailer|trailer \d|movie trailer|tv spot|behind the scenes|making of|review|explained|breakdown|reaction|fan made|fan edit/i;

async function searchYT(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9", "cookie": "CONSENT=YES+1", "connection": "close" },
      keepalive: false, redirect: "manual",
    });
    if (res.status !== 200) return [];
    const html = await res.text();
    const ids = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
    return [...new Set(ids)];
  } catch { return []; }
}

async function getVideoMeta(videoId) {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(url, { headers: { "user-agent": UA, "connection": "close" }, keepalive: false, redirect: "manual" });
    if (res.status !== 200) return null;
    return await res.json();
  } catch { return null; }
}

async function findClip(movieTitle, existingIds) {
  // Try multiple search queries, prefer "clip" and "scene" over "trailer"
  const queries = [
    `${movieTitle} movie clip Movieclips`,
    `${movieTitle} movie scene`,
    `${movieTitle} clip HD`,
  ];

  for (const query of queries) {
    const ids = (await searchYT(query)).filter(id => !existingIds.has(id));
    for (let i = 0; i < Math.min(8, ids.length); i++) {
      const meta = await getVideoMeta(ids[i]);
      if (!meta) continue;
      const title = meta.title || "";
      const channel = meta.author_name || "";

      // Skip if title says "trailer"
      if (REJECT_TITLE.test(title)) continue;

      // Prefer Movieclips channel (they have actual scenes)
      if (CLIP_CHANNELS.test(channel)) {
        return { id: ids[i], channel, title };
      }
      await sleep(60);
    }
    await sleep(150);
  }
  return { id: null, channel: null, title: null };
}

// Movie lists by tier
const TIER_200 = [
  "Forrest Gump","The Godfather","Pulp Fiction","Fight Club",
  "The Incredibles","Finding Dory","Up","Moana","Ratatouille",
  "Wall-E","Zootopia","Despicable Me","Minions",
  "Kung Fu Panda","How to Train Your Dragon","Shrek 2","Ice Age","Madagascar",
  "Cars","Monsters Inc","The Little Mermaid","Beauty and the Beast","Aladdin",
  "Mulan","Hercules","The Jungle Book","Tarzan",
  "The Terminator","Alien","Predator","Independence Day","Men in Black",
  "King Kong","The Day After Tomorrow","2012",
  "Taken","The Bourne Identity","Mission Impossible","Die Hard",
  "Rush Hour","Bad Boys","The Fast and the Furious","Fast Five",
  "Armageddon","Transformers",
  "Iron Man","Captain America The First Avenger","Black Panther","Doctor Strange","Guardians of the Galaxy",
  "Avengers Endgame","Avengers Infinity War","Thor Ragnarok","Deadpool","Wonder Woman",
  "Aquaman","Man of Steel","Joker","The Dark Knight Rises",
  "Titanic","Jurassic Park","The Lion King","Toy Story","Frozen","Shrek",
  "The Matrix","Gladiator","Pirates of the Caribbean","Back to the Future",
  "The Hunger Games","Finding Nemo","Home Alone","Jaws",
  "Harry Potter","Spider-Man","Star Wars A New Hope","The Avengers","Avatar",
];

const TIER_400 = [
  "Good Will Hunting","A Beautiful Mind","The Social Network","Moneyball","The Big Short",
  "The Founder","Steve Jobs","Rush","The Pursuit of Happyness","Rocky",
  "Creed","Raging Bull","The Wrestler","Million Dollar Baby","Warrior",
  "Fury","Saving Private Ryan","Full Metal Jacket","Platoon","Apocalypse Now",
  "Black Hawk Down","Hacksaw Ridge","American Sniper","Zero Dark Thirty","Argo",
  "Munich","The Hurt Locker","Sicario","Hell or High Water","Wind River",
  "Prisoners","Nightcrawler","Drive","Collateral","Heat",
  "The Town","Mystic River","Zodiac","Seven","The Silence of the Lambs",
  "American Psycho","Trainspotting","Snatch","Baby Driver","Hot Fuzz",
  "Shaun of the Dead","Scott Pilgrim","Kick-Ass","Atomic Blonde",
  "Lucy","The Fifth Element","Leon The Professional",
  "Taxi Driver","Goodfellas","Casino","The Irishman",
  "Donnie Brasco","The Untouchables","American Gangster","The Departed","Scarface",
  "Interstellar","Inception","The Truman Show","Mad Max Fury Road","Whiplash",
  "John Wick","Top Gun Maverick","Casino Royale","Knives Out","The Prestige",
  "Terminator 2","The Sixth Sense","La La Land","Black Swan",
  "No Country for Old Men","The Grand Budapest Hotel","Blade Runner 2049",
];

const TIER_600 = [
  "There Will Be Blood","The Master","Phantom Thread","Licorice Pizza","Magnolia",
  "Punch-Drunk Love","Boogie Nights","Inherent Vice",
  "The Royal Tenenbaums","Rushmore","Moonrise Kingdom","Isle of Dogs","The French Dispatch",
  "Fantastic Mr Fox","Eternal Sunshine of the Spotless Mind",
  "Her","Lost in Translation","The Virgin Suicides",
  "Melancholia","The Lobster","The Killing of a Sacred Deer","The Favourite","Poor Things",
  "Mandy","Uncut Gems","Good Time","Lawless","Black Mass",
  "The Place Beyond the Pines","Blue Valentine","The Neon Demon","Bronson",
  "The Tree of Life","Before Sunrise","Before Sunset","Boyhood",
  "The Elephant Man","Mulholland Drive","Blue Velvet",
  "1917","Skyfall","The Revenant","A Quiet Place","The Bourne Ultimatum",
  "The Martian","Mission Impossible Fallout","The Batman","Gravity","Gone Girl",
  "Dunkirk","Ford v Ferrari","The Wolf of Wall Street","Logan",
  "The Imitation Game","Shutter Island","Get Out","The Conjuring","The Shawshank Redemption",
  "Oldboy","Parasite","Memories of Murder","The Handmaiden",
  "City of God","Amores Perros","Pan's Labyrinth","Roma",
  "In the Mood for Love","Chungking Express","Fallen Angels",
  "Spirited Away","Princess Mononoke","Akira","Perfect Blue",
];

const existingIds = new Set();

async function processList(name, list) {
  console.log(`\n=== ${name} ===`);
  const results = [];
  for (const title of list) {
    const { id, channel, title: vidTitle } = await findClip(title, existingIds);
    if (id) {
      existingIds.add(id);
      results.push({ title, videoId: id, channel, vidTitle });
      console.log(`  ✓ ${title} -> ${id}  [${channel}] "${(vidTitle||"").slice(0,50)}"`);
    } else {
      console.log(`  ✗ ${title}`);
    }
    await sleep(200);
  }
  return results;
}

const t200 = await processList("TIER 200 (easy)", TIER_200);
const t400 = await processList("TIER 400 (medium)", TIER_400);
const t600 = await processList("TIER 600 (hard)", TIER_600);

// Write results
const outPath = path.join(process.cwd(), "scripts", "movie-clips-fetched.json");
fs.writeFileSync(outPath, JSON.stringify({ t200, t400, t600 }, null, 2));

// Also directly rebuild movieScenes.js
const formatEntry = (level, e) => `    ${level}("${e.title.replace(/"/g, '\\"')}", "${e.videoId}"),`;

const movieScenesPath = path.join(process.cwd(), "src", "movieScenes.js");
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
${t200.map(e => formatEntry("easy", e)).join("\n")}
  ],
  400: [
${t400.map(e => formatEntry("medium", e)).join("\n")}
  ],
  600: [
${t600.map(e => formatEntry("hard", e)).join("\n")}
  ],
};

export default MOVIE_SCENE_BANK;
`;

fs.writeFileSync(movieScenesPath, rebuilt);
console.log(`\nWrote movieScenes.js: ${t200.length} / ${t400.length} / ${t600.length}`);

// Fetches YouTube trailer IDs for a list of movie titles via search scraping.
// Writes to scripts/movie-trailers-fetched.json.
import fs from "node:fs";
import path from "node:path";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

async function fetchTrailer(title) {
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
    if (res.status !== 200) return null;
    const html = await res.text();
    const ids = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
    const unique = [...new Set(ids)];
    return unique[0] || null;
  } catch (e) {
    return null;
  }
}

// Tier 200 (easy)
const TIER_200 = [
  "Forrest Gump","The Godfather","Pulp Fiction","Fight Club","The Shawshank Redemption",
  "The Incredibles","Finding Dory","Up","Moana","Ratatouille",
  "Wall-E","Zootopia","The Secret Life of Pets","Despicable Me","Minions",
  "Kung Fu Panda","How to Train Your Dragon","Shrek 2","Ice Age","Madagascar",
  "Cars","Monsters Inc","The Little Mermaid","Beauty and the Beast","Aladdin",
  "Cinderella","Snow White","Peter Pan","101 Dalmatians","Bambi",
  "Tarzan","Mulan","Pocahontas","Hercules","The Jungle Book",
  "The Hunchback of Notre Dame","Alice in Wonderland","Sleeping Beauty","Dumbo","Fantasia",
  "The Terminator","Alien","Predator","RoboCop","Total Recall",
  "Aliens","Starship Troopers","Independence Day","Men in Black","Godzilla",
  "King Kong","War of the Worlds","The Day After Tomorrow","2012","San Andreas",
  "Taken","The Bourne Identity","Mission Impossible","Die Hard","Lethal Weapon",
  "Rush Hour","Bad Boys","The Fast and the Furious","Fast Five","The Rock",
  "Con Air","Face Off","Armageddon","Pearl Harbor","Transformers",
  "Iron Man","Captain America","Black Panther","Doctor Strange","Guardians of the Galaxy",
  "Avengers Endgame","Avengers Infinity War","Thor Ragnarok","Deadpool 2","Wonder Woman",
  "Aquaman","Man of Steel","Justice League","Suicide Squad","Joker",
];

// Tier 400 (medium)
const TIER_400 = [
  "Good Will Hunting","A Beautiful Mind","The Social Network","Moneyball","The Big Short",
  "Wall Street","Margin Call","Boiler Room","The Founder","Steve Jobs",
  "Rush","Seabiscuit","The Pursuit of Happyness","Rocky","Creed",
  "Raging Bull","The Wrestler","Foxcatcher","Million Dollar Baby","Cinderella Man",
  "Warrior","Fury","Saving Private Ryan","Full Metal Jacket","Platoon",
  "Apocalypse Now","Black Hawk Down","Hacksaw Ridge","We Were Soldiers","The Thin Red Line",
  "Jarhead","Lone Survivor","American Sniper","Zero Dark Thirty","Argo",
  "Munich","The Hurt Locker","Green Zone","Body of Lies","Syriana",
  "Sicario","Hell or High Water","Wind River","Prisoners","Nightcrawler",
  "Drive","Collateral","Heat","The Town","Gone Baby Gone",
  "Mystic River","Zodiac","Seven","The Silence of the Lambs","Red Dragon",
  "Hannibal","Manhunter","American Psycho","Filth","Trainspotting",
  "Snatch","Lock Stock and Two Smoking Barrels","The Gentlemen","Baby Driver","Hot Fuzz",
  "Shaun of the Dead","Scott Pilgrim vs the World","Kick-Ass","Atomic Blonde","Red Sparrow",
  "Salt","Anna","Lucy","The Fifth Element","Leon The Professional",
  "Taxi Driver","Goodfellas","Casino","The Irishman","Public Enemies",
  "Donnie Brasco","The Untouchables","American Gangster","Heat Pacino","Blow",
  "The Departed","Scarface","Carlito's Way","Casino 1995","A Bronx Tale",
];

// Tier 600 (hard / critically acclaimed / art)
const TIER_600 = [
  "There Will Be Blood","The Master","Phantom Thread","Licorice Pizza","Magnolia",
  "Punch-Drunk Love","Boogie Nights","Inherent Vice","Hard Eight","The Royal Tenenbaums",
  "Rushmore","Moonrise Kingdom","Isle of Dogs","The French Dispatch","Bottle Rocket",
  "The Life Aquatic","The Darjeeling Limited","Fantastic Mr Fox","Asteroid City","Synecdoche New York",
  "Being John Malkovich","Adaptation","Eternal Sunshine of the Spotless Mind","Anomalisa","I'm Thinking of Ending Things",
  "Her","Lost in Translation","Marie Antoinette","The Virgin Suicides","Somewhere",
  "The Beguiled","On the Rocks","Priscilla","Melancholia","Antichrist",
  "Dogville","Breaking the Waves","Dancer in the Dark","Dogtooth","The Lobster",
  "The Killing of a Sacred Deer","The Favourite","Poor Things","Kinds of Kindness","Holy Motors",
  "Enter the Void","Climax","Irreversible","Mandy","Color Out of Space",
  "Pig","Dream Scenario","Leaving Las Vegas","Uncut Gems","Good Time",
  "The Rover","Lawless","Killing Them Softly","Out of the Furnace","Black Mass",
  "The Place Beyond the Pines","Blue Valentine","Only God Forgives","The Neon Demon","Bronson",
  "Valhalla Rising","Pusher","Cosmopolis","The Tree of Life","A Hidden Life",
  "Knight of Cups","To the Wonder","Song to Song","Badlands","Days of Heaven",
  "Waking Life","A Scanner Darkly","Before Sunrise","Before Sunset","Before Midnight",
  "Boyhood","Paris Texas","Wings of Desire","The Elephant Man","Mulholland Drive",
  "Lost Highway","Wild at Heart","Blue Velvet","Twin Peaks Fire Walk with Me","Eraserhead",
];

const existingIds = new Set();
const movieScenesPath = path.join(process.cwd(), "src", "movieScenes.js");
const existingSrc = fs.readFileSync(movieScenesPath, "utf8");
const existingMatches = [...existingSrc.matchAll(/"([a-zA-Z0-9_-]{11})"/g)];
for (const m of existingMatches) existingIds.add(m[1]);

async function processList(list) {
  const results = [];
  for (const title of list) {
    const id = await fetchTrailer(title);
    if (id && !existingIds.has(id)) {
      existingIds.add(id);
      results.push({ title, videoId: id });
      console.log(`  ✓ ${title} -> ${id}`);
    } else if (id) {
      console.log(`  ~ ${title} -> ${id} (dup)`);
    } else {
      console.log(`  ✗ ${title}`);
    }
    await sleep(250);
  }
  return results;
}

console.log("=== TIER 200 ===");
const t200 = await processList(TIER_200);
console.log("\n=== TIER 400 ===");
const t400 = await processList(TIER_400);
console.log("\n=== TIER 600 ===");
const t600 = await processList(TIER_600);

const outPath = path.join(process.cwd(), "scripts", "movie-trailers-fetched.json");
fs.writeFileSync(outPath, JSON.stringify({ t200, t400, t600 }, null, 2));
console.log(`\nWrote ${t200.length + t400.length + t600.length} trailers`);
console.log(`  Tier 200: ${t200.length}`);
console.log(`  Tier 400: ${t400.length}`);
console.log(`  Tier 600: ${t600.length}`);

// Rules-based sweep: blacklist baby-level questions in tiers 200 + 400 across all standard trivia cats.
import fs from "node:fs";

const BANKS = [
  "triviaExpansions","triviaMinimums","triviaMegaExpansions","triviaUltraExpansions",
  "triviaTierBalanceExpansions","triviaTierParityExpansions","triviaTierFinalParityExpansions",
  "triviaTierFinalTopoffExpansions","newCategoriesBank","megaNewExpansions","moreTriviaExpansions",
  "newCategoriesPack2","qualityBackfill",
];
const SKIP_CAT = /^(who_|charades_|spelling_bee$|country_capitals$|language$|logos$|flags$|country_map$|movie_scenes$|songs$|guess_footballer$|borders_country$)/;

const P = [
  /what (do you|do we|would you|does one) call (a|an|the) (baby|young|female|male|group|infant)/i,
  /what is (a|an) (baby|young) \w+ called/i,
  /a (baby|young) \w+ is called/i,
  /what (sound|noise) does (a|an|the) \w+ make/i,
  /what (animal|bird|creature) (says|goes|makes the sound) /i,
  /how many (legs|eyes|ears|wheels|wings|fingers|toes|arms|hands|feet|noses|tails|horns) (does|do|has|have) /i,
  /how many (days|months|weeks|hours|minutes|seconds) (are |is )?(there )?in (a|an|one) (week|year|day|hour|minute)\b/i,
  /how many (sides|corners) (does|has) (a|an) (square|triangle|circle|rectangle)/i,
  /how many (letters|vowels) (are |is )?(there )?in the (english )?alphabet/i,
  /how many (continents|oceans|planets|colou?rs (are )?in a rainbow|days (are )?in february)/i,
  /what colou?r (is|are) (the )?(sky|grass|snow|sun|banana|bananas|blood|milk|orange|oranges|lemon|lemons|ocean|sea|stop sign|moon|clouds|coal|leaves|fire truck|fire engine|carrot|carrots|strawberr|apple|apples)\b/i,
  /what colou?r do you get (when|if) you mix/i,
  /what is (\d|1[0-2]) ?(\+|plus|-|minus|x|×|\*|times|÷|\/|divided by) ?(\d|1[0-2])\b\s*\??$/i,
  /what (comes|is) (the )?(opposite of|antonym of) (hot|cold|up|down|big|small|day|night|black|white|left|right|fast|slow|happy|sad|wet|dry|old|new|open|closed|in|out|on|off|high|low|tall|short|light|dark|good|bad)\b/i,
  /what (day|month|season) comes (after|before|next)/i,
  /what (is the )?(first|last) (day|month) of the (week|year)/i,
  /what do (cows|bees|chickens|hens|sheep) (produce|make|give us|lay)/i,
  /what is the (first|last) letter (of|in) the (english )?alphabet/i,
  /what letter comes (after|before)/i,
  /what planet do we live on/i,
  /what is the name of (our|the) planet/i,
  /what shape is (a|the) (ball|circle|wheel|coin|stop sign)/i,
  /what is (h2o|h₂o)\b/i,
  /chemical (formula|symbol) (for|of) water\b/i,
  /what gas do (humans|we|people) (breathe|need)/i,
  /what do (humans|we|people|plants|trees) need to (live|survive|grow|breathe)/i,
  /what is the capital of (france|england|the uk|the united kingdom|italy|spain|germany|japan|the usa|the united states|america|russia|china|egypt|canada|australia|india|greece|mexico|brazil)\??$/i,
  /(largest|biggest) (ocean|planet|continent|animal|mammal|bird|desert)( on earth| in the world| in the solar system| in our solar system)?\??$/i,
  /(longest river|tallest mountain|highest mountain|largest ocean|hottest planet|coldest continent|smallest continent|closest planet to the sun|closest star to earth)( in the world| on earth)?\??$/i,
  /what (currency|money) (is used|do they use) in (the usa|the united states|america|the uk|britain|england|japan)\b/i,
  /what is the plural of (mouse|child|foot|tooth|goose|man|woman|person|cat|dog|box)/i,
  /what (organ|part of the body|body part) (pumps|do (you|we) (see|hear|smell|think|breathe) with)/i,
  /what do (you|we) use to (cut paper|write|see|hear|smell|brush (your|our) teeth)/i,
  /what do (fish|birds|bees|spiders|cows|frogs) (live in|breathe|make|eat|do)\b/i,
  /what (is|are) (the )?(primary|three primary) colou?rs/i,
  /how many (colou?rs|stripes|stars) (are )?(on|in) the (rainbow|american flag|us flag)/i,
  /what (season|time of year) (is|do we) (christmas|halloween|snow)/i,
  /what holiday (is|falls) on (december 25|october 31|january 1)/i,
  /what is (2|two) (\+|plus) (2|two)/i,
  /what number comes after (\d|ten|nine)\b/i,
  /how many (zeros|zeroes) (are )?in (a |one )?(hundred|thousand)\b/i,
  /which is (bigger|larger|heavier|faster)[,:]? (a|an) /i,
  /^is (a|an) \w+ (a|an) (animal|fruit|vegetable|mammal|bird|fish|insect|reptile)\??$/i,
  /what (animal|pet) (barks|meows|purrs|has a trunk|has a long neck|has stripes|has black and white stripes|lives in a hive|makes honey|lays eggs)\b/i,
  /what (fruit|vegetable) (is|are) (yellow|orange|red|green) and (curved|round|long)/i,
  /which fruit keeps the doctor away/i,
  /what do (you|we) (call|name) the (place|building) where (you|we|people) (learn|sleep|eat|pray|watch movies|buy food)/i,
  /what (vehicle|thing) (flies|has two wheels|has four wheels|goes on rails)\b/i,
  /what (do you|is used to) (tell|measure) (the )?time\b/i,
  /what (do you|does one) (sleep|sit) (on|in)\??$/i,
  // Grade-school unit / currency conversions
  /how many (pennies|cents|nickels|dimes|quarters) (are )?(there )?in (a|an|one) (nickel|dime|quarter|dollar)\b/i,
  /how many (inches|feet) (are )?(there )?in (a|an|one) (foot|yard)\b/i,
  /how many (ounces|pounds|grams|millilit(er|re)s|centimet(er|re)s|millimet(er|re)s) (are )?(there )?in (a|an|one) (pound|ton|kilogram|kilo|lit(er|re)|met(er|re)|centimet(er|re))\b/i,
  /how many (hours|days|weeks|months|seconds|minutes) (are )?(there )?in (a|an|one|two) (day|week|month|year|hour|minute|decade|century|fortnight)\b/i,
  /how many (years|decades) (are )?(there )?in (a|an|one) (decade|century|millennium)\b/i,
  /how many (eggs|items|things) (are )?(there )?in (a|one) (dozen|baker'?s dozen)\b/i,
  /how many (degrees|sides|angles) (are )?(there )?in (a|an) (circle|right angle|straight line|triangle|square)\b/i,
  /how many (players|people) (are )?(there )?on (a|an) (soccer|football|basketball|baseball|hockey|volleyball) team( on the (field|court|pitch|ice))?\??$/i,
  /what (number|digit) comes (before|after) (\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b/i,
  /what is (half|double|twice|a quarter) of (\d|1\d|20|50|100)\b/i,
  /what is (10|100|1000) (times|x|×|\*) (\d|10)\b/i,
  /what is the (square root|cube root) of (1|4|9|16|25|36|49|64|81|100|8|27)\b/i,
  /what (is|do you call) a (shape|figure) with (three|four|five|six|eight|3|4|5|6|8) (sides|corners)/i,
  /how many (wheels|doors|legs|strings|keys|holes) (does|do|has|have) (a|an|the) (car|bike|bicycle|tricycle|piano|guitar|violin|golf course|bowling ball)\b/i,
];

const flagged = [];
function check(cat, tier, q, a, file) {
  if (SKIP_CAT.test(cat)) return;
  if (tier !== 200 && tier !== 400) return;
  if (P.some((re) => re.test(q))) flagged.push({ cat, q, a, reason: `baby-level pattern (tier ${tier})`, file });
}

for (const f of BANKS) {
  const mod = await import(`../src/${f}.js`);
  const bank = mod.default || {};
  for (const [cat, obj] of Object.entries(bank)) {
    for (const t of [200, 400]) {
      for (const e of obj?.[t] || []) if (e?.q) check(cat, t, e.q, e.a, f);
    }
  }
}
const app = fs.readFileSync("src/App.jsx", "utf8");
const catRe = /^  ([a-z_]+):\{([\s\S]*?)^  \},?$/gm;
let m;
while ((m = catRe.exec(app)) !== null) {
  const id = m[1], body = m[2];
  for (const t of [200, 400]) {
    const tm = body.match(new RegExp("\\b" + t + ":\\[([\\s\\S]*?)\\](?=,|\\s*\\})"));
    if (!tm) continue;
    const itemRe = /\{q:"((?:[^"\\]|\\.)*)",a:"((?:[^"\\]|\\.)*)"/g;
    let im;
    while ((im = itemRe.exec(tm[1])) !== null) check(id, t, im[1], im[2], "App.jsx");
  }
}

const BL = "src/qualityBlacklist.js";
const src = fs.readFileSync(BL, "utf8");
const entries = JSON.parse(src.match(/const entries\s*=\s*(\[[\s\S]*?\n\]);/)[1]);
const keyOf = (e) => `${e.cat}|${(e.q || "").toLowerCase().trim()}|${(e.a || "").toLowerCase().trim()}`;
const seen = new Set(entries.map(keyOf));
let added = 0;
for (const e of flagged) {
  const k = keyOf(e);
  if (seen.has(k)) continue;
  seen.add(k);
  entries.push({ cat: e.cat, q: e.q, a: e.a, reason: e.reason });
  added++;
}
fs.writeFileSync(BL, src.replace(/const entries\s*=\s*\[[\s\S]*?\n\];/, `const entries = ${JSON.stringify(entries, null, 2)};`));
fs.writeFileSync("audit/baby-question-blacklist.json", JSON.stringify({ flagged }, null, 2));
console.log(`flagged ${flagged.length}, newly blacklisted ${added}, total blacklist ${entries.length}`);
const byCat = {};
for (const e of flagged) byCat[e.cat] = (byCat[e.cat] || 0) + 1;
console.log(Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c}:${n}`).join("  "));
console.log("--- samples ---");
flagged.slice(0, 30).forEach((e) => console.log(`[${e.cat}] ${e.q} -> ${e.a}`));

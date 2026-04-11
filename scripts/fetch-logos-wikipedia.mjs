// Fetches brand logos from Wikipedia article thumbnails for categories that are short on simple-icons.
// Downloads logos locally and adds them to the logo manifest.
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "logos-clean");
fs.mkdirSync(OUT_DIR, { recursive: true });

const MANIFEST_PATH = path.join(process.cwd(), "src", "logoCleanManifest.js");
let manifest = {};
if (fs.existsSync(MANIFEST_PATH)) {
  const src = fs.readFileSync(MANIFEST_PATH, "utf8");
  const match = src.match(/= ({[\s\S]*?});/);
  if (match) manifest = JSON.parse(match[1]);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchWithRetry(url, attempts = 3) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": "LogoBot/1.0 (contact@example.com)" } });
      if (r.ok) return r;
      if (r.status === 429 || r.status >= 500) { await sleep(i * 1500); continue; }
      return r;
    } catch (e) {
      if (i === attempts) throw e;
      await sleep(i * 1000);
    }
  }
}

async function getWikipediaLogo(articleTitle) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(articleTitle)}`;
    const res = await fetchWithRetry(url);
    if (!res || !res.ok) return null;
    const data = await res.json();
    // Prefer originalimage (full-res) over thumbnail
    return data?.originalimage?.source || data?.thumbnail?.source || null;
  } catch { return null; }
}

// Brands to fetch per category. These are hand-picked brands that likely have Wikipedia logo images.
const FASHION = [
  ["Chanel","Chanel"],["Gucci","Gucci"],["Louis Vuitton","Louis_Vuitton"],["Prada","Prada"],
  ["Versace","Versace"],["Burberry","Burberry"],["Christian Dior","Christian_Dior_(fashion_house)"],
  ["Fendi","Fendi"],["Balenciaga","Balenciaga"],["Yves Saint Laurent","Saint_Laurent_(brand)"],
  ["Givenchy","Givenchy"],["Valentino","Valentino_(fashion_house)"],["Bottega Veneta","Bottega_Veneta"],
  ["Loewe","Loewe"],["Celine","Celine_(brand)"],["Cartier","Cartier_(jeweler)"],
  ["Tiffany & Co.","Tiffany_%26_Co."],["Bulgari","Bulgari"],["Rolex","Rolex"],
  ["Lacoste","Lacoste"],["Ralph Lauren","Ralph_Lauren_Corporation"],["Tommy Hilfiger","Tommy_Hilfiger"],
  ["Calvin Klein","Calvin_Klein"],["Hugo Boss","Hugo_Boss"],["Diesel","Diesel_(brand)"],
  ["Levi's","Levi_Strauss_%26_Co."],["Zara","Zara_(retailer)"],["H&M","H%26M"],
  ["Uniqlo","Uniqlo"],["Gap","Gap_Inc."],["Michael Kors","Michael_Kors"],
  ["Coach","Coach_New_York"],["Kate Spade","Kate_Spade_New_York"],["Fossil","Fossil_Group"],
  ["Swatch","Swatch"],["Casio","Casio"],["Seiko","Seiko"],["Citizen","Citizen_Watch"],
  ["Tag Heuer","TAG_Heuer"],["Omega","Omega_SA"],["Audemars Piguet","Audemars_Piguet"],
  ["Patek Philippe","Patek_Philippe"],["Breitling","Breitling_SA"],["Longines","Longines"],
  ["Dolce & Gabbana","Dolce_%26_Gabbana"],["Armani","Armani"],["Emporio Armani","Armani"],
  ["Moschino","Moschino"],["Moncler","Moncler"],["Stone Island","Stone_Island"],
  ["Supreme","Supreme_(brand)"],["Off-White","Off-White_(company)"],["Balmain","Balmain_(fashion_house)"],
  ["Maison Margiela","Maison_Margiela"],["Alexander McQueen","Alexander_McQueen_(brand)"],
  ["Stella McCartney","Stella_McCartney_(brand)"],["Miu Miu","Miu_Miu"],["Jimmy Choo","Jimmy_Choo"],
  ["Manolo Blahnik","Manolo_Blahnik"],["Salvatore Ferragamo","Salvatore_Ferragamo_(company)"],
  ["Max Mara","Max_Mara"],["Tory Burch","Tory_Burch"],["Ray-Ban","Ray-Ban"],
  ["Oakley","Oakley,_Inc."],["Persol","Persol"],["Maui Jim","Maui_Jim"],
  ["Lululemon","Lululemon_Athletica"],["Gymshark","Gymshark"],["Athleta","Athleta"],
  ["Asos","ASOS_plc"],["Shein","Shein"],["Boohoo","Boohoo.com"],["Topshop","Topshop"],
  ["Abercrombie & Fitch","Abercrombie_%26_Fitch"],["Hollister","Hollister_Co."],["American Eagle","American_Eagle_Outfitters"],
  ["Anthropologie","Anthropologie"],["Urban Outfitters","Urban_Outfitters"],
];

const FAST_FOOD = [
  ["McDonald's","McDonald%27s"],["Burger King","Burger_King"],["KFC","KFC"],["Subway","Subway_(restaurant)"],
  ["Starbucks","Starbucks"],["Dunkin'","Dunkin%27"],["Taco Bell","Taco_Bell"],["Pizza Hut","Pizza_Hut"],
  ["Domino's Pizza","Domino%27s_Pizza"],["Wendy's","Wendy%27s"],["Chipotle","Chipotle_Mexican_Grill"],
  ["Chick-fil-A","Chick-fil-A"],["Popeyes","Popeyes"],["Five Guys","Five_Guys"],["Panera Bread","Panera_Bread"],
  ["Shake Shack","Shake_Shack"],["Jack in the Box","Jack_in_the_Box"],["Jollibee","Jollibee"],
  ["In-N-Out Burger","In-N-Out_Burger"],["Panda Express","Panda_Express"],["Krispy Kreme","Krispy_Kreme"],
  ["Tim Hortons","Tim_Hortons"],["Dairy Queen","Dairy_Queen"],["Arby's","Arby%27s"],
  ["Sonic Drive-In","Sonic_Drive-In"],["Little Caesars","Little_Caesars"],["Papa John's","Papa_John%27s_Pizza"],
  ["White Castle","White_Castle_(restaurant)"],["Nando's","Nando%27s"],["Greggs","Greggs"],
  ["IHOP","IHOP"],["Culver's","Culver%27s"],["Zaxby's","Zaxby%27s"],["Raising Cane's","Raising_Cane%27s_Chicken_Fingers"],
  ["Bojangles","Bojangles%27"],["Carl's Jr.","Carl%27s_Jr."],["Hardee's","Hardee%27s"],
  ["Qdoba","Qdoba"],["Del Taco","Del_Taco"],["Checkers and Rally's","Checkers_and_Rally%27s"],
  ["Popeyes","Popeyes"],["Auntie Anne's","Auntie_Anne%27s"],["Cinnabon","Cinnabon"],
  ["Denny's","Denny%27s"],["Applebee's","Applebee%27s"],["Outback Steakhouse","Outback_Steakhouse"],
  ["Olive Garden","Olive_Garden"],["Red Lobster","Red_Lobster"],["Cracker Barrel","Cracker_Barrel"],
  ["Bob Evans","Bob_Evans_Restaurants"],["Waffle House","Waffle_House"],["Perkins","Perkins_Restaurant_%26_Bakery"],
  ["Buffalo Wild Wings","Buffalo_Wild_Wings"],["Wingstop","Wingstop"],["Jersey Mike's","Jersey_Mike%27s_Subs"],
  ["Jimmy John's","Jimmy_John%27s"],["Firehouse Subs","Firehouse_Subs"],["Potbelly","Potbelly_Sandwich_Shop"],
  ["Jamba Juice","Jamba_Juice"],["Smoothie King","Smoothie_King"],["Pinkberry","Pinkberry"],
  ["Yogurtland","Yogurtland"],["Baskin-Robbins","Baskin-Robbins"],["Ben & Jerry's","Ben_%26_Jerry%27s"],
  ["Häagen-Dazs","H%C3%A4agen-Dazs"],["Cold Stone Creamery","Cold_Stone_Creamery"],
  ["A&W Restaurants","A%26W_Restaurants"],["Sizzler","Sizzler"],["Hooters","Hooters"],
  ["Boston Market","Boston_Market"],["Quiznos","Quiznos"],["Blimpie","Blimpie"],
  ["Roy Rogers","Roy_Rogers_Restaurants"],["Long John Silver's","Long_John_Silver%27s"],
  ["Whataburger","Whataburger"],
];

const SPORTS = [
  ["FIFA","FIFA"],["NBA","National_Basketball_Association"],["NFL","National_Football_League"],
  ["MLB","Major_League_Baseball"],["NHL","National_Hockey_League"],["Premier League","Premier_League"],
  ["La Liga","La_Liga"],["Bundesliga","Bundesliga"],["Serie A","Serie_A"],["UEFA","UEFA"],
  ["UEFA Champions League","UEFA_Champions_League"],["UEFA Europa League","UEFA_Europa_League"],
  ["Olympics","Olympic_Games"],["IOC","International_Olympic_Committee"],
  ["Real Madrid","Real_Madrid_CF"],["FC Barcelona","FC_Barcelona"],["Manchester United","Manchester_United_F.C."],
  ["Manchester City","Manchester_City_F.C."],["Liverpool","Liverpool_F.C."],["Chelsea","Chelsea_F.C."],
  ["Arsenal","Arsenal_F.C."],["Tottenham","Tottenham_Hotspur_F.C."],["Bayern Munich","FC_Bayern_Munich"],
  ["Juventus","Juventus_FC"],["Paris Saint-Germain","Paris_Saint-Germain_F.C."],
  ["AC Milan","A.C._Milan"],["Inter Milan","Inter_Milan"],["Borussia Dortmund","Borussia_Dortmund"],
  ["Atlético Madrid","Atl%C3%A9tico_Madrid"],["Ajax","AFC_Ajax"],["Porto","FC_Porto"],["Benfica","S.L._Benfica"],
  ["Los Angeles Lakers","Los_Angeles_Lakers"],["Golden State Warriors","Golden_State_Warriors"],
  ["Boston Celtics","Boston_Celtics"],["Chicago Bulls","Chicago_Bulls"],["Miami Heat","Miami_Heat"],
  ["Brooklyn Nets","Brooklyn_Nets"],["Milwaukee Bucks","Milwaukee_Bucks"],["Philadelphia 76ers","Philadelphia_76ers"],
  ["Toronto Raptors","Toronto_Raptors"],["New York Knicks","New_York_Knicks"],
  ["New England Patriots","New_England_Patriots"],["Dallas Cowboys","Dallas_Cowboys"],
  ["San Francisco 49ers","San_Francisco_49ers"],["Green Bay Packers","Green_Bay_Packers"],
  ["Kansas City Chiefs","Kansas_City_Chiefs"],["Pittsburgh Steelers","Pittsburgh_Steelers"],
  ["New York Giants","New_York_Giants"],["Chicago Bears","Chicago_Bears"],
  ["New York Yankees","New_York_Yankees"],["Boston Red Sox","Boston_Red_Sox"],["Los Angeles Dodgers","Los_Angeles_Dodgers"],
  ["Chicago Cubs","Chicago_Cubs"],["Atlanta Braves","Atlanta_Braves"],["Houston Astros","Houston_Astros"],
  ["ESPN","ESPN"],["WWE","WWE"],["UFC","Ultimate_Fighting_Championship"],["Formula 1","Formula_One"],
  ["NASCAR","NASCAR"],["MotoGP","MotoGP"],["PGA Tour","PGA_Tour"],["ATP Tour","ATP_Tour"],
  ["Wimbledon","The_Championships,_Wimbledon"],["Tour de France","Tour_de_France"],["Super Bowl","Super_Bowl"],
  ["World Cup","FIFA_World_Cup"],["Nike","Nike,_Inc."],["Adidas","Adidas"],["Puma","Puma_(brand)"],
];

async function downloadAndSave(url, slug, existingFiles) {
  // Skip if already downloaded
  if (existingFiles.some(f => f.startsWith(slug + "."))) {
    const existing = existingFiles.find(f => f.startsWith(slug + "."));
    return `/logos-clean/${existing}`;
  }
  try {
    const res = await fetchWithRetry(url);
    if (!res || !res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get("content-type") || "";
    let ext = ".png";
    if (ct.includes("svg")) ext = ".svg";
    else if (ct.includes("jpeg")) ext = ".jpg";
    else if (ct.includes("png")) ext = ".png";
    else if (ct.includes("webp")) ext = ".webp";
    const fileName = `${slug}${ext}`;
    fs.writeFileSync(path.join(OUT_DIR, fileName), buf);
    return `/logos-clean/${fileName}`;
  } catch { return null; }
}

const CATEGORIES_TO_EXPAND = {
  logo_fashion: FASHION,
  logo_fast_food: FAST_FOOD,
  logo_sports: SPORTS,
};

const additions = { logo_fashion: [], logo_fast_food: [], logo_sports: [] };

for (const [catId, brands] of Object.entries(CATEGORIES_TO_EXPAND)) {
  console.log(`\n=== ${catId} ===`);
  for (const [brand, wikiTitle] of brands) {
    const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (manifest[slug]) {
      additions[catId].push({ domain: slug, answer: brand });
      continue;
    }
    const existingFiles = fs.readdirSync(OUT_DIR);
    if (existingFiles.some(f => f.startsWith(slug + "."))) {
      manifest[slug] = `/logos-clean/${existingFiles.find(f => f.startsWith(slug + "."))}`;
      additions[catId].push({ domain: slug, answer: brand });
      continue;
    }
    const imgUrl = await getWikipediaLogo(wikiTitle);
    if (!imgUrl) { console.log(`  NO IMAGE: ${brand}`); continue; }
    const localPath = await downloadAndSave(imgUrl, slug, existingFiles);
    if (!localPath) { console.log(`  FAIL: ${brand}`); continue; }
    manifest[slug] = localPath;
    additions[catId].push({ domain: slug, answer: brand });
    console.log(`  ✓ ${brand}`);
    await sleep(150);
  }
}

// Save updated manifest
fs.writeFileSync(
  MANIFEST_PATH,
  `const LOGO_CLEAN_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n\nexport default LOGO_CLEAN_MANIFEST;\n`,
);

// Save additions info for merge into categories
fs.writeFileSync(
  path.join(process.cwd(), "src", "logoAdditions.json"),
  JSON.stringify(additions, null, 2),
);

console.log("\nSummary:");
for (const [catId, items] of Object.entries(additions)) {
  console.log(`  ${catId}: +${items.length}`);
}

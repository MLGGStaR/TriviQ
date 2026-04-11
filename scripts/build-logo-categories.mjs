// Builds a single "Logos" category with all clean icon-only brand marks from simple-icons.
import fs from "node:fs";
import path from "node:path";
import * as simpleIcons from "simple-icons";

const OUT_DIR = path.join(process.cwd(), "public", "logos-clean");
fs.mkdirSync(OUT_DIR, { recursive: true });

function isAutoIconOnly(icon) {
  const svg = icon.svg || "";
  const pathMatches = svg.match(/d="([^"]*)"/g) || [];
  if (pathMatches.length === 0) return false;
  let totalM = 0, totalZ = 0, len = 0;
  for (const m of pathMatches) {
    const d = m.slice(3, -1);
    totalM += (d.match(/[Mm]/g) || []).length;
    totalZ += (d.match(/[Zz]/g) || []).length;
    len += d.length;
  }
  return totalM <= 3 && totalZ <= 6 && len <= 1200;
}

// Manual allowlist — known icon-only brands that fail the strict auto-filter
const MANUAL_ALLOWLIST = new Set([
  "Instagram","Snapchat","Reddit","Discord","Spotify","Twitch","Steam","Dropbox",
  "Airbnb","Puma","Premier League","NBA","MLB","KFC",
  "Lufthansa","Apple TV+","British Airways","Slackware",
  "Firefox","Opera","Pinterest","Tumblr","WhatsApp","Telegram",
  "YouTube","TikTok","Apple","Google","Tesla","Nike","Adidas","Netflix",
  "McDonald's","Ferrari","PlayStation","Roblox","Valorant","Fortnite",
  "Jordan","Under Armour","PayPal",
]);

// Denylist — brands whose simple-icons logo is a wordmark (spells out the name).
// These are excluded even if they're listed as brands we want.
const WORDMARK_DENYLIST = new Set([
  "npm","HP","eBay","Fila","Sega","Wix","Tata","Dacia","KTM","SEAT",
  "smart","The North Face","Deezer",
  "avianca","Indeed","Reebok","New Balance","Hermes",
  "IMDb","Uber","Bugatti","Ford","Kia","Last.fm",
  "SEGA","Honda","FIFA",
]);

// Collect all well-known brands we want to try
const ALL_BRANDS = [
  // Tech giants
  "Apple","Google","Samsung","Intel","NVIDIA","Sony","Dell","HP","Lenovo","LG","Netflix","Spotify","Adobe","PayPal","Zoom","Tesla","Uber","Airbnb","TikTok","Snapchat","X","WhatsApp","Telegram","LinkedIn","Pinterest","Reddit","Dropbox","eBay","AMD","Cisco","Oracle","IBM","Salesforce","Shopify","Stripe","Cloudflare","Slack","GitHub","Docker","MongoDB","Figma","Canva","Notion","Netlify","Vercel","DigitalOcean","JetBrains","Postman","1Password","Proton","Atlassian","GitLab","Twilio","Okta","Snowflake","ServiceNow","ClickUp","HashiCorp","Heroku","Grafana","Elastic","Datadog","SAP","Duolingo","Brave","Opera","Vivaldi","Signal","NordVPN","ExpressVPN","Linux","Ubuntu","Fedora","Red Hat","Debian","Arch Linux","Android","iOS","Python","Java","Rust","Go","Swift","Kotlin","React","Vue.js","Angular","Node.js","Django","Flask","Laravel","Spring","Next.js","Svelte","Webpack","Vite","Babel","ESLint","Jest","Cypress","MySQL","PostgreSQL","SQLite","Redis","Kubernetes","Terraform","Ansible","Jenkins","Bitbucket","Jira","Confluence","Asana","Trello","Miro","Loom","Calendly","Mailchimp","HubSpot","Zendesk","Intercom","Mixpanel","Hotjar","Wix","Squarespace","WordPress","Webflow","Framer","Sketch","Storybook","Railway","Render","PlanetScale","Supabase","Firebase","Chrome","Firefox","Safari","Microsoft Edge","Discord","Quora","Medium","Stack Overflow","Meta","Threads","Bluesky","Mastodon","GraphQL","Raspberry Pi","Arduino","Tailscale","Apache Kafka","RabbitMQ","Neo4j","Cassandra","Prometheus","Bitwarden","Playwright","Selenium","npm","Yarn","Bun","Deno","Electron","Tauri","Ionic","Flutter","Unity","Unreal Engine","Blender","Godot Engine","TensorFlow","PyTorch","OpenAI","Notion","Obsidian","Todoist","Meta","Twitch","Instagram","Snapchat","Reddit","Spotify","Dropbox","Airbnb","Uber","eBay","PayPal","Tesla",
  // Cars
  "BMW","Toyota","Mercedes","Audi","Ford","Honda","Chevrolet","Volkswagen","Nissan","Hyundai","Kia","Tesla","Subaru","Mazda","Porsche","Ferrari","Lamborghini","Jaguar","Land Rover","Volvo","Lexus","Acura","Infiniti","Suzuki","Fiat","Jeep","Dodge","Chrysler","Buick","Cadillac","GMC","Bentley","Rolls-Royce","Aston Martin","Maserati","Alfa Romeo","Genesis","Lincoln","Mini","Peugeot","Renault","Citroën","Škoda","SEAT","Cupra","Dacia","Opel","Rivian","Polestar","McLaren","Bugatti","Lucid Motors","VinFast","Koenigsegg","Pagani","Smart","Lotus","DS Automobiles","Ducati","Harley-Davidson","Yamaha","Kawasaki","KTM","Vespa","Piaggio","Husqvarna","Aprilia","Mitsubishi","BYD","NIO","XPeng","Geely","Chery","Haval","Great Wall","Tata","Mahindra",
  // Fashion/Sports brands
  "Nike","Adidas","Puma","Jordan","Hermes","Reebok","Fila","Under Armour","New Balance","The North Face",
  // Entertainment / Media
  "Netflix","Disney+","Hulu","HBO","Amazon Prime Video","Peacock","Paramount+","Spotify","YouTube","Twitch","Disney","Pixar","Marvel","DC Entertainment","Warner Bros.","Sony","Lionsgate","DreamWorks","Fox","NBC","CBS","ABC","BBC","CNN","ESPN","MTV","HGTV","Discovery","National Geographic","History Channel","Tidal","Deezer","SoundCloud","Apple Music","Apple TV","Apple TV+","Crunchyroll","Criterion","MUBI","A24","Showtime","Vimeo","Dailymotion","IMDb","Rotten Tomatoes","Letterboxd","Plex","Audible","Goodreads","Pandora","iHeartRadio","Bandcamp","Shazam","Genius","Pitchfork","Rolling Stone","Billboard","Metacritic","StubHub","Ticketmaster","SeatGeek","Fandango","Fandom","Wikipedia","Wikimedia Commons","Wattpad","Scribd","Tumblr","Pixiv","DeviantArt","ArtStation","Behance","Dribbble","500px","Flickr","Giphy","Tenor","Imgur","Medium","Patreon","Substack","Blogger","TED",
  // Airlines
  "Emirates","Qatar Airways","Singapore Airlines","Cathay Pacific","Korean Air","Qantas","British Airways","Lufthansa","Air France","KLM","Turkish Airlines","Delta Air Lines","United Airlines","American Airlines","Southwest Airlines","JetBlue","Alaska Airlines","Air Canada","LATAM Airlines","Avianca","Aeroméxico","Etihad Airways","Saudia","EgyptAir","Ethiopian Airlines","Air New Zealand","Japan Airlines","ANA All Nippon Airways","Thai Airways","Malaysia Airlines","Garuda Indonesia","Philippine Airlines","Vietnam Airlines","China Airlines","China Eastern","China Southern","Hainan Airlines","Air China","Asiana Airlines","Cebu Pacific","AirAsia","Scoot","Jetstar","VietJet Air","EasyJet","Ryanair","Wizz Air","Norwegian","SAS","Finnair","Icelandair","Aer Lingus","TAP Air Portugal","Iberia","Vueling","Brussels Airlines","Austrian Airlines","LOT Polish Airlines","Aegean Airlines","Flynas","Pegasus Airlines","IndiGo","SpiceJet","Spirit Airlines","Frontier Airlines","Allegiant Air","Hawaiian Airlines","Fiji Airways","Royal Air Maroc","South African Airways","Kenya Airways","Oman Air","Gulf Air","Royal Jordanian","Middle East Airlines","Pakistan International Airlines","SriLankan Airlines","S7 Airlines","Air Transat","Air India",
  // Gaming
  "PlayStation","Xbox","Nintendo","Steam","Epic Games","Riot Games","Electronic Arts","Ubisoft","Rockstar Games","Activision","Blizzard Entertainment","Roblox","League of Legends","Valorant","Minecraft","Call of Duty","Apex Legends","PUBG","Rocket League","Capcom","Konami","SEGA","Square Enix","Bungie","Bethesda","Valve","Unity","Unreal Engine","Fortnite","Among Us","Fall Guys","Pokémon","Dota 2","Counter-Strike","Overwatch","World of Warcraft","Diablo","StarCraft","Final Fantasy","Resident Evil","Street Fighter","Monster Hunter","Grand Theft Auto","Red Dead Redemption","Skyrim","Fallout","Borderlands","Destiny","Halo","Gears of War","Forza","Need for Speed","Mario","Mario Kart","Super Smash Bros","The Legend of Zelda","Splatoon","Animal Crossing","Kirby","Metroid","Fire Emblem","Donkey Kong","GameCube","Wii","Dreamcast","GeForce NOW","Amazon Luna","YouTube Gaming","Kick","Battle.net","Origin","itch.io","Humble Bundle","Game Jolt","Godot Engine","Twitch","Discord",
  // Sports/Leagues
  "FIFA","NBA","MLB","Premier League","WWE",
  // Fast food
  "McDonald's","Deliveroo","DoorDash","iFood","Swiggy","Uber Eats","Grubhub",
  // Social
  "Facebook","Instagram","X","TikTok","Snapchat","YouTube","WhatsApp","Telegram","LinkedIn","Pinterest","Reddit","Discord","Twitch","Tumblr","Quora","Medium","WeChat","LINE","Viber","Signal","Skype","Zoom","Slack","Clubhouse","BeReal","Threads","Bluesky","Mastodon","Flickr","Imgur","Giphy","DeviantArt","Behance","Dribbble","Product Hunt","Stack Overflow","GitHub","GitLab","Kick","Rumble","Dailymotion","Vimeo","Substack","WordPress","Wix","Squarespace","Patreon","GoFundMe","Kickstarter","Indiegogo","Unsplash","Pexels","500px","Strava","Goodreads","Letterboxd","Last.fm","MyAnimeList","AniList","Nextdoor","Meetup","Eventbrite","Yelp","TripAdvisor","Glassdoor","Indeed","Fiverr","Upwork","Toptal","AngelList","Crunchbase","Linktree","Bitly","Buffer","Hootsuite","Canva","Loom","Calendly","Typeform","SurveyMonkey","Mailchimp","HubSpot","Intercom","Zendesk",
];

const byTitle = new Map();
for (const [key, icon] of Object.entries(simpleIcons)) {
  if (!key.startsWith("si") || !icon || !icon.title) continue;
  byTitle.set(icon.title.toLowerCase(), icon);
}

function lookupIcon(title) {
  const lc = title.toLowerCase();
  if (byTitle.has(lc)) return byTitle.get(lc);
  const norm = lc.replace(/[^a-z0-9]/g, "");
  for (const [t, icon] of byTitle.entries()) {
    if (t.replace(/[^a-z0-9]/g, "") === norm) return icon;
  }
  return null;
}

// Collect all unique clean brand icons
const manifest = {};
const collected = [];
const seen = new Set();

for (const title of ALL_BRANDS) {
  const icon = lookupIcon(title);
  if (!icon) continue;
  if (seen.has(icon.title)) continue;
  if (WORDMARK_DENYLIST.has(icon.title)) continue;
  if (!isAutoIconOnly(icon) && !MANUAL_ALLOWLIST.has(icon.title)) continue;
  seen.add(icon.title);
  const slug = icon.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const color = icon.hex || "000000";
  const coloredSvg = icon.svg.replace(/<svg([^>]*)>/, `<svg$1 fill="#${color}">`);
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.svg`), coloredSvg);
  manifest[slug] = `/logos-clean/${slug}.svg`;
  collected.push({ domain: slug, answer: icon.title });
}

// Popularity ranking — lower score = more popular/easier.
// Manually curated by global brand recognizability.
const POPULARITY = {
  // Tier 200 — instantly recognizable globally (most popular)
  "Apple":1,"Google":2,"YouTube":3,"Instagram":4,"TikTok":5,"WhatsApp":6,"Facebook":7,
  "Netflix":8,"Spotify":9,"Nike":10,"Adidas":11,"McDonald's":12,"X":13,"Snapchat":14,
  "PlayStation":15,"Tesla":16,"Ferrari":17,"Uber":18,"Airbnb":19,"Discord":20,
  "Twitch":21,"Reddit":22,"Pinterest":23,"PayPal":24,"GitHub":25,"Dropbox":26,
  "eBay":27,"Telegram":28,"Ford":29,"Honda":30,"Firefox":31,"Android":32,
  "Steam":33,"Roblox":34,"Fortnite":35,"Mitsubishi":36,"Kia":37,"Chevrolet":38,
  "Puma":39,"Jordan":40,"HP":41,"NBA":42,"NFL":43,"MLB":44,"FIFA":45,"WWE":46,
  "Tumblr":47,"Threads":48,"Bluesky":49,"Opera":50,"Valorant":51,"SEGA":52,
  "Bugatti":53,"Unity":54,"Infiniti":55,"MongoDB":56,"Square Enix":57,
  "Shazam":58,"Pandora":59,"Deezer":60,"Tidal":61,"Crunchyroll":62,"Vimeo":63,"IMDb":64,

  // Tier 400 — well-known but more specific
  "Reebok":65,"Fila":66,"New Balance":67,"Under Armour":68,"Hermes":69,"The North Face":70,
  "Polestar":71,"Renault":72,"Dacia":73,"KTM":74,"Suzuki":75,"Smart":76,"SEAT":77,
  "Riot Games":78,"Rockstar Games":79,"Unreal Engine":80,"Flutter":81,"Kotlin":82,
  "Blender":83,"Stripe":84,"Webflow":85,"Wix":86,"Framer":87,"Kirby":88,
  "British Airways":89,"Lufthansa":90,"Turkish Airlines":91,"Qantas":92,"Singapore Airlines":93,
  "American Airlines":94,"Southwest Airlines":95,"Air France":96,"Air China":97,"Air India":98,
  "AirAsia":99,"Iberia":100,"Avianca":101,"Ethiopian Airlines":102,"Air Transat":103,
  "S7 Airlines":104,"CBS":105,"Rotten Tomatoes":106,"Letterboxd":107,"Metacritic":108,
  "Genius":109,"Last.fm":110,"MyAnimeList":111,"DeviantArt":112,"ArtStation":113,
  "Fandom":114,"Fandango":115,"Substack":116,"Patreon":117,"Kickstarter":118,
  "Premier League":119,"Rumble":120,"Kick":121,"Wattpad":122,"Bandcamp":123,
  "Product Hunt":124,"Quora":125,"Indeed":126,"Glassdoor":127,"Battle.net":128,

  // Tier 600 — niche / tech-specific (hardest)
  "Confluence":129,"Jira":130,"Trello":131,"Asana":132,"Bitbucket":133,"GitLab":134,
  "Atlassian":135,"Bitwarden":136,"1Password":137,"Proton":138,"ExpressVPN":139,
  "NordVPN":140,"Vivaldi":141,"Arch Linux":142,"Fedora":143,"Red Hat":144,
  "HashiCorp":145,"Ansible":146,"Cloudflare":147,"Vercel":148,"DigitalOcean":149,
  "Supabase":150,"PlanetScale":151,"Neo4j":152,"Redis":153,"RabbitMQ":154,
  "npm":155,"Deno":156,"Vite":157,"ESLint":158,"Next.js":159,"Vue.js":160,
  "TensorFlow":161,"PyTorch":162,"Bitly":163,"Linktree":164,"HubSpot":165,
  "ClickUp":166,"Miro":167,"Loom":168,"Todoist":169,"Hotjar":170,"Okta":171,
  "Render":172,"Storybook":173,"Spring":174,"Flask":175,"Ionic":176,
  "iFood":177,"Deliveroo":178,"DoorDash":179,"Swiggy":180,"SurveyMonkey":181,
  "Unsplash":182,"Pexels":183,"pixiv":184,"Flickr":185,"GIPHY":186,"Buffer":187,
  "Tata":188,"Mastodon":189,"Strava":190,"Upwork":191,"Toptal":192,"Humble Bundle":193,
};

// Sort by popularity — unknown ones go to end (hardest tier)
collected.sort((a, b) => {
  const sa = POPULARITY[a.answer] ?? 999;
  const sb = POPULARITY[b.answer] ?? 999;
  return sa - sb;
});

// Split into 3 tiers evenly
const total = collected.length;
const per = Math.floor(total / 3);
const remain = total - per * 3;
const t1End = per + (remain > 0 ? 1 : 0);
const t2End = t1End + per + (remain > 1 ? 1 : 0);
const tier1 = collected.slice(0, t1End);
const tier2 = collected.slice(t1End, t2End);
const tier3 = collected.slice(t2End);

const body =
  "const logo = (rows) => rows.map(([q, a]) => ({ q, a }));\n\n" +
  "const LOGO_CATEGORIES_BANK = {\n" +
  "  logos: {\n" +
  '    label: "Logos",\n' +
  '    icon: "\\u{1F3AF}",\n' +
  '    color: "#F59E0B",\n' +
  "    isLogoGuess: true,\n" +
  "    200: logo([" + tier1.map(e => `["${e.domain}","${e.answer.replace(/"/g, '\\"')}"]`).join(",") + "]),\n" +
  "    400: logo([" + tier2.map(e => `["${e.domain}","${e.answer.replace(/"/g, '\\"')}"]`).join(",") + "]),\n" +
  "    600: logo([" + tier3.map(e => `["${e.domain}","${e.answer.replace(/"/g, '\\"')}"]`).join(",") + "]),\n" +
  "  },\n" +
  "};\n\nexport default LOGO_CATEGORIES_BANK;\n";

fs.writeFileSync(path.join(process.cwd(), "src", "logoCategoriesBank.js"), body);
fs.writeFileSync(
  path.join(process.cwd(), "src", "logoCleanManifest.js"),
  `const LOGO_CLEAN_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n\nexport default LOGO_CLEAN_MANIFEST;\n`,
);

console.log(`Total clean logos: ${total}`);
console.log(`  Tier 200: ${tier1.length}`);
console.log(`  Tier 400: ${tier2.length}`);
console.log(`  Tier 600: ${tier3.length}`);

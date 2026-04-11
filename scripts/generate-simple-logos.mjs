// Generates clean, colored, text-free logos from the simple-icons package.
// Matches each brand in logoCategoriesBank.js to its simple-icons entry,
// writes a colored SVG to public/logos-clean/, and builds a manifest.
import fs from "node:fs";
import path from "node:path";
import * as simpleIcons from "simple-icons";
import LOGO_CATEGORIES_BANK from "../src/logoCategoriesBank.js";

const OUT_DIR = path.join(process.cwd(), "public", "logos-clean");
const MANIFEST_PATH = path.join(process.cwd(), "src", "logoCleanManifest.js");
fs.mkdirSync(OUT_DIR, { recursive: true });

// Simple Icons exports every icon with `si` prefix: siMcdonalds, siNike, etc.
// The slug for lookup strips non-alphanumerics and lowercases.
function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

// Manual overrides for brands whose slug doesn't match the simple naming rule
const SLUG_OVERRIDES = {
  "mcdonalds.com": "mcdonalds",
  "burgerking.com": "burgerking",
  "twitter.com": "x",
  "x.com": "x",
  "ea.com": "ea",
  "hm.com": "handm",
  "bmw.com": "bmw",
  "mercedes-benz.com": "mercedes",
  "volkswagen.com": "volkswagen",
  "mitsubishi-motors.com": "mitsubishimotors",
  "skoda-auto.com": "skoda",
  "mg.co.uk": "mg",
  "lucidmotors.com": "lucid",
  "vinfast.com": "vinfast",
  "byd.com": "byd",
  "lotuscars.com": "lotuscars",
  "youtube.com": "youtube",
  "linkedin.com": "linkedin",
  "tiktok.com": "tiktok",
  "whatsapp.com": "whatsapp",
  "instagram.com": "instagram",
  "facebook.com": "facebook",
  "snapchat.com": "snapchat",
  "telegram.org": "telegram",
  "pinterest.com": "pinterest",
  "reddit.com": "reddit",
  "discord.com": "discord",
  "twitch.tv": "twitch",
  "tumblr.com": "tumblr",
  "apple.com": "apple",
  "google.com": "google",
  "microsoft.com": "microsoft",
  "amazon.com": "amazon",
  "samsung.com": "samsung",
  "intel.com": "intel",
  "nvidia.com": "nvidia",
  "sony.com": "sony",
  "dell.com": "dell",
  "hp.com": "hp",
  "lenovo.com": "lenovo",
  "lg.com": "lg",
  "netflix.com": "netflix",
  "spotify.com": "spotify",
  "adobe.com": "adobe",
  "paypal.com": "paypal",
  "zoom.us": "zoom",
  "tesla.com": "tesla",
  "uber.com": "uber",
  "airbnb.com": "airbnb",
  "dropbox.com": "dropbox",
  "ebay.com": "ebay",
  "alibaba.com": "alibabadotcom",
  "qualcomm.com": "qualcomm",
  "amd.com": "amd",
  "cisco.com": "cisco",
  "oracle.com": "oracle",
  "ibm.com": "ibm",
  "salesforce.com": "salesforce",
  "shopify.com": "shopify",
  "stripe.com": "stripe",
  "cloudflare.com": "cloudflare",
  "slack.com": "slack",
  "github.com": "github",
  "docker.com": "docker",
  "mongodb.com": "mongodb",
  "figma.com": "figma",
  "canva.com": "canva",
  "notion.so": "notion",
  "airtable.com": "airtable",
  "netlify.com": "netlify",
  "vercel.com": "vercel",
  "digitalocean.com": "digitalocean",
  "jetbrains.com": "jetbrains",
  "postman.com": "postman",
  "1password.com": "1password",
  "proton.me": "proton",
  "atlassian.com": "atlassian",
  "gitlab.com": "gitlab",
  "twilio.com": "twilio",
  "okta.com": "okta",
  "crowdstrike.com": "crowdstrike",
  "snowflake.com": "snowflake",
  "databricks.com": "databricks",
  "servicenow.com": "servicenow",
  "workday.com": "workday",
  "monday.com": "mondaydotcom",
  "clickup.com": "clickup",
  "hashicorp.com": "hashicorp",
  "heroku.com": "heroku",
  "grafana.com": "grafana",
  "nginx.com": "nginx",
  "elastic.co": "elastic",
  "datadog.com": "datadoghq",
  "splunk.com": "splunk",
  "sap.com": "sap",
  "duolingo.com": "duolingo",
  "brave.com": "brave",
  "opera.com": "opera",
  "vivaldi.com": "vivaldi",
  "signal.org": "signal",
  "nordvpn.com": "nordvpn",
  "expressvpn.com": "expressvpn",
  "audi.com": "audi",
  "toyota.com": "toyota",
  "ford.com": "ford",
  "honda.com": "honda",
  "chevrolet.com": "chevrolet",
  "nissan.com": "nissan",
  "hyundai.com": "hyundai",
  "kia.com": "kia",
  "subaru.com": "subaru",
  "mazda.com": "mazda",
  "porsche.com": "porsche",
  "ferrari.com": "ferrari",
  "lamborghini.com": "lamborghini",
  "jaguar.com": "jaguar",
  "landrover.com": "landrover",
  "volvo.com": "volvocars",
  "lexus.com": "lexus",
  "acura.com": "acura",
  "infiniti.com": "infiniti",
  "suzuki.com": "suzuki",
  "fiat.com": "fiat",
  "jeep.com": "jeep",
  "dodge.com": "dodge",
  "chrysler.com": "chrysler",
  "buick.com": "buick",
  "cadillac.com": "cadillac",
  "astonmartin.com": "astonmartin",
  "maserati.com": "maserati",
  "alfaromeo.com": "alfaromeo",
  "mini.com": "mini",
  "peugeot.com": "peugeot",
  "renault.com": "renault",
  "citroen.com": "citroen",
  "seat.com": "seat",
  "cupra.com": "cupra",
  "dacia.com": "dacia",
  "opel.com": "opel",
  "rivian.com": "rivian",
  "polestar.com": "polestar",
  "mclaren.com": "mclaren",
  "bugatti.com": "bugatti",
  "nike.com": "nike",
  "adidas.com": "adidas",
  "puma.com": "puma",
  "gucci.com": "gucci",
  "louisvuitton.com": "louisvuitton",
  "chanel.com": "chanel",
  "zara.com": "zara",
  "uniqlo.com": "uniqlo",
  "gap.com": "gap",
  "levis.com": "levis",
  "ralphlauren.com": "ralphlauren",
  "tommyhilfiger.com": "tommyhilfiger",
  "calvinklein.com": "calvinklein",
  "versace.com": "versace",
  "burberry.com": "burberry",
  "dior.com": "dior",
  "prada.com": "prada",
  "hermes.com": "hermes",
  "lacoste.com": "lacoste",
  "underarmour.com": "underarmour",
  "reebok.com": "reebok",
  "newbalance.com": "newbalance",
  "converse.com": "converse",
  "vans.com": "vans",
  "asics.com": "asics",
  "thenorthface.com": "thenorthface",
  "patagonia.com": "patagonia",
  "columbia.com": "columbiasportswear",
  "ysl.com": "ysl",
  "givenchy.com": "givenchy",
  "valentino.com": "valentino",
  "tiffany.com": "tiffanyandco",
  "rolex.com": "rolex",
  "omega.com": "omegaenigma",
  "hugoboss.com": "hugoboss",
  "diesel.com": "diesel",
  "offwhite.com": "offwhite",
  "supreme.com": "supreme",
  "champion.com": "champion",
  "fila.com": "fila",
  "timberland.com": "timberland",
  "birkenstock.com": "birkenstock",
  "crocs.com": "crocs",
  "hoka.com": "hoka",
  "lululemon.com": "lululemon",
  "gymshark.com": "gymshark",
  "mango.com": "mango",
  "bershka.com": "bershka",
  "pullandbear.com": "pullandbear",
  "shein.com": "shein",
  "fifa.com": "fifa",
  "nba.com": "nba",
  "nfl.com": "nfl",
  "mlb.com": "mlb",
  "nhl.com": "nhl",
  "premierleague.com": "premierleague",
  "laliga.com": "laliga",
  "bundesliga.com": "bundesliga",
  "uefa.com": "uefa",
  "olympics.com": "olympics",
  "realmadrid.com": "realmadrid",
  "fcbarcelona.com": "fcbarcelona",
  "manutd.com": "manchesterunited",
  "mancity.com": "manchestercity",
  "liverpool.com": "liverpoolfc",
  "chelseafc.com": "chelsea",
  "arsenal.com": "arsenal",
  "tottenhamhotspur.com": "tottenhamhotspur",
  "bayernmunich.com": "bayern",
  "juventus.com": "juventus",
  "psg.fr": "psg",
  "acmilan.com": "acmilan",
  "inter.it": "intermilan",
  "bvb.de": "borussiadortmund",
  "espn.com": "espn",
  "lakers.com": "lakers",
  "disneyplus.com": "disneyplus",
  "hulu.com": "hulu",
  "hbo.com": "hbo",
  "primevideo.com": "primevideo",
  "peacocktv.com": "peacocktv",
  "paramountplus.com": "paramountplus",
  "twitch.tv": "twitch",
  "disney.com": "disney",
  "pixar.com": "pixar",
  "marvel.com": "marvel",
  "dccomics.com": "dccomics",
  "warnerbros.com": "warnerbros",
  "lionsgate.com": "lionsgate",
  "dreamworks.com": "dreamworks",
  "nbc.com": "nbc",
  "bbc.com": "bbc",
  "cnn.com": "cnn",
  "mtv.com": "mtv",
  "tidal.com": "tidal",
  "deezer.com": "deezer",
  "soundcloud.com": "soundcloud",
  "imdb.com": "imdb",
  "rottentomatoes.com": "rottentomatoes",
  "letterboxd.com": "letterboxd",
  "plex.tv": "plex",
  "audible.com": "audible",
  "goodreads.com": "goodreads",
  "pandora.com": "pandora",
  "iheartradio.com": "iheartradio",
  "bandcamp.com": "bandcamp",
  "shazam.com": "shazam",
  "genius.com": "genius",
  "pitchfork.com": "pitchfork",
  "lastdotfm": "lastdotfm",
  "last.fm": "lastdotfm",
  "myanimelist.net": "myanimelist",
  "anilist.co": "anilist",
  "emirates.com": "emirates",
  "qatarairways.com": "qatarairways",
  "singaporeair.com": "singaporeairlines",
  "cathaypacific.com": "cathaypacific",
  "ana.co.jp": "ana",
  "jal.co.jp": "japanairlines",
  "koreanair.com": "koreanair",
  "qantas.com": "qantas",
  "britishairways.com": "britishairways",
  "lufthansa.com": "lufthansa",
  "airfrance.com": "airfrance",
  "klm.com": "klm",
  "turkishairlines.com": "turkishairlines",
  "delta.com": "delta",
  "united.com": "united",
  "aa.com": "americanairlines",
  "southwest.com": "southwestairlines",
  "jetblue.com": "jetblue",
  "alaskaair.com": "alaskaairlines",
  "aircanada.com": "aircanada",
  "aeromexico.com": "aeromexico",
  "etihad.com": "etihadairways",
  "saudia.com": "saudia",
  "indigo.in": "indigo",
  "airasia.com": "airasia",
  "ryanair.com": "ryanair",
  "easyjet.com": "easyjet",
  "wizzair.com": "wizzair",
  "aeroflot.com": "aeroflot",
  "playstation.com": "playstation",
  "xbox.com": "xbox",
  "nintendo.com": "nintendo",
  "steam.com": "steam",
  "epicgames.com": "epicgames",
  "riotgames.com": "riotgames",
  "ea.com": "ea",
  "ubisoft.com": "ubisoft",
  "rockstargames.com": "rockstargames",
  "activision.com": "activision",
  "blizzard.com": "blizzardentertainment",
  "roblox.com": "roblox",
  "fortnite.com": "epicgames",
  "leagueoflegends.com": "leagueoflegends",
  "valorant.com": "valorant",
  "minecraft.net": "minecraft",
  "callofduty.com": "callofduty",
  "apexlegends.com": "apexlegends",
  "pubg.com": "pubg",
  "rocketleague.com": "rocketleague",
  "capcom.com": "capcom",
  "konami.com": "konami",
  "sega.com": "sega",
  "squareenix.com": "squareenix",
  "bungie.net": "bungie",
  "bethesda.net": "bethesda",
  "valvesoftware.com": "valve",
  "unity.com": "unity",
  "unrealengine.com": "unrealengine",
  "pokemongo.com": "pokemon",
  "amongus.com": "amongus",
  "fallguys.com": "fallguys",
  "pokemon.com": "pokemon",
};

// Brands TO EXCLUDE because their "logo" in simple-icons includes text, or doesn't exist
// These will be dropped from the categories
const EXCLUDE = new Set([]);

const manifest = {};
const missing = [];
const allEntries = [];

for (const [catId, cat] of Object.entries(LOGO_CATEGORIES_BANK)) {
  if (!cat.isLogoGuess) continue;
  for (const tier of [200, 400, 600]) {
    for (const entry of cat[tier] || []) {
      allEntries.push({ catId, tier, domain: entry.q, answer: entry.a });
    }
  }
}

const seen = new Set();
for (const entry of allEntries) {
  if (seen.has(entry.domain)) continue;
  seen.add(entry.domain);

  // Resolve the simple-icons slug
  let slug = SLUG_OVERRIDES[entry.domain];
  if (!slug) {
    // Try auto-derive: "apple.com" -> "apple"
    slug = slugify(entry.domain.split(".")[0]);
  }

  // Look up in simple-icons: the export name is "si" + PascalCase(slug)
  const exportName = "si" + slug.charAt(0).toUpperCase() + slug.slice(1);
  const icon = simpleIcons[exportName];

  if (!icon || !icon.svg) {
    missing.push({ domain: entry.domain, answer: entry.answer, slug, exportName });
    continue;
  }

  // Replace the default black fill with the brand's hex color
  const color = icon.hex || "000000";
  const coloredSvg = icon.svg.replace(
    /<svg([^>]*)>/,
    `<svg$1 fill="#${color}">`,
  );

  const fileName = `${slug}.svg`;
  fs.writeFileSync(path.join(OUT_DIR, fileName), coloredSvg);
  manifest[entry.domain] = `/logos-clean/${fileName}`;
}

fs.writeFileSync(
  MANIFEST_PATH,
  `const LOGO_CLEAN_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n\nexport default LOGO_CLEAN_MANIFEST;\n`,
);

console.log(`\n✓ Generated ${Object.keys(manifest).length} clean logos`);
console.log(`✗ Missing: ${missing.length}`);
if (missing.length > 0) {
  console.log("\nMissing brands:");
  for (const m of missing.slice(0, 50)) {
    console.log(`  ${m.domain} (${m.answer}) [${m.exportName}]`);
  }
  if (missing.length > 50) console.log(`  ... and ${missing.length - 50} more`);
}

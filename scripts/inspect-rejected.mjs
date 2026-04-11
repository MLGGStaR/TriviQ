// Check which brands are being rejected by the filter and why.
import * as simpleIcons from "simple-icons";

const CHECK = [
  "Microsoft","Windows","Facebook","Chrome","Firefox","Edge","Safari","Opera","Brave",
  "WhatsApp","Telegram","Signal","Skype","Zoom","Slack","Discord","Twitch","Tumblr",
  "Instagram","TikTok","Snapchat","Reddit","Pinterest","LinkedIn","YouTube","Spotify",
  "Apple","Google","Amazon","PayPal","eBay","Uber","Airbnb","Netflix","Dropbox",
  "BMW","Mercedes","Audi","Toyota","Ford","Honda","Tesla","Ferrari","Lamborghini",
  "Nike","Adidas","Puma","Gucci","Chanel","Louis Vuitton","Lacoste","Ralph Lauren",
  "FIFA","NBA","NFL","MLB","NHL","UEFA","Premier League","La Liga",
  "McDonald's","Burger King","KFC","Pizza Hut","Subway","Taco Bell","Starbucks","Wendy's",
  "Disney","HBO","Warner Bros.","Netflix","Hulu","Paramount+","Peacock","Apple TV+",
  "Emirates","Qatar Airways","British Airways","Lufthansa","Delta Air Lines","United Airlines",
  "PlayStation","Xbox","Nintendo","Steam","Epic Games","Roblox","Valorant","Fortnite",
];

function stats(icon) {
  const svg = icon.svg || "";
  const pathMatches = svg.match(/d="([^"]*)"/g) || [];
  let totalM = 0, totalZ = 0, len = 0;
  for (const m of pathMatches) {
    const d = m.slice(3, -1);
    totalM += (d.match(/[Mm]/g) || []).length;
    totalZ += (d.match(/[Zz]/g) || []).length;
    len += d.length;
  }
  return { totalM, totalZ, len };
}

const byTitle = new Map();
for (const [key, icon] of Object.entries(simpleIcons)) {
  if (!key.startsWith("si") || !icon || !icon.title) continue;
  byTitle.set(icon.title.toLowerCase(), icon);
}

for (const title of CHECK) {
  const lc = title.toLowerCase();
  let icon = byTitle.get(lc);
  if (!icon) {
    const norm = lc.replace(/[^a-z0-9]/g, "");
    for (const [t, i] of byTitle.entries()) {
      if (t.replace(/[^a-z0-9]/g, "") === norm) { icon = i; break; }
    }
  }
  if (!icon) {
    console.log(`MISSING     ${title}`);
    continue;
  }
  const s = stats(icon);
  const passStrict = s.totalM <= 3 && s.totalZ <= 6 && s.len <= 1200;
  const passLoose = s.totalM <= 6 && s.totalZ <= 12 && s.len <= 2000;
  const status = passStrict ? "STRICT" : passLoose ? "LOOSE " : "FAIL  ";
  console.log(`${status}  M=${s.totalM.toString().padStart(2)} Z=${s.totalZ.toString().padStart(2)} len=${s.len.toString().padStart(4)}  ${title}`);
}

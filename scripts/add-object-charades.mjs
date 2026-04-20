import fs from "node:fs";
import path from "node:path";

const BACKFILL_PATH = "src/qualityBackfill.js";
const mod = await import(`file:///${path.resolve(BACKFILL_PATH).replace(/\\/g, "/")}?c=${Date.now()}`);
const backfill = JSON.parse(JSON.stringify(mod.default || {}));

const prompt = "Act it out — no talking, no sounds!";

const adds = {
  200: [
    "Nutella","iPhone","Netflix","Pizza","Coffee","Shampoo","Pillow","Umbrella",
    "Sunglasses","Wallet","Car keys","Alarm clock","Microwave","Refrigerator",
    "Remote control","Hair dryer","Toothbrush","Socks","Balloon","Candle","Mirror",
    "Lamp","Toilet paper","Shower","YouTube","Google","WhatsApp","Instagram","TikTok","McDonald's",
  ],
  400: [
    "iPad","Spotify","Starbucks","Tinder","Uber","Amazon","FaceTime","Facebook",
    "Snapchat","Twitter","Reddit","Discord","Zoom","PayPal","Venmo","Twitch","Gmail",
    "Airbnb","Burger King","Subway","KFC","Domino's","LEGO","Play-Doh","Crayola",
    "Tupperware","Band-Aid","Post-it","Velcro","Kleenex",
  ],
  600: [
    "Roomba","Tesla","Nespresso","Peloton","Bluetooth","Thermos","Lawnmower",
    "Sewing machine","Waffle iron","Rice cooker","Rolling pin","Whisk","Colander",
    "Ladle","Teapot","Thermostat","Compass","Mailbox","Doorbell","Chimney",
    "Briefcase","Stethoscope","Magnifying glass","Binoculars","Calculator","Sundial",
    "Hourglass","Sextant","Abacus","Pogo stick",
  ],
};

if (!backfill.charades_general) backfill.charades_general = {};
let added = 0;
for (const tier of [200, 400, 600]) {
  if (!backfill.charades_general[tier]) backfill.charades_general[tier] = [];
  const existing = new Set(backfill.charades_general[tier].map((e) => (e.a || "").toLowerCase()));
  for (const word of adds[tier]) {
    const key = word.toLowerCase();
    if (existing.has(key)) continue;
    existing.add(key);
    backfill.charades_general[tier].push({ q: prompt, a: word });
    added++;
  }
}

fs.writeFileSync(BACKFILL_PATH, `const QUALITY_BACKFILL = ${JSON.stringify(backfill, null, 2)};\n\nexport default QUALITY_BACKFILL;\n`);
console.log(`Added ${added} object/brand charades entries.`);

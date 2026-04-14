import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import QUESTION_EXPANSIONS from "../src/triviaExpansions.js";
import QUESTION_MINIMUMS from "../src/triviaMinimums.js";
import TRIVIA_MEGA_EXPANSIONS from "../src/triviaMegaExpansions.js";
import TRIVIA_ULTRA_EXPANSIONS from "../src/triviaUltraExpansions.js";
import TRIVIA_TIER_BALANCE_EXPANSIONS from "../src/triviaTierBalanceExpansions.js";
import TRIVIA_TIER_PARITY_EXPANSIONS from "../src/triviaTierParityExpansions.js";
import TRIVIA_TIER_FINAL_PARITY_EXPANSIONS from "../src/triviaTierFinalParityExpansions.js";
import TRIVIA_TIER_FINAL_TOPOFF_EXPANSIONS from "../src/triviaTierFinalTopoffExpansions.js";
import NEW_CATEGORIES_BANK from "../src/newCategoriesBank.js";
import LOGO_CATEGORIES_BANK from "../src/logoCategoriesBank.js";
import MORE_TRIVIA_EXPANSIONS from "../src/moreTriviaExpansions.js";

const APP_PATH = path.join(process.cwd(), "src", "App.jsx");
const OUTPUT_DIR = path.join(process.cwd(), "public", "whoami");
const MANIFEST_PATH = path.join(process.cwd(), "src", "whoamiImageManifest.js");
const FORCE_REFRESH = process.argv.includes("--refresh");

const TITLE_OVERRIDES = {
  Xavi: "Xavi_Hern%C3%A1ndez",
  Zico: "Zico_(footballer)",
  "Villanelle_(Killing_Eve)": "Villanelle_(character)",
  Nandor_the_Relentless: "Kayvan_Novak",
  Korosensei: "List_of_Assassination_Classroom_characters",
};

const SKIP_ENTRIES = new Set(["Max_Hamburgers","Lotteria"]);

const DIRECT_URL_OVERRIDES = {
  Johan_Liebert:
    "https://static.wikia.nocookie.net/villains/images/3/33/Johan_adult.png/revision/latest?cb=20250211193323",
  Korosensei:
    "https://www.pngkit.com/png/detail/819-8194281_korosensei-assassination-classroom-koro-sensei.png",
};

function parseWhoAmIEntries(source) {
  const lines = source.split(/\r?\n/);
  const entries = [];
  let currentCategory = null;

  for (const line of lines) {
    const categoryMatch = line.match(/^\s*((?:who|logo)_[a-z_]+):\{.*isWhoAmI:true/);
    if (categoryMatch) {
      currentCategory = categoryMatch[1];
      continue;
    }

    if (!currentCategory) {
      continue;
    }

    const entryMatch = line.match(/\{q:\".*?\",a:\"(.*?)\",wiki:\"(.*?)\"\}/);
    if (entryMatch) {
      entries.push({
        category: currentCategory,
        answer: entryMatch[1],
        wiki: entryMatch[2],
      });
      continue;
    }

    if (/^\s*\},?$/.test(line)) {
      currentCategory = null;
    }
  }

  return [...new Map(entries.map((entry) => [entry.wiki, entry])).values()];
}

function collectExpandedWhoAmIEntries(expansions) {
  const entries = [];
  for (const [category, categoryBank] of Object.entries(expansions)) {
    if (!category.startsWith("who_") && !category.startsWith("logo_")) continue;
    for (const tier of [200, 400, 600]) {
      for (const entry of categoryBank?.[tier] || []) {
        if (!entry?.wiki) continue;
        entries.push({
          category,
          answer: entry.a,
          wiki: entry.wiki,
        });
      }
    }
  }
  return entries;
}

function normalizeTitleForUrl(title) {
  try {
    return encodeURI(decodeURIComponent(title));
  } catch {
    return encodeURI(title);
  }
}

function cleanImageUrl(src) {
  if (!src) return "";
  const cleaned = src.replace(/&amp;/g, "&");
  if (cleaned.startsWith("//")) return `https:${cleaned}`;
  return cleaned;
}

function isUsableImageUrl(src) {
  return (
    !!src &&
    !src.includes("OOjs_UI_icon_edit") &&
    !src.includes("Ambox") &&
    !src.includes("Question_book") &&
    !src.includes("Symbol")
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, attempts = 6) {
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }

      lastError = new Error(`Request failed for ${url}: ${response.status}`);
      if (response.status !== 429 && response.status < 500) {
        throw lastError;
      }

      const retryAfter = Number(response.headers.get("retry-after") || 0);
      const delay = retryAfter > 0 ? retryAfter * 1000 : attempt * 1200;
      await sleep(delay);
    } catch (error) {
      lastError = error;
      if (attempt === attempts) {
        throw error;
      }
      await sleep(attempt * 1500);
    }
  }

  throw lastError;
}

async function fetchText(url) {
  const response = await fetchWithRetry(url, { headers: { "user-agent": "Mozilla/5.0" } });
  return response.text();
}

async function resolveWikipediaImage(title) {
  let html = "";
  try {
    html = await fetchText(`https://en.wikipedia.org/wiki/${normalizeTitleForUrl(title)}`);
  } catch {
    return "";
  }
  const og = cleanImageUrl(html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1] || "");
  if (isUsableImageUrl(og)) return og;

  const infobox = cleanImageUrl(
    html.match(/<table class="infobox[\s\S]*?<img[^>]+src="([^"]+)"/i)?.[1] || "",
  );
  if (isUsableImageUrl(infobox)) return infobox;

  const figure = cleanImageUrl(
    html.match(/<figure[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/i)?.[1] || "",
  );
  if (isUsableImageUrl(figure)) return figure;

  return "";
}

async function searchWikipediaTitles(query) {
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
  const response = await fetchWithRetry(apiUrl, { headers: { "user-agent": "Mozilla/5.0" } });
  const data = await response.json();
  return (data?.query?.search || []).map((result) => result.title.replace(/ /g, "_"));
}

async function resolveImageSource(entry) {
  const directUrl = DIRECT_URL_OVERRIDES[entry.wiki];
  if (directUrl) return directUrl;

  const candidateTitles = [];
  if (TITLE_OVERRIDES[entry.wiki]) candidateTitles.push(TITLE_OVERRIDES[entry.wiki]);
  candidateTitles.push(entry.wiki);

  for (const title of candidateTitles) {
    const src = await resolveWikipediaImage(title);
    if (src) return src;
  }

  const searchQueries = [
    entry.answer,
    `${entry.answer} character`,
    `${entry.answer} ${entry.category.replace(/^who_/, "").replace(/_/g, " ")}`,
  ];

  const searchedTitles = new Set();
  for (const query of searchQueries) {
    for (const title of await searchWikipediaTitles(query)) {
      if (searchedTitles.has(title)) continue;
      searchedTitles.add(title);
      const src = await resolveWikipediaImage(title);
      if (src) return src;
    }
  }

  throw new Error(`No image found for ${entry.wiki} (${entry.answer})`);
}

function fileExtensionFor(url, contentType = "") {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext)) {
    return ext;
  }
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("svg")) return ".svg";
  return ".jpg";
}

function safeFileStem(wiki) {
  const decoded = (() => {
    try {
      return decodeURIComponent(wiki);
    } catch {
      return wiki;
    }
  })();

  const slug = decoded
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "whoami";

  const hash = crypto.createHash("sha1").update(wiki).digest("hex").slice(0, 8);
  return `${slug}-${hash}`;
}

async function downloadImage(url) {
  const response = await fetchWithRetry(url, { headers: { "user-agent": "Mozilla/5.0" } });
  const buffer = Buffer.from(await response.arrayBuffer());
  return { buffer, finalUrl: response.url || url, contentType: response.headers.get("content-type") || "" };
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

if (FORCE_REFRESH) {
  for (const fileName of fs.readdirSync(OUTPUT_DIR)) {
    fs.unlinkSync(path.join(OUTPUT_DIR, fileName));
  }
}

const entries = [
  ...new Map(
    [
      ...parseWhoAmIEntries(fs.readFileSync(APP_PATH, "utf8")),
      ...collectExpandedWhoAmIEntries(QUESTION_EXPANSIONS),
      ...collectExpandedWhoAmIEntries(QUESTION_MINIMUMS),
      ...collectExpandedWhoAmIEntries(TRIVIA_MEGA_EXPANSIONS),
      ...collectExpandedWhoAmIEntries(TRIVIA_ULTRA_EXPANSIONS),
      ...collectExpandedWhoAmIEntries(TRIVIA_TIER_BALANCE_EXPANSIONS),
      ...collectExpandedWhoAmIEntries(TRIVIA_TIER_PARITY_EXPANSIONS),
      ...collectExpandedWhoAmIEntries(TRIVIA_TIER_FINAL_PARITY_EXPANSIONS),
      ...collectExpandedWhoAmIEntries(TRIVIA_TIER_FINAL_TOPOFF_EXPANSIONS),
      ...collectExpandedWhoAmIEntries(NEW_CATEGORIES_BANK),
      ...collectExpandedWhoAmIEntries(LOGO_CATEGORIES_BANK),
      ...collectExpandedWhoAmIEntries(MORE_TRIVIA_EXPANSIONS),
    ].map((entry) => [entry.wiki, entry]),
  ).values(),
];
const manifest = {};

for (const entry of entries) {
  if (SKIP_ENTRIES.has(entry.wiki)) { console.log(`Skipped ${entry.wiki}`); continue; }
  const stem = safeFileStem(entry.wiki);
  const existingFile = fs
    .readdirSync(OUTPUT_DIR)
    .find((fileName) => fileName.startsWith(`${stem}.`));

  if (existingFile) {
    manifest[entry.wiki] = `/whoami/${existingFile}`;
    console.log(`Reused ${entry.wiki} -> ${existingFile}`);
    continue;
  }

  try {
    const sourceUrl = await resolveImageSource(entry);
    const { buffer, finalUrl, contentType } = await downloadImage(sourceUrl);
    const ext = fileExtensionFor(finalUrl, contentType);
    const fileName = `${stem}${ext}`;
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), buffer);
    manifest[entry.wiki] = `/whoami/${fileName}`;
    console.log(`Saved ${entry.wiki} -> ${fileName}`);
    await sleep(250);
  } catch (e) {
    console.log(`FAILED ${entry.wiki}: ${e.message}`);
  }
}

const manifestSource = `const WHOAMI_IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n\nexport default WHOAMI_IMAGE_MANIFEST;\n`;
fs.writeFileSync(MANIFEST_PATH, manifestSource);

console.log(`Generated ${Object.keys(manifest).length} Who Am I images.`);

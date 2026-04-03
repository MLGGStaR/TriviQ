import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import QUESTION_EXPANSIONS from "../src/triviaExpansions.js";
import QUESTION_MINIMUMS from "../src/triviaMinimums.js";

const APP_PATH = path.join(process.cwd(), "src", "App.jsx");
const OUTPUT_DIR = path.join(process.cwd(), "public", "whoami");
const MANIFEST_PATH = path.join(process.cwd(), "src", "whoamiImageManifest.js");
const FORCE_REFRESH = process.argv.includes("--refresh");

const TITLE_OVERRIDES = {
  Xavi: "Xavi_Hern%C3%A1ndez",
};

const DIRECT_URL_OVERRIDES = {};

function parseWhoAmIEntries(source) {
  const lines = source.split(/\r?\n/);
  const entries = [];
  let currentCategory = null;

  for (const line of lines) {
    const categoryMatch = line.match(/^\s*(who_[a-z_]+):\{.*isWhoAmI:true/);
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
    if (!category.startsWith("who_")) continue;
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
  const html = await fetchText(`https://en.wikipedia.org/wiki/${normalizeTitleForUrl(title)}`);
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
    ].map((entry) => [entry.wiki, entry]),
  ).values(),
];
const manifest = {};

for (const entry of entries) {
  const stem = safeFileStem(entry.wiki);
  const existingFile = fs
    .readdirSync(OUTPUT_DIR)
    .find((fileName) => fileName.startsWith(`${stem}.`));

  if (existingFile) {
    manifest[entry.wiki] = `/whoami/${existingFile}`;
    console.log(`Reused ${entry.wiki} -> ${existingFile}`);
    continue;
  }

  const sourceUrl = await resolveImageSource(entry);
  const { buffer, finalUrl, contentType } = await downloadImage(sourceUrl);
  const ext = fileExtensionFor(finalUrl, contentType);
  const fileName = `${stem}${ext}`;
  fs.writeFileSync(path.join(OUTPUT_DIR, fileName), buffer);
  manifest[entry.wiki] = `/whoami/${fileName}`;
  console.log(`Saved ${entry.wiki} -> ${fileName}`);
  await sleep(250);
}

const manifestSource = `const WHOAMI_IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n\nexport default WHOAMI_IMAGE_MANIFEST;\n`;
fs.writeFileSync(MANIFEST_PATH, manifestSource);

console.log(`Generated ${Object.keys(manifest).length} Who Am I images.`);

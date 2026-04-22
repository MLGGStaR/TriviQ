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
import NEW_CATEGORIES_PACK_2 from "../src/newCategoriesPack2.js";
import LOGO_CATEGORIES_BANK from "../src/logoCategoriesBank.js";
import MORE_TRIVIA_EXPANSIONS from "../src/moreTriviaExpansions.js";
import MEGA_NEW_EXPANSIONS from "../src/megaNewExpansions.js";
import QUALITY_BACKFILL from "../src/qualityBackfill.js";

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
  Young_Michael_Jackson: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Jackson_5_1972.JPG",
  Young_Elvis_Presley: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Elvis_Presley_first_national_television_appearance_1956.jpg",
  Young_Shirley_Temple: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Shirley_Temple_in_%22Bright_Eyes%22_with_James_Dunn.jpg",
  Young_Queen_Elizabeth_II: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Queen_Elizabeth_II_on_her_Coronation_Day_%28cropped%29.jpg",
  Young_Steve_Jobs: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Steve_Jobs_and_Macintosh_computer%2C_January_1984%2C_by_Bernard_Gotfryd_-_edited.jpg",
  Young_Barack_Obama: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Barack_Obama_luncheon_in_Cairo%2C_Illinois_%28April_15%2C_2004%29.jpg",
  Young_Muhammad_Ali: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Cassius_Clay_%281960%2C_JO%29.jpg",
  Young_Marilyn_Monroe: "https://upload.wikimedia.org/wikipedia/commons/3/32/Marilyn_Monroe_as_Norma_Jean_Dougherty.jpg",
  Young_Elizabeth_Taylor: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Elizabeth_Taylor-1945.JPG",
  Young_Michael_Jordan: "https://upload.wikimedia.org/wikipedia/commons/2/26/Michael_Jordan_-_1984_%282%29.jpg",
  Young_Princess_Diana: "https://upload.wikimedia.org/wikipedia/commons/4/40/Princess_Diana_dancing_with_John_Travolta_in_Cross_Hall_at_the_White_House.jpg",
  Young_John_F_Kennedy: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Congressman_John_F._Kennedy_1947.JPG",
  Young_Britney_Spears: "https://upload.wikimedia.org/wikipedia/commons/3/37/Britney_Spears_1999.jpg",
  Young_Taylor_Swift: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Taylor_Swift_%282007%29_retouched.jpg",
  Young_Miley_Cyrus: "https://upload.wikimedia.org/wikipedia/commons/3/36/Miley_Cyrus_as_Hannah_Montana.jpg",
  Young_Emma_Watson: "https://upload.wikimedia.org/wikipedia/commons/4/48/Emma_Watson_GoF_Premiere_Crop.jpg",
  Young_Tom_Cruise: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Tom_cruise_1989.jpg",
  Young_Paul_McCartney: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Paul_McCartney_1964.jpg",
  Young_John_Lennon: "https://upload.wikimedia.org/wikipedia/commons/8/8a/John_Lennon_1964.jpg",
  Young_Bob_Marley: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Bob_Marley_performing_in_1976.jpg",
  Young_Mariah_Carey: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Mariah_Carey_1990.jpg",
  Young_Beyonce: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Beyonce_Knowles_at_age_19_%28cropped%29.jpeg",
  Young_Jay_Z: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Jay-Z-01-mika.jpg",
  Young_Eminem: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Eminem-01-mika.jpg",
  Young_Bill_Clinton: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Bill_Clinton_1978.jpg",
  Young_Donald_Trump: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Donald_Trump_in_the_1980s_%28cropped%29.jpg",
  Young_Oprah_Winfrey: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Oprah_Winfrey%2C_Akosua_Busia_and_Margaret_Avery%2C_1986.jpg",
  Young_Bill_Gates: "https://upload.wikimedia.org/wikipedia/commons/9/91/Bill_Gates_1977.png",
  Young_Mark_Zuckerberg: "https://upload.wikimedia.org/wikipedia/commons/f/fc/MarkZuckerberg-crop.jpg",
  Young_Lionel_Messi: "https://upload.wikimedia.org/wikipedia/commons/2/26/Leo_messi_barce_2005.jpg",
  Young_Frank_Sinatra: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Frank_Sinatra_%281944_World-Telegram_file_photo%29.jpg",
  Young_Audrey_Hepburn: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Audrey_Hepburn_1953.jpg",
  Young_Mick_Jagger: "https://upload.wikimedia.org/wikipedia/commons/1/16/Mick-Jagger-1965-Turku.jpg",
  Young_Keith_Richards: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Keith_Richards_%281965%29.jpg",
  Young_Freddie_Mercury: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg",
  Young_David_Bowie: "https://upload.wikimedia.org/wikipedia/commons/6/68/David_Bowie_1974.JPG",
  Young_Stevie_Wonder: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Stevie_Wonder_1967_%281%29.jpg",
  Young_Aretha_Franklin: "https://upload.wikimedia.org/wikipedia/commons/9/99/Aretha_franklin_1960s_cropped_retouched.jpg",
  Young_Bob_Dylan: "https://upload.wikimedia.org/wikipedia/commons/6/68/Bob_Dylan_1963_promo_photo_by_Don_Hunstein.jpg",
  Young_Jimi_Hendrix: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Jimi_Hendrix_%281967%29_%28cropped%29.jpg",
  Young_Janis_Joplin: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Janis_Joplin_1969.JPG",
  Young_Kurt_Cobain: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Kurt_Cobain_1992.jpg",
  Young_Amy_Winehouse: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Amy_winehouse_2007.jpg",
  Young_Prince: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Prince_from_Under_the_Cherry_Moon%2C_1986.png",
  Young_Rupert_Grint: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Rupert_Grint_%28cropped%29.JPG",
  Young_Ellen_DeGeneres: "https://upload.wikimedia.org/wikipedia/commons/8/83/Ellen_DeGeneres_at_Emmys.jpg",
  Young_John_Travolta: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Welcome_Back_Kotter_John_Travolta_1976.jpg",
  Young_Arnold_Schwarzenegger: "https://upload.wikimedia.org/wikipedia/commons/0/05/Arnold_Schwarzenegger_1974.jpg",
  Young_Sylvester_Stallone: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Sylvester_Stallone_-_1977.jpg",
  Young_Robert_De_Niro: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Movie_trailer_screenshot_of_Robert_D_Niro_in_Mean_Streets_%281973%29.png",
  Young_Al_Pacino: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Pacino_as_Serpico_in_1973.jpg",
  Young_Jack_Nicholson: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Jack_Nicholson_-_1976_%28new%29.jpg",
  Young_Jane_Fonda: "https://upload.wikimedia.org/wikipedia/commons/2/20/Jane_Fonda_1963.jpg",
  Young_Meryl_Streep: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Meryl_Streep_%22Uncommon_Women_and_Others%22_%281978_PBS_press_photo%29.jpg",
  Young_Harrison_Ford: "https://upload.wikimedia.org/wikipedia/commons/7/7b/HarrisonFordYoung.png",
  Young_Clint_Eastwood: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Clint_Eastwood_-_1960s.JPG",
  Young_Sean_Connery: "https://upload.wikimedia.org/wikipedia/commons/5/53/Sean_Connery_1965_%28cropped_A%29.jpg",
  Young_Paul_Newman: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Paul_Newman_1954.JPG",
  Young_Robert_Redford: "https://upload.wikimedia.org/wikipedia/commons/3/39/Robert_Redford_Barefoot_in_the_park.jpg",
  Young_Steve_McQueen: "https://upload.wikimedia.org/wikipedia/commons/5/54/Steve-McQueen-1968.jpg",
  Young_Sugar_Ray_Leonard: "https://upload.wikimedia.org/wikipedia/commons/4/43/Sugar_Ray_Leonard_1989.jpg",
  Young_Mike_Tyson: "https://upload.wikimedia.org/wikipedia/commons/8/89/Mike_Tyson_in_1987_cropped.jpg",
  Young_Ronald_Reagan: "https://upload.wikimedia.org/wikipedia/commons/0/06/Ronald_Reagan_in_Dark_Victory_trailer.jpg",
  Young_JFK_Jr: "https://upload.wikimedia.org/wikipedia/commons/d/df/JFK_Jr_in_the_1975_Collegiate_school_yearbook.jpg",
  Young_Will_Smith: "https://upload.wikimedia.org/wikipedia/commons/8/84/Will_Smith_-_Emmy_Awards_1993.jpg",
  Young_Morgan_Freeman: "https://upload.wikimedia.org/wikipedia/commons/2/27/Freeman_%26_Colley-Lee.jpg",
  Young_Stephen_Hawking: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking.StarChild.jpg",
  Young_Nelson_Mandela: "https://upload.wikimedia.org/wikipedia/commons/1/11/Young_Mandela.jpg",
  Young_Mahatma_Gandhi: "https://upload.wikimedia.org/wikipedia/commons/0/02/Gandhi_student_full.jpg",
  Young_Abraham_Lincoln: "https://upload.wikimedia.org/wikipedia/commons/4/41/Abraham_Lincoln_1860.jpg",
  Young_Maya_Angelou: "https://upload.wikimedia.org/wikipedia/commons/4/45/Portrait_photograph_of_Maya_Angelou_by_Henry_Monroe_from_the_1969_first-edition_dust_jacket_of_I_Know_Why_the_Caged_Bird_Sings.png",
  Young_Rosa_Parks: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Rosa_Parks_1955.jpg",
  Young_Angela_Davis: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Angela_Davis_enters_Royce_Hall_for_first_lecture_October_7_1969.jpg",
  Young_Malcolm_X: "https://upload.wikimedia.org/wikipedia/commons/1/11/Malcolm_X_mugshot_1944.jpg",
  Young_Che_Guevara: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Che_Guevara_-_ca._1945.jpg",
  Young_Fidel_Castro: "https://upload.wikimedia.org/wikipedia/commons/1/17/Fidel_Castro_under_arrest_after_the_Moncada_attack.jpg",
  Young_Martin_Luther_King_Jr: "https://upload.wikimedia.org/wikipedia/commons/4/4e/MLK_mugshot_birmingham.jpg",
  Young_Anne_Frank: "https://upload.wikimedia.org/wikipedia/commons/a/a4/AnneFrank1940_crop.jpg",
  Young_Charlie_Chaplin: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Chaplin_and_Purviance_in_Work.jpg",
  Young_Buster_Keaton: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Busterkeaton_edit.jpg",
  Young_Orson_Welles: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Orson_Welles_1937_cr3-4.jpg",
  Young_Humphrey_Bogart: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Humphrey_Bogart_yearbook_photo_-_1918.jpg",
  Young_James_Dean: "https://upload.wikimedia.org/wikipedia/commons/c/ce/James_Dean_in_Rebel_Without_a_Cause_%28HQ%29.jpg",
  Young_Marlon_Brando: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Marlon_Brando%2C_photogaphed_by_Carl_Van_Vechten%2C_1948.jpg",
  Young_Laurence_Olivier: "https://upload.wikimedia.org/wikipedia/commons/5/57/Laurence_Olivier_%28borders_removed%29.jpg",
  Young_Ingrid_Bergman: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Ingrid_Bergman_at_age_14.jpg",
  Young_Katharine_Hepburn: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Katharine_Hepburn_yearbook_photo.jpg",
  Young_Grace_Kelly: "https://upload.wikimedia.org/wikipedia/commons/9/96/Grace_Kelly_-_Studio_portrait_%281953%29.png",
  Young_Vivien_Leigh: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Vivien_Leigh_Gone_Wind_Restored.jpg",
  Young_Rita_Hayworth: "https://upload.wikimedia.org/wikipedia/commons/6/66/Rita-Hayworth-Fox-1935.jpg",
  Young_Lauren_Bacall: "https://upload.wikimedia.org/wikipedia/commons/7/76/Lauren_Bacall_1945_press_photo.jpg",
  Young_Judy_Garland: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Portrait_photo_of_Garland_circa_1936.png",
  Young_Greta_Garbo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Greta_Garbo_in_G%C3%B6sta_Berlings_Saga_1924_cropped.jpg",
  Young_Clark_Gable: "https://upload.wikimedia.org/wikipedia/commons/0/07/Gable-Harlow.JPG",
};

function parseWhoAmIEntries(source) {
  const lines = source.split(/\r?\n/);
  const entries = [];
  let currentCategory = null;

  for (const line of lines) {
    const categoryMatch = line.match(/^\s*((?:who|logo|guess)_[a-z_]+):\{.*isWhoAmI:true/);
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
    if (!category.startsWith("who_") && !category.startsWith("logo_") && !category.startsWith("guess_")) continue;
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
      ...collectExpandedWhoAmIEntries(NEW_CATEGORIES_PACK_2),
      ...collectExpandedWhoAmIEntries(LOGO_CATEGORIES_BANK),
      ...collectExpandedWhoAmIEntries(MORE_TRIVIA_EXPANSIONS),
      ...collectExpandedWhoAmIEntries(MEGA_NEW_EXPANSIONS),
      ...collectExpandedWhoAmIEntries(QUALITY_BACKFILL),
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

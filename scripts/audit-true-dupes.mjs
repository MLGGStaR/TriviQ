// Audit BANK for true duplicates (within-cat exact, cross-cat, near-dupes by answer).
// Mirrors App.jsx merge order and normalization.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");

// --- Load modules via dynamic import ----------------------------------------
async function imp(file){
  const mod = await import(pathToFileURL(path.join(SRC, file)).href);
  return mod.default ?? mod;
}

const NEW_CATEGORIES_BANK = await imp("newCategoriesBank.js");
const NEW_CATEGORIES_PACK_2 = await imp("newCategoriesPack2.js");
const LOGO_CATEGORIES_BANK = await imp("logoCategoriesBank.js");
const EMOJI_GUESS_CATEGORIES = await imp("emojiGuessCategories.js");
const QUESTION_EXPANSIONS = await imp("triviaExpansions.js");
const QUESTION_MINIMUMS = await imp("triviaMinimums.js");
const TRIVIA_MEGA_EXPANSIONS = await imp("triviaMegaExpansions.js");
const TRIVIA_ULTRA_EXPANSIONS = await imp("triviaUltraExpansions.js");
const TRIVIA_TIER_BALANCE_EXPANSIONS = await imp("triviaTierBalanceExpansions.js");
const TRIVIA_TIER_PARITY_EXPANSIONS = await imp("triviaTierParityExpansions.js");
const TRIVIA_TIER_FINAL_PARITY_EXPANSIONS = await imp("triviaTierFinalParityExpansions.js");
const TRIVIA_TIER_FINAL_TOPOFF_EXPANSIONS = await imp("triviaTierFinalTopoffExpansions.js");
const MEGA_NEW_EXPANSIONS = await imp("megaNewExpansions.js");
const MORE_TRIVIA_EXPANSIONS = await imp("moreTriviaExpansions.js");
const QUALITY_BACKFILL = await imp("qualityBackfill.js");
const refMod = await import(pathToFileURL(path.join(SRC, "questionRefinements.js")).href);
const QUESTION_REFINEMENT_ADDITIONS = refMod.QUESTION_REFINEMENT_ADDITIONS;
const { isBlacklisted } = await import(pathToFileURL(path.join(SRC, "qualityBlacklist.js")).href);

// --- Extract RAW_BANK literal from App.jsx ----------------------------------
// The literal `const RAW_BANK = { ... };` block in App.jsx spans lines 373-4210.
// To safely evaluate it as JS we cut just that object literal and eval it after
// stripping the leading `...EMOJI_GUESS / NEW_CATEGORIES / LOGO` spreads, which
// we splice back in from already-imported modules.
const appSrc = fs.readFileSync(path.join(SRC, "App.jsx"), "utf8");
const m = appSrc.match(/const RAW_BANK\s*=\s*(\{[\s\S]*?\n\})\s*;/);
if (!m) throw new Error("Could not find RAW_BANK literal");
let rawLit = m[1];
// Strip the spread expressions because they reference imports we already loaded.
rawLit = rawLit
  .replace(/\.\.\.EMOJI_GUESS_CATEGORIES,?/g, "")
  .replace(/\.\.\.NEW_CATEGORIES_BANK,?/g, "")
  .replace(/\.\.\.NEW_CATEGORIES_PACK_2,?/g, "")
  .replace(/\.\.\.LOGO_CATEGORIES_BANK,?/g, "");

// RAW_BANK references a few imports inline (movie_scenes / FLAG_BANK / COUNTRY_MAP_BANK).
const MOVIE_SCENE_BANK = await imp("movieScenes.js");

// Extract the prelude (lines that define FLAG_BANK + COUNTRY_MAP_BANK)
// We grab everything from `const FLAG_TIERS = {` up to (but not including)
// `const RAW_BANK = {`.
const preludeMatch = appSrc.match(/const FLAG_TIERS\s*=[\s\S]*?(?=const RAW_BANK\s*=)/);
if (!preludeMatch) throw new Error("Could not find prelude");
let prelude = preludeMatch[0];
// Strip the throw guards which call new Set; safe to keep but we drop them
prelude = prelude.replace(/throw new Error\([^)]*\);?/g, "/* noop */");

let RAW_BANK_INLINE;
try {
  const body = `
    ${prelude}
    return (${rawLit});
  `;
  // codeToFlagEmoji is referenced by buildFlagQuestions — let's provide a stub.
  // It's actually defined elsewhere in App.jsx (around top).
  const codeToFlagEmoji = (code) => "flag:" + code; // stub — content doesn't matter for dupe detection
  // eslint-disable-next-line no-new-func
  const fn = new Function("MOVIE_SCENE_BANK", "codeToFlagEmoji", body);
  RAW_BANK_INLINE = fn(MOVIE_SCENE_BANK, codeToFlagEmoji);
} catch (e) {
  console.error("Eval failed; literal head:", rawLit.slice(0, 200));
  console.error("Prelude head:", prelude.slice(0, 200));
  throw e;
}

const RAW_BANK = {
  ...EMOJI_GUESS_CATEGORIES,
  ...NEW_CATEGORIES_BANK,
  ...NEW_CATEGORIES_PACK_2,
  ...LOGO_CATEGORIES_BANK,
  ...RAW_BANK_INLINE,
};

// --- Merge expansions exactly like App.jsx ----------------------------------
const POINT_VALUES = [200, 400, 600];

function mergeQuestionExpansions(rawBank, expansions){
  const merged = Object.fromEntries(Object.entries(rawBank).map(([catId, cat]) => [catId, { ...cat }]));
  Object.entries(expansions || {}).forEach(([catId, catExpansion]) => {
    if (!merged[catId]) return;
    POINT_VALUES.forEach((pts) => {
      const existing = Array.isArray(merged[catId][pts]) ? merged[catId][pts] : [];
      const extra = Array.isArray(catExpansion?.[pts]) ? catExpansion[pts] : [];
      merged[catId][pts] = [...existing, ...extra];
    });
  });
  return merged;
}

let merged = RAW_BANK;
const chain = [
  ["QUESTION_EXPANSIONS", QUESTION_EXPANSIONS],
  ["QUESTION_MINIMUMS", QUESTION_MINIMUMS],
  ["TRIVIA_MEGA_EXPANSIONS", TRIVIA_MEGA_EXPANSIONS],
  ["TRIVIA_ULTRA_EXPANSIONS", TRIVIA_ULTRA_EXPANSIONS],
  ["TRIVIA_TIER_BALANCE_EXPANSIONS", TRIVIA_TIER_BALANCE_EXPANSIONS],
  ["QUESTION_REFINEMENT_ADDITIONS", QUESTION_REFINEMENT_ADDITIONS],
  ["TRIVIA_TIER_PARITY_EXPANSIONS", TRIVIA_TIER_PARITY_EXPANSIONS],
  ["TRIVIA_TIER_FINAL_PARITY_EXPANSIONS", TRIVIA_TIER_FINAL_PARITY_EXPANSIONS],
  ["TRIVIA_TIER_FINAL_TOPOFF_EXPANSIONS", TRIVIA_TIER_FINAL_TOPOFF_EXPANSIONS],
  ["MEGA_NEW_EXPANSIONS", MEGA_NEW_EXPANSIONS],
  ["MORE_TRIVIA_EXPANSIONS", MORE_TRIVIA_EXPANSIONS],
  ["QUALITY_BACKFILL", QUALITY_BACKFILL],
];
for (const [name, mod] of chain) {
  merged = mergeQuestionExpansions(merged, mod);
}

// --- Normalization helpers (mirror App.jsx + blacklist) ---------------------
function normPart(value){
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function strictAlnum(value){
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function poolEntryKey(entry){
  if (entry?.code) return `code:${normPart(entry.code)}`;
  if (entry?.wiki) return `wiki:${normPart(entry.wiki)}`;
  return `qa:${normPart(entry?.q)}|${normPart(entry?.a)}`;
}

// --- Categories to exclude (emoji cats removed) -----------------------------
const EMOJI_CAT_IDS = new Set(Object.keys(EMOJI_GUESS_CATEGORIES));
// Also skip non-question style cats from "duplicate question" analysis
const SKIP_CATS = new Set([
  ...EMOJI_CAT_IDS,
  // image / song / scene / charades / who-am-i style — their q text is templated
  // and would create spurious "duplicates". Keep them for within-cat checks
  // but downgrade cross-cat noise.
]);

// We'll still analyze image cats too but cross-cat comparison will be
// answer-based which surfaces real overlaps (e.g. same person in two cats).

// --- Build flat list of entries ---------------------------------------------
/** @type {Array<{cat:string,tier:number,q:string,a:string,wiki?:string,qNorm:string,aNorm:string,qStrict:string,aStrict:string,key:string}>} */
const allEntries = [];
let totalEntries = 0;
let blacklistedCount = 0;

for (const [catId, cat] of Object.entries(merged)) {
  if (EMOJI_CAT_IDS.has(catId)) continue; // explicitly excluded
  for (const pts of POINT_VALUES) {
    const pool = Array.isArray(cat?.[pts]) ? cat[pts] : [];
    for (const e of pool) {
      if (!e) continue;
      totalEntries++;
      if (e.q && e.a && isBlacklisted(catId, e.q, e.a)) {
        blacklistedCount++;
        continue;
      }
      const q = e.q || "";
      const a = e.a || "";
      allEntries.push({
        cat: catId,
        tier: pts,
        q,
        a,
        wiki: e.wiki || null,
        code: e.code || null,
        qNorm: normPart(q),
        aNorm: normPart(a),
        qStrict: strictAlnum(q),
        aStrict: strictAlnum(a),
        key: poolEntryKey(e),
      });
    }
  }
}

console.log(`Total entries scanned: ${totalEntries}`);
console.log(`Blacklisted skipped: ${blacklistedCount}`);
console.log(`Active entries: ${allEntries.length}`);

// --- 1) Exact within-cat duplicates -----------------------------------------
// Group by (cat, tier, key) AND by (cat, qStrict+aStrict) to catch
// near-identical that should have collapsed.
const withinCatExact = [];
{
  const groups = new Map();
  for (const e of allEntries) {
    // Normalize aggressively: strip everything but alnum from q and a.
    // This catches "Who is X?" vs "Who is X" vs "who is x." duplicates.
    const k = `${e.cat}|${e.qStrict}|${e.aStrict}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(e);
  }
  for (const [k, arr] of groups) {
    if (arr.length < 2) continue;
    // Different tiers count as duplicate too (player can hit both)
    withinCatExact.push({
      cat: arr[0].cat,
      tiers: [...new Set(arr.map(x=>x.tier))].sort(),
      q: arr[0].q,
      a: arr[0].a,
      occurrences: arr.length,
      tierBreakdown: arr.map(x=>({tier:x.tier,q:x.q,a:x.a})),
    });
  }
}

// Also wiki-based within-cat collisions
const withinCatWiki = [];
{
  const groups = new Map();
  for (const e of allEntries) {
    if (!e.wiki) continue;
    const k = `${e.cat}|wiki|${normPart(e.wiki)}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(e);
  }
  for (const [k, arr] of groups) {
    if (arr.length < 2) continue;
    withinCatWiki.push({
      cat: arr[0].cat,
      wiki: arr[0].wiki,
      occurrences: arr.length,
      tiers: [...new Set(arr.map(x=>x.tier))].sort(),
      qVariants: [...new Set(arr.map(x=>x.q))],
      aVariants: [...new Set(arr.map(x=>x.a))],
    });
  }
}

// --- 2) Cross-cat duplicates -------------------------------------------------
// Same normalized question + same answer in different cats. Also flag same
// answer + very similar wiki/q.
const crossCat = [];
{
  // (a) q+a exact across cats
  const groupsQA = new Map();
  for (const e of allEntries) {
    if (!e.qStrict || !e.aStrict) continue;
    // Skip templated prompts that aren't really questions
    if (e.qStrict.length < 5) continue;
    const k = `${e.qStrict}|${e.aStrict}`;
    if (!groupsQA.has(k)) groupsQA.set(k, []);
    groupsQA.get(k).push(e);
  }
  for (const [k, arr] of groupsQA) {
    const cats = [...new Set(arr.map(x=>x.cat))];
    if (cats.length < 2) continue;
    crossCat.push({
      type: "exact_qa",
      a: arr[0].a,
      q: arr[0].q,
      cats,
      occurrences: arr.length,
      qVariants: [...new Set(arr.map(x=>x.q))],
      detail: arr.map(x=>({cat:x.cat,tier:x.tier,q:x.q,a:x.a})),
    });
  }
  // (b) wiki slug across cats
  const groupsWiki = new Map();
  for (const e of allEntries) {
    if (!e.wiki) continue;
    const k = normPart(e.wiki);
    if (!groupsWiki.has(k)) groupsWiki.set(k, []);
    groupsWiki.get(k).push(e);
  }
  for (const [k, arr] of groupsWiki) {
    const cats = [...new Set(arr.map(x=>x.cat))];
    if (cats.length < 2) continue;
    crossCat.push({
      type: "wiki_slug",
      wiki: arr[0].wiki,
      a: arr[0].a,
      cats,
      occurrences: arr.length,
      detail: arr.map(x=>({cat:x.cat,tier:x.tier,q:x.q,a:x.a,wiki:x.wiki})),
    });
  }
}

// --- 3) Near-duplicates by answer within a cat ------------------------------
// Same answer + same cat + different q where >50% of significant words overlap.
const STOP_WORDS = new Set([
  "the","a","an","of","in","on","at","to","for","by","with","is","are","was","were",
  "be","been","being","and","or","but","not","no","what","who","whom","whose","which",
  "where","when","why","how","that","this","these","those","it","its","do","does",
  "did","has","have","had","can","could","will","would","may","might","shall","should",
  "as","from","into","up","out","over","under","again","than","then","so","if","about",
  "between","you","your","i","my","me","mine","he","she","they","them","their","his",
  "her","hers","we","us","our","ours","name","named","called","known","says","said",
  "play","plays","played","playing","real","character","one","two","three","four","five",
  "first","last","main","year","years","new","old","big","small","actor","actress",
  "actors","actresses","famous","movie","film","show","series","season","episode","book",
  "books","song","songs","game","games","also","just","very","much","most","more","less",
]);

function sigWords(s){
  return s.toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(w => w && w.length > 1 && !STOP_WORDS.has(w));
}

const nearDupesByAnswer = [];
{
  // Group by (cat, aStrict)
  const groups = new Map();
  for (const e of allEntries) {
    if (!e.aStrict || e.aStrict.length < 2) continue;
    const k = `${e.cat}|${e.aStrict}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(e);
  }
  for (const [k, arr] of groups) {
    if (arr.length < 2) continue;
    // Determine overlap between every pair of distinct questions
    const variants = [...new Set(arr.map(x=>x.q))];
    if (variants.length < 2) continue; // identical q already caught by withinCatExact
    let suspect = false;
    let pairs = [];
    for (let i=0;i<variants.length;i++){
      for (let j=i+1;j<variants.length;j++){
        const a = sigWords(variants[i]);
        const b = sigWords(variants[j]);
        if (!a.length || !b.length) continue;
        const setA = new Set(a);
        const setB = new Set(b);
        let inter = 0;
        for (const w of setA) if (setB.has(w)) inter++;
        const minSize = Math.min(setA.size, setB.size);
        if (minSize === 0) continue;
        const overlap = inter / minSize;
        if (overlap > 0.5) {
          suspect = true;
          pairs.push({ q1: variants[i], q2: variants[j], overlap: +overlap.toFixed(2) });
        } else {
          // Also flag if both share answer — same answer, totally different q is
          // still a "you'll learn the answer twice" issue.
          pairs.push({ q1: variants[i], q2: variants[j], overlap: +overlap.toFixed(2), sameAnswerOnly: true });
        }
      }
    }
    // Always include same-answer-in-same-cat — that's a true dupe regardless
    // of question wording, because the player learns the same fact twice.
    nearDupesByAnswer.push({
      cat: arr[0].cat,
      a: arr[0].a,
      occurrences: arr.length,
      tiers: [...new Set(arr.map(x=>x.tier))].sort(),
      qVariants: variants,
      pairs,
      flaggedHighOverlap: suspect,
    });
  }
}

// --- Per-cat counts ---------------------------------------------------------
const perCatCounts = {};
for (const e of allEntries) {
  perCatCounts[e.cat] = (perCatCounts[e.cat] || 0) + 1;
}

// --- Build worst offenders --------------------------------------------------
// Score = (sum of all dupe occurrences impacting this cat)
const offenderScore = {};
function bump(cat, n){ offenderScore[cat] = (offenderScore[cat] || 0) + n; }
for (const r of withinCatExact) bump(r.cat, r.occurrences);
for (const r of withinCatWiki) bump(r.cat, r.occurrences);
for (const r of crossCat) {
  for (const c of r.cats) bump(c, r.occurrences);
}
for (const r of nearDupesByAnswer) {
  bump(r.cat, r.occurrences);
}
const worstOffenders = Object.entries(offenderScore)
  .sort((a,b)=>b[1]-a[1])
  .slice(0, 20)
  .map(([cat, score]) => ({ cat, dupePressure: score, totalEntries: perCatCounts[cat] || 0 }));

// --- Output -----------------------------------------------------------------
// --- Classify each finding as ESCAPED (user-visible) vs CAUGHT by sanitize -
// The existing sanitize key is normalize(whitespace+accents only).
// A finding ESCAPES sanitize if its dedupe key would NOT collide there.

function existingSanitizeKey(q, a, wiki, code){
  if (code) return `code:${normPart(code)}`;
  if (wiki) return `wiki:${normPart(wiki)}`;
  return `qa:${normPart(q)}|${normPart(a)}`;
}

// For within-cat exact (using qStrict/aStrict): user-visible only if existing
// sanitize keys DIFFER for the 2 entries (e.g. punctuation differs).
function annotateWithinCat(rec){
  const keys = new Set(rec.tierBreakdown.map(e=>existingSanitizeKey(e.q, e.a)));
  // If all entries hash to the same existing key, sanitize collapses them.
  // (They live in same cat; sanitize spans tiers within a cat.)
  rec.escapesSanitize = keys.size > 1;
  return rec;
}
withinCatExact.forEach(annotateWithinCat);

// withinCatWiki — these all share the same wiki slug so existing sanitize
// (which dedupes by wiki) WOULD remove them. Mark as caught.
withinCatWiki.forEach(r => { r.escapesSanitize = false; r.note = "sanitize dedupes by wiki slug — silent pool shrink, not user-visible"; });

// crossCat — sanitize set is scoped per-cat so cross-cat ALWAYS escapes.
crossCat.forEach(r => { r.escapesSanitize = true; });

// nearDupesByAnswer — sanitize uses q+a key, so different q (same a) always escapes.
nearDupesByAnswer.forEach(r => { r.escapesSanitize = true; });

// Recount user-visible vs caught
const exactWithinCatEscapes = withinCatExact.filter(r=>r.escapesSanitize);
const exactWithinCatCaught  = withinCatExact.filter(r=>!r.escapesSanitize);

const out = {
  summary: {
    totalEntries,
    blacklistedSkipped: blacklistedCount,
    activeEntries: allEntries.length,
    exactWithinCatCount: withinCatExact.length,
    exactWithinCatEscapesSanitize: exactWithinCatEscapes.length,
    exactWithinCatCaughtBySanitize: exactWithinCatCaught.length,
    withinCatWikiCount: withinCatWiki.length,
    withinCatWikiNote: "caught by sanitize wiki-key dedupe — silent pool shrink, not user-visible",
    crossCatCount: crossCat.length,
    crossCatNote: "sanitize is scoped per-category, so cross-cat ALWAYS escapes — user-visible",
    nearDupesByAnswerCount: nearDupesByAnswer.length,
    nearDupesFlaggedHighOverlapCount: nearDupesByAnswer.filter(x=>x.flaggedHighOverlap).length,
    nearDupesNote: "different q wording, same answer — sanitize keys differ so all escape",
  },
  worstOffenders,
  perCatCounts,
  exactWithinCat: withinCatExact.sort((a,b)=>(b.escapesSanitize?1:0)-(a.escapesSanitize?1:0) || b.occurrences-a.occurrences),
  withinCatWiki: withinCatWiki.sort((a,b)=>b.occurrences-a.occurrences),
  crossCat: crossCat.sort((a,b)=>b.occurrences-a.occurrences),
  nearDupesByAnswer: nearDupesByAnswer.sort((a,b)=>b.occurrences-a.occurrences),
};

const outPath = path.join(ROOT, "audit", "true-duplicates.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

console.log("\n=== AUDIT SUMMARY ===");
console.log(JSON.stringify(out.summary, null, 2));
console.log("\nWrote:", outPath);
console.log("\nTop 20 worst offending cats:");
for (const o of worstOffenders) {
  console.log(`  ${o.cat.padEnd(28)} pressure=${o.dupePressure}  size=${o.totalEntries}`);
}

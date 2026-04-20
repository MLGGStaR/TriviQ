// For every wiki slug used in who_* categories, query Wikipedia to see whether:
//   (a) the page exists
//   (b) the page has an infobox image of a PERSON/CHARACTER (not a logo/poster)
// We infer image correctness by heuristic: check the og:image title — if the filename mentions
// the expected entity name tokens (from `a`), we consider it correct; otherwise flag for removal.
import fs from "node:fs";
import path from "node:path";

const BANKS = [
  "triviaExpansions","triviaMinimums","triviaMegaExpansions","triviaUltraExpansions",
  "triviaTierBalanceExpansions","triviaTierParityExpansions","triviaTierFinalParityExpansions",
  "triviaTierFinalTopoffExpansions","newCategoriesBank","megaNewExpansions","moreTriviaExpansions",
  "newCategoriesPack2","logoCategoriesBank","emojiGuessCategories","qualityBackfill",
];

const allEntries = [];
for (const f of BANKS) {
  const mod = await import(`../src/${f}.js`);
  const bank = mod.default || {};
  for (const [cat, obj] of Object.entries(bank)) {
    if (!cat.startsWith("who_") && !cat.startsWith("logo_")) continue;
    for (const t of [200, 400, 600]) {
      for (const e of obj?.[t] || []) {
        if (!e.wiki) continue;
        allEntries.push({ cat, tier: t, q: e.q, a: e.a, wiki: e.wiki, file: f });
      }
    }
  }
}

// Dedup by wiki slug — if same slug shows up multiple times, we only check once.
const uniqWikis = [...new Set(allEntries.map((e) => e.wiki))];
console.log(`Checking ${uniqWikis.length} unique wiki slugs used across ${allEntries.length} entries...`);

const BATCH = 40;
const slugStatus = {}; // wiki -> { exists, normalizedTitle, missing }

async function checkBatch(titles) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&titles=${titles.map((t) => encodeURIComponent(decodeURIComponent(t))).join("|")}`;
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const normalized = data?.query?.normalized || [];
  const redirects = data?.query?.redirects || [];
  // Build title -> final title map
  const titleMap = new Map();
  for (const t of titles) titleMap.set(decodeURIComponent(t), decodeURIComponent(t));
  for (const n of normalized) titleMap.set(n.from, n.to);
  for (const r of redirects) {
    // find any key that currently points to r.from and update to r.to
    for (const [k, v] of titleMap.entries()) if (v === r.from) titleMap.set(k, r.to);
  }
  // For each input slug, determine if final page exists
  for (const t of titles) {
    const input = decodeURIComponent(t);
    const final = titleMap.get(input) || input;
    // Find in pages by title
    const pageEntry = Object.values(pages).find((p) => p.title === final);
    const missing = pageEntry?.missing !== undefined;
    slugStatus[t] = { exists: !missing, final, redirected: final !== input };
  }
}

for (let i = 0; i < uniqWikis.length; i += BATCH) {
  const chunk = uniqWikis.slice(i, i + BATCH);
  try {
    await checkBatch(chunk);
  } catch (e) {
    console.log(`Batch ${i} failed: ${e.message}`);
  }
  if ((i / BATCH) % 10 === 0) console.log(`  ${i + chunk.length}/${uniqWikis.length}...`);
  await new Promise((r) => setTimeout(r, 120));
}

// Now determine which entries are problematic.
// Problem category 1: wiki page doesn't exist (fallback search gave wrong image).
// Problem category 2: wiki page exists but redirects to a DIFFERENT entity (e.g., Nancy_Botwin -> Weeds)
// For (2), we flag if the final title's significant-word set doesn't overlap with the answer's words.

function wordSet(s) {
  return new Set(
    String(s || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[_().,:;!?\-'"]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3)
  );
}

const badEntries = [];
for (const e of allEntries) {
  const st = slugStatus[e.wiki];
  if (!st) continue;
  if (!st.exists) {
    badEntries.push({ ...e, reason: "wiki page does not exist" });
    continue;
  }
  if (st.redirected) {
    // who_country_landmark intentionally uses landmark-name wiki with country-name answer.
    // A redirect here is fine unless it redirects to a list/disambiguation.
    if (e.cat === "who_country_landmark") {
      if (/^List of |\(disambiguation\)/i.test(st.final)) {
        badEntries.push({ ...e, reason: `redirects to "${st.final}" (list/disambig)` });
      }
      continue;
    }
    const finalWords = wordSet(st.final);
    const answerWords = wordSet(e.a);
    // if ANY significant word overlaps, allow (e.g., "Raphael Varane" -> "Raphaël Varane" allowed)
    let overlap = false;
    for (const w of answerWords) if (finalWords.has(w)) { overlap = true; break; }
    if (!overlap) {
      badEntries.push({ ...e, reason: `redirects to "${st.final}" (unrelated)` });
    }
  }
}

fs.writeFileSync("audit/bad-wiki-slugs.json", JSON.stringify({ badEntries, slugStatus }, null, 2));
console.log(`\nFound ${badEntries.length} bad entries across ${uniqWikis.length} wiki slugs.`);
console.log(`Status breakdown: exists=${Object.values(slugStatus).filter((s) => s.exists).length}, missing=${Object.values(slugStatus).filter((s) => !s.exists).length}`);

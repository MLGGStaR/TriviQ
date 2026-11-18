// Guards the Arabic-aware question-key normalization in src/App.jsx.
//  1. Every existing non-Arabic question keeps exactly the key it had before (no seen-history churn).
//  2. The few existing Arabic-script questions still match usage stored under the old key format.
//  3. Arabic spelling variants fold together, distinct Arabic questions stay distinct, no empty keys.
// Usage: node scripts/dump-bank-tsv.mjs audit/arabic/existing-bank.tsv && node scripts/test-arabic-keys.mjs
import fs from "node:fs";

const src = fs.readFileSync("src/App.jsx", "utf8");
function extract(name) {
  const start = src.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`not found: ${name}`);
  return src.slice(start, src.indexOf("\n}", start) + 2);
}
function extractConst(name) {
  const start = src.indexOf(`const ${name}=`);
  if (start < 0) throw new Error(`not found: const ${name}`);
  return src.slice(start, src.indexOf("\n", start));
}
const names = [
  "foldQuestionKeyText", "latinOnlyNormalizeQuestionKeyPart", "normalizeQuestionKeyPart",
  "questionPoolEntryKey", "legacyNormalizeQuestionKeyPart", "legacyQuestionPoolEntryKey",
  "latinOnlyQuestionPoolEntryKey", "latinOnlyContentKeyForEntry", "contentKeyForEntry",
  "getQuestionUsageKeys", "getQuestionMatchKeys",
];
const code = [extractConst("ARABIC_SCRIPT_RE"), ...names.map(extract)].join("\n");
const fns = new Function(`${code}; return { ${names.join(", ")} };`)();

// The normalization exactly as deployed before Arabic support.
const before = (v) => String(v ?? "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
const beforeKey = (e) => e.code ? `code:${before(e.code)}` : e.wiki ? `wiki:${before(e.wiki)}` : `qa:${before(e.q)}|${before(e.a)}`;

let pass = 0, fail = 0;
const check = (ok, label) => { ok ? pass++ : fail++; if (!ok) console.log("FAIL |", label); };

// 1 + 2: every row of the exported bank.
const tsvPath = "audit/arabic/existing-bank.tsv";
if (fs.existsSync(tsvPath)) {
  const rows = fs.readFileSync(tsvPath, "utf8").split("\n").slice(1).filter(Boolean).map((l) => l.split("\t"));
  let unchanged = 0, arabicRows = 0;
  for (const [cat, tier, q, a] of rows) {
    if (cat.startsWith("ar_")) continue;
    const e = { q, a };
    if (/[؀-ۿ]/.test(q + a)) {
      arabicRows++;
      const entry = { ...e, _qkey: fns.questionPoolEntryKey(e) };
      entry._qid = `${cat}:${tier}:${entry._qkey}`;
      const match = fns.getQuestionMatchKeys(entry);
      check(match.includes(beforeKey(e)), `old key not matched for ${cat} ${q}`);
      check(match.includes(`${cat}:${tier}:${beforeKey(e)}`), `old _qid not matched for ${cat} ${q}`);
    } else {
      const same = fns.questionPoolEntryKey(e) === beforeKey(e);
      check(same, `key changed for ${cat} ${q}`);
      if (same) unchanged++;
    }
  }
  console.log(`existing bank: ${unchanged} non-Arabic keys unchanged, ${arabicRows} Arabic-script rows checked for old-key matching`);
} else {
  console.log(`skip existing-bank check (${tsvPath} missing)`);
}

// 3: Arabic folding.
const n = fns.normalizeQuestionKeyPart;
check(n("أَحمد") === n("احمد"), "harakat + hamza-alef fold");
check(n("إسلام") === n("اسلام"), "alef with hamza below folds");
check(n("مكة المكرمة") === n("مكه المكرمه"), "ta marbuta folds");
check(n("مستشفى") === n("مستشفي"), "alef maqsura folds");
check(n("عام ١٩٧١") === n("عام 1971"), "Arabic-Indic digits fold");
check(n("كـــاظم") === n("كاظم"), "tatweel dropped");
check(n("ما عاصمة الإمارات؟") !== n("ما عاصمة السعودية؟"), "distinct questions stay distinct");
check(n("من يصنع BMW؟").includes("bmw"), "Latin inside Arabic is kept");
check(n("كمّل: اللي ما يعرف الصقر") !== "", "Arabic text never collapses to empty");
const arEntry = { q: "خمّن الأغنية من المقطع", a: "تملي معاك" };
check(!fns.getQuestionMatchKeys({ ...arEntry, _qkey: fns.questionPoolEntryKey(arEntry), _qid: "x:200:" + fns.questionPoolEntryKey(arEntry) }).includes("qa:|"),
  "degenerate empty legacy key is never matched");

console.log(`${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);

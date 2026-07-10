// Verify legacyQuestionPoolEntryKey reproduces the exact pre-7d2390e key format.
import fs from "node:fs";

const src = fs.readFileSync("src/App.jsx", "utf8");
function extract(name) {
  const start = src.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`not found: ${name}`);
  const end = src.indexOf("\n}", start);
  return src.slice(start, end + 2);
}
const code = [
  extract("normalizeQuestionKeyPart"),
  extract("legacyNormalizeQuestionKeyPart"),
  extract("questionPoolEntryKey"),
  extract("legacyQuestionPoolEntryKey"),
].join("\n");
const fns = new Function(`${code}; return { normalizeQuestionKeyPart, legacyNormalizeQuestionKeyPart, questionPoolEntryKey, legacyQuestionPoolEntryKey };`)();

// Reference: old client behavior exactly as deployed before 7d2390e.
const oldNorm = (v) => String(v ?? "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
const oldKey = (e) => e.code ? `code:${oldNorm(e.code)}` : e.wiki ? `wiki:${oldNorm(e.wiki)}` : `qa:${oldNorm(e.q)}|${oldNorm(e.a)}`;

const samples = [
  { q: "What is the capital of France?", a: "Paris" },
  { q: "Who wrote 'Romeo and Juliet'?", a: "William Shakespeare" },
  { q: "Guess the character", a: "Walter White", wiki: "Breaking_Bad" },
  { q: "Beyoncé hit song?", a: "Crazy in Love (feat. Jay-Z)" },
  { q: "Flag", a: "France", code: "fr" },
  { q: "  Extra   spaces  ?", a: "Answer—with–dashes" },
];

let pass = 0, fail = 0;
for (const s of samples) {
  const legacy = fns.legacyQuestionPoolEntryKey(s);
  const expected = oldKey(s);
  const ok = legacy === expected;
  ok ? pass++ : fail++;
  console.log(ok ? "PASS" : "FAIL", "|", JSON.stringify(legacy), ok ? "" : `!== ${JSON.stringify(expected)}`);
}
console.log("New key differs from legacy where punctuation exists (sanity):",
  fns.questionPoolEntryKey(samples[0]) !== fns.legacyQuestionPoolEntryKey(samples[0]));
console.log(`${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);

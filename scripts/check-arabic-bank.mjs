// Mechanical quality gate for src/arabicCategoriesBank.js (run after build-arabic-bank.mjs).
// Checks: 30/30/30 floor, duplicate keys (what sanitizeBank would silently drop), duplicate questions
// within/across Arabic categories, answers leaked into the question, binary "A أم B" questions,
// over-used answers, audio tile shape. With --net it also HEADs every audio preview URL.
// Usage: node scripts/check-arabic-bank.mjs [--net]
import BANK from "../src/arabicCategoriesBank.js";

const NET = process.argv.includes("--net");
const FLOOR = 30;

// Same folding as normalizeQuestionKeyPart in src/App.jsx (Arabic branch).
const norm = (v) => String(v ?? "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
  .replace(/[ً-ٰٟۖ-ۭـ]/g, "")
  .replace(/[آأإٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
  .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
  .replace(/[^a-z0-9ء-يٱ-ۓۺ-ۿ]+/g, " ").replace(/\s+/g, " ").trim();
// Strip the Arabic article and common clitics so "الذهب" in a question leaks answer "ذهب".
const stem = (w) => w.replace(/^(و|ف|ب|ل|ك)?ال/, "").replace(/^(و|ف|ب)/, "");
const STOP = new Set(["عليه", "السلام", "عبد", "ابو", "ام", "بن", "ابن", "في", "من", "على", "و"]);

const problems = { floor: [], dupKey: [], dupQ: [], leak: [], binary: [], answerCap: [], audio: [] };
const seenQ = new Map(); // normalized question → "cat tier"
let total = 0, audioTotal = 0;

for (const [id, cat] of Object.entries(BANK)) {
  const answerCount = new Map();
  const keys = new Set();
  const counts = [];
  for (const tier of [200, 400, 600]) {
    const list = cat[tier] || [];
    counts.push(list.length);
    if (list.length < FLOOR) problems.floor.push(`${id} ${tier}: ${list.length} < ${FLOOR}`);
    for (const e of list) {
      total++;
      const key = `${norm(e.q)}|${norm(e.a)}`;
      if (keys.has(key)) problems.dupKey.push(`${id} ${tier}: ${e.q} → ${e.a}`);
      keys.add(key);
      const na = norm(e.a);
      answerCount.set(na, (answerCount.get(na) || 0) + 1);
      if (e.previewUrl) {
        audioTotal++;
        if (!e.artist) problems.audio.push(`${id} ${tier}: audio without artist → ${e.a}`);
        continue;
      }
      const nq = norm(e.q);
      if (seenQ.has(nq)) problems.dupQ.push(`${id} ${tier} ≈ ${seenQ.get(nq)}: ${e.q}`);
      else seenQ.set(nq, `${id} ${tier}`);
      // Leak: whole answer phrase inside the question, or every meaningful answer word present.
      const qWords = new Set(nq.split(" ").map(stem));
      // Numbers always count as meaningful: "عيار 24" is not leaked by a question that only says "عيار".
      const aWords = na.split(" ").map(stem).filter((w) => (w.length >= 3 || /\d/.test(w)) && !STOP.has(w));
      const phraseLeak = na.length >= 3 && ` ${nq} `.includes(` ${na} `);
      const wordLeak = aWords.length > 0 && aWords.every((w) => qWords.has(w));
      if (phraseLeak || wordLeak) problems.leak.push(`${id} ${tier}: ${e.q} → ${e.a}`);
      if (/^هل\s.+\sأم\s.+[؟?]$/.test(e.q.trim())) problems.binary.push(`${id} ${tier}: ${e.q}`);
    }
  }
  for (const [a, n] of answerCount) if (n > 3) problems.answerCap.push(`${id}: answer "${a}" used ${n}×`);
  console.log(id.padEnd(20), counts.map((c) => String(c).padStart(4)).join(""));
}

if (NET) {
  const urls = Object.entries(BANK).flatMap(([id, c]) => [200, 400, 600].flatMap((t) => (c[t] || []).filter((e) => e.previewUrl).map((e) => ({ id, t, e }))));
  let i = 0;
  const worker = async () => {
    while (i < urls.length) {
      const { id, t, e } = urls[i++];
      try {
        const res = await fetch(e.previewUrl, { method: "HEAD" });
        if (!res.ok) problems.audio.push(`${id} ${t}: HTTP ${res.status} → ${e.a}`);
      } catch (err) { problems.audio.push(`${id} ${t}: ${err.message} → ${e.a}`); }
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
  console.log(`checked ${urls.length} audio previews`);
}

console.log(`\n${total} entries (${audioTotal} audio) across ${Object.keys(BANK).length} categories`);
let bad = 0;
for (const [kind, list] of Object.entries(problems)) {
  if (!list.length) continue;
  bad += list.length;
  console.log(`\n## ${kind} (${list.length})`);
  list.forEach((p) => console.log("  " + p));
}
console.log(bad ? `\n${bad} issue(s) to review` : "\nall checks passed");
process.exit(problems.floor.length || problems.dupKey.length ? 1 : 0);

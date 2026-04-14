// Finds CLEAR answer leaks — full answer (or all significant answer words) appear in question.
import fs from "node:fs";

const files = [
  "src/App.jsx",
  "src/newCategoriesBank.js",
  "src/megaNewExpansions.js",
  "src/triviaExpansions.js",
  "src/triviaMegaExpansions.js",
  "src/triviaUltraExpansions.js",
  "src/triviaMinimums.js",
  "src/triviaTierBalanceExpansions.js",
  "src/triviaTierParityExpansions.js",
  "src/triviaTierFinalParityExpansions.js",
  "src/triviaTierFinalTopoffExpansions.js",
  "src/moreTriviaExpansions.js",
  "src/questionRefinements.js",
];

// Generic terms that can appear in Q and A without being a leak
const GENERIC = new Set([
  "the","a","an","of","is","it","in","on","at","to","and","or","for","with","by","his","her","its","their",
  "ocean","sea","lake","river","mountain","mountains","island","islands","desert","forest","valley",
  "empire","kingdom","dynasty","republic","state","country","city","town","village","state","province",
  "war","battle","revolution","treaty","agreement","project","operation","mission","campaign",
  "first","second","third","fourth","fifth","last","final",
  "name","title","date","year","century","era","age","period","day",
  "color","size","number","time","place","type","form","kind","way",
  "show","movie","film","book","song","album","game","series","season","episode",
  "character","player","team","group","band","family","house","clan",
  "one","two","three","four","five","six","seven","eight","nine","ten","many","some","few","all","most",
  "major","minor","large","small","tall","short","long","big","little","main","prime","key",
  "royal","grand","great","little","new","old","young",
  "what","which","who","when","where","why","how","does","this","that","these","those",
  "are","was","were","have","has","had","will","can","could","should","would","may","might",
  "said","called","known","named","made","born","died","built","created","wrote","wrote","directed","produced","voiced","played",
]);

function tokens(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
}
function sigWords(s) {
  return tokens(s).filter(w => w.length >= 4 && !GENERIC.has(w));
}

let leaks = [];
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const re1 = /\{q:"([^"]*)",a:"([^"]*)"/g;
    const re2 = /\["([^"]*)",\s*"([^"]*)"\]/g;
    for (const re of [re1, re2]) {
      let m;
      while ((m = re.exec(line)) !== null) {
        const q = m[1];
        const a = m[2];
        if (!q || !a) continue;
        if (q.length < 12) continue;
        if (/^(clip|audio clip|guess from|guess the)/i.test(q)) continue;

        const aSig = sigWords(a);
        if (aSig.length === 0) continue;
        const qTokens = new Set(tokens(q));

        // LEAK CONDITION: ALL significant answer words appear in question
        const allPresent = aSig.every(w => qTokens.has(w));
        if (allPresent) {
          leaks.push({ file: f, line: i + 1, q, a, words: aSig });
        }
      }
    }
  }
}

console.log(`Found ${leaks.length} clear leaks:\n`);
for (const l of leaks) {
  console.log(`${l.file}:${l.line}  "${l.q}" => "${l.a}"`);
}

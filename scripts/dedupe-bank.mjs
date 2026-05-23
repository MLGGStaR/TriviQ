// Two passes:
//   1) Cross-cat partition: who_influencer must NOT contain anyone already in who_artist
//      or who_footballer. Same person belongs in exactly one image cat.
//   2) Same-answer cap: within any cat-tier, no more than 3 entries may share the same
//      answer. Excess entries (chosen randomly from the duplicates) get blacklisted so
//      the user stops seeing the same answer 6-9 times in a row.
import fs from "node:fs";
import path from "node:path";

const BANKS = [
  "triviaExpansions","triviaMinimums","triviaMegaExpansions","triviaUltraExpansions",
  "triviaTierBalanceExpansions","triviaTierParityExpansions","triviaTierFinalParityExpansions",
  "triviaTierFinalTopoffExpansions","newCategoriesBank","megaNewExpansions","moreTriviaExpansions",
  "newCategoriesPack2","logoCategoriesBank","qualityBackfill",
];

function norm(s){
  return String(s||"").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim();
}

// Build per-cat entry index from all source files
const byCat = {};
for(const f of BANKS){
  const mod = await import(`../src/${f}.js`);
  const bank = mod.default || {};
  for(const [cat, obj] of Object.entries(bank)){
    if(!byCat[cat]) byCat[cat] = {200:[],400:[],600:[]};
    for(const t of [200,400,600]){
      for(const e of obj?.[t]||[]){
        byCat[cat][t].push({q:e.q,a:e.a,wiki:e.wiki,_src:f});
      }
    }
  }
}
// Also parse RAW_BANK from App.jsx for inline cats
const app = fs.readFileSync("src/App.jsx","utf8");
const catRe = /^  ([a-z_]+):\{([\s\S]*?)^  \},?$/gm;
let m;
while((m = catRe.exec(app)) !== null){
  const id = m[1];
  const body = m[2];
  if(!byCat[id]) byCat[id]={200:[],400:[],600:[]};
  for(const t of [200,400,600]){
    const tierRe = new RegExp("\\b"+t+":\\[([\\s\\S]*?)\\](?=,|\\s*\\})");
    const tm = body.match(tierRe);
    if(!tm) continue;
    const itemRe = /\{q:"((?:[^"\\]|\\.)*)",a:"((?:[^"\\]|\\.)*)"(?:,wiki:"((?:[^"\\]|\\.)*)")?/g;
    let im;
    while((im = itemRe.exec(tm[1])) !== null){
      byCat[id][t].push({q:im[1],a:im[2],wiki:im[3],_src:"App.jsx"});
    }
  }
}

const removals = []; // {cat,q,a,reason}

// PASS 1: who_influencer must not duplicate who_artist or who_footballer (by wiki).
const artistWikis = new Set();
const footballerWikis = new Set();
for(const t of [200,400,600]){
  for(const e of byCat.who_artist?.[t]||[]){ if(e.wiki) artistWikis.add(e.wiki); }
  for(const e of byCat.who_footballer?.[t]||[]){ if(e.wiki) footballerWikis.add(e.wiki); }
}
for(const t of [200,400,600]){
  for(const e of byCat.who_influencer?.[t]||[]){
    if(!e.wiki) continue;
    if(artistWikis.has(e.wiki) || footballerWikis.has(e.wiki)){
      removals.push({cat:"who_influencer", q:e.q, a:e.a, reason:`wiki "${e.wiki}" already in who_artist/who_footballer — influencer dedup`});
    }
  }
}

// PASS 2: cap same-answer to 3 per (cat,tier). Pick excess entries to remove (oldest src order kept).
// Track per-cat-tier answer counts; for any (cat,tier,a) where count > 3, mark excess for removal.
for(const [cat, tiers] of Object.entries(byCat)){
  for(const t of [200,400,600]){
    const arr = tiers[t]||[];
    const grouped = new Map();
    for(const e of arr){
      const key = norm(e.a);
      if(!key) continue;
      if(!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(e);
    }
    for(const [key, group] of grouped.entries()){
      if(group.length <= 3) continue;
      // Keep first 3, blacklist the rest
      for(const e of group.slice(3)){
        removals.push({cat, q:e.q, a:e.a, reason:`same-answer cap (>3 entries with answer "${e.a}" in ${cat}/${t})`});
      }
    }
  }
}

console.log(`Cross-cat removals: ${removals.filter(r=>r.reason.startsWith("wiki")).length}`);
console.log(`Same-answer-cap removals: ${removals.filter(r=>r.reason.startsWith("same-answer")).length}`);
console.log(`Total: ${removals.length}`);

// Append to qualityBlacklist
const BL_PATH = "src/qualityBlacklist.js";
const blSrc = fs.readFileSync(BL_PATH,"utf8");
const entries = JSON.parse(blSrc.match(/const entries\s*=\s*(\[[\s\S]*?\n\]);/)[1]);
const keyOf = (e)=>`${e.cat}|${(e.q||"").toLowerCase().trim()}|${(e.a||"").toLowerCase().trim()}`;
const seen = new Set(entries.map(keyOf));
let added = 0;
for(const r of removals){
  const entry = {cat:r.cat, q:r.q, a:r.a, reason:r.reason};
  const k = keyOf(entry);
  if(seen.has(k)) continue;
  seen.add(k);
  entries.push(entry);
  added++;
}
const newSrc = blSrc.replace(/const entries\s*=\s*\[[\s\S]*?\n\];/, `const entries = ${JSON.stringify(entries,null,2)};`);
fs.writeFileSync(BL_PATH, newSrc);
console.log(`Added ${added} to blacklist. Total: ${entries.length}`);

fs.writeFileSync("audit/bank-dedup-removals.json", JSON.stringify({removals},null,2));

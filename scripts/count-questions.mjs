import QE from '../src/triviaExpansions.js';
import QM from '../src/triviaMinimums.js';
import TME from '../src/triviaMegaExpansions.js';
import TUE from '../src/triviaUltraExpansions.js';
import TBE from '../src/triviaTierBalanceExpansions.js';
import TPE from '../src/triviaTierParityExpansions.js';
import TFP from '../src/triviaTierFinalParityExpansions.js';
import TFT from '../src/triviaTierFinalTopoffExpansions.js';
import { QUESTION_REFINEMENT_ADDITIONS as QRA } from '../src/questionRefinements.js';
import NCB from '../src/newCategoriesBank.js';
import MNE from '../src/megaNewExpansions.js';
import MTE from '../src/moreTriviaExpansions.js';
import LCB from '../src/logoCategoriesBank.js';
import EMOJI from '../src/emojiGuessCategories.js';
import MOVIE from '../src/movieScenes.js';
import SONG from '../src/songClips.js';
import SONGADD from '../src/songClipAdditions.js';
import fs from 'node:fs';

const cats = {};
function add(cat, pts, e) {
  if (!e || !e.q) return;
  if (!cats[cat]) cats[cat] = { 200: [], 400: [], 600: [] };
  cats[cat][pts].push(e);
}

// Parse RAW_BANK trivia from App.jsx
const app = fs.readFileSync('src/App.jsx', 'utf8');
// Find each category block: id:{ ... } at the right indent level
const catRe = /^  ([a-z_]+):\{([\s\S]*?)^  \},?$/gm;
let m;
while ((m = catRe.exec(app)) !== null) {
  const id = m[1];
  const body = m[2];
  for (const pts of [200, 400, 600]) {
    const tierRe = new RegExp('\\b' + pts + ':\\[([\\s\\S]*?)\\](?=,|\\s*\\})');
    const tm = body.match(tierRe);
    if (!tm) continue;
    const itemRe = /\{q:"((?:[^"\\]|\\.)*)",a:"((?:[^"\\]|\\.)*)"/g;
    let im;
    while ((im = itemRe.exec(tm[1])) !== null) {
      add(id, pts, { q: im[1], a: im[2] });
    }
  }
}

const banks = [QE, QM, TME, TUE, TBE, QRA, TPE, TFP, TFT, NCB, EMOJI, MNE, MTE, LCB];
banks.forEach(b => {
  Object.entries(b).forEach(([cat, obj]) => {
    [200, 400, 600].forEach(p => {
      if (Array.isArray(obj?.[p])) obj[p].forEach(e => add(cat, p, e));
    });
  });
});

[200, 400, 600].forEach(p => { if (MOVIE[p]) MOVIE[p].forEach(e => add('movie_scenes', p, e)); });
const songsAll = { 200: [...(SONG[200] || []), ...(SONGADD[200] || [])], 400: [...(SONG[400] || []), ...(SONGADD[400] || [])], 600: [...(SONG[600] || []), ...(SONGADD[600] || [])] };
[200, 400, 600].forEach(p => songsAll[p].forEach(e => add('songs', p, e)));

const BAD_Q = /\bsignificance\b|\bdifference between\b|\bdescribe\b|\bexplain\b|\bdeeper theme\b|\bpsychological\b|\breal meaning\b|\bsatire target\b|\bcontribution\b|\bcontroversy\b|\bcosmology\b|\bdeepest lore\b|\bcritical reception\b|\bhistorical accuracy\b|\baccuracy level\b/i;
const MULTIPART_Q = /\band what\b|\band why\b|\band who\b|\bdifference between\b|\bwhat opened it\b/i;

const out = {};
for (const cat of Object.keys(cats).sort()) {
  const counts = { 200: 0, 400: 0, 600: 0 };
  for (const p of [200, 400, 600]) {
    const seen = new Set();
    for (const e of cats[cat][p]) {
      const q = (e.q || '').trim();
      if (!q) continue;
      if (BAD_Q.test(q)) continue;
      if (MULTIPART_Q.test(q)) continue;
      const key = (q + '|' + (e.a || '')).toLowerCase().replace(/\s+/g, ' ').trim();
      if (seen.has(key)) continue;
      seen.add(key);
      counts[p]++;
    }
  }
  out[cat] = { ...counts, total: counts[200] + counts[400] + counts[600] };
}

console.log('category'.padEnd(28), '200'.padStart(5), '400'.padStart(5), '600'.padStart(5), 'total'.padStart(6));
console.log('-'.repeat(56));
let g200 = 0, g400 = 0, g600 = 0;
for (const cat of Object.keys(out)) {
  const v = out[cat];
  g200 += v[200]; g400 += v[400]; g600 += v[600];
  console.log(cat.padEnd(28), String(v[200]).padStart(5), String(v[400]).padStart(5), String(v[600]).padStart(5), String(v.total).padStart(6));
}
console.log('-'.repeat(56));
console.log('TOTAL'.padEnd(28), String(g200).padStart(5), String(g400).padStart(5), String(g600).padStart(5), String(g200 + g400 + g600).padStart(6));

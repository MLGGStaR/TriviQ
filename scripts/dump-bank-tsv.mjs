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
import NCB2 from '../src/newCategoriesPack2.js';
import LCB from '../src/logoCategoriesBank.js';
import EMOJI from '../src/emojiGuessCategories.js';
import MOVIE from '../src/movieScenes.js';
import SONG from '../src/songClips.js';
import SONGADD from '../src/songClipAdditions.js';
import { isBlacklisted } from '../src/qualityBlacklist.js';
import QBACKFILL from '../src/qualityBackfill.js';
import ARABIC from '../src/arabicCategoriesBank.js';
import fs from 'node:fs';
import path from 'node:path';

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
    const itemRe = /\{q:"((?:[^"\\]|\\.)*)",a:"((?:[^"\\]|\\.)*)"(?:,wiki:"((?:[^"\\]|\\.)*)")?/g;
    let im;
    while ((im = itemRe.exec(tm[1])) !== null) {
      add(id, pts, { q: im[1], a: im[2], wiki: im[3] });
    }
  }
}

const banks = [QE, QM, TME, TUE, TBE, QRA, TPE, TFP, TFT, NCB, NCB2, EMOJI, MNE, MTE, LCB, QBACKFILL, ARABIC];
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

// Dump every live question as TSV (cat, tier, q, a, extra) so research agents can grep for duplicates.
// Usage: node scripts/dump-bank-tsv.mjs [outPath]
const outPath = process.argv[2] || 'audit/bank-dump.tsv';
const clean = (s) => String(s ?? '').replace(/[\t\r\n]+/g, ' ').trim();
const rows = ['cat\ttier\tq\ta\textra'];
for (const cat of Object.keys(cats).sort()) {
  for (const p of [200, 400, 600]) {
    for (const e of cats[cat][p]) {
      if (isBlacklisted(cat, e.q || '', e.a || '')) continue;
      rows.push([cat, p, clean(e.q), clean(e.a), clean(e.artist || e.wiki || '')].join('\t'));
    }
  }
}
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, rows.join('\n') + '\n');
console.log('wrote', rows.length - 1, 'rows to', outPath);


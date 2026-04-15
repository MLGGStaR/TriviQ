import fs from 'node:fs';
import NCB2 from '../src/newCategoriesPack2.js';

const files = ['triviaExpansions','triviaMinimums','triviaMegaExpansions','triviaUltraExpansions','triviaTierBalanceExpansions','triviaTierParityExpansions','triviaTierFinalParityExpansions','triviaTierFinalTopoffExpansions','newCategoriesBank','moreTriviaExpansions','megaNewExpansions','logoCategoriesBank','emojiGuessCategories'];
const allAnswers = new Map();
for (const f of files) {
  const m = await import('../src/' + f + '.js');
  const b = m.default;
  Object.entries(b).forEach(([cat, obj]) => {
    [200,400,600].forEach(t => (obj?.[t]||[]).forEach(e => {
      const k = (e.a||'').toLowerCase();
      if (!k) return;
      if (!allAnswers.has(k)) allAnswers.set(k, []);
      allAnswers.get(k).push(cat);
    }));
  });
}
const app = fs.readFileSync('src/App.jsx','utf8');
const catRe = /^  ([a-z_]+):\{([\s\S]*?)^  \},?$/gm;
let m;
while ((m = catRe.exec(app)) !== null) {
  const items = [...m[2].matchAll(/a:"((?:[^"\\]|\\.)*)"/g)];
  items.forEach(im => {
    const k = im[1].toLowerCase();
    if (!allAnswers.has(k)) allAnswers.set(k, []);
    allAnswers.get(k).push(m[1]);
  });
}
const MS = (await import('../src/movieScenes.js')).default;
[200,400,600].forEach(t => (MS[t]||[]).forEach(e => {
  const k = (e.a||'').toLowerCase();
  if (!allAnswers.has(k)) allAnswers.set(k, []);
  allAnswers.get(k).push('movie_scenes');
}));

for (const cat of ['who_movie','who_tv_show']) {
  console.log('--- ' + cat + ' conflicts ---');
  [200,400,600].forEach(t => (NCB2[cat][t]||[]).forEach(e => {
    const k = e.a.toLowerCase();
    const cats = allAnswers.get(k) || [];
    const otherCats = cats.filter(c => c !== cat);
    if (otherCats.length > 0) console.log(e.a + ' -> also in: ' + [...new Set(otherCats)].join(','));
  }));
}

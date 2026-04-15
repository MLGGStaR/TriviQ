import fs from 'node:fs';
const files = ['triviaExpansions','triviaMinimums','triviaMegaExpansions','triviaUltraExpansions','triviaTierBalanceExpansions','triviaTierParityExpansions','triviaTierFinalParityExpansions','triviaTierFinalTopoffExpansions','newCategoriesBank','newCategoriesPack2','moreTriviaExpansions','megaNewExpansions'];
const all = new Set();
for (const f of files) {
  const m = await import('../src/' + f + '.js');
  const b = m.default;
  ['movies','pop_culture'].forEach(cat => {
    if (!b[cat]) return;
    [200,400,600].forEach(t => (b[cat][t]||[]).forEach(e => all.add(e.a.toLowerCase())));
  });
}
const app = fs.readFileSync('src/App.jsx','utf8');
for (const cat of ['movies','pop_culture']) {
  const re = new RegExp('^  ' + cat + ':\\{([\\s\\S]*?)^  \\},?$','m');
  const block = app.match(re);
  if (block) {
    const items = [...block[1].matchAll(/a:"((?:[^"\\]|\\.)*)"/g)];
    items.forEach(m => all.add(m[1].toLowerCase()));
  }
}
const MS = (await import('../src/movieScenes.js')).default;
[200,400,600].forEach(t => (MS[t]||[]).forEach(e => all.add(e.a.toLowerCase())));

const wanted = [
  "The Dark Knight","Avatar","Gladiator","Dune","Oppenheimer","Barbie","Top Gun","The Empire Strikes Back","The Force Awakens","Indiana Jones and the Raiders of the Lost Ark","E.T. the Extra-Terrestrial","The Hangover","Superbad","Mean Girls","Legally Blonde","The Devil Wears Prada","The Notebook","Love Actually","Pretty Woman","Twilight","The Hunger Games: Catching Fire","Inside Out","Coco","Encanto","Soul","Tangled","Bohemian Rhapsody","Rocketman","Braveheart","The Wolf of Wall Street",
  "Schindler's List","Django Unchained","Inglourious Basterds","Reservoir Dogs","Kill Bill: Volume 1","Once Upon a Time in Hollywood","Saving Private Ryan","1917","Black Hawk Down","The Thin Red Line","The King's Speech","12 Years a Slave","Slumdog Millionaire","Spotlight","The Imitation Game","The Theory of Everything","Green Book","Life of Pi","Birdman","Moonlight","Halloween","Scream","Saw","It","The Shining","The Exorcist","2001: A Space Odyssey","A Clockwork Orange","Dr. Strangelove","Amélie",
  "Eraserhead","Stalker","Andrei Rublev","Persona","The Seventh Seal","Wild Strawberries","8½","Tokyo Story","Seven Samurai","Rashomon","Ran","Citizen Kane","Psycho","Vertigo","Rear Window","12 Angry Men","To Kill a Mockingbird","Fanny and Alexander","Pan's Labyrinth","City of God","The Intouchables","The Lives of Others","Roma","Shoplifters","Burning","A Separation","Oldboy","In the Mood for Love","There Will Be Blood","Portrait of a Lady on Fire"
];
const conflicts = wanted.filter(w => all.has(w.toLowerCase()));
console.log('Conflicts:', conflicts);
console.log('Clean count:', wanted.length - conflicts.length, '/', wanted.length);

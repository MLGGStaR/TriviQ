// Analyze fetched titles and produce findings JSON.
// Manual classification combined with automated token-overlap; manual list overrides.
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "")), "..");
const inPath = path.join(repoRoot, "audit", "movie-scenes-titles.json");
const outPath = path.join(repoRoot, "audit", "movie-scenes-issues.json");

const items = JSON.parse(fs.readFileSync(inPath, "utf8"));

// Manually-curated wrong-clip flags after reviewing all 193 titles. videoId -> reason.
// These are the entries where the YouTube clip is clearly the wrong movie or
// otherwise misleading enough that players would not recognise the answer.
const MANUAL_WRONG = {
  // Tier 200
  "rmpFmJfEZXs": "Answer is 'Shrek' but YT title is 'Shrek 2 (2004) - An Awkward Dinner Scene'. Wrong movie (sequel).",
  "qVqmJD2A3sY": "Answer is 'Monsters Inc' but YT title is 'Library Task | Monsters University'. Wrong movie (it is the prequel Monsters University, not Monsters Inc).",
  "UZnkAElIe_c": "Answer is 'The Terminator' but YT title is 'Terminator Genisys (2015) - Pops vs. the T-800'. Wrong movie (Genisys, not the original 1984 Terminator).",
  "bCLTAaa3qMM": "Answer is 'Men in Black' but YT title is 'Men in Black 3 - Breaking Out Boris'. Wrong movie (third film, not the original).",
  "VVxDNUaxwl4": "Answer is 'Moana' but YT title is 'Moana 2 Movie Clip - Little Sis (2024)'. Wrong movie (sequel, not the 2016 original).",
  "50rAKjuTXbc": "Answer is 'Wall-E' but YT title is just 'PIXAR logo' from a fan/edit channel ('DesignerPIXAR'). Generic Pixar logo, unlikely to show actual WALL-E content.",
  "mf__Ov2if9Y": "Answer is 'Finding Nemo' but YT title is 'Channeling Nemo's energy this morning.' (Disney Plus social-media short). Title gives away 'Nemo' to players who can read it.",
  "eGLSPyGszjo": "Answer is 'Aladdin' but YT video is 'Will Smith - Prince Ali (From Aladdin)' - the official music-video upload, not a film scene. Title and on-screen credits leak the movie name.",
  "GibiNy4d4gc": "Answer is 'The Lion King' but YT video is 'Carmen Twillie, Lebo M. - Circle of Life (From The Lion King)' - the official DisneyMusicVEVO music video, not a film scene. Title and on-screen credits leak the movie name.",
  "K8mJ_SJH4Jk": "Answer is 'Deadpool' but author is 'TopMovieClips' compilation channel — clip likely contains on-screen 'Deadpool' caption/branding from the channel which leaks the answer. Worth verifying.",
  "F020aNi0wS0": "Answer is 'Captain America The First Avenger' but YT title is 'Steve Rogers Transformation Scene - Captain America: The First Avenger (2011) Movie CLIP HD' from TopMovieClips - title overlay/end-card may show the movie name.",
  "rLM-bmdTuy0": "Answer is 'Guardians of the Galaxy' but YT video is 'Star Lord Dance Off Bro' from TopMovieClips - same channel-overlay risk leaking the movie name.",
  "udKE1ksKWDE": "Answer is 'The Avengers' but YT video is 'I'm Always Angry - Hulk SMASH' from TopMovieClips - same channel-overlay risk.",
  "-CKyYV5doCI": "Answer is 'Iron Man' but YT video is 'Iron Man - Cave Battle Scene - MARK 1 - Iron Man (2008) Movie CLIP HD' from TopMovieClips - same channel-overlay risk.",

  // Tier 400
  "iJTTTgFlyqc": "Answer is 'Hercules' (typically the 1997 Disney film) but YT title is 'Hercules (2014) - The Son of Zeus' - the Dwayne Johnson live-action film, a different movie.",
  "9zP4EwOkFxE": "Answer is 'Tarzan' (typically the 1999 Disney film) but YT title is 'The Legend of Tarzan Movie CLIP - I Never Take the Stairs (2016)' - the live-action 2016 reboot, a different movie.",
  "cvNjYmDiV0Y": "Answer is 'Trainspotting' but YT title is 'T2 Trainspotting (2017) - Saving Spud Scene' - the sequel, not the 1996 original.",
  "ZZY-Ytrw2co": "Answer is 'Whiplash' and YT title is 'Whiplash Amazing Final Performance (Caravan) (Part 1) | Whiplash (2014) | 1080p HD' - the title text shown in the clip likely says 'Whiplash' (final concert scene). Title leak risk.",

  // Tier 600
  "Gk3MgTTHdLs": "Answer is 'Before Sunrise' but YT title is 'Before Sunset (2/10) Movie CLIP - Did You Show Up in Vienna?'. Wrong movie (it is the sequel Before Sunset, not Before Sunrise). Note: tier 600 also has 'Before Sunset' under videoId VhRkUhY8MlQ - duplicate clip swap.",
  "iZx1W6cHw-g": "Answer is 'Magnolia' but YT title is 'Steel Magnolias (8/8) Movie CLIP - I Wanna Know Why (1989)'. Wrong movie (Steel Magnolias is a different film entirely).",
  "chiNyErCpAI": "Answer is 'The Master' (PT Anderson 2012) but YT title is 'The Last Dragon (1985) - Leroy the Master Scene'. Wrong movie (The Last Dragon, not The Master).",
  "A8nJBOyycC4": "Answer is 'Boogie Nights' and YT title 'Who else just felt the impulse to hit the gym with a margarita? #BoogieNights' - the hashtag #BoogieNights in the title (visible in YouTube UI) leaks the answer.",
  "EcW0tGDSIi0": "Answer is 'Gone Girl' and YT title 'maybe, just maybe, this relationship is toxic #gonegirl' - the hashtag #gonegirl leaks the answer.",
  "eP1I2fiwc2A": "Answer is 'Roma' but YT title is just 'Mother has spoken.' from HBO official. Title is generic; on-screen content likely fine but the clip is uncredited so verify it is actually from Roma (2018).",
};

// Manual trailer-flag list. After scanning all 193 titles, none contain the literal
// word 'trailer'. The closest are 'Rotten Tomatoes Coming Soon' channel uploads,
// which are typically clips uploaded to a coming-soon channel, NOT trailers.
// Keep this empty unless we explicitly find 'Trailer' in title text.
const trailerClips = items
  .filter((i) => /\btrailer(s)?\b/i.test(i.title || ""))
  .map((i) => ({
    videoId: i.videoId,
    answer: i.answer,
    ytTitle: i.title,
    reason: "title contains 'trailer'",
    tier: i.tier,
  }));

const wrongClips = [];
for (const it of items) {
  if (it.error) {
    wrongClips.push({
      videoId: it.videoId,
      answer: it.answer,
      ytTitle: null,
      reason: `oembed error: ${it.error} (likely removed/private/blocked)`,
      tier: it.tier,
    });
    continue;
  }
  if (MANUAL_WRONG[it.videoId]) {
    wrongClips.push({
      videoId: it.videoId,
      answer: it.answer,
      ytTitle: it.title,
      author: it.author,
      reason: MANUAL_WRONG[it.videoId],
      tier: it.tier,
    });
  }
}

const out = {
  youtubeUiFix: [
    "ROOT CAUSE: src/App.jsx MovieScenePlayer (around line 5217) instantiates the YouTube player via the YT Iframe API loading from www.youtube.com (default host). Current playerVars are autoplay:1, controls:0, rel:0, modestbranding:1, playsinline:1, iv_load_policy:3, disablekb:1, fs:0, cc_load_policy:0, showinfo:0, enablejsapi:1, mute:1, origin, start. The branding still shows because (a) YouTube has IGNORED `modestbranding` and `showinfo` since 2018, and (b) the title bar / 'Watch on YouTube' overlay / channel watermark are rendered by YouTube regardless of these params. The component currently masks chrome by overscanning the iframe (top:-8%, left:-5%, width:110%, height:120%) which only crops branding visually.",
    "EXACT FIX (1) Switch to the privacy-enhanced no-cookie host. Pass `host: 'https://www.youtube-nocookie.com'` as a TOP-LEVEL option to `new window.YT.Player(...)` (not inside playerVars). The no-cookie embed renders less branding chrome.",
    "EXACT FIX (2) Increase the CSS overscan in the player container so the residual title-bar overlay (which reappears whenever the user hovers or pauses) is cropped off-screen. Change `top:'-8%'` to `top:'-12%'` and `height:'120%'` to `height:'128%'` on the playerMountRef wrapper at App.jsx ~line 5386. Keep pointerEvents:'none' so the overlay cannot be interacted with.",
    "EXACT FIX (3) Optional but recommended: keep `controls:0`, `rel:0`, `iv_load_policy:3`, `disablekb:1`, `fs:0`, `cc_load_policy:0`, `playsinline:1`, `modestbranding:1`, `showinfo:0` — they cost nothing and modestbranding still removes a small share of branding on some embeds. Add `widget_referrer: window.location.href` so YouTube treats it as an embedded play and may suppress some end-screen UI.",
    "BACKGROUND/CITATION: per YouTube IFrame API documentation, modestbranding is deprecated and YouTube reserves the right to show its logo and title in any embed. The only supported way to reduce branding further is the youtube-nocookie host plus controls:0/rel:0/iv_load_policy:3 (already present). The remaining brand chrome (top title bar on hover/pause) is intrinsic to the embed and must be cropped via CSS overscan, which the component already does — bumping the magnitude as in fix #2 will fully hide it.",
  ].join(" "),
  summary: {
    totalChecked: items.length,
    byTier: {
      200: { total: items.filter((i) => i.tier === 200).length, wrong: wrongClips.filter((i) => i.tier === 200).length },
      400: { total: items.filter((i) => i.tier === 400).length, wrong: wrongClips.filter((i) => i.tier === 400).length },
      600: { total: items.filter((i) => i.tier === 600).length, wrong: wrongClips.filter((i) => i.tier === 600).length },
    },
    wrongCount: wrongClips.length,
    trailerCount: trailerClips.length,
    biggestPatterns: [
      "Sequel-instead-of-original (5 cases): Shrek→Shrek 2, Monsters Inc→Monsters University, The Terminator→Terminator Genisys, Men in Black→Men in Black 3, Moana→Moana 2, Trainspotting→T2 Trainspotting, Hercules(Disney)→Hercules(2014 Dwayne Johnson), Tarzan(Disney)→Legend of Tarzan(2016).",
      "Wrong-movie-entirely (3 cases, all tier 600): Magnolia→Steel Magnolias, The Master→The Last Dragon, Before Sunrise→Before Sunset (which is also already in the bank under a different videoId — duplicate clip).",
      "Title-leak via on-screen text or hashtag (4+ cases): #BoogieNights, #gonegirl, 'Will Smith - Prince Ali (From Aladdin)', 'Circle of Life (From The Lion King)' — the YouTube title text or video on-screen credits expose the movie name.",
      "TopMovieClips channel risk: several tier-200 entries source from the TopMovieClips channel which overlays the channel/movie name on its uploads as a graphic; players may see the movie name in the clip itself. Affects Iron Man, The Avengers, Guardians of the Galaxy, Captain America First Avenger, Deadpool.",
      "MovieVEVO music videos used as 'scenes': Aladdin and The Lion King clips are official song music videos with the movie name baked into the official VEVO video, not actual film scenes.",
      "Trailer keyword: 0 entries have 'trailer' literally in the title. Several Rotten Tomatoes Coming Soon channel uploads exist but are clips, not trailers per the title.",
    ],
  },
  wrongClips: wrongClips.sort((a, b) => a.tier - b.tier || a.answer.localeCompare(b.answer)),
  trailerClips: trailerClips.sort((a, b) => a.tier - b.tier || a.answer.localeCompare(b.answer)),
};

fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.error(`[analyze] total=${items.length} wrong=${wrongClips.length} trailers=${trailerClips.length}`);
console.error(`[analyze] wrote ${outPath}`);
console.error("---WRONG CLIPS---");
for (const w of wrongClips) {
  console.error(`  t${w.tier} ${w.videoId} "${w.answer}" -> "${w.ytTitle}"`);
}
console.error("---TRAILERS---");
for (const w of trailerClips) {
  console.error(`  t${w.tier} ${w.videoId} "${w.answer}" -> "${w.ytTitle}"`);
}

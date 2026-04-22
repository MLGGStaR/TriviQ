// Audit entries where the answer does not actually answer the question.
// Focus on real logic bugs: answer is wrong TYPE or describes different fact.
import fs from "node:fs";

const sourceFiles = [
  "qualityBackfill",
  "megaNewExpansions",
  "moreTriviaExpansions",
  "newCategoriesBank",
  "newCategoriesPack2",
  "triviaExpansions",
  "triviaMegaExpansions",
  "triviaUltraExpansions",
  "triviaTierBalanceExpansions",
  "triviaTierParityExpansions",
  "triviaTierFinalParityExpansions",
  "triviaTierFinalTopoffExpansions",
  "triviaMinimums",
];

const entries = [];

for (const f of sourceFiles) {
  try {
    const mod = await import(`../src/${f}.js`);
    const bank = mod.default || {};
    for (const [catId, catData] of Object.entries(bank)) {
      for (const t of [200, 400, 600]) {
        const rows = Array.isArray(catData?.[t]) ? catData[t] : [];
        rows.forEach((e) => {
          if (e?.q && e?.a) entries.push({ cat: catId, tier: t, q: e.q, a: e.a, file: f });
        });
      }
    }
  } catch (e) {
    console.error("failed to load", f, e.message);
  }
}

const app = fs.readFileSync("src/App.jsx", "utf8");
const catRe = /^  ([a-z_]+):\{([\s\S]*?)^  \},?$/gm;
let m;
while ((m = catRe.exec(app)) !== null) {
  const id = m[1];
  const body = m[2];
  for (const t of [200, 400, 600]) {
    const tierRe = new RegExp("\\b" + t + ":\\[([\\s\\S]*?)\\](?=,|\\s*\\})");
    const tm = body.match(tierRe);
    if (!tm) continue;
    const objRe = /\{\s*q:\s*"((?:[^"\\]|\\.)*)"\s*,\s*a:\s*"((?:[^"\\]|\\.)*)"/g;
    let om;
    while ((om = objRe.exec(tm[1])) !== null) {
      entries.push({ cat: id, tier: t, q: om[1], a: om[2], file: "App" });
    }
  }
}

console.error(`Loaded ${entries.length} entries`);

const broken = [];
const push = (e, reason) => broken.push({ cat: e.cat, tier: e.tier, q: e.q, a: e.a, reason, file: e.file });

const hasNumber = (s) => /\b\d+\b/.test(s);
const numWord = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|dozen|pair|couple|few|several|many|countless|multiple|zero|single|double|triple|twin|twins|quintuplet|octuplet)\b/i;
const wordCount = (s) => s.trim().split(/\s+/).length;
// Proper noun: leading capital letter word, or ALL CAPS (e.g. DUBU, PSY, CRM)
// Also allow C++, F#, C#, .NET (tech names) and digit-containing names
const hasProperNoun = (s) => /\b[A-Z][A-Za-z'\.\-]{0,}\b/.test(s) || /\b[A-Z]{2,}\b/.test(s) || /[A-Z]\+\+|[A-Z]#|\.[A-Z]+/.test(s);

for (const e of entries) {
  const q = e.q;
  const a = e.a.trim();
  const ql = q.toLowerCase();
  const al = a.toLowerCase();

  // ---- 0) ABSOLUTE DODGE: answer is a non-answer like "None iconic", "Unknown", etc ----
  // These are catastrophic: question asks for specific info but answer says "doesn't exist"
  const dodgePatterns = [
    /^none\s+(iconic|specific|specifically|famous|real|named|specified|prominent|official|revealed|explicit|canonical|known|notable|important|exterior)\b/i,
    /^no\s+(specific|canonical|official|fixed|iconic|real|actual)\s+\w+/i,
    /^(unknown|unspecified|unclear)\s*(author|name|character|title|identity|value|number|amount|location|place|year|date)?$/i,
    /^not\s+(specified|named|revealed|given|shown|stated|defined|explicitly|really)\b/i,
    /^never\s+(named|specified|revealed|shown|stated|mentioned|explicitly)\b/i,
    /^(nobody|no\s+one)\s+(specific|specifically|in particular)\b/i,
    /^(varies|it varies|depends|it depends)\b/i,
    /^(multiple|several|various|many)$/i,
    /^there\s+(isn't|is no|are no|aren't)\s+/i,
    /\bhas\s+no\s+(revealed|canonical|specific|official|known|established|named|stated|given)\s/i,
    /\bdoesn't\s+(go|have|get|do|name|reveal|show|state)\b/i,
    /\bdon't\s+(go|have|get|name|reveal)\b/i,
    /\bnever\s+explicitly\b/i,
    /\bno\s+one\s+(specific|specifically|in particular|named|revealed)/i,
  ];
  let dodge = false;
  for (const dp of dodgePatterns) {
    if (dp.test(a)) {
      push(e, `answer is a dodge/non-answer: "${a}"`);
      dodge = true;
      break;
    }
  }
  if (dodge) continue;

  // ---- 0c) Question asks WHO (person) but answer starts "It has a..." or "It is a..." ----
  // e.g. Q: "Who was the original owner of the Elder Wand's phoenix feather core?" A: "It has a Thestral tail hair core"
  if (/^(who|which (wizard|hero|villain|actor|actress|character|person|man|woman|player|artist|king|queen))/i.test(ql)) {
    if (/^it\s+(has|contains|uses|was|is|takes|shows|includes|features)\s/i.test(a)) {
      push(e, "asked 'who/which person', answer starts 'It has/is/...' (not a person)");
      continue;
    }
  }

  // ---- 0d) Question asks "What X" for a specific noun (vehicle, instrument, restaurant, dog's name),
  // answer is pronoun + verb phrase that restates question's subject instead of naming it ----
  if (/^what (vehicle|instrument|restaurant|street|address|color|song|dog|horse|pet|nickname|code|phrase|word|catchphrase|name|title|object|item|weapon|food|drink|meal|dish|movie|film|show|episode|book|planet|country|city|state|team|band|band|tool|device|disease|illness|disorder|symptom|album|season|year|date|time|job|profession|occupation|family|team|company|organization|network|channel|school|subject|class|lesson|topic|game|sport|hobby|language|letter|number|amount|quantity|size|height|weight|age|rank|title|role|position) /i.test(ql)) {
    if (/^(they|he|she|it|this|that|these|those)\s+(crawl|walk|run|leave|go|come|arrive|return|appear|become|goes|goes to|give|gives|drives|drive|grab|grabs|jump|jumps|move|moves|takes|takes|chase|chases|meet|meets|eat|eats|drink|drinks|wear|wears)\b/i.test(a)) {
      push(e, "asked 'what <noun>', answer uses pronoun + verb, doesn't name it");
      continue;
    }
  }

  // ---- 0b) ANSWER CONTRADICTS QUESTION PREMISE ----
  // e.g. Q: "What is Ragnar's eldest son who is blind initially?" A: "Ivar is paralyzed, not blind"
  // Only flag if the question does NOT itself contain "not" (which would be asking for a negation)
  // and the answer uses "X, not Y" where Y is a word in the question
  if (!/\bnot\b/i.test(ql)) {
    const m1 = a.match(/\b(?:is|was|are|were)\s+([A-Z]?[a-z]+),?\s*not\s+([a-z]+)\b/i);
    if (m1) {
      const wrongWord = m1[2];
      // Only flag if the denied word appears in question
      if (new RegExp(`\\b${wrongWord}\\b`, "i").test(ql)) {
        push(e, `answer denies a premise word from question ("${wrongWord}")`);
        continue;
      }
    }
  }

  // ---- 1) YEAR questions: must contain digits ----
  if (/\b(what year|in what year|in which year|which year)\b/i.test(ql)) {
    if (!/\d/.test(a)) {
      push(e, "asked for year, answer has no digits");
      continue;
    }
  }

  // ---- 2) HOW MANY (expects number) ----
  if (/\bhow many\b/i.test(ql)) {
    if (!hasNumber(a) && !numWord.test(al)) {
      push(e, "asked 'how many', answer has no number/quantity");
      continue;
    }
  }

  // ---- 3) HOW LONG (expects duration) ----
  if (/\bhow long\b/i.test(ql)) {
    if (!hasNumber(a) && !numWord.test(al) && !/\b(forever|decade|decades|century|centuries|years|months|weeks|days|hours|minutes|seconds|lifetime|eternity)\b/i.test(al)) {
      push(e, "asked 'how long', answer has no duration");
      continue;
    }
  }

  // ---- 4) HOW OLD ----
  if (/\bhow old\b/i.test(ql)) {
    if (!hasNumber(a) && !numWord.test(al)) {
      push(e, "asked 'how old', answer has no age");
      continue;
    }
  }

  // ---- 5) HOW TALL / HOW FAST / HOW HIGH / HOW DEEP ----
  // Skip if "how X" appears inside quotes (probably part of title like 'How Far I'll Go')
  if (/\bhow (tall|fast|high|deep|wide|far|big|heavy|short)\b/i.test(ql) && !/'[^']*how [^']*'/i.test(q) && !/"[^"]*how [^"]*"/i.test(q)) {
    if (!hasNumber(a) && !numWord.test(al)) {
      push(e, "asked 'how <measure>', answer has no measurement");
      continue;
    }
  }

  // ---- 6) WHO + action verb: need person name ----
  const whoActionVerb = /^who\s+(founded|created|invented|wrote|authored|directed|painted|discovered|built|designed|composed|sang|starred|won|led|killed|married|signed|developed|produced|coached|owned|captained|managed|established|voiced|portrayed|portrays|plays|played|forms|formed|ruled|rules|assassinated|shot|drew|illustrated|filmed|animated|scripted|edited|recorded|dubbed|choreographed|funded|financed|sponsored|hosts|hosted|narrates|narrated|delivered|gave|said|spoke)\b/i;
  if (whoActionVerb.test(ql)) {
    if (!hasProperNoun(a)) {
      push(e, "asked 'who <action>', answer has no named person");
      continue;
    }
  }

  // ---- 7) Mismatched verb for "founded" questions ----
  // Core user example: asked WHO FOUNDED → answer says WHO CAPTAINS
  if (/\b(founded|founder of|create[ds]?|invented|inventor of|established|built|designed)\b/i.test(ql)) {
    if (/\b(captains?|leads?|manages?|coaches?|runs?)\s+(them|it|the team|the band|the group|the squad)\b/i.test(a)) {
      push(e, "answer describes captaincy/leadership instead of founding");
      continue;
    }
  }

  // ---- 8) "Who is/was X?" followed by proper noun name (this is actually fine) ----
  // But if it's "Who is the founder/creator/author/president/captain of Y" need a name
  if (/^who (is|was|are|were) (the |an |a )?(founder|creator|inventor|author|writer|director|painter|discoverer|builder|designer|composer|host|ceo|president|leader|head|chairman|captain|manager|coach|owner|protagonist|antagonist|villain|narrator|voice actor)\b/i.test(ql)) {
    if (!hasProperNoun(a)) {
      push(e, "asked 'who is the <role>', answer has no named person");
      continue;
    }
  }

  // ---- 9) "Who plays X" — actor name expected ----
  if (/^(who plays|who played|who portrays|who portrayed|who voices|who voiced|who stars|who starred) /i.test(ql)) {
    if (!hasProperNoun(a)) {
      push(e, "asked for actor/voice, answer has no named person");
      continue;
    }
  }

  // ---- 10) Capital city ----
  if (/^what (is|was)? ?the capital (of|city of)/i.test(ql)) {
    if (!hasProperNoun(a)) {
      push(e, "asked for capital city, answer has no named place");
      continue;
    }
  }

  // ---- 11) WHICH + action asking for a named entity, answer contains role mismatch ----
  if (/^which\s+\w+.*\b(founded|created|invented|wrote|directed|established|formed|built|designed|composed|painted|discovered|won|assassinated|married|defeated|signed|coached|ruled)\b/i.test(ql)) {
    if (/\b(captains?|leads?|manages?|coaches?|owns?|runs?|represents?|appears? in|plays? for)\s+(them|it|the team|the group|the squad|the band)\b/i.test(a)) {
      push(e, "answer describes a different role than asked");
      continue;
    }
    // Answer without any proper noun is suspicious
    if (!hasProperNoun(a)) {
      push(e, "asked 'which <thing> <action>', answer has no named entity");
      continue;
    }
  }

  // ---- 12) "When did X happen" — expects date/year/period ----
  if (/^when (did|was|were) /i.test(ql)) {
    if (!/\d/.test(a) && !/\b(century|decade|era|ago|ancient|medieval|renaissance|victorian|edwardian|roman|greek|egyptian|modern|yesterday|today|tomorrow|morning|afternoon|evening|night|before|after|during|bronze|iron|stone)\b/i.test(al) && wordCount(a) > 4) {
      push(e, "asked 'when', answer has no time reference");
      continue;
    }
  }

  // ---- 13) Questions explicitly asking for a specific noun that the answer lacks ----
  // "Which planet...?" A must mention a planet name
  if (/^which planet\b/i.test(ql)) {
    if (!/\b(Mercury|Venus|Earth|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Sun|Moon)\b/.test(a) && !hasProperNoun(a)) {
      push(e, "asked 'which planet', answer has no planet name");
      continue;
    }
  }

  // ---- 14) Answer starts with "It was/marked/symbolizes" but question asked for WHO/WHAT specific ----
  if (/^(who|which)\s/i.test(ql) && /^(it\s+(was|marked|symbolizes|symbolises|represents|began|started|ended|premiered|happened|refers to|means|takes|aired|launched))/i.test(a)) {
    // Exception: "It was <name>" is actually fine
    if (!/^it was\s+[A-Z]/.test(a)) {
      push(e, "answer starts 'It <verb>...' instead of naming requested entity");
      continue;
    }
  }

  // ---- 15) Question: "What is the name of X" answer is long prose ----
  if (/^(what is the name of|what'?s the name of|what is he called|what is she called|what is it called|name the)\b/i.test(ql)) {
    if (wordCount(a) > 10) {
      push(e, "asked for a name, answer is long prose not a name");
      continue;
    }
  }

  // ---- 16) [DISABLED] "Who is X" descriptive answers are usually fine since X is named in the question ----

  // ---- 17) Answer with "represents" or "symbolizes" where question asks WHO/WHAT SPECIFIC ----
  if (/^(who|what)\s+(is|was)\s+(the )?(significance|meaning|symbolism|role|purpose)\b/i.test(ql)) {
    // These are philosophy questions — exempt
  }

  // ---- 18) Run-on narrative with multiple clauses — when question asks "What year" ----
  // already handled above

  // ---- 19) Question asks "Who founded/created the X" — answer must name a founder, not just describe X ----
  if (/^(who (founded|created|established|formed|invented|built|designed|made))\b/i.test(ql)) {
    // Should be a name. If a starts with "He/She/They/It/A/An/The" + role without a real name, flag.
    if (/^(he |she |they )\s*(is|was|were|are|co-created|captains|leads|manages|plays)/i.test(a) && !hasProperNoun(a)) {
      push(e, "asked who founded, answer uses pronoun without naming person");
      continue;
    }
  }
}

// Deduplicate
const seen = new Set();
const unique = [];
for (const b of broken) {
  const key = `${b.cat}|${b.q}|${b.a}`;
  if (seen.has(key)) continue;
  seen.add(key);
  unique.push(b);
}

unique.sort((a, b) => (b.tier - a.tier) || a.cat.localeCompare(b.cat));

const out = { count: unique.length, broken: unique };
fs.mkdirSync("audit", { recursive: true });
fs.writeFileSync("audit/broken-answers.json", JSON.stringify(out, null, 2));
console.error(`Flagged ${unique.length} broken answers. Written to audit/broken-answers.json`);

const byReason = {};
for (const b of unique) byReason[b.reason] = (byReason[b.reason] || 0) + 1;
console.error("\nBreakdown by reason:");
for (const [k, v] of Object.entries(byReason).sort((a, b) => b[1] - a[1])) {
  console.error(`  ${v.toString().padStart(4)}  ${k}`);
}
const byFile = {};
for (const b of unique) byFile[b.file] = (byFile[b.file] || 0) + 1;
console.error("\nBreakdown by file:");
for (const [k, v] of Object.entries(byFile).sort((a, b) => b[1] - a[1])) {
  console.error(`  ${v.toString().padStart(4)}  ${k}`);
}
const byCat = {};
for (const b of unique) byCat[b.cat] = (byCat[b.cat] || 0) + 1;
console.error("\nTop 20 categories:");
for (const [k, v] of Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 20)) {
  console.error(`  ${v.toString().padStart(4)}  ${k}`);
}
const byTier = {};
for (const b of unique) byTier[b.tier] = (byTier[b.tier] || 0) + 1;
console.error("\nBreakdown by tier:");
for (const [k, v] of Object.entries(byTier).sort()) {
  console.error(`  ${v.toString().padStart(4)}  tier ${k}`);
}

"""Scan source files for marvel: and dc: trivia entries and flag bad ones.

Bad rules:
- Actor/cast/casting questions ("Who plays/played/portrays/voices ...")
- Comic-only questions (issue numbers, comic writers/artists, comic-only events)
"""
import json
import os
import re
import sys

SRC = r"c:\Users\S0000005749\Desktop\dih\src"

SOURCE_FILES = [
    "App.jsx",
    "qualityBackfill.js",
    "megaNewExpansions.js",
    "moreTriviaExpansions.js",
    "newCategoriesBank.js",
    "newCategoriesPack2.js",
    "triviaExpansions.js",
    "triviaMegaExpansions.js",
    "triviaUltraExpansions.js",
    "triviaTierBalanceExpansions.js",
    "triviaTierParityExpansions.js",
    "triviaTierFinalParityExpansions.js",
    "triviaTierFinalTopoffExpansions.js",
]

CATS = ["marvel", "dc"]


def find_cat_blocks(content, cat):
    """Find all positions where a marvel:/dc: or "marvel":/"dc": block starts.

    Returns list of (start_idx, end_idx_of_block_braces) tuples by tracking nested braces.
    """
    blocks = []
    # patterns: bareword key like  marvel: {   and quoted key  "marvel": {
    pattern = re.compile(
        r'(?:^|[\s,\{])(?:"' + cat + r'"|\b' + cat + r'\b)\s*:\s*\{',
        re.MULTILINE,
    )
    for m in pattern.finditer(content):
        brace_pos = content.find("{", m.start())
        if brace_pos == -1:
            continue
        # walk braces to find matching close
        depth = 0
        i = brace_pos
        in_str = False
        str_ch = ""
        esc = False
        while i < len(content):
            c = content[i]
            if in_str:
                if esc:
                    esc = False
                elif c == "\\":
                    esc = True
                elif c == str_ch:
                    in_str = False
            else:
                if c == '"' or c == "'" or c == "`":
                    in_str = True
                    str_ch = c
                elif c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
                    if depth == 0:
                        blocks.append((brace_pos, i + 1))
                        break
            i += 1
    return blocks


# Match q/a inside a block. Each entry looks like
#   { q: "...", a: "...", ... }
# or { "q": "...", "a": "...", ... }
# strings may be single, double, or backtick quoted, with escapes.

STR_PAT = r'(?:"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|`(?:\\.|[^`\\])*`)'

QA_PAT = re.compile(
    r'(?:"?q"?\s*:\s*(' + STR_PAT + r'))\s*,\s*(?:"?a"?\s*:\s*(' + STR_PAT + r'))',
    re.DOTALL,
)


def strip_quotes(s):
    if not s:
        return s
    if (s[0] == s[-1]) and s[0] in '"\'`':
        return s[1:-1]
    return s


def unescape_js(s):
    # minimal: replace common escapes
    return (
        s.replace("\\n", "\n")
        .replace("\\t", "\t")
        .replace("\\\"", '"')
        .replace("\\'", "'")
        .replace("\\`", "`")
        .replace("\\\\", "\\")
    )


def parse_qa(block_text):
    out = []
    for m in QA_PAT.finditer(block_text):
        q = unescape_js(strip_quotes(m.group(1)))
        a = unescape_js(strip_quotes(m.group(2)))
        out.append((q, a))
    return out


# ---- Rules ----

ACTOR_PATTERNS = [
    re.compile(r"\bwho\s+(?:plays|played|portrays|portrayed|voices|voiced)\b", re.I),
    re.compile(r"\bwhat\s+actor\b", re.I),
    re.compile(r"\bwhich\s+actor\b", re.I),
    re.compile(r"\bwhat\s+actress\b", re.I),
    re.compile(r"\bwhich\s+actress\b", re.I),
    re.compile(r"\bcasting\b", re.I),
    re.compile(r"\bwho\s+stars?\s+as\b", re.I),
    re.compile(r"\bwho\s+starred\s+as\b", re.I),
    re.compile(r"\bwho\s+is\s+cast\s+as\b", re.I),
    re.compile(r"\bwho\s+was\s+cast\s+as\b", re.I),
    re.compile(r"\bportrayal\s+by\b", re.I),
    re.compile(r"\bwho\s+provides?\s+the\s+voice\b", re.I),
    re.compile(r"\bwho\s+provided\s+the\s+voice\b", re.I),
    re.compile(r"\bwho\s+does\s+the\s+voice\b", re.I),
    re.compile(r"\bwho\s+did\s+the\s+voice\b", re.I),
    re.compile(r"\bwho\s+performs?\s+as\b", re.I),
    re.compile(r"\bwho\s+performed\s+as\b", re.I),
    re.compile(r"\bwho\s+depicts?\b", re.I),
    re.compile(r"\bwho\s+depicted\b", re.I),
    re.compile(r"\bwho\s+takes?\s+(?:on\s+the\s+)?role\b", re.I),
    re.compile(r"\bwho\s+took\s+(?:on\s+the\s+)?role\b", re.I),
]

COMIC_PATTERNS = [
    # explicit comic issue references
    re.compile(r"#\d+\b"),  # issue numbers like #1, #15
    re.compile(r"\bissue\s+#?\d+\b", re.I),
    re.compile(r"\bcomic\s+book\b", re.I),
    re.compile(r"\bin\s+the\s+comics?\b", re.I),
    re.compile(r"\bin\s+marvel\s+comics?\b", re.I),
    re.compile(r"\bin\s+dc\s+comics?\b", re.I),
    re.compile(r"\bthe\s+comics?\b", re.I),
    re.compile(r"\bcomic\s+writer\b", re.I),
    re.compile(r"\bcomic\s+artist\b", re.I),
    re.compile(r"\bcomic\s+creator\b", re.I),
    re.compile(r"\bwho\s+(?:wrote|created|drew|illustrated)\b.*\bcomic\b", re.I),
    re.compile(r"\bfirst\s+appear(?:ed|ance)\b", re.I),
    re.compile(r"\bdebut(?:ed)?\s+in\s+(?:which|what)?\s*comic", re.I),
    re.compile(r"\bamazing\s+fantasy\b", re.I),
    re.compile(r"\bdetective\s+comics\b", re.I),
    re.compile(r"\baction\s+comics\b", re.I),
    re.compile(r"\btales\s+of\s+suspense\b", re.I),
    re.compile(r"\bjourney\s+into\s+mystery\b", re.I),
    re.compile(r"\bincredible\s+hulk\s+#\b", re.I),
    re.compile(r"\bcrisis\s+on\s+infinite\s+earths\b", re.I),  # arrowverse uses this title too -> handled below
    re.compile(r"\bhouse\s+of\s+m\b", re.I),
    re.compile(r"\bsecret\s+wars\b", re.I),
    re.compile(r"\bcivil\s+war\s+comic\b", re.I),
    re.compile(r"\bsecret\s+invasion\s+comic\b", re.I),
    re.compile(r"\bage\s+of\s+ultron\s+comic\b", re.I),
    re.compile(r"\bdeath\s+of\s+superman\s+comic\b", re.I),
    re.compile(r"\bblackest\s+night\b", re.I),
    re.compile(r"\bbrightest\s+day\b", re.I),
    re.compile(r"\bdark\s+phoenix\s+saga\b", re.I),
    re.compile(r"\binfinity\s+gauntlet\s+comic\b", re.I),
    re.compile(r"\bkingdom\s+come\b", re.I),
    re.compile(r"\bwatchmen\s+comic\b", re.I),
    re.compile(r"\bstan\s+lee\b", re.I),
    re.compile(r"\bsteve\s+ditko\b", re.I),
    re.compile(r"\bjack\s+kirby\b", re.I),
    re.compile(r"\bbob\s+kane\b", re.I),
    re.compile(r"\bbill\s+finger\b", re.I),
    re.compile(r"\bjerry\s+siegel\b", re.I),
    re.compile(r"\bjoe\s+shuster\b", re.I),
    re.compile(r"\bgrant\s+morrison\b", re.I),
    re.compile(r"\bgeoff\s+johns\b", re.I),
    re.compile(r"\bfrank\s+miller\b", re.I),
    re.compile(r"\bmark\s+millar\b", re.I),
    re.compile(r"\bbrian\s+michael\s+bendis\b", re.I),
    re.compile(r"\bneil\s+gaiman\b", re.I),
    re.compile(r"\bjim\s+lee\b", re.I),
    re.compile(r"\bgreg\s+capullo\b", re.I),
]

# arrowverse-safe whitelist: things that look comic but are also in MCU/DCEU/Arrowverse films/shows
# If question/answer mentions show or film title, allow. We do an exception for actor pat too (e.g.
# "Crisis on Infinite Earths" was a major Arrowverse crossover event).
ARROWVERSE_SHOWS = [
    "arrow", "the flash", "supergirl", "legends of tomorrow", "black lightning",
    "batwoman", "constantine", "stargirl",
]


FAMOUS_ACTORS_PAT = re.compile(
    r"\b(?:Robert\s+Downey|Chris\s+Evans|Chris\s+Hemsworth|Mark\s+Ruffalo|Scarlett\s+Johansson|"
    r"Jeremy\s+Renner|Samuel\s+L\.?\s+Jackson|Tom\s+Holland|Benedict\s+Cumberbatch|"
    r"Chadwick\s+Boseman|Tom\s+Hiddleston|Karen\s+Gillan|Zoe\s+Saldana|Dave\s+Bautista|"
    r"Bradley\s+Cooper|Vin\s+Diesel|Josh\s+Brolin|Paul\s+Rudd|Anthony\s+Mackie|"
    r"Sebastian\s+Stan|Elizabeth\s+Olsen|Paul\s+Bettany|Brie\s+Larson|Hugh\s+Jackman|"
    r"Patrick\s+Stewart|Ian\s+McKellen|James\s+McAvoy|Michael\s+Fassbender|Jennifer\s+Lawrence|"
    r"Halle\s+Berry|Tobey\s+Maguire|Andrew\s+Garfield|Kirsten\s+Dunst|Emma\s+Stone|Zendaya|"
    r"Ryan\s+Reynolds|Christian\s+Bale|Heath\s+Ledger|Michael\s+Keaton|Jack\s+Nicholson|"
    r"Ben\s+Affleck|Henry\s+Cavill|Gal\s+Gadot|Ezra\s+Miller|Jason\s+Momoa|Ray\s+Fisher|"
    r"Joaquin\s+Phoenix|Robert\s+Pattinson|Zoe\s+Kravitz|Colin\s+Farrell|Margot\s+Robbie|"
    r"Will\s+Smith|Jared\s+Leto|Idris\s+Elba|Viola\s+Davis|Dwayne\s+Johnson|Pierce\s+Brosnan|"
    r"Pedro\s+Pascal|Florence\s+Pugh|Aldis\s+Hodge|Noah\s+Centineo|Sarah\s+Shahi)\b",
    re.I,
)


def is_actor(q, a):
    for p in ACTOR_PATTERNS:
        if p.search(q):
            return True
    # "Name the X actors..." or "name the X" where the answer is a list of actors
    if re.search(r"\bname\s+the\b", q, re.I):
        # Count distinct actor names in answer
        matches = FAMOUS_ACTORS_PAT.findall(a)
        if len(matches) >= 2:
            return True
    return False


CREATOR_PAT = re.compile(
    r"\b(?:stan\s+lee|steve\s+ditko|jack\s+kirby|bob\s+kane|bill\s+finger|jerry\s+siegel|"
    r"joe\s+shuster|siegel\s+shuster|gardner\s+fox|harry\s+lampert|martin\s+nodell|"
    r"john\s+broome|gil\s+kane|grant\s+morrison|geoff\s+johns|frank\s+miller|"
    r"mark\s+millar|brian\s+michael\s+bendis|neil\s+gaiman|jim\s+lee|greg\s+capullo|"
    r"marv\s+wolfman|george\s+perez|mark\s+waid|alex\s+ross|larry\s+lieber|don\s+heck|"
    r"william\s+moulton\s+marston|hank\s+pym)\b",
    re.I,
)

# "Who created/wrote/drew X?" questions where the answer is a real comic creator name
WHO_CREATED_PAT = re.compile(
    r"\bwho\s+(?:co-)?(?:wrote|created|drew|illustrated|painted)\b", re.I
)


def is_comic_only(q, a):
    text = q + " " + a
    # "Who created X?" with creator-name answer = comic-only by definition
    if WHO_CREATED_PAT.search(q) and CREATOR_PAT.search(a):
        return True
    # Allow Arrowverse Crisis on Infinite Earths context (that's the TV crossover)
    if re.search(r"\barrowverse\b", text, re.I):
        return False
    # If the question explicitly references the MCU, films, movies, the Disney+ show names, or DCEU - skip
    if re.search(r"\bMCU\b|\bDCEU\b|\bfilm\b|\bmovies?\b|\bcinematic universe\b|\bDisney\+\b", text, re.I):
        # But still flag if the question is about who wrote a comic
        if re.search(r"\bwho\s+(?:wrote|created|drew|illustrated)\b", q, re.I) and re.search(r"\bcomic\b", text, re.I):
            return True
        return False
    # Also allow common show titles for DC
    show_pat = re.compile(
        r"\b(?:wandavision|loki|hawkeye|moon knight|she-?hulk|falcon and (?:the )?winter soldier|"
        r"ms\.? marvel|secret invasion|echo|agatha|daredevil|jessica jones|punisher|luke cage|iron fist|"
        r"agents? of s\.?h\.?i\.?e\.?l\.?d\.?|runaways|cloak (?:and|&) dagger|inhumans|legion|gifted|"
        r"smallville|gotham|titans|peacemaker|doom patrol|harley quinn|young justice|"
        r"watchmen|pennyworth|krypton|swamp thing|the boys|invincible|"
        r"x-?men|spider-?man|deadpool|wolverine|fantastic four|venom|morbius|madame web)\b",
        re.I,
    )
    if show_pat.search(text):
        if re.search(r"\bwho\s+(?:wrote|created|drew|illustrated)\b", q, re.I) and re.search(r"\bcomic\b", text, re.I):
            return True
        return False
    # Specifically flag arrowverse-confusing patterns
    for p in COMIC_PATTERNS:
        if p.search(text):
            return True
    return False


def classify(q, a):
    if is_actor(q, a):
        return "actor question"
    if is_comic_only(q, a):
        return "comic-only"
    return None


# ---- Run ----
removals = []
per_cat_counts = {"marvel": 0, "dc": 0}
per_reason = {"actor question": 0, "comic-only": 0}
per_cat_reason = {"marvel": {"actor question": 0, "comic-only": 0}, "dc": {"actor question": 0, "comic-only": 0}}
seen_keys = set()


def add(cat, q, a, reason, file_label):
    key = (cat, q, a)
    if key in seen_keys:
        return
    seen_keys.add(key)
    removals.append({"cat": cat, "q": q, "a": a, "reason": reason, "file": file_label})
    per_cat_counts[cat] += 1
    per_reason[reason] = per_reason.get(reason, 0) + 1
    per_cat_reason[cat][reason] = per_cat_reason[cat].get(reason, 0) + 1


for fname in SOURCE_FILES:
    path = os.path.join(SRC, fname)
    if not os.path.exists(path):
        continue
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    for cat in CATS:
        blocks = find_cat_blocks(content, cat)
        for s, e in blocks:
            block_text = content[s:e]
            pairs = parse_qa(block_text)
            for q, a in pairs:
                reason = classify(q, a)
                if reason:
                    add(cat, q, a, reason, fname)

# Also pull from per-cat audit (may include refs not captured by raw scan)
for cat in CATS:
    pcpath = os.path.join(r"c:\Users\S0000005749\Desktop\dih\audit\per-cat", cat + ".json")
    if not os.path.exists(pcpath):
        continue
    with open(pcpath, "r", encoding="utf-8") as f:
        data = json.load(f)
    for tier, items in data.items():
        for it in items:
            q = it.get("q", "")
            a = it.get("a", "")
            reason = classify(q, a)
            if reason:
                add(cat, q, a, reason, it.get("file", "per-cat-audit"))

out = {"remove": [{"cat": r["cat"], "q": r["q"], "a": r["a"], "reason": r["reason"]} for r in removals]}
with open(r"c:\Users\S0000005749\Desktop\dih\audit\marvel-dc-blacklist.json", "w", encoding="utf-8") as f:
    json.dump(out, f, indent=2, ensure_ascii=False)

print("total removals:", len(removals))
print("per cat:", per_cat_counts)
print("per reason:", per_reason)
print("per cat x reason:", per_cat_reason)

// Audit movieScenes.js entries for trailers / credits / title-leaks
// Fetches oEmbed metadata + watch page lengthSeconds + first ~500 chars description.
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'c:/Users/S0000005749/Desktop/dih/src/movieScenes.js';
const OUT = 'c:/Users/S0000005749/Desktop/dih/audit/trailer-credits-issues.json';

const raw = fs.readFileSync(SRC, 'utf8');

// Parse entries: easy("Title", "videoId") / medium / hard
const entries = [];
const lines = raw.split('\n');
let tier = null;
for (const line of lines) {
  const tierMatch = line.match(/^\s*(200|400|600):\s*\[/);
  if (tierMatch) { tier = parseInt(tierMatch[1], 10); continue; }
  const m = line.match(/^\s*(easy|medium|hard)\("([^"]+)",\s*"([^"]+)"\)/);
  if (m) {
    entries.push({ fn: m[1], answer: m[2], videoId: m[3], tier });
  }
}

console.error(`Parsed ${entries.length} entries`);

const TRAILER_TITLE_KEYWORDS = [
  'trailer','teaser','preview','sneak peek','behind the scenes',
  'recap','summary','highlights','montage','supercut',
  'ending explained','ending scene','credits','full scene','final scene','finale'
];
// "official" alone is too noisy on movie clip channels — match only as full word "official trailer/teaser/preview"
const CHANNEL_KEYWORDS = ['trailers','vevo','music','soundtrack','rotten tomatoes','filmisnow','jobloproductions','jobs movies','one media coming soon','coming soon trailers','geekfilms'];

// Channels known to overlay movie/channel branding on top of clips, end-cards, or large
// channel watermarks visible during playback. Flagged as title/visual-leak risks.
const BRAND_OVERLAY_CHANNELS = [
  'topmovieclips','movieclips','rotten tomatoes','binge society','flashback fm','fresh movie trailers',
  'one media','rapid trailer','movie coverage','jobloproductions','tjz','filmisnow','filmselect',
  'screenslam','disneymusicvevo','warnerbrosvevo','warner bros','marvel entertainment',
  'marvel universe entertainment','marvel studios','disney','pixar','sony pictures',
  'paramount pictures','universal pictures','20th century studios','focus features','a24',
];

function normalize(s) {
  return (s || '').toLowerCase()
    .replace(/[‘’ʼ']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function answerInTitle(answer, title) {
  const a = normalize(answer);
  const t = normalize(title);
  if (!a) return false;
  // Word-boundary check: pad both with spaces.
  const padded = ` ${t} `;
  const needle = ` ${a} `;
  return padded.includes(needle);
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!r.ok) return { status: r.status, text: null };
    return { status: r.status, text: await r.text() };
  } catch (e) {
    return { status: 0, text: null, err: String(e.message || e) };
  } finally {
    clearTimeout(t);
  }
}

async function checkOne(entry) {
  const { videoId, answer, tier } = entry;
  const oembed = await fetchText(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
  let ytTitle = null, channel = null, thumbnailUrl = null;
  if (oembed.status === 200 && oembed.text) {
    try {
      const j = JSON.parse(oembed.text);
      ytTitle = j.title || null;
      channel = j.author_name || null;
      thumbnailUrl = j.thumbnail_url || null;
    } catch {}
  } else if (oembed.status === 401 || oembed.status === 403 || oembed.status === 404) {
    return { videoId, answer, tier, ytTitle: null, channel: null, durationSeconds: null,
             reasonTags: ['deleted'], severity: 'high',
             reason: `deleted/private/unavailable (oembed ${oembed.status})` };
  }

  // NOTE: duration & description require the watch page or the YT Data API.
  // From this environment, www.youtube.com/watch returns a captcha challenge HTML
  // and the InnerTube /youtubei/v1/player endpoint returns playabilityStatus=UNPLAYABLE
  // for unauthenticated requests (as of YT's 2024 anti-bot tightening).
  // We therefore fall back to oEmbed-only signals (title + channel + thumbnail).
  // Duration is reported as null and the duration-based rule is skipped per entry.
  let durationSeconds = null;
  let descSnippet = null;

  const reasons = [];
  const titleLower = (ytTitle || '').toLowerCase();
  const chanLower = (channel || '').toLowerCase();
  const descLower = (descSnippet || '').toLowerCase();

  const reasonTags = []; // short categorical tags for grouping
  for (const k of TRAILER_TITLE_KEYWORDS) {
    if (titleLower.includes(k)) { reasons.push(`title contains '${k}'`); reasonTags.push(`kw:${k}`); break; }
  }
  if (/\bofficial (trailer|teaser|preview|clip)\b/i.test(ytTitle || '')) {
    if (!reasonTags.some(x => x.startsWith('kw:'))) {
      reasons.push("title contains 'official trailer/teaser/preview/clip'");
      reasonTags.push('kw:official-X');
    }
  }

  if (answerInTitle(answer, ytTitle || '')) {
    reasons.push(`title contains answer (leak)`);
    reasonTags.push('answer-leak');
  }

  for (const k of CHANNEL_KEYWORDS) {
    if (chanLower.includes(k)) { reasons.push(`channel contains '${k}'`); reasonTags.push(`chan:${k}`); break; }
  }
  for (const k of BRAND_OVERLAY_CHANNELS) {
    if (chanLower.includes(k)) {
      reasons.push(`channel '${channel}' is known brand-overlay/clip-farm (visual leak risk)`);
      reasonTags.push(`brand:${k}`);
      break;
    }
  }

  if (descLower) {
    const firstPara = descLower.split(/\n/)[0].slice(0, 400);
    if (/\b(trailer|official trailer)\b/.test(firstPara)) {
      reasons.push("description mentions 'trailer'");
      reasonTags.push('desc:trailer');
    }
  }

  if (durationSeconds != null && durationSeconds > 90) {
    reasons.push(`duration ${durationSeconds}s > 90s`);
    if (durationSeconds > 300) reasonTags.push('dur:>5min');
    else if (durationSeconds > 180) reasonTags.push('dur:>3min');
    else reasonTags.push('dur:>90s');
  }

  if (!ytTitle && !channel && durationSeconds == null) {
    reasons.push('deleted/private (no metadata)');
    reasonTags.push('deleted');
  }

  if (reasons.length === 0) return null;

  // Severity: deleted/trailer-keyword/channel-trailers/desc-trailer/long duration are HIGH.
  // pure answer-leak alone is MEDIUM (player chrome is hidden but thumbnail/on-screen text may leak).
  let severity = 'low';
  const high = reasonTags.some(t =>
    t === 'deleted' || t.startsWith('kw:') || t.startsWith('chan:') ||
    t.startsWith('brand:') || t === 'desc:trailer' ||
    t === 'dur:>5min' || t === 'dur:>3min'
  );
  const med = reasonTags.includes('dur:>90s') || reasonTags.includes('answer-leak');
  if (high) severity = 'high';
  else if (med) severity = 'medium';

  return {
    videoId, answer, tier, ytTitle, channel,
    durationSeconds, descSnippet: descSnippet ? descSnippet.slice(0, 200) : null,
    reasonTags, severity,
    reason: reasons.join('; '),
  };
}

const CONCURRENCY = 8;
async function main() {
  const flagged = [];
  const all = [];
  let idx = 0;
  let done = 0;
  async function worker() {
    while (true) {
      const i = idx++;
      if (i >= entries.length) break;
      const e = entries[i];
      try {
        const r = await checkOne(e);
        if (r) flagged.push(r);
        all.push({ ...e, ok: !r });
      } catch (err) {
        flagged.push({ ...e, reason: `error: ${String(err.message || err)}` });
      }
      done++;
      if (done % 10 === 0) console.error(`progress ${done}/${entries.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  // Sort: severity high > medium > low, then by tier
  const sevRank = { high: 0, medium: 1, low: 2 };
  flagged.sort((a, b) =>
    (sevRank[a.severity] - sevRank[b.severity]) ||
    ((a.tier || 0) - (b.tier || 0)) ||
    ((a.videoId || '').localeCompare(b.videoId || ''))
  );

  // Build summary
  const reasonTagCounts = {};
  for (const f of flagged) {
    for (const t of (f.reasonTags || [])) {
      reasonTagCounts[t] = (reasonTagCounts[t] || 0) + 1;
    }
  }
  const tierCounts = {};
  const severityCounts = { high: 0, medium: 0, low: 0 };
  for (const f of flagged) {
    tierCounts[f.tier] = (tierCounts[f.tier] || 0) + 1;
    severityCounts[f.severity] = (severityCounts[f.severity] || 0) + 1;
  }

  const highOnly = flagged.filter(f => f.severity === 'high');

  const out = {
    generatedAt: new Date().toISOString(),
    totalEntries: entries.length,
    totalFlagged: flagged.length,
    bySeverity: severityCounts,
    byTier: tierCounts,
    reasonTagCounts,
    rules: {
      severityHigh: 'has trailer/teaser/credits keyword in title, OR vevo/music/trailers channel, OR description mentions trailer, OR duration > 3 min, OR deleted',
      severityMedium: 'duration 91-180s, OR title contains the answer',
      severityLow: 'other',
    },
    flaggedHighSeverity: highOnly,
    flagged,
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.error(`Wrote ${OUT}`);
  console.error(`Flagged ${flagged.length}/${entries.length}`);
  console.error('By tier:', tierCounts);
  console.error('By severity:', severityCounts);
  console.error('Reason tags:', reasonTagCounts);
}

main().catch(err => { console.error(err); process.exit(1); });

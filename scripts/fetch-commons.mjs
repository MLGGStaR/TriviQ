// Search Wikimedia Commons for candidate images. Usage: node scripts/fetch-commons.mjs "<query>" [limit]
// Prints JSON: [{title, width, height, mime, license, artist, thumb1200, original, page}]
const [,, query, limitArg] = process.argv;
if (!query) { console.error("usage: node scripts/fetch-commons.mjs \"<query>\" [limit]"); process.exit(1); }
const limit = Math.min(50, Number(limitArg) || 24);
const UA = "TrivicCategoryArt/1.0 (https://github.com/MLGGStaR/TriviQ; thememesofdoom@gmail.com)";
const url = new URL("https://commons.wikimedia.org/w/api.php");
url.search = new URLSearchParams({
  action: "query", format: "json", generator: "search", gsrsearch: `${query} filetype:bitmap`, gsrnamespace: "6", gsrlimit: String(limit),
  prop: "imageinfo", iiprop: "url|size|mime|extmetadata", iiurlwidth: "1200", iiextmetadatafilter: "LicenseShortName|Artist|ImageDescription",
}).toString();
const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
if (!res.ok) { console.error("HTTP", res.status); process.exit(2); }
const data = await res.json();
const pages = Object.values(data?.query?.pages || {});
const strip = (s) => String(s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 120);
const out = pages.map((p) => {
  const ii = p.imageinfo?.[0] || {};
  const md = ii.extmetadata || {};
  return {
    title: p.title, width: ii.width, height: ii.height, mime: ii.mime,
    license: strip(md.LicenseShortName?.value), artist: strip(md.Artist?.value), description: strip(md.ImageDescription?.value),
    thumb1200: ii.thumburl || ii.url, original: ii.url, page: ii.descriptionurl,
  };
}).filter((c) => c.width && c.height && /jpeg|png/.test(c.mime || ""))
  .sort((a, b) => (b.height >= 900 ? 1 : 0) - (a.height >= 900 ? 1 : 0) || (b.height / b.width) - (a.height / a.width));
console.log(JSON.stringify(out, null, 1));

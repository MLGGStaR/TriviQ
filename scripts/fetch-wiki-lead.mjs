// Get the English Wikipedia lead image for an article. Usage: node scripts/fetch-wiki-lead.mjs "<Article title>"
// Prints JSON: {title, original:{source,width,height}, thumbnail:{source,width,height}, page}
const [,, title] = process.argv;
if (!title) { console.error("usage: node scripts/fetch-wiki-lead.mjs \"<Article title>\""); process.exit(1); }
const UA = "TrivicCategoryArt/1.0 (https://github.com/MLGGStaR/TriviQ; thememesofdoom@gmail.com)";
const url = new URL("https://en.wikipedia.org/w/api.php");
url.search = new URLSearchParams({ action: "query", format: "json", titles: title, redirects: "1", prop: "pageimages|info", piprop: "original|thumbnail", pithumbsize: "1200", inprop: "url" }).toString();
const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
if (!res.ok) { console.error("HTTP", res.status); process.exit(2); }
const data = await res.json();
const page = Object.values(data?.query?.pages || {})[0] || {};
console.log(JSON.stringify({ title: page.title, original: page.original || null, thumbnail: page.thumbnail || null, page: page.fullurl || null }, null, 1));

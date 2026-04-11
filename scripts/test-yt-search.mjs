// Test script — try to fetch a YouTube search result and extract video IDs.
const query = "Inception official trailer";
const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
const res = await fetch(url, {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "accept-language": "en-US,en;q=0.9",
  },
});
console.log("Status:", res.status);
const html = await res.text();
console.log("HTML length:", html.length);
// Try to extract video IDs from ytInitialData
const ids = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
const unique = [...new Set(ids)];
console.log("Found", unique.length, "unique video IDs");
console.log("First 5:", unique.slice(0, 5));

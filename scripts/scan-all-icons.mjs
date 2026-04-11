// Scans ALL simple-icons and classifies them as icon-only or wordmark.
// Outputs a list of icon-only brands that pass the strict text filter.
import * as simpleIcons from "simple-icons";

function isIconOnly(icon) {
  const svg = icon.svg || "";
  const pathMatches = svg.match(/d="([^"]*)"/g) || [];
  if (pathMatches.length === 0) return false;
  let totalM = 0, totalZ = 0, totalPathLength = 0;
  for (const m of pathMatches) {
    const d = m.slice(3, -1);
    totalM += (d.match(/[Mm]/g) || []).length;
    totalZ += (d.match(/[Zz]/g) || []).length;
    totalPathLength += d.length;
  }
  if (totalM > 3) return false;
  if (totalZ > 6) return false;
  if (totalPathLength > 1200) return false;
  return true;
}

const iconOnly = [];
for (const [key, icon] of Object.entries(simpleIcons)) {
  if (!key.startsWith("si") || !icon || !icon.title) continue;
  if (isIconOnly(icon)) iconOnly.push(icon.title);
}

console.log(`Total icon-only brands: ${iconOnly.length}`);
console.log("\nFull list:\n");
iconOnly.sort().forEach(t => console.log(`  ${t}`));

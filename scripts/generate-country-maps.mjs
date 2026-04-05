import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const atlas = require("world-atlas/countries-50m.json");
const countries = require("world-countries");
const { feature } = require("topojson-client");
const { geoMercator, geoPath, geoArea, geoCentroid } = require("d3-geo");

const COUNTRY_MAP_TIERS = {
  200: [
    ["US", "United States"],
    ["CA", "Canada"],
    ["MX", "Mexico"],
    ["BR", "Brazil"],
    ["AR", "Argentina"],
    ["CL", "Chile"],
    ["GB", "United Kingdom"],
    ["IE", "Ireland"],
    ["FR", "France"],
    ["DE", "Germany"],
    ["IT", "Italy"],
    ["ES", "Spain"],
    ["PT", "Portugal"],
    ["NO", "Norway"],
    ["SE", "Sweden"],
    ["TR", "Turkey"],
    ["EG", "Egypt"],
    ["SA", "Saudi Arabia"],
    ["ZA", "South Africa"],
    ["NG", "Nigeria"],
    ["IN", "India"],
    ["CN", "China"],
    ["JP", "Japan"],
    ["KR", "South Korea"],
    ["ID", "Indonesia"],
    ["TH", "Thailand"],
    ["VN", "Vietnam"],
    ["AU", "Australia"],
    ["NZ", "New Zealand"],
    ["MG", "Madagascar"],
  ],
  400: [
    ["CO", "Colombia"],
    ["PE", "Peru"],
    ["VE", "Venezuela"],
    ["CU", "Cuba"],
    ["PL", "Poland"],
    ["UA", "Ukraine"],
    ["FI", "Finland"],
    ["RO", "Romania"],
    ["HU", "Hungary"],
    ["GR", "Greece"],
    ["KZ", "Kazakhstan"],
    ["MN", "Mongolia"],
    ["IR", "Iran"],
    ["IQ", "Iraq"],
    ["PK", "Pakistan"],
    ["BD", "Bangladesh"],
    ["PH", "Philippines"],
    ["MY", "Malaysia"],
    ["AE", "United Arab Emirates"],
    ["OM", "Oman"],
    ["MA", "Morocco"],
    ["DZ", "Algeria"],
    ["KE", "Kenya"],
    ["ET", "Ethiopia"],
    ["TZ", "Tanzania"],
    ["SD", "Sudan"],
    ["EC", "Ecuador"],
    ["PY", "Paraguay"],
    ["UY", "Uruguay"],
    ["NP", "Nepal"],
  ],
  600: [
    ["AL", "Albania"],
    ["AM", "Armenia"],
    ["AZ", "Azerbaijan"],
    ["BT", "Bhutan"],
    ["LA", "Laos"],
    ["KG", "Kyrgyzstan"],
    ["TJ", "Tajikistan"],
    ["UZ", "Uzbekistan"],
    ["TM", "Turkmenistan"],
    ["GE", "Georgia"],
    ["SK", "Slovakia"],
    ["SI", "Slovenia"],
    ["MD", "Moldova"],
    ["LV", "Latvia"],
    ["LT", "Lithuania"],
    ["LU", "Luxembourg"],
    ["QA", "Qatar"],
    ["KW", "Kuwait"],
    ["BH", "Bahrain"],
    ["BN", "Brunei"],
    ["TL", "Timor-Leste"],
    ["LS", "Lesotho"],
    ["BW", "Botswana"],
    ["NA", "Namibia"],
    ["SR", "Suriname"],
    ["GY", "Guyana"],
    ["BZ", "Belize"],
    ["ME", "Montenegro"],
    ["MK", "North Macedonia"],
    ["RW", "Rwanda"],
  ],
};

const allCodes = Object.values(COUNTRY_MAP_TIERS).flat().map(([code]) => code);
if (new Set(allCodes).size !== allCodes.length) {
  throw new Error("Duplicate country map codes detected");
}

const codeToCcn3 = new Map(
  countries
    .filter((country) => country.ccn3)
    .map((country) => [country.cca2, String(country.ccn3).padStart(3, "0")]),
);

const world = feature(atlas, atlas.objects.countries);
const SUPPLEMENTAL_CONTEXT_FEATURES = [
  {
    type: "Feature",
    id: "KOS",
    properties: { name: "Kosovo" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [20.01, 42.56],
        [20.29, 42.88],
        [20.77, 43.01],
        [21.46, 42.98],
        [21.77, 42.67],
        [21.72, 42.43],
        [21.51, 42.27],
        [21.31, 42.19],
        [20.97, 41.99],
        [20.61, 41.85],
        [20.19, 42.05],
        [20.07, 42.27],
        [20.01, 42.56],
      ]],
    },
  },
];
const CONTEXT_CANDIDATES = [...world.features, ...SUPPLEMENTAL_CONTEXT_FEATURES];
const SKIP_CONTEXT_IDS = new Set(["010"]);
const featureById = new Map();
for (const geoFeature of world.features) {
  if (geoFeature.id == null) {
    continue;
  }

  const id = String(geoFeature.id).padStart(3, "0");
  if (!featureById.has(id)) {
    featureById.set(id, geoFeature);
  }
}

const WIDTH = 360;
const HEIGHT = 440;
const PADDING = 18;
const VIEWPORT_BLEED = 42;
const COUNTRY_MAP_ZOOM_OVERRIDES = {};

const WATER_FILL = "#7FA6D6";
const LAND_FILL = "#D8E2E7";
const BORDER_STROKE = "#3F464B";
const HIGHLIGHT_FILL = "#8B341D";
const HIGHLIGHT_STROKE = "#2C160F";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function compactPath(d) {
  if (!d) {
    return "";
  }

  return d.replace(/-?\d*\.?\d+/g, (match) => {
    const value = Number(match);
    if (!Number.isFinite(value)) return match;
    const precision = Math.abs(value) >= 100 ? 1 : Math.abs(value) >= 10 ? 2 : 3;
    return value.toFixed(precision).replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
  });
}

function largestFocusFeature(geoFeature) {
  if (geoFeature.geometry.type === "Polygon") {
    return geoFeature;
  }

  const polygons = geoFeature.geometry.coordinates.map((coordinates) => ({
    type: "Feature",
    properties: geoFeature.properties,
    geometry: { type: "Polygon", coordinates },
  }));

  return polygons.reduce((largest, candidate) =>
    geoArea(candidate) > geoArea(largest) ? candidate : largest,
  );
}

function polygonFeatures(geoFeature) {
  if (geoFeature.geometry.type === "Polygon") {
    return [geoFeature];
  }

  return geoFeature.geometry.coordinates.map((coordinates) => ({
    type: "Feature",
    properties: geoFeature.properties,
    id: geoFeature.id,
    geometry: { type: "Polygon", coordinates },
  }));
}

function wrapLongitude(lon) {
  let value = lon;
  while (value <= -180) value += 360;
  while (value > 180) value -= 360;
  return value;
}

function normalizeLongitudeNear(lon, reference) {
  let value = lon;
  while (value - reference <= -180) value += 360;
  while (value - reference > 180) value -= 360;
  return value;
}

function forEachPosition(coordinates, visit) {
  if (typeof coordinates[0] === "number") {
    visit(coordinates);
    return;
  }

  for (const child of coordinates) {
    forEachPosition(child, visit);
  }
}

function focusMetrics(geoFeature, code) {
  const focus = largestFocusFeature(geoFeature);
  const [centroidLon] = geoCentroid(focus);

  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  forEachPosition(focus.geometry.coordinates, ([lon, lat]) => {
    const normalizedLon = normalizeLongitudeNear(lon, centroidLon);
    minLon = Math.min(minLon, normalizedLon);
    maxLon = Math.max(maxLon, normalizedLon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  });

  const spanLon = Math.max(maxLon - minLon, 1.5);
  const spanLat = Math.max(maxLat - minLat, 1.5);
  const centerLon = wrapLongitude((minLon + maxLon) / 2);
  const centerLat = (minLat + maxLat) / 2;

  return { focus, centerLon, centerLat, spanLon, spanLat, code };
}

function contextZoomFactor({ spanLon, spanLat }) {
  const spanScore = Math.max(spanLon, spanLat * 1.35);

  if (spanScore <= 3) {
    return 8.6;
  }
  if (spanScore <= 8) {
    return lerp(8.6, 5.2, (spanScore - 3) / 5);
  }
  if (spanScore <= 13) {
    return lerp(5.2, 3.3, (spanScore - 8) / 5);
  }
  if (spanScore <= 18) {
    return lerp(3.3, 3.12, (spanScore - 13) / 5);
  }
  if (spanScore <= 26) {
    return lerp(3.12, 3.02, (spanScore - 18) / 8);
  }
  if (spanScore <= 45) {
    return lerp(3.02, 2.86, (spanScore - 26) / 19);
  }
  if (spanScore <= 90) {
    return lerp(2.86, 2.45, (spanScore - 45) / 45);
  }

  return lerp(2.45, 2.15, clamp((spanScore - 90) / 90, 0, 1));
}

function projectionFor(metrics) {
  const { focus, spanLon, spanLat, code } = metrics;
  const projection = geoMercator().precision(0.1);
  projection.fitExtent(
    [
      [PADDING, PADDING],
      [WIDTH - PADDING, HEIGHT - PADDING],
    ],
    focus,
  );

  const zoomFactor = COUNTRY_MAP_ZOOM_OVERRIDES[code] ?? contextZoomFactor({ spanLon, spanLat });
  projection.scale(projection.scale() / zoomFactor);

  const pathGenerator = geoPath(projection);
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(focus);
  const [tx, ty] = projection.translate();
  projection.translate([
    tx + WIDTH / 2 - (x0 + x1) / 2,
    ty + HEIGHT / 2 - (y0 + y1) / 2,
  ]);
  projection.clipExtent([
    [-VIEWPORT_BLEED, -VIEWPORT_BLEED],
    [WIDTH + VIEWPORT_BLEED, HEIGHT + VIEWPORT_BLEED],
  ]);

  return projection;
}

function contextualPolygons(target, projection) {
  const pathGenerator = geoPath(projection);
  const contextPolys = [];

  for (const candidate of CONTEXT_CANDIDATES) {
    if (candidate.id == null) {
      continue;
    }

    const candidateId = String(candidate.id);
    if (candidateId === String(target.id) || SKIP_CONTEXT_IDS.has(candidateId)) {
      continue;
    }

    for (const polygon of polygonFeatures(candidate)) {
      const visiblePath = pathGenerator(polygon);
      if (!visiblePath) {
        continue;
      }

      contextPolys.push(polygon);
    }
  }

  return { contextPolys };
}

function visibleFeaturePath(geoFeature, pathGenerator) {
  return polygonFeatures(geoFeature)
    .map((polygon) => compactPath(pathGenerator(polygon)))
    .filter(Boolean)
    .join("");
}

const outputDir = path.join(process.cwd(), "public", "country-maps");
fs.mkdirSync(outputDir, { recursive: true });

for (const existing of fs.readdirSync(outputDir)) {
  if (existing.endsWith(".svg")) {
    fs.unlinkSync(path.join(outputDir, existing));
  }
}

for (const [code, name] of Object.values(COUNTRY_MAP_TIERS).flat()) {
  const ccn3 = codeToCcn3.get(code);
  if (!ccn3) {
    throw new Error(`No UN numeric country code found for ${code} ${name}`);
  }

  const target = featureById.get(ccn3);
  if (!target) {
    throw new Error(`No geometry found for ${code} ${name}`);
  }

  const metrics = focusMetrics(target, code);
  const projection = projectionFor(metrics);
  const pathGenerator = geoPath(projection);
  const { contextPolys } = contextualPolygons(target, projection);

  const contextPath = contextPolys
    .map((polygon) => compactPath(pathGenerator(polygon)))
    .filter(Boolean)
    .join("");
  const targetPath =
    visibleFeaturePath(target, pathGenerator) ||
    compactPath(pathGenerator(metrics.focus));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-label="Regional map with ${name} highlighted"><rect width="100%" height="100%" fill="${WATER_FILL}"/><path d="${contextPath}" fill="${LAND_FILL}" stroke="${BORDER_STROKE}" stroke-width="0.85" vector-effect="non-scaling-stroke"/><path d="${targetPath}" fill="${HIGHLIGHT_FILL}" stroke="${HIGHLIGHT_STROKE}" stroke-width="1.1" vector-effect="non-scaling-stroke"/></svg>`;

  fs.writeFileSync(path.join(outputDir, `${code.toLowerCase()}.svg`), svg);
}

console.log(`Generated ${allCodes.length} country map SVGs in ${outputDir}`);

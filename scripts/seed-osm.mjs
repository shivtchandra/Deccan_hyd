// Augment data/sites.json with heritage structures from OpenStreetMap via the
// Overpass API. Keyless. Existing hand-curated records are never overwritten —
// OSM only adds sites we don't already have, and always as needsReview:true.
//
// Usage: npm run seed:osm
//
// Dedupe: an OSM element within ~120 m of an existing site, or with a matching
// slugified name, is treated as the same place and skipped.

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "data", "sites.json");

const OVERPASS = process.env.OVERPASS_URL || "https://overpass-api.de/api/interpreter";

// Hyderabad + Secunderabad + Golconda, generous bbox.
const BBOX = "17.20,78.28,17.56,78.65";

const QUERY = `
[out:json][timeout:90];
(
  nwr["historic"](${BBOX});
  nwr["heritage"](${BBOX});
  nwr["man_made"="baoli"](${BBOX});
  nwr["building"="mosque"]["heritage"](${BBOX});
  nwr["amenity"="place_of_worship"]["heritage"](${BBOX});
);
out center tags;
`;

function slug(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function haversineM(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// Map OSM tags to our `type` enum. Returns null to skip (not a structure we map).
function classifyType(tags) {
  const h = tags.historic;
  if (tags["man_made"] === "baoli" || h === "baoli") return "baoli";
  if (h === "tomb" || h === "mausoleum") return "tomb";
  if (h === "fort" || h === "citadel" || tags.military === "fort") return "fort";
  if (h === "city_gate" || h === "gate") return "gateway";
  if (h === "palace" || tags.building === "palace") return "palace";
  if (tags.building === "mosque" || tags.religion === "muslim") return "mosque";
  if (tags.building === "church" || tags.religion === "christian") return "church";
  if (tags.building === "temple" || tags.religion === "hindu") return "temple";
  if (h === "monument" || h === "memorial") return "civic";
  if (h === "ruins" || h === "archaeological_site") return "fort";
  if (h === "building" || h === "manor") return "mansion";
  if (h === "yes" && tags.building) return "civic";
  return null;
}

// Rough era guess from tags; almost always needs a human pass.
function guessEra(tags) {
  const start = tags.start_date || tags["year_of_construction"] || "";
  const y = parseInt((start.match(/\d{4}/) || [])[0], 10);
  if (!Number.isNaN(y)) {
    if (y < 1518) return "earlier";
    if (y < 1687) return "qutb-shahi";
    if (y < 1724) return "qutb-shahi";
    if (y < 1858) return "asaf-jahi";
    if (y < 1948) return "nizam-civic";
  }
  if (/qutb|golconda/i.test(tags.name || "")) return "qutb-shahi";
  if (/church|cantonment|residency/i.test(tags.name || "")) return "british-residency";
  return "asaf-jahi";
}

async function main() {
  console.log("seed-osm: querying Overpass…");
  const res = await fetch(OVERPASS, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: QUERY,
  });
  if (!res.ok) {
    console.error("seed-osm: Overpass returned", res.status);
    process.exit(1);
  }
  const json = await res.json();
  const elements = json.elements || [];
  console.log(`seed-osm: ${elements.length} raw elements`);

  const sites = JSON.parse(readFileSync(dataPath, "utf-8"));
  const existingSlugs = new Set(sites.map((s) => slug(s.name)));
  const existingPts = sites.map((s) => ({ lat: s.lat, lng: s.lng }));
  const usedIds = new Set(sites.map((s) => s.id));

  let added = 0;
  for (const el of elements) {
    const tags = el.tags || {};
    const name = tags["name:en"] || tags.name;
    if (!name) continue;

    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (typeof lat !== "number" || typeof lng !== "number") continue;

    const type = classifyType(tags);
    if (!type) continue;

    if (existingSlugs.has(slug(name))) continue;
    if (existingPts.some((p) => haversineM(p, { lat, lng }) < 120)) continue;

    let id = slug(name);
    while (usedIds.has(id)) id = `${id}-${Math.random().toString(36).slice(2, 5)}`;
    usedIds.add(id);

    const heritageAdmin = tags["heritage:operator"] || tags.heritage;
    const status =
      /asi|archaeological survey/i.test(heritageAdmin || "")
        ? "asi-protected"
        : /state|telangana|andhra/i.test(heritageAdmin || "")
        ? "state-protected"
        : tags.heritage
        ? "intach-listed"
        : "unprotected";

    sites.push({
      id,
      name,
      altNames: tags.alt_name ? [tags.alt_name] : [],
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
      era: guessEra(tags),
      yearBuilt: tags.start_date || tags["year_of_construction"] || "",
      type,
      status,
      access: tags.access === "private" ? "private" : tags.fee === "yes" ? "ticketed" : "open",
      area: tags["addr:suburb"] || tags["addr:neighbourhood"] || "",
      summary: tags.description || tags["description:en"] || "",
      sources: [
        {
          label: "OpenStreetMap",
          url: `https://www.openstreetmap.org/${el.type}/${el.id}`,
        },
      ],
      wikidata: tags.wikidata || null,
      wikipedia: tags.wikipedia
        ? `https://en.wikipedia.org/wiki/${encodeURIComponent(tags.wikipedia.replace(/^en:/, ""))}`
        : null,
      osmId: `${el.type}/${el.id}`,
      addedBy: "osm",
      verifiedAt: null,
      needsReview: true,
    });
    existingSlugs.add(slug(name));
    existingPts.push({ lat, lng });
    added++;
  }

  writeFileSync(dataPath, JSON.stringify(sites, null, 2) + "\n");
  console.log(`seed-osm: added ${added} sites, total ${sites.length}`);
}

main().catch((e) => {
  console.error("seed-osm failed:", e);
  process.exit(1);
});

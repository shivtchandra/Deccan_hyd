// Turns data/sites.json into two static files the app serves without any
// database read:
//   public/sites-index.json   lean rows for the map + list
//   public/sites-detail.json  full record per id, for the detail sheet
//
// Runs on `npm run dev` and `prebuild`. No network, no keys.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "data", "sites.json");
const pubDir = join(root, "public");
const photosDir = join(pubDir, "photos");

if (!existsSync(pubDir)) mkdirSync(pubDir, { recursive: true });
if (!existsSync(photosDir)) mkdirSync(photosDir, { recursive: true });

let sites = [];
try {
  sites = JSON.parse(readFileSync(dataPath, "utf-8"));
} catch (e) {
  console.error("build-static: cannot read data/sites.json —", e.message);
  process.exit(0); // don't block dev/build; just emit empty files
}

const index = sites.map((s) => ({
  id: s.id,
  name: s.name,
  lat: s.lat,
  lng: s.lng,
  era: s.era,
  type: s.type,
  status: s.status,
  access: s.access,
  area: s.area || "",
  hasPhoto: existsSync(join(photosDir, `${s.id}.jpg`)),
  needsReview: !!s.needsReview,
}));

const detail = {};
for (const s of sites) detail[s.id] = s;

writeFileSync(join(pubDir, "sites-index.json"), JSON.stringify(index));
writeFileSync(join(pubDir, "sites-detail.json"), JSON.stringify(detail));

console.log(`build-static: wrote ${index.length} sites (${index.filter((s) => s.hasPhoto).length} with photos)`);

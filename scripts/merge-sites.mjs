// Fold admin-approved submissions (data/submissions-approved.json) into
// data/sites.json. Run before a deploy. Keeps the dataset in the repo rather
// than in a runtime database. Idempotent: a submission already merged (same id)
// is skipped.
//
// Usage: npm run seed:merge

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "data", "sites.json");
const subPath = join(root, "data", "submissions-approved.json");

function slug(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

if (!existsSync(subPath)) {
  console.log("merge-sites: no submissions-approved.json — nothing to do");
  process.exit(0);
}

const sites = JSON.parse(readFileSync(dataPath, "utf-8"));
const subs = JSON.parse(readFileSync(subPath, "utf-8"));
const ids = new Set(sites.map((s) => s.id));

let added = 0;
for (const sub of subs) {
  let id = sub.id || slug(sub.name);
  if (!id || ids.has(id)) continue;
  ids.add(id);
  sites.push({
    id,
    name: sub.name,
    altNames: sub.altNames || [],
    lat: Number(sub.lat),
    lng: Number(sub.lng),
    era: sub.era || "asaf-jahi",
    yearBuilt: sub.yearBuilt || "",
    type: sub.type || "civic",
    status: sub.status || "unprotected",
    access: sub.access || "open",
    area: sub.area || "",
    summary: sub.note || sub.summary || "",
    sources: sub.sources || [{ label: "Community submission", url: "" }],
    wikidata: sub.wikidata || null,
    wikipedia: sub.wikipedia || null,
    addedBy: "user",
    verifiedAt: sub.approvedAt || null,
    needsReview: true,
  });
  added++;
}

writeFileSync(dataPath, JSON.stringify(sites, null, 2) + "\n");
console.log(`merge-sites: added ${added} approved submissions, total ${sites.length}`);

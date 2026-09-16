// Dump data/sites.json to a spreadsheet-friendly CSV for a manual QA pass
// (fix coordinates, set eras/types, write blurbs). Writes .mini/sites.csv.
//
// Usage: npm run seed:csv

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, ".mini");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const sites = JSON.parse(readFileSync(join(root, "data", "sites.json"), "utf-8"));
const cols = ["id", "name", "lat", "lng", "era", "type", "status", "access", "area", "yearBuilt", "needsReview", "addedBy", "summary"];

const esc = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const rows = [cols.join(",")];
for (const s of sites) rows.push(cols.map((c) => esc(s[c])).join(","));

writeFileSync(join(outDir, "sites.csv"), rows.join("\n") + "\n");
console.log(`export-csv: ${sites.length} rows -> .mini/sites.csv`);

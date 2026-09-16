// Fill missing summary / yearBuilt / coordinates from Wikidata + the Wikipedia
// REST summary endpoint. Keyless. Only fills blanks — never overwrites a
// hand-written summary. Adds a Wikipedia source link and clears needsReview
// when a site gains both coordinates and a description.
//
// Usage: npm run seed:wikidata

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "data", "sites.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wikidataEntity(qid) {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const res = await fetch(url, { headers: { "User-Agent": "deccan-heritage-map/0.1 (seed)" } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.entities?.[qid] || null;
}

function claimValue(entity, prop) {
  const c = entity?.claims?.[prop]?.[0]?.mainsnak?.datavalue?.value;
  return c ?? null;
}

async function wikipediaSummary(title) {
  const t = decodeURIComponent(title).replace(/_/g, " ");
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`;
  const res = await fetch(url, { headers: { "User-Agent": "deccan-heritage-map/0.1 (seed)" } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.extract || null;
}

async function main() {
  const sites = JSON.parse(readFileSync(dataPath, "utf-8"));
  let filled = 0;

  for (const s of sites) {
    const needsSummary = !s.summary || s.summary.length < 40;
    const needsYear = !s.yearBuilt;
    const needsCoords = typeof s.lat !== "number" || typeof s.lng !== "number";
    if (!needsSummary && !needsYear && !needsCoords) continue;

    let entity = null;
    if (s.wikidata) {
      try {
        entity = await wikidataEntity(s.wikidata);
      } catch {}
      await sleep(200);
    }

    if (entity) {
      if (needsCoords) {
        const coord = claimValue(entity, "P625");
        if (coord) {
          s.lat = Number(coord.latitude.toFixed(6));
          s.lng = Number(coord.longitude.toFixed(6));
        }
      }
      if (needsYear) {
        const incept = claimValue(entity, "P571");
        if (incept?.time) {
          const y = incept.time.match(/(\d{4})/);
          if (y) s.yearBuilt = y[1];
        }
      }
      if (!s.wikipedia) {
        const site = entity.sitelinks?.enwiki?.title;
        if (site) s.wikipedia = `https://en.wikipedia.org/wiki/${encodeURIComponent(site.replace(/ /g, "_"))}`;
      }
    }

    if (needsSummary && s.wikipedia) {
      const title = s.wikipedia.split("/wiki/")[1];
      let extract = null;
      try {
        extract = await wikipediaSummary(title);
      } catch {}
      await sleep(200);
      if (extract) {
        s.summary = extract.length > 600 ? extract.slice(0, 600).replace(/\s+\S*$/, "") + "…" : extract;
        if (!s.sources?.some((x) => x.label === "Wikipedia")) {
          (s.sources ??= []).push({ label: "Wikipedia", url: s.wikipedia });
        }
        filled++;
      }
    }

    if (typeof s.lat === "number" && typeof s.lng === "number" && s.summary && s.summary.length > 40) {
      s.needsReview = false;
    }
  }

  writeFileSync(dataPath, JSON.stringify(sites, null, 2) + "\n");
  console.log(`enrich-wikidata: filled ${filled} summaries; ${sites.filter((s) => s.needsReview).length} still need review`);
}

main().catch((e) => {
  console.error("enrich-wikidata failed:", e);
  process.exit(1);
});

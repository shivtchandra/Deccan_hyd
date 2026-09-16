// Serves the lean site index the map + list use. Reads the static file built by
// scripts/build-static.mjs with fallback to data/sites.json.

import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

let cache = null;
function load() {
  if (cache) return cache;

  // 1. Try public/sites-index.json
  const pubPath = join(process.cwd(), "public", "sites-index.json");
  if (existsSync(pubPath)) {
    try {
      const raw = readFileSync(pubPath, "utf-8");
      cache = JSON.parse(raw);
      return cache;
    } catch (e) {
      console.warn("Failed to read public/sites-index.json:", e.message);
    }
  }

  // 2. Fallback to data/sites.json
  const dataPath = join(process.cwd(), "data", "sites.json");
  if (existsSync(dataPath)) {
    try {
      const sites = JSON.parse(readFileSync(dataPath, "utf-8"));
      cache = sites.map((s) => ({
        id: s.id,
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        era: s.era,
        type: s.type,
        status: s.status,
        access: s.access,
        area: s.area || "",
        needsReview: !!s.needsReview,
      }));
      return cache;
    } catch (e) {
      console.warn("Failed to read data/sites.json:", e.message);
    }
  }

  return [];
}

export async function GET(req) {
  try {
    let rows = load();
    const { searchParams } = new URL(req.url);
    const era = searchParams.get("era");
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    if (era) rows = rows.filter((s) => s.era === era);
    if (type) rows = rows.filter((s) => s.type === type);
    if (status) rows = rows.filter((s) => s.status === status);

    return Response.json(
      { sites: rows },
      {
        headers: {
          "cache-control": "public, max-age=300",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/sites error:", err);
    return Response.json({ sites: [], error: err.message }, { status: 500 });
  }
}

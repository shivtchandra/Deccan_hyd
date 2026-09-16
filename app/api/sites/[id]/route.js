// One full site record for the detail sheet. Reads the static detail map built
// by scripts/build-static.mjs, with fallback to data/sites.json.

import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

let cache = null;
function load() {
  if (cache) return cache;

  // 1. Try public/sites-detail.json
  const pubPath = join(process.cwd(), "public", "sites-detail.json");
  if (existsSync(pubPath)) {
    try {
      const raw = readFileSync(pubPath, "utf-8");
      cache = JSON.parse(raw);
      return cache;
    } catch (e) {
      console.warn("Failed to read public/sites-detail.json:", e.message);
    }
  }

  // 2. Fallback to data/sites.json
  const dataPath = join(process.cwd(), "data", "sites.json");
  if (existsSync(dataPath)) {
    try {
      const list = JSON.parse(readFileSync(dataPath, "utf-8"));
      cache = {};
      for (const s of list) {
        if (s && s.id) cache[s.id] = s;
      }
      return cache;
    } catch (e) {
      console.warn("Failed to read data/sites.json:", e.message);
    }
  }

  return {};
}

export async function GET(req, context) {
  try {
    const rawParams = context?.params;
    const params = rawParams instanceof Promise ? await rawParams : (await Promise.resolve(rawParams)) || {};
    const id = params?.id;

    if (!id) {
      return Response.json({ error: "missing-id" }, { status: 400 });
    }

    const map = load();
    const site = map ? map[id] : null;

    if (!site) {
      return Response.json({ error: "not-found" }, { status: 404 });
    }

    return Response.json(site, {
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=600",
      },
    });
  } catch (err) {
    console.error("GET /api/sites/[id] error:", err);
    return Response.json({ error: err?.message || "server-error" }, { status: 500 });
  }
}

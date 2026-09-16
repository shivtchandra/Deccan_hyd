// Serves the curated preset walks in data/routes.json.

import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

let cache = null;
function load() {
  if (cache) return cache;
  cache = JSON.parse(readFileSync(join(process.cwd(), "data", "routes.json"), "utf-8"));
  return cache;
}

export async function GET() {
  try {
    return new Response(JSON.stringify({ routes: load() }), {
      headers: { "content-type": "application/json", "cache-control": "public, max-age=600" },
    });
  } catch {
    return Response.json({ routes: [] });
  }
}

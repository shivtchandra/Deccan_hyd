// One full site record for the detail sheet: the built-in record from
// public/sites-detail.json with desk edits applied, or a desk-added site.
// Hidden sites are 404.

import { getPublicSite } from "../../../../lib/siteEdits.js";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const id = params?.id;
  if (!id) return Response.json({ error: "missing-id" }, { status: 400 });
  try {
    const site = await getPublicSite(id);
    if (!site) return Response.json({ error: "not-found" }, { status: 404 });
    // Short cache so desk edits reach visitors quickly.
    return Response.json(site, { headers: { "cache-control": site.isFinding ? "no-store" : "public, max-age=60" } });
  } catch (err) {
    console.error("GET /api/sites/[id] error:", err);
    return Response.json({ error: err?.message || "server-error" }, { status: 500 });
  }
}

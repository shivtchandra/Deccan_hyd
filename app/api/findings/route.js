// Public list of live field findings, shaped like sites-index.json rows.
// The map merges these with the static index so new findings show without a rebuild.

import { listFindings, toIndexRow } from "../../../lib/findingsStore.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await listFindings();
    return Response.json({ findings: rows.map(toIndexRow) }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ findings: [] });
  }
}

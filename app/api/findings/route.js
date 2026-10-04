// Public live layer on top of the static sites-index.json, so desk changes show
// without a rebuild:
//   findings → desk-added sites, shaped like sites-index.json rows
//   edits    → patches for built-in rows ({ id, hidden, ...changed fields })

import { listFindings, toIndexRow } from "../../../lib/findingsStore.js";
import { listSiteEdits, indexPatch } from "../../../lib/siteEdits.js";

export const dynamic = "force-dynamic";

export async function GET() {
  const [findings, edits] = await Promise.all([
    listFindings().catch(() => []),
    listSiteEdits().catch(() => ({})),
  ]);
  return Response.json(
    { findings: findings.map(toIndexRow), edits: Object.values(edits).map(indexPatch) },
    { headers: { "cache-control": "no-store" } },
  );
}

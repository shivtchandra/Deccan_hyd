// Editorial desk (/admin) site inventory. Bearer key from ADMIN_SECRET, EDITOR_SECRET or FIELD_EDITORS.
//
//   GET                         → { editor, sites } — built-in + desk-added sites, hidden included
//   POST { ...fields, submissionId? } → adds a site; it is live on the map immediately.
//                                  With submissionId, that community submission is marked approved.

import { editorFromRequest, upsertFinding, errorResponse } from "../../../../lib/findingsStore.js";
import { listDeskSites, refreshSitePage } from "../../../../lib/siteEdits.js";
import { setSubmissionState } from "../../../../lib/submissionsStore.js";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const editor = editorFromRequest(req);
  if (!editor) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    const sites = await listDeskSites(editor);
    return Response.json({ editor, sites }, { headers: { "cache-control": "no-store" } });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req) {
  const editor = editorFromRequest(req);
  if (!editor) return Response.json({ error: "unauthorized" }, { status: 401 });
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  try {
    const site = await upsertFinding(body || {}, editor);
    refreshSitePage(site.id);
    let submissionResolved = false;
    if (body.submissionId && editor.canEditAll) {
      submissionResolved = await setSubmissionState(String(body.submissionId), "approved", { siteId: site.id, resolvedBy: editor.name })
        .then(() => true)
        .catch(() => false);
    }
    return Response.json({ ok: true, site, submissionResolved });
  } catch (err) {
    return errorResponse(err);
  }
}

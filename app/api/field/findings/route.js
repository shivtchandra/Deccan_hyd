// Field-editor API for /admin/field. Bearer key from FIELD_EDITORS (or ADMIN_SECRET / EDITOR_SECRET).
//
//   GET                 → { editor, role, findings } — this editor's upload history (admin / editor see all)
//   POST multipart form → creates a finding; it is live on the map immediately

import { editorFromRequest, listFindings, upsertFindingFromForm, errorResponse } from "../../../../lib/findingsStore.js";

import { refreshSitePage } from "../../../../lib/siteEdits.js";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const editor = editorFromRequest(req);
  if (!editor) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    const findings = await listFindings({ addedBy: editor.canEditAll ? null : editor.name, includeHidden: true });
    return Response.json({ editor: editor.name, role: editor.role, findings });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req) {
  const editor = editorFromRequest(req);
  if (!editor) return Response.json({ error: "unauthorized" }, { status: 401 });
  let form;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  try {
    const finding = await upsertFindingFromForm(form, editor);
    refreshSitePage(finding.id);
    return Response.json({ ok: true, finding });
  } catch (err) {
    return errorResponse(err);
  }
}

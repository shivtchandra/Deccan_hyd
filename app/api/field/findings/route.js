// Field-editor API for /admin/field. Bearer key from FIELD_EDITORS (or ADMIN_SECRET).
//
//   GET                 → { editor, findings } — this editor's upload history (admin sees all)
//   POST multipart form → creates a finding; it is live on the map immediately

import { editorFromRequest, listFindings, upsertFindingFromForm, errorResponse } from "../../../../lib/findingsStore.js";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const editor = editorFromRequest(req);
  if (!editor) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    const findings = await listFindings({ addedBy: editor.isAdmin ? null : editor.name, includeHidden: true });
    return Response.json({ editor: editor.name, findings });
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
    return Response.json({ ok: true, finding });
  } catch (err) {
    return errorResponse(err);
  }
}

// Edit or hide one finding from the field desk. Field editors may only touch their own;
// admin / editor keys may touch any.
//
//   PATCH multipart form → same fields as create, plus keepPhotos (JSON array of urls)
//   PATCH JSON { hidden } → hide from / restore to the map

import { editorFromRequest, getFinding, upsertFindingFromForm, setFindingHidden, canEditSite, errorResponse } from "../../../../../lib/findingsStore.js";

import { refreshSitePage } from "../../../../../lib/siteEdits.js";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const editor = editorFromRequest(req);
  if (!editor) return Response.json({ error: "unauthorized" }, { status: 401 });

  const existing = await getFinding(params.id);
  if (!existing) return Response.json({ error: "not-found" }, { status: 404 });
  if (!canEditSite(editor, existing)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    if ((req.headers.get("content-type") || "").includes("application/json")) {
      const body = await req.json();
      const finding = await setFindingHidden(existing, body?.hidden, editor);
      refreshSitePage(finding.id);
      return Response.json({ ok: true, finding });
    }
    const finding = await upsertFindingFromForm(await req.formData(), editor, existing);
    refreshSitePage(finding.id);
    return Response.json({ ok: true, finding });
  } catch (err) {
    return errorResponse(err);
  }
}

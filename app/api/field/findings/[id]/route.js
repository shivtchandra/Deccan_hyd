// Edit or hide one finding. Editors may only touch their own; admin may touch any.
//
//   PATCH multipart form → same fields as create, plus keepPhotos (JSON array of urls)
//   PATCH JSON { hidden } → hide from / restore to the map

import { editorFromRequest, getFinding, upsertFindingFromForm, setFindingHidden, errorResponse } from "../../../../../lib/findingsStore.js";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const editor = editorFromRequest(req);
  if (!editor) return Response.json({ error: "unauthorized" }, { status: 401 });

  const existing = await getFinding(params.id);
  if (!existing) return Response.json({ error: "not-found" }, { status: 404 });
  if (!editor.isAdmin && existing.addedBy !== editor.name) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    if ((req.headers.get("content-type") || "").includes("application/json")) {
      const body = await req.json();
      const finding = await setFindingHidden(existing, body?.hidden);
      return Response.json({ ok: true, finding });
    }
    const finding = await upsertFindingFromForm(await req.formData(), editor, existing);
    return Response.json({ ok: true, finding });
  } catch (err) {
    return errorResponse(err);
  }
}

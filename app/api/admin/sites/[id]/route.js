// Change one site from the editorial desk. Works for desk-added and built-in sites.
//
//   PATCH { action: "update", fields }  → save the edit form
//   PATCH { action: "hide" | "show" }   → take off / put back on the public map
//   PATCH { action: "revert" }          → built-in only: drop all edits, back to the original
//
// Built-in sites need an admin/editor key; field editors may only change sites they added.

import { editorFromRequest, getFinding, upsertFinding, setFindingHidden, canEditSite, errorResponse } from "../../../../../lib/findingsStore.js";
import { builtInSites, updateBuiltInSite, setBuiltInHidden, revertBuiltInSite, refreshSitePage } from "../../../../../lib/siteEdits.js";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const editor = editorFromRequest(req);
  if (!editor) return Response.json({ error: "unauthorized" }, { status: 401 });
  const id = params.id;
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  const action = body?.action;
  if (!["update", "hide", "show", "revert"].includes(action)) return Response.json({ error: "bad-request" }, { status: 400 });

  try {
    if (builtInSites()[id]) {
      if (!editor.canEditAll) return Response.json({ error: "forbidden" }, { status: 403 });
      if (action === "update") await updateBuiltInSite(id, body.fields || {}, editor);
      else if (action === "revert") await revertBuiltInSite(id, editor);
      else await setBuiltInHidden(id, action === "hide", editor);
    } else {
      const existing = await getFinding(id);
      if (!existing) return Response.json({ error: "not-found" }, { status: 404 });
      if (!canEditSite(editor, existing)) return Response.json({ error: "forbidden" }, { status: 403 });
      if (action === "update") await upsertFinding(body.fields || {}, editor, existing);
      else if (action === "revert") return Response.json({ error: "bad-request" }, { status: 400 });
      else await setFindingHidden(existing, action === "hide", editor);
    }
    refreshSitePage(id);
    return Response.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}

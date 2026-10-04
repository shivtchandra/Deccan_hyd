// Verifies an editorial access key without exposing any secrets to the client.

import { editorFromRequest } from "../../../../lib/findingsStore.js";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const editor = editorFromRequest(req);
  if (!editor) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return Response.json({ ok: true, name: editor.name, isAdmin: editor.isAdmin });
}

export async function POST(req) {
  const editor = editorFromRequest(req);
  if (!editor) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return Response.json({ ok: true, name: editor.name, isAdmin: editor.isAdmin });
}

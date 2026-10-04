// Community submissions review queue for the editorial desk. Admin / editor keys only
// (fail-closed — no secret set means every call is 401).
//
//   GET  ?state=pending          → { submissions }
//   POST { id, action: "reject" } → marks it rejected
//
// Approving happens through POST /api/admin/sites with { submissionId }: the editor
// reviews and completes the details, the site goes live, and the submission is closed.

import { editorFromRequest, errorResponse } from "../../../../lib/findingsStore.js";
import { listSubmissions, setSubmissionState } from "../../../../lib/submissionsStore.js";

export const dynamic = "force-dynamic";

function reviewer(req) {
  const editor = editorFromRequest(req);
  return editor?.canEditAll ? editor : null;
}

export async function GET(req) {
  if (!reviewer(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const state = new URL(req.url).searchParams.get("state") || "pending";
  try {
    return Response.json({ submissions: await listSubmissions(state) }, { headers: { "cache-control": "no-store" } });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req) {
  const editor = reviewer(req);
  if (!editor) return Response.json({ error: "unauthorized" }, { status: 401 });
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  const { id, action } = body || {};
  if (!id || action !== "reject") return Response.json({ error: "bad-request" }, { status: 400 });
  try {
    await setSubmissionState(String(id), "rejected", { resolvedBy: editor.name });
    return Response.json({ ok: true, state: "rejected" });
  } catch (err) {
    return errorResponse(err);
  }
}

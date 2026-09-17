// Admin review queue for community submissions. Gated by a bearer ADMIN_SECRET
// (fail-closed — no secret set means every call is 401).
//
//   GET  ?state=pending           list submissions
//   POST { id, action, patch? }   action = "approve" | "reject"
//
// Approving writes the record into data/submissions-approved.json on disk;
// `npm run seed:merge` then folds it into data/sites.json before the next build.

import { getAdminDb } from "../../../../lib/firebaseAdmin.js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

function authOk(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return (req.headers.get("authorization") || "") === `Bearer ${secret}`;
}

function slug(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function GET(req) {
  if (!authOk(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const db = await getAdminDb();
  const state = new URL(req.url).searchParams.get("state") || "pending";
  
  if (db) {
    try {
      const snap = await db.collection("submissions").where("state", "==", state).limit(200).get();
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: null, _ts: null }));
      return Response.json({ submissions: rows });
    } catch {
      /* fallback to local file below */
    }
  }

  const pendingPath = join(process.cwd(), "data", "submissions-pending.json");
  let list = [];
  if (existsSync(pendingPath)) {
    try {
      list = JSON.parse(readFileSync(pendingPath, "utf-8"));
    } catch {}
  }
  const filtered = list.filter((s) => s.state === state || (!s.state && state === "pending"));
  return Response.json({ submissions: filtered });
}

export async function POST(req) {
  if (!authOk(req)) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  const { id, action, patch } = body || {};
  if (!id || !["approve", "reject"].includes(action)) {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const db = await getAdminDb();
  let sub = null;

  if (db) {
    try {
      const ref = db.collection("submissions").doc(id);
      const snap = await ref.get();
      if (snap.exists) {
        sub = { id, ...snap.data(), ...(patch || {}) };
        if (action === "reject") {
          await ref.set({ state: "rejected" }, { merge: true });
        } else {
          await ref.set({ state: "approved" }, { merge: true });
        }
      }
    } catch {}
  }

  // Handle local pending file
  const pendingPath = join(process.cwd(), "data", "submissions-pending.json");
  let pendingList = [];
  if (existsSync(pendingPath)) {
    try {
      pendingList = JSON.parse(readFileSync(pendingPath, "utf-8"));
      const idx = pendingList.findIndex((x) => x.id === id);
      if (idx >= 0) {
        sub = { ...pendingList[idx], ...(patch || {}) };
        pendingList[idx].state = action === "approve" ? "approved" : "rejected";
        try {
          writeFileSync(pendingPath, JSON.stringify(pendingList, null, 2) + "\n");
        } catch {}
      }
    } catch {}
  }

  if (!sub) {
    return Response.json({ error: "not-found" }, { status: 404 });
  }

  if (action === "reject") {
    return Response.json({ ok: true, state: "rejected" });
  }

  // approve -> write into submissions-approved.json
  const approvedPath = join(process.cwd(), "data", "submissions-approved.json");
  let list = [];
  if (existsSync(approvedPath)) {
    try {
      list = JSON.parse(readFileSync(approvedPath, "utf-8"));
    } catch {}
  }
  const record = {
    id: slug(sub.name),
    name: sub.name,
    lat: sub.lat,
    lng: sub.lng,
    era: sub.era || "asaf-jahi",
    type: sub.type || "civic",
    status: sub.status || "unprotected",
    access: sub.access || "open",
    area: sub.area || "",
    note: sub.note || "",
    approvedAt: new Date().toISOString(),
  };
  if (!list.some((r) => r.id === record.id)) list.push(record);

  try {
    writeFileSync(approvedPath, JSON.stringify(list, null, 2) + "\n");
  } catch {}

  return Response.json({ ok: true, approvedFile: record.id });
}

// Community "suggest a site" submissions (written by /api/submit), read and resolved
// by the editorial desk. Firestore "submissions" when configured, with
// data/submissions-pending.json as the local fallback. Server-only.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { getAdminDb } from "./firebaseAdmin.js";

const PENDING_FILE = join(process.cwd(), "data", "submissions-pending.json");

function readLocal() {
  if (!existsSync(PENDING_FILE)) return [];
  try {
    const list = JSON.parse(readFileSync(PENDING_FILE, "utf-8"));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

const toIso = (v) => (v?.toDate ? v.toDate().toISOString() : typeof v === "string" ? v : null);

export async function listSubmissions(state = "pending") {
  const db = await getAdminDb();
  if (db) {
    try {
      const snap = await db.collection("submissions").where("state", "==", state).limit(200).get();
      return snap.docs
        .map((d) => {
          const { _ts, createdAt, ...rest } = d.data();
          return { ...rest, id: d.id, createdAt: toIso(createdAt) || toIso(_ts) };
        })
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    } catch {
      /* fall back to the local file */
    }
  }
  return readLocal().filter((s) => (s.state || "pending") === state);
}

// Marks a submission approved / rejected. Throws "not-found" when it doesn't exist.
export async function setSubmissionState(id, state, extra = {}) {
  const update = { state, resolvedAt: new Date().toISOString(), ...extra };
  const db = await getAdminDb();
  if (db) {
    const ref = db.collection("submissions").doc(id);
    if ((await ref.get()).exists) {
      await ref.set(update, { merge: true });
      return;
    }
  }
  const list = readLocal();
  const idx = list.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error("not-found");
  list[idx] = { ...list[idx], ...update };
  writeFileSync(PENDING_FILE, JSON.stringify(list, null, 2) + "\n");
}

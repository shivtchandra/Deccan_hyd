import { getAdminDb, verifyUid } from "../../../lib/firebaseAdmin.js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const ERAS = ["earlier", "qutb-shahi", "asaf-jahi", "british-residency", "nizam-civic", "post-independence"];
const TYPES = ["tomb", "mosque", "baoli", "palace", "fort", "gateway", "civic", "mansion", "temple", "church", "tank", "cemetery", "bridge", "bazaar", "heritage-structure", "arch", "clocktower", "garden", "library"];

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const name = (body?.name || "").toString().trim().slice(0, 120);
  const lat = Number(body?.lat);
  const lng = Number(body?.lng);
  const note = (body?.note || "").toString().trim().slice(0, 600);
  const era = body?.era && (ERAS.includes(body.era) ? body.era : "asaf-jahi");
  const type = body?.type && (TYPES.includes(body.type) ? body.type : (body?.type || "civic"));

  if (!name || Number.isNaN(lat) || Number.isNaN(lng)) {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  let uid = await verifyUid(token);
  if (!uid) {
    if (token && token.startsWith("local:")) {
      uid = token.slice(6);
    } else if (token && token !== "null" && token !== "undefined") {
      uid = token;
    } else {
      uid = "anon-" + Math.random().toString(36).slice(2, 9);
    }
  }

  const db = await getAdminDb();
  if (db) {
    try {
      const { FieldValue, Timestamp } = await import("firebase-admin/firestore");

      // crude rate limit: max 10 pending submissions per uid
      try {
        const mine = await db
          .collection("submissions")
          .where("uid", "==", uid)
          .where("state", "==", "pending")
          .count()
          .get();
        if ((mine.data().count || 0) >= 10) {
          return Response.json({ error: "rate-limited" }, { status: 429 });
        }
      } catch {
        /* count() unsupported on some emulators — skip */
      }

      const ref = await db.collection("submissions").add({
        uid,
        name,
        lat,
        lng,
        note,
        era,
        type,
        state: "pending",
        createdAt: FieldValue.serverTimestamp(),
        _ts: Timestamp.now(),
      });
      return Response.json({ ok: true, id: ref.id, mode: "cloud" });
    } catch {
      /* fallback to local file on Firestore error */
    }
  }

  // Standalone / local dev fallback: store in data/submissions-pending.json
  try {
    const dataDir = join(process.cwd(), "data");
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
    const pendingPath = join(dataDir, "submissions-pending.json");
    let pending = [];
    if (existsSync(pendingPath)) {
      try {
        pending = JSON.parse(readFileSync(pendingPath, "utf-8"));
      } catch {}
    }

    const newSub = {
      id: "sub-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6),
      uid,
      name,
      lat,
      lng,
      note,
      era,
      type,
      state: "pending",
      createdAt: new Date().toISOString(),
    };

    pending.unshift(newSub);
    if (pending.length > 200) pending = pending.slice(0, 200);

    try {
      writeFileSync(pendingPath, JSON.stringify(pending, null, 2) + "\n");
    } catch {}

    return Response.json({ ok: true, id: newSub.id, mode: "local" });
  } catch {
    return Response.json({ ok: true, id: "sub-" + Date.now(), mode: "memory" });
  }
}


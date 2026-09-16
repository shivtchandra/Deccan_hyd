// "Spotted a heritage building not on the map?" — a pinned suggestion goes into
// the `submissions` Firestore collection for admin review. No auth wall beyond
// anonymous Firebase; lightly rate-limited per uid.

import { getAdminDb, verifyUid } from "../../../lib/firebaseAdmin.js";

export const dynamic = "force-dynamic";

const ERAS = ["earlier", "qutb-shahi", "asaf-jahi", "british-residency", "nizam-civic"];
const TYPES = ["tomb", "mosque", "baoli", "palace", "fort", "gateway", "civic", "mansion", "temple", "church", "tank", "cemetery"];

export async function POST(req) {
  const db = await getAdminDb();
  if (!db) return Response.json({ error: "backend-unavailable" }, { status: 503 });

  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const uid = await verifyUid(token);
  if (!uid) return Response.json({ error: "not-authenticated" }, { status: 401 });

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
  const era = ERAS.includes(body?.era) ? body.era : null;
  const type = TYPES.includes(body?.type) ? body.type : null;
  if (!name || Number.isNaN(lat) || Number.isNaN(lng)) {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const { FieldValue, Timestamp } = await import("firebase-admin/firestore");

  // crude rate limit: max 5 pending submissions per uid
  try {
    const mine = await db
      .collection("submissions")
      .where("uid", "==", uid)
      .where("state", "==", "pending")
      .count()
      .get();
    if ((mine.data().count || 0) >= 5) {
      return Response.json({ error: "rate-limited" }, { status: 429 });
    }
  } catch {
    /* count() unsupported on some emulators — skip the check */
  }

  try {
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
    return Response.json({ ok: true, id: ref.id });
  } catch {
    return Response.json({ error: "write-failed" }, { status: 500 });
  }
}

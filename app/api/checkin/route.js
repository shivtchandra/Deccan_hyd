// GPS-gated "I stood here" check-in. Mirrors the eateries claim route: a signed
// Firebase token is the identity, and the client's coordinates must be within
// CHECKIN_RADIUS_KM of the site. Writes are idempotent per (uid, siteId).
//
// Degrades cleanly: with no Firebase service account the route returns 503 and
// the client keeps the visit in the local passport only.

import { getAdminDb, verifyUid } from "../../../lib/firebaseAdmin.js";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const CHECKIN_RADIUS_KM = 0.25;

// Discovery-weighted: the endangered/obscure are worth more than the famous,
// to nudge exploration past Charminar & Golconda.
const POINTS_BY_STATUS = { "at-risk": 25, lost: 25, unprotected: 22, "intach-listed": 15, "state-protected": 12, "asi-protected": 10 };
const DEFAULT_POINTS = 12;

let idxCache = null;
function index() {
  if (idxCache) return idxCache;
  const raw = readFileSync(join(process.cwd(), "public", "sites-index.json"), "utf-8");
  idxCache = new Map(JSON.parse(raw).map((s) => [s.id, s]));
  return idxCache;
}

function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export async function GET(req) {
  const db = await getAdminDb();
  if (!db) return Response.json({ popular: [] });
  const params = new URL(req.url).searchParams;
  const top = Math.min(Number(params.get("top")) || 20, 50);
  try {
    if (params.get("board") === "explorers") {
      const snap = await db.collection("explorers").orderBy("points", "desc").limit(top).get();
      const explorers = snap.docs.map((d) => {
        const x = d.data();
        return { uid: d.id, name: x.name || "Explorer", points: x.points || 0, visits: x.visits || 0 };
      });
      return Response.json({ explorers });
    }
    const snap = await db.collection("siteStats").orderBy("checkins", "desc").limit(top).get();
    const popular = snap.docs.map((d) => ({ id: d.id, checkins: d.data().checkins || 0 }));
    return Response.json({ popular });
  } catch {
    return Response.json({ popular: [], explorers: [] });
  }
}

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
  const { siteId, lat, lng, name } = body || {};
  if (!siteId || typeof lat !== "number" || typeof lng !== "number") {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const site = index().get(siteId);
  if (!site) return Response.json({ error: "unknown-site" }, { status: 404 });

  const dist = haversineKm({ lat: site.lat, lng: site.lng }, { lat, lng });
  if (dist > CHECKIN_RADIUS_KM) {
    return Response.json(
      { error: "too-far", distanceKm: Math.round(dist * 100) / 100, radiusKm: CHECKIN_RADIUS_KM },
      { status: 403 }
    );
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  const visitRef = db.collection("checkins").doc(`${uid}__${siteId}`);
  const statRef = db.collection("siteStats").doc(siteId);
  const explorerRef = db.collection("explorers").doc(uid);
  const cleanName = (name || "").toString().trim().slice(0, 24) || "Explorer";
  const points = POINTS_BY_STATUS[site.status] ?? DEFAULT_POINTS;

  try {
    const result = await db.runTransaction(async (tx) => {
      const existing = await tx.get(visitRef);
      if (existing.exists) return { already: true };
      tx.set(visitRef, {
        uid,
        siteId,
        era: site.era ?? null,
        type: site.type ?? null,
        status: site.status ?? null,
        lat,
        lng,
        createdAt: FieldValue.serverTimestamp(),
      });
      tx.set(statRef, { checkins: FieldValue.increment(1), name: site.name ?? siteId }, { merge: true });
      tx.set(
        explorerRef,
        {
          name: cleanName,
          visits: FieldValue.increment(1),
          points: FieldValue.increment(points),
          [`eras.${site.era || "unknown"}`]: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      return { already: false, points };
    });
    return Response.json({ ok: true, already: result.already, awarded: result.points });
  } catch {
    return Response.json({ error: "write-failed" }, { status: 500 });
  }
}

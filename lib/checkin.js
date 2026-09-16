"use client";

// Client wrapper over /api/checkin. The GPS gate and any Firestore write live
// server-side. Locally we always record the visit in the passport; the server
// call is a bonus that only fires when Firebase is configured and the user is
// physically at the site.

import { getIdToken, getName } from "./identity.js";
import { markVisited } from "./passport.js";

export async function checkIn(siteId, coords) {
  // Local passport is the source of truth for the collection; never blocked.
  markVisited(siteId);

  if (!coords || typeof coords.lat !== "number") {
    return { ok: true, local: true, reason: "no-location" };
  }
  const token = await getIdToken();
  if (!token) return { ok: true, local: true, reason: "not-authenticated" };

  try {
    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ siteId, lat: coords.lat, lng: coords.lng, name: getName() }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, server: true, already: data.already, awarded: data.awarded };
    if (res.status === 403 && data.error === "too-far") {
      return { ok: true, local: true, reason: "too-far", distanceKm: data.distanceKm, radiusKm: data.radiusKm };
    }
    return { ok: true, local: true, reason: data.error || "backend" };
  } catch {
    return { ok: true, local: true, reason: "network" };
  }
}

export async function fetchPopular(limit = 8) {
  try {
    const res = await fetch(`/api/checkin?top=${limit}`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()).popular || [];
  } catch {
    return [];
  }
}

export async function fetchExplorers(limit = 25) {
  try {
    const res = await fetch(`/api/checkin?board=explorers&top=${limit}`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()).explorers || [];
  } catch {
    return [];
  }
}

"use client";

// Thin client over /api/route. Ordering + OSRM foot snapping happen server-side;
// this carries the selected ids and decodes the response.
//
// A route is shareable without a login: the ordered id list lives in the URL
// (?r=id1~id2~id3). encodeRoute / decodeRoute handle that.

export async function planRoute(siteIds) {
  if (!siteIds || siteIds.length < 2) {
    return { ok: false, reason: "need-two" };
  }
  try {
    const res = await fetch("/api/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteIds }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, reason: data.error || "backend" };
    return {
      ok: true,
      ordered: data.ordered,
      geometry: data.geometry || null,
      distanceKm: data.distanceKm,
      minutes: data.minutes,
      approx: !!data.approx,
    };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export function encodeRoute(siteIds) {
  return siteIds.join("~");
}

export function decodeRoute(param) {
  if (!param) return [];
  return param.split("~").map((s) => s.trim()).filter(Boolean);
}

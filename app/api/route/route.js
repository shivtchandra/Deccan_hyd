// Walking-route planner. Given a set of site ids:
//   1. order the stops  — nearest-neighbour from the first pick, then a 2-opt
//      pass on straight-line distance for small sets (<= 9 stops).
//   2. snap to footpaths — public OSRM `foot` service, keyless.
//   3. if OSRM is unreachable, fall back to a straight polyline through the
//      ordered stops with a 1.3x detour estimate (response carries approx:true).
//
// Cached in-memory by the sorted id set so repeated / shared routes are cheap.

import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const OSRM = process.env.OSRM_FOOT_URL || "https://router.project-osrm.org";
const WALK_KMH = 4.5;

let detailCache = null;
function detail() {
  if (detailCache) return detailCache;
  detailCache = JSON.parse(readFileSync(join(process.cwd(), "public", "sites-detail.json"), "utf-8"));
  return detailCache;
}

const routeCache = new Map();

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

function nearestNeighbour(stops) {
  const left = stops.slice(1);
  const path = [stops[0]];
  while (left.length) {
    const last = path[path.length - 1];
    let bi = 0,
      bd = Infinity;
    left.forEach((s, i) => {
      const d = haversineKm(last, s);
      if (d < bd) {
        bd = d;
        bi = i;
      }
    });
    path.push(left.splice(bi, 1)[0]);
  }
  return path;
}

function pathLen(p) {
  let d = 0;
  for (let i = 1; i < p.length; i++) d += haversineKm(p[i - 1], p[i]);
  return d;
}

function twoOpt(p) {
  if (p.length > 9) return p;
  let best = p;
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < best.length - 1; i++) {
      for (let k = i + 1; k < best.length; k++) {
        const cand = best.slice(0, i).concat(best.slice(i, k + 1).reverse(), best.slice(k + 1));
        if (pathLen(cand) + 1e-9 < pathLen(best)) {
          best = cand;
          improved = true;
        }
      }
    }
  }
  return best;
}

async function osrmFoot(ordered) {
  const coords = ordered.map((s) => `${s.lng},${s.lat}`).join(";");
  const url = `${OSRM}/route/v1/foot/${coords}?overview=full&geometries=geojson`;
  const res = await fetch(url, { signal: AbortSignal.timeout(7000) });
  if (!res.ok) throw new Error(`osrm ${res.status}`);
  const json = await res.json();
  const r = json.routes?.[0];
  if (!r) throw new Error("osrm empty");
  const distanceKm = Math.round((r.distance / 1000) * 100) / 100;
  // The public OSRM demo only carries the driving network, so its `duration`
  // is a car estimate. We keep its snapped geometry + distance and derive the
  // walking time ourselves at a steady strolling pace.
  return {
    geometry: r.geometry,
    distanceKm,
    minutes: Math.round((distanceKm / WALK_KMH) * 60),
  };
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  const siteIds = Array.isArray(body?.siteIds) ? body.siteIds.slice(0, 14) : [];
  if (siteIds.length < 2) return Response.json({ error: "need-two" }, { status: 400 });

  const key = [...siteIds].sort().join("|");
  if (routeCache.has(key)) return Response.json(routeCache.get(key));

  let map;
  try {
    map = detail();
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  const stops = siteIds
    .map((id) => map[id])
    .filter((s) => s && typeof s.lat === "number")
    .map((s) => ({ id: s.id, name: s.name, lat: s.lat, lng: s.lng }));
  if (stops.length < 2) return Response.json({ error: "unknown-sites" }, { status: 404 });

  const ordered = twoOpt(nearestNeighbour(stops));

  let payload;
  try {
    const snapped = await osrmFoot(ordered);
    payload = {
      ordered: ordered.map((s) => s.id),
      geometry: snapped.geometry,
      distanceKm: snapped.distanceKm,
      minutes: snapped.minutes,
      approx: false,
    };
  } catch {
    const km = Math.round(pathLen(ordered) * 1.3 * 100) / 100;
    payload = {
      ordered: ordered.map((s) => s.id),
      geometry: { type: "LineString", coordinates: ordered.map((s) => [s.lng, s.lat]) },
      distanceKm: km,
      minutes: Math.round((km / WALK_KMH) * 60),
      approx: true,
    };
  }

  routeCache.set(key, payload);
  return Response.json(payload);
}

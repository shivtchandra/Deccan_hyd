// Ranking + aggregation for the map. A map has no top-to-bottom, so quality is
// shown visually: rank sites, promote the best few in view to photo-hero pins,
// demote the rest to dots. Scoring uses the heritage scoreOf (protection status + photo + endangered).

import { scoreOf } from "./heritage.js";

export const AREA_ZOOM_MAX = 10.5;

let cache = { key: null, chosen: null };

function chooseHeroes(sites, cellLat, cellLng, key) {
  if (cache.key === key) return cache.chosen;
  const best = new Map();
  for (const s of sites) {
    const k = `${Math.floor(s.lat / cellLat)}:${Math.floor(s.lng / cellLng)}`;
    const cur = best.get(k);
    if (!cur || scoreOf(s) > scoreOf(cur)) best.set(k, s);
  }
  const ranked = [...best.values()].sort((a, b) => scoreOf(b) - scoreOf(a));
  const chosen = [];
  for (const s of ranked) {
    const clash = chosen.some((q) => {
      const dLat = (q.lat - s.lat) / cellLat;
      const dLng = (q.lng - s.lng) / cellLng;
      return dLat * dLat + dLng * dLng < 1.1;
    });
    if (!clash) chosen.push(s);
  }
  cache = { key, chosen };
  return chosen;
}

export function spotlight(sites, bounds, { cellLat, cellLng, filterKey = "" } = {}) {
  if (!bounds || !cellLat || !cellLng) return { heroes: [], rest: sites };
  const key = `${cellLat.toFixed(6)}:${cellLng.toFixed(6)}:${filterKey}:${sites.length}`;
  const chosen = chooseHeroes(sites, cellLat, cellLng, key);
  const visible = (s) =>
    s.lat >= bounds.south && s.lat <= bounds.north && s.lng >= bounds.west && s.lng <= bounds.east;
  const heroes = chosen.filter(visible);
  const heroIds = new Set(heroes.map((s) => s.id));
  return { heroes, rest: sites.filter((s) => visible(s) && !heroIds.has(s.id)) };
}

// Spatial clustering based on screen-space zoom grid (guarantees zero overlapping clusters/pins)
export function buildClusters(sites, zoom = 12) {
  if (!sites?.length) return [];

  // Zoom-adjusted clustering radius (degrees)
  const radiusDeg = zoom <= 10 ? 0.09 : zoom <= 11 ? 0.055 : zoom <= 12 ? 0.032 : 0.016;

  const clusters = [];
  const assigned = new Set();

  // Sort sites by score descending so the most iconic landmarks become cluster anchors
  const sorted = [...sites].sort((a, b) => scoreOf(b) - scoreOf(a));

  for (const s of sorted) {
    if (assigned.has(s.id)) continue;

    const clusterMembers = [s];
    assigned.add(s.id);

    for (const other of sorted) {
      if (assigned.has(other.id)) continue;
      const dLat = other.lat - s.lat;
      const dLng = other.lng - s.lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);

      if (dist <= radiusDeg) {
        clusterMembers.push(other);
        assigned.add(other.id);
      }
    }

    const count = clusterMembers.length;
    const bestSite = clusterMembers[0];
    const avgLat = clusterMembers.reduce((sum, item) => sum + item.lat, 0) / count;
    const avgLng = clusterMembers.reduce((sum, item) => sum + item.lng, 0) / count;

    clusters.push({
      id: `cluster:${bestSite.id}:${count}`,
      count,
      primarySite: bestSite,
      sites: clusterMembers,
      lat: avgLat,
      lng: avgLng,
      name: count > 1 ? (bestSite.area || bestSite.name) : bestSite.name,
    });
  }

  return clusters;
}

// Group sites into areas for fallback
export function buildAreas(sites) {
  return buildClusters(sites, 12);
}

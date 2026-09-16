// Domain vocabulary for the Deccan Heritage Map: eras, structure types,
// protection status, and the ranking used to promote "hero" pins.

export const ERAS = {
  earlier: { label: "Pre-Qutb Shahi", color: "#8E44AD", note: "Kakatiya / early Golconda, before 1518" },
  "qutb-shahi": { label: "Qutb Shahi", color: "#0097A7", note: "1518–1687" },
  "asaf-jahi": { label: "Asaf Jahi", color: "#D97706", note: "Nizams, 1724–1948" },
  "british-residency": { label: "British Residency", color: "#D35400", note: "Company & Raj presence" },
  "nizam-civic": { label: "Nizam-era Civic", color: "#27AE60", note: "Public works, ~1880–1948" },
  "post-independence": { label: "Post-Independence", color: "#C0392B", note: "1948–present" },
};

export const ERA_ORDER = ["earlier", "qutb-shahi", "asaf-jahi", "british-residency", "nizam-civic", "post-independence"];

export const TYPES = {
  tomb: "Tomb",
  mosque: "Mosque",
  baoli: "Stepwell",
  palace: "Palace",
  fort: "Fort",
  gateway: "Gateway",
  civic: "Civic building",
  mansion: "Mansion / Deodi",
  temple: "Temple",
  church: "Church",
  tank: "Tank / Lake",
  cemetery: "Cemetery",
};

export const STATUS = {
  "asi-protected": { label: "ASI protected", rank: 4 },
  "state-protected": { label: "State protected", rank: 3 },
  "intach-listed": { label: "INTACH listed", rank: 2 },
  unprotected: { label: "Unprotected", rank: 1 },
  "at-risk": { label: "At risk", rank: 1 },
  lost: { label: "Lost / demolished", rank: 0 },
};

export const ACCESS = {
  open: "Open access",
  ticketed: "Ticketed",
  restricted: "Restricted entry",
  ruin: "Ruin — open ground",
  private: "Private — view from outside",
};

export function eraColor(era) {
  return ERAS[era]?.color || "#948567";
}

export function eraLabel(era) {
  return ERAS[era]?.label || "Unknown era";
}

export function typeLabel(type) {
  return TYPES[type] || "Structure";
}

export function statusLabel(status) {
  return STATUS[status]?.label || "Unlisted";
}

// A site's prominence. Protection status is the backbone; a photo and a written
// summary lift it; anything flagged at-risk or lost is force-promoted so the
// conservation layer stays visible even when it's an obscure ruin.
export function scoreOf(s) {
  const base = (STATUS[s.status]?.rank ?? 1) * 2;
  const hasPhoto = s.hasPhoto || (s.photos && s.photos.length) ? 1.6 : 0;
  const hasText = s.summary && s.summary.length > 40 ? 1.2 : 0;
  const wikidata = s.wikidata ? 0.8 : 0;
  const endangered = s.status === "at-risk" || s.status === "lost" ? 6 : 0;
  return base + hasPhoto + hasText + wikidata + endangered;
}

// Client-side filter. `f` = { eras:Set, types:Set, statuses:Set, atRiskOnly:bool, getawaysOnly:bool, q:string }
export function matchesFilter(s, f) {
  if (f.eras?.size && !f.eras.has(s.era)) return false;
  if (f.types?.size && !f.types.has(s.type)) return false;
  if (f.statuses?.size && !f.statuses.has(s.status)) return false;
  if (f.atRiskOnly && !(s.status === "at-risk" || s.status === "unprotected" || s.status === "lost"))
    return false;
  if (f.getawaysOnly && !s.isGetaway) return false;
  if (f.q) {
    const q = f.q.toLowerCase();
    const hay = (s.name + " " + (s.altNames || []).join(" ") + " " + (s.area || "")).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

// Great-circle distance in km between {lat,lng} points.
export function haversineKm(a, b) {
  if (!a || !b) return null;
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// Human distance: "450 m" / "2.4 km" / "12 km".
export function distanceLabel(km) {
  if (km == null) return "";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function photoUrl(id) {
  return `/photos/${id}.jpg`;
}

export function thumbUrl(id) {
  return `/photos/thumb/${id}.jpg`;
}

export const BRAND = {
  accent: "#C98A2B",
  ink: "#2b2119",
  paper: "#f5efe3",
};

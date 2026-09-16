"use client";

// Zero-auth collection state in localStorage: no sign-up wall between
// "I visited" and it being recorded. Every access is guarded — a blocked or
// cleared store renders as "nothing collected yet", never throws.

const KEY = "dhm-passport-v1";
const EMPTY = { visited: {}, saved: {} };

export function getState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw);
    return { visited: parsed.visited ?? {}, saved: parsed.saved ?? {} };
  } catch {
    return { ...EMPTY };
  }
}

function write(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode / quota — memory-only for this session */
  }
  return state;
}

export function toggleVisited(id) {
  const s = getState();
  if (s.visited[id]) delete s.visited[id];
  else {
    s.visited[id] = new Date().toISOString();
    delete s.saved[id];
  }
  return write(s);
}

export function toggleSaved(id) {
  const s = getState();
  if (s.saved[id]) delete s.saved[id];
  else s.saved[id] = new Date().toISOString();
  return write(s);
}

export function markVisited(id) {
  const s = getState();
  if (!s.visited[id]) s.visited[id] = new Date().toISOString();
  delete s.saved[id];
  return write(s);
}

export function clearAll() {
  return write({ visited: {}, saved: {} });
}

// "unvisited" | "saved" | "visited" — drives pin appearance.
export function stateOf(passport, id) {
  if (passport.visited[id]) return "visited";
  if (passport.saved[id]) return "saved";
  return "unvisited";
}

// Completion per era, for the passport panel bars.
export function progressByEra(sites, passport) {
  const eras = {};
  for (const s of sites) {
    const e = s.era || "earlier";
    (eras[e] ??= { era: e, total: 0, visited: 0 }).total++;
    if (passport.visited[s.id]) eras[e].visited++;
  }
  return Object.values(eras).sort((a, b) => b.total - a.total);
}

export function stats(sites, passport) {
  const visitedIds = new Set(Object.keys(passport.visited));
  const visited = sites.filter((s) => visitedIds.has(s.id));
  const byType = visited.reduce((m, s) => ((m[s.type] = (m[s.type] || 0) + 1), m), {});
  return {
    visitedCount: visited.length,
    savedCount: Object.keys(passport.saved).length,
    totalCount: sites.length,
    atRiskVisited: visited.filter((s) => s.status === "at-risk" || s.status === "unprotected").length,
    byType,
    visited,
  };
}

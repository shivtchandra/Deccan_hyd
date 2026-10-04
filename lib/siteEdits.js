// Edit layer for the built-in sites (data/sites.json → public/sites-*.json).
// Those files are baked in at build time, so the editorial desk stores its changes
// separately — one record per site with only the fields that differ, plus a hidden
// flag — and every public read applies them on top. "Revert to original" deletes
// the record.
//
// Storage mirrors findingsStore: Firestore "siteEdits" when FIREBASE_SERVICE_ACCOUNT
// is set, otherwise data/site-edits.json on disk (local dev). Server-only.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { revalidatePath } from "next/cache";
import { getAdminDb } from "./firebaseAdmin.js";
import { cleanSiteFields, getFinding, listFindings, canEditSite } from "./findingsStore.js";

const DATA_DIR = join(process.cwd(), "data");
const LOCAL_FILE = join(DATA_DIR, "site-edits.json");
const COLLECTION = "siteEdits";

// Fields of a site-index row that an edit can change (the rest come from the detail record).
const INDEX_FIELDS = ["name", "lat", "lng", "era", "type", "status", "access", "area", "summary"];

// ---- built-in data ----
let detailCache = null;
let indexCache = null;

export function builtInSites() {
  if (detailCache) return detailCache;
  try {
    detailCache = JSON.parse(readFileSync(join(process.cwd(), "public", "sites-detail.json"), "utf-8"));
  } catch {
    detailCache = {};
    try {
      for (const s of JSON.parse(readFileSync(join(DATA_DIR, "sites.json"), "utf-8"))) if (s?.id) detailCache[s.id] = s;
    } catch {}
  }
  return detailCache;
}

function builtInIndex() {
  if (indexCache) return indexCache;
  try {
    indexCache = JSON.parse(readFileSync(join(process.cwd(), "public", "sites-index.json"), "utf-8"));
  } catch {
    indexCache = [];
  }
  return indexCache;
}

// ---- storage ----
function readLocal() {
  if (!existsSync(LOCAL_FILE)) return {};
  try {
    const map = JSON.parse(readFileSync(LOCAL_FILE, "utf-8"));
    return map && typeof map === "object" && !Array.isArray(map) ? map : {};
  } catch {
    return {};
  }
}

function writeLocal(map) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(LOCAL_FILE, JSON.stringify(map, null, 2) + "\n");
}

export async function listSiteEdits() {
  const db = await getAdminDb();
  if (db) {
    const snap = await db.collection(COLLECTION).limit(1000).get();
    return Object.fromEntries(snap.docs.map((d) => [d.id, d.data()]));
  }
  return readLocal();
}

export async function getSiteEdit(id) {
  const db = await getAdminDb();
  if (db) {
    const snap = await db.collection(COLLECTION).doc(id).get();
    return snap.exists ? snap.data() : null;
  }
  return readLocal()[id] || null;
}

async function saveSiteEdit(record) {
  const db = await getAdminDb();
  const empty = !record.hidden && Object.keys(record.changes || {}).length === 0;
  if (db) {
    const ref = db.collection(COLLECTION).doc(record.id);
    if (empty) await ref.delete();
    else await ref.set(record);
    return empty ? null : record;
  }
  const map = readLocal();
  if (empty) delete map[record.id];
  else map[record.id] = record;
  writeLocal(map);
  return empty ? null : record;
}

// ---- applying edits ----
export function applyEdit(base, edit) {
  if (!edit) return base;
  return { ...base, ...(edit.changes || {}) };
}

// Patch for a public/sites-index.json row; the map applies it client-side.
export function indexPatch(edit) {
  const c = edit.changes || {};
  const patch = { id: edit.id, hidden: !!edit.hidden };
  for (const k of INDEX_FIELDS) if (k in c) patch[k] = c[k];
  if ("photos" in c) {
    patch.hasPhoto = c.photos.length > 0;
    patch.thumb = c.photos[0]?.thumb || c.photos[0]?.url || null;
  }
  return patch;
}

const sameValue = (a, b) =>
  typeof a === "number" || typeof b === "number"
    ? Math.abs(Number(a) - Number(b)) < 1e-6
    : String(a ?? "") === String(b ?? "");

// Saves the editor's full form for a built-in site as a diff against the original.
export async function updateBuiltInSite(id, input, editor) {
  const base = builtInSites()[id];
  if (!base) throw new Error("not-found");
  const prev = await getSiteEdit(id);
  const { photo, summaryAuto, ...fields } = cleanSiteFields(input, base);

  const changes = {};
  for (const [k, v] of Object.entries(fields)) if (!sameValue(v, base[k])) changes[k] = v;
  if (photo !== undefined) {
    const orig = base.photos?.[0];
    if ((photo?.url || "") !== (orig?.url || "") || (photo && photo.credit !== (orig?.credit || ""))) {
      changes.photos = photo ? [{ url: photo.url, thumb: photo.url, credit: photo.credit, licence: photo.url === orig?.url ? orig.licence || "" : "" }] : [];
    }
  }
  return saveSiteEdit({ id, changes, hidden: !!prev?.hidden, updatedBy: editor.name, updatedAt: new Date().toISOString() });
}

export async function setBuiltInHidden(id, hidden, editor) {
  if (!builtInSites()[id]) throw new Error("not-found");
  const prev = await getSiteEdit(id);
  return saveSiteEdit({ id, changes: prev?.changes || {}, hidden: !!hidden, updatedBy: editor.name, updatedAt: new Date().toISOString() });
}

export async function revertBuiltInSite(id, editor) {
  if (!builtInSites()[id]) throw new Error("not-found");
  const prev = await getSiteEdit(id);
  return saveSiteEdit({ id, changes: {}, hidden: !!prev?.hidden, updatedBy: editor.name, updatedAt: new Date().toISOString() });
}

// ---- public reads ----
// One site as the public map / site page should show it, or null when it is
// unknown or hidden. Edits are best-effort: a storage error falls back to the original.
export async function getPublicSite(id) {
  const base = builtInSites()[id];
  if (base) {
    const edit = await getSiteEdit(id).catch(() => null);
    return edit?.hidden ? null : applyEdit(base, edit);
  }
  if (id?.startsWith("field-")) {
    const finding = await getFinding(id).catch(() => null);
    return finding && !finding.hidden ? finding : null;
  }
  return null;
}

// Regenerates the static /sites/[id] page after a change (no-op outside a Next request).
export function refreshSitePage(id) {
  try {
    revalidatePath(`/sites/${id}`);
  } catch {}
}

// ---- editorial desk ----
// Every site the desk manages: built-in (with edits applied) and desk-added, hidden included.
export async function listDeskSites(editor) {
  const [edits, findings] = await Promise.all([listSiteEdits(), listFindings({ includeHidden: true })]);
  const hasPhoto = new Map(builtInIndex().map((r) => [r.id, r.hasPhoto]));
  const rows = [];

  for (const f of findings) {
    rows.push({ ...slim(f), source: "desk", edited: false, canEdit: canEditSite(editor, f) });
  }
  for (const base of Object.values(builtInSites())) {
    const edit = edits[base.id];
    const site = applyEdit(base, edit);
    rows.push({
      ...slim(site),
      hasPhoto: site.photos ? site.photos.length > 0 : !!hasPhoto.get(base.id),
      source: "builtin",
      hidden: !!edit?.hidden,
      edited: Object.keys(edit?.changes || {}).length > 0,
      editedFields: Object.keys(edit?.changes || {}),
      updatedBy: edit?.updatedBy || null,
      updatedAt: edit?.updatedAt || null,
      canEdit: editor.canEditAll,
    });
  }
  return rows;
}

function slim(s) {
  return {
    id: s.id,
    name: s.name,
    summary: s.summary || "",
    summaryAuto: !!s.summaryAuto,
    story: s.story || "",
    lat: s.lat,
    lng: s.lng,
    era: s.era,
    type: s.type,
    status: s.status,
    access: s.access,
    yearBuilt: s.yearBuilt ?? "",
    area: s.area || "",
    photo: s.photos?.[0] ? { url: s.photos[0].url, credit: s.photos[0].credit || "" } : null,
    hasPhoto: !!(s.photos && s.photos.length),
    hidden: !!s.hidden,
    addedBy: s.addedBy || null,
    updatedBy: s.updatedBy || null,
    createdAt: s.createdAt || null,
    updatedAt: s.updatedAt || null,
  };
}

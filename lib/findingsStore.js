// Desk-added sites ("findings"): new sites logged from the editorial desk (/admin)
// or the field desk (/admin/field). They go live on the map immediately (no review queue).
//
// Storage: Firestore "findings" + Cloud Storage photos when FIREBASE_SERVICE_ACCOUNT
// is set (production). Otherwise data/findings.json + data/uploads/findings/ on
// disk (local dev). Server-only.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, basename } from "path";
import { randomUUID, timingSafeEqual } from "crypto";
import { getAdminDb, getAdminBucket } from "./firebaseAdmin.js";
import { ERAS, TYPES, STATUS, ACCESS } from "./heritage.js";

const DATA_DIR = join(process.cwd(), "data");
const LOCAL_FILE = join(DATA_DIR, "findings.json");
export const LOCAL_UPLOAD_DIR = join(DATA_DIR, "uploads", "findings");

const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const IMAGE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

// ---- auth ----
// Three kinds of key, all server-side env vars (fail-closed when unset):
//   ADMIN_SECRET   → role "admin"  — owner key, full editorial rights
//   EDITOR_SECRET  → role "editor" — a colleague's key, same editorial rights; rotate it on its own
//   FIELD_EDITORS  → role "field"  — "Ravi:long-random-key,Asha:another-key"; may add sites and
//                                    edit / hide only the ones they added
function same(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function makeEditor(name, role) {
  return { name, role, isAdmin: role === "admin", canEditAll: role === "admin" || role === "editor" };
}

export function editorFromRequest(req) {
  const key = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!key) return null;
  const admin = process.env.ADMIN_SECRET;
  if (admin && same(admin, key)) return makeEditor("Admin", "admin");

  const editorSecret = process.env.EDITOR_SECRET;
  if (editorSecret && same(editorSecret, key)) return makeEditor("Editorial Contributor", "editor");

  for (const pair of (process.env.FIELD_EDITORS || "").split(",")) {
    const i = pair.lastIndexOf(":");
    if (i <= 0) continue;
    const name = pair.slice(0, i).trim();
    const secret = pair.slice(i + 1).trim();
    if (name && secret && same(secret, key)) return makeEditor(name, "field");
  }
  return null;
}

// Editors with canEditAll may change any site; field editors only their own findings.
export function canEditSite(editor, site) {
  if (!editor || !site) return false;
  if (editor.canEditAll) return true;
  return !!site.isFinding && site.addedBy === editor.name;
}

// ---- local file helpers ----
function readLocal() {
  if (!existsSync(LOCAL_FILE)) return [];
  try {
    const list = JSON.parse(readFileSync(LOCAL_FILE, "utf-8"));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeLocal(list) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(LOCAL_FILE, JSON.stringify(list, null, 2) + "\n");
}

const byNewest = (a, b) => (b.createdAt || "").localeCompare(a.createdAt || "");

// ---- reads ----
export async function listFindings({ addedBy = null, includeHidden = false } = {}) {
  const db = await getAdminDb();
  let rows;
  if (db) {
    let q = db.collection("findings");
    if (addedBy) q = q.where("addedBy", "==", addedBy);
    const snap = await q.limit(500).get();
    rows = snap.docs.map((d) => d.data());
  } else {
    rows = readLocal();
    if (addedBy) rows = rows.filter((r) => r.addedBy === addedBy);
  }
  if (!includeHidden) rows = rows.filter((r) => !r.hidden);
  return rows.sort(byNewest);
}

export async function getFinding(id) {
  const db = await getAdminDb();
  if (db) {
    const snap = await db.collection("findings").doc(id).get();
    return snap.exists ? snap.data() : null;
  }
  return readLocal().find((r) => r.id === id) || null;
}

// ---- writes ----
async function saveFinding(record) {
  const db = await getAdminDb();
  if (db) {
    await db.collection("findings").doc(record.id).set(record);
    return record;
  }
  const list = readLocal();
  const idx = list.findIndex((r) => r.id === record.id);
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  writeLocal(list);
  return record;
}

async function savePhoto(file) {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("bad-photo-type");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("photo-too-large");
  const buf = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}.${ext}`;

  const bucket = await getAdminBucket();
  if (bucket) {
    const path = `findings/${name}`;
    const token = randomUUID();
    await bucket.file(path).save(buf, {
      contentType: file.type,
      metadata: { cacheControl: "public, max-age=31536000", metadata: { firebaseStorageDownloadTokens: token } },
    });
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
  }
  if (await getAdminDb()) throw new Error("storage-bucket-missing");

  if (!existsSync(LOCAL_UPLOAD_DIR)) mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
  writeFileSync(join(LOCAL_UPLOAD_DIR, name), buf);
  return `/api/findings/photo/${name}`;
}

export function localPhotoPath(name) {
  const safe = basename(name || "");
  if (!/^[a-z0-9-]+\.(jpg|png|webp)$/.test(safe)) return null;
  return join(LOCAL_UPLOAD_DIR, safe);
}

function slug(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}

export function summarize(text) {
  if (text.length <= 220) return text;
  const cut = text.slice(0, 220);
  const dot = cut.lastIndexOf(". ");
  return dot > 80 ? cut.slice(0, dot + 1) : cut.replace(/\s+\S*$/, "") + "…";
}

const str = (v, max) => (v == null ? "" : v.toString().trim().slice(0, max));
// A vocabulary value is accepted when it is known, or when it is the value the record already has
// (built-in data uses a few types/access levels outside the editor vocabulary).
const pick = (vocab, v, current, fallback) => (v && (vocab[v] || v === current) ? v : current || fallback);

// Validates the editable fields shared by desk-added and built-in sites.
// `input` is a plain object: name, story (or description), summary, lat, lng, era, type,
// status, access, yearBuilt, area, and optionally photoUrl + photoCredit.
export function cleanSiteFields(input, current = null) {
  const name = str(input.name, 120);
  const story = str(input.story ?? input.description, 8000);
  const lat = Number(input.lat);
  const lng = Number(input.lng);
  if (!name || !story) throw new Error("name-and-description-required");
  if (input.lat === "" || input.lng === "" || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    throw new Error("location-required");
  }
  const customSummary = str(input.summary, 400);
  const fields = {
    name,
    story,
    summary: customSummary || summarize(story),
    summaryAuto: !customSummary,
    lat: Math.round(lat * 1e6) / 1e6,
    lng: Math.round(lng * 1e6) / 1e6,
    era: pick(ERAS, input.era, current?.era, "asaf-jahi"),
    type: pick(TYPES, input.type, current?.type, "civic"),
    status: pick(STATUS, input.status, current?.status, "unprotected"),
    access: pick(ACCESS, input.access, current?.access, "open"),
    yearBuilt: str(input.yearBuilt ?? current?.yearBuilt, 40),
    area: str(input.area ?? current?.area, 80),
  };
  if ("photoUrl" in input) {
    const url = str(input.photoUrl, 1000);
    if (url && !/^(https?:\/\/|\/)/i.test(url)) throw new Error("bad-photo-url");
    fields.photo = url ? { url, credit: str(input.photoCredit, 160) } : null;
  }
  return fields;
}

// Field desk (multipart): name, description, lat, lng, type, era, yearBuilt, area, access,
// keepPhotos (JSON array of existing photo urls, edit only), photo_N + thumb_N files.
export async function upsertFindingFromForm(form, editor, existing = null) {
  const input = {};
  for (const k of ["name", "description", "lat", "lng", "type", "era", "yearBuilt", "area", "access"]) input[k] = form.get(k);
  const fields = cleanSiteFields(input, existing);

  let keep = existing?.photos || [];
  if (existing && typeof form.has === "function" && form.has("keepPhotos")) {
    try {
      const urls = JSON.parse(form.get("keepPhotos") || "[]");
      keep = (existing.photos || []).filter((p) => urls.includes(p.url));
    } catch {
      keep = existing.photos || [];
    }
  }

  const added = [];
  for (let i = 0; i < MAX_PHOTOS && keep.length + added.length < MAX_PHOTOS; i++) {
    const photo = form.get(`photo_${i}`);
    if (!photo || typeof photo === "string" || !photo.size) continue;
    const thumb = form.get(`thumb_${i}`);
    const url = await savePhoto(photo);
    const thumbUrl = thumb && typeof thumb !== "string" && thumb.size ? await savePhoto(thumb) : url;
    added.push({ url, thumb: thumbUrl, credit: `Field photo · ${editor.name}`, licence: "Mapping HYD" });
  }
  return saveFinding(buildFinding(fields, [...keep, ...added], editor, existing));
}

// Editorial desk (JSON). A photo is given as a URL rather than an upload.
export async function upsertFinding(input, editor, existing = null) {
  const fields = cleanSiteFields(input, existing);
  let photos = existing?.photos || [];
  if ("photo" in fields) {
    const prev = photos[0];
    photos = fields.photo
      ? [{ url: fields.photo.url, thumb: prev?.url === fields.photo.url ? prev.thumb || prev.url : fields.photo.url, credit: fields.photo.credit || `Photo · ${editor.name}`, licence: prev?.url === fields.photo.url ? prev.licence || "" : "" }]
      : [];
  }
  return saveFinding(buildFinding(fields, photos, editor, existing));
}

function buildFinding({ photo, ...fields }, photos, editor, existing) {
  const now = new Date().toISOString();
  return {
    ...(existing || {}),
    ...fields,
    id: existing?.id || `field-${slug(fields.name) || "site"}-${randomUUID().slice(0, 4)}`,
    photos,
    hasPhoto: photos.length > 0,
    thumb: photos[0]?.thumb || photos[0]?.url || null,
    isFinding: true,
    hidden: existing?.hidden || false,
    needsReview: false,
    addedBy: existing?.addedBy || editor.name,
    updatedBy: editor.name,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    verifiedAt: now.slice(0, 10),
  };
}

export async function setFindingHidden(existing, hidden, editor = null) {
  return saveFinding({ ...existing, hidden: !!hidden, updatedBy: editor?.name || existing.updatedBy || null, updatedAt: new Date().toISOString() });
}

// Slim row matching public/sites-index.json so the map can merge it in.
export function toIndexRow(f) {
  return {
    id: f.id,
    name: f.name,
    lat: f.lat,
    lng: f.lng,
    era: f.era,
    type: f.type,
    status: f.status,
    access: f.access,
    area: f.area,
    hasPhoto: !!f.hasPhoto,
    thumb: f.thumb || null,
    needsReview: false,
    curatedBy: f.addedBy,
    curatorNote: null,
    verifiedAt: f.verifiedAt,
    isGetaway: false,
    isFinding: true,
    summary: f.summary,
  };
}

// Maps a thrown error to a JSON response. Disk errors (e.g. EROFS on Vercel without
// Firebase configured) become 503 with a hint, validation errors 400.
export function errorResponse(err) {
  const msg = err?.message || "server-error";
  if (err?.code || msg === "storage-bucket-missing") {
    return Response.json(
      { error: "storage-unavailable", hint: "Set FIREBASE_SERVICE_ACCOUNT and FIREBASE_STORAGE_BUCKET to save findings in production." },
      { status: 503 },
    );
  }
  const status = msg === "not-found" ? 404 : msg === "forbidden" ? 403 : /required|photo-|bad-/.test(msg) ? 400 : 500;
  return Response.json({ error: msg }, { status });
}

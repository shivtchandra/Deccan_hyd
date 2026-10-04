// Field findings: new sites logged by trusted field editors from /admin/field.
// They go live on the map immediately (no review queue).
//
// Storage: Firestore "findings" + Cloud Storage photos when FIREBASE_SERVICE_ACCOUNT
// is set (production). Otherwise data/findings.json + data/uploads/findings/ on
// disk (local dev). Server-only.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, basename } from "path";
import { randomUUID, timingSafeEqual } from "crypto";
import { getAdminDb, getAdminBucket } from "./firebaseAdmin.js";
import { ERAS, TYPES, ACCESS } from "./heritage.js";

const DATA_DIR = join(process.cwd(), "data");
const LOCAL_FILE = join(DATA_DIR, "findings.json");
export const LOCAL_UPLOAD_DIR = join(DATA_DIR, "uploads", "findings");

const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const IMAGE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

// ---- auth ----
// FIELD_EDITORS="Ravi:long-random-key,Asha:another-key". ADMIN_SECRET also works (as "Admin").
function same(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function editorFromRequest(req) {
  const key = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!key) return null;
  for (const pair of (process.env.FIELD_EDITORS || "").split(",")) {
    const i = pair.lastIndexOf(":");
    if (i <= 0) continue;
    const name = pair.slice(0, i).trim();
    const secret = pair.slice(i + 1).trim();
    if (name && secret && same(secret, key)) return { name, isAdmin: false };
  }
  const admin = process.env.ADMIN_SECRET || "mapping-hyd-admin";
  if (admin && same(admin, key)) return { name: "Admin", isAdmin: true };
  return null;
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

function summarize(text) {
  if (text.length <= 220) return text;
  const cut = text.slice(0, 220);
  const dot = cut.lastIndexOf(". ");
  return dot > 80 ? cut.slice(0, dot + 1) : cut.replace(/\s+\S*$/, "") + "…";
}

const str = (v, max) => (v == null ? "" : v.toString().trim().slice(0, max));

// Builds/updates a finding from multipart form data.
// Fields: name, description, lat, lng, type, era, yearBuilt, area, access,
// keepPhotos (JSON array of existing photo urls, edit only), photo_N + thumb_N files.
export async function upsertFindingFromForm(form, editor, existing = null) {
  const name = str(form.get("name"), 120);
  const description = str(form.get("description"), 4000);
  const lat = Number(form.get("lat"));
  const lng = Number(form.get("lng"));
  if (!name || !description) throw new Error("name-and-description-required");
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    throw new Error("location-required");
  }

  const type = TYPES[form.get("type")] ? form.get("type") : "civic";
  const era = ERAS[form.get("era")] ? form.get("era") : "asaf-jahi";
  const access = ACCESS[form.get("access")] ? form.get("access") : "open";

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
  const photos = [...keep, ...added];

  const now = new Date().toISOString();
  const record = {
    ...(existing || {}),
    id: existing?.id || `field-${slug(name) || "site"}-${randomUUID().slice(0, 4)}`,
    name,
    summary: summarize(description),
    story: description,
    lat: Math.round(lat * 1e6) / 1e6,
    lng: Math.round(lng * 1e6) / 1e6,
    type,
    era,
    yearBuilt: str(form.get("yearBuilt"), 40),
    area: str(form.get("area"), 80),
    access,
    status: existing?.status || "unprotected",
    photos,
    hasPhoto: photos.length > 0,
    thumb: photos[0]?.thumb || photos[0]?.url || null,
    isFinding: true,
    hidden: existing?.hidden || false,
    needsReview: false,
    addedBy: existing?.addedBy || editor.name,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    verifiedAt: now.slice(0, 10),
  };
  return saveFinding(record);
}

export async function setFindingHidden(existing, hidden) {
  return saveFinding({ ...existing, hidden: !!hidden, updatedAt: new Date().toISOString() });
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
  return Response.json({ error: msg }, { status: /required|photo-|bad-/.test(msg) ? 400 : 500 });
}

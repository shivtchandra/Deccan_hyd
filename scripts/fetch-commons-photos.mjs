// Download one lead image per site from Wikimedia Commons and record its
// licence + credit. Keyless. Only CC-BY, CC-BY-SA, CC0 and public-domain
// images are kept — anything else is skipped and the pin falls back to a
// drawn glyph. Photos land in public/photos/<id>.jpg; the licence metadata is
// written back into data/sites.json as s.photos[0].
//
// Usage: npm run seed:photos

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "data", "sites.json");
const photosDir = join(root, "public", "photos");
if (!existsSync(photosDir)) mkdirSync(photosDir, { recursive: true });

const UA = { "User-Agent": "deccan-heritage-map/0.1 (mapmyhyd.com; shivachandra9490@gmail.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const GAP = Number(process.env.FETCH_GAP_MS || 1500); // polite gap between API calls

// fetch with 429/5xx backoff so a rate-limit penalty doesn't zero the whole run.
async function politeFetch(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: UA });
    if (res.status !== 429 && res.status < 500) return res;
    const wait = 5000 * (attempt + 1); // 5s, 10s, 15s, 20s
    process.stdout.write(`  (rate-limited, waiting ${wait / 1000}s)\n`);
    await sleep(wait);
  }
  return fetch(url, { headers: UA });
}

// Commons LicenseShortName uses spaces ("CC BY-SA 4.0"), not hyphens.
const OK_LICENCE = /^(cc0|cc[ -]by([ -]sa)?([ -]\d(\.\d)?)?|public domain|pd[ -]|no restrictions)/i;

async function pageImageTitle(wikipediaUrl) {
  if (!wikipediaUrl) return null;
  const title = decodeURIComponent(wikipediaUrl.split("/wiki/")[1] || "").replace(/_/g, " ");
  if (!title) return null;
  const url =
    `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original&titles=` +
    encodeURIComponent(title);
  const res = await politeFetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const pages = json.query?.pages || {};
  const first = Object.values(pages)[0];
  return first?.original?.source || null;
}

async function commonsFileMeta(imageUrl) {
  // imageUrl like https://upload.wikimedia.org/.../Foo.jpg — derive File:Foo.jpg
  const fname = decodeURIComponent(imageUrl.split("/").pop().split("?")[0]);
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|url&titles=` +
    encodeURIComponent("File:" + fname);
  const res = await politeFetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const page = Object.values(json.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  const m = info.extmetadata || {};
  return {
    licence: (m.LicenseShortName?.value || m.License?.value || "").trim(),
    credit: (m.Artist?.value || "").replace(/<[^>]+>/g, "").trim() || "Wikimedia Commons",
    descUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fname)}`,
    fileUrl: info.url,
  };
}

async function download(url, dest) {
  const res = await politeFetch(url);
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) return false; // junk / 1px
  writeFileSync(dest, buf);
  return true;
}

async function main() {
  const sites = JSON.parse(readFileSync(dataPath, "utf-8"));
  let got = 0,
    skipped = 0;

  for (const s of sites) {
    if (s.photos && s.photos.length) continue;
    if (existsSync(join(photosDir, `${s.id}.jpg`))) {
      s.photos = s.photos || [{ url: `/photos/${s.id}.jpg`, credit: "Wikimedia Commons", licence: "unknown", source: "" }];
      continue;
    }

    let imageUrl = null;
    try {
      imageUrl = await pageImageTitle(s.wikipedia);
    } catch {}
    await sleep(GAP);
    if (!imageUrl) {
      skipped++;
      continue;
    }

    let meta = null;
    try {
      meta = await commonsFileMeta(imageUrl);
    } catch {}
    await sleep(GAP);

    if (!meta || !OK_LICENCE.test(meta.licence)) {
      skipped++;
      continue;
    }

    const ok = await download(meta.fileUrl || imageUrl, join(photosDir, `${s.id}.jpg`));
    await sleep(GAP);
    if (!ok) {
      skipped++;
      continue;
    }

    s.photos = [
      {
        url: `/photos/${s.id}.jpg`,
        credit: meta.credit,
        licence: meta.licence,
        source: meta.descUrl,
      },
    ];
    got++;
    console.log(`  ✓ ${s.id}  (${meta.licence})`);
  }

  writeFileSync(dataPath, JSON.stringify(sites, null, 2) + "\n");
  console.log(`fetch-commons-photos: ${got} photos, ${skipped} without a usable image`);
}

main().catch((e) => {
  console.error("fetch-commons-photos failed:", e);
  process.exit(1);
});

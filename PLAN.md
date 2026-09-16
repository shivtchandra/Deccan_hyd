# Deccan Heritage Map — Work Plan

Entry #6 in the Hyderabad series. Every monument, tomb, stepwell, palace, mosque, and Nizam-era building in Hyderabad on one map, filterable by era, with a build-your-own walking-route tool.

Forks the `hyderabad-eateries-map` skeleton. Same stack, same conventions.

---

## 1. Stack & conventions (inherited, do not reinvent)

| Concern | What eateries does — reuse it |
|---------|------------------------------|
| Framework | Next.js 14 app router, React 18, deploy Vercel |
| Basemap | `lib/mapStyle.js` — vector tiles from OpenFreeMap (keyless, free), MapLibre via `@maplibre/maplibre-gl-leaflet`. **No Google/CARTO map bill.** Reuse the cream style, swap palette to heritage tones. |
| Pins / clustering | Leaflet + `leaflet.markercluster`; hero-pin ranking pattern from `lib/spotlight.js` |
| Seed data | big `data/*.json` committed to repo; `scripts/*.mjs` for seeding (note: `.mjs`, not `.js`) |
| Anon identity | `lib/identity.js` — Firebase Anonymous Auth, stable uid, no sign-up wall |
| Local collection | `lib/passport.js` — localStorage, guarded reads, never throws |
| GPS-gated writes | `app/api/claim/route.js` — server verifies token + distance; clone it for check-ins |
| Server admin | `lib/firebaseAdmin.js` — `getAdminDb()`, `verifyUid()` |
| Cron | `app/api/cron/*` guarded by `CRON_SECRET` |
| Admin panel | `app/admin/page.jsx` guarded by `ADMIN_SECRET` |
| Photos | Google Places photo key exists — but heritage photos come from **Wikimedia Commons** instead (licensing, see M3) |

### Env (`.env.example`)

```
GOOGLE_MAPS_API_KEY=            # server: geocoding fallback + nearest-metro lookup during seed
NEXT_PUBLIC_FIREBASE_*=         # client (6 vars, copy from eateries)
FIREBASE_SERVICE_ACCOUNT=       # server admin
ADMIN_SECRET=
CRON_SECRET=
# no OSRM key (public foot router), no Overpass key, no Commons key
```

### Brand

- Accent: amber / ochre `#C98A2B` (per SOCIAL-LAUNCH-BRIEF, "06 Heritage").
- Era sub-palette (pins + filter chips): Qutb Shahi `#3E7C8C`, Asaf Jahi `#C98A2B`, British Residency `#8C5A3C`, Nizam-civic `#6B7B4A`, Earlier `#7A6E8C`.
- Corner tag on all posters: `HYDERABAD SERIES / 06`.

---

## 2. Data model

`data/sites.json` — array of:

```json
{
  "id": "qutb-shahi-tombs",
  "name": "Qutb Shahi Tombs",
  "altNames": ["Seven Tombs", "Ibrahim Bagh"],
  "lat": 17.3949, "lng": 78.3927,
  "era": "qutb-shahi",
  "yearBuilt": "1543–1672",
  "type": "tomb",
  "status": "asi-protected",
  "access": "ticketed",
  "ticket": { "inr": 20, "hours": "09:00–17:30", "closedOn": "Friday" },
  "nearestMetro": "Jubilee Hills Check Post",
  "summary": "One plain-language paragraph. Factual, ~60 words.",
  "significance": ["Necropolis of seven Qutb Shahi sultans", "Largest such cluster in one place in the world"],
  "sources": [
    { "label": "ASI", "url": "https://asi.nic.in/..." },
    { "label": "Deccan Archive", "url": "https://www.thedeccanarchive.com/..." }
  ],
  "photos": [
    { "url": "https://upload.wikimedia.org/...", "credit": "Photographer name", "license": "CC BY-SA 4.0", "source": "https://commons.wikimedia.org/wiki/File:..." }
  ],
  "wikidata": "Q2338524",
  "wikipedia": "https://en.wikipedia.org/wiki/Qutb_Shahi_tombs",
  "osmId": "way/123456",
  "addedBy": "seed",
  "verifiedAt": "2026-08-31",
  "needsReview": false
}
```

**Enums**
- `era`: `qutb-shahi` | `asaf-jahi` | `british-residency` | `nizam-civic` | `earlier` (Kakatiya / Golconda pre-1518)
- `type`: `tomb` | `mosque` | `baoli` | `palace` | `fort` | `gateway` | `civic` | `mansion` | `temple` | `church` | `tank` | `cemetery`
- `status`: `asi-protected` | `state-protected` | `intach-listed` | `unprotected` | `at-risk` | `lost`
- `access`: `open` | `ticketed` | `restricted` | `ruin` | `private`

`data/routes.json` — curated preset walks:

```json
{
  "id": "qutb-shahi-precinct",
  "title": "Qutb Shahi Precinct",
  "era": "qutb-shahi",
  "siteIds": ["qutb-shahi-tombs", "badshahi-ashurkhana", "..."],
  "notes": "~2.5 hrs. Start early, little shade.",
  "distanceKm": 3.1,
  "minutes": 55
}
```

Firestore collections (runtime, small):
- `checkins/{uid}` → `{ siteIds: {id: iso}, count }`
- `siteStats/{siteId}` → `{ checkins: n }` (for a "most-visited this month" strip)
- `submissions/{autoId}` → user-suggested sites, admin-reviewed
- `routeCache/{hash}` → cached OSRM route responses

---

## 3. Milestones

Estimates assume solo, ~2 focused days per "day" unit. Total ≈ 9–11 working days.

### M0 — Scaffold (0.5 day)

- Copy `hyderabad-eateries-map/` → `deccan-heritage-map/`. Strip: eateries data, zomato scripts, offers cron, theme voting, sticker/diary/receipt code, food categories.
- Keep: `lib/firebase.js`, `lib/firebaseAdmin.js`, `lib/identity.js`, `lib/passport.js`, `lib/mapStyle.js`, `lib/spotlight.js`, map + card-rail + detail-sheet + filter-chips + bottom-nav components.
- New Firebase project (or reuse with a `heritage-` collection prefix — decide once).
- `next.config.mjs`, `vercel.json`, `.env.example` updated.
- **Done when:** blank map of Hyderabad renders with heritage palette, no console errors, deploys to a Vercel preview URL.

### M1 — Data seed pipeline (2 days)

Scripts (all `.mjs`, run locally, write to `data/`):

1. `scripts/seed-osm.mjs` — Overpass API query over Hyderabad bbox for `historic=*`, `heritage=*`, `building=temple|mosque|church`, `man_made=baoli`. Produces raw candidates with coords + OSM id + any `wikidata`/`wikipedia` tags.
2. `scripts/seed-asi.mjs` — parse the ASI centrally-protected-monuments list for Telangana (PDF/HTML → JSON). These get `status: "asi-protected"` and are the authority for names.
3. `scripts/seed-intach.mjs` — INTACH Hyderabad heritage listing (the ~140-building list beyond ASI). `status: "intach-listed"` unless ASI already has it.
4. `scripts/merge-sites.mjs` — dedupe by proximity (<80 m) + name similarity across the three sources; ASI name wins; union of tags; write `data/sites.json`. Flag every merged record `needsReview: true`.
5. `scripts/enrich-wikidata.mjs` — for records with a `wikidata` id, pull `yearBuilt` (P571), image (P18), coordinates (P625) as a cross-check.
6. `scripts/nearest-metro.mjs` — static metro-station GeoJSON, assign `nearestMetro` by distance.

- **Done when:** `data/sites.json` has 200–300 records, every one has coords + name + era + type + status, ≥90% have a source link. Manual eyeball pass on a spreadsheet export (`scripts/export-csv.mjs`).

### M2 — Map & browse (2 days)

- `app/components/MapCanvas.jsx` — pins colored by era, cluster at low zoom, hero-pin promotion from `lib/spotlight.js` (score = status weight × has-photo × era-rarity; `at-risk`/`lost` always promoted so the activism layer is visible).
- `app/components/FilterChips.jsx` — multi-select: era, type, status, access. "At risk / unprotected only" quick toggle.
- `app/components/CardRail.jsx` — horizontal card rail synced to viewport, sorted by score.
- `app/components/DetailSheet.jsx` — name, era badge, year, type, status pill, access + ticket info, nearest metro, summary, significance list, photo carousel with credit line, source links, "Add to route" + "Mark visited" buttons.
- `app/api/sites/route.js` — serves `data/sites.json` (filter params server-side to keep payload small) ; `app/api/sites/[id]/route.js` for detail.
- `lib/heritage.js` — enum labels, colors, score function, filter predicate.
- **Done when:** can pan the city, filter to "Qutb Shahi + baoli", tap a pin, read the sheet. Mobile layout clean.

### M3 — History content & photos (2 days, content-heavy)

- `scripts/fetch-commons-photos.mjs` — for each site with a `wikidata`/`wikipedia`/Commons category, pull up to 3 images via Commons API. **Store only** `CC BY`, `CC BY-SA`, `CC0`, `PD`. Record `credit` + `license` + `source` file URL. No license → no photo (pin shows a drawn glyph instead).
- Manual blurb pass: write/curate `summary` + `significance` for the **top ~80 "spine" sites** (all ASI + major INTACH). Each blurb cites ≥1 source. Remaining sites keep a one-line stub + `needsReview: true`.
- `app/components/PhotoCredit.jsx` — always renders attribution under each image (license compliance).
- **Done when:** 80 sites have real blurbs + ≥1 licensed photo or a clean glyph fallback; attribution shows on every photo; a `needsReview` count is visible in `/admin`.

### M4 — Route builder (2 days) — the differentiator

- Client "route mode": tap pins to add/remove; selected set shown in an ordered list panel (`app/components/RoutePanel.jsx`).
- `app/api/route/route.js` — `POST { siteIds }`:
  - order the stops: nearest-neighbour from the first pick; if ≤8 stops, refine with 2-opt over an OSRM foot distance matrix.
  - call public OSRM foot service for the final polyline + distance + duration.
  - cache by hash of sorted ids in `routeCache` (Firestore) + in-memory.
  - fallback if OSRM is down: straight-line ordering + haversine distance × 1.3 detour factor, `approx: true` in response.
- Render the route polyline + numbered stop markers; show total distance + walking time; "Copy route link" (encodes ids in the URL query so a route is shareable without a login).
- Load a `data/routes.json` preset into the same panel.
- **Done when:** pick 5 sites → get an ordered, snapped walking path with distance/time; refresh the shared link → same route rebuilds; OSRM outage still yields a usable approximate route.

### M5 — Passport, check-in, presets (1 day)

- `lib/passport.js` already handles local "visited". Add server check-in: `app/api/checkin/route.js` — clone of `claim`, radius ~250 m, writes `checkins/{uid}` + increments `siteStats`. GPS-gated, token-verified.
- `app/components/PassportPanel.jsx` — visited count, era-completion bars ("Asaf Jahi 6/22"), badges (all ASI tombs, a full preset route, 10 at-risk sites visited).
- "Most-visited heritage site this month" strip on the home view from `siteStats`.
- Ship the 3 launch presets in `data/routes.json`: Qutb Shahi Precinct, Secunderabad Cantonment, British Residency & Koti loop.
- **Done when:** stand at a monument → check-in succeeds and advances a badge; standing 1 km away → rejected with distance shown.

### M6 — Submissions, admin, launch (1–1.5 days)

- `app/api/submit/route.js` — `POST { name, lat, lng, type, era, note, photoDataUrl? }` → `submissions` collection. Rate-limit by uid.
- `app/components/SubmitSheet.jsx` — "Spotted a heritage building not on the map?" pin-drop + short form.
- `app/admin/page.jsx` — review queue: approve / reject; approve appends to a `data/submissions-approved.json`.
- `scripts/merge-submissions.mjs` — fold approved submissions into `data/sites.json` (keeps the dataset in the repo, not the runtime DB), run before each deploy.
- `app/api/cron/refresh-heritage-news/route.js` *(optional, post-launch)* — weekly Firecrawl of "Hyderabad heritage demolition / restoration" news, geocode, attach `newsLinks` to nearby sites, auto-flag `at-risk`.
- Polish: OG image, `HYDERABAD SERIES / 06` poster, 20s screen-capture, About page crediting ASI / INTACH / Deccan Archive / Wikimedia.
- **Done when:** submission → admin approve → merge script → site appears on next deploy. Launch assets ready per SOCIAL-LAUNCH-BRIEF.

---

## 4. External services

| Service | Use | Key? | Limit / risk |
|---------|-----|------|--------------|
| Overpass API | seed coords + OSM tags | no | be polite; run once, cache raw |
| Wikidata Query Service | year built, images, coords | no | batch, cache |
| Wikimedia Commons API | photos + license metadata | no | store files' URLs, not re-host |
| OSRM public foot router (`router.project-osrm.org`) | route polylines + matrix | no | rate-limited, can be down → cache + haversine fallback; self-host later if it matters |
| Google Geocoding | fill missing coords, nearest-metro during seed | yes (server) | tiny volume, seed-time only |
| Firebase | anon auth, check-ins, submissions, route cache | yes | free tier fine at this scale |
| Firecrawl | optional heritage-news cron | yes | post-launch only |

No new paid dependency vs eateries. Cheaper, actually — no Zomato scraping, no Places photo spend.

---

## 5. Risks & mitigations

1. **History accuracy** — every blurb cites a source; anything unverified ships with `needsReview: true` and a subtle "unverified" tag; About page invites corrections.
2. **Photo licensing** — Commons + CC/PD/CC0 only; attribution rendered on every image; no license → drawn glyph, never a scraped photo.
3. **OSRM reliability** — aggressive route caching + haversine fallback with `approx` flag; monitor; self-host a Telangana OSRM extract if outages get annoying.
4. **Coordinate quality for ruins / minor sites** — OSM + Wikidata cross-check; manual satellite spot-check during the M1 eyeball pass; `needsReview` until confirmed.
5. **Content scope creep** — launch bar is **80 spine sites fully done**, not all 250; the rest are visible stubs. Fill over time.
6. **Politically sensitive `at-risk` / `lost` tags** — factual, source-linked, no editorial language; link the news/ASI source that supports the tag.
7. **Firebase project sprawl** — decide at M0: shared project with `heritage-` prefixed collections, or its own. Recommend its own for clean quotas.

---

## 6. File tree (new / changed vs the eateries fork)

```
deccan-heritage-map/
  data/
    sites.json                  # main dataset
    routes.json                 # curated preset walks
    metro-stations.geojson      # static, for nearest-metro
    submissions-approved.json   # admin-approved, merged pre-deploy
  lib/
    heritage.js                 # enums, labels, colors, score, filter predicate
    routing.js                  # client wrapper over /api/route, link encode/decode
    checkin.js                  # client wrapper over /api/checkin (from lib/leaderboard.js)
  app/
    api/
      sites/route.js
      sites/[id]/route.js
      route/route.js            # OSRM ordering + polyline + cache
      checkin/route.js          # GPS-gated, from claim/route.js
      submit/route.js
      admin/submissions/route.js
      cron/refresh-heritage-news/route.js   # optional, post-launch
    components/
      MapCanvas.jsx             # era-colored pins, at-risk always promoted
      FilterChips.jsx           # era / type / status / access multi-select
      CardRail.jsx
      DetailSheet.jsx           # + sources, significance, ticket, PhotoCredit
      RoutePanel.jsx            # NEW — ordered stop list, distance/time, share link
      PassportPanel.jsx         # era-completion bars, badges
      SubmitSheet.jsx           # NEW — pin-drop suggestion form
      PhotoCredit.jsx           # NEW — attribution line
      About.jsx                 # NEW — data credits
    admin/page.jsx              # review queue
  scripts/
    seed-osm.mjs
    seed-asi.mjs
    seed-intach.mjs
    merge-sites.mjs
    enrich-wikidata.mjs
    fetch-commons-photos.mjs
    nearest-metro.mjs
    export-csv.mjs              # QA the dataset in a spreadsheet
    merge-submissions.mjs
```

---

## 7. Sequenced task list (copy into issues)

1. M0 fork + strip + heritage palette + preview deploy
2. M1 `seed-osm` → raw candidates
3. M1 `seed-asi` + `seed-intach` → authoritative status/names
4. M1 `merge-sites` + `enrich-wikidata` + `nearest-metro` → `data/sites.json`
5. M1 CSV export + manual eyeball pass, fix coords, set eras/types
6. M2 `lib/heritage.js` + sites API
7. M2 MapCanvas era pins + clustering + hero promotion
8. M2 FilterChips + CardRail + DetailSheet
9. M3 `fetch-commons-photos` + PhotoCredit component
10. M3 write 80 spine blurbs + significance + sources
11. M4 `/api/route` — NN + 2-opt + OSRM foot + cache + fallback
12. M4 RoutePanel UI + polyline + numbered markers + share link
13. M4 wire `data/routes.json` presets into the panel
14. M5 `/api/checkin` from claim + PassportPanel + badges
15. M5 author 3 launch preset routes
16. M6 `/api/submit` + SubmitSheet + admin queue + `merge-submissions`
17. M6 About page + OG image + poster 06 + screen capture
18. Launch per SOCIAL-LAUNCH-BRIEF (teaser → launch → data drop → BTS → retro)

---

## 8. Open decisions

1. Own Firebase project, or shared with `heritage-` collection prefix? (recommend own)
2. Self-host OSRM from the start, or ride the public foot router with caching until it hurts? (recommend public + cache for v1)
3. Launch site count — hold to 80 fully-done, or push for 120 before going public?
4. Route ordering ceiling — 2-opt up to 8 stops, hard-cap route length at ~12 stops?
5. Cross-app passport with the other 3 Hyderabad apps, or standalone for now?

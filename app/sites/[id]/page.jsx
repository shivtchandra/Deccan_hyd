import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ERAS, TYPES, STATUS, eraLabel, typeLabel, statusLabel, eraColor, photoUrl } from "../../../lib/heritage.js";
import SiteBottomNav from "../../components/SiteBottomNav.jsx";
import { Icon } from "../../components/Icons.jsx";

// Load sites helper
function getSitesIndex() {
  const file = path.join(process.cwd(), "public", "sites-index.json");
  const data = fs.readFileSync(file, "utf8");
  return JSON.parse(data);
}

function getSitesDetail() {
  const file = path.join(process.cwd(), "public", "sites-detail.json");
  const data = fs.readFileSync(file, "utf8");
  return JSON.parse(data);
}

// Generate SSG static paths for all 50+ sites and getaways
export async function generateStaticParams() {
  const sites = getSitesIndex();
  return sites.map((s) => ({ id: s.id }));
}

// Niche long-tail keyword strategy: site-specific overrides + era/type templates
function buildNicheKeywords(site) {
  const name = site.name;
  const area = site.area;

  const siteSpecific = {
    "charminar": [
      "Charminar timings entry fee 2024", "Charminar mosque history in English",
      "Charminar architecture facts Qutb Shahi", "Charminar four minarets height",
      "Charminar Hyderabad built year 1591", "Charminar market bazaar nearby",
    ],
    "golconda-fort": [
      "Golconda fort light and sound show timings", "Golconda fort acoustics clapping trick",
      "Golconda fort Koh-i-Noor diamond history", "Golconda fort entry fee 2024",
      "Golconda fort how to reach from Hyderabad", "Golconda fort 87 bastions architecture",
    ],
    "qutb-shahi-tombs": [
      "Qutb Shahi tombs timings entry fee", "Qutb Shahi tombs architecture style",
      "Ibrahim Rauza Golconda necropolis", "Qutb Shahi dynasty rulers history",
      "Golconda kings burial site Hyderabad",
    ],
    "chowmahalla-palace": [
      "Chowmahalla Palace timings entry fee", "Chowmahalla Palace Nizam durbar history",
      "Khilwat Mubarak Hyderabad palace", "Chowmahalla Palace four palaces names",
      "Nizam VI ceremonial palace Hyderabad",
    ],
    "falaknuma-palace": [
      "Falaknuma Palace hotel tour timings", "Taj Falaknuma history architecture",
      "Falaknuma Palace Nizam VI history", "Falaknuma Palace marble staircase",
      "Falaknuma Palace overnight stay review",
    ],
    "mecca-masjid": [
      "Mecca Masjid Hyderabad timings namaz", "Mecca Masjid history largest mosque South Asia",
      "Mecca Masjid granite architecture facts", "Mecca Masjid built Qutb Shahi Mughal",
    ],
    "khairatabad-ganesh": [
      "Khairatabad Ganesh idol height feet 2023", "tallest clay Ganesh idol in India",
      "Khairatabad Ganesh history 1954 Chukka Ramaiah", "Khairatabad Ganesh festival timings",
      "Khairatabad Ganapati immersion route Hyderabad", "Khairatabad Ganesh procession dates",
    ],
    "errum-manzil": [
      "Errum Manzil Hyderabad history palace", "Errum Manzil Red Palace Paigah noble",
      "Errum Manzil 150 rooms demolition controversy 2019", "Errum Manzil at risk heritage Hyderabad",
      "Fakhrul Mulk Paigah palace Hyderabad",
    ],
    "husain-sagar": [
      "Hussain Sagar lake history Ibrahim Muhammad Qutb Shah", "Hussain Sagar Buddha statue boat ride timings",
      "Hussain Sagar lake size area Hyderabad", "Tank Bund Hyderabad history",
    ],
    "birla-mandir-hyderabad": [
      "Birla Mandir Hyderabad timings darshan hours", "Birla Mandir Naubat Pahad hill temple",
      "Birla Mandir Hyderabad free entry", "Birla Mandir white marble architecture",
    ],
    "salar-jung-museum": [
      "Salar Jung Museum Hyderabad timings entry fee", "Salar Jung Museum collections highlights",
      "Salar Jung Museum veiled Rebecca Hyderabad", "Salar Jung III collection history",
    ],
    "british-residency": [
      "Osmania University British Residency Hyderabad history", "British Residency Palladian architecture Deccan",
      "Hyderabad Residency 1805 James Achilles Kirkpatrick", "Dalrymple White Mughals Hyderabad",
    ],
  };

  const overrides = siteSpecific[site.id] || [];

  const eraKeywords = {
    "qutb-shahi": [`${name} Qutb Shahi dynasty history`, `${area} Hyderabad 16th century monument`],
    "asaf-jahi": [`${name} Nizam of Hyderabad history`, `${area} Indo-Saracenic architecture Hyderabad`],
    "british-residency": [`${name} colonial Hyderabad history`, `${area} British era Deccan`],
    "nizam-civic": [`${name} Osmanian architecture Hyderabad`, `Vincent Esch Nizam VII ${name}`],
    "post-independence": [`${name} Hyderabad history facts`, `${area} Hyderabad landmark`],
  };

  const typeKeywords = {
    "temple": [`${name} Hyderabad timings darshan hours`, `${name} history significance`],
    "mosque": [`${name} Hyderabad namaz timings`, `${name} history architecture facts`],
    "fort": [`${name} entry fee timings Hyderabad`, `${name} history how to reach`],
    "palace": [`${name} Hyderabad history architecture`, `${name} visiting hours`],
    "museum": [`${name} Hyderabad timings entry fee`, `${name} collections what to see`],
    "water": [`${name} history Hyderabad`, `${name} boat ride timings`],
    "tomb": [`${name} Hyderabad history architecture`, `${name} who is buried`],
    "gateway": [`${name} Hyderabad history architecture facts`, `${name} built year history`],
    "civic": [`${name} Hyderabad history`, `${name} architecture Hyderabad visit`],
    "baoli": [`${name} stepwell Hyderabad history`, `${name} Hyderabad water heritage`],
    "clock_tower": [`${name} Hyderabad history clock tower`, `${name} timings how to reach`],
    "church": [`${name} Hyderabad history architecture`, `${name} timings Sunday service`],
    "cemetery": [`${name} Hyderabad historic cemetery history`, `${name} who is buried Hyderabad`],
    "tank": [`${name} Hyderabad lake history`, `${name} how to reach timings`],
    "mansion": [`${name} Hyderabad history architecture`, `${name} visiting hours`],
  };

  const accessKeywords = site.access === "ticketed"
    ? [`${name} entry fee 2024`, `${name} timings Hyderabad`]
    : site.access === "free" || site.access === "public"
    ? [`${name} free entry Hyderabad`, `${name} timings open hours`]
    : [`${name} how to visit Hyderabad`];

  return [
    ...overrides,
    ...(eraKeywords[site.era] || [`${name} Hyderabad history`]),
    ...(typeKeywords[site.type] || [`${name} Hyderabad monument`]),
    ...accessKeywords,
    `${name} ${area} Hyderabad`,
    `${name} history in English`,
  ];
}

// Generate rich SEO & OpenGraph metadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const details = getSitesDetail();
  const site = details[id];

  if (!site) {
    return {
      title: "Site Not Found · Deccan Heritage Map",
      description: "Explore the built heritage of Hyderabad and the Deccan.",
    };
  }

  const era = eraLabel(site.era);
  const type = typeLabel(site.type);
  const title = `${site.name} — ${era} ${type} in ${site.area} | Deccan Heritage Map`;
  const description = `${site.summary} Discover history, photos, era details, and walking routes for ${site.name} in ${site.area}.`;
  const canonical = `https://heritage.mapmyhyd.com/sites/${site.id}`;
  const image = site.photos?.[0]?.url || photoUrl(site.id);

  return {
    title,
    description,
    keywords: [
      site.name,
      ...(site.altNames || []),
      site.area,
      era,
      type,
      ...buildNicheKeywords(site),
      "Hyderabad heritage map",
      "Deccan monuments",
      site.isGetaway ? "weekend getaways from Hyderabad" : "Hyderabad historical places",
    ].join(", "),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Deccan Heritage Map",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function SitePage({ params }) {
  const { id } = await params;
  const details = getSitesDetail();
  const allSites = getSitesIndex();
  const site = details[id];

  if (!site) {
    notFound();
  }

  const color = eraColor(site.era);
  const photo = site.photos?.[0] || (site.hasPhoto ? { url: photoUrl(site.id) } : null);

  // Deduplicated related sites (combining curated connections and nearby sites with 0 duplicates)
  const relatedSiteIds = new Set([site.id]);
  const relatedSites = [];

  for (const cid of site.connections || []) {
    const s = allSites.find((item) => item.id === cid);
    if (s && !relatedSiteIds.has(s.id)) {
      relatedSiteIds.add(s.id);
      relatedSites.push(s);
    }
  }

  for (const s of allSites) {
    if (relatedSites.length >= 6) break;
    if (!relatedSiteIds.has(s.id) && (s.area === site.area || s.era === site.era)) {
      relatedSiteIds.add(s.id);
      relatedSites.push(s);
    }
  }

  // Deduplicate sources by URL
  const seenUrls = new Set();
  const allSources = [];

  for (const src of site.sources || []) {
    const u = src.url || "";
    if (u) {
      if (!seenUrls.has(u)) {
        seenUrls.add(u);
        allSources.push({ label: src.label || src.title || "Source", url: u });
      }
    } else if (src.label || src.title) {
      allSources.push({ label: src.label || src.title, url: null });
    }
  }

  if (site.wikipedia && !seenUrls.has(site.wikipedia)) {
    seenUrls.add(site.wikipedia);
    allSources.push({ label: "Wikipedia", url: site.wikipedia });
  }

  if (site.wikidata) {
    const wUrl = `https://www.wikidata.org/wiki/${site.wikidata}`;
    if (!seenUrls.has(wUrl)) {
      seenUrls.add(wUrl);
      allSources.push({ label: "Wikidata", url: wUrl });
    }
  }

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["TouristAttraction", "HistoricSite", "Place"],
        "@id": `https://heritage.mapmyhyd.com/sites/${site.id}#place`,
        "name": site.name,
        "alternateName": site.altNames || [],
        "description": site.summary,
        "url": `https://heritage.mapmyhyd.com/sites/${site.id}`,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": site.lat,
          "longitude": site.lng,
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": site.area,
          "addressRegion": "Telangana",
          "addressCountry": "IN",
        },
        "image": photo ? `https://heritage.mapmyhyd.com${photo.url}` : undefined,
        "sameAs": [
          site.wikipedia,
          site.wikidata ? `https://www.wikidata.org/wiki/${site.wikidata}` : null,
        ].filter(Boolean),
        "isPartOf": {
          "@type": "WebSite",
          "name": "Deccan Heritage Map",
          "url": "https://heritage.mapmyhyd.com",
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://heritage.mapmyhyd.com",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": site.isGetaway ? "Weekend Getaways" : "Heritage Sites",
            "item": site.isGetaway ? "https://heritage.mapmyhyd.com/getaways" : "https://heritage.mapmyhyd.com",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": site.name,
            "item": `https://heritage.mapmyhyd.com/sites/${site.id}`,
          },
        ],
      },
    ],
  };


  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh", color: "var(--ink)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Header ── */}
      <header style={{ background: "var(--cream-hi)", borderBottom: "1px solid var(--line)", padding: "0 20px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(43,33,25,0.04)" }}>
        <div style={{ maxWidth: 840, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <Link href="/" style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 700, textDecoration: "none", color: "var(--ink)", letterSpacing: "-0.3px", display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/brand/charminar-logo.png" alt="Logo" style={{ width: 22, height: 22, objectFit: "contain" }} />
            <span>Deccan Heritage Map</span>
          </Link>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/" className="site-detail-back-link" style={{ color: "var(--ink-soft)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
              ← All Sites
            </Link>
            <Link href={`/?site=${site.id}`} className="pressable-sm" style={{ background: color, color: "#fff", padding: "7px 16px", borderRadius: 999, fontWeight: 700, textDecoration: "none", fontSize: 13, whiteSpace: "nowrap", boxShadow: "var(--e1)" }}>
              Open on Map
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 740, margin: "0 auto", padding: "40px 20px 140px" }}>
        {/* ── Title & Meta Header ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
            <span style={{ background: color, color: "#fff", padding: "4px 12px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.4px" }}>
              {eraLabel(site.era)}
            </span>
            <span style={{ background: "var(--cream-hi)", border: "1px solid var(--line)", color: "var(--ink-soft)", padding: "3px 11px", borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>
              {typeLabel(site.type)}
            </span>
            <span style={{ background: "var(--cream-hi)", border: "1px solid var(--line)", color: "var(--muted)", padding: "3px 11px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="pin" size={12} color="var(--muted)" /> {site.area}
            </span>
          </div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(34px, 5.5vw, 50px)", fontWeight: 700, color: "var(--ink)", margin: "0 0 8px", lineHeight: 1.15, letterSpacing: "-0.025em" }}>
            {site.name}
          </h1>
          {site.altNames?.length > 0 && (
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 15, lineHeight: 1.5 }}>
              Also known as: {site.altNames.join(", ")}
            </p>
          )}
        </div>

        {/* ── Framed Monument Photo (Preserves Natural Proportions) ── */}
        {photo && (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 10",
              minHeight: 280,
              maxHeight: 520,
              borderRadius: "var(--r-lg)",
              overflow: "hidden",
              border: "1px solid var(--line)",
              boxShadow: "var(--e2)",
              marginBottom: 32,
              background: "var(--paper)",
            }}
          >
            <img
              src={photo.url}
              alt={site.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 20%",
                display: "block",
              }}
            />
            {photo.credit && (
              <div
                style={{
                  position: "absolute",
                  right: 12,
                  bottom: 12,
                  background: "rgba(20, 16, 13, 0.72)",
                  backdropFilter: "blur(6px)",
                  color: "#fff",
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: "var(--r-pill)",
                }}
              >
                {photo.credit} · {photo.licence}
              </div>
            )}
          </div>
        )}

        {/* ── Quick facts strip ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 0, background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden", marginBottom: 36, boxShadow: "0 2px 8px rgba(43,33,25,0.04)" }}>
          {[
            { label: "Built", value: site.yearBuilt || "Historical" },
            { label: "Status", value: statusLabel(site.status) },
            { label: "Access", value: site.access || "Public" },
            { label: "Area", value: site.area },
          ].map(({ label, value }, i) => (
            <div key={i} style={{ flex: "1 1 140px", padding: "14px 18px", borderRight: i < 3 ? "1px solid var(--line)" : "none" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ── Summary lead ── */}
        <div style={{ borderLeft: `3.5px solid ${color}`, paddingLeft: 20, margin: "0 0 36px" }}>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(19px, 2.5vw, 22px)", lineHeight: 1.6, color: "var(--ink)", fontWeight: 500, margin: 0, letterSpacing: "-0.01em" }}>
            {site.summary}
          </p>
        </div>

        {/* ── Full Story ── */}
        {site.story && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 700, margin: "0 0 18px", color: "var(--ink)", letterSpacing: "-0.015em" }}>
              History &amp; Story
            </h2>
            <div style={{ fontSize: 17.5, lineHeight: 1.85, color: "#292524", fontWeight: 400 }}>
              {site.story.split(/\n+/).map((para, i) => (
                <p key={i} style={{ margin: "0 0 20px" }}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* ── Key Events Timeline ── */}
        {site.events?.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 700, margin: "0 0 22px", color: "var(--ink)", letterSpacing: "-0.015em" }}>
              Key Events
            </h2>
            <div style={{ position: "relative", paddingLeft: 30 }}>
              <div style={{ position: "absolute", left: 7, top: 6, bottom: 6, width: 2, background: "var(--line)" }} />
              {site.events.map((ev, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 22 }}>
                  <div style={{ position: "absolute", left: -30, top: 4, width: 14, height: 14, borderRadius: "50%", background: color, border: "3px solid var(--cream)", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }} />
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: color, marginBottom: 4, letterSpacing: "0.04em", fontFamily: "JetBrains Mono, monospace" }}>{ev.year}</div>
                  <div style={{ fontSize: 15.5, lineHeight: 1.65, color: "#44403c" }}>{ev.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── People ── */}
        {site.people?.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 700, margin: "0 0 22px", color: "var(--ink)", letterSpacing: "-0.015em" }}>
              Key People
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {site.people.map((p, i) => (
                <div key={i} style={{ background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start", boxShadow: "0 1px 4px rgba(43,33,25,0.03)" }}>
                  <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: "50%", background: `rgba(${color === "var(--accent)" ? "196, 92, 53" : "42, 157, 143"}, 0.15)`, color: color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, fontFamily: "Fraunces, serif" }}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 16.5, color: "var(--ink)", marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>{p.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Location & Access ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 700, margin: "0 0 18px", color: "var(--ink)", letterSpacing: "-0.015em" }}>
            Location &amp; Getting There
          </h2>
          <div style={{ background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: 14, padding: "20px 22px", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(43,33,25,0.03)" }}>
            <div style={{ flex: "1 1 240px" }}>
              <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 2 }}>
                <div><strong style={{ color: "var(--ink)" }}>Area / Locality:</strong> {site.area}</div>
                <div><strong style={{ color: "var(--ink)" }}>Coordinates:</strong> {site.lat?.toFixed(5)}° N, {site.lng?.toFixed(5)}° E</div>
                <div><strong style={{ color: "var(--ink)" }}>Access:</strong> <span style={{ textTransform: "capitalize" }}>{site.access || "Public area"}</span></div>
              </div>
            </div>
            <Link href={`/?site=${site.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--ink)", color: "var(--cream-hi)", padding: "11px 20px", borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", boxShadow: "var(--e1)" }}>
              Open on Interactive Map →
            </Link>
          </div>
        </section>

        {/* ── Related Heritage Sites (Deduplicated) ── */}
        {relatedSites.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "0 0 16px", color: "var(--ink)" }}>
              Explore Related Heritage
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {relatedSites.map((s) => {
                const sColor = eraColor(s.era);
                return (
                  <Link key={s.id} href={`/sites/${s.id}`} style={{ textDecoration: "none", color: "inherit" }} className="pressable-sm">
                    <div style={{ background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "14px 16px", boxShadow: "var(--e1)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: sColor, display: "inline-block", flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 700 }}>{eraLabel(s.era)}</span>
                      </div>
                      <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 14.5, lineHeight: 1.25, marginBottom: 4, color: "var(--ink)" }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.area}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Sources & Further Reading (Deduplicated) ── */}
        {allSources.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "0 0 16px", color: "var(--ink)" }}>
              Sources &amp; Further Reading
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {allSources.map((src, i) =>
                src.url ? (
                  <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: "8px 14px", fontSize: 13, color: "var(--accent-deep)", textDecoration: "none", fontWeight: 600 }}>
                    {src.label} ↗
                  </a>
                ) : (
                  <span key={i} style={{ display: "inline-block", background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: "8px 14px", fontSize: 13, color: "var(--ink-soft)" }}>
                    {src.label}
                  </span>
                )
              )}
            </div>
          </section>
        )}
      </main>

      <SiteBottomNav accentColor={color} />

      {/* ── Footer ── */}
      <footer style={{ background: "var(--ink)", color: "var(--cream)", padding: "28px 20px", textAlign: "center", paddingBottom: "calc(28px + 80px + env(safe-area-inset-bottom, 0px))" }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <img src="/brand/charminar-logo.png" alt="Deccan Heritage Logo" style={{ width: 22, height: 22, objectFit: "contain", borderRadius: 4, background: "#FAF6EE", padding: 1 }} />
          <span>Deccan Heritage Map</span>
        </div>
        <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.75, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          Mapping Hyderabad's built heritage across 500 years from the Qutb Shahi Sultanate to the modern era.
        </p>
        <Link href="/" style={{ display: "inline-block", background: color, color: "#fff", padding: "9px 22px", borderRadius: 999, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          Explore the Interactive Map →
        </Link>
      </footer>
    </div>
  );
}

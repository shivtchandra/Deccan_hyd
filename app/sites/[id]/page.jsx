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
  const canonical = `https://deccanheritage.org/sites/${site.id}`;
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

  // Find nearby sites for internal SEO linking
  const nearby = allSites
    .filter((s) => s.id !== site.id && (s.era === site.era || s.area === site.area))
    .slice(0, 4);

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["TouristAttraction", "HistoricSite", "Place"],
        "@id": `https://deccanheritage.org/sites/${site.id}#place`,
        "name": site.name,
        "alternateName": site.altNames || [],
        "description": site.summary,
        "url": `https://deccanheritage.org/sites/${site.id}`,
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
        "image": photo ? `https://deccanheritage.org${photo.url}` : undefined,
        "sameAs": [
          site.wikipedia,
          site.wikidata ? `https://www.wikidata.org/wiki/${site.wikidata}` : null,
        ].filter(Boolean),
        "isPartOf": {
          "@type": "WebSite",
          "name": "Deccan Heritage Map",
          "url": "https://deccanheritage.org",
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://deccanheritage.org",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": site.isGetaway ? "Weekend Getaways" : "Heritage Sites",
            "item": site.isGetaway ? "https://deccanheritage.org/getaways" : "https://deccanheritage.org",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": site.name,
            "item": `https://deccanheritage.org/sites/${site.id}`,
          },
        ],
      },
    ],
  };

  // Build connection site objects from index
  const connectedSites = (site.connections || [])
    .map((cid) => allSites.find((s) => s.id === cid))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh", color: "var(--ink)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Header — matches app's dark top bar ── */}
      <header style={{ background: "var(--ink)", borderBottom: `3px solid ${color}`, padding: "0 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <Link href="/" style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 700, textDecoration: "none", color: "var(--cream)", letterSpacing: "-0.3px", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="monument" size={18} color="var(--cream)" /> Deccan Heritage Map
          </Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/" style={{ color: "var(--cream)", opacity: 0.7, fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
              ← All Sites
            </Link>
            <Link href={`/?site=${site.id}`} className="pressable-sm" style={{ background: color, color: "#fff", padding: "7px 15px", borderRadius: 999, fontWeight: 700, textDecoration: "none", fontSize: 13, whiteSpace: "nowrap" }}>
              Open on Map
            </Link>
          </div>
        </div>
      </header>

      {/* ── Era colour stripe ── */}
      <div style={{ height: 4, background: color }} />

      {/* ── Hero Photo ── */}
      <div style={{ position: "relative", width: "100%", maxHeight: 480, overflow: "hidden", background: color }}>
        {photo ? (
          <>
            <img src={photo.url} alt={site.name} style={{ width: "100%", maxHeight: 480, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${color}dd 0%, transparent 55%)` }} />
            {photo.credit && (
              <div style={{ position: "absolute", right: 12, top: 12, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 10, padding: "3px 8px", borderRadius: 4 }}>
                {photo.credit} · {photo.licence}
              </div>
            )}
          </>
        ) : (
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.35 }}><Icon name="monument" size={64} color="#fff" /></div>
        )}
        {/* Title overlaid on photo */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 28px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <span style={{ background: color, color: "#fff", padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px" }}>
                {eraLabel(site.era)}
              </span>
              <span style={{ background: "rgba(255,255,255,0.18)", color: "#fff", padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600, backdropFilter: "blur(6px)" }}>
                {typeLabel(site.type)}
              </span>
              <span style={{ background: "rgba(255,255,255,0.18)", color: "#fff", padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600, backdropFilter: "blur(6px)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Icon name="pin" size={12} /> {site.area}
              </span>
            </div>
            <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 800, color: "#fff", margin: "0 0 6px", lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
              {site.name}
            </h1>
            {site.altNames?.length > 0 && (
              <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
                Also known as: {site.altNames.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 140px" }}>

        {/* ── Quick facts strip ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 0, background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", overflow: "hidden", marginBottom: 36, boxShadow: "var(--e1)" }}>
          {[
            { label: "Built", value: site.yearBuilt || "Historical" },
            { label: "Status", value: statusLabel(site.status) },
            { label: "Access", value: site.access || "Public" },
            { label: "Area", value: site.area },
          ].map(({ label, value }, i) => (
            <div key={i} style={{ flex: "1 1 140px", padding: "14px 18px", borderRight: i < 3 ? "1px solid var(--line)" : "none" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: color, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ── Summary lead ── */}
        <p style={{ fontSize: 18, lineHeight: 1.65, color: "var(--ink)", fontWeight: 500, margin: "0 0 36px", borderLeft: `4px solid ${color}`, paddingLeft: 18 }}>
          {site.summary}
        </p>

        {/* ── Full Story ── */}
        {site.story && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "0 0 16px", color: "var(--ink)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 4, height: 24, background: color, borderRadius: 2 }} />
              History &amp; Story
            </h2>
            <div style={{ fontSize: 15, lineHeight: 1.8, color: "var(--ink-soft)" }}>
              {site.story.split(/\n+/).map((para, i) => (
                <p key={i} style={{ margin: "0 0 14px" }}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* ── Key Events Timeline ── */}
        {site.events?.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "0 0 20px", color: "var(--ink)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 4, height: 24, background: color, borderRadius: 2 }} />
              Key Events
            </h2>
            <div style={{ position: "relative", paddingLeft: 28 }}>
              <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 2, background: "var(--line)" }} />
              {site.events.map((ev, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 20 }}>
                  <div style={{ position: "absolute", left: -24, top: 4, width: 12, height: 12, borderRadius: "50%", background: color, border: "2px solid var(--cream)" }} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: color, marginBottom: 3, letterSpacing: "0.5px" }}>{ev.year}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-soft)" }}>{ev.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── People ── */}
        {site.people?.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "0 0 20px", color: "var(--ink)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 4, height: 24, background: color, borderRadius: 2 }} />
              Key People
            </h2>
            <div>
              {site.people.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 18, marginBottom: 18, borderBottom: i < site.people.length - 1 ? "1px solid var(--line)" : "none", alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, width: 8, height: 8, borderRadius: "50%", background: color, marginTop: 6 }} />
                  <div>
                    <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 16, color: "var(--ink)", marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>{p.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Location & Access ── */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "0 0 16px", color: "var(--ink)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-block", width: 4, height: 24, background: color, borderRadius: 2 }} />
            Location &amp; Getting There
          </h2>
          <div style={{ background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "18px 20px", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 2 }}>
                <div><strong style={{ color: "var(--ink)" }}>Area / Locality:</strong> {site.area}</div>
                <div><strong style={{ color: "var(--ink)" }}>Coordinates:</strong> {site.lat?.toFixed(5)}° N, {site.lng?.toFixed(5)}° E</div>
                <div><strong style={{ color: "var(--ink)" }}>Access:</strong> {site.access || "Public area"}</div>
              </div>
            </div>
            <Link href={`/?site=${site.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--ink)", color: "var(--cream-hi)", padding: "10px 18px", borderRadius: "var(--r-sm)", fontSize: 14, fontWeight: 700, textDecoration: "none", alignSelf: "center", whiteSpace: "nowrap" }}>
              Open on Interactive Map →
            </Link>
          </div>
        </section>

        {/* ── Connected Heritage Sites ── */}
        {connectedSites.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "0 0 16px", color: "var(--ink)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 4, height: 24, background: color, borderRadius: 2 }} />
              Connected Heritage
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {connectedSites.map((s) => (
                <Link key={s.id} href={`/sites/${s.id}`} style={{ textDecoration: "none", color: "inherit" }} className="pressable-sm">
                  <div style={{ background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "12px 14px", borderTop: `3px solid ${eraColor(s.era)}` }}>
                    <div style={{ fontSize: 11, color: eraColor(s.era), fontWeight: 700, marginBottom: 4 }}>{eraLabel(s.era)}</div>
                    <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 14, lineHeight: 1.25, marginBottom: 4 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.area}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Sources & Further Reading ── */}
        {(site.sources?.length > 0 || site.wikipedia || site.wikidata) && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "0 0 16px", color: "var(--ink)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 4, height: 24, background: color, borderRadius: 2 }} />
              Sources &amp; Further Reading
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {(site.sources || []).map((src, i) =>
                src.url ? (
                  <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: "8px 14px", fontSize: 13, color: "var(--accent-deep)", textDecoration: "none", fontWeight: 600 }}>
                    {src.label || src.title} ↗
                  </a>
                ) : (
                  <span key={i} style={{ display: "inline-block", background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: "8px 14px", fontSize: 13, color: "var(--ink-soft)" }}>
                    {src.label || src.title}
                  </span>
                )
              )}
              {site.wikipedia && (
                <a href={site.wikipedia} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: "8px 14px", fontSize: 13, color: "var(--accent-deep)", textDecoration: "none", fontWeight: 600 }}>
                  Wikipedia ↗
                </a>
              )}
              {site.wikidata && (
                <a href={`https://www.wikidata.org/wiki/${site.wikidata}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: "8px 14px", fontSize: 13, color: "var(--accent-deep)", textDecoration: "none", fontWeight: 600 }}>
                  Wikidata ↗
                </a>
              )}
            </div>
          </section>
        )}

        {/* ── Nearby Sites ── */}
        {nearby.length > 0 && (
          <section>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "0 0 16px", color: "var(--ink)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 4, height: 24, background: color, borderRadius: 2 }} />
              Explore Nearby Heritage
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {nearby.map((s) => (
                <Link key={s.id} href={`/sites/${s.id}`} style={{ textDecoration: "none", color: "inherit" }} className="pressable-sm">
                  <div style={{ background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "12px 14px", borderTop: `3px solid ${eraColor(s.era)}` }}>
                    <div style={{ fontSize: 11, color: eraColor(s.era), fontWeight: 700, marginBottom: 4 }}>{eraLabel(s.era)}</div>
                    <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 14, lineHeight: 1.25, marginBottom: 4 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.area}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteBottomNav accentColor={color} />

      {/* ── Footer ── */}
      <footer style={{ background: "var(--ink)", color: "var(--cream)", padding: "28px 20px", textAlign: "center", paddingBottom: "calc(28px + 80px + env(safe-area-inset-bottom, 0px))" }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Icon name="monument" size={18} color="var(--cream)" /> Deccan Heritage Map
        </div>
        <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.65, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          Mapping Hyderabad&apos;s built heritage across 500 years — from the Qutb Shahi Sultanate to the Nizam era.
        </p>
        <Link href="/" style={{ display: "inline-block", background: color, color: "#fff", padding: "9px 22px", borderRadius: 999, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          Explore the Interactive Map →
        </Link>
      </footer>
    </div>
  );
}

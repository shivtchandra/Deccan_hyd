import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PSEO_TRAILS } from "../../../lib/pSeoData.js";
import { eraLabel, eraColor, photoUrl } from "../../../lib/heritage.js";
import { Icon } from "../../components/Icons.jsx";

function getSitesDetail() {
  const file = path.join(process.cwd(), "public", "sites-detail.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export async function generateStaticParams() {
  return Object.keys(PSEO_TRAILS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trail = PSEO_TRAILS[slug];
  if (!trail) return { title: "Trail Not Found · Deccan Heritage Map" };

  const canonical = `https://heritage.mapmyhyd.com/trails/${slug}`;
  return {
    title: trail.metaTitle,
    description: trail.metaDesc,
    alternates: { canonical },
    openGraph: {
      title: trail.metaTitle,
      description: trail.metaDesc,
      url: canonical,
      siteName: "Deccan Heritage Map",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: trail.metaTitle,
      description: trail.metaDesc,
    },
  };
}

export default async function TrailHubPage({ params }) {
  const { slug } = await params;
  const trail = PSEO_TRAILS[slug];
  if (!trail) notFound();

  const details = getSitesDetail();
  const stopsWithData = trail.stops.map((stop) => {
    const site = details[stop.id] || {};
    return {
      ...stop,
      site,
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        "@id": `https://heritage.mapmyhyd.com/trails/${slug}#trip`,
        "name": trail.title,
        "description": trail.metaDesc,
        "itinerary": {
          "@type": "ItemList",
          "numberOfItems": stopsWithData.length,
          "itemListElement": stopsWithData.map((st, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": st.site?.name || st.title,
            "url": `https://heritage.mapmyhyd.com/sites/${st.id}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://heritage.mapmyhyd.com" },
          { "@type": "ListItem", "position": 2, "name": "Heritage Trails", "item": "https://heritage.mapmyhyd.com/about" },
          { "@type": "ListItem", "position": 3, "name": trail.heading, "item": `https://heritage.mapmyhyd.com/trails/${slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `https://heritage.mapmyhyd.com/trails/${slug}#faq`,
        "mainEntity": (trail.faqs || []).map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a,
          },
        })),
      },
    ],
  };

  const otherTrails = Object.values(PSEO_TRAILS).filter((t) => t.slug !== slug);

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh", color: "var(--ink)", paddingBottom: 80 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header style={{ background: "var(--cream-hi)", borderBottom: "1px solid var(--line)", padding: "12px 20px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 700, textDecoration: "none", color: "var(--ink)", display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/brand/charminar-logo.png" alt="Logo" style={{ width: 22, height: 22, objectFit: "contain" }} />
            <span>Deccan Heritage Map</span>
          </Link>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/about" style={{ color: "var(--ink-soft)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
              ← All Directory
            </Link>
            <Link href={`/?trail=${trail.id}`} className="pressable-sm" style={{ background: "var(--accent)", color: "#fff", padding: "7px 16px", borderRadius: 999, fontWeight: 700, textDecoration: "none", fontSize: 13 }}>
              Launch Trail
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "36px 20px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 6px" }}>/</span>
          <Link href="/about" style={{ color: "inherit", textDecoration: "none" }}>Heritage Trails</Link>
          <span style={{ margin: "0 6px" }}>/</span>
          <span style={{ color: "var(--ink)" }}>{trail.heading}</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: 36, background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: 16, padding: "28px 24px", boxShadow: "var(--e1)" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ background: "var(--accent)", color: "#fff", fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>
              {trail.stops.length} Curated Stops
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-soft)", background: "var(--cream)", border: "1px solid var(--line)", padding: "3px 10px", borderRadius: 999 }}>
              📍 {trail.distance}
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-soft)", background: "var(--cream)", border: "1px solid var(--line)", padding: "3px 10px", borderRadius: 999 }}>
              ⏱️ {trail.duration}
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)" }}>
              {trail.difficulty}
            </span>
          </div>

          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.2, margin: "0 0 10px", color: "var(--ink)" }}>
            {trail.heading}
          </h1>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--accent-deep)", margin: "0 0 14px" }}>
            {trail.subtitle}
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "#374151", maxWidth: 800, margin: "0 0 24px" }}>
            {trail.summary}
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href={`/?trail=${trail.id}`}
              className="pressable"
              style={{ background: "var(--accent)", color: "#fff", padding: "11px 22px", borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "var(--e2)" }}
            >
              <span>🚶 Launch Walking Trail on Interactive Map</span>
              <span>→</span>
            </Link>
            <Link
              href={`/?trail=${trail.id}&tab=passport`}
              className="pressable"
              style={{ background: "var(--cream)", border: "1.5px solid var(--line)", color: "var(--ink)", padding: "10px 20px", borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <span>🏆 Stamp All {trail.stops.length} Stops in Passport</span>
            </Link>
          </div>
        </div>

        {/* Step by Step Route Itinerary */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 700, margin: "0 0 24px", color: "var(--ink)" }}>
            Route Itinerary &amp; Heritage Stops
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {stopsWithData.map((st) => {
              const color = eraColor(st.site?.era);
              const imgUrl = st.site?.photos?.[0]?.url || (st.site?.hasPhoto ? photoUrl(st.id) : null);

              return (
                <div
                  key={st.order}
                  style={{
                    background: "var(--cream-hi)",
                    border: "1px solid var(--line)",
                    borderRadius: 14,
                    padding: "20px 22px",
                    display: "flex",
                    gap: 20,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    boxShadow: "var(--e1)",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: color,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 16,
                      flexShrink: 0,
                      fontFamily: "Fraunces, serif",
                    }}
                  >
                    {st.order}
                  </div>

                  <div style={{ flex: "1 1 300px" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: color, background: `rgba(${color === "var(--accent)" ? "196, 92, 53" : "42, 157, 143"}, 0.12)`, padding: "2px 8px", borderRadius: 999 }}>
                        {eraLabel(st.site?.era)}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        {st.site?.area}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 20, margin: "0 0 6px", color: "var(--ink)" }}>
                      <Link href={`/sites/${st.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {st.site?.name || st.title}
                      </Link>
                    </h3>

                    <p style={{ fontSize: 14.5, color: "var(--ink)", fontWeight: 500, margin: "0 0 8px" }}>
                      {st.title}
                    </p>

                    <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: "0 0 14px" }}>
                      {st.note || st.site?.summary}
                    </p>

                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <Link href={`/sites/${st.id}`} style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-deep)", textDecoration: "none" }}>
                        View Site Details &amp; Photos &rarr;
                      </Link>
                      <Link href={`/?site=${st.id}&tab=passport`} style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", textDecoration: "underline" }}>
                        Stamp Stop
                      </Link>
                    </div>
                  </div>

                  {imgUrl && (
                    <div style={{ width: 140, height: 110, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#e5e7eb" }}>
                      <img src={imgUrl} alt={st.site?.name || st.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Trail FAQs */}
        {trail.faqs?.length > 0 && (
          <section style={{ marginBottom: 56, background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: 16, padding: "28px 24px" }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 700, margin: "0 0 16px", color: "var(--ink)" }}>
              Trail Guide &amp; FAQs
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {trail.faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < trail.faqs.length - 1 ? "1px solid var(--line)" : "none", paddingBottom: i < trail.faqs.length - 1 ? 16 : 0 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                    {faq.q}
                  </h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-soft)", margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cross-Link Other Trails */}
        <section style={{ borderTop: "1px solid var(--line)", paddingTop: 32 }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 700, margin: "0 0 14px", color: "var(--ink)" }}>
            Explore More Curated Heritage Trails
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {otherTrails.map((t) => (
              <Link
                key={t.slug}
                href={`/trails/${t.slug}`}
                style={{
                  background: "var(--cream-hi)",
                  border: "1px solid var(--line)",
                  padding: "16px 18px",
                  borderRadius: 12,
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-deep)" }}>
                  {t.distance} · {t.stops.length} Stops
                </div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3 }}>
                  {t.heading}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

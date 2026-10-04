import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PSEO_TYPES } from "../../../lib/pSeoData.js";
import { eraLabel, eraColor, photoUrl } from "../../../lib/heritage.js";
import { Icon } from "../../components/Icons.jsx";

function getSitesIndex() {
  const file = path.join(process.cwd(), "public", "sites-index.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export async function generateStaticParams() {
  return Object.keys(PSEO_TYPES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const hub = PSEO_TYPES[slug];
  if (!hub) return { title: "Category Not Found · Deccan Heritage Map" };

  const canonical = `https://heritage.mapmyhyd.com/types/${slug}`;
  return {
    title: hub.metaTitle,
    description: hub.metaDesc,
    alternates: { canonical },
    openGraph: {
      title: hub.metaTitle,
      description: hub.metaDesc,
      url: canonical,
      siteName: "Deccan Heritage Map",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: hub.metaTitle,
      description: hub.metaDesc,
    },
  };
}

export default async function TypeHubPage({ params }) {
  const { slug } = await params;
  const hub = PSEO_TYPES[slug];
  if (!hub) notFound();

  const allSites = getSitesIndex();
  const sites = allSites.filter(hub.filter);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `https://heritage.mapmyhyd.com/types/${slug}#webpage`,
        "url": `https://heritage.mapmyhyd.com/types/${slug}`,
        "name": hub.title,
        "description": hub.metaDesc,
      },
      {
        "@type": "ItemList",
        "@id": `https://heritage.mapmyhyd.com/types/${slug}#itemlist`,
        "name": hub.title,
        "numberOfItems": sites.length,
        "itemListElement": sites.map((s, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": s.name,
          "url": `https://heritage.mapmyhyd.com/sites/${s.id}`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": s.area || "Hyderabad",
            "addressRegion": "Telangana",
            "addressCountry": "IN",
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://heritage.mapmyhyd.com" },
          { "@type": "ListItem", "position": 2, "name": "Categories", "item": "https://heritage.mapmyhyd.com/about" },
          { "@type": "ListItem", "position": 3, "name": hub.heading, "item": `https://heritage.mapmyhyd.com/types/${slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `https://heritage.mapmyhyd.com/types/${slug}#faq`,
        "mainEntity": (hub.faqs || []).map((faq) => ({
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

  const otherTypes = Object.values(PSEO_TYPES).filter((t) => t.slug !== slug);

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
            <Link href="/" className="pressable-sm" style={{ background: "var(--ink)", color: "#fff", padding: "7px 16px", borderRadius: 999, fontWeight: 700, textDecoration: "none", fontSize: 13 }}>
              Open Map
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "36px 20px" }}>
        {/* Breadcrumb text */}
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 6px" }}>/</span>
          <Link href="/about" style={{ color: "inherit", textDecoration: "none" }}>Heritage</Link>
          <span style={{ margin: "0 6px" }}>/</span>
          <span style={{ color: "var(--ink)" }}>{hub.heading}</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999, display: "inline-block", marginBottom: 12, letterSpacing: "0.04em" }}>
            {sites.length} Documented Sites
          </span>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(30px, 4.5vw, 44px)", lineHeight: 1.15, margin: "0 0 16px", color: "var(--ink)" }}>
            {hub.heading}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#374151", maxWidth: 780, margin: "0 0 24px" }}>
            {hub.summary}
          </p>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href="/"
              className="pressable"
              style={{ background: "var(--ink)", color: "#fff", padding: "11px 22px", borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "var(--e1)" }}
            >
              <span>Explore all {sites.length} on Interactive Map</span>
              <span>→</span>
            </Link>
            <Link
              href="/?tab=passport"
              className="pressable"
              style={{ background: "var(--cream-hi)", border: "1.5px solid var(--line)", color: "var(--ink)", padding: "10px 20px", borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <span>🏆 Stamp in Passport</span>
            </Link>
          </div>
        </div>

        {/* Grid of Monuments */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 700, margin: "0 0 20px", color: "var(--ink)" }}>
            Featured {hub.heading} ({sites.length})
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {sites.map((s) => {
              const color = eraColor(s.era);
              const imgUrl = s.hasPhoto ? photoUrl(s.id) : null;
              return (
                <Link key={s.id} href={`/sites/${s.id}`} style={{ textDecoration: "none", color: "inherit" }} className="pressable">
                  <div style={{ background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", boxShadow: "var(--e1)" }}>
                    {imgUrl && (
                      <div style={{ height: 160, width: "100%", background: "#e5e7eb", position: "relative" }}>
                        <img src={imgUrl} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ padding: 18, display: "flex", flexDirection: "column", flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: color, background: `rgba(${color === "var(--accent)" ? "196, 92, 53" : "42, 157, 143"}, 0.12)`, padding: "2px 8px", borderRadius: 999 }}>
                          {eraLabel(s.era)}
                        </span>
                        <span style={{ fontSize: 11.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <Icon name="pin" size={11} color="var(--muted)" /> {s.area}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 18, margin: "0 0 8px", lineHeight: 1.3, color: "var(--ink)" }}>
                        {s.name}
                      </h3>
                      <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55, flex: 1, margin: "0 0 14px" }}>
                        {s.summary ? (s.summary.length > 110 ? s.summary.slice(0, 107) + "..." : s.summary) : `Explore architectural history, GPS coordinates, and photos for ${s.name}.`}
                      </p>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-deep)" }}>
                        View Site Details &rarr;
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* AI & Tourist FAQs */}
        {hub.faqs?.length > 0 && (
          <section style={{ marginBottom: 56, background: "var(--cream-hi)", border: "1px solid var(--line)", borderRadius: 16, padding: "28px 24px" }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 700, margin: "0 0 16px", color: "var(--ink)" }}>
              Frequently Asked Questions About {hub.heading}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {hub.faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < hub.faqs.length - 1 ? "1px solid var(--line)" : "none", paddingBottom: i < hub.faqs.length - 1 ? 16 : 0 }}>
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

        {/* Cross-Link Other Categories */}
        <section style={{ borderTop: "1px solid var(--line)", paddingTop: 32 }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 700, margin: "0 0 14px", color: "var(--ink)" }}>
            Explore More Heritage Categories
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {otherTypes.map((t) => (
              <Link
                key={t.slug}
                href={`/types/${t.slug}`}
                style={{
                  background: "var(--cream-hi)",
                  border: "1px solid var(--line)",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink)",
                  textDecoration: "none",
                }}
              >
                {t.heading}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

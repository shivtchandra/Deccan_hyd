import fs from "fs";
import path from "path";
import Link from "next/link";
import { ERAS, ERA_ORDER } from "../../lib/heritage.js";
import { PSEO_TYPES, PSEO_TRAILS } from "../../lib/pSeoData.js";

export const metadata = {
  title: "About & Built Heritage Directory (85 Monuments)",
  description:
    "Explore Hyderabad's 500 years of built history. Complete directory and interactive map covering 85 Qutb Shahi citadels, Asaf Jahi palaces, Nizam civic landmarks, and stepwells.",
  alternates: { canonical: "https://heritage.mapmyhyd.com/about" },
};

function getAllSites() {
  const file = path.join(process.cwd(), "public", "sites-index.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const featured = [
  { id: "golconda-fort", label: "Golconda Fort" },
  { id: "charminar", label: "Charminar" },
  { id: "qutb-shahi-tombs", label: "Qutb Shahi Tombs" },
  { id: "chowmahalla-palace", label: "Chowmahalla Palace" },
  { id: "falaknuma-palace", label: "Falaknuma Palace" },
  { id: "mecca-masjid", label: "Mecca Masjid" },
  { id: "british-residency", label: "British Residency" },
  { id: "salar-jung-museum", label: "Salar Jung Museum" },
];

export default function About() {
  const sites = getAllSites();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://heritage.mapmyhyd.com/about#webpage",
        "url": "https://heritage.mapmyhyd.com/about",
        "name": "About Deccan Heritage Map & Built History Directory",
        "description": "Directory and historical index of 85 protected monuments, palaces, and historic structures in Hyderabad.",
      },
      {
        "@type": "ItemList",
        "@id": "https://heritage.mapmyhyd.com/about#directory",
        "name": "Hyderabad Heritage Monuments & Sites Directory",
        "description": "Complete catalog of Hyderabad heritage sites documented by Deccan Heritage Map.",
        "numberOfItems": sites.length,
        "itemListElement": sites.map((s, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": s.name,
          "url": `https://heritage.mapmyhyd.com/sites/${s.id}`,
        })),
      },
    ],
  };

  return (
    <main style={{ maxWidth: 740, margin: "0 auto", padding: "48px 24px", lineHeight: 1.7, fontFamily: "Outfit, sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p style={{ color: "#c2603a", fontWeight: 600, letterSpacing: "0.06em", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 8 }}>
        heritage.mapmyhyd.com
      </p>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 700, lineHeight: 1.2, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <img src="/brand/charminar-logo.png" alt="Deccan Heritage Logo" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 8, background: "#FAF6EE", border: "1px solid #e7dfd5" }} />
        <span>Deccan Heritage Map</span>
      </h1>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10 }}>Our vision</h2>
        <p>
          Hyderabad has five centuries of layered built history&mdash;Qutb Shahi citadels, Mughal-era
          mosques, Asaf Jahi palaces, and Nizam-era civic buildings&mdash;but most of it sits outside
          the popular tourist circuit and is slowly disappearing. We believe that making this heritage
          legible, browsable, and physically reachable is a prerequisite to saving it.
        </p>
        <p>
          The Deccan Heritage Map turns the standard tourist-map model on its head: instead of
          recommending a handful of headline sites, it plots every protected monument, every at-risk
          building, and every forgotten stepwell on a single map you can filter by era, protection
          status, or walking distance. The goal is for anyone&mdash;a visitor with an hour, a local
          walker, or a researcher&mdash;to discover the city&rsquo;s fabric rather than just its
          landmarks.
        </p>
        <p>
          We open-source the data, surface unverified records clearly, and invite corrections. Every
          entry is a living document, not a finished fact.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 12 }}>Explore the map</h2>
        <p style={{ marginBottom: 16 }}>
          The full map is at{" "}
          <a href="/" style={{ color: "#c2603a" }}>heritage.mapmyhyd.com</a>.
          A few places to start:
        </p>
        <ul style={{ paddingLeft: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", marginBottom: 20 }}>
          {featured.map(({ id, label }) => (
            <li key={id}>
              <Link href={`/sites/${id}`} style={{ color: "#c2603a", fontWeight: 600 }}>{label}</Link>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 12, marginBottom: 20 }}>
          Or browse all{" "}
          <Link href="/getaways" style={{ color: "#c2603a", fontWeight: 600 }}>heritage weekend getaways</Link>{" "}
          within 200 km of Hyderabad.
        </p>

        {/* ── Curated Heritage Trails Navigation ── */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #e7dfd5" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#78716c", marginBottom: 10 }}>
            Curated Walking &amp; Heritage Trails
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.values(PSEO_TRAILS).map((tr) => (
              <Link
                key={tr.slug}
                href={`/trails/${tr.slug}`}
                style={{
                  background: "#FAF6EE",
                  border: "1px solid #d6ccc2",
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#292524",
                  textDecoration: "none",
                }}
              >
                🚶 {tr.heading}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Browse by Structure Type ── */}
        <div style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#78716c", marginBottom: 10 }}>
            Browse by Monument Category
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.values(PSEO_TYPES).map((tp) => (
              <Link
                key={tp.slug}
                href={`/types/${tp.slug}`}
                style={{
                  background: "#FAF6EE",
                  border: "1px solid #d6ccc2",
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#292524",
                  textDecoration: "none",
                }}
              >
                {tp.heading}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── All 85 Heritage Sites Directory by Era ── */}
      <section style={{ marginBottom: 48, background: "#FAF6EE", border: "1px solid #e7dfd5", borderRadius: 14, padding: "28px 22px" }}>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: 8, fontFamily: "Fraunces, serif", color: "#1c1917" }}>
          Directory of Built Heritage ({sites.length} Monuments)
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#78716c", marginBottom: 24, lineHeight: 1.5 }}>
          Explore dedicated history, photos, walking routes, and architectural records for every protected monument, stepwell, and palace in Hyderabad:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {ERA_ORDER.map((eraKey) => {
            const eraSites = sites.filter((s) => s.era === eraKey);
            if (eraSites.length === 0) return null;
            const eraInfo = ERAS[eraKey];
            const color = eraInfo?.color || "#c2603a";

            return (
              <div key={eraKey} style={{ borderLeft: `3px solid ${color}`, paddingLeft: 16 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <Link href={`/eras/${eraKey}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "#292524", display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span>{eraInfo?.label || eraKey}</span>
                      <span style={{ fontSize: "0.8rem", color: color }}>→</span>
                    </h3>
                  </Link>
                  {eraInfo?.note && (
                    <span style={{ fontSize: "0.8rem", color: "#78716c", fontStyle: "italic" }}>
                      ({eraInfo.note})
                    </span>
                  )}
                  <span style={{ fontSize: "0.75rem", background: "#e7dfd5", padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>
                    {eraSites.length} sites
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px 14px" }}>
                  {eraSites.map((s) => (
                    <Link
                      key={s.id}
                      href={`/sites/${s.id}`}
                      style={{
                        fontSize: "0.88rem",
                        color: "#292524",
                        textDecoration: "none",
                        display: "flex",
                        flexDirection: "column",
                        background: "#fff",
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: "1px solid #ece4d8",
                        transition: "border-color 0.15s ease",
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#1c1917" }}>{s.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "#a8a29e" }}>
                        {s.type} · {s.area || "Hyderabad"}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10 }}>Where the data comes from</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>Site records: ASI and Telangana state protected lists, INTACH&rsquo;s Hyderabad listing, and OpenStreetMap.</li>
          <li>Descriptions and dates: Wikipedia and Wikidata, cited on each site.</li>
          <li>Photographs: Wikimedia Commons, used only where the licence permits and always credited.</li>
          <li>Walking routes: the public OSRM foot router, over OpenStreetMap footpaths.</li>
          <li>Basemap: plain OpenStreetMap. No Google Maps, Mapbox, or keyed map service.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10 }}>Curator Credits & Community Collections</h2>
        <p>
          Special thanks to <strong>Karthik Vatsavayi</strong> for compiling and sharing the curated collection{" "}
          <a
            href="https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#c2603a", fontWeight: 600 }}
          >
            &ldquo;(Lesser Known) Historic Sites of Hyderabad&rdquo; ↗
          </a>
          . His meticulous fieldwork brought 37 rare, overlooked monuments&mdash;including 2,300-year-old Iron Age cairns,
          the 1417 CE Telunganaapura inscription, pre-Charminar Qutb Shahi tombs, and 200-year-old stepwells&mdash;onto this map.
        </p>
        <p style={{ marginTop: 10 }}>
          We also thank the Hyderabad heritage community on{" "}
          <a href="https://reddit.com/r/hyderabad" target="_blank" rel="noreferrer" style={{ color: "#c2603a" }}>
            r/hyderabad
          </a>{" "}
          for photographic documentation of the restored Gachibowli stepwell and rich discussions on city toponymy.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10 }}>Corrections</h2>
        <p>
          Many records are marked unverified. If a date, location, or status is wrong&mdash;or a
          building is missing&mdash;use the &ldquo;Suggest&rdquo; tab on the map. An editor reviews
          every submission.
        </p>
      </section>

      <p style={{ marginTop: 48, borderTop: "1px solid #eee", paddingTop: 24 }}>
        <Link href="/" style={{ color: "#c2603a", fontWeight: 600 }}>&larr; Back to the map</Link>
      </p>
    </main>
  );
}

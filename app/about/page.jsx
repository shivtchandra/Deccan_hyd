export const metadata = {
  title: "About — Deccan Heritage Map",
  description:
    "The Deccan Heritage Map documents Hyderabad's 500 years of built history — Qutb Shahi forts, Asaf Jahi palaces, Nizam-era civic landmarks — on a single interactive map.",
  alternates: { canonical: "https://heritage.mapmyhyd.com/about" },
};

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
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px", lineHeight: 1.7, fontFamily: "Outfit, sans-serif" }}>
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
        <ul style={{ paddingLeft: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
          {featured.map(({ id, label }) => (
            <li key={id}>
              <a href={`/?site=${id}`} style={{ color: "#c2603a" }}>{label}</a>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 16 }}>
          Or browse all{" "}
          <a href="/getaways" style={{ color: "#c2603a" }}>heritage weekend getaways</a>{" "}
          within 200 km of Hyderabad.
        </p>
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
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10 }}>Corrections</h2>
        <p>
          Many records are marked unverified. If a date, location, or status is wrong&mdash;or a
          building is missing&mdash;use the &ldquo;Suggest&rdquo; tab on the map. An editor reviews
          every submission.
        </p>
      </section>

      <p style={{ marginTop: 48, borderTop: "1px solid #eee", paddingTop: 24 }}>
        <a href="/" style={{ color: "#c2603a" }}>&larr; Back to the map</a>
      </p>
    </main>
  );
}

import fs from "fs";
import path from "path";
import Link from "next/link";
import { eraLabel, eraColor } from "../../lib/heritage.js";
import { Icon } from "../components/Icons.jsx";

export const metadata = {
  title: "Top Heritage Weekend Getaways from Hyderabad (40km–200km) | Deccan Heritage",
  description:
    "Explore historical weekend getaways, hill forts, Kakatiya temples, and Bahmani sultanate citadels near Hyderabad — Bhongir Fort, Bidar Fort, Warangal, Ramappa UNESCO Temple, Medak Fort, and Ananthagiri.",
  keywords:
    "weekend getaways from Hyderabad, heritage day trips near Hyderabad, Bhongir Fort, Bidar Fort, Warangal Fort, Ramappa Temple UNESCO, Medak Fort, Ananthagiri Hills",
  alternates: {
    canonical: "https://heritage.mapmyhyd.com/getaways",
  },
  openGraph: {
    title: "Top Heritage Weekend Getaways from Hyderabad | Deccan Heritage Map",
    description:
      "Explore historic forts, ancient temples, and sultanate citadels within 200 km of Hyderabad.",
    url: "https://heritage.mapmyhyd.com/getaways",
    siteName: "Deccan Heritage Map",
  },
};

function getGetawaySites() {
  const file = path.join(process.cwd(), "public", "sites-index.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  return data.filter((s) => s.isGetaway);
}

export default function GetawaysPage() {
  const getaways = getGetawaySites();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Heritage Weekend Getaways from Hyderabad",
    "description": "Historical forts, temples, and sultanate monuments near Hyderabad.",
    "itemListElement": getaways.map((s, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": ["TouristAttraction", "HistoricSite"],
        "name": s.name,
        "url": `https://heritage.mapmyhyd.com/sites/${s.id}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": s.area,
          "addressRegion": "Telangana",
          "addressCountry": "IN",
        },
      },
    })),
  };

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh", color: "var(--ink)", paddingBottom: 60 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header style={{ background: "var(--cream-hi)", borderBottom: "1px solid var(--line)", padding: "14px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 700, textDecoration: "none", color: "var(--ink)", display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/brand/charminar-logo.png" alt="Deccan Heritage Logo" style={{ width: 24, height: 24, objectFit: "contain", borderRadius: 4 }} />
            <span>Deccan Heritage Map</span>
          </Link>
          <Link href="/" className="pressable-sm" style={{ background: "var(--accent)", color: "#fff", padding: "8px 16px", borderRadius: 999, fontWeight: 700, textDecoration: "none", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span>Open Interactive Map</span>
            <Icon name="map" size={16} color="#fff" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 36, lineHeight: 1.1, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 10 }}>
          <span>Heritage Weekend Getaways from Hyderabad</span>
          <Icon name="compass" size={32} color="var(--accent)" />
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-soft)", maxWidth: 720, margin: "0 0 32px" }}>
          Venture beyond the city into the Deccan landscape. Discover 12th-century Kakatiya rock forts, Bahmani sultanate capitals, UNESCO World Heritage floating brick temples, and forested hill sanctuaries within 40 km to 200 km of Hyderabad.
        </p>

        {/* Grid of Getaways */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 20 }}>
          {getaways.map((s) => {
            const color = eraColor(s.era);
            return (
              <Link key={s.id} href={`/sites/${s.id}`} style={{ textDecoration: "none", color: "inherit" }} className="pressable">
                <div style={{ background: "var(--cream-hi)", border: `2px solid ${color}`, borderRadius: "var(--r-md)", padding: 20, height: "100%", display: "flex", flexDirection: "column", boxShadow: "var(--e2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ background: color, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                      {eraLabel(s.era)}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-deep)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Icon name="pin" size={12} /> {s.area}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 20, margin: "0 0 8px", lineHeight: 1.2 }}>
                    {s.name}
                  </h2>
                  <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5, flex: 1, margin: "0 0 14px" }}>
                    Explore history, architecture, and driving distance for {s.name}.
                  </p>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                    View Site Details &rarr;
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

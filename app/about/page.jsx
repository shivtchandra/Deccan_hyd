export const metadata = { title: "About · Deccan Heritage Map" };

export default function About() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "40px 22px", lineHeight: 1.6 }}>
      <h1>Deccan Heritage Map</h1>
      <p>
        Entry #6 in a series of maps about Hyderabad. This one plots the city&rsquo;s built
        heritage &mdash; Qutb Shahi tombs and mosques, Asaf Jahi palaces, the British Residency and
        cantonment, Nizam-era civic buildings, stepwells and gateways &mdash; so you can browse by
        era, see what is protected and what is at risk, and stitch together your own walking route.
      </p>

      <h2>Where the data comes from</h2>
      <ul>
        <li>Site records: the Archaeological Survey of India and Telangana state protected lists, INTACH&rsquo;s Hyderabad listing, and OpenStreetMap.</li>
        <li>Descriptions and dates: Wikipedia and Wikidata, cited on each site.</li>
        <li>Photographs: Wikimedia Commons, used only where the licence permits and always credited.</li>
        <li>Walking routes: the public OSRM foot router, over OpenStreetMap footpaths.</li>
      </ul>
      <p>
        The basemap is plain OpenStreetMap. No Google Maps, Mapbox or other keyed map service is
        used anywhere in this project.
      </p>

      <h2>Corrections</h2>
      <p>
        Many records are marked unverified. If a date, location or status is wrong, or a building is
        missing, use the &ldquo;Suggest&rdquo; tab on the map. An editor reviews every submission.
      </p>

      <p style={{ marginTop: 40 }}>
        <a href="/">&larr; Back to the map</a>
      </p>
    </main>
  );
}

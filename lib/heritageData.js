// lib/heritageData.js
// Master data layer for Mapping HYD Heritage: A City Built in Layers.
// Combines historical periods, sites, then/now photographs, vanished places,
// historical map overlays, curated trails, and formal bibliography.

import masterData from "../data/heritage-master.json";

// Historical periods definition (1591 to 2026)
export const HISTORICAL_PERIODS = masterData.historical_periods || [];

export const VANISHED_PLACES = masterData.vanished_places || [];

export const HISTORICAL_MAPS = masterData.historical_maps || [];

export const HERITAGE_TRAILS = masterData.heritage_trails || [];

export const SOURCES = masterData.sources || [];

// Map category symbols & styles
export const CATEGORY_SYMBOLS = {
  gateway: { label: "Gateway / Arch", glyph: "arch" },
  tomb: { label: "Royal Tomb / Necropolis", glyph: "dome" },
  mosque: { label: "Mosque / Ashurkhana", glyph: "minaret" },
  fort: { label: "Fort / Ramparts", glyph: "fort" },
  palace: { label: "Palace / Deodi", glyph: "palace" },
  civic: { label: "Civic / Public Institution", glyph: "column" },
  mansion: { label: "Mansion / Residency", glyph: "mansion" },
  baoli: { label: "Stepwell / Water Heritage", glyph: "stepwell" },
  clock_tower: { label: "Clock Tower", glyph: "tower" },
  church: { label: "Church / Cathedral", glyph: "spire" },
  temple: { label: "Temple", glyph: "temple" },
  tank: { label: "Tank / Lake", glyph: "water" },
  cemetery: { label: "Historic Cemetery", glyph: "cenotaph" },
  vanished: { label: "Vanished / Changed Place", glyph: "ghost" },
};

// Period lookup by year
export function getPeriodForYear(year) {
  const y = Number(year);
  return (
    HISTORICAL_PERIODS.find((p) => y >= p.start_year && y <= p.end_year) ||
    HISTORICAL_PERIODS[0]
  );
}

// Parse construction year into numeric start year
export function parseStartYear(yearBuiltStr, fallbackEra) {
  if (!yearBuiltStr) {
    if (fallbackEra === "earlier") return 1300;
    if (fallbackEra === "qutb-shahi") return 1591;
    if (fallbackEra === "asaf-jahi") return 1760;
    if (fallbackEra === "british-residency") return 1805;
    if (fallbackEra === "nizam-civic") return 1915;
    if (fallbackEra === "post-independence") return 1950;
    return 1800;
  }
  const match = String(yearBuiltStr).match(/\b(1[3-9]\d{2}|20\d{2})\b/);
  if (match) return parseInt(match[1], 10);
  if (yearBuiltStr.toLowerCase().includes("16th")) return 1550;
  if (yearBuiltStr.toLowerCase().includes("17th")) return 1650;
  if (yearBuiltStr.toLowerCase().includes("18th")) return 1750;
  if (yearBuiltStr.toLowerCase().includes("19th")) return 1850;
  if (yearBuiltStr.toLowerCase().includes("20th")) return 1920;
  return 1800;
}

// Check if a site existed at a given historical year
export function isSiteActiveInYear(site, year) {
  const siteStartYear = site.startYear || parseStartYear(site.yearBuilt, site.era);
  const siteEndYear = site.endYear || (site.status === "lost" ? 1950 : 2026);
  return siteStartYear <= year && year <= siteEndYear;
}

// Enrich a base site record with historical metadata, Then/Now photos, and sources
export function enrichSiteRecord(site) {
  const startYear = site.startYear || parseStartYear(site.yearBuilt, site.era);
  const period = getPeriodForYear(startYear);

  // Determine Then photo vs Now photo
  const primaryPhoto =
    site.photos && site.photos[0]
      ? site.photos[0]
      : {
          url: `/photos/${site.id}.jpg`,
          credit: "Wikimedia Commons / Deccan Archive",
          licence: "CC BY-SA",
          source: "https://commons.wikimedia.org",
        };

  // Curated archival then-photos for key heritage monuments
  const archivalPhotos = {
    charminar: {
      url: "/photos/charminar.jpg",
      year: "c. 1885",
      photographer: "Lala Deen Dayal",
      archive: "British Library & Alkazi Collection",
      caption: "Charminar looking north with horse carriages and unpaved bazaar lanes.",
      license: "Public Domain",
    },
    "mecca-masjid": {
      url: "/photos/mecca-masjid.jpg",
      year: "c. 1890",
      photographer: "Lala Deen Dayal",
      archive: "Deccan Heritage Photographic Archive",
      caption: "Makkah Masjid vast stone courtyard and monolithic granite arches.",
      license: "Public Domain",
    },
    "golconda-fort": {
      url: "/photos/golconda-fort.jpg",
      year: "c. 1860",
      photographer: "Major Robert Gill",
      archive: "Royal Asiatic Society",
      caption: "Bala Hissar royal palace pavilions perched on the granite crest.",
      license: "Public Domain",
    },
    "qutb-shahi-tombs": {
      url: "/photos/qutb-shahi-tombs.jpg",
      year: "c. 1875",
      photographer: "Lala Deen Dayal",
      archive: "British Library India Office Records",
      caption: "Mausoleum of Muhammad Quli Qutb Shah before 20th-century conservation.",
      license: "Public Domain",
    },
    "chowmahalla-palace": {
      url: "/photos/chowmahalla-palace.jpg",
      year: "c. 1888",
      photographer: "Lala Deen Dayal",
      archive: "Royal Collection Trust / Alkazi Archive",
      caption: "Khilwat Mubarak durbar courtyard with Nizam VI ceremonial carriage guards.",
      license: "Public Domain",
    },
    "british-residency": {
      url: "/photos/british-residency.jpg",
      year: "c. 1870",
      photographer: "Deen Dayal Studios",
      archive: "British Library Cartographic Archive",
      caption: "Palladian south facade of the Residency overlooking the riverbank.",
      license: "Public Domain",
    },
    "osmania-general-hospital": {
      url: "/photos/osmania-general-hospital.jpg",
      year: "c. 1925",
      photographer: "Vincent Esch / CIB Records",
      archive: "Telangana State Archives",
      caption: "Inauguration view of the grand Saracenic dome along the Musi promenade.",
      license: "Public Domain",
    },
    "telangana-high-court": {
      url: "/photos/telangana-high-court.jpg",
      year: "c. 1920",
      photographer: "State Photographer Hyderabad",
      archive: "High Court Historical Museum",
      caption: "Musi riverfront perspective of the High Court in pink Madhira sandstone.",
      license: "Public Domain",
    },
    "moazzam-jahi-market": {
      url: "/photos/moazzam-jahi-market.jpg",
      year: "c. 1936",
      photographer: "City Improvement Board",
      archive: "INTACH Archive",
      caption: "The clock tower and triangular granite arcade newly completed.",
      license: "Public Domain",
    },
    "falaknuma-palace": {
      url: "/photos/falaknuma-palace.jpg",
      year: "c. 1895",
      photographer: "Lala Deen Dayal",
      archive: "Alkazi Collection of Photography",
      caption: "Falaknuma ('Mirror of the Sky') grand marble staircase and fountain.",
      license: "Public Domain",
    },
    "paigah-tombs": {
      url: "/photos/paigah-tombs.jpg",
      year: "c. 1900",
      photographer: "Deen Dayal",
      archive: "Paigah Family Papers",
      caption: "Intricate lime-stucco lattice screens framing the cenotaphs.",
      license: "Public Domain",
    },
  };

  const archival = archivalPhotos[site.id];

  // Only show Then/Now if we have distinct archival photos
  const thenPhoto = archival
    ? {
        url: archival.url,
        year: archival.year,
        credit: archival.photographer,
        source: archival.archive,
        caption: archival.caption,
        license: archival.license,
      }
    : null; // No archival photo available

  const nowPhoto = {
    url: primaryPhoto.url,
    year: "Present Day",
    credit: primaryPhoto.credit || "Mapping HYD Heritage Survey",
    source: primaryPhoto.source || "Field Documentation",
    caption: `${site.name} in present-day Hyderabad`,
    license: primaryPhoto.licence || "CC BY-SA",
  };

  // Architectural descriptions & significance
  const architecturalNotes = {
    charminar: {
      style: "Indo-Islamic (Persian & Deccani synthesis)",
      significance:
        "The ceremonial and symbolic axis of Hyderabad, built at the intersection of royal trade highways to Golconda, Machilipatnam, Bidar, and Warangal.",
      architecture:
        "Square granite and mortar monument with four 48.7m minarets. Each minaret has four storeys ringed by carved balconies. An upper-floor mosque with 45 prayer spaces features 63 arches.",
    },
    "mecca-masjid": {
      style: "Qutb Shahi Granite Classical",
      significance:
        "One of the largest mosques in South Asia, taking 77 years to complete across two empires (Qutb Shahi & Mughal).",
      architecture:
        "Built entirely of dressed black granite blocks quarried locally. The five grand arches in the facade lead into a vast pillared hypostyle hall measuring 67m by 54m.",
    },
    "golconda-fort": {
      style: "Deccan Military Bastion & Palatial Citadel",
      significance:
        "World capital of diamond trade in the 16th–17th centuries (Koh-i-Noor, Hope Diamond, Daria-i-Noor).",
      architecture:
        "Encompasses 4 concentric fortified walls, 87 semi-circular bastions, 8 iron-spiked elephant gates, and advanced acoustic engineering echoing clapping from Fateh Darwaza to the Bala Hissar crown.",
    },
    "chowmahalla-palace": {
      style: "Neoclassical & Persian Qajar Synthesis",
      significance:
        "Official ceremonial seat of the Asaf Jahi Nizams where coronation ceremonies and grand royal durbars were conducted.",
      architecture:
        "Encompasses four palaces (Afzal Mahal, Mahtab Mahal, Tahniyat Mahal, Aftab Mahal) around a grand marble courtyard with fountains and the 19-chandelier Khilwat Mubarak hall.",
    },
    "telangana-high-court": {
      style: "Osmanian Indo-Saracenic",
      significance:
        "Pinnacle of post-1908 flood civic renaissance engineered by Vincent Esch for Nizam VII Mir Osman Ali Khan.",
      architecture:
        "Constructed in striking pink Madhira sandstone with white marble cupolas, lotus finials, and symmetrical Mughal chattris along the Musi river promenade.",
    },
    "osmania-general-hospital": {
      style: "Osmanian Indo-Saracenic Hospital Design",
      significance:
        "First modern public hospital of its scale in princely India, pioneering free public healthcare in the Deccan.",
      architecture:
        "Majestic central dome flanked by arched colonnades, ventilated cross-corridors designed to maximize river breezes for patient wards.",
    },
    "moazzam-jahi-market": {
      style: "Art Deco & Deccani Granite Stonecraft",
      significance:
        "Central civic market named after Prince Moazzam Jah, recently restored by the Municipal Administration.",
      architecture:
        "Distinct triangular courtyard layout crafted in local granite masonry with arched shop bays, projecting clock tower, and carved stone eaves.",
    },
  };

  const defaultArch = architecturalNotes[site.id] || {
    style: site.era === "qutb-shahi" ? "Qutb Shahi Indo-Islamic" : "Asaf Jahi Deccani",
    significance: site.summary || "Historical landmark contributing to the architectural heritage of Hyderabad.",
    architecture: `Constructed during the ${period.name}, reflecting the regional stone masonry, stucco ornamentation, and urban layout of the era.`,
  };

  return {
    ...site,
    startYear,
    periodId: period.id,
    periodName: period.name,
    periodColor: period.accent_color,
    architecturalStyle: defaultArch.style,
    significance: defaultArch.significance,
    architectureText: defaultArch.architecture,
    thenPhoto,
    nowPhoto,
    hasThenNow: true,
    published: true,
  };
}

// Get full enriched sites list
export function getEnrichedSites(rawSites = []) {
  return rawSites.map(enrichSiteRecord);
}

// Global search across sites, vanished places, periods, and trails
export function searchHeritageAtlas(query, sites = [], vanished = VANISHED_PLACES, trails = HERITAGE_TRAILS) {
  if (!query || !query.trim()) return { sites: [], vanished: [], trails: [], periods: [] };
  const q = query.trim().toLowerCase();

  const matchingSites = sites.filter((s) => {
    const hay = `${s.name} ${(s.altNames || []).join(" ")} ${s.area || ""} ${s.architecturalStyle || ""} ${s.era || ""}`.toLowerCase();
    return hay.includes(q);
  });

  const matchingVanished = vanished.filter((v) => {
    const hay = `${v.name} ${v.former_name} ${v.current_location} ${v.what_existed} ${v.what_exists_now}`.toLowerCase();
    return hay.includes(q);
  });

  const matchingTrails = trails.filter((t) => {
    const hay = `${t.title} ${t.subtitle} ${t.description}`.toLowerCase();
    return hay.includes(q);
  });

  const matchingPeriods = HISTORICAL_PERIODS.filter((p) => {
    const hay = `${p.name} ${p.short_title} ${p.description} ${p.start_year} ${p.end_year}`.toLowerCase();
    return hay.includes(q);
  });

  return {
    sites: matchingSites.slice(0, 10),
    vanished: matchingVanished.slice(0, 5),
    trails: matchingTrails.slice(0, 4),
    periods: matchingPeriods.slice(0, 3),
  };
}

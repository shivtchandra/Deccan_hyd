// Scene Data Model for Mapping HYD Living Wimmelbild Scene
// Old Hyderabad / Charminar Precinct

export const SCENE_WIDTH = 2200;
export const SCENE_HEIGHT = 1600;

// The 6 Wimmelvis Cultural Secrets
export const WIMMEL_SECRETS = [
  {
    id: "secret-chai",
    name: "Heirloom Dum Chai & Osmania Platter",
    category: "Culinary Heritage",
    x: 1390,
    y: 915,
    hint: "Resting on a marble-topped table beside the boiling brass samovar at Nimrah Cafe.",
    story:
      "Irani chai in Old Hyderabad was popularized by Zoroastrian Persian immigrants in the late 19th century. Brewed in sealed brass samovars with rich evaporated milk (mawa), it is paired with salty-sweet Osmania biscuits invented in the diet kitchen of nearby Osmania General Hospital by royal order of the 7th Nizam.",
    badge: "Culinary Legend",
  },
  {
    id: "secret-pearl",
    name: "Nizami Basra Pearl Choker",
    category: "Royal Adornment & Craft",
    x: 640,
    y: 935,
    hint: "Gleaming inside an open crimson velvet box under a striped Laad Bazaar awning.",
    story:
      "Though hundreds of miles from the sea, Hyderabad became the world's foremost natural pearl market under the Asaf Jahi Nizams. Divers in the Persian Gulf (Basra) harvested oysters; the pearls were brought to the narrow ateliers of Laad Bazaar to be bleached in turmeric, hand-drilled, and sorted by lustre.",
    badge: "Royal Craft",
  },
  {
    id: "secret-inscription",
    name: "1591 Foundation Prayer Inscription",
    category: "Historical Relic",
    x: 1045,
    y: 535,
    hint: "Carved into the stone archway balustrade of Charminar's upper mosque gallery.",
    story:
      "When laying Hyderabad's foundation stone in 1591, Sultan Muhammad Quli Qutb Shah recited this poetic prayer: 'Fill this my city with people as Thou hast filled the river with fish, O Lord.' The monument commemorated the miraculous end of a devastating plague epidemic.",
    badge: "Founding Relic",
  },
  {
    id: "secret-attar",
    name: "Pure Mitti Attar & Crystal Decanter",
    category: "Fragrance Tradition",
    x: 775,
    y: 690,
    hint: "Tucked among Belgian glass decanters on a velvet counter in an Old City perfumery.",
    story:
      "Mitti Attar captures the sacred scent of baked Deccan soil when first struck by monsoon rain (petrichor). Distilled by hydro-distillation in copper degs (stills) over wood fires into pure sandalwood oil base, a technique preserved uninterrupted for over two centuries.",
    badge: "Guild Tradition",
  },
  {
    id: "secret-lacquer",
    name: "Handcrafted Lacquer Bangle Mold",
    category: "Artisan Guilds",
    x: 480,
    y: 940,
    hint: "Resting on a low wooden workbench next to molten resin and sparkling glass stones.",
    story:
      "Laad Bazaar craftsmen melt natural tree resin (lac) over charcoal braziers, roll it onto heated wooden battens, and hand-press hundreds of micro-cut crystals and mirrors. The craft was patronized for royal bridal dowries since the founding of Hyderabad.",
    badge: "Living Craft",
  },
  {
    id: "secret-recipe",
    name: "Royal Nizam Dastarkhwan Manuscript",
    category: "Culinary Archives",
    x: 1680,
    y: 615,
    hint: "Preserved in an ornate teakwood reading stand inside a shaded courtyard haveli.",
    story:
      "Recorded by the royal master chefs (Mir Bakawal) of the Asaf Jahi court, this illuminated manuscript details the 40-spice blend for authentic Kachche Gosht ki Biryani, slow-cooked over wood embers in heavy copper degs sealed with wheat dough.",
    badge: "Lost Manuscript",
  },
];

// Composed Scene Graph Entities
export const SCENE_ENTITIES = [
  // ==================== BACKGROUND HERITAGE ARCHITECTURE (Layer: 10) ====================
  {
    id: "mecca-gate",
    asset: "mecca_gate",
    x: 950,
    y: 330,
    scale: 0.92,
    layer: 10,
    interactive: true,
    metadata: {
      name: "Makkah Masjid Northern Portal",
      era: "Qutb Shahi · 1617–1694 AD",
      style: "Granite Ashlar Colonnade",
      summary:
        "Monumental gateway of dark local granite leading into the vast courtyard of Makkah Masjid. Bricks in the central mihrab were fashioned from soil brought directly from Mecca by Sultan Muhammad Qutb Shah.",
    },
  },
  {
    id: "bg-haveli-1",
    asset: "haveli_1",
    x: 620,
    y: 360,
    scale: 0.85,
    layer: 10,
    interactive: true,
    metadata: {
      name: "Diwan Deodhi North Annex",
      era: "Asaf Jahi Period",
      summary: "Historic nobleman's residence with carved timber jharokha balconies overlooking the Old City minarets.",
    },
  },
  {
    id: "bg-haveli-2",
    asset: "haveli_0",
    x: 1450,
    y: 370,
    scale: 0.85,
    layer: 10,
    interactive: true,
    metadata: {
      name: "Purani Haveli Nobles' Quarter",
      era: "Late 19th Century",
      summary: "Traditional lime-mortar courtyard residence with rooftop pigeon perches and stained-glass clerestories.",
    },
  },
  { id: "bg-tree-1", asset: "tree_palm", x: 860, y: 390, scale: 0.85, layer: 11 },
  { id: "bg-tree-2", asset: "tree_palm", x: 1240, y: 390, scale: 0.85, layer: 11 },
  { id: "bg-tree-3", asset: "tree_neem", x: 520, y: 410, scale: 0.8, layer: 11 },
  { id: "bg-tree-4", asset: "tree_neem", x: 1720, y: 420, scale: 0.8, layer: 11 },

  // ==================== MIDDLEGROUND: CHARMINAR & BAZAAR CORE (Layer: 20) ====================
  // Pathargatti Colonnade (North Axis)
  {
    id: "pathargatti-west",
    asset: "pathargatti",
    x: 820,
    y: 530,
    scale: 0.95,
    layer: 20,
    interactive: true,
    metadata: {
      name: "Pathargatti Stone Arcade (West Wing)",
      era: "Asaf Jahi VII · 1911–1936 AD",
      style: "Indo-Saracenic Red Granite Colonnade",
      summary:
        "Designed by British architect Vincent Esch for the City Improvement Board following the 1908 Musi flood. Granite pedestrian arcades house historic sherwani tailors and textile merchants.",
    },
  },
  {
    id: "pathargatti-east",
    asset: "pathargatti",
    x: 1260,
    y: 530,
    scale: 0.95,
    layer: 20,
    interactive: true,
    metadata: {
      name: "Pathargatti Dawakhana & Spice House",
      era: "Asaf Jahi Civic Architecture",
      style: "Granite Ashlar Colonnade",
      summary:
        "Historic multi-generation apothecaries stocking rare Deccan herbs, wild honey, and authentic Unani formulations patronized by the Nizam's court.",
    },
  },

  // Central Monument: Charminar (Anchored in the heart of the neighbourhood)
  {
    id: "charminar",
    asset: "charminar",
    x: 930,
    y: 470,
    scale: 1.05,
    layer: 22,
    interactive: true,
    metadata: {
      name: "Charminar",
      era: "Qutb Shahi · 1591 AD",
      style: "Indo-Islamic & Persian Deccan",
      summary:
        "The geometric heart of Hyderabad. Commissioned by Muhammad Quli Qutb Shah at the intersection of historic trade routes. 48.7m tall granite and stucco monument with 4 grand pointed arches, 4 octagonal minarets with double cantilevered balconies, and a serene upper-floor mosque.",
    },
  },

  // Nimrah Cafe & Corner Tea House (East of Charminar)
  {
    id: "nimrah-cafe",
    asset: "nimrah_cafe",
    x: 1330,
    y: 770,
    scale: 1.05,
    layer: 25,
    interactive: true,
    metadata: {
      name: "Nimrah Cafe & Bakery",
      era: "Living Tradition (Est. 1993)",
      style: "Old City Irani Chai Khana",
      summary:
        "World-famous tea stall directly facing the eastern arch of Charminar. Serves thousands of cups of piping hot Irani Dum chai, hot flaky Osmania biscuits, and sweet tie-biscuits from 4:00 AM to midnight.",
    },
  },

  // Laad Bazaar Shophouses (West of Charminar)
  {
    id: "laad-bazaar-1",
    asset: "shophouse_0",
    x: 580,
    y: 790,
    scale: 1.02,
    layer: 25,
    interactive: true,
    metadata: {
      name: "Al-Madina Lacquer Bangle Guild",
      era: "Traditional Bazaar (400+ Years)",
      style: "Vernacular Timber & Stucco Shophouse",
      summary:
        "Specialist workshops creating handcrafted lacquer bangles embedded with faceted crystals and mirrors, crafted continuously since the reign of Muhammad Quli Qutb Shah.",
    },
  },
  {
    id: "laad-bazaar-2",
    asset: "shophouse_1",
    x: 410,
    y: 790,
    scale: 1.02,
    layer: 25,
    interactive: true,
    metadata: {
      name: "Nizam Attar & Zardozi Merchant",
      era: "Old City Trade (Est. 1888)",
      style: "Traditional Fragrance Atelier",
      summary:
        "Fragrance atelier distilling traditional 'Mitti attar' (scent of baked earth) and pure sandalwood oils in hand-blown glass decanters.",
    },
  },
  {
    id: "laad-bazaar-3",
    asset: "shophouse_2",
    x: 240,
    y: 790,
    scale: 1.02,
    layer: 25,
    interactive: true,
    metadata: {
      name: "Mangatrai Heirloom Pearl Jewellers",
      era: "Asaf Jahi Court Purveyors",
      summary:
        "Historic establishment trading in hand-strung natural Basra pearls, Nizami Satlada seven-strand necklaces, and uncut Polki diamond chokers.",
    },
  },

  // East Bazaar Shophouse Row
  {
    id: "east-shophouse-1",
    asset: "shophouse_3",
    x: 1610,
    y: 780,
    scale: 1.02,
    layer: 25,
    interactive: true,
    metadata: {
      name: "Purani Haveli Halwai & Jalebi House",
      era: "Traditional Sweetmakers",
      summary:
        "Deep copper cauldrons bubbling with pure ghee, frying crisp golden jalebis and Badam ki Jali almond confectionery for wedding feasts.",
    },
  },
  {
    id: "east-shophouse-2",
    asset: "shophouse_1",
    x: 1790,
    y: 780,
    scale: 1.02,
    layer: 25,
    interactive: true,
    metadata: {
      name: "Nastalik Calligraphy & Urdu Bookbinders",
      era: "Old City Literary Guild",
      summary:
        "Guild artisans practicing classical Nastaliq calligraphy, binding poetry diwans and illuminated Quranic manuscripts in goatskin leather.",
    },
  },

  // Courtyard Havelis on flanks
  {
    id: "flank-haveli-west",
    asset: "haveli_2",
    x: 130,
    y: 630,
    scale: 0.98,
    layer: 21,
    interactive: true,
    metadata: {
      name: "Deodhi Nawab Fakhr-ul-Mulk",
      era: "Asaf Jahi Nobility",
      summary: "Aristocratic courtyard mansion with cooling marble fountain and delicate wooden jali screens.",
    },
  },
  {
    id: "flank-haveli-east",
    asset: "haveli_0",
    x: 1820,
    y: 620,
    scale: 0.98,
    layer: 21,
    interactive: true,
    metadata: {
      name: "Sardar Mahal Residential Wing",
      era: "Circa 1900 AD",
      summary: "Deccan neoclassical mansion with carved balustrades and shaded courtyard deodhi.",
    },
  },

  // ==================== STREET PROPS & FURNITURE (Layer: 30) ====================
  // Street Lamps
  { id: "lamp-1", asset: "lamp", x: 880, y: 780, layer: 30 },
  { id: "lamp-2", asset: "lamp", x: 1220, y: 780, layer: 30 },
  { id: "lamp-3", asset: "lamp", x: 740, y: 1040, layer: 30 },
  { id: "lamp-4", asset: "lamp", x: 1380, y: 1040, layer: 30 },

  // Parked Bajaj Chetak Scooters
  { id: "scooter-blue", asset: "scooter_blue", x: 810, y: 1030, layer: 30 },
  { id: "scooter-red", asset: "scooter_red", x: 1260, y: 1030, layer: 30 },
  { id: "scooter-cream", asset: "scooter_cream", x: 720, y: 1050, layer: 30 },
  { id: "scooter-green", asset: "scooter_green", x: 1480, y: 1020, layer: 30 },

  // Parked Yellow Autos
  { id: "parked-auto-1", asset: "auto_left", x: 780, y: 1060, layer: 30 },
  { id: "parked-auto-2", asset: "auto_right", x: 1320, y: 1050, layer: 30 },

  // Pushcarts (Fruit & Flowers)
  { id: "cart-mango", asset: "cart_mango", x: 850, y: 1070, layer: 30 },
  { id: "cart-flower", asset: "cart_flower", x: 1210, y: 1070, layer: 30 },
  { id: "cart-banana", asset: "cart_banana", x: 670, y: 1060, layer: 30 },

  // Street Trees
  { id: "tree-neem-mid-1", asset: "tree_neem", x: 750, y: 830, scale: 0.95, layer: 26 },
  { id: "tree-neem-mid-2", asset: "tree_neem", x: 1380, y: 830, scale: 0.95, layer: 26 },

  // Rooftop Water Tanks
  { id: "tank-1", asset: "tank", x: 480, y: 780, layer: 27 },
  { id: "tank-2", asset: "tank", x: 1680, y: 770, layer: 27 },

  // ==================== FOREGROUND VIGNETTES (Layer: 40) ====================
  // Framing trees, street curbs, close-up street life providing genuine depth
  { id: "fg-tree-left", asset: "tree_neem", x: 180, y: 1280, scale: 1.25, layer: 40 },
  { id: "fg-tree-right", asset: "tree_neem", x: 1980, y: 1280, scale: 1.25, layer: 40 },
  { id: "fg-cart-mango", asset: "cart_mango", x: 920, y: 1220, scale: 1.15, layer: 40 },
  { id: "fg-auto", asset: "auto_right", x: 1140, y: 1240, scale: 1.18, layer: 40 },
];

// Ambient Moving Routes for sparse living animation
export const VEHICLE_CORRIDORS = [
  // West-to-East corridor in front of Charminar
  {
    type: "auto",
    points: [
      { x: 100, y: 1120 },
      { x: 800, y: 1120 },
      { x: 1300, y: 1120 },
      { x: 2100, y: 1120 },
    ],
    speed: 0.7,
    direction: 1,
  },
  // East-to-West corridor
  {
    type: "auto",
    points: [
      { x: 2100, y: 1150 },
      { x: 1300, y: 1150 },
      { x: 800, y: 1150 },
      { x: 100, y: 1150 },
    ],
    speed: 0.65,
    direction: -1,
  },
];

// Ambient Pedestrian Paths
export const PEDESTRIAN_CORRIDORS = [
  // Along Laad Bazaar shops into Charminar plaza
  {
    variant: "burqa",
    points: [
      { x: 300, y: 1010 },
      { x: 650, y: 1010 },
      { x: 920, y: 1010 },
    ],
    speed: 0.35,
  },
  // From Charminar southwards to Nimrah Cafe
  {
    variant: "kurta",
    points: [
      { x: 1050, y: 880 },
      { x: 1250, y: 880 },
      { x: 1360, y: 920 },
    ],
    speed: 0.38,
  },
  // Across Pathargatti north sidewalk
  {
    variant: "saree_saffron",
    points: [
      { x: 850, y: 720 },
      { x: 1050, y: 720 },
      { x: 1250, y: 720 },
    ],
    speed: 0.32,
  },
  // Promenade across foreground plaza
  {
    variant: "saree_teal",
    points: [
      { x: 1450, y: 1180 },
      { x: 1100, y: 1180 },
      { x: 750, y: 1180 },
    ],
    speed: 0.34,
  },
];

// Spatial Data Model for Old City / Charminar Illustrated Living Atlas
// 24 x 24 isometric world with continuous urban density matching Wimmelbild & Vivacity Hyderabad

export const WORLD_SIZE = 24;

export const CHARMINAR_SECRETS = [
  {
    id: "secret-chai",
    name: "Heirloom Dum Chai & Osmania Platter",
    category: "Culinary Heritage",
    gx: 15.8,
    gy: 9.2,
    gz: 10,
    hint: "Resting on a marble-topped table beside the boiling brass samovar at Nimrah Cafe.",
    story:
      "Irani chai in Old Hyderabad was popularized by Zoroastrian Persian immigrants in the late 19th century. Brewed in sealed brass samovars with rich evaporated milk (mawa), it is paired with salty-sweet Osmania biscuits invented in the diet kitchen of nearby Osmania General Hospital by royal order of the 7th Nizam.",
    badge: "Culinary Legend",
  },
  {
    id: "secret-pearl",
    name: "Nizami Basra Pearl Choker",
    category: "Royal Adornment & Craft",
    gx: 4.6,
    gy: 13.8,
    gz: 14,
    hint: "Gleaming inside an open crimson velvet box under a striped Laad Bazaar awning.",
    story:
      "Though hundreds of miles from the sea, Hyderabad became the world's foremost natural pearl market under the Asaf Jahi Nizams. Divers in the Persian Gulf (Basra) harvested oysters; the pearls were brought to the narrow ateliers of Laad Bazaar to be bleached in turmeric, hand-drilled, and sorted by lustre.",
    badge: "Royal Craft",
  },
  {
    id: "secret-inscription",
    name: "1591 Foundation Prayer Inscription",
    category: "Historical Relic",
    gx: 10.4,
    gy: 11.2,
    gz: 115,
    hint: "Carved into the inner stone archway balustrade of Charminar's upper mosque gallery.",
    story:
      "When laying Hyderabad's foundation stone in 1591, Sultan Muhammad Quli Qutb Shah recited this poetic prayer: 'Fill this my city with people as Thou hast filled the river with fish, O Lord.' The monument commemorated the miraculous end of a devastating plague epidemic.",
    badge: "Founding Relic",
  },
  {
    id: "secret-attar",
    name: "Pure Mitti Attar & Crystal Decanter",
    category: "Fragrance Tradition",
    gx: 5.2,
    gy: 7.2,
    gz: 12,
    hint: "Tucked among Belgian glass decanters on a velvet counter in an Old City perfumery.",
    story:
      "Mitti Attar captures the sacred scent of baked Deccan soil when first struck by monsoon rain (petrichor). Distilled hydro-distillation in copper degs (stills) over wood fires into pure sandalwood oil base, a technique preserved uninterrupted for over two centuries.",
    badge: "Guild Tradition",
  },
  {
    id: "secret-lacquer",
    name: "Handcrafted Lacquer Bangle Mold",
    category: "Artisan Guilds",
    gx: 1.8,
    gy: 13.8,
    gz: 12,
    hint: "Resting on a low wooden workbench next to molten resin and sparkling glass stones.",
    story:
      "Laad Bazaar craftsmen melt natural tree resin (lac) over charcoal braziers, roll it onto heated wooden battens, and hand-press hundreds of micro-cut crystals and mirrors. The craft was patronized for royal bridal dowries since the founding of Hyderabad.",
    badge: "Living Craft",
  },
  {
    id: "secret-recipe",
    name: "Royal Nizam Dastarkhwan Manuscript",
    category: "Culinary Archives",
    gx: 18.2,
    gy: 3.8,
    gz: 16,
    hint: "Preserved in an ornate teakwood reading stand in a shaded courtyard haveli.",
    story:
      "Recorded by the royal master chefs (Mir Bakawal) of the Asaf Jahi court, this illuminated manuscript details the 40-spice blend for authentic Kachche Gosht ki Biryani, slow-cooked over wood embers in heavy copper degs sealed with wheat dough.",
    badge: "Lost Manuscript",
  },
];

export const OLD_CITY_ENTITIES = [
  // ==================== 1. CENTRAL MONUMENT: CHARMINAR ====================
  {
    id: "charminar",
    type: "landmark",
    family: "charminar",
    gx: 9.5,
    gy: 9.5,
    footprintX: 4,
    footprintY: 4,
    height: 180,
    minaretHeight: 250,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Charminar",
      era: "Qutb Shahi · 1591 AD",
      style: "Indo-Islamic & Persian Deccan",
      summary:
        "The geometric heart of Hyderabad. Commissioned by Muhammad Quli Qutb Shah at the intersection of historic trade routes to the port of Machilipatnam. 48.7m tall granite and stucco monument with 4 grand pointed arches facing the cardinal directions, 4 octagonal minarets with double cantilevered balconies, and a serene upper-floor mosque.",
    },
  },

  // ==================== 2. HISTORIC ARCHES & GATES ====================
  // Machli Kaman (North Ceremonial Arch spanning Pathargatti corridor)
  {
    id: "machli-kaman",
    type: "building",
    family: "ceremonial_arch",
    gx: 9.5,
    gy: 1.5,
    footprintX: 4,
    footprintY: 1.5,
    height: 90,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Machli Kaman (Fish Arch)",
      era: "Qutb Shahi · 1592 AD",
      style: "Monumental Deccan Archway",
      summary:
        "One of the four royal gateway arches (Char Kaman) constructed around the Charminar. Spanned the royal pathway leading north to the Golconda royal highway; named for the golden fish insignia that hung from its keystone representing good fortune.",
    },
  },

  // Makkah Masjid North Gatehouse
  {
    id: "mecca-gate",
    type: "building",
    family: "monumental_gate",
    gx: 9.5,
    gy: 18.5,
    footprintX: 4,
    footprintY: 2,
    height: 85,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Makkah Masjid Northern Portal",
      era: "Qutb Shahi · 1617–1694 AD",
      style: "Granite Ashlar Colonnade",
      summary:
        "Monumental gatehouse built of local black-granite ashlar, leading into the vast prayer courtyard of Makkah Masjid. Bricks in the central mihrab were fashioned from soil brought directly from Mecca by Sultan Muhammad Qutb Shah.",
    },
  },

  // Makkah Masjid High Perimeter Ashlar Wall (South)
  {
    id: "mecca-wall-west",
    type: "building",
    family: "stone_wall",
    gx: 5.5,
    gy: 19.5,
    footprintX: 4,
    footprintY: 1,
    height: 38,
    layer: 3,
  },
  {
    id: "mecca-wall-east",
    type: "building",
    family: "stone_wall",
    gx: 13.5,
    gy: 19.5,
    footprintX: 4,
    footprintY: 1,
    height: 38,
    layer: 3,
  },

  // ==================== 3. PATHARGATTI ARCADES (NORTH CORRIDOR) ====================
  // Pathargatti West Side (Stone arched colonnade with upper apartments)
  {
    id: "pathargatti-w1",
    type: "building",
    family: "pathargatti_arcade",
    variant: 0, // Granite arcade with sherwani & textile emporium
    gx: 6.5,
    gy: 6.5,
    footprintX: 3,
    footprintY: 2.5,
    height: 72,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Pathargatti Stone Arcade (West Wing)",
      era: "Asaf Jahi VII · 1911–1936 AD",
      style: "Indo-Saracenic Red Granite Colonnade",
      summary:
        "Designed by British architect Vincent Esch for the City Improvement Board following the 1908 Musi flood. Wide granite pedestrian arcades protect shoppers from sun and rain, housing historic sherwani tailors and textile merchants.",
    },
  },
  {
    id: "pathargatti-w2",
    type: "building",
    family: "pathargatti_arcade",
    variant: 1,
    gx: 6.5,
    gy: 3.5,
    footprintX: 3,
    footprintY: 2.8,
    height: 74,
    layer: 4,
  },
  {
    id: "pathargatti-w3",
    type: "building",
    family: "pathargatti_arcade",
    variant: 2,
    gx: 6.5,
    gy: 0.5,
    footprintX: 3,
    footprintY: 2.8,
    height: 70,
    layer: 4,
  },

  // Pathargatti East Side
  {
    id: "pathargatti-e1",
    type: "building",
    family: "pathargatti_arcade",
    variant: 1, // Traditional Unani Dawakhana & spice merchant
    gx: 13.8,
    gy: 6.5,
    footprintX: 3,
    footprintY: 2.5,
    height: 72,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Pathargatti Dawakhana & Spice House",
      era: "Asaf Jahi Civic Architecture",
      style: "Granite Ashlar Arcade",
      summary:
        "Historic multi-generation apothecaries stocking rare Deccan herbs, wild honey, and authentic Unani formulations patronized by the Nizam's court.",
    },
  },
  {
    id: "pathargatti-e2",
    type: "building",
    family: "pathargatti_arcade",
    variant: 0,
    gx: 13.8,
    gy: 3.5,
    footprintX: 3,
    footprintY: 2.8,
    height: 75,
    layer: 4,
  },
  {
    id: "pathargatti-e3",
    type: "building",
    family: "pathargatti_arcade",
    variant: 2,
    gx: 13.8,
    gy: 0.5,
    footprintX: 3,
    footprintY: 2.8,
    height: 68,
    layer: 4,
  },

  // ==================== 4. LAAD BAZAAR SHOPHOUSES (WEST CORRIDOR) ====================
  // North Side of Laad Bazaar (Facing South into bazaar street)
  {
    id: "laad-north-1",
    type: "building",
    family: "shophouse",
    variant: 0, // Emerald & White striped awning, Lacquer bangles
    gx: 6.0,
    gy: 6.8,
    footprintX: 2.5,
    footprintY: 2.2,
    height: 54,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Al-Madina Lacquer Bangle Workshop",
      era: "Living Guild Tradition",
      style: "Vernacular Timber & Stucco Shophouse",
      summary:
        "Master artisans setting sparkling glass mirrors and faceted stones into warm molten lac over charcoal stoves right before the eyes of passing shoppers.",
    },
  },
  {
    id: "laad-north-2",
    type: "building",
    family: "shophouse",
    variant: 1, // Saffron & Gold awning, Attar & Zardozi
    gx: 3.2,
    gy: 6.8,
    footprintX: 2.6,
    footprintY: 2.2,
    height: 58,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Asghar Ali Nizam Attar Perfumery",
      era: "Old City Guild (Est. 1888)",
      style: "Traditional Bazaar Atelier",
      summary:
        "Aromatic shop lined with Belgian cut-crystal decanters holding pure Mitti attar, Ruh Khus (vetiver), and shamama distilled according to centuries-old recipes.",
    },
  },
  {
    id: "laad-north-3",
    type: "building",
    family: "shophouse",
    variant: 2, // Maroon & Rose awning, Bridal lehengas & khada dupatta
    gx: 0.5,
    gy: 6.8,
    footprintX: 2.5,
    footprintY: 2.2,
    height: 52,
    layer: 4,
  },

  // South Side of Laad Bazaar (Facing North into bazaar street)
  {
    id: "laad-south-1",
    type: "building",
    family: "shophouse",
    variant: 2, // Basra Pearl Showroom
    gx: 6.0,
    gy: 13.8,
    footprintX: 2.5,
    footprintY: 2.2,
    height: 55,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Mangatrai Heirloom Pearl Jewellers",
      era: "Asaf Jahi Court Purveyors",
      style: "Timber Shophouse with Iron Grilles",
      summary:
        "Historic establishment trading in hand-strung natural Basra pearls, Nizami Satlada seven-strand necklaces, and uncut Polki diamond chokers.",
    },
  },
  {
    id: "laad-south-2",
    type: "building",
    family: "shophouse",
    variant: 0,
    gx: 3.2,
    gy: 13.8,
    footprintX: 2.6,
    footprintY: 2.2,
    height: 56,
    layer: 4,
  },
  {
    id: "laad-south-3",
    type: "building",
    family: "shophouse",
    variant: 1,
    gx: 0.5,
    gy: 13.8,
    footprintX: 2.5,
    footprintY: 2.2,
    height: 50,
    layer: 4,
  },

  // ==================== 5. NIMRAH CAFE & EAST BAZAAR CORRIDOR ====================
  {
    id: "nimrah-cafe",
    type: "building",
    family: "cafe",
    gx: 14.5,
    gy: 7.8,
    footprintX: 3.2,
    footprintY: 3.0,
    height: 56,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Nimrah Cafe & Bakery",
      era: "Living Tradition (Est. 1993)",
      style: "Old City Irani Chai Khana",
      summary:
        "World-famous tea stall directly facing the eastern arch of Charminar. Serves thousands of cups of piping hot Irani Dum chai, hot flaky Osmania biscuits, and sweet tie-biscuits from 4:00 AM to midnight.",
    },
  },
  {
    id: "agra-sweets",
    type: "building",
    family: "shophouse",
    variant: 1, // Saffron awning, Traditional Halwai & Jalebi
    gx: 18.0,
    gy: 7.8,
    footprintX: 2.8,
    footprintY: 3.0,
    height: 52,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Purani Haveli Halwai & Jalebi House",
      era: "Traditional Sweetmakers",
      style: "Deccan Shophouse with Large Street Kadhai",
      summary:
        "Deep copper cauldrons bubbling with pure ghee, frying crisp golden jalebis and delicate Badam ki Jali almond confectionery for wedding feasts.",
    },
  },
  {
    id: "east-textiles",
    type: "building",
    family: "shophouse",
    variant: 0,
    gx: 21.0,
    gy: 7.8,
    footprintX: 2.5,
    footprintY: 3.0,
    height: 58,
    layer: 4,
  },

  // Sardar Mahal Civic Precinct (East of Charminar, South side of East road)
  {
    id: "sardar-mahal",
    type: "building",
    family: "civic_palace",
    gx: 14.5,
    gy: 13.8,
    footprintX: 4.2,
    footprintY: 3.0,
    height: 82,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Sardar Mahal (Palace of Sardar Begum)",
      era: "1900 AD · Mir Mahbub Ali Khan (Nizam VI)",
      style: "European-Deccan Eclectic Palace",
      summary:
        "Built in 1900 by the 6th Nizam for one of his consorts, Sardar Begum. Features stately Corinthian pilasters, grand colonnades, and intricate plaster parapets, later declared a heritage civic monument.",
    },
  },
  {
    id: "calligraphy-house",
    type: "building",
    family: "shophouse",
    variant: 2,
    gx: 19.0,
    gy: 13.8,
    footprintX: 3.0,
    footprintY: 3.0,
    height: 60,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Nastalik Calligraphy & Urdu Bookbinders",
      era: "Old City Literary Heritage",
      style: "Stucco Shophouse with Wooden Shutters",
      summary:
        "Guild artisans practicing classical Nastaliq and Shikasta calligraphy, binding poetry diwans and illuminated Quranic manuscripts in goatskin leather.",
    },
  },

  // ==================== 6. INFILL RESIDENTIAL HAVELIS (NW QUADRANT) ====================
  // Dense urban fabric with zero gaps
  {
    id: "haveli-nw-1",
    type: "building",
    family: "haveli",
    variant: 0, // Ochre lime wash, carved timber jharokha balcony
    gx: 3.2,
    gy: 3.8,
    footprintX: 2.8,
    footprintY: 2.8,
    height: 68,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Deodhi Nawab Fakhr-ul-Mulk (Courtyard)",
      era: "Asaf Jahi Nobility",
      style: "Courtyard Haveli with Teak Jharokha",
      summary:
        "Aristocratic residence built around a central shaded courtyard with cooling marble fountain, delicate wooden jali screens, and scalloped stucco cornices.",
    },
  },
  {
    id: "haveli-nw-2",
    type: "building",
    family: "haveli",
    variant: 1, // Pale turquoise wash, lattice windows
    gx: 0.5,
    gy: 3.8,
    footprintX: 2.5,
    footprintY: 2.8,
    height: 64,
    layer: 4,
  },
  {
    id: "haveli-nw-3",
    type: "building",
    family: "haveli",
    variant: 2, // Terracotta wash, arched niches
    gx: 3.2,
    gy: 0.5,
    footprintX: 2.8,
    footprintY: 3.0,
    height: 62,
    layer: 4,
  },
  {
    id: "haveli-nw-4",
    type: "building",
    family: "haveli",
    variant: 0,
    gx: 0.5,
    gy: 0.5,
    footprintX: 2.5,
    footprintY: 3.0,
    height: 60,
    layer: 4,
  },

  // ==================== 7. INFILL RESIDENTIAL & BAKERIES (NE QUADRANT) ====================
  {
    id: "haveli-ne-1",
    type: "building",
    family: "haveli",
    variant: 1,
    gx: 17.5,
    gy: 3.8,
    footprintX: 3.2,
    footprintY: 2.8,
    height: 70,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Purani Haveli Nobles' Deodhi",
      era: "Late 19th Century",
      style: "Deccan Lime-Mortar Courtyard Residence",
      summary:
        "Ancestral multi-generational haveli with rooftop pigeon perches, stained-glass clerestories, and an inner zenana courtyard shaded by an ancient peepal tree.",
    },
  },
  {
    id: "commercial-ne-2",
    type: "building",
    family: "commercial",
    variant: 0,
    gx: 21.0,
    gy: 3.8,
    footprintX: 2.8,
    footprintY: 2.8,
    height: 74,
    layer: 4,
  },
  {
    id: "haveli-ne-3",
    type: "building",
    family: "haveli",
    variant: 0,
    gx: 17.5,
    gy: 0.5,
    footprintX: 3.2,
    footprintY: 3.0,
    height: 65,
    layer: 4,
  },
  {
    id: "commercial-ne-4",
    type: "building",
    family: "commercial",
    variant: 1,
    gx: 21.0,
    gy: 0.5,
    footprintX: 2.8,
    footprintY: 3.0,
    height: 72,
    layer: 4,
  },

  // ==================== 8. INFILL COMMERCIAL & APARTMENTS (SW QUADRANT) ====================
  {
    id: "commercial-sw-1",
    type: "building",
    family: "commercial",
    variant: 0,
    gx: 3.5,
    gy: 16.5,
    footprintX: 2.8,
    footprintY: 2.6,
    height: 72,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Chowk Market Tailors & Zardozi Guild",
      era: "Traditional Commerce",
      style: "3-Storey Deccan Commercial Block",
      summary:
        "Ground floor buzzing with sewing machine needles crafting gold-wire zardozi sherwanis; upper floors home to artisan families.",
    },
  },
  {
    id: "haveli-sw-2",
    type: "building",
    family: "haveli",
    variant: 2,
    gx: 0.5,
    gy: 16.5,
    footprintX: 2.8,
    footprintY: 2.6,
    height: 64,
    layer: 4,
  },
  {
    id: "commercial-sw-3",
    type: "building",
    family: "commercial",
    variant: 1,
    gx: 3.5,
    gy: 20.0,
    footprintX: 2.8,
    footprintY: 2.8,
    height: 68,
    layer: 4,
  },
  {
    id: "haveli-sw-4",
    type: "building",
    family: "haveli",
    variant: 0,
    gx: 0.5,
    gy: 20.0,
    footprintX: 2.8,
    footprintY: 2.8,
    height: 62,
    layer: 4,
  },

  // ==================== 9. INFILL APARTMENTS & OFFICES (SE QUADRANT) ====================
  {
    id: "commercial-se-1",
    type: "building",
    family: "commercial",
    variant: 0,
    gx: 14.5,
    gy: 17.5,
    footprintX: 3.0,
    footprintY: 2.6,
    height: 76,
    layer: 4,
    interactive: true,
    metadata: {
      name: "Sardar Mahal Commercial Annex",
      era: "Mid 20th Century Civic Expansion",
      style: "Masonry Block with Balcony Grilles",
      summary:
        "Houses vintage watch repairers, stamp vendors, and legal deed writers serving the nearby civil courts and municipal offices.",
    },
  },
  {
    id: "commercial-se-2",
    type: "building",
    family: "commercial",
    variant: 1,
    gx: 18.0,
    gy: 17.5,
    footprintX: 3.0,
    footprintY: 2.6,
    height: 70,
    layer: 4,
  },
  {
    id: "haveli-se-3",
    type: "building",
    family: "haveli",
    variant: 1,
    gx: 21.5,
    gy: 17.5,
    footprintX: 2.3,
    footprintY: 2.6,
    height: 66,
    layer: 4,
  },
  {
    id: "commercial-se-4",
    type: "building",
    family: "commercial",
    variant: 0,
    gx: 14.5,
    gy: 20.5,
    footprintX: 3.0,
    footprintY: 2.8,
    height: 68,
    layer: 4,
  },
  {
    id: "commercial-se-5",
    type: "building",
    family: "commercial",
    variant: 1,
    gx: 18.0,
    gy: 20.5,
    footprintX: 3.0,
    footprintY: 2.8,
    height: 72,
    layer: 4,
  },
  {
    id: "haveli-se-6",
    type: "building",
    family: "haveli",
    variant: 0,
    gx: 21.5,
    gy: 20.5,
    footprintX: 2.3,
    footprintY: 2.8,
    height: 65,
    layer: 4,
  },

  // ==================== 10. TREES & URBAN FLORA ====================
  { id: "tree-neem-1", type: "tree", family: "neem", gx: 8.2, gy: 7.2, layer: 2 },
  { id: "tree-neem-2", type: "tree", family: "neem", gx: 14.5, gy: 6.8, layer: 2 },
  { id: "tree-peepal-1", type: "tree", family: "peepal", gx: 17.2, gy: 3.2, layer: 2 },
  { id: "tree-palm-1", type: "tree", family: "palm", gx: 8.6, gy: 17.8, layer: 2 },
  { id: "tree-palm-2", type: "tree", family: "palm", gx: 13.8, gy: 17.8, layer: 2 },
  { id: "tree-palm-3", type: "tree", family: "palm", gx: 5.2, gy: 18.8, layer: 2 },
  { id: "tree-gulmohar-1", type: "tree", family: "gulmohar", gx: 18.5, gy: 12.8, layer: 2 },
  { id: "tree-gulmohar-2", type: "tree", family: "gulmohar", gx: 2.2, gy: 6.2, layer: 2 },
  { id: "tree-neem-3", type: "tree", family: "neem", gx: 6.8, gy: 16.5, layer: 2 },

  // ==================== 11. STREET PROPS & DETAILS ====================
  // Utility Poles with Crossbars & Dangling Cables
  { id: "pole-1", type: "prop", family: "utility_pole", gx: 8.8, gy: 7.8, height: 46, layer: 2 },
  { id: "pole-2", type: "prop", family: "utility_pole", gx: 14.2, gy: 7.8, height: 46, layer: 2 },
  { id: "pole-3", type: "prop", family: "utility_pole", gx: 8.8, gy: 14.5, height: 46, layer: 2 },
  { id: "pole-4", type: "prop", family: "utility_pole", gx: 14.2, gy: 14.5, height: 46, layer: 2 },
  { id: "pole-5", type: "prop", family: "utility_pole", gx: 8.8, gy: 1.8, height: 46, layer: 2 },
  { id: "pole-6", type: "prop", family: "utility_pole", gx: 1.8, gy: 14.5, height: 46, layer: 2 },

  // Cast Iron Victorian Street Lamps
  { id: "lamp-1", type: "prop", family: "street_lamp", gx: 9.2, gy: 8.5, height: 32, layer: 2 },
  { id: "lamp-2", type: "prop", family: "street_lamp", gx: 13.8, gy: 8.5, height: 32, layer: 2 },
  { id: "lamp-3", type: "prop", family: "street_lamp", gx: 9.2, gy: 14.2, height: 32, layer: 2 },
  { id: "lamp-4", type: "prop", family: "street_lamp", gx: 13.8, gy: 14.2, height: 32, layer: 2 },
  { id: "lamp-5", type: "prop", family: "street_lamp", gx: 17.5, gy: 9.2, height: 32, layer: 2 },
  { id: "lamp-6", type: "prop", family: "street_lamp", gx: 5.5, gy: 9.2, height: 32, layer: 2 },

  // Parked Vehicles
  { id: "scooter-1", type: "prop", family: "chetak_scooter", gx: 14.8, gy: 11.2, color: "#2B6CB0", layer: 2 },
  { id: "scooter-2", type: "prop", family: "chetak_scooter", gx: 6.5, gy: 10.8, color: "#C53030", layer: 2 },
  { id: "scooter-3", type: "prop", family: "chetak_scooter", gx: 14.5, gy: 6.2, color: "#2E7D32", layer: 2 },
  { id: "scooter-4", type: "prop", family: "chetak_scooter", gx: 8.4, gy: 4.5, color: "#E2E8F0", layer: 2 },
  { id: "parked-auto-1", type: "prop", family: "parked_auto", gx: 14.6, gy: 12.8, layer: 2 },
  { id: "parked-auto-2", type: "prop", family: "parked_auto", gx: 8.4, gy: 15.5, layer: 2 },
  { id: "bicycle-1", type: "prop", family: "bicycle", gx: 6.8, gy: 12.2, layer: 2 },
  { id: "bicycle-2", type: "prop", family: "bicycle", gx: 14.8, gy: 9.8, layer: 2 },

  // Street Vendors & Pushcarts
  { id: "fruit-cart-1", type: "prop", family: "fruit_cart", gx: 8.6, gy: 14.6, cargo: "banana", layer: 2 },
  { id: "fruit-cart-2", type: "prop", family: "fruit_cart", gx: 13.8, gy: 15.2, cargo: "mango", layer: 2 },
  { id: "flower-cart-1", type: "prop", family: "flower_cart", gx: 13.2, gy: 13.8, layer: 2 },
  { id: "chai-bench-1", type: "prop", family: "bench", gx: 14.8, gy: 7.2, layer: 2 },
  { id: "chai-bench-2", type: "prop", family: "bench", gx: 15.2, gy: 7.2, layer: 2 },

  // Rooftop Infrastructure
  { id: "water-tank-1", type: "prop", family: "water_tank", gx: 16.2, gy: 4.5, gz: 70, layer: 5 },
  { id: "water-tank-2", type: "prop", family: "water_tank", gx: 20.5, gy: 4.5, gz: 74, layer: 5 },
  { id: "water-tank-3", type: "prop", family: "water_tank", gx: 16.5, gy: 14.8, gz: 82, layer: 5 },
  { id: "water-tank-4", type: "prop", family: "water_tank", gx: 4.2, gy: 4.5, gz: 68, layer: 5 },
  { id: "water-tank-5", type: "prop", family: "water_tank", gx: 4.5, gy: 17.2, gz: 72, layer: 5 },
  { id: "ac-unit-1", type: "prop", family: "ac_unit", gx: 15.2, gy: 14.2, gz: 62, layer: 5 },
  { id: "ac-unit-2", type: "prop", family: "ac_unit", gx: 20.8, gy: 14.5, gz: 50, layer: 5 },
  { id: "tv-antenna-1", type: "prop", family: "antenna", gx: 18.5, gy: 4.2, gz: 70, layer: 5 },
  { id: "tv-antenna-2", type: "prop", family: "antenna", gx: 2.2, gy: 4.2, gz: 64, layer: 5 },
  { id: "dish-antenna-1", type: "prop", family: "dish", gx: 15.5, gy: 18.2, gz: 76, layer: 5 },
  { id: "dish-antenna-2", type: "prop", family: "dish", gx: 4.8, gy: 18.2, gz: 68, layer: 5 },
];

// Defined road corridors (bounding boxes in grid coordinates)
export const ROAD_CORRIDORS = [
  // North-South boulevard (Pathargatti -> Charminar -> Makkah Masjid)
  { minX: 8.5, maxX: 14.5, minY: 0, maxY: 24 },
  // East-West corridor (Laad Bazaar <-> Sardar Mahal / Mir Alam Mandi)
  { minX: 0, maxX: 24, minY: 8.5, maxY: 14.5 },
];

// Waypoint paths for living ambient vehicles
export const VEHICLE_PATHS = [
  // Path 0: North to South via Charminar western bypass
  [
    { gx: 8.8, gy: 0 },
    { gx: 8.8, gy: 8.0 },
    { gx: 8.4, gy: 14.5 },
    { gx: 8.8, gy: 24 },
  ],
  // Path 1: South to North via Charminar eastern bypass
  [
    { gx: 14.2, gy: 24 },
    { gx: 14.2, gy: 15.0 },
    { gx: 14.4, gy: 8.5 },
    { gx: 14.2, gy: 0 },
  ],
  // Path 2: East to West along Laad Bazaar corridor
  [
    { gx: 24, gy: 9.2 },
    { gx: 14.5, gy: 9.2 },
    { gx: 8.8, gy: 9.2 },
    { gx: 0, gy: 9.2 },
  ],
  // Path 3: West to East along South side of Charminar
  [
    { gx: 0, gy: 13.8 },
    { gx: 8.8, gy: 13.8 },
    { gx: 14.5, gy: 13.8 },
    { gx: 24, gy: 13.8 },
  ],
];

// Pedestrian walking routes around bazaars & plaza
export const PEDESTRIAN_PATHS = [
  // Route 1: Along Laad Bazaar shops into Charminar West arch
  [
    { gx: 2.0, gy: 10.5 },
    { gx: 5.5, gy: 10.5 },
    { gx: 8.8, gy: 10.5 },
    { gx: 11.5, gy: 10.5 },
  ],
  // Route 2: Along Pathargatti granite arcade southwards to Nimrah Cafe
  [
    { gx: 11.2, gy: 2.0 },
    { gx: 11.2, gy: 6.5 },
    { gx: 13.5, gy: 8.5 },
    { gx: 14.8, gy: 8.5 },
  ],
  // Route 3: Makkah Masjid north gate to Charminar plaza
  [
    { gx: 11.2, gy: 22.0 },
    { gx: 11.2, gy: 17.5 },
    { gx: 11.2, gy: 14.0 },
    { gx: 11.2, gy: 11.5 },
  ],
  // Route 4: Circular stroll around Charminar cobblestone apron
  [
    { gx: 8.8, gy: 9.0 },
    { gx: 13.8, gy: 9.0 },
    { gx: 13.8, gy: 14.0 },
    { gx: 8.8, gy: 14.0 },
    { gx: 8.8, gy: 9.0 },
  ],
  // Route 5: Sardar Mahal sidewalk to Nimrah Cafe
  [
    { gx: 21.0, gy: 12.0 },
    { gx: 16.0, gy: 12.0 },
    { gx: 14.8, gy: 9.2 },
  ],
];

// Dense Old Hyderabad / Charminar Atlas Data
// Mapped to the authentic illustrated Wimmelbild master artwork

export const SCENE_WIDTH = 2000;
export const SCENE_HEIGHT = 1116;
export const GRID_SIZE = 22;
export const TILE_WIDTH = 132;
export const TILE_HEIGHT = 66;

// 6 Discoverable Wimmelvis Cultural Relics & Characters with editorial clues and exact artwork coordinates
export const WIMMEL_RELICS = [
  {
    id: "osmania_biscuit",
    name: "Freshly Baked Osmania Biscuits",
    character: "The Nimrah Baker",
    appearance: "White skullcap, rolled cream cotton kurta, holding wooden trays of golden salted biscuits",
    subtitle: "Nimrah Cafe & Bakery Counter",
    category: "Culinary Heritage",
    badge: "Bazaar Flavor Found",
    tagline: "The Salted Tea-Dunker of the Royal Hospital",
    clue: "Look where steaming tea glasses and round marble tables gather at the bustling cafe terrace.",
    hint: "Near the tea glasses and round tables at the outdoor cafe terrace in the lower-left.",
    lore: "Invented during the reign of Mir Osman Ali Khan, VII Nizam, at the Osmania General Hospital diet kitchen. Its signature balance of sweet butter, salt, and cardamom was designed to soothe patients before becoming Hyderabad's ultimate companion to Irani Chai.",
    story: "Invented during the reign of Mir Osman Ali Khan, VII Nizam, at the Osmania General Hospital diet kitchen. Its signature balance of sweet butter, salt, and cardamom was designed to soothe patients before becoming Hyderabad's ultimate companion to Irani Chai.",
    x: 470,
    y: 830,
    radius: 52,
    icon: "🍪",
    color: "#D97706",
  },
  {
    id: "lac_bangle",
    name: "Red & Gold Lac Choodi",
    character: "The Laad Bangle Artisan",
    appearance: "Saffron turban, emerald embroidered vest, rolling fiery coils of molten resin over glowing charcoal",
    subtitle: "Laad Bazaar Artisan Workshop",
    category: "Generational Craft",
    badge: "Artisan Gem Found",
    tagline: "Molten Resin & Glass Mirror Craft",
    clue: "Look along the dense street of colorful crimson and gold fabric awnings, among stacked trays of glitter.",
    hint: "Glittering along the vibrant street of bangle shops under crimson canopies in the upper-left.",
    lore: "Crafted from natural tree resin (lac) gathered from tribal forests, heated over open charcoal stoves, rolled into fiery coils, and embedded with micro-cut mirrors and Czech crystals. Laad Bazaar has housed this guild continuously since the founding of Hyderabad in 1591.",
    story: "Crafted from natural tree resin (lac) gathered from tribal forests, heated over open charcoal stoves, rolled into fiery coils, and embedded with micro-cut mirrors and Czech crystals. Laad Bazaar has housed this guild continuously since the founding of Hyderabad in 1591.",
    x: 690,
    y: 460,
    radius: 52,
    icon: "📿",
    color: "#E11D48",
  },
  {
    id: "ittar_vial",
    name: "Crystal Vial of Mitti Attar",
    character: "The Pathargatti Perfumer",
    appearance: "Tailored black sherwani, embroidered velvet topi, testing rain-distilled earthen perfume with a glass wand",
    subtitle: "Pathargatti Perfumery Colonnade",
    category: "Ancient Perfumery",
    badge: "Deccan Scent Found",
    tagline: "Hydro-Distilled Rain Upon Parched Deccan Clay",
    clue: "Seek out the shadowed granite stone arcade north-east of the monument, where glass flasks line the verandas.",
    hint: "In an antique glass vitrine within the granite colonnade in the upper-right.",
    lore: "Mitti Attar captures the exact aroma of first monsoon rain hitting dry earth. Baked alluvial river clay is slow-distilled in copper deg-bapka stills into a base of pure sandalwood oil over 15 days.",
    story: "Mitti Attar captures the exact aroma of first monsoon rain hitting dry earth. Baked alluvial river clay is slow-distilled in copper deg-bapka stills into a base of pure sandalwood oil over 15 days.",
    x: 1430,
    y: 290,
    radius: 52,
    icon: "🏺",
    color: "#059669",
  },
  {
    id: "irani_chai_cup",
    name: "Porcelain Cup of 'Pani Kam' Chai",
    character: "The Veteran Cafe Patron",
    appearance: "Dapper Nehru jacket, reading an Urdu broadsheet, dipping biscuits into steaming mawa tea",
    subtitle: "Outdoor Marble Cafe Table",
    category: "Living Cafe Culture",
    badge: "Cafe Legend Found",
    tagline: "Thick Condensed Mawa Tea",
    clue: "Resting on a marble cafe table beside patrons dipping Osmania biscuits into steaming chai.",
    hint: "Resting on a round outdoor cafe table in the lower-left terrace.",
    lore: "Introduced by Zoroastrian Persian immigrants fleeing Qajar Iran in the late 19th and early 20th centuries. Brewed with 3 hours of slow-steaming rich milk reduced to cream (khoya), poured separately over concentrated black tea decoction.",
    story: "Introduced by Zoroastrian Persian immigrants fleeing Qajar Iran in the late 19th and early 20th centuries. Brewed with 3 hours of slow-steaming rich milk reduced to cream (khoya), poured separately over concentrated black tea decoction.",
    x: 300,
    y: 965,
    radius: 52,
    icon: "☕",
    color: "#B45309",
  },
  {
    id: "pearl_necklace",
    name: "Seven-Strand Basra Pearl Satlada",
    character: "The Royal Gem Merchant",
    appearance: "Deep crimson achkan, pearl-strung collar, inspecting luminous saltwater pearls under a magnifying loupe",
    subtitle: "Chimanlal Pearl Haveli Balcony",
    category: "Nizam Royal Treasure",
    badge: "Royal Jewel Found",
    tagline: "The Legacy that Named Hyderabad 'City of Pearls'",
    clue: "Concealed atop a second-story carved wooden haveli balcony overlooking the bustling bazaar.",
    hint: "In a velvet box atop a carved wooden haveli balcony in the upper quarter.",
    lore: "Though landlocked in the Deccan plateau, Hyderabad became the pearl trading capital of the world under the Asaf Jahi Nizams, who imported natural salt-water pearls from the Persian Gulf (Basra) to be drilled and sorted here by generational artisans.",
    story: "Though landlocked in the Deccan plateau, Hyderabad became the pearl trading capital of the world under the Asaf Jahi Nizams, who imported natural salt-water pearls from the Persian Gulf (Basra) to be drilled and sorted here by generational artisans.",
    x: 1560,
    y: 540,
    radius: 52,
    icon: "💎",
    color: "#2563EB",
  },
  {
    id: "bidri_hookah",
    name: "Silver-Inlaid Bidri Hookah Base",
    character: "The Bidri Metalcraft Master",
    appearance: "Indigo kurta, wooden chasing mallet, inlaying pure silver wire into charcoal-blackened zinc alloy",
    subtitle: "Havelis of Mitti Ka Sher",
    category: "Deccan Metallurgy",
    badge: "Master Metalcraft Found",
    tagline: "Zinc-Copper Soil Oxidation Alchemy",
    clue: "Glinting with pure silver wirework in the serene courtyard gateway of the eastern prayer halls.",
    hint: "Displayed in an arched gateway on the far right near the mosque minaret.",
    lore: "Originating in 14th-century Bahmani Bidar, this metalcraft casts a zinc-copper alloy engraved with pure silver sheet, then permanently blackened by applying rare 15th-century soil collected from the ruins of Bidar Fort containing unique nitrates.",
    story: "Originating in 14th-century Bahmani Bidar, this metalcraft casts a zinc-copper alloy engraved with pure silver sheet, then permanently blackened by applying rare 15th-century soil collected from the ruins of Bidar Fort containing unique nitrates.",
    x: 1300,
    y: 860,
    radius: 52,
    icon: "🪔",
    color: "#4B5563",
  },
];

// 35+ Living Bazaar Interactive Hotspots (Every person, shop, pushcart, and vehicle in the scene)
export const BAZAAR_HOTSPOTS = [
  // --- 1. Nimrah Cafe & Bakery Terrace (Lower Left) ---
  {
    id: "osmania_biscuit",
    name: "Freshly Baked Osmania Biscuits",
    speaker: "The Nimrah Baker",
    category: "Culinary Heritage",
    quote: "Garam Osmania Biscuits abhi bhatti se nikle! 100 le lo!",
    story: "Invented during the reign of VII Nizam Mir Osman Ali Khan at the Osmania General Hospital diet kitchen. Its salted-sweet butter recipe is Hyderabad's most legendary tea-dunker.",
    x: 340,
    y: 760,
    radius: 34,
    icon: "🍪",
    sound: "biscuit",
    isRelic: true,
  },
  {
    id: "irani_chai_cup",
    name: "Porcelain Cup of 'Pani Kam' Chai",
    speaker: "Ustaad Ismail — Chai Master",
    category: "Living Cafe Culture",
    quote: "Pani Kam, Khoya Zyada! Teen ghante se kadh raha hai!",
    story: "Rich buffalo milk slow-steamed for 3 hours until reduced to golden cream (khoya), poured separately over concentrated black tea decoction.",
    x: 260,
    y: 810,
    radius: 32,
    icon: "☕",
    sound: "chai_pour",
    isRelic: true,
  },
  {
    id: "chai_waiter",
    name: "Chhotu the Chai Runner",
    speaker: "Chhotu",
    category: "Cafe Life",
    quote: "Rasta chhoro bhai! Table number 4 pe aath cutting!",
    story: "Nimrah's swift waiters balance up to 10 scalding glass tumblers on a single arm, navigating the dense bazaar crowd with effortless agility.",
    x: 300,
    y: 830,
    radius: 28,
    icon: "🏃‍♂️",
    sound: "chai_pour",
  },
  {
    id: "newspaper_elder",
    name: "Nawab Sahab & Urdu Newspaper",
    speaker: "Mirza Sahab",
    category: "Bazaar Characters",
    quote: "Mughalpura ki biryani ab pehle jaisi nahi rahi...",
    story: "Old City elders have gathered at these marble cafe tables for over six decades to read the daily Siasat and debate Deccan history.",
    x: 180,
    y: 790,
    radius: 28,
    icon: "📰",
    sound: "page_flip",
  },
  {
    id: "samovar_counter",
    name: "Boiling Copper Chai Samovar",
    speaker: "The Brass Samovar",
    category: "Culinary Equipment",
    quote: "*Hissing with aromatic cardamom and steaming mawa*",
    story: "Hand-hammered brass and copper samovars burn continuously from 4:00 AM to 2:00 AM, keeping the tea decoction at the exact boiling point.",
    x: 220,
    y: 730,
    radius: 30,
    icon: "🫖",
    sound: "steam_hiss",
  },
  {
    id: "tie_biscuit_vitrine",
    name: "Glass Vitrine of Tie & Chand Biscuits",
    speaker: "Nimrah Display Counter",
    category: "Bakery Craft",
    quote: "Crispy puff pastry shaped like neckties and crescent moons!",
    story: "Hyderabad's signature confectionery includes 'Tie Biscuits' and crescent 'Chand Biscuits' made with pure ghee and sprinkled with poppy seeds.",
    x: 130,
    y: 740,
    radius: 30,
    icon: "🥐",
    sound: "biscuit",
  },

  // --- 2. Laad Bazaar (Upper Left / Mid-Left) ---
  {
    id: "lac_bangle",
    name: "Red & Gold Lac Choodi",
    speaker: "The Laad Bangle Artisan",
    category: "Generational Craft",
    quote: "Molten natural resin shaped by hand! 400 saal puraana hunar!",
    story: "Crafted from wild tree resin (lac), heated over charcoal, hand-rolled into hoops, and studded with cut mirrors and Czech crystals.",
    x: 540,
    y: 460,
    radius: 34,
    icon: "📿",
    sound: "bangle_clink",
    isRelic: true,
  },
  {
    id: "bangle_trays",
    name: "Glittering Velvet Bangle Displays",
    speaker: "Mumtaz Bangle Emporium",
    category: "Guild Shopfront",
    quote: "Dulhan ke matching bangles! 500 shades of ruby, emerald and gold!",
    story: "Laad Bazaar houses over 150 generational bangle workshops that have supplied bridal jewellery to Nizams and modern brides alike since 1591.",
    x: 480,
    y: 430,
    radius: 30,
    icon: "✨",
    sound: "bangle_clink",
  },
  {
    id: "bridal_shoppers",
    name: "Mother & Bride Sizing Choodis",
    speaker: "Begum Fatima",
    category: "Bazaar Life",
    quote: "Zara yeh firozi aur maroon wala dikhana bhaijaan!",
    story: "Tasting the exact wrist size on velvet cushions before wedding festivities (Shadi ka Joda).",
    x: 420,
    y: 480,
    radius: 28,
    icon: "👰‍♀️",
    sound: "bangle_clink",
  },
  {
    id: "zari_merchant",
    name: "Madina Zari & Brocade Merchant",
    speaker: "Syed Bros. Silk House",
    category: "Textile Heritage",
    quote: "Asal Banarasi aur Kanchipuram silk, pure silver zari border!",
    story: "Rich silk weaves and Khada Dupatta bridal sets with hand-stitched real silver and gold zardozi wires.",
    x: 330,
    y: 380,
    radius: 32,
    icon: "👘",
    sound: "fabric",
  },
  {
    id: "hanging_carpets",
    name: "Draped Persian Silk Rugs",
    speaker: "Kashmir & Deccan Rugs",
    category: "Craft Guild",
    quote: "Knotted silk-on-silk carpets draped from the upper balcony!",
    story: "Persian and Kashmiri artisan families migrated to Hyderabad under royal Nizam patronage, creating a thriving Deccan carpet trade.",
    x: 220,
    y: 440,
    radius: 32,
    icon: "🧶",
    sound: "fabric",
  },
  {
    id: "laad_auto_traffic",
    name: "Yellow-Black Auto in Laad Bazaar",
    speaker: "Auto Driver Pappu",
    category: "Street Traffic",
    quote: "*Peeep Peeep!* Side do ustaad! Shaadi ka saaman hai!",
    story: "The iconic yellow-and-black Bajaj auto rickshaws weave through narrow pedestrian lanes with millimeter precision.",
    x: 390,
    y: 550,
    radius: 32,
    icon: "🛺",
    sound: "auto_horn",
  },

  // --- 3. Pathargatti Colonnade (Upper Right / Mid-Right) ---
  {
    id: "ittar_vial",
    name: "Crystal Vial of Mitti Attar",
    speaker: "The Pathargatti Perfumer",
    category: "Ancient Perfumery",
    quote: "Pehli baarish ki mitti ki khushboo! Deg-bapka se hydro-distilled!",
    story: "Mitti Attar captures the scent of first monsoon rain on parched earth. Baked river clay is slow-distilled into pure sandalwood oil over 15 days.",
    x: 1480,
    y: 350,
    radius: 34,
    icon: "🏺",
    sound: "attar_spray",
    isRelic: true,
  },
  {
    id: "oud_vitrine",
    name: "40-Year Vintage Assam Agarwood Oud",
    speaker: "Al-Haramain Ittars",
    category: "Royal Fragrance",
    quote: "Asal Dahn-al-Oud, pure saffron and musk distilled in copper pots.",
    story: "Arab and Yemeni merchants from Barkas frequently patronize Pathargatti's high-grade incense and natural oud emporiums.",
    x: 1530,
    y: 310,
    radius: 30,
    icon: "🧪",
    sound: "attar_spray",
  },
  {
    id: "granite_colonnade_arch",
    name: "Vincent Esch Granite Arcade (1914)",
    speaker: "Pathargatti Heritage Arcade",
    category: "Architecture",
    quote: "Musi river flood ke baad solid granite se bana colonnade!",
    story: "Built by the City Improvement Board using hand-dressed solid grey granite with Moorish horseshoe arches and shaded pedestrian verandas.",
    x: 1440,
    y: 390,
    radius: 36,
    icon: "🏛️",
    sound: "stone_chime",
  },
  {
    id: "textile_bales",
    name: "Pochampally Ikat & Gadwal Cottons",
    speaker: "Deccan Handloom Syndicate",
    category: "Handloom Heritage",
    quote: "Geometric ikat dyed yarn woven by generational Telangana weavers.",
    story: "Telangana's famous double-ikat textiles with GI tag status, sold wholesale under Pathargatti's grand granite arcades.",
    x: 1350,
    y: 330,
    radius: 30,
    icon: "🧵",
    sound: "fabric",
  },

  // --- 4. Chowk Havelis & Rooftops (Top Center / Mid-Top) ---
  {
    id: "pearl_necklace",
    name: "Seven-Strand Basra Pearl Satlada",
    speaker: "The Royal Gem Merchant",
    category: "Nizam Royal Treasure",
    quote: "Basra ke natural moti! Nizam ke durbar ka heera-panna!",
    story: "Though landlocked, Hyderabad became the pearl capital of the world under the Asaf Jahi Nizams, importing saltwater pearls from the Persian Gulf.",
    x: 1400,
    y: 215,
    radius: 34,
    icon: "💎",
    sound: "coin_chime",
    isRelic: true,
  },
  {
    id: "rooftop_pigeons",
    name: "Kabootarbaazi Pigeon Flying Club",
    speaker: "Ustaad Farooq — Pigeon Master",
    category: "Rooftop Traditions",
    quote: "Aasmaan mein dekho! Hamare Girbaaz kabootar kaisa gol ghoom rahe hain!",
    story: "Kabootarbaazi (pigeon flying) is a 300-year-old royal Deccan art form where masters guide flocks using white fabric flags and whistle signals.",
    x: 1330,
    y: 170,
    radius: 30,
    icon: "🕊️",
    sound: "pigeon_coo",
  },
  {
    id: "rooftop_cat",
    name: "Sunny Parapet Calico Cat",
    speaker: "Haveli Cat",
    category: "Living Fauna",
    quote: "*Purrrrrr... napping under the warm Deccan sun*",
    story: "Cats roam the interconnected rooftops of Old Hyderabad, napping on sun-baked terracotta clay tiles and keeping haveli courtyards safe.",
    x: 1250,
    y: 190,
    radius: 26,
    icon: "🐈",
    sound: "cat_purr",
  },
  {
    id: "carved_jharokha",
    name: "Carved Teak Jharokha Balcony",
    speaker: "Aristocratic Deorhi",
    category: "Wooden Architecture",
    quote: "Intricate floral teak screens overlooking the lively bazaar below.",
    story: "Jharokhas allowed ladies of noble households (Purdah) to observe the bazaar life and processions while remaining completely cool in privacy.",
    x: 1440,
    y: 240,
    radius: 30,
    icon: "🪟",
    sound: "wood_tap",
  },

  // --- 5. Charminar Monument Centerpiece ---
  {
    id: "charminar",
    name: "Charminar (1591 CE)",
    speaker: "Monument Centerpiece",
    category: "Royal Monument",
    quote: "Muhammad Quli Qutb Shah: 'Mere shahar ko logon se bhar de jaise tu ne darya ko machhliyon se bhara hai.'",
    story: "Built in 1591 by Sultan Muhammad Quli Qutb Shah at the crossroads of royal trade routes. Its 4 minarets soar 48.7m with 149 spiral steps and an upper mosque.",
    x: 1040,
    y: 620,
    radius: 120,
    icon: "🕌",
    sound: "monument_bell",
  },
  {
    id: "charminar_clock",
    name: "1889 London Vulliamy Clock",
    speaker: "Charminar Clock Tower",
    category: "Monumental Horology",
    quote: "*Chimes on the hour echoing across the Old City*",
    story: "Commissioned in London and installed on all four pediments of Charminar in 1889 during the reign of VI Nizam Mir Mahboob Ali Khan.",
    x: 1040,
    y: 440,
    radius: 36,
    icon: "⏰",
    sound: "clock_tick",
  },
  {
    id: "charminar_photographer",
    name: "Old City Instant Photographer",
    speaker: "Raju Photographer",
    category: "Street Characters",
    quote: "Smile please! Charminar dono haath mein le ke pose karo!",
    story: "Generations of photographers have stood on the plaza flagstones with cameras and instant mini printers, capturing family memories.",
    x: 960,
    y: 730,
    radius: 30,
    icon: "📸",
    sound: "camera_click",
  },

  // --- 6. Mecca Masjid & Eastern Courtyards (Right / Far Right) ---
  {
    id: "bidri_hookah",
    name: "Silver-Inlaid Bidri Hookah Base",
    speaker: "The Bidri Metalcraft Master",
    category: "Deccan Metallurgy",
    quote: "Zinc aur copper alloy pe pure silver wire inlay! Bidar Fort ki mitti se kala rang!",
    story: "Originating in 14th-century Bahmani Bidar, this metalcraft casts a zinc-copper alloy engraved with pure silver sheet, permanently blackened with nitrate soil.",
    x: 1780,
    y: 520,
    radius: 34,
    icon: "🪔",
    sound: "metal_chime",
    isRelic: true,
  },
  {
    id: "mecca_masjid_gateway",
    name: "Makkah Masjid Gateway & Granite Domes",
    speaker: "Sacred Precinct",
    category: "Monumental Architecture",
    quote: "1614 mein Qutb Shahi daur mein banna shuru hua, Aurangzeb ne 1694 mein pura kiya.",
    story: "Muhammad Quli Qutb Shah ordered bricks to be made from sacred soil brought directly from Mecca to be embedded above the central mihrab.",
    x: 1820,
    y: 500,
    radius: 90,
    icon: "🕋",
    sound: "temple_bell",
  },
  {
    id: "pigeon_feeder",
    name: "Courtyard Grain Feeder (Chidiya Chogha)",
    speaker: "Ammijaan scattering grain",
    category: "Sacred Traditions",
    quote: "Bismillah! Parindon ko dana dalo, barkat aayegi!",
    story: "Pilgrims and visitors buy small bowls of millet and wheat to scatter across the stone piazza, attracting hundreds of flocking pigeons.",
    x: 1720,
    y: 570,
    radius: 30,
    icon: "🌾",
    sound: "pigeon_coo",
  },

  // --- 7. Street Traffic, Pushcarts & Living Vendors ---
  {
    id: "main_auto_rickshaw",
    name: "Khadir's Yellow-Black Auto (AP 11 X 420)",
    speaker: "Khadir Auto Driver",
    category: "Street Transport",
    quote: "Bolo kidhar jaana? Charminar se Koti 60 rupay!",
    story: "Hyderabad's iconic 3-wheelers with hand-painted couplets ('Maa ki Dua', 'Nazar mat lagao') and decorated interior rexine seats.",
    x: 740,
    y: 780,
    radius: 36,
    icon: "🛺",
    sound: "auto_horn",
  },
  {
    id: "traffic_auto_corner",
    name: "Plaza Auto Rickshaw",
    speaker: "Bazaar Auto",
    category: "Street Transport",
    quote: "*Engine idling softly: Dug-dug-dug-dug...*",
    story: "Waiting for passengers laden with bangle boxes and pearl velvet pouches outside the monument gates.",
    x: 1100,
    y: 810,
    radius: 34,
    icon: "🛺",
    sound: "auto_horn",
  },
  {
    id: "bajaj_chetak_green",
    name: "1984 Classic Bajaj Chetak Scooter",
    speaker: "Vintage Seafoam Chetak",
    category: "Vintage Wheels",
    quote: "*Kickstarted with signature metallic purr*",
    story: "The quintessential Indian family vehicle of the 80s and 90s, carrying groceries, kids, and spares across the Deccan.",
    x: 900,
    y: 790,
    radius: 32,
    icon: "🛵",
    sound: "scooter_kick",
  },
  {
    id: "mango_fruit_cart",
    name: "Banganapalli & Himayat Mango Pushcart",
    speaker: "Fruit Vendor Yaseen",
    category: "Street Vendors",
    quote: "Meetha Aam! Andhra ka Banganapalli! Ek dum shahad jaisa!",
    story: "Pyramids of fragrant golden Deccan mangoes stacked meticulously on wooden 4-wheeled pushcarts (thelas).",
    x: 580,
    y: 840,
    radius: 32,
    icon: "🥭",
    sound: "vendor_call",
  },
  {
    id: "banana_balance_scale",
    name: "Elakki Banana Cart with Brass Scales",
    speaker: "Banana Vendor",
    category: "Street Vendors",
    quote: "Chhota Kela! 40 rupay darjan!",
    story: "Weighed using traditional iron counterweights on twin brass balance pans suspended with jute twine.",
    x: 640,
    y: 790,
    radius: 30,
    icon: "🍌",
    sound: "vendor_call",
  },
  {
    id: "jasmine_flower_cart",
    name: "Mogra & Marigold Garland Weaver",
    speaker: "Lakshmi the Garland Weaver",
    category: "Flower Guild",
    quote: "Taaza Mogra ki Veni! Fresh jasmine string for hair and puja!",
    story: "Hand-threading fragrant white jasmine buds and orange marigolds with banana-fiber strings into bridal garlands.",
    x: 1280,
    y: 780,
    radius: 32,
    icon: "🌸",
    sound: "breeze",
  },
  {
    id: "pomegranate_orange_stall",
    name: "Anar & Mosambi Citrus Pushcart",
    speaker: "Juice Vendor",
    category: "Street Vendors",
    quote: "Fresh Anar Juice! Blood red Deccan pomegranates!",
    story: "Loaded with deep crimson pomegranates grown in the semi-arid soil of the surrounding Telangana plateau.",
    x: 1420,
    y: 830,
    radius: 32,
    icon: "🍊",
    sound: "vendor_call",
  },
  {
    id: "blue_lml_vespa",
    name: "Royal Blue LML NV Scooter",
    speaker: "Parked Scooter",
    category: "Street Vehicles",
    quote: "Parked neatly against the granite curb with helmet on the handle.",
    story: "A daily commuter companion of Pathargatti's wholesale cloth merchants.",
    x: 1510,
    y: 800,
    radius: 30,
    icon: "🛵",
    sound: "scooter_kick",
  },
  {
    id: "chai_delivery_boy",
    name: "Chai Delivery Boy on Bicycle",
    speaker: "Afzal on Atlas Bicycle",
    category: "Street Characters",
    quote: "*Tring Tring!* Laad Bazaar ke seth ji ka chai thanda ho raha hai!",
    story: "Pedaling swiftly with one hand on the handlebar and one hand holding a 6-glass wire carrier with hot chai.",
    x: 820,
    y: 840,
    radius: 30,
    icon: "🚲",
    sound: "cycle_bell",
  },
];

// Landmark Buildings & Precincts for architectural overview
export const LANDMARK_BUILDINGS = [
  {
    id: "charminar",
    title: "Charminar (چهارمنار)",
    subtitle: "Center of Hyderabad • Est. 1591 CE",
    period: "Qutb Shahi Dynasty",
    description: "Built by Sultan Muhammad Quli Qutb Shah in 1591 to mark the intersection of royal trade routes between Golconda fortress and Machilipatnam.",
    x: 1040,
    y: 620,
    radius: 170,
  },
  {
    id: "nimrah_cafe",
    title: "Nimrah Cafe & Bakery Terrace",
    subtitle: "Legendary Irani Chai Destination • Est. 1993",
    period: "Living Heritage",
    description: "Facing the eastern arch of Charminar, Nimrah serves over 15,000 cups of piping-hot Irani chai daily alongside melt-in-mouth Osmania biscuits.",
    x: 300,
    y: 780,
    radius: 120,
  },
  {
    id: "laad_bazaar",
    title: "Laad Bazaar (Choodi Bazaar)",
    subtitle: "Historic Lacquer & Bridal Guilds • Est. 1591",
    period: "Qutb Shahi Era",
    description: "Centuries-old market world-renowned for hand-crafted lacquer and glass bangles (choodis), semi-precious stones, pearls, and bridal embroidery.",
    x: 520,
    y: 440,
    radius: 130,
  },
  {
    id: "pathargatti",
    title: "Pathargatti Granite Arcade",
    subtitle: "City Improvement Board Colonnade • Est. 1914",
    period: "Asaf Jahi Era",
    description: "Designed by Vincent Esch after the 1908 Musi flood with solid dressed grey granite, wide Moorish pedestrian arches, and uniform signage.",
    x: 1480,
    y: 340,
    radius: 130,
  },
  {
    id: "chowk_haveli",
    title: "Chowk Merchant Havelis",
    subtitle: "Aristocratic Deorhis & Teak Jharokhas",
    period: "1880s - 1920s",
    description: "Stately merchant mansions and noble residences featuring carved teak jharokha balconies, inner courtyards, and lime-plaster arches.",
    x: 1400,
    y: 220,
    radius: 110,
  },
  {
    id: "mecca_masjid",
    title: "Makkah Masjid Royal Precinct",
    subtitle: "Sacred South-East Precinct • Est. 1694",
    period: "Qutb Shahi & Mughal Era",
    description: "Commissioned by Muhammad Quli Qutb Shah with bricks made from soil brought directly from Mecca.",
    x: 1820,
    y: 500,
    radius: 140,
  },
];

// Dynamic Vehicle Waypoint Tracks (Yellow-and-Black Autos & Retro Scooters)
export const VEHICLE_TRACKS = [
  // Pathargatti North-South Corridor (Going South)
  {
    type: "auto_detailed_right",
    path: [
      { x: 12.3, y: -2 },
      { x: 12.3, y: 9 },
      { x: 12.5, y: 14 },
      { x: 12.3, y: 23 },
    ],
    speed: 0.035,
    progress: 0.15,
  },
  {
    type: "scooter_detailed_red",
    path: [
      { x: 12.6, y: -2 },
      { x: 12.6, y: 8.8 },
      { x: 12.8, y: 14 },
      { x: 12.6, y: 23 },
    ],
    speed: 0.045,
    progress: 0.65,
  },
  // Pathargatti North-South Corridor (Going North)
  {
    type: "auto_detailed_left",
    path: [
      { x: 11.4, y: 23 },
      { x: 11.4, y: 14 },
      { x: 11.2, y: 8.8 },
      { x: 11.4, y: -2 },
    ],
    speed: 0.032,
    progress: 0.4,
  },
  {
    type: "scooter_detailed_blue",
    path: [
      { x: 11.1, y: 23 },
      { x: 11.1, y: 14 },
      { x: 11.0, y: 8.8 },
      { x: 11.1, y: -2 },
    ],
    speed: 0.05,
    progress: 0.85,
  },
  // East-West Laad Bazaar & Gulzar Houz Corridor (Going East)
  {
    type: "auto_detailed_right",
    path: [
      { x: -2, y: 12.2 },
      { x: 9.5, y: 12.2 },
      { x: 14.5, y: 12.2 },
      { x: 23, y: 12.2 },
    ],
    speed: 0.03,
    progress: 0.25,
  },
  // East-West Corridor (Going West)
  {
    type: "scooter_detailed_cream",
    path: [
      { x: 23, y: 11.8 },
      { x: 14.5, y: 11.8 },
      { x: 9.5, y: 11.8 },
      { x: -2, y: 11.8 },
    ],
    speed: 0.04,
    progress: 0.72,
  },
];

// Pedestrian Stroll Paths (Bazaar shoppers, chai patrons, bridal families, tourists)
export const PEDESTRIAN_TRACKS = [
  // Charminar pedestrian square strollers
  { type: "pedestrian_kurta", path: [{ x: 9.2, y: 10.8 }, { x: 13.8, y: 10.8 }], speed: 0.012, progress: 0.1 },
  { type: "pedestrian_saree_saffron", path: [{ x: 13.8, y: 11.4 }, { x: 8.8, y: 11.4 }], speed: 0.01, progress: 0.4 },
  { type: "pedestrian_burqa", path: [{ x: 12.8, y: 8.5 }, { x: 12.8, y: 14.2 }], speed: 0.011, progress: 0.25 },
  { type: "pedestrian_saree_teal", path: [{ x: 14.2, y: 10.2 }, { x: 14.2, y: 13.5 }], speed: 0.009, progress: 0.8 },

  // Laad Bazaar shopping corridor
  { type: "pedestrian_kurta", path: [{ x: 3.5, y: 11.2 }, { x: 8.5, y: 11.2 }], speed: 0.013, progress: 0.6 },
  { type: "pedestrian_burqa", path: [{ x: 4.2, y: 12.8 }, { x: 9.2, y: 12.8 }], speed: 0.01, progress: 0.9 },
  { type: "pedestrian_saree_saffron", path: [{ x: 2.0, y: 11.0 }, { x: 7.0, y: 11.0 }], speed: 0.011, progress: 0.35 },
  { type: "pedestrian_saree_teal", path: [{ x: 7.8, y: 12.6 }, { x: 10.2, y: 12.6 }], speed: 0.009, progress: 0.15 },

  // Pathargatti north approach
  { type: "pedestrian_kurta", path: [{ x: 10.2, y: 2.0 }, { x: 10.2, y: 7.5 }], speed: 0.012, progress: 0.2 },
  { type: "pedestrian_saree_teal", path: [{ x: 13.6, y: 7.0 }, { x: 13.6, y: 2.0 }], speed: 0.01, progress: 0.7 },
  { type: "pedestrian_burqa", path: [{ x: 10.4, y: 4.5 }, { x: 10.4, y: 8.8 }], speed: 0.011, progress: 0.5 },

  // Makkah Masjid south precinct
  { type: "pedestrian_kurta", path: [{ x: 10.3, y: 15.0 }, { x: 10.3, y: 18.5 }], speed: 0.012, progress: 0.4 },
  { type: "pedestrian_burqa", path: [{ x: 13.5, y: 18.5 }, { x: 13.5, y: 15.0 }], speed: 0.01, progress: 0.65 },
  { type: "pedestrian_saree_saffron", path: [{ x: 11.8, y: 15.2 }, { x: 11.8, y: 19.5 }], speed: 0.011, progress: 0.3 },

  // East Gulzar Houz approach
  { type: "pedestrian_kurta", path: [{ x: 15.0, y: 11.2 }, { x: 20.0, y: 11.2 }], speed: 0.012, progress: 0.55 },
  { type: "pedestrian_saree_teal", path: [{ x: 19.5, y: 12.7 }, { x: 14.8, y: 12.7 }], speed: 0.01, progress: 0.18 },
  { type: "pedestrian_burqa", path: [{ x: 16.0, y: 11.0 }, { x: 21.0, y: 11.0 }], speed: 0.011, progress: 0.82 },
];

// Generates the complete dense 22x22 city grid using authentic Hyderabad building family and micro-scenes
export function buildCharminarCityData() {
  const size = GRID_SIZE;
  const grid = [];

  for (let x = 0; x < size; x++) {
    grid[x] = [];
    for (let y = 0; y < size; y++) {
      grid[x][y] = {
        ground: "paving_sandstone",
        road: null,
        building: null,
        buildingData: null,
        prop: null,
        microScene: null,
        vehicle: null,
        relic: null,
      };
    }
  }

  // 1. Mark Road Corridors & Plaza
  // North-South Pathargatti Corridor (x = 11, 12)
  for (let y = 0; y < size; y++) {
    grid[11][y].road = "road_ns";
    grid[12][y].road = "road_ns";
  }

  // East-West Laad Bazaar / Charkaman Corridor (y = 11, 12)
  for (let x = 0; x < size; x++) {
    grid[x][11].road = "road_ew";
    grid[x][12].road = "road_ew";
  }

  // Central Charminar Piazza (x: 10..13, y: 10..13)
  for (let x = 10; x <= 13; x++) {
    for (let y = 10; y <= 13; y++) {
      grid[x][y].ground = "plaza_concentric";
      grid[x][y].road = null;
    }
  }

  // 2. Place Landmark Monuments
  LANDMARK_BUILDINGS.forEach((lb) => {
    if (grid[lb.gridX] && grid[lb.gridX][lb.gridY]) {
      grid[lb.gridX][lb.gridY].building = lb.sprite;
      grid[lb.gridX][lb.gridY].buildingData = lb;
      grid[lb.gridX][lb.gridY].footprint = lb.footprint;
    }
  });

  // 3. Place Hand-Crafted Hyderabad Building Family
  // West side: Laad Bazaar Street Frontage (rows y=9 and y=14)
  const laadNorthShops = [
    { type: "shop_bangle", title: "Mumtaz Bangle Works", sub: "Bridal Choodi Guild • Est. 1840" },
    { type: "shop_textile", title: "Deccan Zari & Brocade", sub: "Pure Gold Wirework & Velvet" },
    { type: "haveli_0", title: "Asafia Deorhi Haveli", sub: "Aristocratic Teak Residence" },
    { type: "shop_bangle", title: "Kohinoor Lac Crafts", sub: "Molten Resin & Crystal Bangles" },
    { type: "shop_attar", title: "Haji Perfumers", sub: "Old City Mitti & Rose Attar" },
    { type: "haveli_1", title: "Chowk Merchant Estate", sub: "Carved Jali Balconies & Arches" },
    { type: "shop_bangle", title: "Sultana Glass Bangles", sub: "Four Generations of Artisans" },
    { type: "shop_textile", title: "Nizamiah Silk Emporium", sub: "Paithani & Banarasi Sarees" },
  ];

  for (let i = 0; i < laadNorthShops.length; i++) {
    const x = i + 2; // x from 2 to 9
    if (x <= 9 && grid[x][9]) {
      grid[x][9].building = laadNorthShops[i].type;
      grid[x][9].buildingData = {
        title: laadNorthShops[i].title,
        subtitle: laadNorthShops[i].sub,
        period: "Late 19th Century",
        description: "Dense 2-story streetfront building with overhanging sun-bleached awnings, ornamental wooden balustrades, and street-level display counters.",
      };
    }
  }

  // South side of Laad Bazaar (y=14, x=2..9)
  const laadSouthShops = [
    { type: "shop_textile", title: "Falaknuma Fabrics", sub: "Zardozi & Pearl Embroidery" },
    { type: "shop_bangle", title: "Madina Choodi Bhandar", sub: "Traditional Velvet Bangles" },
    { type: "haveli_1", title: "Mitti Ka Sher Haveli", sub: "Historic Residence of Courtiers" },
    { type: "shop_attar", title: "Gulab Khana Attar", sub: "Sandalwood & Shamama Blends" },
    { type: "shop_bangle", title: "Heera Bangle Artisans", sub: "Mirror-studded Lac Bracelets" },
    { type: "haveli_0", title: "Khurshid Haveli", sub: "Ochre Lime Plaster Mansion" },
    { type: "shop_textile", title: "Deccan Khadi & Loom", sub: "Hand-spun Cotton & Shawls" },
    { type: "shop_bangle", title: "Chaman Bangle Bazaar", sub: "Glass & Brass Bangles" },
  ];

  for (let i = 0; i < laadSouthShops.length; i++) {
    const x = i + 2;
    if (x <= 9 && grid[x][14]) {
      grid[x][14].building = laadSouthShops[i].type;
      grid[x][14].buildingData = {
        title: laadSouthShops[i].title,
        subtitle: laadSouthShops[i].sub,
        period: "1880s - 1920s",
        description: "Continuous heritage shopfront with carved bargeboards, stacked display cases, and vibrant bridal wares.",
      };
    }
  }

  // East side: Charkaman & Gulzar Houz Corridor (y=9 and y=14, x=15..20)
  for (let x = 15; x <= 20; x++) {
    const mod = x % 4;
    const bType = mod === 0 ? "shop_cafe" : mod === 1 ? "shop_attar" : mod === 2 ? "haveli_2" : "shop_textile";
    grid[x][9].building = bType;
    grid[x][9].buildingData = {
      title: "Charkaman Merchant Quarters",
      subtitle: "Four Royal Arches Environs",
      period: "17th - 19th Century",
      description: "Historic commercial building facing the triumphal ceremonial gateways erected by Muhammad Quli Qutb Shah.",
    };

    const sType = mod === 0 ? "haveli_0" : mod === 1 ? "shop_bangle" : mod === 2 ? "shop_textile" : "haveli_1";
    grid[x][14].building = sType;
    grid[x][14].buildingData = {
      title: "Gulzar Houz Heritage Arcade",
      subtitle: "Ancient Octagonal Fountain Quarter",
      period: "Qutb Shahi / Asaf Jahi",
      description: "Historic residence and retail house bordering the celebrated octagonal cistern built for royal processions.",
    };
  }

  // 4. Backstreet Dense Residential Quarters (Replacing all generic Kenney blocks!)
  // North-West Quadrant (x: 1..8, y: 1..7)
  for (let x = 1; x <= 8; x++) {
    for (let y = 1; y <= 7; y++) {
      if ((x + y) % 2 === 0 && !grid[x][y].building) {
        const variant = (x * 3 + y * 5) % 6;
        let chosen = "haveli_0";
        if (variant === 1) chosen = "haveli_1";
        else if (variant === 2) chosen = "haveli_2";
        else if (variant === 3) chosen = "shop_textile";
        else if (variant === 4) chosen = "shop_attar";
        else chosen = "haveli_0";

        grid[x][y].building = chosen;
        grid[x][y].buildingData = {
          title: "Old City Deorhi Mohalla",
          subtitle: "Inner Residential Quarter",
          period: "Asaf Jahi Era",
          description: "Traditional courtyard haveli with wooden balustrades, inner courtyards, and rooftop pigeon coops.",
        };
      }
    }
  }

  // North-East Quadrant (x: 15..20, y: 1..7)
  for (let x = 15; x <= 20; x++) {
    for (let y = 1; y <= 7; y++) {
      if ((x + y) % 2 === 1 && !grid[x][y].building) {
        const variant = (x * 2 + y * 7) % 5;
        const chosen = variant === 0 ? "haveli_2" : variant === 1 ? "haveli_0" : variant === 2 ? "shop_cafe" : "haveli_1";
        grid[x][y].building = chosen;
        grid[x][y].buildingData = {
          title: "Machli Kaman Haveli",
          subtitle: "Historic Gated Quarter",
          period: "18th Century",
          description: "Stately residence with arched verandas, lime-mortar plaster, and cool inner courtyard rooms.",
        };
      }
    }
  }

  // South-West Quadrant (x: 1..8, y: 16..20)
  for (let x = 1; x <= 8; x++) {
    for (let y = 16; y <= 20; y++) {
      if ((x + y) % 2 === 0 && !grid[x][y].building) {
        const variant = (x * 4 + y * 3) % 5;
        const chosen = variant === 0 ? "haveli_1" : variant === 1 ? "haveli_0" : variant === 2 ? "shop_attar" : "haveli_2";
        grid[x][y].building = chosen;
        grid[x][y].buildingData = {
          title: "Moghalpura Haveli Estate",
          subtitle: "Courtyard Residence",
          period: "19th Century",
          description: "High-walled deorhi residence built around a secluded courtyard with pomegranate and neem trees.",
        };
      }
    }
  }

  // South-East Quadrant (x: 15..20, y: 16..20)
  for (let x = 15; x <= 20; x++) {
    for (let y = 16; y <= 20; y++) {
      if ((x + y) % 2 === 1 && !grid[x][y].building) {
        const variant = (x * 5 + y * 2) % 5;
        const chosen = variant === 0 ? "haveli_0" : variant === 1 ? "haveli_2" : variant === 2 ? "shop_textile" : "haveli_1";
        grid[x][y].building = chosen;
        grid[x][y].buildingData = {
          title: "Shalibanda Heritage Deorhi",
          subtitle: "Historic South Precinct",
          period: "Late Asaf Jahi Era",
          description: "Traditional Hyderabad family mansion with wooden lattice screens and terracotta roof tiles.",
        };
      }
    }
  }

  // 5. Clustered Narrative Micro-Scenes (Human Activity, Bargaining, Chai, Street Vendors)
  // Chai table scene beside Nimrah Bakery
  grid[13][10].microScene = "scene_chai_table";
  // Bangle bargaining scenes in Laad Bazaar
  grid[6][10].microScene = "scene_bangle_bargain";
  grid[8][10].microScene = "scene_bangle_bargain";
  // Attar sampling scene at Pathargatti colonnade
  grid[10][3].microScene = "scene_attar_sampling";
  // Fruit pushcart scenes at street corners
  grid[15][13].microScene = "scene_fruit_thela";
  grid[9][13].microScene = "scene_fruit_thela";
  // Flower vendor scenes near Makkah Masjid approach
  grid[10][16].microScene = "scene_flower_vendor";
  grid[4][13].microScene = "scene_flower_vendor";

  // 6. Street Props & Parked Heritage Vehicles
  // Victorian Cast-Iron Street Lamps along Pathargatti North-South sidewalks
  for (let y = 1; y <= 20; y += 3) {
    if (y !== 10 && y !== 11 && y !== 12 && y !== 13) {
      grid[10][y].prop = "lamp";
      grid[13][y].prop = "lamp";
    }
  }

  // Parked vintage Chetak scooters & autos along curbs
  grid[13][14].prop = "scooter_detailed_blue";
  grid[14][14].prop = "scooter_detailed_red";
  grid[14][8].prop = "scooter_detailed_cream";
  grid[7][13].prop = "auto_detailed_right";

  // Lush Courtyard Neem and Date Palms
  grid[9][8].prop = "tree_neem";
  grid[14][7].prop = "tree_palm";
  grid[9][15].prop = "tree_neem";
  grid[14][16].prop = "tree_palm";
  grid[3][5].prop = "tree_neem";
  grid[17][5].prop = "tree_palm";

  // Rooftop Sintex water storage tanks
  grid[4][8].prop = "tank";
  grid[17][8].prop = "tank";
  grid[5][16].prop = "tank";
  grid[18][16].prop = "tank";

  // 7. Inject 6 Discoverable Wimmelvis Cultural Relics into specific tiles
  WIMMEL_RELICS.forEach((relic) => {
    if (grid[relic.gridX] && grid[relic.gridX][relic.gridY]) {
      grid[relic.gridX][relic.gridY].relic = relic;
    }
  });

  return {
    size,
    tileWidth: TILE_WIDTH,
    tileHeight: TILE_HEIGHT,
    grid,
    relics: WIMMEL_RELICS,
    landmarks: LANDMARK_BUILDINGS,
    vehicleTracks: VEHICLE_TRACKS,
    pedestrianTracks: PEDESTRIAN_TRACKS,
  };
}

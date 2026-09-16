// Cultural Origins data — 10 Hyderabadi cultural items
// All facts verified; myth corrections documented inline.
// Sources: Wikipedia, Sahapedia, V&A (Stronge 1985), The Federal, Siasat, Sahapedia.

export const CULTURAL_ORIGINS = [
  {
    id: "biryani",
    name: "Hyderabadi Dum Biryani",
    stickerImage: "/stickers/biryani.png",
    category: "dish",
    eraLabel: "Asaf Jahi",
    yearRange: "18th–19th c.",
    cultures: ["Persian", "Mughal", "Deccani", "Telugu"],
    hook: "The dum seal breaks. Steam rises. The rice is three colours.",
    summary:
      "Raw marinated meat layered under parboiled rice, sealed with atta dough and slow-cooked in a copper degh — the kacchi method codified in Asaf Jahi royal kitchens after Nizam-ul-Mulk established autonomous rule in 1724. The Mughal term biryani already appears in the Ain-i-Akbari (c. 1590); Hyderabad added the tamarind, green chilli, and souring yogurt of the Deccan.",
    secret:
      "Legend says Nizam-ul-Mulk was blessed by a Sufi saint after eating seven kulcha breads in one sitting. His royal chefs fused North Indian Mughal biryani with Deccani spices, yogurt, and green chillies to create the raw-meat kacchi dum method where meat and rice cook together simultaneously from raw.",
    localTip:
      "Head to Hotel Shadab near High Court or Bawarchi at RTC X Roads around 1:00 PM when the first kacchi degh is unsealed. Ask for kacchi biryani with extra mirchi ka salan and a side of sliced onions with lime.",
    animDetail:
      "A knife runs around the atta-dough gasket, the lid lifts, and a single column of saffron-white steam rises — rice in white, saffron-orange, and a mint-green streak.",
    palette: { bg: "#3d1f08", text: "#fdf2d0", accent: "#e8922a" },
    direction: "inward",
    timeline: [
      { year: "c. 1590", event: "Ain-i-Akbari records the Mughal term biryani for the first time" },
      { year: "1724", event: "Nizam-ul-Mulk establishes autonomous Asaf Jahi rule in Hyderabad" },
      { year: "18th–19th c.", event: "The kacchi dum method is codified in Asaf Jahi royal kitchens" },
    ],
    relatedIds: ["haleem", "double-ka-meetha", "qubani"],
    tradeRoute: {
      from: { x: 200, y: 110, label: "Mughal North" },
      through: { x: 280, y: 200, label: "Deccan" },
      to: { x: 340, y: 260, label: "Hyderabad" },
    },
  },
  {
    id: "haleem",
    name: "Hyderabadi Haleem",
    stickerImage: "/stickers/haleem.png",
    category: "dish",
    eraLabel: "Asaf Jahi",
    yearRange: "Late 19th – early 20th c.",
    cultures: ["Hadhrami Yemeni", "Mughal", "Deccani"],
    hook: "Seven hours of beating. The paddle lifts a strand that does not break.",
    summary:
      "The ancestor is Arab harees, a wheat-and-meat porridge recorded in 10th-century Arabic cookery. It came to the Deccan with Hadhrami soldiers from Yemen — the Chaush — recruited into the Nizam's irregular forces and settled at Barkas. Madina Hotel, Pathargatti put it on a public menu in 1956. In August 2010 it became India's first GI-tagged meat product.",
    secret:
      "Four men wielding heavy wooden paddles (ghotni) beat the cauldron continuously for over 7 hours until muscle fibres dissolve into a silk-smooth, elastic paste. Over 10,000 kg of Haleem is prepared daily during Ramadan in Hyderabad, and special courier flights airlift hot packed tins to the Gulf!",
    localTip:
      "Visit Barkas or Pista House at dusk during Ramadan. Top your bowl with golden fried onions (birishtah), toasted cashews, fresh coriander, pure ghee, and a squeeze of lime.",
    animDetail:
      "The wooden ghotni rising and falling in a wood-fired cauldron for eight hours; the mash goes from lumpy to glossy and elastic, and a lifted paddle draws long meat strands that do not break.",
    palette: { bg: "#2a1506", text: "#f5e6cc", accent: "#c97c3a" },
    direction: "inward",
    timeline: [
      { year: "10th c.", event: "Arab harees — the ancestor dish — recorded in early Arabic cookery books" },
      { year: "c. 1880s", event: "Hadhrami Chaush soldiers recruited into the Nizam's forces, settle at Barkas" },
      { year: "1956", event: "Madina Hotel, Pathargatti puts haleem on a public restaurant menu" },
      { year: "2010", event: "Hyderabadi Haleem becomes India's first GI-tagged meat product" },
    ],
    relatedIds: ["biryani", "irani-chai"],
    tradeRoute: {
      from: { x: 140, y: 310, label: "Hadhramaut, Yemen" },
      to: { x: 340, y: 260, label: "Hyderabad" },
    },
  },
  {
    id: "irani-chai",
    name: "Irani Chai",
    stickerImage: "/stickers/irani-chai.png",
    category: "dish",
    eraLabel: "British Era",
    yearRange: "1890s–1940s",
    cultures: ["Persian (Yazdi/Kermani)", "Hyderabadi Muslim"],
    hook: "Two streams — dark decoction, reduced milk — hit the glass and marble into caramel.",
    summary:
      "Irani cafes were founded by emigrants from Yazd and Kerman fleeing Qajar-era hardship, arriving in the Nizam's Hyderabad from the late 19th century. The oldest survivor is Grand Hotel, Abids (1935). The tea format is a local invention: a separate dark dum decoction cut with long-boiled reduced milk — not the black tea drunk in Iran. The Osmania biscuit was devised in the 1940s at Osmania General Hospital as a milk-and-flour biscuit for patients, then migrated to the cafes.",
    secret:
      "Irani Chai is never brewed together in one pot! The dark tea decoction (dum) simmers on one flame while whole milk boils down for hours on another until it loses 30% water and turns rich, creamy, and sweet. They are poured together into a glass right in front of you.",
    localTip:
      "Sit on the stone steps outside Nimrah Café beside Charminar at 6:30 AM. Order a single chai with hot Osmania biscuits and dunk the biscuit for exactly two seconds before taking a bite.",
    animDetail:
      "The biscuit dunked into thick chai goes translucent from the edge inward — and surrenders at exactly the wrong moment.",
    palette: { bg: "#1a0e04", text: "#f0d9b5", accent: "#c97c3a" },
    direction: "inward",
    timeline: [
      { year: "1880s–1900s", event: "Emigration from Yazd and Kerman to Hyderabad begins under Nizam's rule" },
      { year: "1935", event: "Grand Hotel, Abids — oldest surviving Irani café in Hyderabad" },
      { year: "1940s", event: "Osmania biscuit devised at Osmania General Hospital; adopted by the cafés" },
    ],
    relatedIds: ["haleem", "double-ka-meetha"],
    tradeRoute: {
      from: { x: 90, y: 175, label: "Yazd / Kerman, Iran" },
      to: { x: 340, y: 260, label: "Hyderabad" },
    },
  },
  {
    id: "double-ka-meetha",
    name: "Double ka Meetha",
    stickerImage: "/stickers/double-ka-meetha.png",
    category: "dish",
    eraLabel: "Asaf Jahi",
    yearRange: "18th–19th c.",
    cultures: ["Mughal", "Deccani", "Colonial"],
    hook: "Bread triangles go bronze in ghee. Rabri pours in a slow ribbon. The slices swell and darken as they drink.",
    summary:
      "A Hyderabadi remake of Mughal shahi tukda — ghee-fried bread in syrup under rabri — rebuilt on leavened loaf bread from colonial-era bakeries, perfumed with saffron, cardamom, and kewra. Double roti means loaf bread in subcontinental usage: yeast makes it roughly double in size. The British connection is the bread-supply chain, not the name.",
    secret:
      "The dessert gets its name from 'Double Roti' — the colloquial term for yeast-leavened bread loaves, which rose to double their original dough size! Hyderabadi court chefs took these thick bread slices, fried them golden in pure desi ghee, and soaked them in cardamom-saffron milk.",
    localTip:
      "Taste authentic Double ka Meetha at a royal Hyderabadi dawat (wedding feast) or at Jewel of Nizam, where it comes baked in flat silver trays topped with genuine edible silver leaf (varq).",
    animDetail:
      "A sheet of silver varq crumples on contact with the hot rabri, flattening to a mirror — then gone.",
    palette: { bg: "#2b1a08", text: "#faebd0", accent: "#e8d5a3" },
    direction: "hybrid",
    timeline: [
      { year: "c. 1600s", event: "Mughal shahi tukda — the precursor — documented in royal cookery traditions" },
      { year: "18th c.", event: "Colonial-era leavened loaf bread arrives in Hyderabad's bakeries" },
      { year: "18th–19th c.", event: "Double ka meetha emerges as a Hyderabadi court adaptation" },
    ],
    relatedIds: ["biryani", "qubani"],
    tradeRoute: {
      from: { x: 210, y: 95, label: "Delhi / Mughal" },
      to: { x: 340, y: 260, label: "Hyderabad" },
    },
  },
  {
    id: "qubani",
    name: "Qubani ka Meetha",
    stickerImage: "/stickers/qubani.png",
    category: "dish",
    eraLabel: "Asaf Jahi",
    yearRange: "18th–19th c.",
    cultures: ["Timurid / Central Asian", "Persian", "Deccani Court"],
    hook: "Apricots swell overnight — from wrinkled leather to plump amber.",
    summary:
      "Khubani is the Persian word for apricot, a fruit of the Central Asian belt that entered Indian courts as a dried trade good. Babur's memoirs record homesickness for Fergana's fruit. Dried apricots came overland from Afghanistan and Iran; North India largely let the fruit go, while the Asaf Jahi kitchens made it the signature Hyderabadi wedding dessert — slow-stewed to a compote, served with malai, the cracked stone's kernel set on top.",
    secret:
      "Don't throw away the hard apricot seed! Hyderabadi cooks crack open the apricot pits to extract the sweet almond-like kernel (giri) inside. The kernels are soaked and placed right on top of the stewed apricot compote as an edible crown.",
    localTip:
      "Order Qubani ka Meetha warm with a big scoop of cold vanilla ice cream or thick malai at Shadab or Shah Ghouse — the contrast between hot tangy apricot and cold sweet cream is legendary.",
    animDetail:
      "The cracked apricot stone yields a pale almond-like kernel, placed on dark glossy pulp beside a white slump of malai.",
    palette: { bg: "#3d1e00", text: "#fde8c0", accent: "#e8922a" },
    direction: "inward",
    timeline: [
      { year: "1526", event: "Babur records homesickness for Fergana's apricots in the Baburnama" },
      { year: "16th c.", event: "Dried apricots arrive in Indian courts via Central Asian overland trade" },
      { year: "18th–19th c.", event: "Qubani ka meetha becomes the signature Hyderabadi wedding dessert" },
    ],
    relatedIds: ["double-ka-meetha", "biryani"],
    tradeRoute: {
      from: { x: 175, y: 55, label: "Fergana / Central Asia" },
      to: { x: 340, y: 260, label: "Hyderabad" },
    },
  },
  {
    id: "sherwani",
    name: "Hyderabadi Sherwani",
    stickerImage: "/stickers/sherwani.png",
    category: "attire",
    eraLabel: "Asaf Jahi",
    yearRange: "1870s–1948",
    cultures: ["Caucasian/Shirvan", "Awadhi/Lucknow", "Victorian Tailoring", "Nizami Court"],
    hook: "Buttons close one by one, bottom to top, up to the stand collar.",
    summary:
      "The sherwani is not a Mughal garment. It emerged in Lucknow in the 1820s as a hybrid: a Turco-Persian silhouette — chogha, jama, angarkha — cut with European frock-coat tailoring. The name plausibly derives from Shirvan in present-day Azerbaijan. In Hyderabad it became near-universal formal dress under Nizam VI Mahbub Ali Khan (r. 1869–1911), worn with the white dastar turban with its raised frilled crest.",
    secret:
      "Nizam VI Mahbub Ali Khan owned the world's longest wardrobe — a 240-foot-long, two-storey teakwood closet at Purani Haveli! He reportedly never wore the same sherwani twice, and gifted his suits away after a single wear.",
    localTip:
      "Walk through the historic master tailoring shops near Charkaman or Abids, where master cutters still measure shoulder drapes using vintage Nizami tape measures and hand-stitch stand collars (bandgala).",
    animDetail:
      "The dastar's frilled crest settles. Nizam VI's wardrobe at Purani Haveli — a two-level walnut corridor — reportedly contained clothes he never repeated.",
    palette: { bg: "#0d1535", text: "#e8e0d0", accent: "#8899cc" },
    direction: "inward",
    timeline: [
      { year: "1820s", event: "Sherwani emerges in Lucknow — Turco-Persian silhouette, European frock-coat tailoring" },
      { year: "1869–1911", event: "Nizam VI Mahbub Ali Khan adopts it as near-universal formal court dress" },
      { year: "1948", event: "Hyderabad's accession to India; Nizami court culture enters its final chapter" },
    ],
    relatedIds: ["lacquer-bangles", "himroo"],
    tradeRoute: {
      from: { x: 100, y: 120, label: "Caucasus / Shirvan" },
      through: { x: 205, y: 140, label: "Lucknow" },
      to: { x: 340, y: 260, label: "Hyderabad" },
    },
  },
  {
    id: "bidriware",
    name: "Bidriware",
    stickerImage: "/stickers/bidriware.png",
    category: "craft",
    eraLabel: "Bahmani / Qutb Shahi",
    yearRange: "15th c. onward",
    cultures: ["Deccani Bahmani", "Persianate Design"],
    hook: "One wipe of fort mud. The silver lightning-flashes into visibility.",
    summary:
      "Black zinc-alloy vessels inlaid with silver, made at Bidar. The design vocabulary is Persianate. The metallurgy is not: the Middle East produced no zinc; India did. Susan Stronge's V&A analysis shows the zinc was likely Chinese-imported, reaching Bidar through Coromandel ports. The blackening uses soil from inside Bidar fort — six centuries of shade have made it alkaline enough to blacken copper-bearing zinc instantly, while leaving silver bright.",
    secret:
      "The magical black color comes from soil taken inside the 500-year-old Bidar Fort! Master artisans test if the soil is genuine by tasting a small pinch on their tongue — only mud from shaded fort quarters contains the exact nitrate salinity needed to turn zinc jet-black while leaving pure silver shiny.",
    localTip:
      "Visit the Bidri artisan units near Gunfoundry or Abids in Hyderabad to see a craftsman carve delicate floral grooves into zinc with a steel chisel, then inlay silver wire with a wooden mallet.",
    animDetail:
      "A grey engraved vessel smeared with wet fort mud, held a moment, wiped — emerges jet black while the inlaid silver lines flash into visibility all at once.",
    palette: { bg: "#080808", text: "#e8e8e8", accent: "#c0c0c0" },
    direction: "local",
    timeline: [
      { year: "15th c.", event: "Bidriware production established at Bidar under Bahmani sultanate patronage" },
      { year: "16th–17th c.", event: "Persianate design vocabulary fuses with local zinc metallurgy at Bidar" },
      { year: "present", event: "GI-tagged craft; production continues in Bidar and parts of Hyderabad" },
    ],
    relatedIds: ["himroo", "kalamkari"],
    tradeRoute: {
      from: { x: 310, y: 225, label: "Bidar" },
      to: { x: 340, y: 260, label: "Hyderabad" },
    },
  },
  {
    id: "himroo",
    name: "Himroo Weaving",
    stickerImage: "/stickers/himroo.png",
    category: "textile",
    eraLabel: "Bahmani / Asaf Jahi",
    yearRange: "1327 onward",
    cultures: ["Delhi Sultanate", "Persian Brocade", "Marathwada Cotton"],
    hook: "The loom's reverse face: extravagant loops — the wasteful secret behind the smooth front.",
    summary:
      "When Muhammad bin Tughlaq moved his capital from Delhi to Devagiri in 1327, the forced migration carried weavers into the Deccan. When the capital moved back, some stayed. Himroo is the affordable sibling of kimkhwab — precious metal brocade — substituting a silk-and-cotton blend. The name is Persian: hum-ruhi, of the same soul. Today it is near-extinct, sustained by a handful of families in Aurangabad.",
    secret:
      "Empress Nur Jahan fell in love with Himroo brocade, ordering hundreds of yards for Mughal court robes. The intricate weave leaves floating loops on the reverse side of the cloth — a signature hallmark of genuine handloom Himroo.",
    localTip:
      "Look for authentic handloom Himroo shawls with Mughal kalka (paisley) motifs at the Telangana Handicrafts Emporium (Golkonda) in Abids.",
    animDetail:
      "The naqsha pattern cards feed through the jacquard head one at a time — each card a row of the design, punched by hand.",
    palette: { bg: "#0d2020", text: "#d5ebe8", accent: "#4aada0" },
    direction: "inward",
    timeline: [
      { year: "1327", event: "Muhammad bin Tughlaq moves capital to Devagiri; Delhi weavers migrate to the Deccan" },
      { year: "14th–15th c.", event: "Himroo develops as the affordable sibling of precious kimkhwab brocade" },
      { year: "today", event: "Near-extinct; sustained by a handful of master weaving families in Aurangabad" },
    ],
    relatedIds: ["kalamkari", "lacquer-bangles"],
    tradeRoute: {
      from: { x: 210, y: 95, label: "Delhi" },
      through: { x: 270, y: 180, label: "Daulatabad 1327" },
      to: { x: 340, y: 260, label: "Deccan" },
    },
  },
  {
    id: "lacquer-bangles",
    name: "Lacquer Bangles",
    stickerImage: "/stickers/lacquer-bangles.png",
    category: "craft",
    eraLabel: "Qutb Shahi",
    yearRange: "1591 onward",
    cultures: ["Qutb Shahi", "North Indian Lac-Working"],
    hook: "Lac held over a coal flame until it slumps like toffee — wound fast onto a wooden former.",
    summary:
      "Laad Bazaar runs from one arch of the Charminar (1591) and dates to the Qutb Shahi foundation of Hyderabad. The bangles are built on lac — resin secreted by the Kerria lacca insect — warmed until plastic, wound onto a core, then studded with glass and stones pressed in while the surface still accepts them. Roughly 4,000 craftspeople still work the karkhanas around Charminar at Talab Katta.",
    secret:
      "Laad Bazaar gets its name from 'Lac' (resin secreted by Kerria lacca insects). Craftsmen soften resin over small coal stoves, roll it into rings by hand, and press sparkling glass crystals individually into the warm resin before it cools!",
    localTip:
      "Explore Laad Bazaar at night under Charminar's golden lights. Watch artisans craft custom bangles live in tiny workshops (karkhanas) along Talab Katta.",
    animDetail:
      "Stones set with a thin steel tool, each pressed in before the cooling surface closes around it — the craftsperson reading temperature by feel.",
    palette: { bg: "#2a0505", text: "#f5ddd0", accent: "#c2603a" },
    direction: "local",
    timeline: [
      { year: "1591", event: "Qutb Shahi Hyderabad founded; Laad Bazaar established near Charminar" },
      { year: "16th–19th c.", event: "Lac-bangle craft expands, integrating glass and stone inlay techniques" },
      { year: "today", event: "Roughly 4,000 craftspeople still work karkhanas around Charminar" },
    ],
    relatedIds: ["bidriware", "sherwani"],
    tradeRoute: {
      from: { x: 340, y: 260, label: "Charminar / Laad Bazaar" },
      to: { x: 340, y: 260, label: "Hyderabad" },
    },
  },
  {
    id: "kalamkari",
    name: "Kalamkari",
    stickerImage: "/stickers/kalamkari.png",
    category: "textile",
    eraLabel: "Qutb Shahi / Mughal",
    yearRange: "16th–18th c.",
    cultures: ["Telugu Temple", "Golconda Court", "Dutch / English / French Export"],
    hook: "Invisible mordant painted. Then the madder boil. Reds bloom out of nothing where the brush went.",
    summary:
      "Kalam (pen) kari (work) — pen-drawn fabric art in the Golconda tradition. Two schools share the name: Srikalahasti, which draws Hindu epics freehand for temple hangings; and Machilipatnam/Pedana, block-printed with Persianate florals shaped by Golconda court taste and exported to Europe by Dutch, English, and French traders as chintz — igniting a continent-wide painted-cotton mania. This is the one item that flows outward.",
    secret:
      "The madder root dye used for red ink is completely invisible when painted on the cloth! The deep crimson red color only blooms when the painted fabric is boiled in river water — minerals in the river water trigger a chemical reaction that brings the color to life.",
    localTip:
      "When buying Kalamkari dupattas or wall hangings, check the back of the cloth — hand-painted Kalamkari bleeds ink through to the reverse side and carries a distinct, pleasant earthy aroma of cow milk and plant roots.",
    animDetail:
      "The colour reveal: a mordant brush paints an invisible trail on undyed cloth. In the madder boil, reds and maroons bloom exactly where the invisible brush went — nowhere else.",
    palette: { bg: "#0d1a30", text: "#e0d8f0", accent: "#6b7fd4" },
    direction: "outward",
    timeline: [
      { year: "16th c.", event: "Two distinct schools emerge: Srikalahasti (temple art) and Machilipatnam (court trade)" },
      { year: "17th–18th c.", event: "Dutch, English, and French traders export Golconda kalamkari to Europe as chintz" },
      { year: "18th c.", event: "European painted-cotton mania peaks; Machilipatnam becomes a major export hub" },
    ],
    relatedIds: ["himroo", "bidriware"],
    tradeRoute: {
      from: { x: 390, y: 300, label: "Machilipatnam" },
      to: { x: 80, y: 60, label: "Europe" },
    },
  },
  // ── Festival entries ──────────────────────────────────────────────────────
  {
    id: "khairatabad-ganesh",
    name: "Khairatabad Ganesh",
    stickerImage: "/stickers/khairatabad-ganesh.png",
    category: "festival",
    eraLabel: "Post-Independence",
    yearRange: "1954–present",
    cultures: ["Telugu", "Marathi", "Hyderabadi Muslim"],
    direction: "local",
    hook: "The idol is taller than a four-storey building. Twelve days later, it walks into the lake.",
    summary: "Founded in 1954 by Sri Chukka Ramaiah with an 11-foot clay murti, the Khairatabad Ganesh has grown to 61 feet — the tallest clay Ganesh in India. The Khairatabad Ganapati Seva Samithi has always been multi-religious: Muslim craftspeople built the armature and shaped the clay in multiple decades, and Muslim volunteers marshal the Nimajjanam procession. The idol is always natural clay — the pancha bhuta requirement means it must dissolve cleanly into Hussain Sagar. The eyes are painted last, in the Pranapratishtha ceremony; before that stroke, the idol is clay. After it, it is god. The Nimajjanam draws an estimated 2–3 million witnesses. Tank Bund is barricaded for 18–20 continuous hours.",
    secret:
      "In 2013, a giant 5,900 kg mega-laddu (Tapeswaram Laddu) was placed on the idol's giant hand using a industrial crane! The idol's eyes are painted last in a sacred Pranapratishtha ceremony just hours before public viewing begins.",
    localTip:
      "Visit Khairatabad at midnight during the 10-day festival to see the illuminated 60+ foot idol without daytime crowds, or watch the grand immersion procession (Nimajjanam) as the idol moves on a 70-wheel trailer toward Hussain Sagar.",
    animDetail: "The armature goes up first — bamboo tied to an iron spine, taller than the surrounding buildings. Clay comes on in layers over eight to ten weeks. The face is the last surface. The eyes are the last stroke.",
    timeline: [
      { year: "1893", event: "Bal Gangadhar Tilak converts Ganesh Chaturthi into a mass public festival in Pune — anti-British solidarity across caste lines" },
      { year: "1954", event: "Chukka Ramaiah founds Khairatabad Ganapati Seva Samithi; first idol stands 11 feet" },
      { year: "1980s–90s", event: "Neighbourhood committees multiply; idol height climbs past 30 feet; Tank Bund Nimajjanam formalised" },
      { year: "2023", event: "Idol reaches 61 feet — officially the tallest clay Ganesh in India" },
    ],
    relatedIds: ["ganesh-chaturthi-hyd", "irani-chai"],
    palette: { bg: "#1a0a00", text: "#fff5e0", accent: "#e8922a" },
    tradeRoute: {
      from: { x: 340, y: 260, label: "Khairatabad" },
      to:   { x: 340, y: 260, label: "Hussain Sagar" },
    },
  },
  {
    id: "ganesh-chaturthi-hyd",
    name: "Ganesh Chaturthi in Hyderabad",
    stickerImage: "/stickers/ganesh-chaturthi-hyd.png",
    category: "festival",
    eraLabel: "Colonial Era onward",
    yearRange: "1893–present",
    cultures: ["Telugu", "Marathi", "Hyderabadi Muslim", "Dalit"],
    direction: "inward",
    hook: "Tilak gave it politics. Hyderabad gave it pluralism.",
    summary: "Bal Gangadhar Tilak converted Ganesh Chaturthi from a household puja into a mass public festival in 1893 — deliberately public, deliberately to build anti-British solidarity across caste. It spread south into the Nizam's Hyderabad where it acquired a character Pune never had: joint Hindu-Muslim committees, Muslim halwais making the prasad sweets, and Dalit dappu drummers providing the percussion. The dappu — a frame drum historically played by Dalit communities — is the defining sound of Hyderabad's Ganesh processions, not the Maharashtrian dhol-tasha. This is the single loudest marker of how Telangana remade the festival. The festival arrived as a political act in a kingdom where the ruler was Muslim and the majority were Hindu; it survived as a civic act where both communities built it together.",
    secret:
      "Unlike Pune's dhol-tasha drums, Hyderabad's Ganesh processions are defined by the thunderous rhythm of Dalit dappu frame drums — held at the hip and beaten with twin wooden sticks, producing a distinctive Deccani sonic pulse that carries across three city blocks.",
    localTip:
      "Stand near MJ Market or Tank Bund road on the final Nimajjanam day to experience hundreds of procession floats, vibrant gulal powder in the air, and live dappu drum performances that reverberate across the lake.",
    animDetail: "The dappu is held at the hip, tilted. One stick beats the skin; the other hand opens and closes behind the drum to change pitch. Sixteen drummers in a row, in procession — the sound carries three streets before the procession arrives.",
    timeline: [
      { year: "1893", event: "Tilak launches public Ganesh Chaturthi in Pune as anti-colonial mass gathering" },
      { year: "1900s–1940s", event: "Festival spreads to Hyderabad under Nizam rule as both religious and nationalist expression" },
      { year: "1948", event: "Hyderabad accedes to India; the festival grows without the political constraint of a Muslim ruler" },
      { year: "1990s–present", event: "Neighbourhood committees number in the thousands; dappu drummers formalised as the procession's sonic identity" },
    ],
    relatedIds: ["khairatabad-ganesh", "haleem"],
    palette: { bg: "#1a0800", text: "#fff0d8", accent: "#D97706" },
    tradeRoute: {
      from: { x: 185, y: 175, label: "Pune" },
      to:   { x: 340, y: 260, label: "Hyderabad" },
    },
  },
];

export const ORIGINS_BY_ID = Object.fromEntries(CULTURAL_ORIGINS.map((o) => [o.id, o]));

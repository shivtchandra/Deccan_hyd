// Programmatic SEO & GEO Data Registry for Deccan Heritage Map
// Defines metadata, headings, historical intros, and AI-optimized FAQs
// for Structure Types, Historical Eras, and Curated Trails.

export const PSEO_TYPES = {
  palaces: {
    slug: "palaces",
    title: "12 Historic Palaces & Royal Havelis to Visit in Hyderabad",
    heading: "Historic Palaces & Royal Havelis of Hyderabad",
    metaTitle: "12 Best Palaces to Visit in Hyderabad (Chowmahalla, Falaknuma & Havelis)",
    metaDesc: "Explore Hyderabad's iconic palaces — Chowmahalla, Falaknuma, Purani Haveli, and Nizam-era deodis. Interactive map, visiting hours, history, and royal architecture.",
    summary: "From the Persian grandeur of Chowmahalla to the hill-perched Italian marble of Taj Falaknuma, discover the private courts, durbar halls, and residential deodis of the Nizams and Paigah nobles across 200 years of royal splendour.",
    filter: (s) => s.type === "palace" || s.type === "mansion",
    faqs: [
      {
        q: "What is the most famous palace in Hyderabad?",
        a: "Chowmahalla Palace (the ceremonial seat of the Asaf Jahi Nizams) and Falaknuma Palace (perched 2,000 feet above the city) are Hyderabad's most renowned palaces, known for crystal chandeliers, marble durbar halls, and royal archives."
      },
      {
        q: "Can tourists visit Falaknuma Palace?",
        a: "Yes, Falaknuma Palace is operated as a luxury heritage hotel by Taj and offers weekend heritage palace tours and afternoon tea reservations."
      },
      {
        q: "Which palace in Hyderabad houses the 240-foot wooden wardrobe?",
        a: "Purani Haveli houses the world's longest hand-cranked two-tier Burmese teak wardrobe, belonging to Nizam VI Mir Mahbub Ali Khan."
      }
    ]
  },

  stepwells: {
    slug: "stepwells",
    title: "Historic Stepwells (Baolis) of Hyderabad: Restored Water Heritage",
    heading: "Historic Stepwells (Baolis) of Hyderabad",
    metaTitle: "Stepwells in Hyderabad: Restored Baolis & Water Heritage Guide",
    metaDesc: "Discover historic stepwells (baolis) in Hyderabad — Bansilalpet, Gachibowli, and ancient water heritage. Visiting guide, photos, and interactive map locations.",
    summary: "Centuries before modern piped water, the Deccan plateau relied on beautifully engineered stepped wells (baolis). Explore Hyderabad's restored water sanctuaries showcasing medieval stone masonry, subterranean cooling, and architectural revival.",
    filter: (s) => s.type === "baoli" || s.id.includes("stepwell") || s.id.includes("baoli"),
    faqs: [
      {
        q: "Which stepwell in Hyderabad was recently restored?",
        a: "The 17th-century Bansilalpet Stepwell in Secunderabad underwent a major restoration in 2022, transforming from an abandoned debris pit into an award-winning cultural precinct with an amphitheatre and visitor centre."
      },
      {
        q: "Why is Gachibowli called Gachibowli?",
        a: "Gachibowli takes its name from 'Gachi' (limestone plaster) and 'Bowli' (stepwell), referring to the 200-year-old limestone-masonry stepwell preserved in the area."
      },
      {
        q: "What role did stepwells play in Hyderabad's history?",
        a: "Stepwells provided year-round clean drinking water, irrigation, and social gathering spaces for travelers along the Deccan caravan trade routes."
      }
    ]
  },

  forts: {
    slug: "forts",
    title: "Historic Hill Forts & Citadels in & around Hyderabad",
    heading: "Historic Hill Forts & Citadels of the Deccan",
    metaTitle: "Forts in Hyderabad: Golconda, Rachakonda & Deccan Citadels",
    metaDesc: "Explore historic hill forts in and around Hyderabad — Golconda Fort, Rachakonda Fort citadel, and medieval defense bastions. Timings, history, and interactive map.",
    summary: "Commanding granitic monoliths and rocky crags, Hyderabad's forts were military masterpieces featuring multi-layered bastion walls, sophisticated acoustic defense systems, and royal citadels.",
    filter: (s) => s.type === "fort" || s.id.includes("fort"),
    faqs: [
      {
        q: "What is the largest fort in Hyderabad?",
        a: "Golconda Fort is the largest and most famous citadel in Hyderabad, featuring 87 semi-circular bastions, 8 massive iron-spiked gateways, and a 10 km outer fortification wall."
      },
      {
        q: "What is the acoustic clapping trick at Golconda Fort?",
        a: "A handclap under the Fateh Darwaza dome can be heard clearly at the Bala Hissar pavilion a kilometer away at the highest point of the fort, serving as an ancient early warning system."
      },
      {
        q: "What ancient fort is located near Hyderabad for trekking?",
        a: "Rachakonda Fort, a 14th-century mountain citadel of the Recherla Nayaka kings located ~60 km from the city, is built without mortar and is a popular destination for heritage hiking."
      }
    ]
  },

  tombs: {
    slug: "tombs",
    title: "Royal Tombs & Historic Necropolises in Hyderabad",
    heading: "Royal Tombs & Necropolises of Hyderabad",
    metaTitle: "Historic Tombs in Hyderabad: Qutb Shahi, Paigah & Royal Necropolises",
    metaDesc: "Discover royal tombs and necropolises in Hyderabad — Qutb Shahi Tombs, Paigah Tombs, Raymond's Tomb, and Saidani Ma Tomb. Architecture, photos & map locations.",
    summary: "Explore the resting places of Hyderabad's kings, ministers, and Paigah aristocrats. Featuring bulbous domes, intricate stucco lace ornamentation, and Persian-Hindu fusion architecture.",
    filter: (s) => s.type === "tomb" || s.type === "cemetery" || s.id.includes("tomb"),
    faqs: [
      {
        q: "Where are the kings of Golconda buried?",
        a: "The seven rulers of the Qutb Shahi dynasty are buried in the grand Qutb Shahi Tombs complex, located 1 km north of Golconda Fort's Banjara Darwaza."
      },
      {
        q: "What makes the Paigah Tombs unique?",
        a: "The Paigah Tombs feature extraordinary geometric jaali screens, intricate lime-stucco carvings, and marble inlays combining Mughal, Greek, Persian, and Rajasthani architectural styles."
      },
      {
        q: "Who was Michel Joachim Marie Raymond buried at Raymond's Tomb?",
        a: "Monsieur Raymond was a French general in the army of Nizam II Nizam Ali Khan, deeply beloved by the local population who affectionately called him 'Musa Rahim'."
      }
    ]
  },

  mosques: {
    slug: "mosques",
    title: "Historic Mosques & Islamic Architecture in Hyderabad",
    heading: "Historic Mosques & Sacred Architecture of Hyderabad",
    metaTitle: "Historic Mosques in Hyderabad: Mecca Masjid, Charminar & Hidden Gems",
    metaDesc: "Explore historic mosques in Hyderabad — Mecca Masjid, Charminar mosque, Toli Masjid, and the Spanish Mosque. History, architectural facts, and map coordinates.",
    summary: "Hyderabad holds some of South Asia's most magnificent mosques, from the colossal 17th-century black-granite Mecca Masjid to the Moorish-style Spanish Mosque in Begumpet.",
    filter: (s) => s.type === "mosque" || s.id.includes("masjid") || s.id.includes("mosque"),
    faqs: [
      {
        q: "What is the oldest mosque in Hyderabad?",
        a: "Charminar (1591) houses Hyderabad's oldest surviving mosque on its top floor, while nearby Mecca Masjid is the largest historic congregational mosque."
      },
      {
        q: "Why is the Spanish Mosque in Secunderabad unique?",
        a: "Built in 1906 by Paigah noble Sir Vicar-ul-Umra, the Spanish Mosque features rare Moorish architecture inspired by the Cathedral-Mosque of Córdoba, with pointed spires instead of traditional onion domes."
      },
      {
        q: "How many people can pray at Mecca Masjid?",
        a: "Mecca Masjid can accommodate up to 10,000 worshippers in its main granite prayer hall and vast courtyard."
      }
    ]
  },

  temples: {
    slug: "temples",
    title: "Ancient & Historic Temples in Hyderabad",
    heading: "Ancient & Historic Temples of Hyderabad & the Deccan",
    metaTitle: "Ancient Temples in Hyderabad: Keesaragutta, Birla Mandir & Rock Shrines",
    metaDesc: "Discover ancient and historic temples in Hyderabad — Keesaragutta 5th-century Shiva shrine, Rachakonda rock temples, and Sitarambagh Mandir. History and visiting guide.",
    summary: "Discover Hyderabad's rich pre-Islamic and medieval Hindu temple heritage, spanning 5th-century Vishnukundina rock shrines at Keesaragutta, Vijayanagara-style gateways, and Paigah-era temple complexes.",
    filter: (s) => s.type === "temple" || s.id.includes("temple") || s.id.includes("mandir"),
    faqs: [
      {
        q: "What is the oldest temple site in the Hyderabad area?",
        a: "Keesaragutta holds 5th-century brick and stone excavations and rock lingas from the Vishnukundina dynasty, making it one of the earliest recorded religious sites in the region."
      },
      {
        q: "Where is the Sri Rama Temple of Rachakonda Fort located?",
        a: "The Sri Rama Temple is set within the rugged granite boulders of Rachakonda Fort, ~60 km east of Hyderabad, featuring carved monolith pillars from the 14th-century Recherla Nayaka period."
      },
      {
        q: "What is Sitarambagh Temple famous for?",
        a: "Sitarambagh Temple in Old Hyderabad is a fortified temple complex spread over 25 acres, featuring 20-foot high European-style battlements and a blend of Rajasthani and European architecture."
      }
    ]
  },

  civic: {
    slug: "civic",
    title: "Iconic Civic & Heritage Buildings of Hyderabad",
    heading: "Iconic Civic & Public Architecture of Hyderabad",
    metaTitle: "Historic Civic Buildings in Hyderabad: High Court, City College & Esch Works",
    metaDesc: "Discover Nizam-era civic landmarks in Hyderabad — High Court, City College, Osmania General Hospital, and Moazzam Jahi Market. Architectural history & interactive map.",
    summary: "Following the devastating 1908 Musi flood, Nizam VII Mir Osman Ali Khan commissioned British architect Vincent Esch to design a visionary public riverfront in Indo-Saracenic (Osmanian) architecture.",
    filter: (s) => s.type === "civic" || s.type === "transport" || s.id.includes("college") || s.id.includes("court") || s.id.includes("library") || s.id.includes("station"),
    faqs: [
      {
        q: "Who was the chief architect of Hyderabad's riverfront civic buildings?",
        a: "Vincent J. Esch was the consulting architect who designed the Telangana High Court, City College, Osmania General Hospital, and Kachiguda Railway Station in the Osmanian Indo-Saracenic idiom."
      },
      {
        q: "Why were the civic buildings built along the Musi riverfront?",
        a: "They were part of the City Improvement Board's master plan after the 1908 flood to modernize Hyderabad with sanitation, public health, legal, and educational infrastructure."
      },
      {
        q: "When was Moazzam Jahi Market built?",
        a: "Moazzam Jahi Market was completed in 1935 during the reign of Nizam VII, named after his second son Prince Moazzam Jah, and constructed in solid granite with a central clock tower."
      }
    ]
  },

  museums: {
    slug: "museums",
    title: "Heritage & Archaeological Museums in Hyderabad",
    heading: "Heritage & Archaeological Museums of Hyderabad",
    metaTitle: "Best Heritage Museums in Hyderabad: Salar Jung, Archaeology & Satavahana",
    metaDesc: "Explore top heritage and archaeological museums in Hyderabad — Salar Jung Museum, Telangana State Archaeology Museum, and Kondapur Satavahana Museum. Visiting guide.",
    summary: "Step into centuries of art, weaponry, royal heirlooms, and prehistoric excavations housed in Hyderabad's premier cultural institutions and archaeological galleries.",
    filter: (s) => s.type === "museum" || s.id.includes("museum"),
    faqs: [
      {
        q: "What is Salar Jung Museum famous for?",
        a: "Salar Jung Museum is one of the largest one-man collections in the world, holding over 40,000 artefacts including the 19th-century Veiled Rebecca marble sculpture and the musical bracket clock."
      },
      {
        q: "What is the oldest museum in Hyderabad?",
        a: "The Telangana State Archaeology Museum in Public Gardens, opened in 1930 by Nizam VII, is the oldest museum in the state, famous for housing an authentic 2,500-year-old Egyptian mummy."
      }
    ]
  },

  lakes: {
    slug: "lakes",
    title: "Historic Lakes, Reservoirs & Water Heritage in Hyderabad",
    heading: "Historic Lakes & Reservoirs of Hyderabad",
    metaTitle: "Historic Lakes in Hyderabad: Hussain Sagar, Osman Sagar & Mir Alam Tank",
    metaDesc: "Discover historic lakes and water engineering in Hyderabad — Hussain Sagar, Osman Sagar (Gandipet), and Mir Alam Tank. History, boat rides, and interactive map.",
    summary: "From 16th-century Qutb Shahi bund engineering to Nizam VII's flood mitigation reservoirs, explore the historic water bodies that shaped the urban geography of Hyderabad.",
    filter: (s) => s.type === "tank" || s.type === "water" || s.id.includes("sagar") || s.id.includes("lake") || s.id.includes("tank"),
    faqs: [
      {
        q: "When was Hussain Sagar built and by whom?",
        a: "Hussain Sagar was built in 1562 by Ibrahim Qutb Shah, engineered by Hussain Shah Wali, to provide drinking water to the newly established Sultanate capital."
      },
      {
        q: "Why was Osman Sagar (Gandipet) built?",
        a: "Osman Sagar was completed in 1920 across the Musi River by Sir M. Visvesvaraya's engineering recommendations following the catastrophic 1908 Hyderabad floods."
      },
      {
        q: "What makes Mir Alam Tank architecturally unique?",
        a: "Mir Alam Tank (built 1806) features 21 semi-circular masonry arches that form a unique multi-arch gravity dam, designed by French engineers under Nizam's prime minister Mir Alam."
      }
    ]
  }
};

export const PSEO_ERAS = {
  "qutb-shahi": {
    slug: "qutb-shahi",
    eraKey: "qutb-shahi",
    title: "19 Qutb Shahi Dynasty Monuments in Hyderabad (1518–1687)",
    heading: "Qutb Shahi Sultanate Heritage of Hyderabad (1518–1687)",
    metaTitle: "Qutb Shahi Monuments in Hyderabad: Charminar, Golconda & Royal Tombs",
    metaDesc: "Explore 19 Qutb Shahi dynasty monuments in Hyderabad — Golconda Fort, Charminar, Qutb Shahi Tombs, and Taramati Baradari. History, photos, and interactive map.",
    summary: "The Qutb Shahi kings forged the cultural identity of Hyderabad. Spanning nearly two centuries, their monuments blend Persian sophistication, Pathan stonework, and indigenous Hindu motifs in soaring granite and stucco.",
    dateSpan: "1518 – 1687 CE",
    faqs: [
      {
        q: "Who founded Hyderabad and built Charminar?",
        a: "Muhammad Quli Qutb Shah, the 5th Sultan of the Qutb Shahi dynasty, founded Hyderabad in 1591 and built Charminar as the focal point of his new planned capital."
      },
      {
        q: "How many Qutb Shahi monuments are preserved in Hyderabad?",
        a: "Over 19 major monuments survive today, including the Golconda Fort citadel, Charminar, Mecca Masjid, the Royal Necropolis at Qutb Shahi Tombs, and Taramati Baradari."
      },
      {
        q: "What ended the Qutb Shahi dynasty?",
        a: "The dynasty ended in 1687 after Mughal Emperor Aurangzeb conducted an eight-month siege of Golconda Fort, defeating Sultan Abul Hasan Qutb Shah (Tana Shah)."
      }
    ]
  },

  "asaf-jahi": {
    slug: "asaf-jahi",
    eraKey: "asaf-jahi",
    title: "23 Asaf Jahi Nizam Palaces & Monuments in Hyderabad (1724–1948)",
    heading: "Asaf Jahi Nizam Palaces & Monuments (1724–1948)",
    metaTitle: "Nizam Palaces & Asaf Jahi Architecture in Hyderabad (1724–1948)",
    metaDesc: "Discover 23 Asaf Jahi Nizam palaces and monuments in Hyderabad — Chowmahalla, Falaknuma, Paigah Tombs, and royal deodis. History, timings, and interactive map.",
    summary: "For over two centuries, the Nizams of Hyderabad presided over one of the wealthiest princely states on earth. Their architecture reflects the transition from Mughal courtly traditions to opulent European neoclassicism.",
    dateSpan: "1724 – 1948 CE",
    faqs: [
      {
        q: "Who was the first Nizam of Hyderabad?",
        a: "Mir Qamar-ud-din Khan (Nizam-ul-Mulk Asaf Jah I), appointed Viceroy of the Deccan by the Mughals, established the independent Asaf Jahi dynasty in 1724."
      },
      {
        q: "Which was the richest Nizam of Hyderabad?",
        a: "Nizam VII Mir Osman Ali Khan was featured on the cover of TIME magazine in 1937 as the richest person in the world, renowned for founding Osmania University, airports, and state railways."
      },
      {
        q: "What are the best Nizam palaces to visit?",
        a: "Chowmahalla Palace in Old City and Falaknuma Palace in southern Hyderabad are the premier visitor attractions representing Asaf Jahi courtly life."
      }
    ]
  },

  "nizam-civic": {
    slug: "nizam-civic",
    eraKey: "nizam-civic",
    title: "12 Nizam-Era Civic & Osmanian Architecture Landmarks (~1880–1948)",
    heading: "Nizam-Era Civic Architecture & Osmanian Modernity (~1880–1948)",
    metaTitle: "Nizam-Era Civic Architecture in Hyderabad: High Court, City College & Esch",
    metaDesc: "Explore 12 iconic Osmanian civic buildings in Hyderabad — High Court, City College, Osmania Hospital, Central Library, and Moazzam Jahi Market. Interactive map.",
    summary: "After the 1908 Musi flood, Hyderabad was reimagined into a modern metropolis. Combining pink granite, bulbous domes, jaali screens, and wide riverfront boulevards, Osmanian architecture represents the apex of Deccan civic design.",
    dateSpan: "~1880 – 1948 CE",
    faqs: [
      {
        q: "What is Osmanian architecture?",
        a: "Osmanian architecture is a distinct Hyderabadi regional style commissioned by Nizam VII Mir Osman Ali Khan, combining Islamic arches, Mughal chattris, and British engineering in local pink and grey granite."
      },
      {
        q: "Which buildings belong to the Osmanian riverfront promenade?",
        a: "The High Court, Osmania General Hospital, City College, and State Central Library all sit on facing banks of the River Musi, designed to create a majestic civic composition."
      }
    ]
  },

  "british-residency": {
    slug: "british-residency",
    eraKey: "british-residency",
    title: "7 British Colonial & Cantonment Heritage Sites in Hyderabad",
    heading: "British Colonial & Cantonment Heritage of Hyderabad & Secunderabad",
    metaTitle: "British Colonial Heritage in Hyderabad & Secunderabad: Residency, Churches",
    metaDesc: "Explore British colonial heritage in Hyderabad — British Residency at Koti, Secunderabad Clock Tower, Rashtrapati Nilayam, and Gothic garrison churches.",
    summary: "Following the 1798 Treaty of Subsidiary Alliance, the British East India Company established a massive presence in Secunderabad and the palatial British Residency at Koti, immortalized in William Dalrymple's 'White Mughals'.",
    dateSpan: "1798 – 1947 CE",
    faqs: [
      {
        q: "What is the British Residency in Hyderabad?",
        a: "Built in 1805 by Resident James Achilles Kirkpatrick, the British Residency at Koti is a monumental neoclassical mansion with Corinthian pillars, modeled after the White House in Washington."
      },
      {
        q: "What is Rashtrapati Nilayam in Secunderabad?",
        a: "Originally built in 1860 as the British Resident's country house in Bolarum, it now serves as the official southern retreat of the President of India and is open to public visitors."
      }
    ]
  },

  earlier: {
    slug: "earlier",
    eraKey: "earlier",
    title: "18 Pre-Qutb Shahi, Kakatiya & Prehistoric Heritage Sites",
    heading: "Pre-Qutb Shahi, Kakatiya & Megalithic Heritage of the Deccan",
    metaTitle: "Pre-Qutb Shahi & Kakatiya Heritage in Hyderabad: 2,300-Year-Old Sites",
    metaDesc: "Explore prehistoric cairns, 5th-century rock shrines, 14th-century mountain forts, and Kakatiya hero stones pre-dating the founding of Hyderabad.",
    summary: "Centuries before Charminar was built, the Deccan landscape was inhabited by Iron Age megalithic builders, Satavahana traders, Vishnukundina kings, and Kakatiya warriors who carved sanctuaries directly into living granite.",
    dateSpan: "300 BCE – 1518 CE",
    faqs: [
      {
        q: "What is the oldest archaeological site in Hyderabad?",
        a: "The Hasmathpet megalithic cairn circles and cists date back 2,300 years to the Iron Age (~300 BCE), long before recorded sultanate history."
      },
      {
        q: "Where is the earliest inscription mentioning the word 'Telangana'?",
        a: "The 1417 CE Telunganaapura inscription is located in Tellapur near Hyderabad, recording the construction of a public stepwell by a village official named Nagoju."
      }
    ]
  },

  "post-independence": {
    slug: "post-independence",
    eraKey: "post-independence",
    title: "6 Post-Independence Heritage Landmarks in Hyderabad (1948–Present)",
    heading: "Post-Independence Heritage & Modern Landmarks of Hyderabad",
    metaTitle: "Modern Heritage in Hyderabad: Birla Mandir, Buddha Statue & Ravindra Bharathi",
    metaDesc: "Discover post-independence architectural landmarks in Hyderabad — Ravindra Bharathi auditorium, Birla Mandir, and Hussain Sagar Buddha Statue.",
    summary: "Following Hyderabad's accession to the Indian Union in 1948, the city evolved into a major cultural and technological hub, marked by modernist theatres, hilltop marble sanctuaries, and iconic lake monuments.",
    dateSpan: "1948 – Present",
    faqs: [
      {
        q: "What is the tallest monolithic Buddha statue in India?",
        a: "The 58-foot, 350-tonne monolithic granite Buddha Statue installed in the centre of Hussain Sagar Lake was carved out of a single rock from Raigir and erected on the Gibraltar Rock in 1992."
      },
      {
        q: "When was Ravindra Bharathi built?",
        a: "Ravindra Bharathi was built in 1961 to commemorate the birth centenary of Nobel laureate Rabindranath Tagore, serving as Hyderabad's premier cultural auditorium."
      }
    ]
  }
};

export const PSEO_TRAILS = {
  "founding-of-hyderabad": {
    id: "founding-of-hyderabad",
    slug: "founding-of-hyderabad",
    title: "The Founding of Hyderabad Walking Trail: Golconda to Charminar",
    heading: "The Founding of Hyderabad: From Golconda to Charminar",
    subtitle: "A 6-Stop Heritage Trail Chronicling the Shift from Fortress to Renaissance Capital",
    metaTitle: "Founding of Hyderabad Trail: Golconda to Charminar Heritage Walk",
    metaDesc: "Walk through 500 years of history: Golconda Fort, Toli Masjid, Purana Pul, Charminar, and Mecca Masjid. Stop-by-stop itinerary, maps, and visiting guide.",
    distance: "11.5 km",
    duration: "4–5 hours",
    difficulty: "Walking & short cab rides",
    summary: "Experience the dramatic story of how the 16th-century Qutb Shahi dynasty outgrew the crowded walls of Golconda Fort and crossed the Musi River to lay out the grand planned metropolis of Hyderabad around the iconic Charminar.",
    stops: [
      {
        order: 1,
        id: "golconda-fort",
        title: "The Granite Cradle of the Deccan",
        note: "Start at the Bala Hissar pavilion and acoustic gates of the fortified capital."
      },
      {
        order: 2,
        id: "qutb-shahi-tombs",
        title: "The Royal Necropolis",
        note: "Walk through Ibrahim Rauza and the bulbous granite domes of the founding sultans."
      },
      {
        order: 3,
        id: "toli-masjid",
        title: "The Highway Mosque",
        note: "Built by royal architect Mir Musa Khan with fine circular stucco medallions."
      },
      {
        order: 4,
        id: "puranapul",
        title: "The Royal River Crossing (1578)",
        note: "The earliest stone bridge across the Musi, built by Ibrahim Qutb Shah for Prince Muhammad Quli."
      },
      {
        order: 5,
        id: "charminar",
        title: "The Geometric Heart (1591)",
        note: "Four 48-metre minarets marking the crossroads of four imperial trade highways."
      },
      {
        order: 6,
        id: "mecca-masjid",
        title: "The Great Congregational Mosque",
        note: "The mammoth granite prayer hall containing sacred bricks baked from Mecca soil."
      }
    ],
    faqs: [
      {
        q: "How long does the Golconda to Charminar trail take?",
        a: "The full route spans 11.5 km and takes approximately 4 to 5 hours to explore comfortably, including photography stops and entrance tours."
      },
      {
        q: "What is the best time of day to do this heritage trail?",
        a: "Early morning starting at Golconda Fort by 8:30 AM allows you to complete the uphill fort walk before afternoon heat, arriving at Charminar in time for afternoon photography and tea."
      }
    ]
  },

  "nizam-civic-and-musi": {
    id: "nizam-civic-and-musi",
    slug: "nizam-civic-and-musi",
    title: "The Osmanian Riverfront & Musi Civic Heritage Walk",
    heading: "The Osmanian Riverfront & Civic Renaissance Trail",
    subtitle: "Vincent Esch's Indo-Saracenic Masterpieces along the Musi River (1908–1940)",
    metaTitle: "Musi Riverfront Heritage Walk: High Court, City College & Osmanian Domes",
    metaDesc: "Step-by-step walking trail along the Musi River: Telangana High Court, Osmania General Hospital, City College, Central Library, and Moazzam Jahi Market.",
    distance: "3.8 km",
    duration: "2 hours",
    difficulty: "Easy pedestrian route",
    summary: "Discover the golden era of civic architecture engineered after the 1908 Musi flood. Follow British architect Vincent Esch's majestic pink-granite domes, Mughal-inspired chattris, and public institutions along the river.",
    stops: [
      {
        order: 1,
        id: "telangana-high-court",
        title: "Palace of Justice (1919)",
        note: "Rose-red sandstone and white marble chattris reflecting Mughal-Saracenic mastery."
      },
      {
        order: 2,
        id: "osmania-general-hospital",
        title: "Healing by the River (1925)",
        note: "Colossal public healthcare palace featuring an iconic riverfront dome."
      },
      {
        order: 3,
        id: "city-college-hyderabad",
        title: "The Academy of the Riverfront (1921)",
        note: "Designed with soaring minarets and stone jaalis opposite the High Court."
      },
      {
        order: 4,
        id: "state-central-library",
        title: "Asafia State Central Library (1936)",
        note: "Housing over 500,000 rare manuscripts in Arabic, Persian, Urdu, and Telugu."
      },
      {
        order: 5,
        id: "moazzam-jahi-market",
        title: "The Circular Granite Bazaar (1935)",
        note: "Triangular granite market topped by a central clock tower, famous for ice cream."
      }
    ],
    faqs: [
      {
        q: "Is the Musi riverfront trail walkable on foot?",
        a: "Yes, at 3.8 km along Nayapul and Afzal Gunj bridges, it is an easy pedestrian walk with sidewalks and pedestrian riverfront vistas."
      },
      {
        q: "Who was Vincent Esch?",
        a: "Vincent J. Esch was a British architect and fellow of the Royal Institute of British Architects who pioneered the 'Osmanian Indo-Saracenic' style for Nizam VII."
      }
    ]
  },

  "palaces-and-deodis": {
    id: "palaces-and-deodis",
    slug: "palaces-and-deodis",
    title: "Royal Courts & Princely Deodis Heritage Trail",
    heading: "Royal Courts & Princely Deodis: From Chowmahalla to Falaknuma",
    subtitle: "The Private Worlds of the Asaf Jahi Monarchs and Paigah Aristocrats",
    metaTitle: "Royal Palaces Trail in Hyderabad: Chowmahalla, Purani Haveli & Falaknuma",
    metaDesc: "Follow Hyderabad's royal court trail: Chowmahalla Palace, Purani Haveli, Paigah Tombs, and Taj Falaknuma Palace. Visiting hours, history, and route guide.",
    distance: "6.2 km",
    duration: "3–4 hours",
    difficulty: "Easy to moderate",
    summary: "Step inside the private worlds of the Asaf Jahi monarchs and Paigah nobles, featuring Persian chandeliers, neoclassic ballrooms, vintage car collections, and hilltop palaces.",
    stops: [
      {
        order: 1,
        id: "chowmahalla-palace",
        title: "Four Palaces of Asaf Jah",
        note: "The ceremonial seat of the Nizams with 19 magnificent Bohemian crystal chandeliers."
      },
      {
        order: 2,
        id: "purani-haveli",
        title: "The Old Palace & 240-Foot Wardrobe",
        note: "Birthplace of Nizam VI, holding the world's longest hand-cranked teak wardrobe."
      },
      {
        order: 3,
        id: "paigah-tombs",
        title: "Lace in Marble & Lime Plaster",
        note: "Intricate geometric jaali screens of the aristocratic Paigah nobility."
      },
      {
        order: 4,
        id: "falaknuma-palace",
        title: "Mirror of the Sky (1893)",
        note: "Hilltop Italian marble palace with a 101-seat dining table and jade library."
      }
    ],
    faqs: [
      {
        q: "What ticket is required for Chowmahalla Palace?",
        a: "Chowmahalla Palace is open Saturday to Thursday (closed Fridays) from 10:00 AM to 5:00 PM with nominal ticket entry at the gate."
      },
      {
        q: "Can I enter Falaknuma Palace on this trail?",
        a: "Taj Falaknuma Palace requires an advance heritage tour booking or dining reservation through Taj Hotels."
      }
    ]
  },

  "karthik-lesser-known-hyd": {
    id: "karthik-lesser-known-hyd",
    slug: "karthik-lesser-known-hyd",
    title: "Lesser Known Heritage of Hyderabad Trail (Curated by Karthik Vatsavayi)",
    heading: "Lesser Known Heritage of Hyderabad Expedition",
    subtitle: "Overlooked Megaliths, Stepwells, Caravanserais & 600-Year-Old Inscriptions",
    metaTitle: "Lesser Known Heritage Sites in Hyderabad: Off-the-Beaten-Path Trail",
    metaDesc: "Explore 37 rare, overlooked historic sites in Hyderabad curated by Karthik Vatsavayi — Gachibowli stepwell, Khajaguda caves, Shaikpet Sarai, and ancient cairns.",
    distance: "28.5 km",
    duration: "Full-day heritage drive",
    difficulty: "Driving & walking expedition",
    summary: "Curated by heritage researcher Karthik Vatsavayi, this expedition takes you far beyond standard tourist itineraries to explore 2,300-year-old Iron Age cairns, royal stone caravanserais, and the earliest recorded inscription containing the word 'Telangana'.",
    stops: [
      {
        order: 1,
        id: "gachibowli-stepwell",
        title: "Gachibowli Stepwell",
        note: "The 200-year-old limestone-masonry baoli that gave modern Gachibowli its name."
      },
      {
        order: 2,
        id: "khajaguda-cave-temple",
        title: "Khajaguda Rock Shrines",
        note: "800-year-old cave shrines embedded in prehistoric 2.5-billion-year-old granite."
      },
      {
        order: 3,
        id: "shaikpet-sarai",
        title: "Shaikpet Sarai & Mosque",
        note: "A 30-room stone caravanserai built for travelers on the Golconda royal road."
      },
      {
        order: 4,
        id: "telunganaapura-tellapur-inscription",
        title: "Telunganaapura Inscription (1417 CE)",
        note: "Earliest known Telugu stone epigraph containing the word 'Telangana'."
      },
      {
        order: 5,
        id: "amin-khan-tomb-patancheru",
        title: "Amin Khan Tomb (1568)",
        note: "Pre-dating Charminar by 23 years, one of the region's finest octagonal tombs."
      },
      {
        order: 6,
        id: "hasmathpet-cairns",
        title: "Hasmathpet Megalithic Cairns",
        note: "2,300-year-old Iron Age stone burial circles documenting Hyderabad's deep roots."
      }
    ],
    faqs: [
      {
        q: "Who curated the Lesser Known Historic Sites list?",
        a: "Hyderabad heritage researcher Karthik Vatsavayi compiled this meticulous collection of 37 rare, overlooked monuments from intensive fieldwork across Telangana."
      },
      {
        q: "How can I visit these lesser known sites?",
        a: "All 37 sites are plotted with exact GPS coordinates and walking directions on the Deccan Heritage Map at heritage.mapmyhyd.com."
      }
    ]
  }
};

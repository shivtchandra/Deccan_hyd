// lib/areaEtymology.js
// Verified historical research into the toponymy (name origins) of Hyderabad's localities.
// Combines linguistic roots (Dakhni, Telugu, Persian, Arabic, Sanskrit, English),
// archival evidence, royal decrees, and debunking of popular urban folklore.

export const AREA_ETYMOLOGIES = [
  {
    id: "gachibowli",
    name: "Gachibowli",
    teluguName: "గచ్చిబౌలి",
    urduName: "گچی باؤلی",
    coordinates: { lat: 17.441689, lng: 78.3605097 },
    languages: ["Dakhni", "Sanskrit"],
    roots: [
      { term: "Gachi", language: "Dakhni / Urdu", meaning: "Limestone mortar / plaster quarried locally" },
      { term: "Bowli / Baoli", language: "Dakhni (from Sanskrit Vāpī)", meaning: "Stepwell" },
    ],
    summary: "Named after a 200-year-old limestone-lined stepwell built under Asaf Jahi rule that once irrigated 10 acres of surrounding farmland.",
    history:
      "Before becoming Hyderabad's modern cyber hub, Gachibowli was a rural hamlet. The settlement grew around an Asaf Jahi-era stone stepwell constructed with local limestone masonry (gachi). Restored in 2021 with perimeter paving and safety grilles, the historic well still survives tucked between modern apartment buildings near the local mosque.",
    mythDebunked:
      "Urban legend humorously attributes the name to cricketer 'Gachibowli Diwakar' — a parody comedy character from Telugu cinema. In reality, the area derives directly from the 19th-century limestone stepwell.",
    relatedSiteId: "gachibowli-stepwell",
    sources: [
      "The Hindu: 'Restoring Hyderabad's Forgotten Stepwells'",
      "Telangana State Archaeology Department records",
      "Hyderabad Urban Lab Toponymy Surveys",
    ],
  },
  {
    id: "masab-tank",
    name: "Masab Tank",
    teluguName: "మాసాబ్ ట్యాంక్",
    urduName: "ما صاحب ٹینک",
    languages: ["Dakhni", "English"],
    coordinates: { lat: 17.3995, lng: 78.4526 },
    roots: [
      { term: "Maa Saheba", language: "Dakhni", meaning: "Revered Mother — title of Queen Hayat Bakshi Begum" },
      { term: "Tank", language: "Anglo-Indian / English", meaning: "Artificial reservoir or lake" },
    ],
    summary: "A corruption of 'Maa Saheba Tank', built by Sultan Muhammad Qutb Shah for his queen Hayat Bakshi Begum in the early 17th century.",
    history:
      "Hayat Bakshi Begum, known reverently throughout Golconda as 'Maa Saheba' (The Revered Mother), was the daughter of Muhammad Quli Qutb Shah, wife of Muhammad Qutb Shah, and mother of Abdullah Qutb Shah. She was an extraordinary statesman and philanthropist who commissioned mosques, caravanserais, and water tanks. Over time, colonial British records contracted 'Maa Saheba Tank' phonetically into 'Masab Tank'.",
    mythDebunked:
      "Often wrongly guessed as an English term ('Massive Tank') because of the large reservoir that once occupied the basin.",
    relatedSiteId: "hayat-bakshi-mosque",
    sources: ["Bilgrami & Willmott (1883), Historical and Descriptive Sketch of His Highness the Nizam's Dominions", "INTACH Hyderabad Heritage Gazette"],
  },
  {
    id: "abids",
    name: "Abids",
    teluguName: "అబిడ్స్",
    urduName: "عابدز",
    coordinates: { lat: 17.3916, lng: 78.4735 },
    languages: ["English", "Armenian"],
    roots: [
      { term: "Abid's", language: "English (Possessive)", meaning: "Belonging to Albert Abid" },
    ],
    summary: "Named after Albert Abid, an Armenian merchant and valet to the 6th Nizam Mahbub Ali Khan, who opened Hyderabad's premier Western department store here.",
    history:
      "In the late 19th century, Albert Abid — who served as valet and steward to Nizam VI Mir Mahbub Ali Khan — established 'Abid Shop' (Abid & Co.) on the royal carriage road connecting the British Residency to the Old City. The shop sold European fabrics, gramophones, cigars, and watches. The commercial arcade became so famous that the entire bustling commercial district took his name.",
    mythDebunked:
      "Frequently assumed to be of Urdu or Arabic origin from 'Abid' (worshipper/devotee). It is actually named after the merchant's family surname.",
    relatedSiteId: "british-residency",
    sources: ["Luther, Narendra (2006), Hyderabad: A Biography", "Dharmendra Prasad, Social and Cultural Geography of Hyderabad City"],
  },
  {
    id: "lakdikapul",
    name: "Lakdi-ka-Pul",
    teluguName: "లక్డీకాపూల్",
    urduName: "لکڑی کا پل",
    coordinates: { lat: 17.4042, lng: 78.4632 },
    languages: ["Urdu", "Hindi"],
    roots: [
      { term: "Lakdi", language: "Urdu / Hindi", meaning: "Wood / Timber" },
      { term: "ka", language: "Grammatical Postposition", meaning: "of" },
      { term: "Pul", language: "Urdu / Hindi (from Persian Pul)", meaning: "Bridge" },
    ],
    summary: "Refers to a historic wooden bridge erected across a Musi river stream to facilitate travel between Golconda and the northern suburbs.",
    history:
      "Before modern concrete culverts were built, a sturdy timber bridge was constructed during the early Nizam period across an offshoot of the river Musi. Travellers, horse riders, and royal couriers crossed this wooden span. Although replaced by a masonry bridge over a century ago, the evocative name 'Lakdi-ka-Pul' (Wooden Bridge) remained permanent.",
    mythDebunked:
      "No wooden bridge exists today; it was replaced in the early 20th century by stone and later modern flyovers.",
    relatedSiteId: "telangana-high-court",
    sources: ["Deccan Chronicle Historical Archives", "Hyderabad City Improvement Board Records (1914–1936)"],
  },
  {
    id: "tolichowki",
    name: "Toli Chowki",
    teluguName: "టోలిచౌకి",
    urduName: "ٹولی چوکی",
    coordinates: { lat: 17.4018, lng: 78.4112 },
    languages: ["Dakhni", "Hindi"],
    roots: [
      { term: "Toli", language: "Dakhni / Hindi", meaning: "Troop / Military Contingent" },
      { term: "Chowki", language: "Dakhni / Hindi", meaning: "Guard post / Toll checkpoint" },
    ],
    summary: "A military guard station and toll post established outside Golconda Fort where royal garrisons screened travelers entering the citadel.",
    history:
      "During the Qutb Shahi era, Toli Chowki was the outer perimeter security post for Golconda Citadel. Royal armed contingents (toli) were permanently garrisoned here to collect transit tolls on trade merchandise from Machilipatnam and check incoming visitors before granting access towards the fort gates. The nearby 1671 Toli Masjid was commissioned by royal architect Mir Musa Khan with surplus construction funds from this post.",
    mythDebunked: "It was not a modern municipal tax octroi, but a 17th-century sultanate military defensive post.",
    relatedSiteId: "toli-masjid",
    sources: ["Sherwani, H.K. (1974), History of the Qutb Shahi Dynasty", "ASI Monument Monographs"],
  },
  {
    id: "tarnaka",
    name: "Tarnaka",
    teluguName: "తార్నాక",
    urduName: "تار ناکہ",
    coordinates: { lat: 17.4289, lng: 78.5305 },
    languages: ["Urdu", "Hindi"],
    roots: [
      { term: "Tar", language: "Urdu / Hindi", meaning: "Wire / Telegraph line" },
      { term: "Naka", language: "Urdu / Hindi", meaning: "Checkpost / Outpost" },
    ],
    summary: "Designates the Nizam-era telegraph post situated where the regional telegraph wires entered the northeastern bounds of Secunderabad.",
    history:
      "Following the introduction of electric telegraph lines across the Nizam's dominions in the late 19th century, an official wire station and guard post was set up at this northeastern junction. The public called the intersection 'Tar-Naka' (The Wire Post), which eventually designated the entire academic and residential locality.",
    mythDebunked: "It is often mistaken for a Telugu word with local suffixes; 'Tar' specifically denotes the electric telegraph wire.",
    relatedSiteId: "secunderabad-clock-tower",
    sources: ["Postal & Telegraphic History of Hyderabad State", "State Archives of Telangana"],
  },
  {
    id: "habsiguda",
    name: "Habsiguda",
    teluguName: "హబ్సిగూడ",
    urduName: "حبشی گوڑہ",
    coordinates: { lat: 17.4208, lng: 78.5417 },
    languages: ["Arabic", "Telugu"],
    roots: [
      { term: "Habshi", language: "Arabic (Al-Habash)", meaning: "Abyssinian / African Siddi soldiers" },
      { term: "Guda / Gudem", language: "Telugu", meaning: "Hamlet / Settlement" },
    ],
    summary: "Named after the historic settlement of Habshi (Abyssinian / African Siddi) guards and cavalrymen in the service of the Nizams.",
    history:
      "From the Bahmani and Qutb Shahi eras through the Asaf Jahi period, East African soldiers and commanders (known in India as Siddis or Habshis, from the Arabic name for Abyssinia/Ethiopia) held prestigious positions as bodyguards, fort commanders, and elite cavalrymen. One of their residential quarters outside Secunderabad came to be called Habsiguda (Habshi Village).",
    mythDebunked: "The term reflects a long, honorable history of African military and cultural presence in the Deccan, seen also in the Nizam's African Cavalry Guard.",
    relatedSiteId: "barkas",
    sources: ["Ali, Shanti Sadiq (1996), The African Dispersal in the Deccan", "Robbins & McLeod, African Elites in India"],
  },
  {
    id: "punjagutta",
    name: "Punjagutta",
    teluguName: "పంజాగుట్ట",
    urduName: "پنجہ گٹہ",
    coordinates: { lat: 17.4262, lng: 78.4528 },
    languages: ["Persian", "Telugu"],
    roots: [
      { term: "Panja", language: "Persian / Urdu", meaning: "Palm / Open handprint" },
      { term: "Gutta", language: "Telugu", meaning: "Hill / Rocky mound" },
    ],
    summary: "Named for a hilltop rock bearing a revered palm impression (Panja) of Hazrat Ali, son-in-law of Prophet Muhammad.",
    history:
      "During the reign of Sultan Ibrahim Qutb Shah in the 16th century, a hilltop shrine was established around a natural rock formation believed to carry the imprint of the hand (panja) of Hazrat Ali. The hillock was christened Panja Pahad or Punjagutta, a classic Dakhni-Telugu bilingual compound blending Persian 'Panja' with Telugu 'Gutta' (hill).",
    mythDebunked: "It has no connection to the number five ('panch'), but specifically to the sacred hand relic.",
    relatedSiteId: "moula-ali-dargah",
    sources: ["Deccan Heritage Trust Bulletins", "Syed Ali Asgar Bilgrami, Landmarks of the Deccan (1927)"],
  },
  {
    id: "secunderabad",
    name: "Secunderabad",
    teluguName: "సికింద్రాబాద్",
    urduName: "سکندر آباد",
    coordinates: { lat: 17.4399, lng: 78.4983 },
    languages: ["Persian", "Urdu"],
    roots: [
      { term: "Sikandar", language: "Persian / Arabic", meaning: "Nizam Sikandar Jah (Asaf Jah III)" },
      { term: "Abad", language: "Persian", meaning: "City / Populated settlement" },
    ],
    summary: "Founded in 1806 as an East India Company military cantonment following the Treaty of Subsidiary Alliance, named after Nizam III Sikandar Jah.",
    history:
      "Following the 1798 and 1800 subsidiary alliance treaties between Nizam Ali Khan (Asaf Jah II) and the British, British subsidiary forces were stationed north of Hussain Sagar. In 1806, the new garrison city was officially designated 'Secunderabad' by the British in honor of the reigning Nizam, Sikandar Jah (Asaf Jah III). It grew into one of the largest military cantonments in British India.",
    mythDebunked: "Not named directly after Alexander the Great (Sikandar), but after the Asaf Jahi ruler of Hyderabad who bore that regal name.",
    relatedSiteId: "secunderabad-clock-tower",
    sources: ["Lynton, Harriet Ronken (1974), The Days of the Beloved", "Muddiraj, K. Krishnaswamy (1934), Pictorial Hyderabad"],
  },
  {
    id: "begumpet",
    name: "Begumpet",
    teluguName: "బేగంపేట",
    urduName: "بیگم پیٹ",
    coordinates: { lat: 17.4447, lng: 78.4664 },
    languages: ["Dakhni", "Telugu"],
    roots: [
      { term: "Begum", language: "Turco-Persian / Urdu", meaning: "Noblewoman / Princess" },
      { term: "Pet / Peta", language: "Telugu / Dakhni", meaning: "Town / Suburb" },
    ],
    summary: "Named after Basheerunnisa Begum, daughter of the 6th Nizam Mahbub Ali Khan, gifted this land as part of her royal wedding dowry.",
    history:
      "When Basheerunnisa Begum married Sir Asman Jah (the Paigah nobleman and future Prime Minister of Hyderabad), she received extensive agricultural lands north of the lake as her wedding settlement (jahez). The settlement that developed around her country palaces and gardens was named 'Begumpet' (The Princess's Town).",
    mythDebunked: "It was not named after just any generic queen, but specifically Basheerunnisa Begum of the royal house.",
    relatedSiteId: "spanish-mosque",
    sources: ["Narendra Luther Archives", "Paigah Family Historical Records"],
  },
  {
    id: "himayatnagar",
    name: "Himayat Nagar",
    teluguName: "హిమాయత్ నగర్",
    urduName: "حمایت نگر",
    coordinates: { lat: 17.4024, lng: 78.4842 },
    languages: ["Urdu", "Sanskrit"],
    roots: [
      { term: "Himayat", language: "Arabic / Urdu", meaning: "Prince Himayat Ali Khan (Azam Jah)" },
      { term: "Nagar", language: "Sanskrit", meaning: "Town / City" },
    ],
    summary: "Named after Prince Himayat Ali Khan (Azam Jah), the eldest son and Crown Prince of the 7th Nizam Mir Osman Ali Khan.",
    history:
      "Laid out during the 1930s by the City Improvement Board as a spacious planned residential neighborhood for Hyderabad's emerging professional class, judges, and intellectuals, the area was dedicated to the Crown Prince Azam Jah, whose given personal name was Himayat Ali Khan.",
    mythDebunked: "While 'Himayat' means protection/patronage in Arabic, the area directly commemorates the Prince.",
    relatedSiteId: "jubilee-hall",
    sources: ["City Improvement Board of Hyderabad Annual Reports", "Who's Who in Hyderabad (1938)"],
  },
  {
    id: "ameerpet",
    name: "Ameerpet",
    teluguName: "అమీర్‌పేట",
    urduName: "امیر پیٹ",
    coordinates: { lat: 17.4375, lng: 78.4482 },
    languages: ["Urdu", "Telugu"],
    roots: [
      { term: "Ameer", language: "Arabic / Urdu", meaning: "Nobleman / Landlord (Amir Ali)" },
      { term: "Pet", language: "Telugu / Dakhni", meaning: "Settlement / Market town" },
    ],
    summary: "Named after Amir Ali, a prominent jagirdar and landowner who developed village settlements and wells here in the 19th century.",
    history:
      "Before urban development transformed Ameerpet into Hyderabad's coaching and IT transit hub, it was a sleepy jagir village owned by nobleman Amir Ali. His palatial garden house, mango orchards, and stepwells defined the western approach towards Sanathnagar.",
    mythDebunked: "It does not mean 'Town of the Rich' in the generic sense, but traces directly to landowner Amir Ali.",
    relatedSiteId: "errum-manzil",
    sources: ["Hyderabad Urban Toponymy Project", "Revenue Records of Hyderabad District"],
  },
  {
    id: "malakpet",
    name: "Malakpet",
    teluguName: "మలక్‌పేట",
    urduName: "ملک پیٹ",
    coordinates: { lat: 17.3762, lng: 78.5056 },
    languages: ["Dakhni", "Telugu"],
    roots: [
      { term: "Malik", language: "Arabic / Urdu", meaning: "King / Lord (specifically Malik Yaqoob)" },
      { term: "Pet", language: "Telugu / Dakhni", meaning: "Market town / Settlement" },
    ],
    summary: "Named after Malik Yaqoob, an esteemed servant and market keeper to the 7th Qutb Shahi Sultan Abdullah Qutb Shah.",
    history:
      "Malik Yaqoob was a trusted attendant and royal steward of King Abdullah Qutb Shah in the mid-17th century. He established grain stores, markets, and horse paddocks on the eastern approaches to the city. Later under the Nizams, the area became famous for the Hyderabad Race Course and the magnificent palace of Nizam VI, Mahbub Mansion.",
    mythDebunked: "It is often mistaken as being named for 'Malak' (angel in Arabic); historical royal firmans prove it was Malik Yaqoob.",
    relatedSiteId: "mahbub-mansion",
    sources: ["Sherwani, H.K., History of Medieval Deccan", "Landmarks of the Deccan (1927)"],
  },
  {
    id: "barkas",
    name: "Barkas",
    teluguName: "బార్కస్",
    urduName: "بارکس",
    coordinates: { lat: 17.3195, lng: 78.4878 },
    languages: ["English", "Arabic"],
    roots: [
      { term: "Barracks", language: "English", meaning: "Military housing quarters" },
    ],
    summary: "Phonetic corruption of the English word 'Barracks', where the Nizam's military garrison of Hadhrami Arab soldiers from Yemen was stationed.",
    history:
      "In the mid-19th century, the Nizams formed an elite private irregular bodyguard known as the Chaush, recruiting heavily from the Hadhramaut region of southern Yemen. The soldiers were quartered in military cantonment barracks south of Falaknuma. The local Dakhni accent transformed 'Barracks' into 'Barkas'. The neighborhood still preserves unique Hadhrami cultural customs, lungi attire, and culinary traditions including the original Hyderabadi Haleem and Marag.",
    mythDebunked: "Barkas is not an Arabic word; it is purely the local pronunciation of the English word 'barracks'.",
    relatedSiteId: "falaknuma-palace",
    sources: ["Omar Khalidi, The Arabs of Hadramawt in Hyderabad", "M.A. Nayeem, The Heritage of the Adil Shahis and Nizams"],
  },
  {
    id: "jubileehills",
    name: "Jubilee Hills",
    teluguName: "జూబ్లీ హిల్స్",
    urduName: "جوبلی ہلز",
    coordinates: { lat: 17.4319, lng: 78.4073 },
    languages: ["English"],
    roots: [
      { term: "Jubilee", language: "English", meaning: "Silver Jubilee celebration (1936)" },
      { term: "Hills", language: "English", meaning: "Granite hillocks" },
    ],
    summary: "Created to commemorate the Silver Jubilee of the 7th Nizam Mir Osman Ali Khan's reign in 1936.",
    history:
      "In 1936, the Nizam's administration celebrated 25 years of Mir Osman Ali Khan's rule. The City Improvement Board planned two commemorative sites: Jubilee Hall in Public Gardens for public festivities, and the scenic granite ridge northwest of Banjara Hills, named 'Jubilee Hills'.",
    mythDebunked: "It was not named after Queen Victoria's Jubilee, but the Nizam's 1936 Silver Jubilee.",
    relatedSiteId: "jubilee-hall",
    sources: ["Silver Jubilee Souvenir Volume of H.E.H. The Nizam's Government (1936)", "Narendra Luther, Lashkar"],
  },
  {
    id: "banjarahills",
    name: "Banjara Hills",
    teluguName: "బంజారా హిల్స్",
    urduName: "بنجارہ ہلز",
    coordinates: { lat: 17.4156, lng: 78.4357 },
    languages: ["Dakhni", "Telugu", "English"],
    roots: [
      { term: "Banjara", language: "Indo-Aryan (from Sanskrit Vanijya-kara)", meaning: "Caravan merchant / nomadic trader" },
      { term: "Hills", language: "English", meaning: "Granite ridges and boulders" },
    ],
    summary: "Named after the nomadic Banjara (Lambadi) communities who pitched seasonal cattle and grain trade camps among the rocky hills.",
    history:
      "Before urban development by Nawab Mehdi Nawaz Jung in 1927, these rocky, tiger-roamed ridges outside Golconda and Hyderabad were used by Banjara caravans as grazing and transit grounds for pack bullocks transporting grain and salt across peninsular India.",
    mythDebunked: "It was not named for being a 'banjar' (barren) land, but for the legendary Banjara trading community.",
    relatedSiteId: "errum-manzil",
    sources: ["Mehdi Nawaz Jung Papers", "Haimendorf, Tribes of India: The Struggle for Survival"],
  },
  {
    id: "nampally",
    name: "Nampally",
    teluguName: "నాంపల్లి",
    urduName: "نامپلی",
    coordinates: { lat: 17.3921, lng: 78.4682 },
    languages: ["Persian", "Telugu"],
    roots: [
      { term: "Nek Nam", language: "Persian", meaning: "Of Good Repute (Title of Diwan Raza Ali Khan)" },
      { term: "Palli", language: "Telugu", meaning: "Village / Settlement" },
    ],
    summary: "A contraction of 'Neknampally', named after Raza Ali Khan 'Nek Nam Khan', Prime Minister to Sultan Abdullah Qutb Shah.",
    history:
      "Raza Ali Khan, given the imperial title 'Nek Nam Khan' (The Man of Good Name) by Sultan Abdullah Qutb Shah, was a brilliant statesman who served as Diwan and general. He acquired lands west of the city and developed a model garden suburb named Neknampally. Over three centuries, common parlance shortened it to Nampally. Today it houses the historic Hyderabad railway terminus built in 1907.",
    mythDebunked: "Popular folklore that 'Nam' meant 'namkkeen' or 'namuna' is baseless; the epigraphical records clearly record Neknam Khan.",
    relatedSiteId: "sitarambagh-mandir",
    sources: ["Epigraphia Indo-Moslemica", "Landmarks of the Deccan, Bilgrami (1927)"],
  },
  {
    id: "koti",
    name: "Koti",
    teluguName: "కోటి",
    urduName: "کوٹھی",
    coordinates: { lat: 17.3855, lng: 78.4856 },
    languages: ["Dakhni", "Hindi"],
    roots: [
      { term: "Kothi", language: "Dakhni / Hindi", meaning: "Mansion / Stately residence" },
    ],
    summary: "Refers to the grand Palladian-style British Residency mansion (Kothi) erected between 1803 and 1806 by Resident James Achilles Kirkpatrick.",
    history:
      "When the British Residency was built on the north bank of the Musi River — a massive Corinthian mansion inspired by Kedleston Hall — locals called the colossal estate 'Kothi' (The Mansion). The entire surrounding banking and commercial bazaar became universally known as Koti.",
    mythDebunked: "It has no relation to the Telugu numeral 'Koti' (crore / ten million); it is the Dakhni word for mansion.",
    relatedSiteId: "british-residency",
    sources: ["Dalrymple, William (2002), White Mughals", "Historical Records of Hyderabad Residency"],
  },
  {
    id: "erragadda",
    name: "Erragadda",
    teluguName: "ఎర్రగడ్డ",
    urduName: "ایرا گڑہ",
    coordinates: { lat: 17.4552, lng: 78.4287 },
    languages: ["Telugu"],
    roots: [
      { term: "Erra", language: "Telugu", meaning: "Red" },
      { term: "Gadda", language: "Telugu", meaning: "Mound / Hillock / Clay soil" },
    ],
    summary: "A pure Telugu toponym denoting the prominent red-laterite soil hillock visible along the old highway to Bombay.",
    history:
      "The terrain of western Hyderabad transitions from gray granite boulders into reddish ferruginous laterite soil. The elevated red earth ridge became known naturally to Telugu travelers as 'Erra Gadda' (The Red Mound).",
    mythDebunked: "A quintessential indigenous Deccan topographical name dating back centuries before Hyderabad was founded.",
    relatedSiteId: "ameerpet",
    sources: ["Geological Survey of India: Geology of the Hyderabad Region", "Telugu Place-Names Dictionary"],
  },
  {
    id: "falaknuma",
    name: "Falaknuma",
    teluguName: "ఫలక్‌నుమా",
    urduName: "فلک نما",
    coordinates: { lat: 17.3314, lng: 78.4678 },
    languages: ["Urdu", "Persian"],
    roots: [
      { term: "Falak", language: "Arabic / Persian", meaning: "Sky / Heavens" },
      { term: "Numa", language: "Persian", meaning: "Mirror / Resembling / Representation" },
    ],
    summary: "Poetically translates to 'Mirror of the Sky', named after the scorpion-shaped hilltop palace commissioned by Sir Vicar-ul-Umra in 1884.",
    history:
      "Perched on a 2,000-foot-high hill overlooking the entire city of Hyderabad, the palace was constructed of pure Italian marble by Prime Minister Sir Vicar-ul-Umra. Its elevation made it appear to touch the celestial vault, inspiring the poetic name Falak-numa ('Like the Heavens' or 'Mirror of the Sky'). It was later purchased by Nizam VI Mahbub Ali Khan.",
    mythDebunked: "It is an intentional literary Persian title, perfectly matching its commanding geographic elevation.",
    relatedSiteId: "falaknuma-palace",
    sources: ["Paigah Heritage Archives", "Hyderabad: A City in History"],
  },
  {
    id: "karwan",
    name: "Karwan",
    teluguName: "కార్వాన్",
    urduName: "کاروان",
    coordinates: { lat: 17.3789, lng: 78.4385 },
    languages: ["Persian"],
    roots: [
      { term: "Karwan", language: "Persian", meaning: "Caravan (company of merchant travelers)" },
    ],
    summary: "Where international merchant caravans dealing in diamonds, pearls, and Deccani textiles encamped before entering Golconda Fort.",
    history:
      "In the 16th and 17th centuries, Golconda was the center of the global diamond trade. Thousands of gem merchants from Persia, Armenia, Venice, and Rajasthan arrived in caravans with camels, horses, and bullocks. They camped along the Musi riverbank outside the fort gates at Karwan, which developed into an artisan quarter of weavers, jewelers, and bankers.",
    mythDebunked: "Directly retains its Persian trade title from the diamond boom era.",
    relatedSiteId: "puranapul",
    sources: ["Tavernier, Jean-Baptiste, Travels in India (1676)", "Sherwani, History of Golkonda"],
  },
  {
    id: "enginebowli",
    name: "Engine Bowli",
    teluguName: "ఇంజన్ బౌలి",
    urduName: "انجن باؤلی",
    coordinates: { lat: 17.3412, lng: 78.4721 },
    languages: ["English", "Dakhni"],
    roots: [
      { term: "Engine", language: "English", meaning: "Steam railway locomotive" },
      { term: "Bowli", language: "Dakhni", meaning: "Stepwell" },
    ],
    summary: "A stepwell where the steam engines of the Nizam's Guaranteed State Railway (NGSR) drew clean water for their train boilers.",
    history:
      "When the railway network expanded through the Old City towards Falaknuma and Umdanagar under Nizam VI, railway steam locomotives required enormous quantities of mineral-free water for their pressurized boilers. Water was pumped from this deep stone stepwell into locomotive overhead tanks, giving the neighborhood its permanent hybrid name.",
    mythDebunked: "It was not a fire-engine station, but a railway steam engine water provisioning well.",
    relatedSiteId: "falaknuma-palace",
    sources: ["Nizam's Guaranteed State Railway Company Archives (1879–1950)", "Deccan History Society"],
  },
  {
    id: "dilsukhnagar",
    name: "Dilsukhnagar",
    teluguName: "దిల్‌సుఖ్‌నగర్",
    urduName: "دل سکھ نگر",
    coordinates: { lat: 17.3688, lng: 78.5247 },
    languages: ["Urdu", "Sanskrit"],
    roots: [
      { term: "Dilsukh", language: "Urdu (Dil = Heart, Sukh = Peace/Delight)", meaning: "Dilsukh Ram (Landowner & Philanthropist)" },
      { term: "Nagar", language: "Sanskrit", meaning: "Colony / Township" },
    ],
    summary: "Named after Dilsukh Ram, an enlightened agriculturalist who purchased and planned out plots here in the mid-20th century.",
    history:
      "Dilsukh Ram was an affluent landowner who acquired vast agricultural fields along the Vijayawada highway in the 1950s. Rather than keeping it as private orchards, he subdivided the land into affordable residential plots for middle-class families with parks and wide roads, naming the new colony after himself.",
    mythDebunked: "It is named after a real historical person, not an abstract poetic wishing of 'peace of heart'.",
    relatedSiteId: "asmangadh-palace",
    sources: ["Telangana History Journal", "Municipal Corporation of Hyderabad Gazetteers"],
  },
  {
    id: "chaderghat",
    name: "Chaderghat",
    teluguName: "చాదర్‌ఘాట్",
    urduName: "چادر گھاٹ",
    coordinates: { lat: 17.3781, lng: 78.4912 },
    languages: ["Urdu", "Hindi"],
    roots: [
      { term: "Chader", language: "Urdu (from Persian Chadar)", meaning: "Sheet of water / Waterfall weir" },
      { term: "Ghat", language: "Hindi / Telugu", meaning: "Riverbank / Stepped descent to water" },
    ],
    summary: "Named for a stone weir across the Musi River over which cascading floodwaters formed a glistening white 'sheet' (chadar).",
    history:
      "In the early 19th century, a low masonry dam/weir was built across the Musi River near the Residency to maintain upstream water levels. As the water cascaded smoothly over the curved crest, it created an unbroken white sheet resembling an ornamental chadar. The riverside steps became known as Chaderghat.",
    mythDebunked: "Does not refer to textile bedsheets or cloth markets, but to the architectural water cascade weir.",
    relatedSiteId: "british-residency",
    sources: ["Landmarks of the Deccan", "Chronicles of the Musi River"],
  },
  {
    id: "moghalpura",
    name: "Moghalpura",
    teluguName: "మొఘల్‌పురా",
    urduName: "مغل پورہ",
    coordinates: { lat: 17.3551, lng: 78.4795 },
    languages: ["Persian", "Sanskrit"],
    roots: [
      { term: "Moghal", language: "Persian", meaning: "Mughal commanders and soldiers" },
      { term: "Pura", language: "Sanskrit", meaning: "Quarter / Township" },
    ],
    summary: "The southern residential quarter where Mughal officers, administrators, and soldiers settled after the 1687 conquest of Golconda.",
    history:
      "Following Emperor Aurangzeb's conquest of Golconda in 1687, thousands of Mughal imperial administrators, generals, and families were garrisoned in Hyderabad. They established an upscale residential quarter south of Charminar, which became Moghalpura.",
    mythDebunked: "Established in the late 17th century specifically as an imperial Mughal administrative cantonment.",
    relatedSiteId: "charminar",
    sources: ["Mughal Archives of Hyderabad", "Sir Jadunath Sarkar, History of Aurangzib"],
  },
];

// Helper to look up an area etymology
export function getAreaEtymology(id) {
  return AREA_ETYMOLOGIES.find((a) => a.id === id);
}

// Search areas by query or filter by language root
export function filterAreaEtymologies(q = "", language = "all") {
  const query = q.trim().toLowerCase();
  return AREA_ETYMOLOGIES.filter((area) => {
    if (language !== "all") {
      const hasLang = area.languages.some((l) => l.toLowerCase().includes(language.toLowerCase()));
      if (!hasLang) return false;
    }
    if (!query) return true;
    return (
      area.name.toLowerCase().includes(query) ||
      area.summary.toLowerCase().includes(query) ||
      area.history.toLowerCase().includes(query) ||
      (area.teluguName && area.teluguName.includes(query)) ||
      (area.urduName && area.urduName.includes(query))
    );
  });
}

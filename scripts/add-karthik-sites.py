import json

with open('data/sites.json', 'r') as f:
    sites = json.load(f)

# Existing sites enrichment map (site_id -> curator_note)
enrichments = {
    "mahbub-mansion": {
        "curatorNote": "Historic Asaf Jahi mansion in Malakpet",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"
    },
    "moula-ali-dargah": {
        "curatorNote": "Home to several dozens of cairns circles that need to be rediscovered",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"
    },
    "saidani-ma-tomb": {
        "curatorNote": "Qutub Shahi era / early Asaf Jahi tomb near Hussain Sagar",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"
    },
    "paigah-tombs": {
        "curatorNote": "Lesser known but beautiful tombs with intricate lime-stucco jali screens",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"
    },
    "raymond-tomb": {
        "curatorNote": "Only French tomb ever constructed in Hyderabad",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"
    },
    "errum-manzil": {
        "curatorNote": "Access restricted grand palace built by Nawab Safdar Jung Musheer-ud-Daula",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"
    },
    "jubilee-hall": {
        "curatorNote": "Near the Centenary Heritage Museum with remarkable displays in Public Gardens",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"
    }
}

for s in sites:
    if s["id"] in enrichments:
        enr = enrichments[s["id"]]
        s["curatorNote"] = enr["curatorNote"]
        s["curatedBy"] = enr["curatedBy"]
        s["curationSource"] = enr["curationSource"]
        s["curationUrl"] = enr["curationUrl"]
        if "sources" not in s:
            s["sources"] = []
        if not any(x.get("label") == "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad" for x in s["sources"]):
            s["sources"].append({
                "label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad",
                "url": enr["curationUrl"]
            })

new_sites = [
    {
        "id": "gachibowli-stepwell",
        "name": "Gachibowli Stepwell",
        "altNames": ["Gachibowli Baoli", "Well of Gachibowli"],
        "lat": 17.441689,
        "lng": 78.3605097,
        "era": "asaf-jahi",
        "yearBuilt": "c. 1820",
        "type": "baoli",
        "status": "state-protected",
        "access": "open",
        "area": "Gachibowli",
        "summary": "The 200-year-old limestone-lined stepwell that gave the entire neighborhood of Gachibowli its name. Once irrigated 10 acres of surrounding farmland; restored in 2021.",
        "story": "In Dakhni, 'Gachi' refers to limestone mortar/plaster quarried in this region, and 'Bowli' (from Sanskrit Vapi) denotes a stepped well. Built during early 19th-century Nizam rule, this square stone-masonry stepwell supplied drinking and irrigation water for 10 acres of farmland around the original village. After falling into neglect amid the cyber-city real estate boom, it was successfully cleared, structurally stabilised, and restored in 2021 with perimeter stone paving and protective safety netting.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "200 year old step well that lent its name to Gachibowli",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"},
            {"label": "The Hindu: 'Restoring Hyderabad's Forgotten Stepwells'", "url": "https://www.thehindu.com"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False,
        "photos": [
            {
                "url": "/photos/gachibowli-stepwell.jpg",
                "credit": "Community Documentation / Deccan Heritage Survey",
                "licence": "CC BY-SA",
                "source": "Field Survey 2026"
            }
        ]
    },
    {
        "id": "amin-khan-tomb-patancheru",
        "name": "Amin Khan Tomb (1568)",
        "altNames": ["Patancheru Amin Khan Tomb", "Dargah Amin Khan"],
        "lat": 17.530573,
        "lng": 78.2602679,
        "era": "qutb-shahi",
        "yearBuilt": "1568",
        "type": "tomb",
        "status": "state-protected",
        "access": "open",
        "area": "Patancheru",
        "summary": "An octagonal granite and stucco tomb built in 1568 by Amin Khan, high minister under Ibrahim Qutb Shah. It predates Charminar by 23 years.",
        "story": "Erected during the reign of Ibrahim Qutb Shah (reigned 1550–1580), this tomb is one of the earliest standing monuments of the Qutb Shahi dynasty. Amin Khan was an aristocratic administrator who built an expansive walled complex complete with an orchard, caravanserai, well, and mosque along the historic trade highway to Bidar. The tomb features fine stucco calligraphy and bulbous dome arches.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Tomb from 1568 that is older than the Charminar",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"},
            {"label": "Epigraphia Indo-Moslemica: Amin Khan Inscription", "url": "https://asi.nic.in"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "telunganaapura-tellapur-inscription",
        "name": "Telunganaapura Inscription (Tellapur)",
        "altNames": ["Tellapur Inscription", "Nagojula Stepwell Epigraph"],
        "lat": 17.4666637,
        "lng": 78.2856434,
        "era": "earlier",
        "yearBuilt": "1417",
        "type": "civic",
        "status": "state-protected",
        "access": "open",
        "area": "Tellapur",
        "summary": "A 1417 CE stone inscription that records the excavation of a public stepwell, recognized as the earliest known Telugu epigraph containing the word 'Telangana' (Telunganaapura).",
        "story": "Engraved in classical medieval Telugu script in Shaka 1340 (1417 CE) during the reign of Sultan Feroz Shah Bahmani, this stone slab records the construction of a stepwell (dharma-vapi) by a local artisan named Nagojula in the village of Telunganaapura. Historians and epigraphists consider it a milestone archaeological record, establishing the antiquity of the regional name 'Telangana' over six centuries ago.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "First Telugu inscription to contain the word “Telangana”",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"},
            {"label": "Telangana State Archaeology Epigraphical Series", "url": "https://heritage.telangana.gov.in"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "patancheru-jain-mandapam",
        "name": "Patancheru Jain Mandapam (Old Temple)",
        "altNames": ["Qureshi Mohalla Mandapam", "Pottalakere Jain Temple"],
        "lat": 17.5349185,
        "lng": 78.2639955,
        "era": "earlier",
        "yearBuilt": "c. 1000",
        "type": "temple",
        "status": "unprotected",
        "access": "open",
        "area": "Patancheru",
        "summary": "An 800–1200 year old Rashtrakuta / Western Chalukyan carved Jain pillared mandapam surviving in the heart of old Patancheru.",
        "story": "In medieval history, Patancheru was known as 'Pottalakere', a prominent political and religious capital under the Western Chalukyas and Rashtrakutas. It was a thriving center of Jainism with royal patronage. This surviving open mandapa in Qureshi Mohalla features finely chiselled stone pillars with lotus medallions and Tirthankara relief icons.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Historic 800-1200 year old Jain mandapam",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"},
            {"label": "P.B. Desai, Jainism in South India and Epigraphic Researches", "url": "https://archive.org"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "sri-indreshwara-swamy-indresham",
        "name": "Sri Indreshwara Swamy Temple",
        "altNames": ["Indresham Temple", "Indreshwara Devasthanam"],
        "lat": 17.5679014,
        "lng": 78.2676641,
        "era": "earlier",
        "yearBuilt": "c. 1320",
        "type": "temple",
        "status": "unprotected",
        "access": "open",
        "area": "Indresham",
        "summary": "A 700-year-old Kakatiya-period stone temple complex preserving ancient hero stones (Veeragallu), Nandi mandapa, and sculpted Shaivite panels.",
        "story": "Built on the outskirts of Patancheru during the late Kakatiya era, the Indreshwara Swamy Temple features stepped stone vimanas, granitic pillars, and warrior memorial stones commemorating soldiers who fell in battle during the 14th-century Deccan conflicts. The sanctum preserves an ancient Shiva linga.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "700 year old temple with hero stones and statues",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "hasmathpet-cairns",
        "name": "Hasmathpet Megalithic Cairns",
        "altNames": ["Hasmathpet Stone Circles", "Bowenpally Megaliths"],
        "lat": 17.4793571,
        "lng": 78.4889084,
        "era": "earlier",
        "yearBuilt": "c. 300 BCE",
        "type": "cemetery",
        "status": "state-protected",
        "access": "ruin",
        "area": "Bowenpally",
        "summary": "Over 2,300-year-old Iron Age megalithic burial complex composed of monumental granite boulder stone circles and cist tombs.",
        "story": "Excavated systematically by the Hyderabad State Department of Archaeology in the 1930s and later by the Birla Archaeological Institute, Hasmathpet is one of the premier Iron Age megalithic sites in the Deccan. The site contains dozens of stone circles encircling subterranean cist chambers that yielded black-and-red pottery, iron weapons, and terracotta sarcophagi.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Cairns, or prehistoric burial site, from 2,300 years ago",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"},
            {"label": "Archaeological Survey of India Megalithic Reports", "url": "https://asi.nic.in"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "kondapur-megalithic-burials",
        "name": "Megalithic Burial Site (Kondapur / BJR Nagar)",
        "altNames": ["BJR Nagar Stone Circles", "Serilingampalle Megaliths"],
        "lat": 17.4632457,
        "lng": 78.3340719,
        "era": "earlier",
        "yearBuilt": "c. 1000 BCE",
        "type": "cemetery",
        "status": "at-risk",
        "access": "ruin",
        "area": "Kondapur",
        "summary": "Prehistoric Iron Age stone circle burials situated on a rocky ridge in western Hyderabad, estimated to be between 2,500 and 3,500 years old.",
        "story": "Before modern IT parks transformed Serilingampalle and Kondapur, these granite ridges supported thriving Iron Age pastoral and metallurgic communities. The site features stone cairn circles built of massive weathered granite boulders, marking family burial chambers from the first millennium BCE.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Considered the oldest, 4500 year old Iron Age site",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "keesaragutta-vishnukundina-ruins",
        "name": "Vishnukundina Dynasty Brick & Stone Excavations",
        "altNames": ["Keesaragutta Fortified Citadel", "Keesara Early Historic Site"],
        "lat": 17.5320644,
        "lng": 78.6876749,
        "era": "earlier",
        "yearBuilt": "c. 500",
        "type": "fort",
        "status": "asi-protected",
        "access": "open",
        "area": "Keesaragutta",
        "summary": "Excavated 5th–6th century CE capital ruins of the Vishnukundina dynasty, featuring brick residential complexes, fortified walls, and rock-cut shrines.",
        "story": "Extensive excavations on the Keesaragutta plateau uncovered a royal fortified citadel of the Vishnukundina kings (c. 450–620 CE). The ruins feature monumental burnt-brick palace foundations, square stone-paved courtyards, defensive ramparts, and pottery inscribed with early Telugu-Brahmi script.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Remains of a 6th century Vishnukundina temple",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"},
            {"label": "ASI Excavation Reports: Keesaragutta (1975–1985)", "url": "https://asi.nic.in"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "keesaragutta-ancient-shiva-temple",
        "name": "Ancient Shiva Temple & Hero Stones (Keesaragutta)",
        "altNames": ["Ramalingeswara Hill Shrines", "Keesaragutta Hero Stones"],
        "lat": 17.5293667,
        "lng": 78.6861524,
        "era": "earlier",
        "yearBuilt": "c. 600",
        "type": "temple",
        "status": "state-protected",
        "access": "open",
        "area": "Keesaragutta",
        "summary": "Ancient hilltop temple site dotted with monolithic stone Shiva lingas, medieval hero stones (Veeragallu), and boulder caves.",
        "story": "According to tradition, Lord Rama consecrated thousands of lingas here to atone for slaying Ravana. The hill contains over 100 rock-cut and free-standing stone lingas dating to the Vishnukundina and Chalukya epochs, with forest trails behind the lake revealing warrior hero stones and panoramic views.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Ancient temple. Walk up the hill behind the temple to find more hero stones and some ruins.",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "shaikpet-sarai",
        "name": "Shaikpet Sarai (Caravanserai)",
        "altNames": ["Shaikpet Rest House", "Qutb Shahi Sarai Shaikpet"],
        "lat": 17.4065139,
        "lng": 78.3960278,
        "era": "qutb-shahi",
        "yearBuilt": "c. 1640",
        "type": "civic",
        "status": "state-protected",
        "access": "ruin",
        "area": "Shaikpet",
        "summary": "A monumental 30-room stone caravanserai built during the reign of Abdullah Qutb Shah for merchants and traveling caravans between Golconda and Hyderabad.",
        "story": "Positioned strategically along the royal travel route linking Golconda Fort to the city, the Shaikpet Sarai was constructed of dressed granite blocks with vaulted arched chambers, stables for horses and camels, and an internal courtyard. It is a rare surviving public civic structure from the 17th-century sultanate.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Old caravanserai or resting place during trade routes",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"},
            {"label": "INTACH Hyderabad Heritage Listing", "url": "https://intach.org"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "shaikpet-qutb-shahi-mosque",
        "name": "Shaikpet Qutb Shahi Mosque",
        "altNames": ["Shaikpet Stone Mosque", "Old Shaikpet Masjid"],
        "lat": 17.4034102,
        "lng": 78.3998898,
        "era": "qutb-shahi",
        "yearBuilt": "c. 1650",
        "type": "mosque",
        "status": "at-risk",
        "access": "open",
        "area": "Shaikpet",
        "summary": "A graceful 17th-century Qutb Shahi triple-arched stone mosque featuring stucco relief and minarets, situated near the historic Shaikpet Sarai.",
        "story": "Erected in tandem with the Shaikpet Sarai complex, this mosque provided a place of worship for royal travelers and local residents. Built of dressed granite with fine stucco roundels and stepped parapets, the monument is currently in need of conservation amid rapid urban encroachment.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Old Qutub Shahi era mosque lying in neglect",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "khajaguda-cave-temple",
        "name": "Sri Anantha Padmanabha Swamy Cave Temple",
        "altNames": ["Khajaguda Rock Cave Temple", "Khajaguda Hills Vishnu Shrine"],
        "lat": 17.4097916,
        "lng": 78.3631644,
        "era": "earlier",
        "yearBuilt": "c. 1100",
        "type": "temple",
        "status": "at-risk",
        "access": "open",
        "area": "Khajaguda",
        "summary": "An ancient 800-year-old rock-cut cave shrine dedicated to Lord Vishnu, nestled inside the prehistoric Khajaguda granite rock formations.",
        "story": "Carved directly into natural rock shelters within the geological marvel of Khajaguda Hills, this sacred cave shrine preserves ancient stone icons of Lord Vishnu. The site is an irreplaceable confluence of natural heritage, prehistoric rock shelters, and medieval temple craftsmanship, currently threatened by surrounding quarrying and construction.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Historic 8 century old cave temple dedicated to Lord Vishnu",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"},
            {"label": "Save Khajaguda Rocks Trust", "url": "https://societytosaveheritagerocks.org"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "beerappa-temple-manchirevula",
        "name": "Sri Beerappa Temple & Petroglyphs",
        "altNames": ["Manchirevula Hero Stones", "Beerappa Devalayam"],
        "lat": 17.3740266,
        "lng": 78.3480732,
        "era": "earlier",
        "yearBuilt": "c. 1400",
        "type": "temple",
        "status": "at-risk",
        "access": "open",
        "area": "Manchirevula",
        "summary": "A traditional Kuruma community temple site housing medieval warrior hero stones and prehistoric petroglyphs carved on rear boulders.",
        "story": "Located near Manchirevula village along the Gandipet ridge, this shrine honors Beerappa, the deity of pastoral shepherd communities. Behind the modern temple structure, granite boulders bear ancient rock petroglyphs and 14th-century hero stones commemorating fallen village guardians.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Hero stones found here, along with petroglyphs behind it",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "forestrek-rock-art",
        "name": "Forestrek Park Prehistoric Rock Art",
        "altNames": ["Chilkur Rock Art", "Gandipet Prehistoric Shelter"],
        "lat": 17.366847,
        "lng": 78.3525312,
        "era": "earlier",
        "yearBuilt": "c. 2000 BCE",
        "type": "civic",
        "status": "unprotected",
        "access": "ticketed",
        "area": "Gandipet",
        "summary": "Ancient prehistoric rock art and petroglyphs preserved inside granitic rock shelters within Forestrek Park near Chilkur.",
        "story": "Discovered by rock heritage explorers, the granite caverns inside this reserve forest contain ochre pigments and etched motifs produced by prehistoric hunter-gatherer and early agrarian societies thousands of years ago.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Home to ancient rock art",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "gundlapochampally-rock-art",
        "name": "Gundlapochampally Prehistoric Rock Art & Caves",
        "altNames": ["Gundlapochampally Painted Caves", "Medchal Rock Art"],
        "lat": 17.5820471,
        "lng": 78.4612471,
        "era": "earlier",
        "yearBuilt": "c. 1000 BCE",
        "type": "civic",
        "status": "at-risk",
        "access": "open",
        "area": "Gundlapochampally",
        "summary": "Granite hillocks housing 2,000–3,000-year-old ochre cave paintings alongside medieval Shaivite hero stones and cisterns.",
        "story": "The rocky hillocks around Gundlapochampally preserve multiple archaeological layers. Red and white ochre pictographs depicting human figures, deer, and symbolic designs date to the late Megalithic epoch, while surrounding terraces feature medieval temple foundations and hero stones.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Cave painting at several sites, from 2000-3000 years ago. Also home to a lot of medieval Hindu heritage",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "kondapur-baoli",
        "name": "Kondapur Stepwell (Baoli)",
        "altNames": ["Kondapur Baoli", "Raja Rajeshwara Nagar Stepwell"],
        "lat": 17.4698487,
        "lng": 78.3498802,
        "era": "asaf-jahi",
        "yearBuilt": "c. 1850",
        "type": "baoli",
        "status": "at-risk",
        "access": "ruin",
        "area": "Kondapur",
        "summary": "An Asaf Jahi-era stone stepwell in Kondapur that historically watered the local village community and agricultural fields.",
        "story": "Constructed with traditional stepped granite revetments and landing platforms, this stepwell is a living testament to the sophisticated decentralized water management system that sustained village communities across the Deccan plateau.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Old stepwell in Kondapur",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "kondapur-archaeological-museum",
        "name": "Kondapur Archaeological Museum & Satavahana Site",
        "altNames": ["Kondapur ASI Museum", "Satavahana Site Kondapur"],
        "lat": 17.5496507,
        "lng": 78.0058357,
        "era": "earlier",
        "yearBuilt": "c. 100 BCE",
        "type": "civic",
        "status": "asi-protected",
        "access": "ticketed",
        "area": "Kondapur (Sangareddy)",
        "summary": "An ASI museum showcasing antiquities from an extensive 2,000–3,000-year-old Satavahana urban trading and Buddhist settlement.",
        "story": "Excavated in the 1940s by Ghulam Yazdani under the Nizam's Archaeological Department, Kondapur was a major Satavahana regional capital. The site museum exhibits Roman gold and silver coins, clay bullae, Buddhist chaitya relics, terracotta figurines, and iron tools establishing direct 1st-century trade links with Rome.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Contains remains of a 2,000-3,000 year old large settlement",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"},
            {"label": "ASI Kondapur Museum Guide", "url": "https://asi.nic.in"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "rachakonda-cave-temple",
        "name": "Lakshmi Narasimha Swamy Cave Temple",
        "altNames": ["Rachakonda Cave Shrine", "Narasimha Cave Rachakonda"],
        "lat": 17.1721402,
        "lng": 78.8035548,
        "era": "earlier",
        "yearBuilt": "c. 1360",
        "type": "temple",
        "status": "state-protected",
        "access": "ruin",
        "area": "Rachakonda Fort",
        "summary": "A 14th-century cave temple carved into the granite ramparts of Rachakonda Fort featuring ornate pillars and sculpted Narasimha icons.",
        "story": "Rachakonda was the fortified 14th-century mountain citadel of the Recherla Nayaka rulers who patronized Telugu literature and architecture. This cave temple is carved into living granite with pillared mandapas and relief carvings of Lord Narasimha.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Cave temple of Lord Narasimha with intricate carvings",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "rachakonda-rama-temple",
        "name": "Sri Rama Temple (Rachakonda Fort)",
        "altNames": ["Rachakonda Ancient Temple", "Rama Gudi Rachakonda"],
        "lat": 17.1837667,
        "lng": 78.8072273,
        "era": "earlier",
        "yearBuilt": "c. 1380",
        "type": "temple",
        "status": "ruin",
        "access": "open",
        "area": "Rachakonda",
        "summary": "An ancient stone temple of Lord Rama situated in the valley of Rachakonda Fort, showcasing classic medieval Deccan temple architecture.",
        "story": "Nestled in the picturesque valley between Rachakonda's granite hill fortifications, this stone temple features monolithic doorway jambs, carved stone ceilings, and a serene courtyard that once served royal courtiers.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Beautiful ancient temple of Lord Rama",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "khursheed-jah-devdi",
        "name": "Khursheed Jah Devdi",
        "altNames": ["Khurshid Jah Baradari", "Paigah Deodi Hussaini Alam"],
        "lat": 17.3583974,
        "lng": 78.4662682,
        "era": "asaf-jahi",
        "yearBuilt": "c. 1880",
        "type": "mansion",
        "status": "at-risk",
        "access": "restricted",
        "area": "Hussaini Alam",
        "summary": "A grand 19th-century neoclassical European palace built by the premier Paigah nobleman Nawab Khursheed Jah Bahadur.",
        "story": "Nawab Khursheed Jah Bahadur was one of the three premier Paigah nobles and maternal grandson of Nizam III Sikandar Jah. He built this majestic mansion featuring monumental Corinthian porticoes, Roman triangular pediments, and expansive halls with Italian marble flooring. It remains one of the finest neoclassical deodis in the Old City.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Unique piece of European architecture in Hyderabad",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"},
            {"label": "INTACH Hyderabad Heritage Listing Grade I", "url": "https://intach.org"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "asmangadh-palace",
        "name": "Asmangadh Palace",
        "altNames": ["Asmangarh Castle", "Sir Asman Jah Castle"],
        "lat": 17.3678213,
        "lng": 78.5155476,
        "era": "asaf-jahi",
        "yearBuilt": "1885",
        "type": "palace",
        "status": "intach-listed",
        "access": "restricted",
        "area": "Malakpet",
        "summary": "A European medieval Gothic castle perched atop a hillock in Malakpet, built in 1885 by Prime Minister Sir Asman Jah.",
        "story": "Sir Asman Jah, Paigah nobleman and Prime Minister of Hyderabad, was enchanted by medieval European castles during his travels. In 1885, he designed and erected this hilltop fortress named 'Asmangadh' ('Sky-High Castle') complete with stone battlements, gothic pointed arches, and turrets offering commanding views over Hyderabad.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Old Asaf Jahi palace",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "jiyaguda-ranganatha-swamy-temple",
        "name": "Sri Ranganatha Swamy Temple (Jiyaguda)",
        "altNames": ["Jiyaguda Vishnu Temple", "Old Ranganatha Devalayam"],
        "lat": 17.3695458,
        "lng": 78.451276,
        "era": "earlier",
        "yearBuilt": "c. 1400",
        "type": "temple",
        "status": "state-protected",
        "access": "open",
        "area": "Jiyaguda",
        "summary": "A 400-year-old riverside temple dedicated to Lord Ranganatha on the south bank of the Musi River, known for traditional Vaikunta Ekadasi boat festivals.",
        "story": "Built before the founding of Hyderabad city, this Vaishnavite riverside temple complex features classic granite prakaram enclosures, an ornate gopuram, and bathing steps on the river Musi. It has maintained unbroken worship traditions for over four centuries.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Historic centuries old temple dedicated to Lord Vishnu",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "sitarambagh-mandir",
        "name": "Sitarambagh Temple Complex",
        "altNames": ["Seetharambagh Temple", "Seth Puranmal Temple"],
        "lat": 17.3843203,
        "lng": 78.4569375,
        "era": "asaf-jahi",
        "yearBuilt": "1832",
        "type": "temple",
        "status": "intach-listed",
        "access": "open",
        "area": "Mangalhat",
        "summary": "A massive 25-acre fortified temple complex constructed in 1832 blending Rajasthani, European, and Qutb Shahi architectural traditions.",
        "story": "Commissioned in 1832 by Seth Puranmal Ganeriwal, a wealthy banker to the Nizam, this sprawling complex looks like a fortress from outside, protected by 20-foot-high granite bastion walls. Inside, it houses ornate marble and stone shrines, European-style colonnades, stepwells, and residential quarters.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Historic temple dedicated to Lord Vishnu",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"},
            {"label": "INTACH Hyderabad Heritage Award Citation", "url": "https://intach.org"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "malakpet-shiva-statue-pillar",
        "name": "Malakpet 17th-Century Hero Stone & Pillar",
        "altNames": ["Malakpet Hero Stone", "Shiva Pillar Old Malakpet"],
        "lat": 17.3820098,
        "lng": 78.5009344,
        "era": "qutb-shahi",
        "yearBuilt": "c. 1660",
        "type": "civic",
        "status": "unprotected",
        "access": "open",
        "area": "Old Malakpet",
        "summary": "A 17th-century inscribed warrior hero stone (Veeragallu) and sculpted Shiva pillar standing quietly in Old Malakpet.",
        "story": "This historic stone pillar and hero stone marks the burial and memorial site of a 17th-century warrior who fell defending the eastern trade gates of Hyderabad during late Qutb Shahi military skirmishes.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "17th century hero stone and burial site",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "bn-reddy-hills-rock-sculpture",
        "name": "BN Reddy Hills Prehistoric Lithic Site",
        "altNames": ["Rai Durg Lithic Site", "Prashasan Nagar Rock Art"],
        "lat": 17.4242116,
        "lng": 78.3954341,
        "era": "earlier",
        "yearBuilt": "c. 2500 BCE",
        "type": "civic",
        "status": "at-risk",
        "access": "open",
        "area": "Rai Durg",
        "summary": "Natural granite rock formations where archaeologists documented prehistoric stone-tool manufacturing sites and cupules.",
        "story": "Archaeological surveys in the granite ridges of Rai Durg and BN Reddy Hills identified microlithic tools, polished stone axes, and cup-mark carvings indicating an active Neolithic settlement over 4,500 years ago.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Site where ancient rock tools were found",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "hill-fort-palace",
        "name": "Hill Fort Palace (Ritz Hotel)",
        "altNames": ["Nizamat Manzil", "Ritz Hotel Hyderabad"],
        "lat": 17.4032738,
        "lng": 78.4740694,
        "era": "asaf-jahi",
        "yearBuilt": "1915",
        "type": "palace",
        "status": "intach-listed",
        "access": "restricted",
        "area": "Adarsh Nagar",
        "summary": "A 1915 Tudor-style castle built by Chief Justice Sir Nizamat Jung, later official residence of Prince Moazzam Jah and home to the Ritz Hotel.",
        "story": "Perched on the crest of Naubat Pahad, this majestic palace was designed by Sir Nizamat Jung in the style of an English country manor. In 1929 it was acquired by the Nizam and assigned to his younger son Prince Moazzam Jah. In 1955 it became the legendary Ritz Hotel, hosting international dignitaries before falling vacant in the late 1990s.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "ACCESS RESTRICTED. Grand Asaf Jahi castle on the hill",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"},
            {"label": "INTACH Hyderabad Heritage Gazette", "url": "https://intach.org"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "nanakramguda-ranganathaswamy-temple",
        "name": "Sri Ranganathaswamy Temple (Nanakramguda)",
        "altNames": ["Nanakramguda Vishnu Temple", "Old Temple Nanakramguda"],
        "lat": 17.4229781,
        "lng": 78.3444718,
        "era": "asaf-jahi",
        "yearBuilt": "c. 1820",
        "type": "temple",
        "status": "unprotected",
        "access": "open",
        "area": "Nanakramguda",
        "summary": "A 200-year-old temple complex enclosed within stone perimeter walls, featuring a stepwell, mandapa, and traditional dwajasthambam.",
        "story": "Before the financial district enveloped the village of Nanakramguda, this temple served as the religious heart of the farming community. Enclosed within thick granite boundary walls, it preserves a stone stepwell and traditional carved wooden chariots.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Historic 200 year old temple dedicated to Lord Vishnu",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "wadakpally-watchtower",
        "name": "Wadakpally Asaf Jahi Watchtower",
        "altNames": ["Wadakpally Burz", "Bomana Kunta Watchtower"],
        "lat": 17.5609523,
        "lng": 78.2956445,
        "era": "asaf-jahi",
        "yearBuilt": "c. 1820",
        "type": "fort",
        "status": "unprotected",
        "access": "ruin",
        "area": "Wadakpally",
        "summary": "A cylindrical stone military watchtower (burj) from the Asaf Jahi era erected for frontier observation and courier security.",
        "story": "Erected on an elevated granite mound near Bomana Kunta, this masonry watchtower served as a military observation post and signaling outpost along the western transit route toward Patancheru and Sangareddy under the Nizams.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Watch tower from the Asaf Jahi era for military outposts",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "patancheru-kakatiya-hero-stones",
        "name": "Kakatiya Era Hero Stones (Veeragallulu)",
        "altNames": ["Patancheru Veeragallulu", "14th Century Hero Memorials"],
        "lat": 17.556396,
        "lng": 78.274422,
        "era": "earlier",
        "yearBuilt": "c. 1320",
        "type": "civic",
        "status": "unprotected",
        "access": "open",
        "area": "Patancheru",
        "summary": "14th-century Kakatiya warrior memorial stones (Veeragallulu) depicting heroic battles, celestial ascent, and divine worship in Kailasa.",
        "story": "These three-panel sculpted granite stones commemorate Deccan warriors who defended their settlements against northern sultanate invasions. The bottom panel depicts armed combat; the middle panel shows celestial apsaras carrying the warrior to the heavens; the top panel portrays the warrior worshipping the Shiva linga.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Kakatiya Herostones (Veeragallulu) from the 14th century",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    },
    {
        "id": "rameshwaram-banda",
        "name": "Rameshwaram Banda Temple Ruins & Viewpoint",
        "altNames": ["Rameshwaram Banda Viewpoint", "14th Century Kakatiya Ridge"],
        "lat": 17.5568707,
        "lng": 78.2733835,
        "era": "earlier",
        "yearBuilt": "c. 1350",
        "type": "temple",
        "status": "ruin",
        "access": "open",
        "area": "Patancheru",
        "summary": "A scenic rocky granite ridge preserving ruins of a 14th-century Kakatiya temple and monolithic pillars overlooking the surrounding plains.",
        "story": "Perched on a commanding granite rock outcrop, Rameshwaram Banda preserves foundation courses and sculpted columns of an ancient Kakatiya temple. It offers scenic vistas of the surrounding Deccan scrub and ancient rock formations.",
        "curatedBy": "Karthik Vatsavayi",
        "curationSource": "(Lesser Known) Historic Sites of Hyderabad",
        "curationUrl": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw",
        "curatorNote": "Contains ruins of a 14th century Kakatiya temple",
        "sources": [
            {"label": "Karthik Vatsavayi — (Lesser Known) Historic Sites of Hyderabad", "url": "https://www.google.com/maps/placelists/list/e9usIPiETfqUE9foaxV6Qw"}
        ],
        "addedBy": "karthik-collection",
        "verifiedAt": "2026-09-25",
        "needsReview": False
    }
]

# Check for duplicates before appending
existing_ids = {s["id"] for s in sites}
added_count = 0
for ns in new_sites:
    if ns["id"] not in existing_ids:
        sites.append(ns)
        existing_ids.add(ns["id"])
        added_count += 1

print(f"Enriched existing sites and added {added_count} new sites. Total sites now: {len(sites)}")

with open('data/sites.json', 'w') as f:
    json.dump(sites, f, indent=2)

print("Saved updated data/sites.json successfully.")

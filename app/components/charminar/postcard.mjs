export const POSTCARD_KEY='dhm_postcard_trail_v1';
export const CLUES=[
 {title:'A face that tells the time',hint:'Start by the four towers. Find Imran in the square and look up.',visit:'cricket',x:650,y:1090,detail:'The clock is the first match.',fact:'Charminar’s four clocks were added in 1889, almost three centuries after the monument was built.',next:'On the back, a pencilled ring points to the bangle seller.'},
 {title:'A ring of evening colour',hint:'Follow the shopfronts to Zehra’s bangle counter.',visit:'bangles',x:2320,y:1010,detail:'Zehra recognises the drawing. She turns the card over.',fact:'Charminar was completed in 1591 under Muhammad Quli Qutb Shah. Its arches overlook four major thoroughfares.',next:'“This last sketch is Amina’s fountain. Keep walking towards the quiet end.”'},
 {title:'Where the street grows quiet',hint:'Find Amina near the fountain at the far end of the street.',visit:'grain',x:4340,y:1060,detail:'Amina has the other half of the postcard.',fact:'Charminar’s minarets rise approximately 48.7 metres. Their stacked balconies are part of the landmark’s distinctive silhouette.',next:'“We took it on an ordinary evening,” she says. “Those are the ones you miss.”'},
];
export const FACT_SOURCE='https://hyderabad.telangana.gov.in/tourist-place/charminar/';
export function readTrail(raw){try{const v=JSON.parse(raw);return Number.isInteger(v)&&v>=0&&v<=3?v:0;}catch{return 0;}}
export function canInspect(index,p){const c=CLUES[index];return !!c&&!!p&&Math.hypot(p.x-c.x,p.y-c.y)<100;}

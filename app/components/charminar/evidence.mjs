export const EVIDENCE_KEY='dhm_doorway_evidence_v1';
export const OBJECTS=[
 {id:'scrap',kind:'paper',name:'Postcard scrap on the bench',x:1110,y:1010,stage:0,correct:true,description:'A clock face is drawn above a row of bangles: GREEN · RED · GREEN. A note says: “Ask for this pattern.”',fact:'The four clocks on Charminar were added in 1889.',source:'https://hyderabad.telangana.gov.in/tourist-place/charminar/'},
 {id:'display-sun',kind:'bangles',name:'Red-edged bangle display',x:2090,y:1010,pattern:['red','green','red'],description:'RED · GREEN · RED. The colours are familiar, but the centre and edges are reversed. This is not the pattern on the scrap.'},
 {id:'display-moon',kind:'bangles',name:'Green-edged bangle display',x:2320,y:1010,pattern:['green','red','green'],stage:1,correct:true,description:'GREEN · RED · GREEN. An exact match. The seller unfolds a delivery wrapper stamped with a crescent opening to the right. “That is the mark you want.”'},
 {id:'display-blue',kind:'bangles',name:'Blue-and-gold bangle display',x:2520,y:1010,pattern:['blue','gold','blue'],description:'BLUE · GOLD · BLUE. A pretty set, but neither the colours nor the centre match the drawing.'},
 {id:'sun-mark',kind:'sun',name:'Sun-stamped delivery crate',x:1360,y:500,description:'This stamp has rays all the way around. The wrapper shows an open crescent. A chalk arrow points back towards the repair shops.'},
 {id:'moon-mark',kind:'moon',name:'Crescent-stamped delivery crate',x:2960,y:560,stage:2,correct:true,description:'The crescent opens to the right, just like the wrapper. Inside is the photograph’s missing edge: a pale stone arch, flowers over the entrance, and a fountain on the RIGHT.'},
 {id:'door-sun',kind:'facade',name:'Arch at the end of the chai lane',x:1360,y:420,view:[1295,255,110,165],description:'An arch, but no flowers or fountain. This lane ends here; the courtyard is farther east, beyond the radio shop.'},
 {id:'door-one',kind:'facade',name:'Green-fronted radio shop',x:3840,y:1000,view:[3775,685,115,240],description:'The green frontage faces the main road. There is no fountain beside it. Look for the passage just to the right of this shop.'},
 {id:'door-home',kind:'facade',name:'Flower-covered courtyard entrance',x:4180,y:785,view:[4115,560,100,155],stage:3,correct:true,description:'The pale arch, flowers, and fountain on the right fit the photograph. Amina greets you at the courtyard. “My sister took that photograph before she moved away. We kept a half each.” The picture is whole again.'},
];
export const STAGES=[
 {title:'Find the torn photograph',evidence:'A scrap was left beside the chai bench.',district:'Search the chai frontage.',target:'scrap'},
 {title:'Match the bangle pattern',evidence:'Green on both edges. Red in the centre. Compare all three displays.',district:'Search the bangle market.',target:'display-moon'},
 {title:'Follow the delivery stamp',evidence:'A crescent opening to the right. A sun is a different mark.',district:'Take the narrow lane between the bangle stalls and repair shops.',target:'moon-mark'},
 {title:'Find the photographed doorway',evidence:'Pale stone arch. Flowers above the entrance. Fountain on the right.',district:'Take the passage to the right of the green radio shop.',target:'door-home'},
 {title:'A photograph, made whole',evidence:'You found Amina’s doorway by matching every detail.',district:'The neighbourhood is yours to wander.'},
];
export function restoreEvidence(raw){try{const v=JSON.parse(raw);return{step:Number.isInteger(v?.step)&&v.step>=0&&v.step<=4?v.step:0,seen:Array.isArray(v?.seen)?[...new Set(v.seen.filter(id=>OBJECTS.some(o=>o.id===id)))]:[]};}catch{return{step:0,seen:[]};}}
export function nearestObject(p){return OBJECTS.map(o=>({...o,distance:Math.hypot(o.x-p.x,o.y-p.y)})).filter(o=>o.distance<72).sort((a,b)=>a.distance-b.distance)[0]||null;}
export function inspectEvidence(progress,id,player){const o=OBJECTS.find(o=>o.id===id);if(!o||Math.hypot(player.x-o.x,player.y-o.y)>=80)return{...progress,feedback:'Walk closer to inspect the object.'};const seen=[...new Set([...progress.seen,id])];if(o.correct&&o.stage>progress.step)return{...progress,seen,feedback:'There is a detail here you cannot connect yet. Keep it in the notebook and follow your current evidence.'};return{step:o.correct&&o.stage===progress.step?progress.step+1:progress.step,seen,feedback:o.description};}

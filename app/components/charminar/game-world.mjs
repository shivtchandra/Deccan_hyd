export const WORLD={width:6144,height:1536};
export const SAVE_KEY='dhm_charminar_game_v3';
export const OLD_KEY='dhm_charminar_game_v2';
export const SPEED=40;
export const START={x:270,y:1060};
export const DISTRICTS=[
  {id:'square',name:'Charminar square',x:470,y:1050,from:0,to:850,detail:'An ordinary evening. A whole neighbourhood ahead.'},
  {id:'chai',name:'The chai frontage',x:1130,y:1050,from:850,to:1550,detail:'Bashir keeps a place on the bench.'},
  {id:'bangles',name:'The bangle market',x:2330,y:1050,from:1550,to:3050,detail:'Colour, conversation, and a little room to pass.'},
  {id:'chai-passage',name:'Behind the chai stall',x:1360,y:500,from:-1,to:-1,detail:'A quieter lane behind the kettle.'},
  {id:'repair',name:'The repair alley',x:2960,y:540,from:-1,to:-1,detail:'Follow the parcels between the shop walls.'},
  {id:'delivery',name:'The delivery lane',x:3470,y:1050,from:3050,to:3970,detail:'Everyone here is on their way to someone.'},
  {id:'courtyard',name:'The residential courtyard',x:4180,y:785,from:3970,to:4800,detail:'The street slows down behind the green arch.'},
  {id:'east-plaza',name:'The eastern plaza',x:5400,y:1050,from:4800,to:6144,detail:'Further on — another square, more doors, more neighbours.'},
];
// Foot-space follows the painted paving, including the two upper lanes + eastern extension.
export const WALKABLE=[
  [100,985,6000,985,6000,1120,100,1120],
  [1300,1020,1570,1020,1430,805,1410,650,1370,540,1395,390,1320,390,1300,545,1330,720,1310,855],
  [2870,1020,3150,1020,3040,850,3000,720,3010,535,2970,430,2910,430,2950,570,2900,740,2880,870],
  [3890,1020,4080,1020,4020,850,4050,780,4160,795,4500,840,4500,720,4310,700,4160,700,3990,740,3930,830],
  [4700,1000,6000,1000,6000,1120,4700,1120],
  [5200,1020,5600,1020,5550,880,5500,760,5450,740,5380,760,5300,880,5220,980],
];
export const OBSTACLES=[{x:4350,y:730,r:52},{x:5650,y:900,r:36}];
export const ACTIVITIES={
  chai:{name:'Sit for chai',person:'Bashir',point:[1130,1010],actor:1,duration:7,icon:'☕',title:'A place on the bench',greeting:'There’s room here. I’ll pour you a cup.',returning:'Your usual seat? The kettle’s just boiled.',steps:['Bashir makes room on the bench.','Tea falls in a thin amber stream.','A warm cup, and nowhere else to be.'],note:'Bashir kept the kettle on, and a place beside him.'},
  bangles:{name:'Try a bangle colour',person:'Zehra',point:[2320,1010],actor:2,duration:6,icon:'◎',title:'Colour in the evening light',greeting:'Here. Hold your hand in the light.',returning:'Another colour today? I remember your size.',steps:['Zehra lifts a set from the velvet.','The bangles catch the evening light.','A little colour to carry home.'],note:'Zehra chose the size. I chose the colour.'},
  parcel:{name:'Help with a delivery',person:'Rafi',point:[3270,1040],actor:3,duration:3,icon:'▧',title:'A neighbour’s delivery',greeting:'This one belongs to the radio shop. Just along the lane.',returning:'You know the way now. Thank you again.',steps:['Rafi passes you a paper-wrapped parcel.','The string is tied in a careful knot.','The radio shop is a short walk along the lane.'],note:'Rafi introduced me to his neighbour, one delivery at a time.'},
  radio:{name:'Choose a tune',person:'Salim',point:[3650,1010],actor:6,duration:7,icon:'♫',title:'A song from the doorway',greeting:'Turn the dial. There’s still music in this old thing.',returning:'The radio’s yours for a minute.',steps:['The dial moves through a soft crackle.','A melody settles into the street.','Salim taps his fingers against the counter.'],note:'A little melody followed me down the lane.'},
  cricket:{name:'Return the cricket ball',person:'Imran',point:[650,1090],actor:5,duration:4,icon:'◉',title:'One more over',greeting:'Over here! Could you roll it back?',returning:'Good throw! Stay for another over?',steps:['You stop the ball beside your foot.','It rolls back across the stone.','Imran catches it. The game goes on.'],note:'I returned the ball. They offered me the next turn.'},
  grain:{name:'Scatter a little grain',person:'Farida',point:[4340,1060],actor:11,duration:7,icon:'⌁',title:'Company in the courtyard',greeting:'Just a handful. They’ll come to you.',returning:'They know you now. Hold still a moment.',steps:['Farida offers you a handful of grain.','Pigeons gather around your feet.','The courtyard settles for a moment.'],note:'One by one, the pigeons came closer.'},
};
export function districtAt(x,y=1050){if(y<900){if(x<1700)return DISTRICTS.find(d=>d.id==='chai-passage');if(x<3300)return DISTRICTS.find(d=>d.id==='repair');if(x<4800)return DISTRICTS.find(d=>d.id==='courtyard');return DISTRICTS.find(d=>d.id==='east-plaza');}return DISTRICTS.find(d=>d.from>=0&&x>=d.from&&x<d.to)||DISTRICTS.at(-1);}
export function phaseAt(t){return t<300?'sunset':t<720?'lamplight':'closing';}
export function inside(point,polygon){let c=false;for(let i=0,j=polygon.length-2;i<polygon.length;j=i,i+=2){const xi=polygon[i],yi=polygon[i+1],xj=polygon[j],yj=polygon[j+1];if(((yi>point.y)!==(yj>point.y))&&point.x<(xj-xi)*(point.y-yi)/(yj-yi)+xi)c=!c;}return c;}
export function walkable(p){return Number.isFinite(p.x)&&Number.isFinite(p.y)&&WALKABLE.some(poly=>inside(p,poly))&&!OBSTACLES.some(o=>Math.hypot(p.x-o.x,p.y-o.y)<o.r+9);}
export function blankSave(){return {version:3,player:{...START},elapsed:0,memories:{},parcel:'none',song:'evening'};}
export function restoreGame(raw,oldRaw){
  let input;try{input=JSON.parse(raw||'null');}catch{}
  let old;try{old=JSON.parse(oldRaw||'null');}catch{}
  const s=blankSave();
  const v=(input?.version===3||input?.version===2)?input:old;
  if(!v||typeof v!=='object')return s;
  if((input?.version===3||input?.version===2)&&walkable(v.player||{}))s.player={x:v.player.x,y:v.player.y};
  s.elapsed=Number.isFinite(v.elapsed)?Math.max(0,Math.min(v.elapsed,900)):0;
  if(v.memories&&typeof v.memories==='object')for(const [id,m]of Object.entries(v.memories)){if(ACTIVITIES[id]&&m&&typeof m==='object')s.memories[id]={colour:m.colour==='green'?'green':'red'};}
  if(input?.version===3||input?.version===2){s.parcel=['none','carrying','delivered'].includes(v.parcel)?v.parcel:'none';s.song=v.song==='courtyard'?'courtyard':'evening';}
  return s;
}
export function nearestActivity(p,parcel){
  const candidates=Object.entries(ACTIVITIES).map(([id,a])=>({id,...a,distance:Math.hypot(a.point[0]-p.x,a.point[1]-p.y)})).sort((a,b)=>a.distance-b.distance);
  const a=candidates[0];if(a.distance>90)return null;
  return {...a,name:a.id==='radio'&&parcel==='carrying'?'Hand over Rafi’s parcel':a.name};
}
export function beginAction(state,id,choice){
  if(!ACTIVITIES[id]||state.active)return null;
  const a=ACTIVITIES[id];if(Math.hypot(state.player.x-a.point[0],state.player.y-a.point[1])>95)return null;
  return {id,time:0,phase:0,choice:choice==='green'||choice==='courtyard'?choice:'red',delivery:id==='radio'&&state.parcel==='carrying'};
}
export function tickAction(state,dt){
  const a=state.active;if(!a)return null;
  a.time+=Math.max(0,dt);a.phase=Math.min(2,Math.floor(a.time/ACTIVITIES[a.id].duration*3));
  if(a.time<ACTIVITIES[a.id].duration)return null;
  if(a.id==='parcel')state.parcel=state.parcel==='delivered'?'delivered':'carrying';
  else if(a.delivery){state.parcel='delivered';state.memories.parcel={colour:'red'};}
  else{state.memories[a.id]={colour:a.choice==='green'?'green':'red'};if(a.id==='radio')state.song=a.choice==='courtyard'?'courtyard':'evening';}
  state.active=null;return a;
}
export function serialise(state){return JSON.stringify({version:3,player:{x:state.player.x,y:state.player.y},elapsed:state.elapsed,memories:state.memories,parcel:state.parcel,song:state.song});}

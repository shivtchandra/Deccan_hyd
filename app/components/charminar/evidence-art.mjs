import {OBJECTS} from './evidence.mjs';
export function drawEvidence(Graphics,layer){
 const result=[];const colours={red:0xa84244,green:0x39705b,blue:0x477593,gold:0xbb9349};
 for(const o of OBJECTS){const g=new Graphics();g.position.set(o.x,o.y);g.zIndex=o.y;
  const mark=(symbol,x,y)=>{if(symbol==='moon'){g.circle(x,y,8).fill(0xe1c37b).circle(x+4,y-3,7).fill(0x405b4c);}else{g.circle(x,y,5).fill(0xe1c37b);for(let i=0;i<8;i++)g.moveTo(x+Math.cos(i*Math.PI/4)*8,y+Math.sin(i*Math.PI/4)*8).lineTo(x+Math.cos(i*Math.PI/4)*11,y+Math.sin(i*Math.PI/4)*11).stroke({color:0xe1c37b,width:2});}};
  if(o.kind==='paper'){g.roundRect(-32,-14,64,12,2).fill(0x825c3d).moveTo(-25,-3).lineTo(-25,6).moveTo(25,-3).lineTo(25,6).stroke({color:0x493928,width:3});g.poly([-14,-31,17,-27,14,-9,-16,-12]).fill(0xf6e4b9).stroke({color:0x8c714d,width:1}).circle(-3,-21,6).stroke({color:0x6f6550,width:1}).moveTo(-3,-26).lineTo(-3,-21).lineTo(1,-19).stroke({color:0x6f6550,width:1});}
  if(o.kind==='bangles'){g.roundRect(-34,-25,68,25,2).fill(0x664147).stroke({color:0xbe9a60,width:2});o.pattern.forEach((c,i)=>g.ellipse(-21+i*21,-15,8,11).stroke({color:colours[c],width:4}));}
  if(o.kind==='moon'||o.kind==='sun'){g.rect(-22,-40,44,40).fill(0x405b4c).stroke({color:0x987952,width:3});mark(o.kind,0,-23);}
  // Facades already belong to the illustration. Never draw replacement doors.
  layer.addChild(g);const halo=new Graphics();if(o.view)halo.roundRect(...o.view,8).stroke({color:0xffe5a0,width:2});else halo.ellipse(o.x,o.y+4,38,12).stroke({color:0xffe5a0,width:2});halo.zIndex=o.y+1;halo.visible=false;layer.addChild(halo);result.push({object:o,graphic:g,halo});
 }
 return result;
}

import {nearestWalkable,findPath,stepToward} from './navigation.mjs';
import {FIND} from './find-one.mjs';

/** Dense crowd with varied pace and softer steering. */
export function crowdPlan(){
 const residents=[];
 const avoid = [FIND.point];
 for(let i=0;i<220;i++){
  let p,target;
  if(i<160){
    const group=Math.floor(i/5),j=i%5;
    p={x:160+group*175+j*22+(group%4)*9,y:995+((i*41)%115)};
    target={x:Math.min(5950,p.x+160+(i%7)*12),y:995+((i*59)%110)};
  } else if(i<190){
    const j=(i-160)%15,repair=i>=175;
    p={x:repair?2960:1360,y:420+j*42};
    target={x:repair?3020:1460,y:1015};
  } else if(i<205){
    const j=i-190;
    p={x:4025+j*38,y:800+(j%3)*10};
    target={x:4100+((j+2)%8)*45,y:790+(j%3)*12};
  } else {
    const j=i-205;
    p={x:5000+j*55,y:1005+(j%4)*18};
    target={x:5200+((j+3)%10)*50,y:1000+(j%3)*14};
  }
  p=nearestWalkable(p);target=nearestWalkable(target);
  if(avoid.some(o=>Math.hypot(o.x-p.x,o.y-p.y)<55))p=nearestWalkable({x:p.x+70,y:p.y+28});
  let look=1+i%11;if(look===FIND.look)look=look===11?1:look+1;
  const role=i%6===0?'talk':'walk';
  const pace=0.72+(i%7)*0.06;
  const outward=findPath(p,target),inward=findPath(target,p);
  residents.push({
    id:`resident-${i}`,look,x:p.x,y:p.y,role,wait:i%5*0.15,
    pace,route:outward.map(q=>({...q})),outward,inward,returning:false,
  });
 }
 return residents;
}

export function walkResident(a,dt,neighbors){
 if(a.role!=='walk'||!a.route?.length)return 0;
 if(a.wait>0){a.wait-=dt;return 0;}

 const target=a.route[0];
 const dx=target.x-a.x,dy=target.y-a.y;
 const dist=Math.hypot(dx,dy)||1;

 // Soft separation: slow / slide instead of hard freezes
 let pushX=0,pushY=0,blocked=false;
 for(const b of neighbors){
  if(b===a)continue;
  const ox=a.x-b.x,oy=a.y-b.y;
  const d=Math.hypot(ox,oy);
  if(d<18&&d>0.01){
   const w=(18-d)/18;
   pushX+=ox/d*w;pushY+=oy/d*w;
   if((b.x-a.x)*dx+(b.y-a.y)*dy>0&&b.id<a.id&&d<14)blocked=true;
  }
 }
 if(blocked){
  // Sidestep gently rather than stop cold
  const sideX=-dy/dist,sideY=dx/dist;
  const n=stepToward(a,{x:a.x+sideX*10+pushX*6,y:a.y+sideY*10+pushY*6},dt*18);
  if(n)a.facing=Math.sign(sideX)||a.facing;
  return n;
 }

 const speed=22*(a.pace||1);
 const aim={x:target.x+pushX*8,y:target.y+pushY*8};
 const beforeX=a.x;
 const n=stepToward(a,aim,dt*speed);
 if(n){
  // Face only after real lateral movement — avoids twitch
  if(Math.abs(a.x-beforeX)>0.08)a.facing=a.x<beforeX?-1:1;
 }
 if(Math.hypot(a.x-target.x,a.y-target.y)<3)a.route.shift();
 if(!a.route.length){
  a.returning=!a.returning;
  a.route=(a.returning?a.inward:a.outward).map(p=>({...p}));
  a.wait=0.6+(a.pace||1)*0.4;
 }
 return n;
}

import {WORLD,walkable} from './game-world.mjs';
const CELL=24,COLS=Math.ceil(WORLD.width/CELL),ROWS=Math.ceil(WORLD.height/CELL);
const nodes=new Map();
for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const p={x:x*CELL+CELL/2,y:y*CELL+CELL/2};if(walkable(p))nodes.set(y*COLS+x,p);}
export function nearestWalkable(p){let best=null,d=Infinity;for(const [key,n]of nodes){const dd=(p.x-n.x)**2+(p.y-n.y)**2;if(dd<d){d=dd;best={...n,key};}}return best;}
export function clearLine(a,b){const length=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(1,Math.ceil(length/6));for(let i=0;i<=n;i++)if(!walkable({x:a.x+(b.x-a.x)*i/n,y:a.y+(b.y-a.y)*i/n}))return false;return true;}
export function findPath(from,to){
  const start=nearestWalkable(from),end=nearestWalkable(to);if(!start||!end)return [];
  const target=walkable(to)?to:end;
  if(clearLine(from,target))return [target];
  const open=new Set([start.key]),g=new Map([[start.key,0]]),parents=new Map();
  const heuristic=k=>Math.hypot(nodes.get(k).x-end.x,nodes.get(k).y-end.y);
  while(open.size){let current,score=Infinity;for(const k of open){const f=g.get(k)+heuristic(k);if(f<score){score=f;current=k;}}
    if(current===end.key){const raw=[target];let k=current;while(k!==undefined){raw.unshift(nodes.get(k));k=parents.get(k);}raw.unshift(from);const path=[];let i=0;while(i<raw.length-1){let j=raw.length-1;while(j>i+1&&!clearLine(raw[i],raw[j]))j--;path.push(raw[j]);i=j;}return path;}
    open.delete(current);const a=nodes.get(current);
    for(const dx of [-1,0,1])for(const dy of [-1,0,1]){if(!dx&&!dy)continue;const k=current+dx+dy*COLS,b=nodes.get(k);if(!b||!clearLine(a,b))continue;const cost=g.get(current)+Math.hypot(b.x-a.x,b.y-a.y);if(cost<(g.get(k)??Infinity)){parents.set(k,current);g.set(k,cost);open.add(k);}}
  }
  return [];
}
export function stepToward(p,target,distance){const dx=target.x-p.x,dy=target.y-p.y,d=Math.hypot(dx,dy);if(d<.01)return 0;const n=Math.min(distance,d),next={x:p.x+dx/d*n,y:p.y+dy/d*n};if(!clearLine(p,next))return 0;p.x=next.x;p.y=next.y;return n;}
export function directMove(p,dx,dy,distance){const length=Math.hypot(dx,dy);if(!length)return 0;const start={...p},x=dx/length*distance,y=dy/length*distance;stepToward(p,{x:p.x+x,y:p.y+y},distance);if(p.x===start.x&&p.y===start.y){stepToward(p,{x:p.x+x,y:p.y},Math.abs(x));stepToward(p,{x:p.x,y:p.y+y},Math.abs(y));}return Math.hypot(p.x-start.x,p.y-start.y);}

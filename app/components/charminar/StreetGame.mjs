import {WORLD,SPEED,ACTIVITIES,DISTRICTS,nearestActivity,beginAction,tickAction,phaseAt,districtAt} from './game-world.mjs';
import {FIND} from './find-one.mjs';
import {crowdPlan,walkResident} from './street-crowd.mjs';
import {walkPose,deformWalk} from './walk-pose.mjs';
import {findPath,stepToward,directMove,nearestWalkable} from './navigation.mjs';

export async function createStreetGame(host,state,onState,onInteract,onCue){
  const {Application,Assets,Container,Sprite,MeshPlane,Texture,Rectangle,Graphics}=await import('pixi.js');
  const app=new Application();await app.init({resizeTo:host,background:'#bda177',antialias:true,resolution:Math.min(devicePixelRatio,1.5),autoDensity:true});
  let art,east,cast;try{[art,east,cast]=await Promise.all([Assets.load('/charminar/game-street.png'),Assets.load('/charminar/game-street-east.png'),Assets.load('/charminar/game-residents.png')]);}catch(e){app.destroy(true,{children:true});throw e;}
  host.appendChild(app.canvas);app.canvas.setAttribute('aria-hidden','true');
  const world=new Container();app.stage.addChild(world);
  const sections=[];
  for(let i=0;i<3;i++){const sprite=new Sprite(new Texture({source:art.source,frame:new Rectangle(i*art.width/3,0,art.width/3,art.height)}));sprite.position.set(i*1536,65);sprite.width=1536;sprite.height=1536;world.addChild(sprite);sections.push(sprite);}
  const eastSprite=new Sprite(east);eastSprite.position.set(4608,65);eastSprite.width=1536;eastSprite.height=1536;world.addChild(eastSprite);sections.push(eastSprite);
  const people=new Container();people.sortableChildren=true;world.addChild(people);
  const frames=Array.from({length:12},(_,i)=>new Texture({source:cast.source,frame:new Rectangle(i%4*cast.width/4,Math.floor(i/4)*cast.height/3,cast.width/4,cast.height/3)}));
  function actor(id,look,x,y){const root=new Container();const shadow=new Graphics().ellipse(0,0,11,4).fill({color:0x483f31,alpha:.23});const frame=frames[look],sprite=new MeshPlane({texture:frame,verticesX:12,verticesY:18});sprite.pivot.set(frame.width*.5,frame.height*.96);sprite.scale.set(52/frame.width,70/frame.height);sprite.walkRest=new Float32Array(sprite.geometry.getBuffer('aPosition').data);root.addChild(shadow,sprite);people.addChild(root);return{id,root,sprite,x,y,stride:0,facing:1,facingEase:1,base:sprite.scale.x,home:x,wait:0,target:null,pace:1,movedSmooth:0};}
  const player=actor('player',0,state.player.x,state.player.y);const ring=new Graphics().ellipse(0,0,15,6).stroke({color:0xffe5a0,width:2});player.root.addChildAt(ring,0);
  const residents=[];for(const [id,a]of Object.entries(ACTIVITIES))residents.push(actor(id,a.actor,a.point[0],a.point[1]-28));
  for(const plan of crowdPlan())residents.push(Object.assign(actor(plan.id,plan.look,plan.x,plan.y),plan));
  const spot=nearestWalkable(FIND.point);
  const neighbour=Object.assign(actor(FIND.personId,FIND.look,spot.x,spot.y),{role:'wait',route:[],outward:[],inward:[]});
  residents.push(neighbour);
  const halo=new Graphics().circle(0,-22,18).stroke({color:0xffe5a0,width:2,alpha:.9});halo.visible=false;neighbour.root.addChild(halo);
  let highlighted=null;
  const effects=new Graphics();effects.zIndex=1300;people.addChild(effects);
  const night=new Graphics().rect(0,0,WORLD.width,WORLD.height).fill(0x263d54);world.addChild(night);
  let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,follow=true,paused=false,route=[],destination='',pending=null,elapsedReport=0,saveTick=0,phase=-1,low=0,cap=90;
  let camera={x:0,y:0,scale:host.clientWidth<600?.78:.92},keys=new Set(),pointers=new Map(),drag=null,pinch=0,disposed=false;
  function view(){return{w:host.clientWidth,h:host.clientHeight};}function playerOnScreen(){const sx=player.x*camera.scale+camera.x,sy=player.y*camera.scale+camera.y;return sx>-60&&sx<host.clientWidth+60&&sy>-60&&sy<host.clientHeight+60;}
  function clamp(){const {w,h}=view();camera.scale=Math.max(h/WORLD.height,.65,Math.min(1.8,camera.scale));camera.x=Math.min(0,Math.max(w-WORLD.width*camera.scale,camera.x));camera.y=Math.min(0,Math.max(h-WORLD.height*camera.scale,camera.y));}
  function applyCamera(){clamp();world.position.set(camera.x,camera.y);world.scale.set(camera.scale);}
  function centre(instant=false,dt=1/60){const {w,h}=view(),tx=w*.5-player.x*camera.scale,ty=h*.61-player.y*camera.scale;if(instant||reduced){camera.x=tx;camera.y=ty;}else{const k=1-Math.exp(-10*Math.max(dt,1/120));camera.x+=(tx-camera.x)*k;camera.y+=(ty-camera.y)*k;}applyCamera();}
  function nearestPerson(q,radius=48){return residents.filter(a=>a.id!=='player').map(a=>({a,d:Math.hypot(a.x-q.x,a.y-(q.y+20))})).filter(x=>x.d<radius).sort((u,v)=>u.d-v.d)[0]?.a||null;}
  function report(){const near=nearestActivity(player,state.parcel);onState({player:{x:player.x,y:player.y},near,busy:!!state.active,destination,follow,district:districtAt(player.x,player.y),phase:phaseAt(state.elapsed),memories:{...state.memories},parcel:state.parcel,caption:state.active?(state.active.delivery?'Salim takes the parcel and nods towards Rafi\'s shop.':ACTIVITIES[state.active.id].steps[state.active.phase]):'',residents:residents.length});host.dataset.player=JSON.stringify({x:Math.round(player.x),y:Math.round(player.y)});host.dataset.activity=state.active?.id||'idle';host.dataset.residents=String(residents.length);}
  function go(point,label='',id=null){if(state.active)return;const path=findPath(player,point);if(!path.length)return;route=path;destination=label;pending=id;follow=playerOnScreen();keys.clear();try{host.focus({preventScroll:true});}catch{host.focus();}report();}
  function interact(id,choice){if(!id)id=nearestActivity(player,state.parcel)?.id;if(!id)return;state.player={x:player.x,y:player.y};const a=beginAction(state,id,choice);if(a){route=[];pending=null;destination='';state.active=a;phase=-1;report();}}
  function attempt(id){const a=ACTIVITIES[id];if(!a)return;if(Math.hypot(player.x-a.point[0],player.y-a.point[1])>90)go({x:a.point[0],y:a.point[1]},a.person,id);else onInteract(id);}
  function local(e){const r=host.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
  function down(e){if(paused)return;host.focus();const p=local(e);pointers.set(e.pointerId,p);host.setPointerCapture(e.pointerId);drag={...p,cx:camera.x,cy:camera.y,moved:false};if(pointers.size===2){const [a,b]=[...pointers.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);} }
  function move(e){if(!pointers.has(e.pointerId))return;const p=local(e);pointers.set(e.pointerId,p);if(pointers.size===2){const[a,b]=[...pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);zoom(d/pinch);pinch=d;drag.moved=true;}else if(drag&&Math.hypot(p.x-drag.x,p.y-drag.y)>6){drag.moved=true;follow=false;camera.x=drag.cx+p.x-drag.x;camera.y=drag.cy+p.y-drag.y;applyCamera();}}
  function up(e){const p=local(e);pointers.delete(e.pointerId);if(!pointers.size&&drag&&!drag.moved&&!paused&&(e.target===host||e.target===app.canvas)){const q={x:(p.x-camera.x)/camera.scale,y:(p.y-camera.y)/camera.scale};const person=nearestPerson(q,52);if(person){if(Math.hypot(player.x-person.x,player.y-person.y)<95)onInteract('person:'+person.id);else go({x:person.x,y:person.y+8},person.id===FIND.personId?FIND.name:'a neighbour','person:'+person.id);drag=null;return;}const a=Object.entries(ACTIVITIES).find(([,a])=>Math.hypot(q.x-a.point[0],q.y-(a.point[1]-35))<45);if(a)attempt(a[0]);else go(q);}drag=null;pinch=0;report();}
  function cancel(){pointers.clear();drag=null;pinch=0;keys.clear();}
  function zoom(f,screen){const p=screen||{x:host.clientWidth*.5,y:host.clientHeight*.5};const prev=camera.scale;camera.scale*=f;clamp();const ratio=camera.scale/Math.max(prev,1e-6);camera.x=p.x-(p.x-camera.x)*ratio;camera.y=p.y-(p.y-camera.y)*ratio;if(follow){camera.x=host.clientWidth*.5-player.x*camera.scale;camera.y=host.clientHeight*.61-player.y*camera.scale;}applyCamera();}
  function wheel(e){e.preventDefault();const r=host.getBoundingClientRect();zoom(Math.exp(-e.deltaY*.001),{x:e.clientX-r.left,y:e.clientY-r.top});}
  function keydown(e){if(paused)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'].includes(e.key)){e.preventDefault();keys.add(e.key.toLowerCase());route=[];pending=null;destination='';follow=true;}else if(['e','E','Enter'].includes(e.key)){e.preventDefault();if(!e.repeat){const person=nearestPerson({x:player.x,y:player.y-20},70);if(person)onInteract('person:'+person.id);else{const a=nearestActivity(player,state.parcel);if(a)onInteract(a.id);}}}}
  function keyup(e){keys.delete(e.key.toLowerCase());}
  const events=[['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',cancel],['wheel',wheel],['keydown',keydown],['keyup',keyup],['blur',cancel]];for(const[e,f]of events)host.addEventListener(e,f,{passive:false});
  function visibility(){cancel();document.hidden?app.stop():app.start();}document.addEventListener('visibilitychange',visibility);
  const mq=matchMedia('(prefers-reduced-motion: reduce)'),change=()=>{reduced=mq.matches;};mq.addEventListener('change',change);
  let lastWH=host.clientWidth+','+host.clientHeight;const resize=new ResizeObserver(()=>{const key=host.clientWidth+','+host.clientHeight;if(key===lastWH)return;lastWH=key;if(follow)centre(true);else applyCamera();});resize.observe(host);centre(true);
  function animate(a,moved,dt=1/60,near=true){a.movedSmooth+=(moved-a.movedSmooth)*Math.min(1,14*dt);const walking=a.movedSmooth>0.12;if(walking)a.stride+=moved;a.root.position.set(a.x,a.y);a.root.zIndex=Math.round(a.y);const want=a.facing||1;a.facingEase+=(want-a.facingEase)*Math.min(1,10*dt);const face=Math.abs(a.facingEase)<0.12?want:(Math.sign(a.facingEase)||want);a.sprite.scale.x=a.base*face;const pose=walkPose(a.stride,walking,reduced,a.pace||1);const buffer=a.sprite.geometry.getBuffer('aPosition');if(near||a.id==='player'||a.id===FIND.personId){deformWalk(buffer.data,a.sprite.walkRest,a.sprite.texture.width,a.sprite.texture.height,pose);buffer.update();}else if(!walking){buffer.data.set(a.sprite.walkRest);buffer.update();}else{const rest=a.sprite.walkRest,data=buffer.data,bob=pose.bob*(a.sprite.texture.height/70);for(let i=0;i<rest.length;i+=2){data[i]=rest[i];data[i+1]=rest[i+1]-bob;}buffer.update();}}
  app.ticker.maxFPS=60;app.ticker.add(t=>{
    const dt=Math.min(t.deltaMS/1000,.05);if(paused)return;state.elapsed=Math.min(900,state.elapsed+dt);
    let moved=0;const oldX=player.x;
    if(!state.active){const dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);
      if(dx||dy)moved=directMove(player,dx,dy,SPEED*dt);else if(route.length){moved=stepToward(player,route[0],SPEED*dt);if(Math.hypot(player.x-route[0].x,player.y-route[0].y)<2.5)route.shift();if(!route.length){destination='';if(pending){const id=pending;pending=null;onInteract(id);}}}}
    if(moved>0.05&&Math.abs(player.x-oldX)>0.12)player.facing=player.x<oldX?-1:1;animate(player,moved,dt,true);state.player={x:player.x,y:player.y};
    let visible=0;for(let i=0;i<residents.length;i++){const a=residents[i],sx=a.x*camera.scale+camera.x,sy=a.y*camera.scale+camera.y,on=sx>-100&&sx<host.clientWidth+100&&sy>-100&&sy<host.clientHeight+100;a.root.visible=on&&(i<6||a.id===FIND.personId||visible<cap);if(on)visible++;let n=0;
      if(on&&!reduced&&a.role==='walk')n=walkResident(a,dt,residents);const near=Math.abs(sx-host.clientWidth*0.5)<host.clientWidth*0.55;animate(a,n,dt,near);}
    halo.visible=highlighted===FIND.personId||Math.hypot(neighbour.x-player.x,neighbour.y-player.y)<80;
    const current=state.active;if(current&&current.phase!==phase){phase=current.phase;onCue(current.id,current.phase);}
    const completed=tickAction(state,dt);if(completed)report();
    effects.clear();if(route.length)effects.ellipse(route.at(-1).x,route.at(-1).y,10,4).stroke({color:0xffe4a7,width:1.5});
    if(state.parcel==='carrying')effects.roundRect(player.x-8,player.y-37,16,12,1).fill(0xbe8b52).stroke({color:0x6c4c32,width:1});
    const a=state.active;if(a){const p=ACTIVITIES[a.id].point;
      if(a.id==='chai'){effects.ellipse(p[0]+12,p[1]-28,8,3).fill(0xeedfc1).roundRect(p[0]+6,p[1]-38,12,9,2).fill(0xf7edcd);if(a.phase===1)effects.moveTo(p[0]-12,p[1]-55).lineTo(p[0]+10,p[1]-38).stroke({color:0xa87338,width:2});}
      if(a.id==='bangles')for(let j=0;j<4;j++)effects.ellipse(p[0]+8+j*3,p[1]-40,4,7).stroke({color:a.choice==='green'?0x498872:0xbb515b,width:2});
      if(a.id==='cricket'){const k=a.time/ACTIVITIES[a.id].duration;effects.circle(p[0]+60*(1-k),p[1]-5,4).fill(0xb53c2d);}
      if(a.id==='radio')effects.moveTo(p[0]+10,p[1]-45).lineTo(p[0]+10,p[1]-65).lineTo(p[0]+23,p[1]-69).lineTo(p[0]+23,p[1]-50).stroke({color:0xe5c67b,width:2});
    }
    night.alpha=phaseAt(state.elapsed)==='sunset'?0:phaseAt(state.elapsed)==='lamplight'?.08:.15;
    if(!follow&&route.length&&playerOnScreen())follow=true;if(follow)centre(false,dt);elapsedReport+=dt;saveTick+=dt;if(elapsedReport>.2){elapsedReport=0;report();}
    if(t.FPS<28)low+=dt;else low=Math.max(0,low-dt);if(low>4){cap=55;low=0;}
    if(saveTick>2){host.dataset.fps=String(Math.round(t.FPS));host.dataset.visibleResidents=String(visible);host.dataset.camera=JSON.stringify({x:Math.round(camera.x),y:Math.round(camera.y),s:+camera.scale.toFixed(3),f:follow?1:0});saveTick=0;}
  });report();
  return{highlight(id){highlighted=id;},go(id){const d=DISTRICTS.find(d=>d.id===id);if(d)go(d,d.name);},visit:attempt,interact,zoom,back(){follow=true;centre();report();},pause(v){paused=v;cancel();},destroy(){if(disposed)return;disposed=true;resize.disconnect();mq.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility);for(const[e,f]of events)host.removeEventListener(e,f);app.destroy(true,{children:true});}};
}

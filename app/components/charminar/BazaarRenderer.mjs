import { PLACES, SIZE, MOMENTS, cameraFor, constrainCamera, startMoment, advanceMoment, eveningPhase, moveAlong } from './living-world.mjs';

// All coordinates are foot anchors in the same illustrated world, including props.
export async function createBazaar(host, overlay, options) {
  const { Application, Assets, Container, Sprite, Texture, Rectangle, Graphics } = await import('pixi.js');
  const app = new Application();
  await app.init({ resizeTo: host, background: '#c8a478', antialias: true, resolution: Math.min(devicePixelRatio || 1, 1.5), autoDensity: true, preference: 'webgl' });
  const world = new Container();
  app.stage.addChild(world);
  let textures;
  try { textures = await Promise.all([Assets.load('/charminar/neighbourhood-1985.png'), Assets.load('/charminar/residents-1985.png'), Assets.load('/charminar/gestures-1985.png'), Assets.load('/charminar/period-props-1985.png')]); }
  catch (error) { app.destroy(true, { children: true }); throw error; }
  const [background, people, gestures, props] = textures;
  host.appendChild(app.canvas);
  app.canvas.setAttribute('aria-hidden', 'true');
  const base = new Sprite(background); base.width = SIZE.width; base.height = SIZE.height; world.addChild(base);
  const actors = new Container(); actors.sortableChildren = true; world.addChild(actors);
  const frames = Array.from({length: 8}, (_,i) => new Texture({ source: people.source, frame: new Rectangle((i%4)*people.width/4, Math.floor(i/4)*people.height/2, people.width/4, people.height/2) }));
  const poses = Array.from({length:4},(_,i)=>new Texture({source:gestures.source,frame:new Rectangle((i%2)*gestures.width/2,Math.floor(i/2)*gestures.height/2,gestures.width/2,gestures.height/2)}));
  const ink = 0x604536;
  const rickshaw=new Sprite(new Texture({source:props.source,frame:new Rectangle(0,0,850,1024)}));rickshaw.anchor.set(.5,.88);rickshaw.scale.set(.085);rickshaw.position.set(440,590);rickshaw.zIndex=590;actors.addChild(rickshaw);
  const radio=new Sprite(new Texture({source:props.source,frame:new Rectangle(890,270,630,640)}));radio.anchor.set(.5,1);radio.scale.set(.021);radio.position.set(288,770);radio.zIndex=800;actors.addChild(radio);
  const members = [];
  function person(id, x, y, row, path, tint = 0xffffff) {
    const root = new Container(), shadow = new Graphics().ellipse(1,0,8,3).fill({color:0x503f36,alpha:.22});
    const sprite = new Sprite(frames[row*4]); sprite.anchor.set(.5,.9); sprite.scale.set(.145); sprite.tint=tint;
    root.addChild(shadow,sprite); root.position.set(x,y); actors.addChild(root);
    const member = { id, root, sprite, row, x, y, path, next:0, wait:1+members.length*.7, stride:0, facing:1 };
    members.push(member); return member;
  }
  const bashir=person('bashir',297,759,0,null);
  const guest=person('guest',267,805,0,null,0xd3c7b2);
  const visitor=person('visitor',332,806,0,null,0xd7dcc5); visitor.root.visible=false;
  const zehra=person('zehra',1026,371,1,null);
  const customer=person('customer',1062,398,1,null,0xd1dabc);
  const amina=person('amina',1250,713,1,null);
  person('shopper',514,633,1,[[514,633],[606,578],[657,598],[562,670]],0xf1debe);
  person('neighbour',600,722,0,[[600,722],[535,672],[477,628],[520,659]],0xc5d0cf);
  person('friend',514,561,0,[[514,561],[553,551],[588,588],[521,614]],0xe7c79d);
  person('browser',1117,338,1,[[1117,338],[1168,286],[1190,249],[1149,307]],0xdfc7b5);
  const runner=person('runner',655,558,0,[[655,558],[765,504],[905,453],[1030,398],[1150,311],[1030,398],[905,453],[765,504]],0xbad0c4);
  const parcel=new Graphics().roundRect(-7,-29,14,11,1).fill(0xb88a58).stroke({color:ink,width:1}).moveTo(0,-29).lineTo(0,-18).stroke({color:0xead7af,width:1}); runner.root.addChild(parcel);
  // A foreground counter occludes the seller below his waist.
  const counter=new Graphics().poly([271,770,321,749,345,761,295,783]).fill(0xb07c42).stroke({color:ink,width:1}).poly([295,783,345,761,345,779,295,801]).fill(0x795639).stroke({color:ink,width:1}); counter.zIndex=780; actors.addChild(counter);
  const bench=new Graphics().poly([257,805,323,777,338,785,273,813]).fill(0x8f6241).stroke({color:ink,width:1}).moveTo(273,813).lineTo(273,824).moveTo(331,789).lineTo(331,802).stroke({color:ink,width:3}); bench.zIndex=803;actors.addChild(bench);
  const tea=new Graphics(); tea.zIndex=802;actors.addChild(tea);
  const bangles=new Graphics(); bangles.zIndex=405;actors.addChild(bangles);
  const grain=new Graphics();grain.zIndex=700;actors.addChild(grain);
  const pigeons=Array.from({length:7},(_,i)=>{
    const bird=new Graphics(); const x=1125+(i%4)*30,y=724+Math.floor(i/4)*24;
    actors.addChild(bird); return {bird,x,y,home:[x,y],seed:i};
  });
  // Restore the painted front wall above actors, rather than letting feet float over it.
  const wall=new Sprite(background);wall.width=1536;wall.height=1024;
  const wallMask=new Graphics().poly([884,666,1077,730,1096,814,1315,897,1308,970,867,798]).fill(0xffffff);
  wall.mask=wallMask;world.addChild(wall,wallMask);
  const night=new Graphics().rect(0,0,1536,1024).fill(0x34394f);night.alpha=0;world.addChild(night);
  const lamps=new Graphics();world.addChild(lamps);
  const shutters=new Graphics();world.addChild(shutters);
  const view=()=>({width:host.clientWidth,height:host.clientHeight});
  let place='square', camera=host.clientWidth<600?cameraFor(PLACES.square.center,view()):constrainCamera({x:0,y:0,scale:Math.max(host.clientWidth/1536,host.clientHeight/1024)},view()), target=null, disposed=false;
  const savedCameras={}; let moment=null, elapsed=options.elapsed||0, reduced=options.reduced, lastPhase='', lastStep=-1;
  let remembered=options.memories||{}, announce=0, framesCount=0, perfTime=0, fps=0;
  const pointers=new Map();let drag=null, pinch=null, dragged=false;
  function syncCamera() {
    camera=constrainCamera(camera,view()); world.position.set(camera.x,camera.y);world.scale.set(camera.scale);
    overlay.style.transform=`translate(${camera.x}px,${camera.y}px) scale(${camera.scale})`;
    host.dataset.camera=JSON.stringify({x:Math.round(camera.x),y:Math.round(camera.y),scale:+camera.scale.toFixed(3)});
  }
  function aim(point) {target=cameraFor(point,view());if(reduced){camera=target;target=null;syncCamera();}}
  function travel(to) {
    if(moment || !PLACES[to])return false;
    savedCameras[place]={...camera};place=to;target=savedCameras[to]||cameraFor(PLACES[to].center,view());
    if(reduced){camera=target;target=null;}options.onPlace(to);return true;
  }
  function action(id,colour) {
    if(moment)return false;
    moment=startMoment(null,id,colour);if(!moment)return false;
    lastStep=-1; aim(PLACES[place].point);options.onBusy(true);return true;
  }
  function zoom(factor,point={x:host.clientWidth/2,y:host.clientHeight/2}) {
    target=null;const next=constrainCamera({...camera,scale:camera.scale*factor},view());const ratio=next.scale/camera.scale;
    camera=constrainCamera({scale:next.scale,x:point.x-(point.x-camera.x)*ratio,y:point.y-(point.y-camera.y)*ratio},view());syncCamera();
  }
  const point=e=>{const r=host.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
  function down(e){if(e.target.closest('button'))return;pointers.set(e.pointerId,point(e));host.setPointerCapture(e.pointerId);target=null;drag={...point(e),cx:camera.x,cy:camera.y};dragged=false;if(pointers.size===2)pinch=Math.hypot(...delta());}
  function delta(){const [a,b]=[...pointers.values()];return[a.x-b.x,a.y-b.y];}
  function move(e){if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,point(e));if(pointers.size===2){const d=Math.hypot(...delta()),[a,b]=[...pointers.values()];if(pinch)zoom(d/pinch,{x:(a.x+b.x)/2,y:(a.y+b.y)/2});pinch=d;dragged=true;}else if(drag){const p=point(e);if(Math.hypot(p.x-drag.x,p.y-drag.y)>5)dragged=true;camera=constrainCamera({...camera,x:drag.cx+p.x-drag.x,y:drag.cy+p.y-drag.y},view());syncCamera();}}
  function up(e){pointers.delete(e.pointerId);pinch=null;if(pointers.size){const p=[...pointers.values()][0];drag={...p,cx:camera.x,cy:camera.y};}else drag=null;}
  function wheel(e){e.preventDefault();zoom(Math.exp(-e.deltaY*.001),point(e));}
  function key(e){if(e.target!==host)return;const dirs={ArrowLeft:[60,0],ArrowRight:[-60,0],ArrowUp:[0,60],ArrowDown:[0,-60]};if(dirs[e.key]){e.preventDefault();target=null;camera.x+=dirs[e.key][0];camera.y+=dirs[e.key][1];syncCamera();}if(['+','=','-'].includes(e.key)){e.preventDefault();zoom(e.key==='-'?.85:1.15);}}
  host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',up);host.addEventListener('wheel',wheel,{passive:false});host.addEventListener('keydown',key);
  let lastView=view();
  const resize=new ResizeObserver(()=>{const next=view();if(next.width!==lastView.width||next.height!==lastView.height){lastView=next;target=null;camera=cameraFor(moment?PLACES[place].point:PLACES[place].center,next);for(const id of Object.keys(savedCameras))delete savedCameras[id];}syncCamera();});resize.observe(host);
  function visibility(){document.hidden?app.stop():app.start();}document.addEventListener('visibilitychange',visibility);
  function drawTea(t){
    tea.clear(); if(!t && !remembered.chai)return;
    const stage=t?.phase??2;visitor.root.visible=true;
    tea.ellipse(322,769,7,3).fill(0xe8d9ae).roundRect(317,760,10,8,2).fill(0xf3e3bd).stroke({color:ink,width:.8}).ellipse(322,760,5,2).fill(0x914b27);
    if(stage===1)tea.moveTo(318,739).lineTo(322,759).stroke({color:0xba7b39,width:1.6});
    if(stage===2){const wobble=reduced?0:Math.sin(elapsed*2)*2;tea.moveTo(320,756).bezierCurveTo(315+wobble,749,327,747,321,739).stroke({color:0xfff0ce,alpha:.7,width:1});}
  }
  function drawBangles(t){
    bangles.clear();const colour=(t?.colour||remembered.bangles?.colour)==='green'?0x427966:0xa23f44;
    for(let i=0;i<6;i++)bangles.ellipse(1020+i*4,377-i*1.5,3,5).stroke({color:i<3?0xa23f44:0x427966,width:2});
    if(t?.phase>=1||remembered.bangles){bangles.moveTo(1057,376).lineTo(1045,373).stroke({color:0xa36a44,width:3});for(let i=0;i<3;i++)bangles.ellipse(1047+i*2,374,2,3).stroke({color:colour,width:1.5});}
  }
  app.ticker.maxFPS=60;
  app.ticker.add(ticker=>{
    const dt=Math.min(ticker.deltaMS/1000,.05);elapsed=Math.min(elapsed+dt,360);
    framesCount++;perfTime+=ticker.deltaMS;
    if(perfTime>2000){fps=Math.round(framesCount*1000/perfTime);host.dataset.fps=String(fps);framesCount=0;perfTime=0;}
    if(target){const k=reduced?1:1-Math.exp(-dt*4);camera={x:camera.x+(target.x-camera.x)*k,y:camera.y+(target.y-camera.y)*k,scale:camera.scale+(target.scale-camera.scale)*k};if(Math.abs(camera.x-target.x)+Math.abs(camera.y-target.y)<.5){camera=target;target=null;}syncCamera();}
    const phase=eveningPhase(elapsed);
    if(moment?.id==='grain')moveAlong(amina,[1160,745],dt,42);else moveAlong(amina,[1250,713],dt,22);
    if(phase!==lastPhase){lastPhase=phase;options.onEvening(phase);}
    night.alpha=phase==='sunset'?0:phase==='lamplight'?.10:.19;
    lamps.clear();if(phase!=='sunset')for(const [x,y] of [[338,719],[406,693],[1012,323],[1101,267],[1259,605]]){lamps.circle(x,y,20).fill({color:0xffcf72,alpha:.06}).circle(x,y,9).fill({color:0xffcf72,alpha:.12}).circle(x,y,2.8).fill(0xffe5a2);}
    shutters.clear();if(phase==='closing')shutters.poly([858,363,875,355,875,407,858,415]).fill({color:0x74654c,alpha:.88});
    for(const a of members){
      let walking=false;
      if(a.path&&!reduced){if(a.wait>0)a.wait-=dt;else{const result=moveAlong(a,a.path[a.next],dt,a===runner?27:17);a.stride+=result.distance;walking=!result.arrived;a.facing=Math.cos(result.direction)<0?-1:1;if(result.arrived){a.next=(a.next+1)%a.path.length;a.wait=a===runner?3:4+a.next;}}}
      const interacting=(a===bashir&&moment?.id==='chai')||(a===zehra&&moment?.id==='bangles');
      a.sprite.texture=frames[a.row*4+(interacting&&moment.phase===1?3:walking?1+Math.floor(a.stride/6)%2:0)];
      a.sprite.scale.set(.11*a.facing,.11);
      if(a===guest||a===visitor){a.sprite.texture=poses[a===visitor&&moment?.id==='chai'&&moment.phase===2?1:0];a.sprite.anchor.set(.60,.90);a.sprite.scale.set(.085);}
      if(a===amina){a.sprite.texture=poses[3];a.sprite.anchor.set(.54,.93);a.sprite.scale.set(.11);}
      a.root.position.set(a.x,a.y);a.root.zIndex=a.y;
      a.root.renderable=a.x*camera.scale+camera.x>-90&&a.x*camera.scale+camera.x<host.clientWidth+90&&a.y*camera.scale+camera.y>-90&&a.y*camera.scale+camera.y<host.clientHeight+90;
    }
    if(moment){moment=advanceMoment(moment,dt*(reduced?2:1));if(moment.phase!==lastStep){lastStep=moment.phase;options.onStep(moment.id,moment.phase,moment.colour);}
      if(moment.id==='chai')guest.x=267-Math.min(1,moment.elapsed/1.5)*17;
    }
    drawTea(moment?.id==='chai'?moment:null);drawBangles(moment?.id==='bangles'?moment:null);
    const feeding=moment?.id==='grain';grain.clear();
    if(feeding)for(let i=0;i<24;i++)grain.circle(1185+Math.sin(i*9)*17,747+Math.cos(i*5)*9,1).fill(0xeacb87);
    for(const p of pigeons){
      const dest=feeding?[1185+Math.cos(p.seed*2)*12,747+Math.sin(p.seed*2)*7]:p.home;
      if(!reduced||feeding)moveAlong(p,dest,dt,feeding?13:7);
      const peck=feeding&&moment.phase>0&&!reduced?Math.sin(elapsed*9+p.seed)*1.6:0;
      p.bird.clear().ellipse(1,2,6,2).fill({color:ink,alpha:.18}).ellipse(0,0,4,3).fill(0x818b91).ellipse(-1,0,3,2).fill(0x647279).circle(3,-3+peck,2).fill(0x53636a).moveTo(4,-3+peck).lineTo(7,-2+peck).stroke({color:0xba955d,width:1});p.bird.position.set(p.x,p.y);p.bird.zIndex=p.y;
    }
    if(moment?.done){const completed=moment;remembered={...remembered,[completed.id]:{colour:completed.colour}};moment=null;options.onComplete(completed,elapsed);options.onBusy(false);}
    announce+=dt;if(announce>5){announce=0;options.onClock(elapsed);}
    host.dataset.action=moment?`${moment.id}:${moment.phase}`:'idle';host.dataset.phase=phase;host.dataset.place=place;
  });
  syncCamera();options.onPlace(place);
  return {
    travel,action,zoom, focus:()=>aim(PLACES[place].point),
    overview(){target=constrainCamera({scale:Math.max(host.clientWidth/1536,host.clientHeight/1024),x:0,y:0},view());},
    setReduced(v){reduced=v;},
    snapshot:()=>({elapsed,place,fps,camera,moment}),
    destroy(){if(disposed)return;disposed=true;resize.disconnect();document.removeEventListener('visibilitychange',visibility);for(const [event,fn] of [['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['wheel',wheel],['keydown',key]])host.removeEventListener(event,fn);app.destroy(true,{children:true});},
  };
}

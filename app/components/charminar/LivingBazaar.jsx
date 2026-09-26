'use client';

import { useEffect, useRef, useState } from 'react';
import { createBazaar } from './BazaarRenderer.mjs';
import { LEGACY_KEY, VISIT_KEY, PLACES, MOMENTS, restoreVisit } from './living-world.mjs';
import { BazaarSound } from './sound.mjs';
import styles from './living.module.css';

const names={square:'Charminar square',lane:'Bangle lane',courtyard:'The courtyard'};
function Mark({kind}){return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{kind==='chai'?<><path d="M9 20h25v12c0 10-25 10-25 0ZM34 22c13-3 13 14 0 11M5 43h34M16 14c-5-5 5-7 0-12m9 12c-5-5 5-7 0-12"/></>:kind==='bangles'?<><ellipse cx="20" cy="25" rx="12" ry="18"/><ellipse cx="29" cy="25" rx="12" ry="18"/></>:<><path d="M7 34c15 3 21-2 25-15 6-8 13-4 9 1l-5 2c-1 16-18 20-29 12ZM15 31l-9-8 17 1m0 13-2 7m8-9 2 8"/><circle cx="37" cy="17" r="1"/></>}</svg>;}

export default function LivingBazaar({onClose}){
  const host=useRef(null),overlay=useRef(null),engine=useRef(null),audio=useRef(null),data=useRef({memories:{},elapsed:0}),busyRef=useRef(false),soundRef=useRef(false),menuButton=useRef(null),panel=useRef(null);
  const [place,setPlace]=useState('square'),[ready,setReady]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false),[menu,setMenu]=useState(null),[sound,setSound]=useState(false),[phase,setPhase]=useState('sunset'),[speech,setSpeech]=useState(null),[memories,setMemories]=useState({}),[legacy,setLegacy]=useState([]),[colour,setColour]=useState('red'),[storageFailed,setStorageFailed]=useState(false);
  function save(){try{localStorage.setItem(VISIT_KEY,JSON.stringify(data.current));}catch{setStorageFailed(true);}}
  useEffect(()=>{
    let cancelled=false,ownEngine;
    const mq=matchMedia('(prefers-reduced-motion: reduce)');
    try{data.current=restoreVisit(localStorage.getItem(VISIT_KEY));const old=JSON.parse(localStorage.getItem(LEGACY_KEY)||'[]');setLegacy(Array.isArray(old)?old.filter(x=>typeof x==='string'):[]);}catch{}
    setMemories(data.current.memories);audio.current=new BazaarSound();
    createBazaar(host.current,overlay.current,{
      ...data.current,reduced:mq.matches,
      onPlace:setPlace,onEvening:setPhase,
      onBusy(v){busyRef.current=v;setBusy(v);},
      onStep(id,step){setSpeech({person:MOMENTS[id].person,text:step===0?(data.current.memories[id]?MOMENTS[id].returning:MOMENTS[id].greeting):MOMENTS[id].steps[step]});if(step===1&&soundRef.current)audio.current?.cue(id==='bangles'?'bangles':'chai');},
      onComplete(moment,elapsed){data.current={elapsed,memories:{...data.current.memories,[moment.id]:{colour:moment.colour}}};setMemories(data.current.memories);save();},
      onClock(elapsed){data.current.elapsed=elapsed;save();},
    }).then(e=>{ownEngine=e;if(cancelled)e.destroy();else{engine.current=e;setReady(true);}}).catch(()=>{if(!cancelled)setError('The neighbourhood could not load. Please reload to try again.');});
    const reduced=()=>engine.current?.setReduced(mq.matches);mq.addEventListener('change',reduced);
    const visibility=()=>{if(document.hidden){audio.current?.pause();save();}else if(soundRef.current)audio.current?.start().catch(()=>{});};
    document.addEventListener('visibilitychange',visibility);
    return()=>{cancelled=true;ownEngine?.destroy();engine.current=null;audio.current?.dispose();mq.removeEventListener('change',reduced);document.removeEventListener('visibilitychange',visibility);};
  },[]);
  useEffect(()=>{if(!speech||busy)return;const timer=setTimeout(()=>setSpeech(null),7000);return()=>clearTimeout(timer);},[speech,busy]);
  useEffect(()=>{if(!menu)return;const previous=document.activeElement;panel.current?.querySelector('button')?.focus();return()=>previous?.isConnected&&previous.focus();},[menu]);
  function closeMenu(){setMenu(null);}
  function keys(e){if(e.key==='Escape'){closeMenu();return;}if(e.key==='Tab'&&menu){const list=panel.current?.querySelectorAll('button,a[href]');if(!list?.length)return;const first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}
  function travel(id){if(busyRef.current)return;if(engine.current?.travel(id)){setMenu(null);setSpeech(null);host.current?.focus();}}
  function begin(id){
    if(!ready||busyRef.current)return;
    const m=MOMENTS[id];setSpeech({person:m.person,text:memories[id]?m.returning:m.greeting});engine.current?.focus();
    if(id==='bangles'){setMenu('colour');return;}
    engine.current?.action(id,colour);
  }
  async function toggleSound(){if(soundRef.current){audio.current?.pause();soundRef.current=false;setSound(false);}else{try{const on=await audio.current?.start();soundRef.current=!!on;setSound(!!on);}catch{setSpeech({person:'Sound',text:'Sound is unavailable in this browser. You can still explore every moment.'});}}}
  const current=PLACES[place];
  return <section className={styles.experience} aria-label="An evening near Charminar, circa 1985" onKeyDown={keys}>
    <div ref={host} className={styles.canvas} tabIndex={0} aria-label="Illustrated neighbourhood. Drag to wander, pinch to zoom, or use arrow keys. Use Explore for all places and interactions." role="region"><div ref={overlay} className={styles.worldLabels}>
      {Object.entries(PLACES).map(([id,p])=><button key={id} className={`${styles.worldButton} ${place===id?styles.current:''}`} tabIndex={-1} style={{left:p.point[0],top:p.point[1]-82}} disabled={!ready||busy} onClick={()=>place===id?begin(p.action):travel(id)} aria-label={place===id?MOMENTS[p.action].label:`Visit ${names[id]}`}><span className={styles.dot}/>{place===id?MOMENTS[p.action].label:names[id]}</button>)}
    {place!=='square'&&<button tabIndex={-1} className={styles.worldButton} style={{left:990,top:859}} disabled={!ready||busy} onClick={()=>travel(place==='courtyard'?'lane':'courtyard')}>{place==='courtyard'?'Back through the arch':'Through the green arch'} ↗</button>}
    </div></div>
    <div className={styles.shade}/>
    <header className={styles.header}>
      <a className={styles.exit} href="/" aria-label="Return to map" onClick={e=>{if(onClose){e.preventDefault();onClose();}}}>←</a>
      <div className={styles.brand}><span>Mapping HYD</span><small>A MEMORY YOU CAN WANDER INTO</small></div>
      <nav className={styles.tools} aria-label="Experience controls">
        <button onClick={toggleSound} aria-pressed={sound} aria-label={sound?'Turn sound off':'Turn sound on'}><span aria-hidden="true">{sound?'♫':'♪'}</span><span className={styles.soundLabel}>{sound?'Sound on':'Sound off'}</span></button>
        <button ref={menuButton} onClick={()=>setMenu('explore')} aria-haspopup="dialog">Explore <span aria-hidden="true">☰</span></button>
      </nav>
    </header>
    {!ready&&<div className={styles.loading} role="status"><span className={styles.loadingMark}>1985</span><p>{error||'Opening the streets of an ordinary evening…'}</p>{error&&<button onClick={()=>location.reload()}>Try again</button>}</div>}
    <div className={styles.era}><span className={styles.sun}/><span>HYDERABAD · CIRCA 1985</span><i>{phase==='sunset'?'The last of the afternoon':phase==='lamplight'?'The lamps are coming on':'One last cup before closing'}</i></div>
    <footer className={styles.footer}>
      <div className={styles.chapter}><span>{names[place]}</span><h1>{current.title}</h1><p>{current.subtitle}</p></div>
      <div className={styles.wander}><button onClick={()=>engine.current?.zoom(.8)} aria-label="Zoom out">−</button><button onClick={()=>engine.current?.overview()} aria-label="See the whole neighbourhood">⌖</button><button onClick={()=>engine.current?.zoom(1.25)} aria-label="Zoom in">+</button></div>
      <div className={styles.bottom}><span>AN IMAGINED EVENING. AN ENDURING CITY.</span><span>Drag to wander · Follow the small things</span></div>
    </footer>
    {speech&&<div className={styles.speech} role="status" aria-live="polite"><span>{speech.person}</span><p>{speech.text}</p>{!busy&&<button onClick={()=>setSpeech(null)} aria-label="Dismiss caption">×</button>}</div>}
    {ready&&!menu&&<div className={styles.mobileAction}><button disabled={busy} onClick={()=>begin(current.action)}>{busy?'Stay a moment…':MOMENTS[current.action].label}<span>↗</span></button></div>}
    {menu&&<div className={styles.backdrop} onPointerDown={e=>{if(e.target===e.currentTarget)closeMenu();}}><section ref={panel} className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="bazaar-panel-title">
      <button className={styles.close} onClick={closeMenu} aria-label="Close menu">×</button>
      {menu==='explore'&&<><span className={styles.eyebrow}>THERE’S NO HURRY</span><h2 id="bazaar-panel-title">Where shall we wander?</h2><p>Three places. A few familiar faces. Nothing to finish.</p><div className={styles.places}>{Object.entries(PLACES).map(([id,p])=><button key={id} disabled={busy} onClick={()=>travel(id)}><Mark kind={p.action}/><span>{names[id]}<small>{p.subtitle}</small></span><b>↗</b></button>)}</div><button className={styles.textButton} disabled={busy} onClick={()=>{closeMenu();begin(current.action);}}>{MOMENTS[current.action].label} →</button><div className={styles.menuFoot}><button onClick={()=>setMenu('journal')}>Your evening, in sketches</button><button onClick={()=>setMenu('about')}>About this memory</button></div></>}
      {menu==='colour'&&<><span className={styles.eyebrow}>AT ZEHRA’S COUNTER</span><h2 id="bazaar-panel-title">“Here. In the light.”</h2><p>{memories.bangles?'Zehra remembers your hand. Another colour, perhaps?':'Two sets lie on the velvet. Choose one to try.'}</p><div className={styles.colours}>{['red','green'].map(c=><button key={c} onClick={()=>{setColour(c);closeMenu();engine.current?.action('bangles',c);}}><span style={{color:c==='red'?'#993b43':'#3c7361'}}><Mark kind="bangles"/></span>{c==='red'?'Pomegranate red':'Bottle green'}</button>)}</div></>}
      {menu==='journal'&&<><span className={styles.eyebrow}>SMALL THINGS THAT STAY</span><h2 id="bazaar-panel-title">An evening, remembered.</h2>{!Object.keys(memories).length&&<p>A cup, a colour, a quiet courtyard. Spend a little time with someone and a sketch will find its way here.</p>}<div className={styles.journal}>{Object.keys(memories).map(id=><article key={id}><div style={{color:id==='bangles'&&memories[id].colour==='green'?'#3c7361':undefined}}><Mark kind={id}/></div><h3>{MOMENTS[id].title}</h3><p>{MOMENTS[id].note}{id==='bangles'&&` I chose ${memories[id].colour==='green'?'bottle green':'pomegranate red'}.`}</p></article>)}</div>{legacy.length>0&&<p className={styles.small}>Memories from your earlier visit are still kept safely on this device.</p>}{storageFailed&&<p>Storage is unavailable. These sketches will remain for this visit only.</p>}<button className={styles.textButton} onClick={()=>setMenu('explore')}>← Back to the neighbourhood</button></>}
      {menu==='about'&&<><span className={styles.eyebrow}>A PLACE IN TIME</span><h2 id="bazaar-panel-title">Charminar, circa 1985.</h2><p>An illustrated, fictional evening inspired by the neighbourhood around Charminar. Bashir, Zehra and Amina are imagined residents. The streets are a composition, not a historical map.</p><p>Architecture draws on <a href="https://hyderabad.telangana.gov.in/tourist-place/charminar/" target="_blank" rel="noreferrer">Telangana’s Charminar reference</a>. The clothing, small objects and daily routines evoke the period; they are not an archival reconstruction. Sound is a quiet, synthesized illustration, not a historical recording.</p><p>Drag or use arrow keys to move. Pinch or use + / − to look closer. Every place and interaction is also in Explore. Your device’s reduced-motion preference is respected.</p><button className={styles.textButton} onClick={()=>setMenu('explore')}>← Back to the neighbourhood</button></>}
    </section></div>}
  </section>;
}

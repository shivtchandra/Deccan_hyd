'use client';
import {useEffect,useRef,useState} from 'react';
import {CLUES,POSTCARD_KEY,FACT_SOURCE,readTrail,canInspect} from './postcard.mjs';
import s from './postcard.module.css';
export default function PostcardTrail({player,ready,busy,onWalk,onPause}){
 const [step,setStep]=useState(0),[open,setOpen]=useState(false),[found,setFound]=useState(false),[loaded,setLoaded]=useState(false);const panel=useRef(null);
 useEffect(()=>{try{const raw=localStorage.getItem(POSTCARD_KEY);setStep(readTrail(raw));setOpen(raw===null);}catch{setOpen(true);}setLoaded(true);},[]);
 useEffect(()=>{onPause(open);if(open)panel.current?.querySelector('button')?.focus();return()=>onPause(false);},[open,onPause,ready]);
 const clue=CLUES[step],close=()=>{setOpen(false);setFound(false);};
 function inspect(){if(!canInspect(step,player)||busy)return;const next=step+1;setStep(next);try{localStorage.setItem(POSTCARD_KEY,JSON.stringify(next));}catch{}setFound(true);setOpen(true);}
 function keys(e){if(e.key==='Escape')close();if(e.key==='Tab'){const b=panel.current.querySelectorAll('button,a'),first=b[0],last=b[b.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}
 if(!loaded||!ready)return null;
 return <><div className={s.trail}><button onClick={()=>setOpen(true)}><span>✉</span><div><small>THE LOST POSTCARD · {step}/3</small><strong>{clue?clue.title:'An evening, put back together'}</strong></div></button>{clue&&canInspect(step,player)&&<button className={s.inspect} disabled={busy} onClick={inspect}>Compare the postcard ↗</button>}</div>
 {open&&<div className={s.scrim} onKeyDown={keys}><section ref={panel} className={s.card} role="dialog" aria-modal="true" aria-label="The lost postcard"><button className={s.close} onClick={close} aria-label="Close postcard">×</button><div className={`${s.picture} ${step===3?s.colour:''}`} style={{backgroundPosition:`${step===0?'0':step===1?'50':'100'}% center`}}/><small>A FICTIONAL MYSTERY IN A REAL CITY</small><h2>{found?CLUES[step-1].detail:step===3?'Some evenings stay with you.':'Who kept the other half?'}</h2>
 {!found&&step===0&&<p>A torn postcard lies on a chai bench: a clock face, a bangle, a fountain. Someone has circled three details. Follow them through the street to find the other half.</p>}
 {found&&<><p className={s.fact}>{CLUES[step-1].fact} <a href={FACT_SOURCE} target="_blank" rel="noreferrer">Historical source ↗</a></p><p>{CLUES[step-1].next}</p></>}
 {clue?<><p className={s.clue}><b>Look for:</b> {clue.hint}</p><button className={s.go} disabled={busy} onClick={()=>{close();onWalk(clue.visit);}}>Walk towards this clue →</button><button className={s.quiet} onClick={close}>I’ll find it myself</button></>:<><p>You found the clock, the colour, and the quiet. The postcard is whole again. Stay for chai, choose a tune, or simply walk back through the evening.</p><button className={s.go} onClick={close}>Keep wandering →</button></>}
 </section></div>}</>;
}

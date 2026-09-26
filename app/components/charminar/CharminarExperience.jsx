'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MEMORY_KEY } from './encounters.mjs';
import { ALL_ENCOUNTERS as ENCOUNTERS, SCENES, STORY, storyStage, resolveEncounter } from './neighbourhood.mjs';
import { WORLD, clampCamera, fitScale, framePoint, validMemories, zoomAt } from './camera.mjs';
import { REEL, MOMENTS, worldPoint, momentAtCamera, momentById, sceneOffset } from './reel.mjs';
import { BazaarSound } from './sound.mjs';
import HeirloomBoxModal from './HeirloomBoxModal.jsx';
import HeirloomJournalModal from './HeirloomJournalModal.jsx';
import CipherQuestBar from './CipherQuestBar.jsx';
import SpotDetailPuzzle from './SpotDetailPuzzle.jsx';
import EveningTimeline from './EveningTimeline.jsx';
import {
  HEIRLOOM_STORAGE_KEY,
  restoreHeirloomState,
  countUnlocked,
  saveHeirloomState,
  isBoxFullyUnlocked,
} from './heirloom-mystery.mjs';
import {
  CIPHER_KEY,
  CLUES,
  SPOT_PUZZLES,
  restoreCipherState,
  saveCipherState,
  collectClue,
  attemptSpot,
  applyClueToLock,
  activeChapter,
  cipherProgress,
  isCipherComplete,
  nextCipherHint,
  useCipherHint,
  spotPuzzleForEncounter,
  markCipherFinished,
} from './evening-cipher.mjs';
import { awardBadge } from '../../../lib/passport.js';
import styles from './evening.module.css';

function Icon({ name, size = 20, ...props }) {
  const paths = {
    arrow: <><path d="M19 12H5m6-6-6 6 6 6" /></>,
    next: <path d="M5 12h14m-6-6 6 6-6 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5Z" /></>,
    book: <><path d="M12 5v15M3 4c3-1 6-1 9 1 3-2 6-2 9-1v15c-3-1-6-1-9 1-3-2-6-2-9-1Z" /></>,
    sound: <><path d="m11 4-6 5H2v6h3l6 5ZM15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14" /></>,
    mute: <><path d="m11 4-6 5H2v6h3l6 5Zm5 5 6 6m0-6-6 6" /></>,
    cup: <><path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm12 1h2a3 3 0 0 1 0 6h-2M8 3v2m4-3v3" /></>,
    bangle: <><ellipse cx="10" cy="12" rx="6" ry="8" /><ellipse cx="14" cy="12" rx="6" ry="8" /></>,
    bottle: <><path d="M9 3h6v4H9Zm0 4v3c-3 1-4 3-4 6v4h14v-4c0-3-1-5-4-6V7M5 15h14" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-11v1" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

export default function CharminarExperience({ onClose }) {
  const root = useRef(null);
  const stage = useRef(null);
  const artwork = useRef(null);
  const panel = useRef(null);
  const sound = useRef(null);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const actionTimer = useRef(null);
  const viewRef = useRef({ width: 1280, height: 800 });
  const cameraRef = useRef({ x: 0, y: 0, scale: 1 });
  const [camera, setCamera] = useState(cameraRef.current);
  const [entered, setEntered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [imageAttempt, setImageAttempt] = useState(0);
  const [selected, setSelected] = useState(null);
  const [book, setBook] = useState(false);
  const [about, setAbout] = useState(false);
  const [memories, setMemories] = useState([]);
  const [audioOn, setAudioOn] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [moment, setMoment] = useState(null);
  const [performing, setPerforming] = useState(false);
  const [completed, setCompleted] = useState(null);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [glide, setGlide] = useState(false);
  const [sceneId, setSceneId] = useState('square');
  const [eventVisible, setEventVisible] = useState(false);

  // Heirloom Box & Casebook States
  const [heirloomState, setHeirloomState] = useState(() => {
    if (typeof window === 'undefined') return restoreHeirloomState(null);
    return restoreHeirloomState(localStorage.getItem(HEIRLOOM_STORAGE_KEY));
  });
  const [boxOpen, setBoxOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const unlockedCount = countUnlocked(heirloomState.unlocked);

  // Evening Cipher — unified explore → spot → apply loop
  const [cipherState, setCipherState] = useState(() => {
    if (typeof window === 'undefined') return restoreCipherState(null);
    return restoreCipherState(localStorage.getItem(CIPHER_KEY));
  });
  const [spotId, setSpotId] = useState(null);
  const [cipherFeedback, setCipherFeedback] = useState(null);
  const [hintBanner, setHintBanner] = useState(null);

  const scene = SCENES.find(s => s.id === sceneId) || SCENES[0];
  const activeMoment = momentById(sceneId);
  const progress = storyStage(memories);
  const active = resolveEncounter(ENCOUNTERS.find((item) => item.id === selected), memories);
  const chapter = activeChapter(cipherState, memories, heirloomState.unlocked);
  const progressCipher = cipherProgress(cipherState, memories, heirloomState.unlocked);
  const heldClues = cipherState.clues.map((id) => CLUES[id]).filter(Boolean);
  const spotPuzzle = spotId ? SPOT_PUZZLES[spotId] : null;
  const hasPanel = Boolean(active || book || about);

  useEffect(() => {
    setEventVisible(false);
    const timer = setTimeout(() => setEventVisible(true), 7000);
    return () => clearTimeout(timer);
  }, [sceneId]);

  // Keep the timeline marker in sync as the visitor pans the continuous reel
  useEffect(() => {
    if (!entered || hasPanel) return;
    const current = momentAtCamera(camera, viewRef.current);
    if (current.id !== sceneId) setSceneId(current.id);
  }, [camera, entered, sceneId, hasPanel]);

  useEffect(() => {
    // Sync invitation clue if the letter was already remembered in a prior visit
    if (!memories.includes('letter') || cipherState.clues.includes('invitation')) return;
    const next = collectClue(cipherState, 'invitation');
    setCipherState(next);
    saveCipherState(next);
  }, [memories, cipherState]);

  useEffect(() => {
    if (!isCipherComplete(cipherState, memories, heirloomState.unlocked)) return;
    if (cipherState.completedAt) return;
    const next = markCipherFinished(cipherState);
    setCipherState(next);
    saveCipherState(next);
  }, [cipherState, memories, heirloomState.unlocked]);

  const persistCipher = useCallback((next, feedback) => {
    setCipherState(next);
    saveCipherState(next);
    if (feedback) {
      setCipherFeedback(feedback);
      window.clearTimeout(persistCipher._t);
      persistCipher._t = window.setTimeout(() => setCipherFeedback(null), 4200);
    }
  }, []);

  const handleSpotPick = (optionId) => {
    if (!spotId) return;
    const result = attemptSpot(cipherState, spotId, optionId);
    persistCipher(result.state, result.feedback);
    if (result.ok) {
      sound.current?.cue?.('bangles');
      setSpotId(null);
    }
  };

  const handleApplyClue = () => {
    if (!chapter || chapter.kind !== 'apply') return;
    const result = applyClueToLock(cipherState, chapter.lockId);
    persistCipher(result.state, result.feedback);
    if (!result.ok || !result.values) return;
    const values = { ...heirloomState.values, ...result.values };
    const unlocked = { ...heirloomState.unlocked, [chapter.lockId]: true };
    const updated = { ...heirloomState, values, unlocked };
    if (isBoxFullyUnlocked(unlocked) && !updated.completedAt) {
      updated.completedAt = new Date().toISOString();
      awardBadge('master_sleuth');
      sound.current?.boxVictory?.();
    } else {
      sound.current?.lockUnlocked?.();
    }
    setHeirloomState(updated);
    saveHeirloomState(updated);
    setBoxOpen(true);
  };

  const handleCipherGo = () => {
    if (!chapter) return;
    if (chapter.kind === 'apply') {
      setBoxOpen(true);
      return;
    }
    if (chapter.kind === 'spot') {
      const target = ENCOUNTERS.find((e) => e.id === chapter.encounterId);
      if (target) visit(target);
      setSpotId(chapter.spotId);
      return;
    }
    const target = ENCOUNTERS.find((e) => e.id === chapter.encounterId);
    if (target) visit(target);
  };

  const handleCipherHint = () => {
    const nextState = useCipherHint(cipherState);
    persistCipher(nextState);
    const tip = nextCipherHint(nextState, memories, heirloomState.unlocked);
    setHintBanner(tip.text);
  };

  const moveCamera = useCallback((next, animate = false) => {
    const bounded = clampCamera(next, viewRef.current);
    cameraRef.current = bounded;
    setGlide(animate);
    setCamera(bounded);
  }, []);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    try { setMemories(validMemories(JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]'), ENCOUNTERS.map((item) => item.id))); } catch {}
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(media.matches);
    updateMotion();
    media.addEventListener('change', updateMotion);
    sound.current = new BazaarSound();
    root.current?.focus();
    if (artwork.current?.complete && artwork.current.naturalWidth > 0) setLoaded(true);
    return () => {
      document.body.style.overflow = previousOverflow;
      media.removeEventListener('change', updateMotion);
      sound.current?.dispose();
      clearTimeout(actionTimer.current);
      previousFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      const previous = viewRef.current;
      const current = cameraRef.current;
      const centre = { x: (previous.width / 2 - current.x) / current.scale, y: (previous.height / 2 - current.y) / current.scale };
      viewRef.current = { width, height };
      moveCamera(framePoint(loaded ? centre : { x: 768, y: 460 }, viewRef.current, loaded ? current.scale / fitScale(previous) : 1));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [moveCamera, loaded]);

  useEffect(() => {
    const visibility = () => {
      setHidden(document.hidden);
      if (document.hidden) sound.current?.pause();
      else if (audioOn) sound.current?.start().catch(() => setAudioOn(false));
    };
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, [audioOn]);

  useEffect(() => {
    if (!hasPanel) return;
    const previous = document.activeElement;
    panel.current?.focus();
    return () => { if (previous?.isConnected) previous.focus?.(); };
  }, [hasPanel, selected, book, about]);

  const closePanel = () => {
    setSelected(null); setBook(false); setAbout(false);
    requestAnimationFrame(() => (entered ? stage.current : root.current)?.focus());
  };

  const toggleSound = async () => {
    if (audioOn) { sound.current?.pause(); setAudioOn(false); return; }
    try {
      const ok = await sound.current?.start();
      setAudioOn(Boolean(ok));
      setAudioError(!ok);
    } catch { setAudioOn(false); setAudioError(true); }
  };

  const travel = (id) => {
    clearTimeout(actionTimer.current); setPerforming(false); setMoment(null); setCompleted(null);
    setSelected(null); setBook(false); setAbout(false); setSceneId(id); setFailed(false);
    const focus = momentById(id).focus;
    moveCamera(framePoint(focus, viewRef.current, 1.05), true);
    requestAnimationFrame(() => stage.current?.focus());
  };

  const visit = (item) => {
    setSceneId(item.scene || 'square');
    clearTimeout(actionTimer.current);
    setPerforming(false);
    setMoment(null);
    setCompleted(null);
    setSelected(item.id);
    setBook(false);
    setAbout(false);
    const point = worldPoint(item);
    const mobile = viewRef.current.width < 700;
    const mobileZoom = Math.max(1.45, (viewRef.current.height * 0.7 / (WORLD.height - point.camera.y)) / fitScale(viewRef.current));
    moveCamera(framePoint(point.camera, viewRef.current, mobile ? mobileZoom : 1.35, { x: mobile ? 0.5 : 0.4, y: mobile ? 0.30 : 0.48 }), true);
  };

  const experience = () => {
    if (!active || performing) return;
    if (active.id === 'heirloom') {
      setBoxOpen(true);
      return;
    }
    if (active.locked) { visit(ENCOUNTERS.find(e => e.id === STORY[progress].id)); return; }
    const id = active.id;
    const pendingSpot = spotPuzzleForEncounter(id);
    // Clue encounters can open the spot puzzle directly once the invitation is held
    if (pendingSpot && !cipherState.spotted.includes(pendingSpot.id) && cipherState.clues.includes('invitation') && memories.includes(id)) {
      setSpotId(pendingSpot.id);
      return;
    }
    setPerforming(true);
    setMoment(id);
    sound.current?.cue(id === 'clock' || id === 'radio' ? 'attar' : id);
    actionTimer.current = setTimeout(() => {
      setMemories((previous) => {
        const next = validMemories([...previous, id], ENCOUNTERS.map((item) => item.id));
        try { localStorage.setItem(MEMORY_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
      if (id === 'letter') {
        setCipherState((prev) => {
          const next = collectClue(prev, 'invitation');
          saveCipherState(next);
          return next;
        });
        setCipherFeedback('Invitation pocketed. Follow the green door.');
      }
      setPerforming(false);
      setCompleted(id);
      setMoment(null);
      if (pendingSpot && !cipherState.spotted.includes(pendingSpot.id)) {
        setTimeout(() => setSpotId(pendingSpot.id), reduced ? 200 : 600);
      }
    }, reduced ? 300 : 2600);
  };

  const overview = () => {
    closePanel();
    moveCamera(framePoint(activeMoment.focus, viewRef.current), true);
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (spotId) { setSpotId(null); return; }
      if (boxOpen) { setBoxOpen(false); return; }
      if (journalOpen) { setJournalOpen(false); return; }
      if (hasPanel) { closePanel(); return; }
      if (onClose) onClose();
      return;
    }
    if (event.key === 'Tab') {
      const scope = hasPanel ? panel.current : root.current;
      const items = [...(scope?.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]') || [])].filter((el) => el.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !items.includes(document.activeElement))) { event.preventDefault(); first?.focus(); }
    }
  };

  const pointerPosition = (event) => {
    const bounds = stage.current.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };

  const snapshotGesture = () => {
    const values = [...pointers.current.values()];
    if (values.length === 1) gesture.current = { point: values[0] };
    else if (values.length >= 2) gesture.current = { point: { x: (values[0].x + values[1].x) / 2, y: (values[0].y + values[1].y) / 2 }, distance: Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y) };
    else gesture.current = null;
  };

  const pointerDown = (event) => {
    if (!entered || hasPanel || event.target.closest('button') || (event.pointerType === 'mouse' && event.button !== 0)) return;
    pointers.current.set(event.pointerId, pointerPosition(event));
    event.currentTarget.setPointerCapture(event.pointerId);
    snapshotGesture();
  };

  const pointerMove = (event) => {
    if (!pointers.current.has(event.pointerId)) return;
    const before = gesture.current;
    pointers.current.set(event.pointerId, pointerPosition(event));
    snapshotGesture();
    const after = gesture.current;
    let next = cameraRef.current;
    if (before?.distance && after?.distance) next = zoomAt(next, before.point, after.distance / Math.max(1, before.distance), viewRef.current);
    if (before && after) next = { ...next, x: next.x + after.point.x - before.point.x, y: next.y + after.point.y - before.point.y };
    moveCamera(next);
  };

  const pointerUp = (event) => { pointers.current.delete(event.pointerId); snapshotGesture(); };

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const wheel = (event) => {
      if (!entered || hasPanel) return;
      event.preventDefault();
      const bounds = element.getBoundingClientRect();
      moveCamera(zoomAt(cameraRef.current, { x: event.clientX - bounds.left, y: event.clientY - bounds.top }, Math.exp(-event.deltaY * 0.001), viewRef.current));
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => element.removeEventListener('wheel', wheel);
  }, [entered, hasPanel, moveCamera]);

  const zoom = (factor) => moveCamera(zoomAt(cameraRef.current, { x: viewRef.current.width / 2, y: viewRef.current.height / 2 }, factor, viewRef.current), true);

  return (
    <div ref={root} className={`${styles.experience} ${entered ? styles.entered : ''} ${reduced || hidden ? styles.still : ''}`} role="dialog" aria-modal="true" aria-label="An evening at Charminar" tabIndex={-1} onKeyDown={onKeyDown}>
      <div ref={stage} className={styles.stage} tabIndex={entered && !hasPanel ? 0 : -1} aria-label="Bazaar panorama. Use arrow keys to wander, plus and minus to zoom." onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onLostPointerCapture={pointerUp} onKeyDown={(event) => {
        if (event.target !== event.currentTarget || !entered || hasPanel) return;
        const offsets = { ArrowLeft: [90, 0], ArrowRight: [-90, 0], ArrowUp: [0, 90], ArrowDown: [0, -90] };
        if (offsets[event.key]) { event.preventDefault(); const [x, y] = offsets[event.key]; moveCamera({ ...cameraRef.current, x: cameraRef.current.x + x, y: cameraRef.current.y + y }); }
        if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(1.2); }
        if (event.key === '-') { event.preventDefault(); zoom(1 / 1.2); }
      }}>
        <div className={`${styles.world} ${glide ? styles.glide : ''}`} style={{ width: WORLD.width, height: WORLD.height, transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})` }}>
          <img
            ref={artwork}
            key={`reel-${imageAttempt}`}
            src={REEL.image}
            alt={REEL.alt}
            width={WORLD.width}
            height={WORLD.height}
            draggable={false}
            onLoad={() => { setLoaded(true); setFailed(false); }}
            onError={() => setFailed(true)}
            className={styles.artwork}
          />
          <div className={styles.atmosphere} aria-hidden="true">
            {SCENES.flatMap((s) => s.lamps.map(([x, y], i) => (
              <span key={`${s.id}-${i}`} className={styles.lamp} style={{ left: x + sceneOffset(s.id), top: y, animationDelay: `${i * -1.7}s` }} />
            )))}
            <div className={`${styles.steam} ${moment === 'chai' ? styles.strongSteam : ''}`} style={{ left: 173, top: 508 }}><i /><i /><i /></div>
            <div className={`${styles.steam} ${moment === 'reunion' ? styles.strongSteam : ''}`} style={{ left: 2880 + 450, top: 650 }}><i /><i /><i /></div>
            <svg className={styles.birds} viewBox="0 0 180 80" style={{ left: 530 }}><path d="M20 34q8-9 17 0 8-9 17 0M94 19q6-7 12 0 6-7 12 0M130 48q7-8 14 0 7-8 14 0" /></svg>
            {moment === 'bangles' && <div className={styles.glints} style={{ left: 595, top: 736 }}>{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>}
            {moment === 'attar' && <div className={`${styles.steam} ${styles.fragrance}`} style={{ left: 1380, top: 585 }}><i /><i /><i /></div>}
            <span className={styles.walker} />
          </div>
          {entered && !book && !about && ENCOUNTERS.map((item) => {
            const point = worldPoint(item);
            return (
              <button
                key={item.id}
                className={`${styles.hotspot} ${styles.photoPin} ${selected === item.id ? styles.selectedHotspot : ''} ${memories.includes(item.id) ? styles.foundHotspot : ''}`}
                style={{
                  left: point.x,
                  top: point.y,
                  '--pin-scale': 1 / camera.scale,
                }}
                aria-label={`Visit ${item.place}${memories.includes(item.id) ? ', memory collected' : ''}`}
                onClick={() => visit(item)}
                tabIndex={hasPanel ? -1 : 0}
              >
                <span>{memories.includes(item.id) ? <Icon name="check" size={14} /> : item.id === 'heirloom' ? '◆' : '·'}</span>
                <em>{item.place}</em>
              </button>
            );
          })}
        </div>
      </div>
      <div className={styles.vignette} aria-hidden="true" />
      <div className={`${styles.letterbox} ${styles.letterboxTop}`} aria-hidden="true" />
      <div className={`${styles.letterbox} ${styles.letterboxBottom}`} aria-hidden="true" />
      <div className={styles.filmGrain} aria-hidden="true" />
      {entered && failed && <button className={styles.loadError} onClick={() => { setFailed(false); setImageAttempt((v) => v + 1); }}>This evening could not load. Retry</button>}

      {/* Top Header Navigation */}
      <header className={styles.header}>
        <a href="/" onClick={onClose ? (event) => { event.preventDefault(); onClose(); } : undefined} className={styles.brand} aria-label="Return to heritage map">
          <Icon name="arrow" size={17} />
          <span>Mapping HYD<small>THE LIVING OLD CITY</small></span>
        </a>
        <span className={styles.location}>OLD CITY, HYDERABAD <span>{activeMoment.time.toUpperCase()} · CONTINUOUS REEL</span></span>
        <div className={styles.headerActions}>
          <button
            onClick={() => setBoxOpen(true)}
            className={styles.bookButton}
            title="Inspect The Nizam's Lost Heirloom Box"
          >
            <span>Box</span>
            <b>{unlockedCount}/4</b>
          </button>

          <button onClick={() => setJournalOpen(true)} className={styles.bookButton} title="Open journal">
            <Icon name="compass" size={18} />
            <span>Journal</span>
          </button>

          <button onClick={toggleSound} className={styles.soundButton} aria-label={audioOn ? 'Mute illustrative sound' : 'Enable illustrative sound'} aria-pressed={audioOn}>
            <Icon name={audioOn ? 'sound' : 'mute'} size={18} />
            <span>Sound {audioOn ? 'on' : 'off'}</span>
          </button>

          {entered && (
            <button onClick={() => { setBook(true); setSelected(null); setAbout(false); }} className={styles.bookButton} aria-label={`Open memory book, ${memories.length} of ${ENCOUNTERS.length} memories`}>
              <Icon name="book" size={19} />
              <span>Memories</span>
              <b>{memories.length}/{ENCOUNTERS.length}</b>
            </button>
          )}

          <button className={styles.iconButton} onClick={() => { setAbout(true); setSelected(null); setBook(false); }} aria-label="About this illustrated evening">
            <Icon name="info" size={19} />
          </button>
        </div>
      </header>

      {!entered && (
        <section className={styles.intro} aria-labelledby="evening-title">
          <p className={styles.eyebrow}><span /> MAPPING HYD · ONE CONTINUOUS EVENING</p>
          <h1 id="evening-title">Walk the<br /><em>Old City</em> reel.</h1>
          <p className={styles.introCopy}>One photograph that keeps going — from Charminar square through bangle lane into a hidden courtyard. Follow the thread, spot details, unlock the heirloom.</p>
          {failed ? (
            <button className={styles.enterButton} onClick={() => { setFailed(false); setImageAttempt((v) => v + 1); }}>
              The lane couldn’t load. Try again <Icon name="next" />
            </button>
          ) : (
            <button className={styles.enterButton} disabled={!loaded} onClick={() => { setEntered(true); requestAnimationFrame(() => stage.current?.focus()); }}>
              {loaded ? 'Begin the walk' : 'Opening the reel…'}<Icon name="next" />
            </button>
          )}
          <span className={styles.introNote}>Drag through the evening · tap the timeline · look closer</span>
        </section>
      )}

      {entered && !hasPanel && (
        <>
          <div className={styles.chapter}>
            <span>{activeMoment.time.toUpperCase()}</span>
            <h1>{activeMoment.name}</h1>
            <p>{activeMoment.caption}</p>
          </div>

          <CipherQuestBar
            className={styles.cipherQuest}
            chapter={chapter}
            progress={progressCipher}
            clues={heldClues}
            hintText={hintBanner}
            hintsLeft={Math.max(0, 3 - cipherState.hintsUsed)}
            feedback={cipherFeedback}
            onGo={handleCipherGo}
            onHint={handleCipherHint}
            onOpenBox={() => setBoxOpen(true)}
            onApply={handleApplyClue}
            canApply={chapter?.kind === 'apply' && cipherState.clues.includes(chapter.clueId)}
          />

          {eventVisible && <p className={styles.streetEvent} role="status">{scene.event}</p>}

          <div className={styles.cameraControls}>
            <button onClick={() => zoom(1.25)} aria-label="Zoom in"><Icon name="plus" /></button>
            <button onClick={() => zoom(0.8)} aria-label="Zoom out"><Icon name="minus" /></button>
            <button onClick={overview} aria-label="Frame this moment"><Icon name="compass" /></button>
          </div>

          <div className={styles.timelineDock}>
            <EveningTimeline
              moments={MOMENTS}
              activeId={sceneId}
              progressPct={progressCipher.pct}
              onSelect={travel}
            />
          </div>
        </>
      )}

      {/* Side Encounter Inspection Drawer */}
      {hasPanel && (
        <>
          <button className={styles.panelScrim} onClick={closePanel} aria-label="Return to the bazaar" tabIndex={-1} />
          <aside ref={panel} className={`${styles.panel} ${book ? styles.memoryPanel : ''}`} role="dialog" aria-modal="true" aria-label={active ? active.place : book ? 'Your memory book' : 'About this evening'} tabIndex={-1}>
            <button className={styles.panelClose} onClick={closePanel} aria-label="Close panel"><Icon name="close" /></button>
            {active && (
              <>
                <p className={styles.panelEyebrow}>ENCOUNTER {active.number} <span>·</span> {active.place}</p>
                <div className={styles.objectIllustration} style={{ color: active.color }}><Icon name={active.icon} size={68} /><span /></div>
                <h2>{active.name}</h2>
                <p className={styles.invitation}>{active.invitation}</p>
                <div className={styles.divider} />
                <p className={styles.story}>{active.line}</p>
                <div className={styles.momentCaption} role="status" aria-live="polite">
                  {performing ? active.caption : completed === active.id ? <><Icon name="check" size={15} /> A clue recorded in your memory.</> : <span>Take a moment. Look a little closer.</span>}
                </div>
                <button className={styles.actionButton} onClick={experience} disabled={performing}>
                  {performing
                    ? 'Recording in memory…'
                    : active.id === 'heirloom'
                      ? 'Open the Heirloom Box'
                      : spotPuzzleForEncounter(active.id) && !cipherState.spotted.includes(spotPuzzleForEncounter(active.id).id) && memories.includes(active.id)
                        ? 'Look closer — spot the detail'
                        : completed === active.id
                          ? 'Examine again'
                          : active.action}
                  <Icon name={completed === active.id ? 'check' : 'next'} size={18} />
                </button>
                {completed === active.id && <p className={styles.nextClue}>{active.next}</p>}
                <button className={styles.textButton} onClick={closePanel}>Keep wandering <Icon name="next" size={16} /></button>
              </>
            )}
            {book && (
              <>
                <p className={styles.panelEyebrow}>LITTLE THINGS, LONG REMEMBERED</p>
                <h2>Your evening,<br /><em>to keep.</em></h2>
                <p className={styles.story}>{memories.length === ENCOUNTERS.length ? 'All memories, three places, one evening. You can always return.' : 'Spend a little time at each counter. Bring a piece of the evening home.'}</p>
                <ol className={styles.memoryList}>
                  {ENCOUNTERS.map((item) => (
                    <li key={item.id} className={memories.includes(item.id) ? styles.collected : ''}>
                      <Icon name={item.icon} size={30} />
                      <div>
                        <span>{item.number} / {memories.includes(item.id) ? 'REMEMBERED' : 'WAITING FOR YOU'}</span>
                        <h3>{item.object}</h3>
                        <p>{memories.includes(item.id) ? item.memory : 'A moment still waiting in the lane.'}</p>
                        <button onClick={() => visit(item)}>{memories.includes(item.id) ? 'Visit again' : 'Find this moment'} <Icon name="next" size={14} /></button>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className={styles.savedNote}>Kept in this browser, for your next visit.</p>
              </>
            )}
            {about && (
              <>
                <p className={styles.panelEyebrow}>MAPPING HYD · THE LIVING CITY</p>
                <h2>A place.<br /><em>A feeling.</em></h2>
                <p className={styles.story}>An affectionate, illustrated imagining of an Old City evening, inspired by memories of Hyderabad in the 1980s and ’90s.</p>
                <p className={styles.story}>Three connected districts: Charminar Square, Bangle Lane (Laad Bazaar), and the Hidden Courtyard.</p>
                <div className={styles.divider} />
                <p className={styles.story}>Solve the 4 cipher locks of the Nizam’s Lost Heirloom Box hidden across the bazaar to claim the Royal Basra Pearl and earn the Master Sleuth badge!</p>
                <p className={styles.savedNote}>Designed in the warm archival paper-and-ink heritage aesthetic.</p>
              </>
            )}
          </aside>
        </>
      )}

      {/* The Nizam's Lost Heirloom Box Modal */}
      {boxOpen && (
        <HeirloomBoxModal
          state={heirloomState}
          setState={setHeirloomState}
          sound={sound.current}
          onClose={() => setBoxOpen(false)}
          onOpenJournal={() => setJournalOpen(true)}
          onAwardSleuth={() => {
            awardBadge('master_sleuth');
          }}
        />
      )}

      {/* Detective Casebook Journal Modal */}
      {journalOpen && (
        <HeirloomJournalModal
          state={heirloomState}
          setState={setHeirloomState}
          onClose={() => setJournalOpen(false)}
          onOpenBox={() => setBoxOpen(true)}
        />
      )}

      {/* Spot-the-detail mini-puzzle */}
      {spotPuzzle && (
        <SpotDetailPuzzle
          puzzle={spotPuzzle}
          wrongCount={cipherState.wrongTries[spotPuzzle.id] || 0}
          onPick={handleSpotPick}
          onClose={() => setSpotId(null)}
        />
      )}

      {audioError && <p className={styles.audioNotice} role="status">Sound isn’t available here. You can still enjoy every encounter.</p>}
      <footer className={styles.edition}>THE EVENING CIPHER <span>·</span> EXPLORE · SPOT · APPLY <span>·</span> {progressCipher.done}/{progressCipher.total}</footer>
    </div>
  );
}

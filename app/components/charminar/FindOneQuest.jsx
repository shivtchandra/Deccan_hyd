'use client';

import { useEffect, useState } from 'react';
import {
  FIND,
  FIND_KEY,
  restoreFind,
  saveFind,
  tryFindPerson,
  useFindHint,
  portraitStyle,
} from './find-one.mjs';
import s from './walking.module.css';

/** Memory-scrap objective: recognise one neighbour on the street. */
export default function FindOneQuest({
  ready,
  foundPersonId,
  onConsumeFind,
  onPause,
  onHighlight,
}) {
  const [state, setState] = useState(() => restoreFind(null));
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FIND_KEY);
      const next = restoreFind(raw);
      setState(next);
      setOpen(!raw || !next.found);
    } catch {
      setOpen(true);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    onPause?.(open);
    return () => onPause?.(false);
  }, [open, onPause]);

  function persist(next) {
    setState(next);
    saveFind(next);
  }

  useEffect(() => {
    if (!foundPersonId || !loaded) return;
    const result = tryFindPerson(state, foundPersonId);
    persist(result.state);
    setFeedback(result.feedback);
    setOpen(true);
    if (result.ok) onHighlight?.(null);
    onConsumeFind?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to a new tap
  }, [foundPersonId, loaded]);

  function hint() {
    const next = useFindHint(state);
    persist(next);
    if (next.hintsUsed >= 3) onHighlight?.(FIND.personId);
    setFeedback(FIND.softHints[Math.min(next.hintsUsed, FIND.softHints.length) - 1]);
  }

  if (!ready || !loaded) return null;

  return (
    <>
      <button
        type="button"
        className={`${s.scrapCard} ${state.found ? s.scrapCardFound : ''}`}
        onClick={() => setOpen(true)}
        aria-label={state.found ? `${FIND.name} recognised` : FIND.title}
      >
        <span className={s.scrapPortrait} style={portraitStyle()} aria-hidden="true" />
        <span className={s.scrapCopy}>
          <em>{state.found ? 'RECOGNISED' : 'THE SCRAP'}</em>
          <strong>{FIND.name}</strong>
          <small>{FIND.clue}</small>
        </span>
      </button>

      {open && (
        <div className={s.scrim}>
          <section className={`${s.panel} ${s.scrapPanel}`} role="dialog" aria-modal="true" aria-label={FIND.title}>
            <button className={s.close} onClick={() => setOpen(false)} aria-label="Close">×</button>
            <small>MAPPING HYD · OLD CITY EVENING</small>
            <div className={s.scrapHero}>
              <span className={s.scrapPortraitLg} style={portraitStyle()} aria-hidden="true" />
              <div>
                <h2>{state.found ? 'She was here all along.' : FIND.title}</h2>
                <p className={s.scrapPaper}>{FIND.paper}</p>
                <p>{feedback || (state.found ? 'Linger if you like. The bazaar does not hurry.' : FIND.hint)}</p>
                {!state.found && <p className={s.scrapClue}><b>On the scrap:</b> {FIND.clue}</p>}
              </div>
            </div>
            {!state.found && (
              <button type="button" className={s.findHint} onClick={hint} disabled={state.hintsUsed >= 3}>
                A little help · {Math.max(0, 3 - state.hintsUsed)} left
              </button>
            )}
            <button type="button" className={s.goStreet} onClick={() => setOpen(false)}>
              {state.found ? 'Stay on the street' : 'Keep looking'} →
            </button>
          </section>
        </div>
      )}
    </>
  );
}

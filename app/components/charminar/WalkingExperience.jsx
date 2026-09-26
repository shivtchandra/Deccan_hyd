'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import FindOneQuest from './FindOneQuest.jsx';
import { createStreetGame } from './StreetGame.mjs';
import { SAVE_KEY, OLD_KEY, restoreGame, serialise, DISTRICTS, ACTIVITIES } from './game-world.mjs';
import { BazaarSound } from './sound.mjs';
import s from './walking.module.css';

export default function WalkingExperience({ onClose }) {
  const host = useRef(null);
  const engine = useRef(null);
  const save = useRef(null);
  const sound = useRef(null);
  const audioOn = useRef(false);
  const dialog = useRef(null);
  const findOpen = useRef(false);
  const menuOpen = useRef(false);

  const pauseFind = useCallback((v) => {
    findOpen.current = v;
    engine.current?.pause(v || menuOpen.current);
  }, []);

  const [foundPersonId, setFoundPersonId] = useState(null);
  const [ui, setUI] = useState({ district: DISTRICTS[0], memories: {}, follow: true });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [menu, setMenu] = useState(null);
  const [choice, setChoice] = useState(null);
  const [audio, setAudio] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;
    let own;
    let data = restoreGame();
    try {
      data = restoreGame(localStorage.getItem(SAVE_KEY), localStorage.getItem(OLD_KEY));
    } catch {}
    save.current = data;
    sound.current = new BazaarSound();

    const persist = () => {
      try {
        localStorage.setItem(SAVE_KEY, serialise(data));
      } catch {
        setNotice('Your browser cannot save this visit.');
      }
    };

    createStreetGame(
      host.current,
      data,
      setUI,
      (id) => {
        if (id.startsWith('person:')) {
          setFoundPersonId(id.slice(7));
          return;
        }
        if (id === 'bangles' || (id === 'radio' && data.parcel !== 'carrying')) {
          setChoice(id);
          setMenu('choice');
        } else engine.current?.interact(id);
      },
      (id, phase) => {
        if (phase === 1 && audioOn.current) {
          if (id === 'radio') sound.current?.melody(data.active?.choice === 'courtyard' ? 'courtyard' : 'evening');
          else sound.current?.cue(id === 'bangles' ? 'bangles' : 'chai');
        }
      }
    )
      .then((e) => {
        own = e;
        if (cancelled) e.destroy();
        else {
          engine.current = e;
          setReady(true);
        }
      })
      .catch(() => setError('The street could not load. Reload to try again.'));

    const timer = setInterval(persist, 3000);
    const hide = () => {
      persist();
      if (document.hidden) sound.current?.pause();
      else if (audioOn.current) sound.current?.start().catch(() => {});
    };
    document.addEventListener('visibilitychange', hide);
    return () => {
      cancelled = true;
      persist();
      clearInterval(timer);
      document.removeEventListener('visibilitychange', hide);
      own?.destroy();
      sound.current?.dispose();
    };
  }, []);

  useEffect(() => {
    menuOpen.current = !!menu;
    engine.current?.pause(!!menu || findOpen.current);
    if (menu) dialog.current?.querySelector('button')?.focus();
    else if (ready && !findOpen.current) host.current?.focus();
  }, [menu, ready]);

  function close() {
    setMenu(null);
  }

  function select(id) {
    close();
    engine.current?.visit(id);
  }

  function key(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab' && menu) {
      const items = [...dialog.current.querySelectorAll('button')];
      const first = items[0];
      const last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  async function toggle() {
    if (audioOn.current) {
      sound.current.pause();
      audioOn.current = false;
      setAudio(false);
    } else
      try {
        audioOn.current = !!(await sound.current.start());
        setAudio(audioOn.current);
      } catch {
        setNotice('Audio is unavailable; you can still walk the street.');
      }
  }

  return (
    <section className={s.game} onKeyDown={key} aria-label="Walk Charminar street — find one door">
      <div
        ref={host}
        className={s.stage}
        tabIndex={0}
        role="region"
        aria-label="Game street. Tap to walk. WASD or arrows move. E inspects."
      />

      <FindOneQuest
        ready={ready}
        foundPersonId={foundPersonId}
        onConsumeFind={() => setFoundPersonId(null)}
        onPause={pauseFind}
        onHighlight={(id) => engine.current?.highlight(id)}
      />

      <header className={s.header}>
        <a
          href="/"
          aria-label="Return to map"
          onClick={(e) => {
            if (onClose) {
              e.preventDefault();
              onClose();
            }
          }}
        >
          ←
        </a>
        <div>
          <b>Mapping HYD</b>
          <small>OLD CITY EVENING · ONE NEIGHBOUR</small>
        </div>
        <nav>
          <button onClick={toggle} aria-pressed={audio}>
            ♪ <span className={s.audioLabel}>{audio ? 'Sound on' : 'Sound off'}</span>
          </button>
          <button onClick={() => setMenu('explore')}>Places</button>
        </nav>
      </header>

      {!ready && (
        <div className={s.loading}>
          {error || 'Opening a longer street…'}
          {error && <button onClick={() => location.reload()}>Reload</button>}
        </div>
      )}

      <footer className={s.footer}>
        <small>
          {ui.phase === 'closing' ? 'THE LAST CUP BEFORE CLOSING' : ui.phase === 'lamplight' ? 'THE LAMPS ARE COMING ON' : 'THE LAST OF THE AFTERNOON'}
        </small>
        <h1>{ui.district.name}</h1>
        <p>{ui.destination ? `Walking to ${ui.destination}…` : ui.district.detail}</p>
        <div className={s.hint}>Tap to walk · tap people to match the scrap · WASD / E</div>
      </footer>

      <div className={s.controls}>
        <button onClick={() => engine.current?.zoom(0.85)} aria-label="Zoom out">−</button>
        <button onClick={() => engine.current?.back()}>Back to me</button>
        <button onClick={() => engine.current?.zoom(1.15)} aria-label="Zoom in">+</button>
      </div>

      {ready && (
        <div className={s.action}>
          {ui.busy ? (
            <p role="status">{ui.caption}</p>
          ) : ui.near ? (
            <button onClick={() => engine.current?.visit(ui.near.id)}>
              {ui.near.icon} {ui.near.name} <kbd>E</kbd>
            </button>
          ) : null}
        </div>
      )}

      {notice && (
        <p className={s.notice} role="status">
          {notice}
        </p>
      )}

      {menu && (
        <div className={s.scrim}>
          <section ref={dialog} className={s.panel} role="dialog" aria-modal="true" aria-label="Places on the street">
            <button className={s.close} onClick={close} aria-label="Close menu">×</button>
            {menu === 'explore' && (
              <>
                <small>WALK THE STREET</small>
                <h2>Places ahead.</h2>
                <p>A scrap at Bashir’s counter describes one neighbour. Recognise her among the evening crowd — everything else is the bazaar living around you.</p>
                <div className={s.places}>
                  {DISTRICTS.map((d) => (
                    <button key={d.id} disabled={!ready || ui.busy} onClick={() => { close(); engine.current?.go(d.id); }}>
                      {d.name}
                      <span>↗</span>
                    </button>
                  ))}
                </div>
                <h3>People you can stop for</h3>
                <div className={s.people}>
                  {Object.entries(ACTIVITIES).map(([id, a]) => (
                    <button key={id} disabled={!ready || ui.busy} onClick={() => select(id)}>
                      {a.icon} {a.person}
                      <small>{a.name}</small>
                    </button>
                  ))}
                </div>
                <p className={s.fine}>Fictional Old City street. Audio is synthesized.</p>
              </>
            )}
            {menu === 'choice' && choice && (
              <>
                <small>{ACTIVITIES[choice].person.toUpperCase()}</small>
                <h2>{choice === 'bangles' ? 'Here, in the light.' : 'A tune for the street.'}</h2>
                <p>{ACTIVITIES[choice].greeting}</p>
                <div className={s.choices}>
                  {(choice === 'bangles'
                    ? [['red', 'Pomegranate red'], ['green', 'Bottle green']]
                    : [['red', 'Evening melody'], ['courtyard', 'Courtyard waltz']]
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => {
                        close();
                        engine.current?.interact(choice, value);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </section>
  );
}

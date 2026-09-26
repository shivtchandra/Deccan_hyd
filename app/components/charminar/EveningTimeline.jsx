'use client';

import styles from './evening.module.css';

/** Filmstrip timeline — Mapping HYD moment plates as frames you walk through. */
export default function EveningTimeline({ moments, activeId, progressPct = 0, onSelect, className }) {
  return (
    <nav className={`${styles.timeline} ${className || ''}`} aria-label="Evening timeline">
      <span className={styles.timelineLabel}>THE EVENING · A CONTINUOUS WALK</span>
      <div className={styles.timelineTrack} role="list">
        <i className={styles.timelineProgress} style={{ width: `${Math.max(8, progressPct)}%` }} aria-hidden="true" />
        {moments.map((m, i) => {
          const current = m.id === activeId;
          return (
            <button
              key={m.id}
              type="button"
              role="listitem"
              aria-current={current ? 'true' : undefined}
              aria-label={`${m.time}: ${m.name}. ${m.caption}`}
              onClick={() => onSelect(m.id)}
              className={`${styles.timelineFrame} ${current ? styles.timelineFrameCurrent : ''}`}
            >
              <span className={styles.timelineThumb}>
                <img src={m.thumb} alt="" draggable={false} />
              </span>
              <span className={styles.timelineMeta}>
                <em>{String(i + 1).padStart(2, '0')} · {m.time}</em>
                <strong>{m.name}</strong>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

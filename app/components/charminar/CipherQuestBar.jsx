'use client';

import styles from './evening.module.css';

/** Quiet caption-style objective for the continuous photo reel. */
export default function CipherQuestBar({
  chapter,
  progress,
  clues,
  hintText,
  hintsLeft,
  feedback,
  className,
  onGo,
  onHint,
  onOpenBox,
  onApply,
  canApply,
}) {
  if (!chapter && progress?.pct === 100) {
    return (
      <div className={className}>
        <button type="button" className={`${styles.photoCaption} ${styles.photoCaptionDone}`} onClick={onOpenBox}>
          <span className={styles.photoEyebrow}>Evening complete · {progress.done}/{progress.total}</span>
          <strong>The courtyard is yours to linger in.</strong>
          <small>Open the heirloom box whenever you like.</small>
        </button>
      </div>
    );
  }

  if (!chapter) return null;

  const kind =
    chapter.kind === 'spot' ? 'Look closer'
      : chapter.kind === 'apply' ? 'Use what you found'
        : chapter.kind === 'finale' ? 'Finale'
          : 'Along the evening';

  return (
    <div className={className}>
      <button type="button" className={styles.photoCaption} onClick={onGo} aria-label={`Continue: ${chapter.title}`}>
        <span className={styles.photoEyebrow}>{kind} · {progress.done}/{progress.total}</span>
        <strong>{chapter.title}</strong>
        <small>{hintText || chapter.hint}</small>
      </button>

      {clues.length > 0 && (
        <div className={styles.photoClues} aria-label="Clues gathered">
          {clues.map((clue) => (
            <span key={clue.id} title={clue.summary}>
              <span aria-hidden="true">{clue.icon}</span> {clue.name}
            </span>
          ))}
        </div>
      )}

      <div className={styles.photoActions}>
        {chapter.kind === 'apply' && (
          <button type="button" className={styles.photoPrimary} onClick={onApply} disabled={!canApply}>
            Apply to box
          </button>
        )}
        <button type="button" className={styles.photoGhost} onClick={onOpenBox}>Box</button>
        <button type="button" className={styles.photoGhost} onClick={onHint} disabled={hintsLeft <= 0}>
          Hint · {hintsLeft}
        </button>
      </div>

      {feedback && <p className={styles.photoFeedback} role="status">{feedback}</p>}
    </div>
  );
}

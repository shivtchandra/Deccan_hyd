'use client';

/**
 * Spot-the-detail mini-puzzle (adapted from yi-jy/find-different careful looking,
 * without timers — heritage tone prefers lingering).
 */
export default function SpotDetailPuzzle({
  puzzle,
  wrongCount = 0,
  onPick,
  onClose,
  busy = false,
}) {
  if (!puzzle) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10050,
        background: 'rgba(20, 28, 26, 0.62)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: '"Outfit", sans-serif',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="spot-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          overflow: 'auto',
          background: '#f3ecd9',
          color: '#332e26',
          border: '1px solid #fff6e0',
          borderRadius: 6,
          boxShadow: '0 18px 50px rgba(10,16,18,0.45)',
          padding: '28px 24px 22px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
          <div>
            <p style={{ margin: 0, fontSize: 10, letterSpacing: '0.18em', color: '#8a7040', fontWeight: 700 }}>
              LOOK CLOSER · SPOT THE DETAIL
            </p>
            <h2 id="spot-title" style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 26, margin: '8px 0 0', letterSpacing: '-0.03em' }}>
              {puzzle.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close detail puzzle"
            style={{
              width: 44,
              height: 44,
              border: 0,
              background: 'transparent',
              color: '#554c3d',
              fontSize: 22,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <p style={{ margin: '14px 0 6px', fontSize: 14, lineHeight: 1.65, color: '#4a4338' }}>
          {puzzle.prompt}
        </p>
        <p style={{ margin: '0 0 18px', fontSize: 12, color: '#7a6a4e', fontStyle: 'italic' }}>
          Ghost hint: {puzzle.ghostHint}
        </p>

        <div style={{ display: 'grid', gap: 8 }}>
          {puzzle.options.map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={busy}
              onClick={() => onPick(option.id)}
              style={{
                textAlign: 'left',
                minHeight: 52,
                padding: '12px 14px',
                borderRadius: 4,
                border: '1px solid #d9c9a4',
                background: '#fff8e9',
                color: '#2f2a22',
                cursor: busy ? 'wait' : 'pointer',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {wrongCount > 0 && (
          <p role="status" style={{ margin: '14px 0 0', fontSize: 12, color: '#9a3936' }}>
            {wrongCount === 1
              ? 'Not that one — the scrap is more particular.'
              : `${wrongCount} near-misses. Slow down and compare each mark.`}
          </p>
        )}
      </div>
    </div>
  );
}

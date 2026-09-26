'use client';

import { useState } from 'react';
import { LOCK_DEFINITIONS, saveHeirloomState } from './heirloom-mystery.mjs';

export default function HeirloomJournalModal({
  state,
  setState,
  onClose,
  onOpenBox,
}) {
  const [selectedLock, setSelectedLock] = useState('lock1');

  const advanceHint = (lockId) => {
    const curr = state.hintsUsed[lockId] || 0;
    if (curr >= 3) return;
    const updated = {
      ...state,
      hintsUsed: {
        ...state.hintsUsed,
        [lockId]: curr + 1,
      },
    };
    setState(updated);
    saveHeirloomState(updated);
  };

  const lock = LOCK_DEFINITIONS[selectedLock];
  const hintLevel = state.hintsUsed[selectedLock] || 0;
  const isUnlocked = state.unlocked[selectedLock];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(43, 33, 25, 0.55)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Detective Case Journal"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '90vh',
          borderRadius: 20,
          background: '#FAF6EE',
          border: '1.5px solid #DDD0B8',
          boxShadow: '0 20px 60px rgba(43, 33, 25, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#2B2119',
        }}
      >
        {/* Header Hero Strip */}
        <div
          style={{
            padding: '16px 22px',
            background: 'linear-gradient(135deg, #2B2119 0%, #4A3B2C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff',
            boxShadow: '0 2px 10px rgba(43,33,25,0.25)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10.5,
                letterSpacing: '0.12em',
                color: '#FDE68A',
                textTransform: 'uppercase',
                fontWeight: 800,
              }}
            >
              Old City Detective Casebook · Circa 1985
            </div>
            <h2
              style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: 21,
                margin: '2px 0 0',
                color: '#fff',
                letterSpacing: '-0.02em',
              }}
            >
              The Case of the Nizam&rsquo;s Lost Heirloom
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              borderRadius: '50%',
              width: 32,
              height: 32,
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close journal"
          >
            ×
          </button>
        </div>

        {/* Narrative Prelude */}
        <div
          style={{
            padding: '12px 22px',
            background: '#F3E7CC',
            borderBottom: '1px solid #DDD0B8',
            fontSize: 12.5,
            lineHeight: 1.5,
            color: '#554637',
          }}
        >
          An antique Asaf Jahi jewelry box rests in the hidden courtyard.
          Its four cipher latches were designed to be unlocked only by someone who knows the everyday life of Charminar:
          its lacquer bangle secrets, clock tower dials, broadcast melodies, and doorway seals.
        </div>

        {/* Lock Selector Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            padding: '10px 16px',
            background: '#FAF6EE',
            borderBottom: '1px solid #DDD0B8',
            overflowX: 'auto',
          }}
        >
          {Object.entries(LOCK_DEFINITIONS).map(([id, def]) => {
            const unlocked = state.unlocked[id];
            const isSel = selectedLock === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedLock(id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: isSel ? '1.5px solid #2B2119' : '1px solid #DDD0B8',
                  background: isSel ? '#2B2119' : unlocked ? '#DCFCE7' : '#FAF6EE',
                  color: isSel ? '#FAF6EE' : unlocked ? '#15803d' : '#6B5D4C',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <span>{unlocked ? '✓' : '🔒'}</span>
                <span>{def.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Clue & Hint Details */}
        <div style={{ flex: 1, padding: '18px 22px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 11, color: '#8B3A1A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                {lock.subtitle}
              </span>
              <h3 style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 18, color: '#2B2119', margin: '2px 0 0' }}>
                {lock.name}
              </h3>
            </div>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 999,
                background: isUnlocked ? '#DCFCE7' : '#FEF3C7',
                color: isUnlocked ? '#15803d' : '#8B3A1A',
                border: isUnlocked ? '1px solid #86EFAC' : '1px solid #FDE68A',
              }}
            >
              {isUnlocked ? 'Unlocked ✓' : 'Cipher Locked 🔒'}
            </span>
          </div>

          {/* Historical Fact box (Quotation card style) */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '0 10px 10px 0',
              background: '#F3E7CC',
              borderLeft: '4px solid #8B3A1A',
              fontSize: 12.5,
              color: '#4B3F33',
              lineHeight: 1.5,
              marginBottom: 18,
            }}
          >
            <strong style={{ color: '#8B3A1A' }}>🏛️ Heritage Lore: </strong>{lock.fact}
          </div>

          {/* Progressive 3-Tier Hints */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#6B5D4C', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Investigation Clues & Deductions
            </div>

            {/* Hint 1: Gentle Clue */}
            <div style={{ padding: '10px 14px', borderRadius: 8, background: hintLevel >= 1 ? '#FFF' : '#F3ECE0', border: '1px solid #DDD0B8', marginBottom: 10 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: '#8B3A1A', letterSpacing: '0.04em' }}>LEVEL 1 · GENTLE CLUE</div>
              <div style={{ fontSize: 13, color: hintLevel >= 1 ? '#2B2119' : '#8A7B6B', marginTop: 3, fontStyle: hintLevel >= 1 ? 'normal' : 'italic' }}>
                {hintLevel >= 1 ? lock.hint1 : 'Clue hidden. Click button below to reveal.'}
              </div>
            </div>

            {/* Hint 2: Location Pointer */}
            <div style={{ padding: '10px 14px', borderRadius: 8, background: hintLevel >= 2 ? '#FFF' : '#F3ECE0', border: '1px solid #DDD0B8', marginBottom: 10 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: '#C2603A', letterSpacing: '0.04em' }}>LEVEL 2 · LOCATION POINTER</div>
              <div style={{ fontSize: 13, color: hintLevel >= 2 ? '#2B2119' : '#8A7B6B', marginTop: 3, fontStyle: hintLevel >= 2 ? 'normal' : 'italic' }}>
                {hintLevel >= 2 ? lock.hint2 : 'Location pointer hidden.'}
              </div>
            </div>

            {/* Hint 3: Full Deduction */}
            <div style={{ padding: '10px 14px', borderRadius: 8, background: hintLevel >= 3 ? '#FFF' : '#F3ECE0', border: '1px solid #DDD0B8', marginBottom: 12 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: '#15803d', letterSpacing: '0.04em' }}>LEVEL 3 · FULL DEDUCTION</div>
              <div style={{ fontSize: 13, color: hintLevel >= 3 ? '#2B2119' : '#8A7B6B', marginTop: 3, fontStyle: hintLevel >= 3 ? 'normal' : 'italic' }}>
                {hintLevel >= 3 ? lock.hint3 : 'Exact solution hidden.'}
              </div>
            </div>

            {hintLevel < 3 && (
              <button
                onClick={() => advanceHint(selectedLock)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  background: '#8B3A1A',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 8px rgba(139,58,26,0.2)',
                }}
              >
                🔍 Reveal Next Clue ({hintLevel}/3)
              </button>
            )}
          </div>
        </div>

        {/* Footer with Box Access */}
        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid #DDD0B8',
            background: '#F3E7CC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 12, color: '#6B5D4C' }}>
            Ready to test your deductions on the locks?
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenBox?.();
            }}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #8B3A1A 0%, #C2603A 100%)',
              border: 'none',
              color: '#fff',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(139,58,26,0.25)',
            }}
          >
            🎁 Open Heirloom Box →
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  LOCK_DEFINITIONS,
  BANGLE_COLORS,
  checkLock1,
  checkLock2,
  checkLock3,
  checkLock4,
  countUnlocked,
  isBoxFullyUnlocked,
  saveHeirloomState,
} from './heirloom-mystery.mjs';

const COLOR_MAP = {
  green: { label: 'Emerald Green', hex: '#15803d', border: '#14532d' },
  red: { label: 'Pomegranate Red', hex: '#b91c1c', border: '#7f1d1d' },
  blue: { label: 'Feroza Blue', hex: '#0284c7', border: '#0369a1' },
  gold: { label: 'Zari Gold', hex: '#d97706', border: '#b45309' },
};

const ORIENTATIONS = ['up', 'right', 'down', 'left'];
const ORIENTATION_DEG = { up: 0, right: 90, down: 180, left: 270 };

export default function HeirloomBoxModal({
  state,
  setState,
  sound,
  onClose,
  onOpenJournal,
  onAwardSleuth,
}) {
  const [activeTab, setActiveTab] = useState('lock1');
  const [revealed, setRevealed] = useState(isBoxFullyUnlocked(state.unlocked));
  const [awardMessage, setAwardMessage] = useState('');

  const unlockedCount = countUnlocked(state.unlocked);
  const fullyUnlocked = isBoxFullyUnlocked(state.unlocked);

  // Trigger celebration when all 4 are unlocked
  useEffect(() => {
    if (fullyUnlocked && !state.completedAt) {
      sound?.boxVictory();
      setRevealed(true);
      const updated = {
        ...state,
        completedAt: new Date().toISOString(),
      };
      setState(updated);
      saveHeirloomState(updated);
      onAwardSleuth?.();
      setAwardMessage('+150 Points & Master Sleuth of the Old City Badge Awarded!');
    }
  }, [fullyUnlocked]);

  // Handle Lock 1 (Bangles ring cycle)
  const cycleRing = (ringIndex) => {
    if (state.unlocked.lock1) return;
    sound?.tumblerClick();
    const current = state.values.lock1[ringIndex];
    const nextIdx = (BANGLE_COLORS.indexOf(current) + 1) % BANGLE_COLORS.length;
    const nextColor = BANGLE_COLORS[nextIdx];
    const newRings = [...state.values.lock1];
    newRings[ringIndex] = nextColor;

    const isMatch = checkLock1(newRings);
    if (isMatch) sound?.lockUnlocked();

    const updated = {
      ...state,
      values: { ...state.values, lock1: newRings },
      unlocked: { ...state.unlocked, lock1: isMatch },
    };
    setState(updated);
    saveHeirloomState(updated);
  };

  // Handle Lock 2 (Clock)
  const adjustClock = (type, delta) => {
    if (state.unlocked.lock2) return;
    sound?.tumblerClick();
    let { hour, minute } = state.values.lock2;
    if (type === 'hour') {
      hour = ((hour - 1 + delta + 12) % 12) + 1;
    } else {
      minute = (minute + delta * 5 + 60) % 60;
    }
    const newTime = { hour, minute };
    const isMatch = checkLock2(newTime);
    if (isMatch) sound?.lockUnlocked();

    const updated = {
      ...state,
      values: { ...state.values, lock2: newTime },
      unlocked: { ...state.unlocked, lock2: isMatch },
    };
    setState(updated);
    saveHeirloomState(updated);
  };

  // Handle Lock 3 (Radio frequency slider)
  const handleFreqChange = (freq) => {
    if (state.unlocked.lock3) return;
    sound?.radioTuning(freq);
    const isMatch = checkLock3(freq);
    if (isMatch && !state.unlocked.lock3) sound?.lockUnlocked();

    const updated = {
      ...state,
      values: { ...state.values, lock3: freq },
      unlocked: { ...state.unlocked, lock3: isMatch },
    };
    setState(updated);
    saveHeirloomState(updated);
  };

  // Handle Lock 4 (Crescent Seal rotation)
  const rotateSeal = () => {
    if (state.unlocked.lock4) return;
    sound?.tumblerClick();
    const curr = state.values.lock4;
    const nextIdx = (ORIENTATIONS.indexOf(curr) + 1) % ORIENTATIONS.length;
    const nextOrient = ORIENTATIONS[nextIdx];
    const isMatch = checkLock4(nextOrient);
    if (isMatch) sound?.lockUnlocked();

    const updated = {
      ...state,
      values: { ...state.values, lock4: nextOrient },
      unlocked: { ...state.unlocked, lock4: isMatch },
    };
    setState(updated);
    saveHeirloomState(updated);
  };

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
      aria-label="The Nizam's Lost Heirloom Box"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 660,
          maxHeight: '92vh',
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
            background: 'linear-gradient(135deg, #8B3A1A 0%, #C2603A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff',
            boxShadow: '0 2px 10px rgba(139,58,26,0.25)',
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
              Asaf Jahi Royal Relic · 4-Cipher Casket
            </div>
            <h2
              style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: 22,
                margin: '2px 0 0',
                color: '#fff',
                letterSpacing: '-0.02em',
              }}
            >
              The Nizam&rsquo;s Lost Heirloom Box
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 999,
                background: fullyUnlocked ? '#15803d' : 'rgba(255,255,255,0.22)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.4)',
                letterSpacing: '0.04em',
              }}
            >
              {unlockedCount}/4 Ciphers Solved
            </span>
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
              aria-label="Close box"
            >
              ×
            </button>
          </div>
        </div>

        {/* Grand Reveal Screen if solved */}
        {revealed && fullyUnlocked ? (
          <div style={{ padding: '36px 24px', textAlign: 'center', overflowY: 'auto' }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>
              ✨ 🦪 ✨
            </div>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: '#8B3A1A', textTransform: 'uppercase', fontWeight: 800 }}>
              The Casket Springs Open!
            </div>
            <h3
              style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: 28,
                color: '#2B2119',
                margin: '6px 0 12px',
                letterSpacing: '-0.02em',
              }}
            >
              The Nizam&rsquo;s Royal Basra Pearl
            </h3>
            <p style={{ maxWidth: 500, margin: '0 auto 20px', color: '#6B5D4C', fontSize: 14, lineHeight: 1.6 }}>
              Resting upon deep crimson velvet lies an iridescent Basra natural pearl, set within an Asaf Jahi gold filigree talisman.
              A handwritten court seal from 1891 attests to its royal provenance. You have solved the four ciphers woven into the memory of Charminar!
            </p>

            {awardMessage && (
              <div
                style={{
                  display: 'inline-block',
                  padding: '9px 18px',
                  borderRadius: 999,
                  background: '#F6E2D6',
                  border: '1.5px solid #8B3A1A',
                  color: '#8B3A1A',
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 24,
                }}
              >
                🏆 {awardMessage}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 6 }}>
              <button
                onClick={() => setRevealed(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  background: '#FAF6EE',
                  border: '1.5px solid #DDD0B8',
                  color: '#2B2119',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Inspect Ciphers Again
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 22px',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #8B3A1A 0%, #C2603A 100%)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 13,
                  boxShadow: '0 4px 14px rgba(139,58,26,0.3)',
                }}
              >
                Return to the Bazaar →
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Lock Navigation Tabs (Styled identical to FilterBar chips) */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                padding: '10px 16px',
                background: '#F3E7CC',
                borderBottom: '1px solid #DDD0B8',
                overflowX: 'auto',
              }}
            >
              {[
                { id: 'lock1', label: '1. Lacquer Rings', icon: '◎' },
                { id: 'lock2', label: '2. 1889 Clock', icon: '🕒' },
                { id: 'lock3', label: '3. Radio Tuner', icon: '📻' },
                { id: 'lock4', label: '4. Crescent Seal', icon: '🌙' },
              ].map((tab) => {
                const isUnlocked = state.unlocked[tab.id];
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      border: isSelected ? '1.5px solid #2B2119' : '1px solid #DDD0B8',
                      background: isSelected ? '#2B2119' : isUnlocked ? '#DCFCE7' : '#FAF6EE',
                      color: isSelected ? '#FAF6EE' : isUnlocked ? '#15803d' : '#6B5D4C',
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
                    <span>{isUnlocked ? '✓' : tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Lock Workspace */}
            <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
              {/* LOCK 1: BANGLES */}
              {activeTab === 'lock1' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#8B3A1A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                    {LOCK_DEFINITIONS.lock1.subtitle}
                  </div>
                  <h3 style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, color: '#2B2119', margin: '3px 0 10px' }}>
                    {LOCK_DEFINITIONS.lock1.name}
                  </h3>
                  <p style={{ fontSize: 13, color: '#6B5D4C', maxWidth: 460, margin: '0 auto 18px', lineHeight: 1.5 }}>
                    Click each concentric lacquer bangle ring to rotate its color. Match the secret royal sequence to release the first latch.
                  </p>

                  {/* Concentric Bangle Rings Tray */}
                  <div
                    style={{
                      width: 220,
                      height: 220,
                      margin: '0 auto 18px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#F3ECE0',
                      borderRadius: '50%',
                      border: '2px solid #DDD0B8',
                      boxShadow: 'inset 0 2px 10px rgba(43,33,25,0.08)',
                    }}
                  >
                    {/* Outer Ring */}
                    <button
                      onClick={() => cycleRing(0)}
                      title="Click to cycle Outer Ring"
                      style={{
                        position: 'absolute',
                        width: 204,
                        height: 204,
                        borderRadius: '50%',
                        border: `16px solid ${COLOR_MAP[state.values.lock1[0]].hex}`,
                        background: 'transparent',
                        cursor: state.unlocked.lock1 ? 'default' : 'pointer',
                        boxShadow: `0 0 12px ${COLOR_MAP[state.values.lock1[0]].hex}44`,
                        transition: 'border-color 0.25s, transform 0.15s',
                      }}
                    />
                    {/* Middle Ring */}
                    <button
                      onClick={() => cycleRing(1)}
                      title="Click to cycle Middle Ring"
                      style={{
                        position: 'absolute',
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        border: `16px solid ${COLOR_MAP[state.values.lock1[1]].hex}`,
                        background: 'transparent',
                        cursor: state.unlocked.lock1 ? 'default' : 'pointer',
                        boxShadow: `0 0 12px ${COLOR_MAP[state.values.lock1[1]].hex}44`,
                        transition: 'border-color 0.25s, transform 0.15s',
                      }}
                    />
                    {/* Inner Ring */}
                    <button
                      onClick={() => cycleRing(2)}
                      title="Click to cycle Inner Ring"
                      style={{
                        position: 'absolute',
                        width: 76,
                        height: 76,
                        borderRadius: '50%',
                        border: `14px solid ${COLOR_MAP[state.values.lock1[2]].hex}`,
                        background: '#FAF6EE',
                        cursor: state.unlocked.lock1 ? 'default' : 'pointer',
                        boxShadow: `0 0 12px ${COLOR_MAP[state.values.lock1[2]].hex}44`,
                        transition: 'border-color 0.25s, transform 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: state.unlocked.lock1 ? '#15803d' : '#8B3A1A',
                        fontSize: 16,
                        fontWeight: 800,
                      }}
                    >
                      {state.unlocked.lock1 ? '✓' : '◎'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 14, fontSize: 12, color: '#4B3F33' }}>
                    <span>Outer: <strong>{COLOR_MAP[state.values.lock1[0]].label}</strong></span>
                    <span>Middle: <strong>{COLOR_MAP[state.values.lock1[1]].label}</strong></span>
                    <span>Inner: <strong>{COLOR_MAP[state.values.lock1[2]].label}</strong></span>
                  </div>

                  {state.unlocked.lock1 && (
                    <div style={{ marginTop: 14, color: '#15803d', fontWeight: 800, fontSize: 13 }}>
                      🔓 Lacquer Rings Aligned! Latch 1 Released.
                    </div>
                  )}
                </div>
              )}

              {/* LOCK 2: CLOCK */}
              {activeTab === 'lock2' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#8B3A1A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                    {LOCK_DEFINITIONS.lock2.subtitle}
                  </div>
                  <h3 style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, color: '#2B2119', margin: '3px 0 10px' }}>
                    {LOCK_DEFINITIONS.lock2.name}
                  </h3>
                  <p style={{ fontSize: 13, color: '#6B5D4C', maxWidth: 460, margin: '0 auto 18px', lineHeight: 1.5 }}>
                    Adjust the Charminar 1889 Vulliamy clock dial to the exact evening hour when the bazaar springs to life.
                  </p>

                  {/* Clock Face Display */}
                  <div
                    style={{
                      width: 184,
                      height: 184,
                      margin: '0 auto 18px',
                      borderRadius: '50%',
                      border: '6px double #8B3A1A',
                      background: '#FAF6EE',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(43,33,25,0.12)',
                    }}
                  >
                    {/* Hour markings */}
                    {[12, 3, 6, 9].map((num) => {
                      const deg = (num % 12) * 30;
                      return (
                        <span
                          key={num}
                          style={{
                            position: 'absolute',
                            fontSize: 12,
                            fontWeight: 800,
                            color: '#8B3A1A',
                            fontFamily: '"Fraunces", serif',
                            transform: `rotate(${deg}deg) translate(0, -68px) rotate(-${deg}deg)`,
                          }}
                        >
                          {num === 12 ? 'XII' : num === 3 ? 'III' : num === 6 ? 'VI' : 'IX'}
                        </span>
                      );
                    })}

                    {/* Clock Hands */}
                    {/* Hour Hand */}
                    <div
                      style={{
                        position: 'absolute',
                        width: 4,
                        height: 48,
                        background: '#2B2119',
                        borderRadius: 3,
                        top: 44,
                        transformOrigin: 'bottom center',
                        transform: `rotate(${state.values.lock2.hour * 30 + state.values.lock2.minute * 0.5}deg)`,
                        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    />
                    {/* Minute Hand */}
                    <div
                      style={{
                        position: 'absolute',
                        width: 2.5,
                        height: 68,
                        background: '#C2603A',
                        borderRadius: 3,
                        top: 24,
                        transformOrigin: 'bottom center',
                        transform: `rotate(${state.values.lock2.minute * 6}deg)`,
                        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    />
                    {/* Center Pin */}
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#8B3A1A', zIndex: 2 }} />
                  </div>

                  {/* Time Adjust Controls */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11.5, color: '#2B2119', fontWeight: 700, marginBottom: 4 }}>
                        HOUR: {state.values.lock2.hour}
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => adjustClock('hour', -1)}
                          disabled={state.unlocked.lock2}
                          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #DDD0B8', background: '#FAF6EE', color: '#2B2119', cursor: 'pointer', fontWeight: 700 }}
                        >
                          -1h
                        </button>
                        <button
                          onClick={() => adjustClock('hour', 1)}
                          disabled={state.unlocked.lock2}
                          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #DDD0B8', background: '#FAF6EE', color: '#2B2119', cursor: 'pointer', fontWeight: 700 }}
                        >
                          +1h
                        </button>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 11.5, color: '#C2603A', fontWeight: 700, marginBottom: 4 }}>
                        MINUTE: {String(state.values.lock2.minute).padStart(2, '0')}
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => adjustClock('minute', -1)}
                          disabled={state.unlocked.lock2}
                          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #DDD0B8', background: '#FAF6EE', color: '#C2603A', cursor: 'pointer', fontWeight: 700 }}
                        >
                          -5m
                        </button>
                        <button
                          onClick={() => adjustClock('minute', 1)}
                          disabled={state.unlocked.lock2}
                          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #DDD0B8', background: '#FAF6EE', color: '#C2603A', cursor: 'pointer', fontWeight: 700 }}
                        >
                          +5m
                        </button>
                      </div>
                    </div>
                  </div>

                  {state.unlocked.lock2 && (
                    <div style={{ marginTop: 14, color: '#15803d', fontWeight: 800, fontSize: 13 }}>
                      🔓 1889 Clock Mechanism Engaged! Latch 2 Released.
                    </div>
                  )}
                </div>
              )}

              {/* LOCK 3: RADIO */}
              {activeTab === 'lock3' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#8B3A1A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                    {LOCK_DEFINITIONS.lock3.subtitle}
                  </div>
                  <h3 style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, color: '#2B2119', margin: '3px 0 10px' }}>
                    {LOCK_DEFINITIONS.lock3.name}
                  </h3>
                  <p style={{ fontSize: 13, color: '#6B5D4C', maxWidth: 460, margin: '0 auto 18px', lineHeight: 1.5 }}>
                    Slide the frequency tuner until the green indicator tube glows brightest and the Akashvani Hyderabad transmission locks in.
                  </p>

                  {/* Radio Chassis */}
                  <div
                    style={{
                      maxWidth: 420,
                      margin: '0 auto 18px',
                      padding: '18px 22px',
                      borderRadius: 12,
                      background: '#FAF6EE',
                      border: '2px solid #8B3A1A',
                      boxShadow: '0 4px 16px rgba(43,33,25,0.08)',
                    }}
                  >
                    {/* Tuning Tube Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: '#8B3A1A', fontWeight: 800, letterSpacing: '0.05em' }}>
                        AM BROADCAST BAND (MEDIUM WAVE)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10.5, color: '#6B5D4C', fontWeight: 600 }}>MAGIC EYE</span>
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            background:
                              Math.abs(state.values.lock3 - 880) <= 15
                                ? '#22c55e'
                                : Math.abs(state.values.lock3 - 880) <= 60
                                ? '#84cc16'
                                : '#cbd5e1',
                            boxShadow:
                              Math.abs(state.values.lock3 - 880) <= 15
                                ? '0 0 10px #22c55e'
                                : 'none',
                            transition: 'all 0.2s',
                          }}
                        />
                      </div>
                    </div>

                    {/* Frequency Slider */}
                    <div style={{ position: 'relative', margin: '18px 0' }}>
                      <input
                        type="range"
                        min="600"
                        max="1400"
                        step="5"
                        value={state.values.lock3}
                        onChange={(e) => handleFreqChange(Number(e.target.value))}
                        disabled={state.unlocked.lock3}
                        style={{
                          width: '100%',
                          height: 8,
                          borderRadius: 4,
                          accentColor: '#8B3A1A',
                          cursor: state.unlocked.lock3 ? 'default' : 'pointer',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#6B5D4C', marginTop: 8 }}>
                        <span>600 kHz</span>
                        <span>880 kHz (Hyd A)</span>
                        <span>1278 kHz (VB)</span>
                        <span>1400 kHz</span>
                      </div>
                    </div>

                    <div style={{ fontSize: 20, fontFamily: 'monospace', color: '#8B3A1A', fontWeight: 800, marginTop: 8 }}>
                      {state.values.lock3} kHz
                    </div>
                  </div>

                  {state.unlocked.lock3 && (
                    <div style={{ marginTop: 14, color: '#15803d', fontWeight: 800, fontSize: 13 }}>
                      🔓 Akashvani 880 kHz Broadcast Captured! Latch 3 Released.
                    </div>
                  )}
                </div>
              )}

              {/* LOCK 4: SEAL */}
              {activeTab === 'lock4' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#8B3A1A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                    {LOCK_DEFINITIONS.lock4.subtitle}
                  </div>
                  <h3 style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, color: '#2B2119', margin: '3px 0 10px' }}>
                    {LOCK_DEFINITIONS.lock4.name}
                  </h3>
                  <p style={{ fontSize: 13, color: '#6B5D4C', maxWidth: 460, margin: '0 auto 18px', lineHeight: 1.5 }}>
                    Click the brass royal seal medallion to rotate its crescent horns into alignment with the courtyard archway.
                  </p>

                  {/* Rotating Brass Seal */}
                  <div
                    style={{
                      width: 174,
                      height: 174,
                      margin: '0 auto 18px',
                      borderRadius: '50%',
                      background: '#FAF6EE',
                      border: '5px solid #8B3A1A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: state.unlocked.lock4 ? 'default' : 'pointer',
                      boxShadow: '0 4px 20px rgba(43,33,25,0.12)',
                      transform: `rotate(${ORIENTATION_DEG[state.values.lock4]}deg)`,
                      transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                    onClick={rotateSeal}
                    title="Click to rotate seal medallion"
                  >
                    {/* Crescent Icon */}
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        boxShadow: '18px 0 0 0 #8B3A1A',
                        transform: 'rotate(-90deg)',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: 12.5, color: '#2B2119' }}>
                    Orientation: <strong>Crescent facing {state.values.lock4.toUpperCase()}</strong> (Tap medallion to rotate)
                  </div>

                  {state.unlocked.lock4 && (
                    <div style={{ marginTop: 14, color: '#15803d', fontWeight: 800, fontSize: 13 }}>
                      🔓 Royal Asaf Jahi Seal Engaged! Latch 4 Released.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer with Clue Journal Link & Trivia */}
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
                💡 Need a clue? Inspect characters and landmarks in the bazaar lanes.
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenJournal?.();
                }}
                style={{
                  padding: '7px 15px',
                  borderRadius: 8,
                  background: '#FAF6EE',
                  border: '1.5px solid #8B3A1A',
                  color: '#8B3A1A',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                📖 Open Detective Journal →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

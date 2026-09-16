"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { HISTORICAL_PERIODS } from "../../lib/heritageData.js";
import { Icon } from "./Icons.jsx";

const MIN_YEAR = 1562;
const MAX_YEAR = 2026;
const BASE_PLAY_SPEED = 18; // base years per second (1x = ~25s full timelapse)

const TICK_YEARS = [1562, 1687, 1798, 1908, 1948, 2026];
const SPEEDS = [0.5, 1, 2, 4];

function periodForYear(year) {
  return HISTORICAL_PERIODS.find((p) => year >= p.start_year && year <= p.end_year) || null;
}

function pct(year) {
  return ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
}

export default function YearScrubber({ year, onChange, onClose }) {
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1); // 1 = 1x speed
  const speed = SPEEDS[speedIdx];

  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const yearRef = useRef(year);
  yearRef.current = year;
  const fractYearRef = useRef(year);
  const lastIntYearRef = useRef(year);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const period = periodForYear(year);
  const color = period?.accent_color || "#6c5b4d";
  const fillPct = pct(year);

  // Play animation loop — smooth 60fps rAF advancing year like a true timelapse
  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
      return;
    }
    fractYearRef.current = yearRef.current;
    lastIntYearRef.current = Math.round(fractYearRef.current);

    const tick = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      fractYearRef.current = Math.min(MAX_YEAR, fractYearRef.current + dt * BASE_PLAY_SPEED * speed);
      
      const nextIntYear = Math.round(fractYearRef.current);
      if (nextIntYear !== lastIntYearRef.current) {
        lastIntYearRef.current = nextIntYear;
        onChangeRef.current(nextIntYear);
      }

      if (fractYearRef.current >= MAX_YEAR) {
        setPlaying(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, speed]);

  const togglePlay = useCallback(() => {
    setPlaying((p) => {
      if (!p && yearRef.current >= MAX_YEAR) {
        fractYearRef.current = MIN_YEAR;
        lastIntYearRef.current = MIN_YEAR;
        onChangeRef.current(MIN_YEAR);
      }
      return !p;
    });
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeedIdx((i) => (i + 1) % SPEEDS.length);
  }, []);

  const handleKey = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") { setPlaying(false); onChange(Math.max(MIN_YEAR, year - 1)); e.preventDefault(); }
      else if (e.key === "ArrowRight") { setPlaying(false); onChange(Math.min(MAX_YEAR, year + 1)); e.preventDefault(); }
      else if (e.key === " ") { togglePlay(); e.preventDefault(); }
      else if (e.key === "Escape") { onClose(); }
    },
    [year, onChange, onClose, togglePlay]
  );

  return (
    <div className="ys material" style={{ "--c": color }} onKeyDown={handleKey} tabIndex={-1}>
      {/* Top row */}
      <div className="ys-top">
        <button className="ys-close pressable-sm" onClick={onClose} aria-label="Exit time travel">✕</button>
        
        <div className="ys-info">
          <div className="ys-yr-row">
            <span className="ys-yr">{year}</span>
            {playing && <span className="ys-live-pill">LIVE</span>}
          </div>
          <span className="ys-label">{period ? period.short_title : "Before Hyderabad"}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            className="ys-speedbtn pressable-sm"
            onClick={cycleSpeed}
            title="Playback Speed"
            aria-label={`Speed ${speed}x`}
          >
            {speed}x
          </button>

          <button className="ys-playbtn pressable-sm" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
            <Icon name={playing ? "pause" : "play"} size={14} />
          </button>
        </div>
      </div>

      {/* Track */}
      <div className="ys-track-wrap" style={{ "--pct": `${fillPct}%`, "--c": color }}>
        {/* Colored period segments */}
        <div className="ys-segs" aria-hidden="true">
          {HISTORICAL_PERIODS.map((p) => (
            <div
              key={p.id}
              className="ys-seg"
              style={{
                left: `${pct(p.start_year)}%`,
                width: `${Math.max(0.5, pct(p.end_year) - pct(p.start_year))}%`,
                background: p.accent_color,
              }}
            />
          ))}
          {/* Filled "past" bar */}
          <div className="ys-fill" />
        </div>
        {/* Invisible real input on top for interaction */}
        <input
          type="range"
          className="ys-input"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={year}
          onChange={(e) => { setPlaying(false); onChange(Number(e.target.value)); }}
          aria-label="Explore year"
        />
        {/* Custom thumb */}
        <div className="ys-thumb" aria-hidden="true" />
      </div>

      {/* Tick labels */}
      <div className="ys-ticks" aria-hidden="true">
        {TICK_YEARS.map((y) => (
          <span key={y} style={{ left: `${pct(y)}%` }}>{y}</span>
        ))}
      </div>

    </div>
  );
}


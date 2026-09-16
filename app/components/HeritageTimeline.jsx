"use client";

import React, { useEffect, useState, useRef } from "react";
import { HISTORICAL_PERIODS, getPeriodForYear } from "../../lib/heritageData.js";

export default function HeritageTimeline({ currentYear, onYearChange, selectedPeriodId, onPeriodSelect }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const activePeriod = getPeriodForYear(currentYear);

  // Play / Pause temporal animation loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        onYearChange((prev) => {
          if (prev >= 2026) {
            setIsPlaying(false);
            return 1591;
          }
          return Math.min(2026, prev + 5);
        });
      }, 180);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, onYearChange]);

  const togglePlay = () => {
    if (currentYear >= 2026 && !isPlaying) {
      onYearChange(1591);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="timeline-dock" style={{ "--active-period-color": activePeriod.accent_color }}>
      {/* Top row: Active period and year display */}
      <div className="timeline-info-row">
        <div className="active-period-badge">
          <div className="period-indicator-dot" />
          <div className="period-indicator-pill">
            <span>{activePeriod.name}</span>
            <span style={{ opacity: 0.6, fontSize: 13, fontWeight: 400 }}>({activePeriod.short_title})</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button className="timeline-play-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause timeline" : "Play timeline"}>
            {isPlaying ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Play History</span>
              </>
            )}
          </button>

          <div className="active-year-display">
            {currentYear}
          </div>
        </div>
      </div>

      {/* Interactive track with segmented periods & continuous slider */}
      <div className="timeline-track-wrap">
        <div className="timeline-periods-bar">
          {HISTORICAL_PERIODS.map((period) => {
            const span = period.end_year - period.start_year + 1;
            const flexShare = span / (2026 - 1591);
            const isActive = currentYear >= period.start_year && currentYear <= period.end_year;

            return (
              <div
                key={period.id}
                className={`timeline-period-segment ${isActive ? "active" : ""}`}
                style={{
                  flex: flexShare,
                  "--seg-color": period.accent_color,
                }}
                title={`${period.name} (${period.start_year}–${period.end_year})`}
                onClick={() => {
                  onYearChange(period.start_year);
                  if (onPeriodSelect) onPeriodSelect(period.id);
                }}
              />
            );
          })}
        </div>

        <div style={{ position: "relative", width: "100%", height: 6 }}>
          <input
            type="range"
            min={1591}
            max={2026}
            value={currentYear}
            onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
            className="timeline-slider"
            aria-label="Historical timeline year scrubber"
          />
        </div>

        <div className="timeline-ticks-row" style={{ marginTop: 6 }}>
          <span>1591 (Foundation)</span>
          <span>1687 (Mughal)</span>
          <span>1724 (Asaf Jahi)</span>
          <span>1798 (Residency)</span>
          <span>1908 (Osmanian)</span>
          <span>1948 (Integration)</span>
          <span>2026 (Present)</span>
        </div>
      </div>
    </div>
  );
}

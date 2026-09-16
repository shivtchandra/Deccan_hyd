"use client";

import React from "react";

export default function HeritageLanding({ onEnter }) {
  return (
    <div className="heritage-landing-backdrop">
      <div className="landing-card">
        <div className="landing-header-tag">Mapping HYD · Heritage Layer</div>
        <h1 className="landing-title">A City Built in Layers.</h1>
        <p className="landing-subtitle">
          Hyderabad is not a static collection of monuments. It is four centuries of Persianate capitals, Mughal garrisons, Asaf Jahi palaces, and Osmanian riverfronts layered over one another.
        </p>

        <div className="landing-features-grid">
          <div className="landing-feature-box">
            <div className="landing-feature-title">Where + When</div>
            <div className="landing-feature-desc">Scrub 1591 to 2026 to see the city evolve across 9 historical periods</div>
          </div>
          <div className="landing-feature-box">
            <div className="landing-feature-title">Then ↔ Now</div>
            <div className="landing-feature-desc">Interactive archival vs present-day photographic comparisons</div>
          </div>
          <div className="landing-feature-box">
            <div className="landing-feature-title">What Used to Be Here?</div>
            <div className="landing-feature-desc">Uncover vanished gates, lost deodis, and transformed urban spaces</div>
          </div>
        </div>

        <button className="landing-enter-cta pressable" onClick={onEnter}>
          Enter the Atlas (1591 — 2026) →
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";

export default function HeritageTrailStoryMode({
  trail,
  sitesById,
  onClose,
  onGoToStop,
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!trail) return null;

  const currentStop = trail.stops[currentStepIndex];
  const currentSite = currentStop ? sitesById.get(currentStop.site_id) : null;
  const totalSteps = trail.stops.length;

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const nextStop = trail.stops[nextIdx];
      const nextSite = sitesById.get(nextStop.site_id);
      if (nextSite && onGoToStop) onGoToStop(nextSite);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      const prevStop = trail.stops[prevIdx];
      const prevSite = sitesById.get(prevStop.site_id);
      if (prevSite && onGoToStop) onGoToStop(prevSite);
    }
  };

  return (
    <div className="story-mode-dock">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ fontSize: 10.5, fontFamily: "JetBrains Mono, monospace", color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Curated Heritage Trail · Documentary Mode
          </span>
          <h3 style={{ margin: "4px 0 2px 0", fontSize: 18, color: "var(--cream)" }}>
            {trail.title}
          </h3>
          <div style={{ fontSize: 12, color: "var(--cream-dim)", opacity: 0.8 }}>
            {trail.distance_km} km · ~{trail.estimated_duration_min} min walk · {totalSteps} Stops
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            border: "1px solid var(--petrol-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--cream-dim)",
          }}
        >
          ✕
        </button>
      </div>

      {/* Current Stop Story */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "rgba(22, 42, 42, 0.4)", padding: 14, borderRadius: "var(--r-md)", border: "1px solid var(--petrol-border)" }}>
        <div className="story-step-indicator">
          <span>STOP {currentStepIndex + 1} OF {totalSteps}</span>
          <span>{currentSite?.yearBuilt || "Historic"}</span>
        </div>

        <h4 style={{ margin: 0, fontSize: 17, color: "var(--cream)" }}>
          {currentStop?.title || currentSite?.name}
        </h4>

        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--cream-dim)" }}>
          {currentStop?.narrative}
        </p>
      </div>

      {/* Navigation controls */}
      <div className="story-nav-buttons">
        <button
          className="story-nav-btn pressable"
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          style={{ opacity: currentStepIndex === 0 ? 0.4 : 1 }}
        >
          ← Previous Stop
        </button>

        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--cream-dim)" }}>
          {currentStepIndex + 1} / {totalSteps}
        </span>

        {currentStepIndex < totalSteps - 1 ? (
          <button className="story-nav-btn primary pressable" onClick={handleNext}>
            Next Stop →
          </button>
        ) : (
          <button className="story-nav-btn primary pressable" onClick={onClose}>
            ✓ Finish Trail
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { HISTORICAL_MAPS } from "../../lib/heritageData.js";
import { Icon } from "./Icons.jsx";

export default function HistoricalMapOverlayControl({
  activeMapId,
  onSelectMap,
  opacity,
  onOpacityChange,
  compareMode,
  onToggleCompare,
  onClose,
}) {
  const currentMap = HISTORICAL_MAPS.find((m) => m.id === activeMapId) || HISTORICAL_MAPS[0];

  return (
    <div className="map-overlay-widget">
      <div className="overlay-widget-header">
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          HISTORICAL MAP OVERLAY
        </span>
        {onClose && (
          <button onClick={onClose} style={{ opacity: 0.6, fontSize: 16 }}>
            ✕
          </button>
        )}
      </div>

      <div>
        <select
          className="overlay-select"
          value={activeMapId || ""}
          onChange={(e) => onSelectMap(e.target.value)}
        >
          {HISTORICAL_MAPS.map((map) => (
            <option key={map.id} value={map.id}>
              {map.year} — {map.title}
            </option>
          ))}
        </select>
      </div>

      <div className="opacity-slider-row">
        <span>Opacity: {Math.round(opacity * 100)}%</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="opacity-range"
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 6, borderTop: "1px solid var(--petrol-border)" }}>
        <button
          className="pressable"
          onClick={onToggleCompare}
          style={{
            padding: "4px 10px",
            borderRadius: "var(--r-xs)",
            fontSize: 11,
            background: compareMode ? "var(--amber)" : "rgba(245, 239, 227, 0.08)",
            color: compareMode ? "var(--petrol-900)" : "var(--cream)",
            fontWeight: 600,
          }}
        >
          {compareMode ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="check" size={12} /> Side-by-Side Active</span> : "Compare Split View"}
        </button>

        <span style={{ fontSize: 10, color: "var(--cream-dim)", opacity: 0.7 }}>
          {currentMap.credit}
        </span>
      </div>
    </div>
  );
}

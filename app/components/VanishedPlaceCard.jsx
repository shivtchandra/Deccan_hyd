"use client";

import React from "react";

export default function VanishedPlaceCard({ place, onClose, onFlyTo }) {
  if (!place) return null;

  return (
    <div className="vanished-detail-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{
            fontSize: 10.5,
            fontFamily: "JetBrains Mono, monospace",
            color: "var(--terracotta-bright)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}>
            What Used to Be Here? ({place.start_year} — {place.end_year})
          </span>
          <h3 style={{ margin: "4px 0 0 0", fontSize: 20, color: "var(--cream)" }}>
            {place.name}
          </h3>
          <div style={{ fontSize: 12, color: "var(--cream-dim)", opacity: 0.8 }}>
            Location: {place.current_location}
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

      {/* Contrast Grid: What existed vs What exists now */}
      <div className="vanished-contrast-grid">
        <div className="contrast-box">
          <span className="contrast-title">HISTORICALLY</span>
          <span className="contrast-text">{place.what_existed}</span>
        </div>
        <div className="contrast-box" style={{ borderLeft: "1px solid var(--petrol-border)", paddingLeft: 8 }}>
          <span className="contrast-title" style={{ color: "var(--amber)" }}>TODAY</span>
          <span className="contrast-text">{place.what_exists_now}</span>
        </div>
      </div>

      {/* Reason for change / demolition */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Reason for Disappearance / Transformation
        </span>
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.45, color: "var(--cream-dim)" }}>
          {place.reason_for_change}
        </p>
      </div>

      {/* Verified Sources */}
      {place.sources && place.sources.length > 0 && (
        <div style={{ fontSize: 11.5, color: "var(--cream-dim)", opacity: 0.85, borderTop: "1px solid var(--petrol-border)", paddingTop: 8 }}>
          <span style={{ fontWeight: 600, color: "var(--cream)" }}>Source: </span>
          {place.sources.map((s, idx) => (
            <span key={idx}>
              {s.title} ({s.author || s.year || "Archive"}){idx < place.sources.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

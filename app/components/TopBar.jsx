"use client";

import { useState } from "react";
import { Icon } from "./Icons.jsx";

// Compact material pill. Search is an icon until tapped, then takes the width.
export default function TopBar({ q, setQ, count = 55, visitedCount = 0, eraKey, onOpenSearch, variant = "floating" }) {
  const handleOpen = () => {
    if (onOpenSearch) return onOpenSearch();
  };

  return (
    <header className={`dhm-top${variant === "desktop" ? " dhm-top-desktop" : " material edge-below"}`}>
      <div className="dhm-brand-area" onClick={handleOpen}>
        <div className="dhm-mark" aria-hidden="true" style={{ position: "relative" }}>
          <Icon name="gateway" size={17} width={1.8} color="var(--accent-deep)" />
          {eraKey && (
            <span style={{ position: "absolute", bottom: -2, right: -2, width: 7, height: 7, borderRadius: "50%", background: `var(--era-${eraKey}, var(--accent))`, border: "1.5px solid var(--cream-hi)" }} />
          )}
        </div>
        <div className="dhm-titles">
          <span className="dhm-word groovy">Deccan Heritage</span>
          <span className="dhm-sub">{count} sites</span>
        </div>
      </div>

      <button className="dhm-search-btn pressable-sm" onClick={handleOpen} aria-label="Search heritage">
        <Icon name="search" size={13} width={1.8} color="var(--ink-soft)" />
        <span>Search heritage</span>
      </button>
    </header>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "./Icons.jsx";
import { searchHeritageAtlas } from "../../lib/heritageData.js";

// Interactive TopBar with real inline input and live search autocomplete dropdown
export default function TopBar({
  q = "",
  setQ,
  count = 55,
  visitedCount = 0,
  eraKey,
  onOpenSearch,
  sites = [],
  onSelectSite,
  variant = "floating",
}) {
  const [focused, setFocused] = useState(false);
  const dropdownRef = useRef(null);

  const results = q && typeof q === "string" && q.trim()
    ? searchHeritageAtlas(q, sites)
    : { sites: [], vanished: [], trails: [] };

  const hasResults =
    (results.sites && results.sites.length > 0) ||
    (results.vanished && results.vanished.length > 0) ||
    (results.trails && results.trails.length > 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`dhm-top${variant === "desktop" ? " dhm-top-desktop" : " material edge-below"}`}>
      <div className="dhm-brand-area" onClick={() => setQ && setQ("")} style={{ cursor: "pointer" }}>
        <div className="dhm-mark" aria-hidden="true" style={{ position: "relative" }}>
          <Icon name="gateway" size={17} width={1.8} color="var(--accent-deep)" />
          {eraKey && (
            <span
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: `var(--era-${eraKey}, var(--accent))`,
                border: "1.5px solid var(--cream-hi)",
              }}
            />
          )}
        </div>
        <div className="dhm-titles">
          <span className="dhm-word groovy">Deccan Heritage</span>
          <span className="dhm-sub">{count} sites</span>
        </div>
      </div>

      <div
        className="dhm-search-container"
        onClick={() => onOpenSearch && onOpenSearch()}
        style={{ position: "relative", flex: 1, maxWidth: 320, marginLeft: "auto", cursor: "pointer" }}
      >
        <div className="dhm-search-wrap" style={{ cursor: "pointer" }}>
          <Icon name="search" size={14} width={1.8} color="var(--ink-soft)" />
          <input
            type="text"
            className="dhm-search-input"
            placeholder="Search heritage..."
            readOnly
            style={{ cursor: "pointer" }}
            aria-label="Search heritage"
          />
          <kbd
            style={{
              fontSize: 10.5,
              fontFamily: "ui-monospace, monospace",
              padding: "2px 6px",
              background: "var(--cream)",
              border: "1px solid var(--line)",
              borderRadius: 4,
              color: "var(--ink-soft)",
              pointerEvents: "none",
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>
    </header>
  );
}

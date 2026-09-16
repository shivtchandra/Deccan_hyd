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
        ref={dropdownRef}
        style={{ position: "relative", flex: 1, maxWidth: 320, marginLeft: "auto" }}
      >
        <div className={`dhm-search-wrap${focused ? " focused" : ""}`}>
          <Icon name="search" size={14} width={1.8} color="var(--ink-soft)" />
          <input
            type="text"
            className="dhm-search-input"
            placeholder="Search heritage..."
            value={q || ""}
            onChange={(e) => setQ && setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            aria-label="Search heritage"
          />
          {q ? (
            <button
              type="button"
              className="dhm-search-clear"
              onClick={() => setQ && setQ("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          ) : null}
        </div>

        {/* Live Search Dropdown */}
        {focused && q && typeof q === "string" && q.trim() !== "" && (
          <div className="dhm-search-dropdown material">
            {!hasResults ? (
              <div className="dhm-search-empty">No matching heritage records</div>
            ) : (
              <>
                {results.sites && results.sites.length > 0 && (
                  <div className="dhm-search-group">
                    <div className="dhm-search-group-title">Heritage Sites ({results.sites.length})</div>
                    {results.sites.slice(0, 5).map((s) => (
                      <div
                        key={s.id}
                        className="dhm-search-item"
                        onClick={() => {
                          setFocused(false);
                          if (onSelectSite) onSelectSite(s.id);
                        }}
                      >
                        <span className="dhm-search-item-name">{s.name}</span>
                        <span className="dhm-search-item-meta">{s.area || s.era}</span>
                      </div>
                    ))}
                  </div>
                )}
                {results.vanished && results.vanished.length > 0 && (
                  <div className="dhm-search-group">
                    <div
                      className="dhm-search-group-title"
                      style={{ color: "var(--accent)" }}
                    >
                      Vanished Places ({results.vanished.length})
                    </div>
                    {results.vanished.slice(0, 3).map((v) => (
                      <div
                        key={v.id}
                        className="dhm-search-item"
                        onClick={() => {
                          setFocused(false);
                          if (onSelectSite) onSelectSite(v.id);
                        }}
                      >
                        <span
                          className="dhm-search-item-name"
                          style={{ color: "var(--accent)" }}
                        >
                          {v.name}
                        </span>
                        <span className="dhm-search-item-meta">{v.current_location}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

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
        {focused && (
          <div className="dhm-search-dropdown material">
            {!q || !q.trim() ? (
              <div className="dhm-topbar-poetic-dropdown">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div className="dhm-search-vignette-wrap" style={{ width: 44, height: 44, margin: 0, flexShrink: 0 }}>
                    <img
                      src="/charminar-field-note.png"
                      alt="Charminar Field Note"
                      className="dhm-search-vignette-img"
                    />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontFamily: "Fraunces, serif", fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                      Deccan Heritage Atlas
                    </div>
                    <div style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>
                      Search 54 monuments, gates & eras
                    </div>
                  </div>
                </div>
                <div className="dhm-search-chips-label" style={{ textAlign: "left", fontSize: 9.5, marginBottom: 6 }}>
                  Quick Explorations:
                </div>
                <div className="dhm-search-chips-row" style={{ justifyContent: "flex-start" }}>
                  {["Charminar", "Golconda", "Qutb Shahi", "Chowmahalla", "Paigah", "Musi"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="dhm-search-chip"
                      style={{ fontSize: 11, padding: "3px 9px", background: "var(--paper-warm)", color: "var(--ink)", border: "1px solid var(--line)" }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        if (setQ) setQ(tag);
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : !hasResults ? (
              <div className="dhm-search-empty" style={{ padding: "16px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>📜</div>
                <div style={{ fontWeight: 600, fontSize: 12.5, color: "var(--ink)" }}>No records found for "{q}"</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Try searching "Golconda", "Fort", or "Nizam"</div>
              </div>
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

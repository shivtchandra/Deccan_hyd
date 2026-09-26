"use client";

import React, { useState, useEffect, useRef } from "react";
import { searchHeritageAtlas } from "../../lib/heritageData.js";

export default function HeritageSearch({
  isOpen,
  onClose,
  sites,
  onSelectSite,
  onSelectVanished,
  onSelectTrail,
  onSelectPeriod,
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      window.addEventListener("keydown", handleKeyDown);
    } else {
      setQuery("");
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = searchHeritageAtlas(query, sites);
  const hasResults =
    results.sites.length > 0 ||
    results.vanished.length > 0 ||
    results.trails.length > 0 ||
    results.periods.length > 0;

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--amber)" }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search monuments, vanished gates, neighbourhoods, eras, trails…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} style={{ color: "var(--cream-dim)", fontSize: 13 }}>
            ESC
          </button>
        </div>

        <div className="search-results-list">
          {!query.trim() ? (
            <div className="dhm-search-poetic-card">
              <div className="dhm-search-vignette-wrap">
                <img
                  src="/charminar-field-note.png"
                  alt="Charminar Field Note"
                  className="dhm-search-vignette-img"
                />
              </div>
              <div className="dhm-search-poetic-quote">
                “Across minarets, riverbanks, and granite fortresses — 500 years of Deccan stories await.”
              </div>
              <div className="dhm-search-chips-label">Popular Heritage Explorations:</div>
              <div className="dhm-search-chips-row">
                {["Charminar", "Golconda", "Qutb Shahi", "Chowmahalla", "Paigah", "Musi River", "Gates"].map((tag) => (
                  <button
                    key={tag}
                    className="dhm-search-chip"
                    onClick={() => setQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="dhm-search-no-results">
              <div style={{ color: "var(--cream)", fontWeight: 600, fontSize: 14 }}>
                No historical records found for "{query}"
              </div>
              <p style={{ color: "var(--cream-dim)", fontSize: 12.5, margin: "6px 0 14px" }}>
                Try searching by dynasty, landmark name, or architectural style.
              </p>
              <div className="dhm-search-chips-row" style={{ justifyContent: "center" }}>
                {["Charminar", "Golconda", "Toli Masjid", "Falaknuma"].map((tag) => (
                  <button
                    key={tag}
                    className="dhm-search-chip"
                    onClick={() => setQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Heritage Sites */}
              {results.sites.length > 0 && (
                <div className="search-category-group">
                  <div className="search-group-heading">Heritage Sites ({results.sites.length})</div>
                  {results.sites.map((site) => (
                    <div
                      key={site.id}
                      className="search-result-row"
                      onClick={() => {
                        onSelectSite(site.id);
                        onClose();
                      }}
                    >
                      <div className="result-main">
                        <span className="result-name">{site.name}</span>
                        <span className="result-sub">
                          {site.area} · {site.startYear || site.yearBuilt} · {site.architecturalStyle}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: "var(--amber)", fontFamily: "JetBrains Mono" }}>
                        →
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Vanished Places */}
              {results.vanished.length > 0 && (
                <div className="search-category-group">
                  <div className="search-group-heading" style={{ color: "var(--terracotta-bright)" }}>
                    Vanished / Changed Places ({results.vanished.length})
                  </div>
                  {results.vanished.map((place) => (
                    <div
                      key={place.id}
                      className="search-result-row"
                      onClick={() => {
                        if (onSelectVanished) onSelectVanished(place);
                        onClose();
                      }}
                    >
                      <div className="result-main">
                        <span className="result-name" style={{ color: "var(--terracotta-bright)" }}>
                          {place.name}
                        </span>
                        <span className="result-sub">
                          {place.start_year}–{place.end_year} · {place.current_location}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: "var(--terracotta-bright)" }}>
                        [WHAT WAS HERE]
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Curated Trails */}
              {results.trails.length > 0 && (
                <div className="search-category-group">
                  <div className="search-group-heading">Curated Trails ({results.trails.length})</div>
                  {results.trails.map((trail) => (
                    <div
                      key={trail.id}
                      className="search-result-row"
                      onClick={() => {
                        if (onSelectTrail) onSelectTrail(trail);
                        onClose();
                      }}
                    >
                      <div className="result-main">
                        <span className="result-name">{trail.title}</span>
                        <span className="result-sub">
                          {trail.distance_km} km · {trail.stops.length} stops · {trail.subtitle}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: "var(--amber)" }}>
                        [WALK TRAIL]
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Historical Periods */}
              {results.periods.length > 0 && (
                <div className="search-category-group">
                  <div className="search-group-heading">Historical Periods</div>
                  {results.periods.map((period) => (
                    <div
                      key={period.id}
                      className="search-result-row"
                      onClick={() => {
                        if (onSelectPeriod) onSelectPeriod(period.start_year);
                        onClose();
                      }}
                    >
                      <div className="result-main">
                        <span className="result-name">{period.name}</span>
                        <span className="result-sub">
                          {period.start_year}–{period.end_year} · {period.short_title}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: "var(--amber)", fontFamily: "JetBrains Mono" }}>
                        {period.start_year}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

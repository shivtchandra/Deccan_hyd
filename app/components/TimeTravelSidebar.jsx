"use client";

import { useMemo } from "react";
import { photoUrl } from "../../lib/heritage.js";
import { Icon } from "./Icons.jsx";

export const DOCUMENTARY_CHAPTERS = [
  { start: 1562, end: 1686, yearJump: 1591, center: [17.3616, 78.4747], zoom: 14.0, title: "1591: Charminar & Golden Age", era: "Qutb Shahi", text: "Muhammad Quli Qutb Shah crosses the Musi, building Charminar & founding Hyderabad." },
  { start: 1687, end: 1723, yearJump: 1687, center: [17.3750, 78.4680], zoom: 13.6, title: "1687: Mughal Siege of Golconda", era: "Mughal Subah", text: "Aurangzeb's 8-month siege ends the Qutb Shahi dynasty. Hyderabad becomes a Mughal Subah." },
  { start: 1724, end: 1797, yearJump: 1724, center: [17.3650, 78.4710], zoom: 13.8, title: "1724: Asaf Jahi Dynasty", era: "Asaf Jahi", text: "Nizam-ul-Mulk establishes the Deccan state. Walled city, gates & Chowmahalla Palace rise." },
  { start: 1798, end: 1868, yearJump: 1798, center: [17.3880, 78.4820], zoom: 13.5, title: "1798: Subsidiary Alliance", era: "British Residency", text: "British Residency at Koti and Secunderabad Cantonment shape a twin city silhouette." },
  { start: 1869, end: 1907, yearJump: 1869, center: [17.3850, 78.4650], zoom: 13.2, title: "1869: Railways & Aristocratic Splendour", era: "Nizam VI", text: "Nizam VI Mahbub Ali Khan expands state railways, Falaknuma & Errum Manzil palaces." },
  { start: 1908, end: 1947, yearJump: 1908, center: [17.3730, 78.4740], zoom: 14.0, title: "1908: Great Musi Flood & CIB Rebuild", era: "Nizam-era Civic", text: "The City Improvement Board hires Vincent Esch to design the High Court, OGH & civic monuments." },
  { start: 1948, end: 1997, yearJump: 1948, center: [17.4080, 78.4700], zoom: 13.2, title: "1948: Integration & Statehood", era: "Post-Independence", text: "Operation Polo integrates Hyderabad. Hussain Sagar promenade & public institutions expand." },
  { start: 1998, end: 2026, yearJump: 2000, center: [17.4250, 78.4200], zoom: 12.5, title: "1998: Cyberabad & Modern Era", era: "Modern IT", text: "Cyber Towers & HITEC City propel Hyderabad into a premier global technology powerhouse." },
];

export default function TimeTravelSidebar({
  selectedYear,
  onSelectYear,
  onClose,
  sites = [],
  selectedId,
  onSelectSite,
}) {
  const activeChapter = useMemo(() => {
    if (selectedYear === null) return DOCUMENTARY_CHAPTERS[0];
    return DOCUMENTARY_CHAPTERS.find((c) => selectedYear >= c.start && selectedYear <= c.end) || DOCUMENTARY_CHAPTERS[0];
  }, [selectedYear]);

  // Sites active in selected year
  const activeSites = useMemo(() => {
    if (!selectedYear) return [];
    return sites.filter((s) => {
      const built = Number(s.startYear || s.yearBuilt || 0);
      return built && built <= selectedYear;
    });
  }, [sites, selectedYear]);

  return (
    <div className="dhm-tt-sidebar">
      {/* Sidebar Header */}
      <div className="dhm-tt-sb-header">
        <div className="dhm-tt-sb-top">
          <span className="dhm-tt-live-tag" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="clock" size={13} /> TIME TRAVEL
          </span>
          <button className="dhm-tt-close-btn" onClick={onClose} aria-label="Exit Time Travel">
            ✕ Exit
          </button>
        </div>
        <div className="dhm-tt-year-big">{selectedYear || 1591}</div>
      </div>

      {/* Active Chapter Card */}
      <div className="dhm-tt-active-card">
        <div className="dhm-tt-card-era">{activeChapter.era}</div>
        <h3 className="dhm-tt-card-title">{activeChapter.title}</h3>
        <p className="dhm-tt-card-desc">{activeChapter.text}</p>
      </div>

      {/* Chapter Navigation List */}
      <div className="dhm-tt-chapters-section">
        <div className="dhm-tt-section-title">Historical Chapters</div>
        <div className="dhm-tt-chapter-list">
          {DOCUMENTARY_CHAPTERS.map((ch) => {
            const isActive = activeChapter.title === ch.title;
            return (
              <button
                key={ch.title}
                className={`dhm-tt-chapter-btn ${isActive ? "active" : ""}`}
                onClick={() => onSelectYear(ch.yearJump)}
              >
                <span className="dhm-tt-ch-year">{ch.yearJump}</span>
                <span className="dhm-tt-ch-name">{ch.title.split(":")[1] || ch.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Monuments List */}
      <div className="dhm-tt-monuments-section">
        <div className="dhm-tt-section-title">
          Monuments in {selectedYear} ({activeSites.length})
        </div>
        <div className="dhm-tt-site-list">
          {activeSites.slice(0, 15).map((s) => (
            <button
              key={s.id}
              className={`dhm-tt-site-card ${s.id === selectedId ? "selected" : ""}`}
              onClick={() => onSelectSite(s.id)}
            >
              <div className="dhm-tt-site-thumb">
                {s.hasPhoto ? (
                  <img src={photoUrl(s.id)} alt={s.name} loading="lazy" />
                ) : (
                  <div className="dhm-tt-site-nophoto"><Icon name="monument" size={18} color="var(--ink-soft)" /></div>
                )}
              </div>
              <div className="dhm-tt-site-info">
                <div className="dhm-tt-site-name">{s.name}</div>
                <div className="dhm-tt-site-meta">Built {s.startYear || s.yearBuilt || "Historic"}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

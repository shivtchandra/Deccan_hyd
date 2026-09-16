"use client";

import { ERAS, ERA_ORDER } from "../../lib/heritage.js";
import { Icon } from "./Icons.jsx";

const SPAN = {
  earlier: "pre-1518",
  "qutb-shahi": "1518–1687",
  "asaf-jahi": "1724–1948",
  "british-residency": "1798–1947",
  "nizam-civic": "1880s–1948",
  "post-independence": "1948–present",
};

export default function EraTimeline({ filter, setFilter, counts = {}, layout = "strip", onTimeTravelOpen }) {
  const selectEra = (e) =>
    setFilter((f) => {
      const next = new Set();
      if (!f.eras.has(e)) next.add(e);
      return { ...f, eras: next };
    });

  const clearEra = () => setFilter((f) => ({ ...f, eras: new Set() }));

  return (
    <div className="dhm-timeline">
      <div className="dhm-timeline-header">
        <span className="dhm-timeline-label">Filter by era</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {filter.eras.size > 0 && (
            <button onClick={clearEra} className="dhm-era-clear">Clear ✕</button>
          )}
          {onTimeTravelOpen && (
            <button onClick={onTimeTravelOpen} className="dhm-tt-inline pressable-sm" title="Explore through time" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="clock" size={13} />
              <span>Time Travel</span>
            </button>
          )}
        </div>
      </div>
      <div className="dhm-era-row">
        <div className="dhm-timeline-line" aria-hidden="true" />
        {ERA_ORDER.map((e) => {
          const on = filter.eras.has(e);
          const c = ERAS[e].color;
          return (
            <button
              key={e}
              className="dhm-era pressable-sm"
              data-on={on}
              onClick={() => selectEra(e)}
              style={{ "--c": c }}
              aria-pressed={on}
            >
              <span className="dhm-era-dot" />
              <span className="dhm-era-name">{ERAS[e].label}</span>
              <span className="dhm-era-span">{SPAN[e]}</span>
            </button>
          );
        })}
        <button
          className="dhm-era dhm-era-today pressable-sm"
          data-on={filter.eras.size === 0}
          onClick={clearEra}
          aria-pressed={filter.eras.size === 0}
          style={{ "--c": "var(--ink-soft)" }}
        >
          <span className="dhm-era-dot" style={{ "--c": "var(--ink-soft)" }} />
          <span className="dhm-era-name">Today</span>
          <span className="dhm-era-span">2026</span>
        </button>
      </div>
    </div>
  );
}

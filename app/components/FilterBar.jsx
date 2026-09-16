"use client";

import { TYPES } from "../../lib/heritage.js";
import { Icon } from "./Icons.jsx";

// A compact toggle rail. `filter` holds Sets for eras/types and booleans for atRiskOnly, vanishedOnly, etc.
export default function FilterBar({ filter, setFilter }) {
  const toggleSet = (keyName, val) =>
    setFilter((f) => {
      const next = new Set(f[keyName]);
      next.has(val) ? next.delete(val) : next.add(val);
      return { ...f, [keyName]: next };
    });

  return (
    <div className="chip-rail" style={{ flex: "none", padding: "5px 12px 6px" }}>
      {/* "What Used to Be Here?" Vanished Places filter */}
      <button
        className="chip pressable-sm"
        data-on={filter.vanishedOnly}
        onClick={() => setFilter((f) => ({ ...f, vanishedOnly: !f.vanishedOnly }))}
        style={{
          borderColor: filter.vanishedOnly ? "var(--pop)" : undefined,
          background: filter.vanishedOnly ? "var(--pop)" : undefined,
          color: filter.vanishedOnly ? "#fff" : "var(--pop)",
          fontWeight: 700,
        }}
      >
        <span>⏳ What Used to Be Here?</span>
      </button>

      <button
        className="chip danger pressable-sm"
        data-on={filter.atRiskOnly}
        onClick={() => setFilter((f) => ({ ...f, atRiskOnly: !f.atRiskOnly }))}
      >
        <Icon name="warn" size={13} width={2} color={filter.atRiskOnly ? "var(--danger)" : "var(--ink-soft)"} />
        At risk
      </button>

      {Object.entries(TYPES).map(([t, label]) => (
        <button key={t} className="chip pressable-sm" data-on={filter.types.has(t)} onClick={() => toggleSet("types", t)}>
          {label}
        </button>
      ))}
    </div>
  );
}

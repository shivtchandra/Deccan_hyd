"use client";

import { Icon } from "./Icons.jsx";

const TABS = [
  { id: "map", icon: "map", label: "Map" },
  { id: "explore", icon: "compass", label: "Origins" },
  { id: "passport", icon: "passport", label: "Passport" },
  { id: "routes", icon: "route", label: "Routes" },
  { id: "submit", icon: "plus", label: "Suggest" },
];

export default function BottomNav({ tab, onTab, visitedCount = 0, variant = "floating" }) {
  if (variant === "sidebar") {
    return (
      <nav className="dhm-sidebar-nav" aria-label="Sections">
        {TABS.map((t) => {
          const active = tab === t.id;
          const badge = t.id === "passport" && visitedCount > 0 ? visitedCount : null;
          return (
            <button
              key={t.id}
              className={`dhm-sidebar-tab pressable-sm${active ? " active" : ""}`}
              onClick={() => onTab(t.id)}
              aria-label={t.label}
              aria-current={active ? "page" : undefined}
            >
              <Icon name={t.icon} size={18} width={1.9} color={active ? "var(--accent-deep)" : "var(--ink-soft)"} />
              <span>{t.label}</span>
              {badge != null && (
                <span style={{
                  position: "absolute", top: 6, right: "calc(50% - 18px)",
                  minWidth: 15, height: 15, padding: "0 3px", borderRadius: 999,
                  background: "var(--pop)", color: "#fff", fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1.5px solid var(--cream-hi)",
                }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  // floating pill nav (mobile default)
  return (
    <nav className="dhm-nav-wrap safe-bottom" aria-label="Sections">
      <div className="dhm-nav material">
        {TABS.map((t) => {
          const active = tab === t.id;
          const badge = t.id === "passport" && visitedCount > 0 ? visitedCount : null;
          return (
            <button
              key={t.id}
              className={`dhm-tab pressable-sm${active ? " active" : ""}`}
              data-on={active}
              onClick={() => onTab(t.id)}
              aria-label={t.label}
              aria-current={active ? "page" : undefined}
            >
              <span className="dhm-tab-ic">
                <Icon name={t.icon} size={20} width={1.9} color={active ? "#fff" : "var(--ink-soft)"} />
                {badge != null && !active && <span className="dhm-badge-dot">{badge}</span>}
              </span>
              {active && (
                <span className="dhm-tab-label">
                  {t.label}
                  {badge != null && <span className="dhm-badge-pill">{badge}</span>}
                </span>
              )}
            </button>
          );
        })}
      </div>

    </nav>
  );
}

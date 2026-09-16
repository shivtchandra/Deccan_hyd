"use client";

import Link from "next/link";
import { Icon } from "./Icons.jsx";

const TABS = [
  { id: "map",     icon: "map",      label: "Map" },
  { id: "explore", icon: "compass",  label: "Origins" },
  { id: "passport",icon: "passport", label: "Passport" },
  { id: "routes",  icon: "route",    label: "Routes" },
  { id: "submit",  icon: "plus",     label: "Suggest" },
];

export default function SiteBottomNav({ accentColor }) {
  return (
    <div className="dhm-mobile-only" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 620,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: `0 14px calc(8px + env(safe-area-inset-bottom, 0px))`,
      pointerEvents: "none",
    }}>
      <nav style={{
        pointerEvents: "auto", display: "flex", gap: 4, width: "100%", maxWidth: 460,
        padding: 7, borderRadius: 999, boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        background: "var(--cream-hi)", backdropFilter: "blur(16px)",
      }}>
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={t.id === "map" ? "/" : `/?tab=${t.id}`}
            style={{
              flex: t.id === "map" ? "1 1 auto" : "0 0 auto",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              height: 46, padding: t.id === "map" ? "0 16px" : "0 12px",
              borderRadius: 999, textDecoration: "none",
              background: t.id === "map" ? accentColor : "transparent",
              color: t.id === "map" ? "#fff" : "var(--ink-soft)",
              fontSize: 13, fontWeight: 700,
              transition: "background 200ms",
            }}
          >
            <Icon name={t.icon} size={18} />
            {t.id === "map" && <span style={{ whiteSpace: "nowrap" }}>{t.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}

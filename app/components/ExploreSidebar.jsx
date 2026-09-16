"use client";

import { useState, useMemo } from "react";
import { CULTURAL_ORIGINS } from "../../lib/culturalOrigins.js";
import { Icon } from "./Icons.jsx";
import BottomNav from "./BottomNav.jsx";

const DIR_COLOR = {
  inward: "#c2603a",
  hybrid: "#d97706",
  local: "#2d7a4f",
  outward: "#3b6998",
};

const DIR_LABEL = {
  inward: "Arrived",
  hybrid: "Adapted",
  local: "Born Here",
  outward: "Sailed Out",
};

export default function ExploreSidebar({
  activeTab = "origins",
  onTabChange,
  selectedOriginId,
  onSelectOrigin,
  tab,
  onNavTabChange,
  visitedCount,
  explorersData,
}) {
  const [catFilter, setCatFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["all", "dish", "drink", "sweet", "craft", "attire", "festival"];

  const filteredOrigins = useMemo(() => {
    return CULTURAL_ORIGINS.filter((item) => {
      if (catFilter !== "all" && item.category !== catFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.summary?.toLowerCase().includes(q) ||
          item.eraLabel?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [catFilter, searchQuery]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Sub-tab Switcher: Origins vs Explorers */}
      <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid var(--line)", background: "var(--cream-hi)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, background: "var(--cream)", padding: 3, borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
          <button
            className="pressable-sm"
            onClick={() => onTabChange("origins")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "7px 10px", borderRadius: 6, border: "none",
              background: activeTab === "origins" ? "#fff" : "transparent",
              color: activeTab === "origins" ? "var(--ink)" : "var(--ink-soft)",
              fontWeight: 700, fontSize: 12,
              boxShadow: activeTab === "origins" ? "var(--e1)" : "none",
              cursor: "pointer",
            }}
          >
            <Icon name="compass" size={14} color={activeTab === "origins" ? "var(--accent)" : "currentColor"} />
            Origins
          </button>
          <button
            className="pressable-sm"
            onClick={() => onTabChange("leaderboard")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "7px 10px", borderRadius: 6, border: "none",
              background: activeTab === "leaderboard" ? "#fff" : "transparent",
              color: activeTab === "leaderboard" ? "var(--ink)" : "var(--ink-soft)",
              fontWeight: 700, fontSize: 12,
              boxShadow: activeTab === "leaderboard" ? "var(--e1)" : "none",
              cursor: "pointer",
            }}
          >
            <Icon name="trophy" size={14} color={activeTab === "leaderboard" ? "var(--accent)" : "currentColor"} />
            Explorers
          </button>
        </div>
      </div>

      {activeTab === "origins" && (
        <>
          {/* Category Chips Bar */}
          <div
            style={{
              display: "flex", gap: 6, padding: "8px 12px",
              overflowX: "auto", borderBottom: "1px solid var(--hairline)",
              scrollbarWidth: "none", flexShrink: 0,
            }}
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                style={{
                  padding: "3px 10px", borderRadius: 999, border: "1px solid",
                  borderColor: catFilter === c ? "var(--accent)" : "var(--line)",
                  background: catFilter === c ? "var(--accent-wash)" : "var(--cream-hi)",
                  color: catFilter === c ? "var(--accent-deep)" : "var(--ink-soft)",
                  fontSize: 11, fontWeight: catFilter === c ? 700 : 600,
                  textTransform: "capitalize", cursor: "pointer", whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {c === "all" ? "All (12)" : c}
              </button>
            ))}
          </div>

          {/* List of Origins */}
          <div className="dhm-card-list-wrap" style={{ flex: 1, overflowY: "auto" }}>
            {filteredOrigins.map((item) => {
              const sel = item.id === selectedOriginId;
              const dirCol = DIR_COLOR[item.direction] || "var(--accent)";
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectOrigin(item.id);
                  }}
                  className="dhm-card-list-item pressable-sm"
                  data-selected={sel}
                  style={{
                    "--era-c": dirCol,
                    padding: "11px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderBottom: "1px solid var(--hairline)",
                    textAlign: "left",
                    background: sel ? "var(--accent-wash)" : "transparent",
                    borderLeft: sel ? `3px solid ${dirCol}` : "3px solid transparent",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: dirCol,
                      flexShrink: 0,
                      boxShadow: `0 0 0 3px color-mix(in srgb, ${dirCol} 25%, transparent)`,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontSize: 14.5,
                        fontWeight: 600,
                        lineHeight: 1.25,
                        color: "var(--ink)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                      <span
                        className="dhm-pill-era"
                        style={{
                          color: dirCol,
                          background: `color-mix(in srgb, ${dirCol} 12%, transparent)`,
                        }}
                      >
                        {DIR_LABEL[item.direction]?.toUpperCase()}
                      </span>
                      <span className="dhm-pill-type">{item.eraLabel}</span>
                      {item.category && (
                        <span className="dhm-pill-type" style={{ textTransform: "uppercase" }}>
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="dhm-card-list-chevron" aria-hidden="true" style={{ color: sel ? "var(--ink)" : "var(--muted)" }}>
                    ›
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {activeTab === "leaderboard" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px" }}>
          <div style={{ background: "linear-gradient(135deg, var(--accent-deep), var(--accent))", padding: "14px 14px", borderRadius: "var(--r-md)", color: "#fff", marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.85 }}>The Explorers</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 700, marginTop: 2 }}>Who's mapped the most</div>
            <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 4, lineHeight: 1.4 }}>Check in at monuments to score points.</div>
          </div>

          {explorersData && (
            <>
              {/* User Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--cream)", borderRadius: "var(--r-sm)", padding: "8px 10px", marginBottom: 12, border: "1px solid var(--line)" }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent-wash)", color: "var(--accent-deep)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>
                  {(explorersData.name || "?").slice(0, 1).toUpperCase()}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9.5, color: "var(--muted)", fontWeight: 700 }}>YOUR NAME</div>
                  {explorersData.editing ? (
                    <input
                      value={explorersData.name}
                      onChange={(e) => explorersData.setNameState(e.target.value)}
                      maxLength={24}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && explorersData.saveMyName()}
                      style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 6, padding: "3px 6px", font: "inherit", fontSize: 12 }}
                    />
                  ) : (
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{explorersData.name || "Set a name"}</div>
                  )}
                </div>
                <button
                  className="pressable-sm"
                  onClick={() => (explorersData.editing ? explorersData.saveMyName() : explorersData.setEditing(true))}
                  style={{ border: "1px solid var(--line)", background: "transparent", borderRadius: 999, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}
                >
                  {explorersData.editing ? "Save" : "Edit"}
                </button>
              </div>

              {/* Leaderboard rows */}
              {explorersData.rows?.map((p, i) => (
                <div
                  key={p.uid}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 10px",
                    background: p.uid === explorersData.uid ? "var(--accent-wash)" : "var(--cream-hi)",
                    borderRadius: "var(--r-sm)", marginBottom: 6,
                    border: "1px solid var(--line)",
                    boxShadow: "var(--e1)",
                  }}
                >
                  <span style={{ width: 20, textAlign: "center", fontWeight: 800, fontSize: 12, color: i < 3 ? "var(--accent-deep)" : "var(--muted)" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.uid === explorersData.uid ? "You" : p.name}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--accent-deep)", fontWeight: 700 }}>
                    {p.points} pts
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Sidebar Navigation */}
      <BottomNav variant="sidebar" tab={tab} onTab={onNavTabChange} visitedCount={visitedCount} />
    </div>
  );
}

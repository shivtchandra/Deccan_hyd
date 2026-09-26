"use client";

import { useState, useMemo } from "react";
import { CULTURAL_ORIGINS } from "../../lib/culturalOrigins.js";
import { AREA_ETYMOLOGIES, filterAreaEtymologies } from "../../lib/areaEtymology.js";
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
  onSelectSite,
  onFlyToLocation,
  selectedAreaId,
  onSelectArea,
}) {
  const [catFilter, setCatFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [areaQuery, setAreaQuery] = useState("");
  const [areaLangFilter, setAreaLangFilter] = useState("all");

  const categories = ["all", "dish", "drink", "sweet", "craft", "attire", "festival"];
  const areaLanguages = ["all", "Dakhni", "Telugu", "Urdu", "Persian", "English"];

  const filteredAreas = useMemo(() => {
    return filterAreaEtymologies(areaQuery, areaLangFilter);
  }, [areaQuery, areaLangFilter]);

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
      {/* Sub-tab Switcher: Origins vs Area Lore vs Explorers */}
      <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid var(--line)", background: "var(--cream-hi)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr 1fr", gap: 5, background: "var(--cream)", padding: 3, borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
          <button
            className="pressable-sm"
            onClick={() => onTabChange("origins")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              padding: "7px 6px", borderRadius: 6, border: "none",
              background: activeTab === "origins" ? "#fff" : "transparent",
              color: activeTab === "origins" ? "var(--ink)" : "var(--ink-soft)",
              fontWeight: 700, fontSize: 11.5,
              boxShadow: activeTab === "origins" ? "var(--e1)" : "none",
              cursor: "pointer",
            }}
          >
            <Icon name="compass" size={13} color={activeTab === "origins" ? "var(--accent)" : "currentColor"} />
            Origins
          </button>
          <button
            className="pressable-sm"
            onClick={() => onTabChange("area-names")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              padding: "7px 6px", borderRadius: 6, border: "none",
              background: activeTab === "area-names" ? "#fff" : "transparent",
              color: activeTab === "area-names" ? "var(--ink)" : "var(--ink-soft)",
              fontWeight: 700, fontSize: 11.5,
              boxShadow: activeTab === "area-names" ? "var(--e1)" : "none",
              cursor: "pointer",
            }}
          >
            <Icon name="map" size={13} color={activeTab === "area-names" ? "var(--accent)" : "currentColor"} />
            Area Lore
          </button>
          <button
            className="pressable-sm"
            onClick={() => onTabChange("leaderboard")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              padding: "7px 6px", borderRadius: 6, border: "none",
              background: activeTab === "leaderboard" ? "#fff" : "transparent",
              color: activeTab === "leaderboard" ? "var(--ink)" : "var(--ink-soft)",
              fontWeight: 700, fontSize: 11.5,
              boxShadow: activeTab === "leaderboard" ? "var(--e1)" : "none",
              cursor: "pointer",
            }}
          >
            <Icon name="trophy" size={13} color={activeTab === "leaderboard" ? "var(--accent)" : "currentColor"} />
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

      {activeTab === "area-names" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          {/* Header Banner */}
          <div style={{ padding: "12px 14px 10px", background: "linear-gradient(135deg, rgba(194,96,58,0.12), rgba(217,119,6,0.08))", borderBottom: "1px solid var(--line)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent-deep)" }}>
              Toponymy Series • Verified
            </div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              How Hyderabad Got Its Names
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2, lineHeight: 1.4 }}>
              Linguistic roots, royal firmans, and popular myths debunked across 25+ localities.
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--hairline)", background: "var(--cream-hi)" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search area (e.g. Gachibowli, Abids, stepwell)..."
                value={areaQuery}
                onChange={(e) => setAreaQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 28px 6px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--line)",
                  background: "#fff",
                  fontSize: 12,
                  fontFamily: "inherit",
                }}
              />
              {areaQuery && (
                <button
                  onClick={() => setAreaQuery("")}
                  style={{
                    position: "absolute",
                    right: 8,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    color: "var(--muted)",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Language Root Chips */}
          <div
            style={{
              display: "flex",
              gap: 6,
              padding: "8px 12px",
              overflowX: "auto",
              borderBottom: "1px solid var(--hairline)",
              scrollbarWidth: "none",
              flexShrink: 0,
              background: "var(--cream-hi)",
            }}
          >
            {areaLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setAreaLangFilter(lang)}
                style={{
                  padding: "3px 9px",
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor: areaLangFilter === lang ? "var(--accent)" : "var(--line)",
                  background: areaLangFilter === lang ? "var(--accent-wash)" : "#fff",
                  color: areaLangFilter === lang ? "var(--accent-deep)" : "var(--ink-soft)",
                  fontSize: 11,
                  fontWeight: areaLangFilter === lang ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {lang === "all" ? `All (${AREA_ETYMOLOGIES.length})` : lang}
              </button>
            ))}
          </div>

          {/* Area Cards List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
            {filteredAreas.length === 0 ? (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                No area name matching &ldquo;{areaQuery}&rdquo;
              </div>
            ) : (
              filteredAreas.map((area) => {
                const isSelected = selectedAreaId === area.id;
                return (
                  <div
                    key={area.id}
                    onClick={() => {
                      onSelectArea?.(area);
                      if (area.coordinates) {
                        onFlyToLocation?.(area.coordinates, area.id);
                      }
                    }}
                    style={{
                      marginBottom: 12,
                      padding: "12px 14px",
                      borderRadius: "var(--r-md, 10px)",
                      background: isSelected ? "var(--accent-wash)" : "#fff",
                      border: isSelected ? "1.5px solid var(--accent)" : "1px solid var(--line)",
                      boxShadow: isSelected ? "var(--e2)" : "var(--e1)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                  {/* Title & Scripts */}
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>
                        {area.name}
                      </span>
                      {area.teluguName && (
                        <span style={{ fontSize: 11, color: "var(--accent-deep)", fontWeight: 600 }}>
                          {area.teluguName}
                        </span>
                      )}
                      {area.urduName && (
                        <span style={{ fontSize: 11, color: "var(--muted)", direction: "rtl" }}>
                          {area.urduName}
                        </span>
                      )}
                    </div>
                    {/* Language Badges */}
                    <div style={{ display: "flex", gap: 4 }}>
                      {area.languages.map((l) => (
                        <span
                          key={l}
                          style={{
                            fontSize: 9.5,
                            padding: "1px 6px",
                            borderRadius: 4,
                            background: "var(--accent-wash)",
                            color: "var(--accent-deep)",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Roots Breakdown */}
                  {area.roots && area.roots.length > 0 && (
                    <div style={{ margin: "6px 0", display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {area.roots.map((r, ri) => (
                        <span
                          key={ri}
                          style={{
                            fontSize: 10.5,
                            padding: "2px 7px",
                            background: "var(--cream)",
                            border: "1px solid var(--hairline)",
                            borderRadius: 4,
                            color: "var(--ink)",
                          }}
                        >
                          <strong>{r.term}</strong> ({r.meaning})
                        </span>
                      ))}
                    </div>
                  )}

                  {/* History Narrative */}
                  <div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5, margin: "6px 0 8px" }}>
                    {area.history || area.summary}
                  </div>

                  {/* Myth Debunked Callout */}
                  {area.mythDebunked && (
                    <div
                      style={{
                        padding: "7px 10px",
                        borderRadius: 6,
                        background: "rgba(217,119,6,0.08)",
                        borderLeft: "3px solid #d97706",
                        fontSize: 11,
                        color: "#78350f",
                        lineHeight: 1.4,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>Myth Check: </span>
                      {area.mythDebunked}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 6, marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--hairline)" }}>
                    {area.relatedSiteId && (
                      <button
                        className="dhm-btn pressable-sm"
                        onClick={() => onSelectSite?.(area.relatedSiteId)}
                        style={{
                          fontSize: 11,
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: "var(--accent-wash)",
                          color: "var(--accent-deep)",
                          border: "1px solid var(--accent)",
                          cursor: "pointer",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        View Monument
                      </button>
                    )}
                    {area.coordinates && (
                      <button
                        className={`dhm-btn pressable-sm ${isSelected ? "primary" : "ghost"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectArea?.(area);
                          onFlyToLocation?.(area.coordinates, area.id);
                        }}
                        style={{
                          fontSize: 11,
                          padding: "4px 10px",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        Fly to Area
                      </button>
                    )}
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>
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
                  <span style={{ width: 22, textAlign: "center", fontWeight: 800, fontSize: 11, color: i < 3 ? "var(--accent-deep)" : "var(--muted)" }}>
                    #{i + 1}
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

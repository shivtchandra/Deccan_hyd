"use client";

import { Icon } from "./Icons.jsx";

const ERA_COLOR = {
  earlier: "#6b6b5a",
  "qutb-shahi": "#b8612f",
  "asaf-jahi": "#2e6ea6",
  "british-residency": "#4b7c59",
  "nizam-civic": "#7a3fa0",
};

export default function RoutePanel({
  routeIds,
  sitesById,
  planned,
  planning,
  presets,
  trails = [],
  onRemove,
  onReorderClear,
  onPlan,
  onLoadPreset,
  onStartTrail,
  onShare,
  onClose,
}) {
  const hasStops = routeIds.length > 0;

  return (
    <>
      <div className="screen" role="dialog" aria-label="Walking route" style={{ padding: 0 }}>

        {/* Header */}
        <div style={{ padding: "18px 16px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="route" size={18} width={2} color="var(--accent-deep)" />
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>Routes</span>
        </div>

        {/* Active route stops */}
        {hasStops && (
          <div style={{ padding: "12px 16px 0" }}>
            <div className="t-over" style={{ color: "var(--muted)", marginBottom: 8 }}>Your walk</div>
            {planned && (
              <div style={{ fontSize: 12.5, color: "var(--accent-deep)", fontWeight: 600, marginBottom: 8 }}>
                {planned.distanceKm} km · {planned.minutes} min{planned.approx ? " (approx)" : ""}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              {routeIds.map((id, i) => {
                const s = sitesById.get(id);
                return (
                  <div key={id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--cream-hi)", borderRadius: "var(--r-sm)", boxShadow: "var(--e1)" }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{s?.name || id}</span>
                    <button style={{ background: "none", border: "none", padding: 4, cursor: "pointer", opacity: 0.5 }} onClick={() => onRemove(id)} aria-label="Remove">
                      <Icon name="close" size={13} width={2} color="var(--ink)" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button className="btn primary pressable-sm" disabled={routeIds.length < 2 || planning} onClick={onPlan} style={{ flex: 1 }}>
                {planning ? "Planning…" : "Plan walk"}
              </button>
              {planned && <button className="btn pressable-sm" onClick={onShare}>Copy link</button>}
              <button className="btn ghost pressable-sm" onClick={onReorderClear}>Clear</button>
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 96px" }}>

          {/* Heritage trails */}
          {trails.length > 0 && (
            <>
              <div className="t-over" style={{ color: "var(--muted)", marginBottom: 10 }}>Heritage Walks</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {trails.map((t) => {
                  const accentColor = ERA_COLOR[t.era] || "var(--accent-deep)";
                  return (
                    <button
                      key={t.id}
                      className="pressable-sm"
                      onClick={() => { onStartTrail?.(t.id); onClose?.(); }}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "var(--cream-hi)", borderRadius: "var(--r-md)", boxShadow: "var(--e1)", border: "1px solid var(--hairline)", textAlign: "left", cursor: "pointer", width: "100%" }}
                    >
                      {t.hero_image && (
                        <div style={{ width: 56, height: 56, borderRadius: "var(--r-sm)", overflow: "hidden", flexShrink: 0 }}>
                          <img src={t.hero_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>{t.title}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 4 }}>{t.subtitle || t.description?.split(".")[0]}</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {t.distance_km && <span style={{ fontSize: 11, fontWeight: 600, color: accentColor }}>{t.distance_km} km</span>}
                          {t.stops?.length && <span style={{ fontSize: 11, color: "var(--muted)" }}>{t.stops.length} stops</span>}
                        </div>
                      </div>
                      <Icon name="chevron-right" size={15} width={2} color="var(--muted)" />
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Preset quick walks */}
          {presets.length > 0 && (
            <>
              <div className="t-over" style={{ color: "var(--muted)", marginBottom: 10 }}>Quick Walks</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {presets.map((p) => (
                  <button
                    key={p.id}
                    className="pressable-sm"
                    onClick={() => onLoadPreset(p)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--cream-hi)", borderRadius: "var(--r-sm)", boxShadow: "var(--e1)", border: "1px solid var(--hairline)", textAlign: "left", cursor: "pointer", width: "100%" }}
                  >
                    <Icon name="route" size={15} width={2} color="var(--accent)" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.siteIds?.length} stops · {p.notes?.split(".")[0]}</div>
                    </div>
                    <Icon name="chevron-right" size={14} width={2} color="var(--muted)" />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Empty state if no trails + no presets */}
          {!hasStops && trails.length === 0 && presets.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--muted)" }}>
              <Icon name="route" size={28} width={1.5} color="var(--line)" />
              <p style={{ fontSize: 13, marginTop: 12 }}>Add sites from their detail sheet to build a custom walk, or check back for curated routes.</p>
            </div>
          )}

          {/* Custom walk hint */}
          {!hasStops && (trails.length > 0 || presets.length > 0) && (
            <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--pop-wash)", borderRadius: "var(--r-sm)", fontSize: 12.5, color: "var(--muted)" }}>
              <b style={{ color: "var(--pop-deep)" }}>Build your own:</b> open any site and tap "Add to route" to create a custom walk.
            </div>
          )}
        </div>
      </div>
    </>
  );
}



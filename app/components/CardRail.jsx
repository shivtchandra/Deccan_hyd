"use client";

import { useEffect, useRef } from "react";
import { eraLabel, typeLabel, statusLabel, eraColor, photoUrl, haversineKm, distanceLabel } from "../../lib/heritage.js";
import { TypeIcon } from "./Icons.jsx";

export default function CardRail({ sites, selectedId, onSelect, onOpen, userLoc, layout = "rail" }) {
  const railRef = useRef(null);
  const clickedIdRef = useRef(null);

  useEffect(() => {
    if (!selectedId || !railRef.current) return;
    if (clickedIdRef.current === selectedId) {
      clickedIdRef.current = null;
      return;
    }
    const el = railRef.current.querySelector(`[data-id="${selectedId}"]`);
    if (layout === "rail") {
      el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    } else {
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedId, layout]);

  if (!sites.length) {
    if (layout === "list") {
      return (
        <div className="dhm-card-list-wrap" style={{ padding: "24px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>
            No heritage sites match
          </div>
          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
            Try selecting another period or clearing filters.
          </div>
        </div>
      );
    }
    return null;
  }

  if (layout === "list") {
    return (
      <div ref={railRef} className="dhm-card-list-wrap">
        {sites.slice(0, 40).map((s) => {
          const risk = s.status === "at-risk" || s.status === "lost";
          const sel = s.id === selectedId;
          const color = eraColor(s.era);
          return (
            <button
              key={s.id}
              data-id={s.id}
              className="dhm-card-list-item pressable-sm"
              data-selected={sel}
              onClick={() => {
                clickedIdRef.current = s.id;
                if (sel) onOpen();
                else onSelect(s.id);
              }}
              style={{ "--era-c": color }}
            >
              <div className="dhm-card-list-thumb">
                {s.hasPhoto ? (
                  <img src={photoUrl(s.id)} alt="" loading="lazy" />
                ) : (
                  <TypeIcon type={s.type} size={20} width={1.4} color="rgba(255,255,255,0.9)" />
                )}
              </div>
              <div className="dhm-card-list-body">
                <div className="dhm-card-list-name">
                  {s.name}
                  {s.id === "charminar" && (
                    <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 800, color: "var(--accent-deep)", background: "var(--accent-wash)", padding: "1px 6px", borderRadius: 999 }}>
                      🏰 2.5D
                    </span>
                  )}
                </div>
                <div className="dhm-card-list-meta">
                  <span style={{ color }}>{eraLabel(s.era)}</span>
                  <span>·</span>
                  <span>{typeLabel(s.type)}</span>
                  {risk && <span style={{ color: "var(--danger)" }}>· {statusLabel(s.status)}</span>}
                  {userLoc && (
                    <span style={{ color: "var(--era-qutb-shahi)", fontWeight: 700 }}>
                      · {distanceLabel(haversineKm(userLoc, s))}
                    </span>
                  )}
                </div>
              </div>
              {sel && <span className="dhm-card-list-chevron">›</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // rail mode — mobile horizontal scroll
  return (
    <div
      ref={railRef}
      style={{
        position: "absolute", left: 0, right: 0, bottom: 84,
        display: "flex", gap: 10, padding: "0 14px",
        overflowX: "auto", zIndex: 400,
        scrollSnapType: "x proximity",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}
    >
      {sites.slice(0, 40).map((s) => {
        const risk = s.status === "at-risk" || s.status === "lost";
        const sel = s.id === selectedId;
        const color = eraColor(s.era);
        return (
          <button
            key={s.id}
            data-id={s.id}
            className="pressable-sm"
            onClick={() => {
              clickedIdRef.current = s.id;
              if (sel) onOpen();
              else onSelect(s.id);
            }}
            style={{
              flex: "0 0 auto", width: 220, scrollSnapAlign: "center", textAlign: "left",
              background: "var(--cream-hi)",
              border: sel ? `2px solid ${color}` : "1px solid var(--line)",
              borderRadius: "var(--r-md)", overflow: "hidden",
              boxShadow: sel
                ? `0 4px 14px color-mix(in srgb, ${color} 35%, transparent), var(--e2)`
                : "var(--e2)",
              transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
            }}
          >
            <div style={{ height: 92, background: color, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {s.hasPhoto ? (
                <img src={photoUrl(s.id)} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.05) contrast(1.02)" }} />
              ) : (
                <TypeIcon type={s.type} size={40} width={1.4} color="rgba(255,255,255,0.9)" />
              )}
            </div>
            <div style={{ padding: "9px 11px 11px" }}>
              <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 15, lineHeight: 1.2, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ color, fontWeight: 700 }}>{eraLabel(s.era)}</span>
                <span>·</span>
                <span>{typeLabel(s.type)}</span>
                {risk && <span style={{ color: "var(--danger)" }}>· {statusLabel(s.status)}</span>}
              </div>
              {userLoc && (
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--era-qutb-shahi)", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--era-qutb-shahi)" }} />
                  {distanceLabel(haversineKm(userLoc, s))} away
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

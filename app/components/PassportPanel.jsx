"use client";

import { ERAS, ERA_ORDER, eraLabel } from "../../lib/heritage.js";
import { progressByEra, stats } from "../../lib/passport.js";
import { Icon, Squiggles, Wave } from "./Icons.jsx";

// REWRITTEN — eateries-style layout

const MILESTONES = [
  { n: 1, label: "First stamp", icon: "flag" },
  { n: 5, label: "Getting around", icon: "compass" },
  { n: 10, label: "Ten deep", icon: "map" },
  { n: 25, label: "Devotee", icon: "star" },
  { n: 45, label: "City legend", icon: "crown" },
];

export default function PassportPanel({ sites, passport, onPick }) {
  const st = stats(sites, passport);
  const bars = progressByEra(sites, passport);
  const visitedList = st.visited.slice().sort((a, b) => a.name.localeCompare(b.name));
  const n = st.visitedCount;
  const pct = st.totalCount ? (n / st.totalCount) * 100 : 0;

  const next = MILESTONES.find((m) => n < m.n);
  const earned = MILESTONES.filter((m) => n >= m.n);

  return (
    <div className="screen">
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(150deg, var(--pop-deep), var(--pop))", position: "relative", paddingTop: 28, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: "-10% -5% 30%", opacity: 0.22, pointerEvents: "none" }}>
            <Squiggles color="rgba(255,255,255,0.9)" style={{ width: "100%", height: "100%" }} />
          </div>
          <div style={{ textAlign: "center", padding: "0 16px 8px", position: "relative" }}>
            <div className="groovy" style={{ fontSize: 72, lineHeight: 0.9, color: "rgba(255,255,255,0.95)", textShadow: "0 3px 0 rgba(0,0,0,0.18)" }}>
              {n}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 8 }}>
              {n === 1 ? "heritage site visited" : "heritage sites visited"}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", marginTop: 4, fontWeight: 500 }}>
              {pct < 0.1 && n > 0 ? "<0.1" : pct.toFixed(1)}% of {st.totalCount} sites
            </div>
          </div>
          <Wave color="var(--cream)" style={{ position: "relative" }} />
        </div>

        <div style={{ padding: "4px 16px 72px" }}>

          {/* Next milestone */}
          {next && (
            <div style={{ background: "var(--cream-hi)", border: "1.5px solid var(--line)", borderRadius: 16, padding: "13px 15px", marginBottom: 18, marginTop: 16 }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(100, (n / next.n) * 100)}%` }} />
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name={next.icon} size={14} width={2} color="var(--pop-deep)" />
                {next.n - n} more to <b style={{ color: "var(--pop-deep)" }}>{next.label}</b>
              </div>
            </div>
          )}

          {/* Empty state */}
          {n === 0 && (
            <div style={{ textAlign: "center", padding: "20px 14px 24px", color: "var(--muted)", background: "var(--cream-hi)", borderRadius: 16, border: "1.5px solid var(--line)", marginBottom: 20 }}>
              <Icon name="passport" size={38} width={1.4} color="var(--line)" />
              <div style={{ fontWeight: 700, fontSize: 15.5, color: "var(--ink)", marginTop: 10, marginBottom: 6 }}>Start exploring Hyderabad</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>
                Open any site, visit it in person, and tap <strong style={{ color: "var(--pop-deep)" }}>Check in</strong> — your pin blooms into colour.
              </div>
            </div>
          )}

          {/* Earned badges */}
          {earned.length > 0 && (
            <>
              <div className="t-over" style={{ color: "var(--muted)", margin: "20px 0 10px" }}>Badges</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {passport.badges?.['master-sleuth-charminar'] && (
                  <div style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(180,83,9,0.15))", border: "1.5px solid #d4af37", borderRadius: 20, padding: "7px 13px", display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: "#b45309" }}>
                    <span>🦪</span> Master Sleuth (Charminar)
                  </div>
                )}
                {earned.map((m) => (
                  <div key={m.n} style={{ background: "var(--cream-hi)", border: "1.5px solid var(--pop)", borderRadius: 20, padding: "7px 13px", display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: "var(--pop-deep)" }}>
                    <Icon name={m.icon} size={14} width={2} color="var(--pop-deep)" /> {m.label}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Master Sleuth badge if no milestone badges yet */}
          {earned.length === 0 && passport.badges?.['master-sleuth-charminar'] && (
            <>
              <div className="t-over" style={{ color: "var(--muted)", margin: "20px 0 10px" }}>Special Honors</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                <div style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(180,83,9,0.15))", border: "1.5px solid #d4af37", borderRadius: 20, padding: "7px 13px", display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: "#b45309" }}>
                  <span>🦪</span> Master Sleuth (Charminar Heirloom Box)
                </div>
              </div>
            </>
          )}

          {/* Era progress */}
          <div className="t-over" style={{ color: "var(--muted)", margin: "20px 0 10px" }}>By era</div>
          {ERA_ORDER.map((e) => {
            const row = bars.find((b) => b.era === e);
            if (!row || !row.total) return null;
            const eraPct = Math.round((row.visited / row.total) * 100);
            return (
              <div key={e} style={{ marginBottom: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: ERAS[e].color, display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontWeight: 600 }}>{ERAS[e].label}</span>
                  </div>
                  <span style={{ color: "var(--muted)", fontWeight: 600 }}>{row.visited}/{row.total}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${eraPct}%`, background: ERAS[e].color }} />
                </div>
              </div>
            );
          })}

          {/* Stamps list */}
          {visitedList.length > 0 && (
            <>
              <div className="t-over" style={{ color: "var(--muted)", margin: "24px 0 10px" }}>Stamps ({visitedList.length})</div>
              {visitedList.map((s) => (
                <button key={s.id} onClick={() => onPick(s.id)} className="pressable-sm"
                  style={{ display: "flex", width: "100%", gap: 10, alignItems: "center", textAlign: "left", padding: "10px 4px", borderBottom: "1px dashed var(--line)", background: "none", border: "none" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: ERAS[s.era]?.color || "var(--accent)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, flex: 1 }}>{s.name}</span>
                  <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{eraLabel(s.era)}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

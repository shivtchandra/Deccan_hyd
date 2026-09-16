"use client";

import { useEffect, useState } from "react";
import { fetchExplorers } from "../../lib/checkin.js";
import { getName, setName as saveName, getUid } from "../../lib/identity.js";
import { Icon } from "./Icons.jsx";
import { Squiggles, Wave } from "./Icons.jsx";
import OriginsMap from "./OriginsMap.jsx";
import OriginsChapter from "./OriginsChapter.jsx";
import { ORIGINS_BY_ID } from "../../lib/culturalOrigins.js";

const MEDAL = { 1: "#d9a53a", 2: "#b9bcc4", 3: "#c58a54" };

export default function LeaderboardPanel({ onChapterChange }) {
  const [activeTab, setActiveTab] = useState("origins");
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading");
  const [uid, setUid] = useState(null);
  const [name, setNameState] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setNameState(getName());
    getUid().then(setUid);
    fetchExplorers(50).then((r) => {
      setRows(r);
      setStatus(r.length ? "ready" : "empty");
    });
  }, []);

  const saveMyName = () => { saveName(name); setEditing(false); };
  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  const podium = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
  const heights = { 0: 74, 1: 96, 2: 60 };
  const ranks = { 0: 2, 1: 1, 2: 3 };

  return (
    <div className="screen">
      {/* Origins chapter overlay */}
      {selectedOrigin && (
        <OriginsChapter
          item={selectedOrigin}
          onClose={() => setSelectedOrigin(null)}
          onNavigate={(newItem) => setSelectedOrigin(newItem)}
        />
      )}

      {/* Tab toggle header */}
      <div className="og-tab-header">
        {[
          ["origins", "Origins", "compass", "Trace where Hyderabad came from"],
          ["leaderboard", "Explorers", "trophy", "Discover the people & places that shaped it"],
        ].map(([id, label, iconName, desc]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`og-sub-tab pressable-sm ${activeTab === id ? "active" : ""}`}
          >
            <div className="og-sub-tab-inner">
              <div className="og-sub-tab-row">
                <Icon name={iconName} size={14} color={activeTab === id ? "var(--accent)" : "var(--ink-soft)"} />
                <span className="og-sub-tab-title">{label}</span>
              </div>
              <span className="og-sub-tab-desc">{desc}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Origins tab */}
      {activeTab === "origins" && (
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <OriginsMap
            onDetailChange={onChapterChange}
            onSelect={(id) => setSelectedOrigin(ORIGINS_BY_ID[id])}
          />
        </div>
      )}

      {/* Leaderboard tab */}
      {activeTab === "leaderboard" && <>
      <div style={{ position: "relative", background: "linear-gradient(150deg, var(--accent-deep), var(--accent))", padding: "26px 18px 22px", color: "#fff", overflow: "hidden" }}>
        <Squiggles color="rgba(255,255,255,0.25)" style={{ position: "absolute", top: 8, left: 0, right: 0, width: "100%", height: 30 }} />
        <div className="t-over" style={{ opacity: 0.85 }}>The Explorers</div>
        <h2 style={{ margin: "4px 0 0", color: "#fff", fontSize: 26 }}>Who's mapped the most</h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.9, lineHeight: 1.4 }}>Check in at a site — you must be there — to score. The obscure and the endangered are worth more than the famous.</p>
        <Wave color="var(--cream)" style={{ position: "absolute", left: 0, bottom: -1 }} />
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--cream-hi)", borderRadius: "var(--r-md)", padding: "10px 12px", boxShadow: "var(--e1)", marginBottom: 16 }}>
          <span style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--accent-wash)", color: "var(--accent-deep)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
            {(name || "?").slice(0, 1).toUpperCase()}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, letterSpacing: "0.04em" }}>YOUR NAME ON THE BOARD</div>
            {editing ? (
              <input value={name} onChange={(e) => setNameState(e.target.value)} maxLength={24} autoFocus
                onKeyDown={(e) => e.key === "Enter" && saveMyName()}
                style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 8, padding: "5px 8px", font: "inherit", fontSize: 14, marginTop: 2 }} />
            ) : (
              <div style={{ fontWeight: 700, fontSize: 15 }}>{name || "Set a name"}</div>
            )}
          </div>
          <button className="pressable-sm" onClick={() => (editing ? saveMyName() : setEditing(true))}
            style={{ border: "1px solid var(--line)", background: "transparent", borderRadius: 999, padding: "6px 12px", fontSize: 12.5, fontWeight: 700 }}>
            {editing ? "Save" : "Edit"}
          </button>
        </div>

        {status === "loading" && <div style={{ textAlign: "center", color: "var(--muted)", padding: 30 }}><span className="swirl" style={{ display: "inline-block" }}><Icon name="compass" size={24} color="var(--accent)" /></span></div>}

        {status === "empty" && (
          <div style={{ textAlign: "center", padding: "30px 20px", color: "var(--ink-soft)" }}>
            <Icon name="trophy" size={30} color="var(--accent)" style={{ margin: "0 auto 10px" }} />
            <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 17 }}>Be the first explorer</div>
            <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.45 }}>No one's checked in yet. Stand at any monument, tap <b>Check in</b>, and you'll top the board.</div>
          </div>
        )}

        {status === "ready" && (
          <>
            {/* podium */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 10, margin: "8px 0 18px" }}>
              {podium.map((p, i) => p ? (
                <div key={ranks[i]} style={{ flex: i === 1 ? 1.15 : 1, maxWidth: 120, textAlign: "center" }}>
                  <div style={{ position: "relative", marginBottom: 6 }}>
                    <span style={{ width: i === 1 ? 48 : 40, height: i === 1 ? 48 : 40, borderRadius: "50%", background: "var(--cream-hi)", border: `3px solid ${MEDAL[ranks[i]]}`, color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: i === 1 ? 18 : 15, margin: "0 auto", boxShadow: "var(--e1)" }}>
                      {(p.name || "?").slice(0, 1).toUpperCase()}
                    </span>
                    {i === 1 && <Icon name="crown" size={18} color="#d9a53a" style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)" }} />}
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.uid === uid ? "You" : p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.points} pts</div>
                  <div style={{ height: heights[i], background: `linear-gradient(180deg, ${MEDAL[ranks[i]]}, ${MEDAL[ranks[i]]}cc)`, borderRadius: "8px 8px 0 0", marginTop: 6, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 6, color: "#fff", fontWeight: 800, fontFamily: "Fraunces, serif" }}>{ranks[i]}</div>
                </div>
              ) : <div key={i} style={{ flex: 1 }} />)}
            </div>

            {rest.map((p, i) => (
              <div key={p.uid} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: p.uid === uid ? "var(--accent-wash)" : "var(--cream-hi)", borderRadius: "var(--r-sm)", marginBottom: 7, boxShadow: "var(--e1)" }}>
                <span style={{ width: 22, textAlign: "center", fontWeight: 800, color: "var(--muted)" }}>{i + 4}</span>
                <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{p.uid === uid ? "You" : p.name}</span>
                <span style={{ fontSize: 13, color: "var(--accent-deep)", fontWeight: 700 }}>{p.points} pts</span>
              </div>
            ))}
          </>
        )}

        <div style={{ marginTop: 14, fontSize: 11.5, color: "var(--muted)", lineHeight: 1.5, paddingBottom: 8 }}>
          <b>Points:</b> at-risk 25 · unprotected 22 · INTACH 15 · state 12 · ASI 10. Reward the overlooked.
        </div>
      </div>
    </>}
  </div>
  );
}

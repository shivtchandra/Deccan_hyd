"use client";

import { useEffect, useRef, useState } from "react";
import { IsometricCityEngine } from "./wimmelbild/IsometricCityEngine.js";
import { WIMMEL_RELICS, BAZAAR_HOTSPOTS } from "./wimmelbild/charminarCityData.js";

// Comprehensive Web Audio Synthesizer for Living Bazaar Sounds
function playBazaarSound(type = "default") {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === "auto_horn") {
      // Classic Indian Auto-Rickshaw Dual-Tone Horn (Pee-Peep!)
      [0, 0.12].forEach((delay) => {
        [440, 554.37].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, now + delay);
          gain.gain.setValueAtTime(0.08, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.09);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.1);
        });
      });
    } else if (type === "bangle_clink" || type === "coin_chime") {
      // Sparkling Glass & Metal Bangle Harmonics
      [2093, 2637, 3135.96, 4186].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.1, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.45);
      });
    } else if (type === "chai_pour" || type === "steam_hiss") {
      // Steaming Chai Decoction / Samovar Hiss
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "pigeon_coo") {
      // Gentle Deccan Pigeon Cooing Tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(329.63, now);
      osc.frequency.linearRampToValueAtTime(392, now + 0.15);
      osc.frequency.linearRampToValueAtTime(293.66, now + 0.4);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "cycle_bell") {
      // Double Bicycle Bell Ring (Tring-Tring!)
      [0, 0.1].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1760, now + delay);
        gain.gain.setValueAtTime(0.15, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.2);
      });
    } else if (type === "camera_click") {
      // Camera Shutter Snap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else {
      // Warm Ascending Heritage Chime
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.12, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.45);
      });
    }
  } catch {}
}

export default function IsometricDiorama({ onClose }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [timeMode, setTimeMode] = useState("day");
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);

  const [foundSecrets, setFoundSecrets] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("dhm_charminar_secrets");
        return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  const [activeSecretModal, setActiveSecretModal] = useState(null);
  const [activeHotspotModal, setActiveHotspotModal] = useState(null);
  const [inspectedBuilding, setInspectedBuilding] = useState(null);
  const [showRelicDrawer, setShowRelicDrawer] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(false); // start straight in the living scene!
  const [showToast, setShowToast] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-fade instruction hint after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setHasInteracted(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Living Isometric City Atlas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new IsometricCityEngine(canvas, {
      onInteraction: () => setHasInteracted(true),
      onSecretClick: (secret) => {
        playBazaarSound(secret.sound || "bangle_clink");
        setFoundSecrets((prev) => {
          const next = new Set(prev);
          next.add(secret.id);
          try {
            localStorage.setItem("dhm_charminar_secrets", JSON.stringify([...next]));
          } catch {}
          return next;
        });

        // Trigger discovery toast
        setShowToast(secret);

        // Advance tracked target to the next unfound relic
        const nextUnfoundIdx = WIMMEL_RELICS.findIndex((r) => !foundSecrets.has(r.id) && r.id !== secret.id);
        if (nextUnfoundIdx !== -1) {
          setCurrentTargetIndex(nextUnfoundIdx);
        }

        setInspectedBuilding(null);
        setActiveHotspotModal(null);
      },
      onHotspotClick: (hotspot) => {
        playBazaarSound(hotspot.sound || "default");
        setActiveHotspotModal(hotspot);
        setInspectedBuilding(null);
        setActiveSecretModal(null);
      },
      onBuildingClick: (building) => {
        playBazaarSound("stone_chime");
        setInspectedBuilding(building);
        setActiveSecretModal(null);
        setActiveHotspotModal(null);
      },
    });

    engineRef.current = engine;
    engine.init();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Sync state changes with engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setTimeMode(timeMode);
      engineRef.current.setFoundSecrets(foundSecrets);
    }
  }, [timeMode, foundSecrets]);

  // Current active quest target
  const currentTarget = WIMMEL_RELICS[currentTargetIndex] || WIMMEL_RELICS[0];
  const count = foundSecrets.size;
  const total = WIMMEL_RELICS.length;
  const pct = Math.round((count / total) * 100);

  // Auto-dismiss toast after 7s
  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(null), 7000);
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "#1E1813",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Outfit', sans-serif",
        userSelect: "none",
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* TOP FLOATING NAVIGATION & WHEREISMRKIM TARGET CARD */}
      {/* ------------------------------------------------------------- */}
      <header
        style={{
          position: "absolute",
          top: 12,
          left: 14,
          right: 14,
          zIndex: 2100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pointerEvents: "none",
          gap: 10,
        }}
      >
        {/* Left: Back to Heritage Map */}
        <button
          onClick={onClose}
          className="pressable-sm"
          style={{
            pointerEvents: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 6,
            background: "#FAF4E9",
            border: "1px solid rgba(142, 119, 93, 0.4)",
            boxShadow: "0 3px 12px rgba(0, 0, 0, 0.2)",
            color: "#27372F",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <span>←</span>
          <span>Map</span>
        </button>

        {/* Center: whereismrkim-style Target Card (.target-card.paper) */}
        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "5px 10px 5px 6px",
            borderRadius: 6,
            background: "#FAF4E9",
            border: "1px solid rgba(142, 119, 93, 0.45)",
            boxShadow: "0 4px 18px rgba(0, 0, 0, 0.22)",
            maxWidth: "min(440px, calc(100% - 150px))",
            cursor: "pointer",
          }}
          onClick={() => setActiveSecretModal(currentTarget)}
          title="Click to view target clues and lore"
        >
          {/* Target Mini Portrait Thumbnail */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 4,
              background: "#EFE4D0",
              border: "1px solid rgba(187, 170, 137, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              boxShadow: "inset 0 0 10px rgba(128, 107, 65, 0.15)",
              flexShrink: 0,
            }}
          >
            {currentTarget.icon}
          </div>

          {/* Target Identity & Progress */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 800,
                color: "#974631",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{foundSecrets.has(currentTarget.id) ? "FOUND ✓" : "SEEKING"}</span>
              <span style={{ color: "#7A7365" }}>·</span>
              <span style={{ color: "#535B50" }}>{currentTarget.category}</span>
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#27372F",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.2,
                marginTop: 1,
              }}
            >
              {currentTarget.name}
            </div>
          </div>

          {/* Mini Counter Pill */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 10.5, fontWeight: 800, color: "#27372F" }}>
              {count}/{total}
            </span>
            <div
              style={{
                width: 38,
                height: 4,
                borderRadius: 999,
                background: "rgba(39, 55, 47, 0.12)",
                overflow: "hidden",
                marginTop: 2,
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: "#974631",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Lighting Toggle & Checklist / Info Buttons */}
        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {/* Day / Dusk / Lights Mode Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#FAF4E9",
              borderRadius: 6,
              border: "1px solid rgba(142, 119, 93, 0.4)",
              boxShadow: "0 3px 12px rgba(0, 0, 0, 0.2)",
              padding: 2,
            }}
          >
            {[
              { id: "day", label: "☀️" },
              { id: "golden", label: "🌅" },
              { id: "night", label: "🌙" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setTimeMode(m.id)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 4,
                  border: "none",
                  fontSize: 12,
                  background: timeMode === m.id ? "#974631" : "transparent",
                  color: timeMode === m.id ? "#fff" : "#535B50",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                title={`Switch to ${m.id} lighting`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* All Relics Checklist Button */}
          <button
            onClick={() => setShowRelicDrawer(true)}
            className="pressable-sm"
            title="View All Relics & Clues"
            style={{
              padding: "7px 11px",
              borderRadius: 6,
              background: "#FAF4E9",
              border: "1px solid rgba(142, 119, 93, 0.4)",
              boxShadow: "0 3px 12px rgba(0, 0, 0, 0.2)",
              color: "#27372F",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            📜
          </button>

          {/* Info / Prologue Button */}
          <button
            onClick={() => setShowStartScreen(true)}
            className="pressable-sm"
            title="About the Living Bazaars"
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: "#FAF4E9",
              border: "1px solid rgba(142, 119, 93, 0.4)",
              boxShadow: "0 3px 12px rgba(0, 0, 0, 0.2)",
              color: "#27372F",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            i
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN LIVING ISOMETRIC CANVAS VIEWPORT */}
      {/* ------------------------------------------------------------- */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          position: "relative",
          width: "100%",
          height: "100%",
          cursor: "grab",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
          }}
        />

        {/* Floating Zoom Controls */}
        <div
          style={{
            position: "absolute",
            right: 14,
            bottom: 20,
            zIndex: 2150,
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <button
            onClick={() => engineRef.current?.zoomIn()}
            className="pressable-sm"
            aria-label="Zoom in"
            style={{
              width: 34,
              height: 34,
              borderRadius: 6,
              background: "#FAF4E9",
              border: "1px solid rgba(142, 119, 93, 0.4)",
              boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
              fontSize: 17,
              fontWeight: 700,
              color: "#27372F",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
          <button
            onClick={() => engineRef.current?.zoomOut()}
            className="pressable-sm"
            aria-label="Zoom out"
            style={{
              width: 34,
              height: 34,
              borderRadius: 6,
              background: "#FAF4E9",
              border: "1px solid rgba(142, 119, 93, 0.4)",
              boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
              fontSize: 17,
              fontWeight: 700,
              color: "#27372F",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            −
          </button>
        </div>

        {/* Subtle Ambient Instruction Pill */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: hasInteracted ? "translate(-50%, 8px)" : "translate(-50%, 0)",
            opacity: hasInteracted ? 0 : 1,
            transition: "opacity 0.6s ease, transform 0.6s ease",
            padding: "6px 18px",
            borderRadius: 6,
            background: "#FAF4E9",
            border: "1px solid rgba(142, 119, 93, 0.45)",
            boxShadow: "0 3px 14px rgba(0, 0, 0, 0.25)",
            color: "#27372F",
            fontSize: 11.5,
            fontWeight: 700,
            pointerEvents: "none",
            letterSpacing: "0.02em",
            maxWidth: "calc(100% - 120px)",
            textAlign: "center",
          }}
        >
          ✨ Hover over people, pushcarts & shops to speak · Click to interact & hear bazaar sounds
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* LIVING BAZAAR HOTSPOT STORY MODAL / DRAWER */}
      {/* ------------------------------------------------------------- */}
      {activeHotspotModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3200,
            background: "rgba(30, 24, 18, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setActiveHotspotModal(null)}
        >
          <div
            style={{
              width: "min(440px, 100%)",
              background: "#FAF4E9",
              border: "1px solid rgba(142, 119, 93, 0.55)",
              borderRadius: 8,
              boxShadow: "0 22px 70px rgba(0, 0, 0, 0.4)",
              padding: "24px 26px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Speaker & Category */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 6,
                  background: "radial-gradient(circle at 50% 45%, #FFFDF7 0%, #EFE4D0 75%)",
                  border: "1px solid rgba(187, 170, 137, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  flexShrink: 0,
                  boxShadow: "inset 0 0 12px rgba(128, 107, 65, 0.15)",
                }}
              >
                {activeHotspotModal.icon || "📍"}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#974631",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {activeHotspotModal.category}
                </div>
                <h3
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1.35rem",
                    color: "#27372F",
                    margin: "2px 0 2px",
                    lineHeight: 1.2,
                  }}
                >
                  {activeHotspotModal.name}
                </h3>
                <div style={{ fontSize: "0.8rem", color: "#535B50", fontWeight: 600 }}>
                  Speaker: {activeHotspotModal.speaker || activeHotspotModal.category}
                </div>
              </div>

              <button
                onClick={() => setActiveHotspotModal(null)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "transparent",
                  border: "1px solid rgba(142, 119, 93, 0.3)",
                  cursor: "pointer",
                  color: "#535B50",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* Speech Dialogue Bubble */}
            {activeHotspotModal.quote && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 6,
                  background: "#EFE4D0",
                  border: "1px solid rgba(187, 170, 137, 0.6)",
                  marginBottom: 14,
                  fontStyle: "italic",
                  fontSize: "0.88rem",
                  color: "#27372F",
                  lineHeight: 1.5,
                }}
              >
                "{activeHotspotModal.quote}"
              </div>
            )}

            {/* Historical Lore & Bazaar Story */}
            <div
              style={{
                fontSize: "0.84rem",
                lineHeight: 1.6,
                color: "#434D43",
                background: "#FFFDF7",
                padding: "12px 14px",
                borderRadius: 6,
                border: "1px solid rgba(142, 119, 93, 0.25)",
              }}
            >
              {activeHotspotModal.story}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                onClick={() => {
                  playBazaarSound(activeHotspotModal.sound || "default");
                }}
                style={{
                  flex: 1,
                  padding: "9px 14px",
                  borderRadius: 6,
                  background: "#974631",
                  color: "#FAF4E9",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Hear Sound 🔊
              </button>
              <button
                onClick={() => setActiveHotspotModal(null)}
                style={{
                  padding: "9px 14px",
                  borderRadius: 6,
                  background: "transparent",
                  color: "#535B50",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  border: "1px solid rgba(142, 119, 93, 0.4)",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* WHEREISMRKIM-STYLE PROLOGUE START MODAL (#start-screen) */}
      {/* ------------------------------------------------------------- */}
      {showStartScreen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3000,
            background: "rgba(40, 34, 22, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowStartScreen(false)}
        >
          <div
            style={{
              width: "min(580px, 100%)",
              background: "#FAF4E9",
              border: "1px solid rgba(142, 119, 93, 0.55)",
              borderRadius: 8,
              boxShadow: "0 22px 70px rgba(0, 0, 0, 0.4)",
              padding: "32px 34px 28px",
              display: "grid",
              gridTemplateColumns: "115px minmax(0, 1fr)",
              gap: 26,
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Target Portrait Frame */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 165,
                borderRadius: 6,
                background: "radial-gradient(circle at 50% 45%, #FFFDF7 0%, #EFE4D0 75%)",
                border: "1px solid rgba(187, 170, 137, 0.6)",
                boxShadow: "inset 0 0 20px rgba(128, 107, 65, 0.15)",
                padding: 12,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 6 }}>{currentTarget.icon}</div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#974631",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                TARGET #1
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#27372F",
                  marginTop: 2,
                  lineHeight: 1.2,
                }}
              >
                {currentTarget.name}
              </div>
            </div>

            {/* Prologue Copy */}
            <div>
              <span
                style={{
                  color: "#535B50",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                A Crowded Deccan Market
              </span>
              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "1.9rem",
                  fontWeight: 600,
                  color: "#27372F",
                  margin: "4px 0 10px",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                Explore Old Hyderabad.
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "#434D43",
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                }}
              >
                Somewhere in the shadow of Charminar are steaming samovars, artisans rolling lac bangles, distillers of rain attar, and six hidden cultural relics.
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#974631",
                  fontSize: "0.85rem",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                }}
              >
                Clue: {currentTarget.clue}
              </p>

              <button
                onClick={() => setShowStartScreen(false)}
                style={{
                  marginTop: 20,
                  width: "100%",
                  padding: "11px 20px",
                  borderRadius: 6,
                  background: "#974631",
                  color: "#FAF4E9",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(151, 70, 49, 0.28)",
                  letterSpacing: "0.02em",
                }}
              >
                Enter the Bazaar →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* WHEREISMRKIM-STYLE DISCOVERY TOAST (#toast.paper) */}
      {/* ------------------------------------------------------------- */}
      {showToast && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 20,
            zIndex: 2400,
            width: "min(380px, calc(100% - 40px))",
            background: "#FAF4E9",
            border: "1px solid rgba(142, 119, 93, 0.55)",
            borderRadius: 6,
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
            padding: "14px 16px",
            animation: "slide-up 0.3s ease-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            {/* Golden Wax Seal Stamp */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#D97706",
                color: "#FFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 800,
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(217, 119, 6, 0.35)",
              }}
            >
              ✓
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "#974631",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {showToast.badge} · {showToast.category}
              </div>
              <h4
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "#27372F",
                  margin: "2px 0 4px",
                }}
              >
                {showToast.name}
              </h4>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#434D43",
                  margin: 0,
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {showToast.story}
              </p>

              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  onClick={() => {
                    setActiveSecretModal(showToast);
                    setShowToast(null);
                  }}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 4,
                    background: "#974631",
                    color: "#FFF",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Read Full Lore 📜
                </button>
                <button
                  onClick={() => setShowToast(null)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 4,
                    background: "transparent",
                    color: "#535B50",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    border: "1px solid rgba(142, 119, 93, 0.3)",
                    cursor: "pointer",
                  }}
                >
                  Continue
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowToast(null)}
              style={{
                background: "none",
                border: "none",
                color: "#7A7365",
                fontSize: 14,
                cursor: "pointer",
                padding: 0,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TARGET / RELIC PROVENANCE LIGHTBOX MODAL (#panel) */}
      {/* ------------------------------------------------------------- */}
      {activeSecretModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3200,
            background: "rgba(30, 24, 18, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setActiveSecretModal(null)}
        >
          <div
            style={{
              width: "min(460px, 100%)",
              maxHeight: "88vh",
              overflowY: "auto",
              background: "#FAF4E9",
              border: "1px solid rgba(142, 119, 93, 0.55)",
              borderRadius: 8,
              boxShadow: "0 22px 70px rgba(0, 0, 0, 0.4)",
              padding: "26px 28px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Portrait & Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 6,
                  background: "radial-gradient(circle at 50% 45%, #FFFDF7 0%, #EFE4D0 75%)",
                  border: "1px solid rgba(187, 170, 137, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  flexShrink: 0,
                  boxShadow: "inset 0 0 14px rgba(128, 107, 65, 0.15)",
                }}
              >
                {activeSecretModal.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#974631",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {activeSecretModal.category}
                </div>
                <h3
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1.45rem",
                    color: "#27372F",
                    margin: "2px 0 2px",
                    lineHeight: 1.2,
                  }}
                >
                  {activeSecretModal.name}
                </h3>
                <div style={{ fontSize: "0.8rem", color: "#535B50", fontWeight: 600 }}>
                  {activeSecretModal.subtitle}
                </div>
              </div>

              <button
                onClick={() => setActiveSecretModal(null)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "transparent",
                  border: "1px solid rgba(142, 119, 93, 0.3)",
                  cursor: "pointer",
                  color: "#535B50",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* Character Profile */}
            {activeSecretModal.character && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 6,
                  background: "#EFE4D0",
                  border: "1px solid rgba(187, 170, 137, 0.5)",
                  marginBottom: 14,
                }}
              >
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#974631", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Figure: {activeSecretModal.character}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#434D43", marginTop: 2, lineHeight: 1.45 }}>
                  {activeSecretModal.appearance}
                </div>
              </div>
            )}

            {/* Provenance & Cultural Lore */}
            <div
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.6,
                color: "#27372F",
                background: "#FFFDF7",
                padding: "14px 16px",
                borderRadius: 6,
                border: "1px solid rgba(142, 119, 93, 0.25)",
              }}
            >
              <div style={{ fontWeight: 700, color: "#974631", marginBottom: 4, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Historical Legend
              </div>
              {activeSecretModal.lore || activeSecretModal.story}
            </div>

            {/* Location Clue */}
            <div
              style={{
                marginTop: 12,
                fontSize: "0.8rem",
                color: "#535B50",
                fontStyle: "italic",
                lineHeight: 1.45,
              }}
            >
              <strong>Location Hint:</strong> {activeSecretModal.hint || activeSecretModal.clue}
            </div>

            {/* Actions: Pan to Target in Scene */}
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button
                onClick={() => {
                  engineRef.current?.panTo(activeSecretModal.x, activeSecretModal.y, 1.4);
                  engineRef.current?.setFocusTarget(activeSecretModal);
                  setActiveSecretModal(null);
                }}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 6,
                  background: "#974631",
                  color: "#FFF",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Center on Map 🎯
              </button>
              <button
                onClick={() => setActiveSecretModal(null)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 6,
                  background: "transparent",
                  color: "#535B50",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  border: "1px solid rgba(142, 119, 93, 0.4)",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ALL RELICS CHECKLIST DRAWER */}
      {/* ------------------------------------------------------------- */}
      {showRelicDrawer && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3100,
            background: "rgba(30, 24, 18, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowRelicDrawer(false)}
        >
          <div
            style={{
              width: "min(480px, 100%)",
              maxHeight: "85vh",
              overflowY: "auto",
              background: "#FAF4E9",
              border: "1px solid rgba(142, 119, 93, 0.55)",
              borderRadius: 8,
              boxShadow: "0 22px 70px rgba(0, 0, 0, 0.4)",
              padding: "24px 26px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#974631",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  The Living Bazaars of Charminar
                </span>
                <h3
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1.45rem",
                    color: "#27372F",
                    margin: "4px 0 2px",
                  }}
                >
                  Six Heritage Secrets
                </h3>
                <p style={{ fontSize: "0.82rem", color: "#535B50", margin: 0 }}>
                  {count} of {total} discovered. Tap any item to study its clues.
                </p>
              </div>
              <button
                onClick={() => setShowRelicDrawer(false)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "transparent",
                  border: "1px solid rgba(142, 119, 93, 0.3)",
                  cursor: "pointer",
                  color: "#535B50",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {WIMMEL_RELICS.map((s, idx) => {
                const isFound = foundSecrets.has(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSecretModal(s);
                      setShowRelicDrawer(false);
                    }}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 6,
                      background: isFound ? "#EFE4D0" : "#FFFDF7",
                      border: `1px solid ${isFound ? "rgba(187, 170, 137, 0.7)" : "rgba(142, 119, 93, 0.25)"}`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 4,
                        background: isFound ? "#D97706" : "#EFE4D0",
                        color: isFound ? "#fff" : "#27372F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {isFound ? "✓" : s.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                        <h4 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#27372F", margin: 0 }}>
                          {s.name}
                        </h4>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            color: isFound ? "#D97706" : "#974631",
                            textTransform: "uppercase",
                          }}
                        >
                          {isFound ? "Found ✓" : s.category}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "#535B50", margin: "3px 0 0", lineHeight: 1.4 }}>
                        {isFound ? "Tap to view historical provenance." : `Hint: ${s.hint}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* HISTORIC BUILDING INSPECTION DRAWER */}
      {/* ------------------------------------------------------------- */}
      {inspectedBuilding && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            maxWidth: 360,
            width: "calc(100% - 40px)",
            background: "#FAF4E9",
            borderRadius: 6,
            border: "1px solid rgba(142, 119, 93, 0.45)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
            padding: "16px 18px",
            zIndex: 2200,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "#974631",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {inspectedBuilding.period || "Historic Monument"}
              </span>
              <h4
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "1.15rem",
                  margin: "3px 0 2px",
                  color: "#27372F",
                }}
              >
                {inspectedBuilding.title}
              </h4>
              <div style={{ fontSize: "0.78rem", color: "#535B50", fontWeight: 600 }}>
                {inspectedBuilding.subtitle}
              </div>
            </div>
            <button
              onClick={() => setInspectedBuilding(null)}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "transparent",
                border: "1px solid rgba(142, 119, 93, 0.3)",
                cursor: "pointer",
                fontWeight: 700,
                color: "#535B50",
              }}
            >
              ✕
            </button>
          </div>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#434D43",
              margin: "8px 0 0",
              lineHeight: 1.55,
            }}
          >
            {inspectedBuilding.description}
          </p>
        </div>
      )}
    </div>
  );
}

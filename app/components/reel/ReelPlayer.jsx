"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";

// Video-Shotcraft 9:16 Cinematic Promotional Reel for Deccan Heritage Map
// Structure follows Vincentwei1021/video-shotcraft "promo-energy-arc":
// 01 brand-ink-open (0-4s)
// 02 spotlight-hero-card (4-8.5s)
// 03 deck-deal-flyin (8.5-13s)
// 04 paper-title-card (13-15s)
// 05 interactive-walkable-diorama (15-19s)
// 06 cipher-tumbler-macro (19-24s)
// 07 outro-group-photo-launch (24-30s)

const TOTAL_DURATION_SEC = 30.0;
const FPS = 30;
const TOTAL_FRAMES = TOTAL_DURATION_SEC * FPS; // 900 frames

const SHOTS = [
  {
    id: "shot-01",
    cardName: "brand-ink-open",
    name: "01 Brand",
    start: 0.0,
    end: 4.0,
    headline: "HYDERABAD",
    subhead: "400 Years of Secrets",
    caption: "What if Hyderabad was an open living atlas waiting to be unlocked?",
    sfx: "ink_stamp",
  },
  {
    id: "shot-02",
    cardName: "spotlight-hero-card",
    name: "02 Hero",
    start: 4.0,
    end: 8.5,
    headline: "85 HISTORIC GEMS",
    subhead: "17.3616° N, 78.4747° E · 1591 CE",
    caption: "Beyond the IT towers and biryani lies a city of lost stepwells and whispered folklore.",
    sfx: "hero_riser",
  },
  {
    id: "shot-03",
    cardName: "deck-deal-flyin",
    name: "03 Cards",
    start: 8.5,
    end: 13.0,
    headline: "CURATED BY COMMUNITY",
    subhead: "37 Lesser-Known Sanctuaries Curated by Karthik Vatsavayi",
    caption: "Discover 37 lesser-known sanctuaries hidden in plain sight across Telangana.",
    sfx: "card_deals",
  },
  {
    id: "shot-04",
    cardName: "paper-title-card",
    name: "04 Time",
    start: 13.0,
    end: 15.0,
    headline: "TIME TRAVEL",
    subhead: "1562 ➔ 1948",
    caption: "Scrub back four centuries of living history in real-time.",
    sfx: "time_chime",
  },
  {
    id: "shot-05",
    cardName: "interactive-walkable-diorama",
    name: "05 Bazaar",
    start: 15.0,
    end: 19.0,
    headline: "AN EVENING AT CHARMINAR",
    subhead: "A Living 3-District Storybook Bazaar",
    caption: "Wander through Laad Bazaar at twilight and eavesdrop on historic tea counters.",
    sfx: "bazaar_ambience",
  },
  {
    id: "shot-06",
    cardName: "cipher-tumbler-macro",
    name: "06 Puzzle",
    start: 19.0,
    end: 24.0,
    headline: "THE NIZAM'S LOST HEIRLOOM",
    subhead: "4 Tactile Ciphers · The Royal Basra Pearl",
    caption: "And crack the four secret ciphers of the Nizam’s lost heirloom box.",
    sfx: "cipher_unlock",
  },
  {
    id: "shot-07",
    cardName: "outro-group-photo-launch",
    name: "07 Outro",
    start: 24.0,
    end: 30.0,
    headline: "DECCAN HERITAGE MAP",
    subhead: "Rediscover Hyderabad's Soul",
    caption: "Deccan Heritage Map. Rediscover the city you thought you knew.",
    sfx: "climax_gong",
  },
];

// Procedural Web Audio Sound Engine matching Video-Shotcraft categories
class ReelAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.lastTriggeredSfx = null;
  }

  ensureContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playSfx(type) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    switch (type) {
      case "ink_stamp": {
        // Deep resonant letterpress impact (R1)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.35);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
        break;
      }
      case "hero_riser": {
        // Subtle acoustic riser into brass click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.6);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
        break;
      }
      case "card_deals": {
        // Rapid triple card snap (R2)
        [0, 0.14, 0.28].forEach((delay, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(600 + i * 180, now + delay);
          osc.frequency.exponentialRampToValueAtTime(200, now + delay + 0.08);
          gain.gain.setValueAtTime(0.12, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.09);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.1);
        });
        break;
      }
      case "time_chime": {
        // Resonant Tibetan singing bowl chime (R3)
        [523.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.03);
          gain.gain.setValueAtTime(0.12, now + idx * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.03 + 1.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.03);
          osc.stop(now + idx * 0.03 + 1.25);
        });
        break;
      }
      case "bazaar_ambience": {
        // Chai samovar hiss & glass bangle harmonics
        [1760, 2637, 3520].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.08, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.4);
        });
        break;
      }
      case "cipher_unlock": {
        // Clock tick + radio static burst + brass tumbler lock
        [0, 0.1, 0.22].forEach((delay, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(1400 - idx * 250, now + delay);
          gain.gain.setValueAtTime(0.15, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.05);
        });
        // Gold chime
        setTimeout(() => {
          if (!this.ctx) return;
          const t = this.ctx.currentTime;
          [880, 1108, 1320, 1760].forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(f, t + i * 0.05);
            gain.gain.setValueAtTime(0.1, t + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.05 + 0.8);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + i * 0.05);
            osc.stop(t + i * 0.05 + 0.85);
          });
        }, 320);
        break;
      }
      case "climax_gong": {
        // Deep celebratory gong (Rule R4: single peak hit)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 1.8);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 2.1);
        break;
      }
      default:
        break;
    }
  }
}

export default function ReelPlayer({ onClose, autoPlay = true }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [activeShotIndex, setActiveShotIndex] = useState(0);

  const requestRef = useRef(null);
  const startTimeRef = useRef(null);
  const elapsedRef = useRef(0);
  const audioRef = useRef(null);
  const lastShotRef = useRef(-1);

  // Initialize procedural audio
  useEffect(() => {
    audioRef.current = new ReelAudioEngine();
    return () => {
      if (audioRef.current && audioRef.current.ctx) {
        audioRef.current.ctx.close();
      }
    };
  }, []);

  // Sync mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Main animation frame loop (accurate to 30fps)
  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const loop = (timestamp) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      setCurrentTime((prev) => {
        let next = prev + delta;
        if (next >= TOTAL_DURATION_SEC) {
          next = 0; // Seamless loop
          lastShotRef.current = -1;
        }
        return next;
      });

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  // Compute active shot and trigger SFX on shot transition
  useEffect(() => {
    const idx = SHOTS.findIndex((s) => currentTime >= s.start && currentTime < s.end);
    const validIdx = idx === -1 ? SHOTS.length - 1 : idx;
    setActiveShotIndex(validIdx);

    if (validIdx !== lastShotRef.current) {
      lastShotRef.current = validIdx;
      if (audioRef.current && isPlaying) {
        audioRef.current.playSfx(SHOTS[validIdx].sfx);
      }
    }
  }, [currentTime, isPlaying]);

  const currentShot = SHOTS[activeShotIndex];
  const shotProgress = useMemo(() => {
    const s = currentShot;
    const duration = s.end - s.start;
    return Math.min(Math.max((currentTime - s.start) / duration, 0), 1);
  }, [currentTime, currentShot]);

  // Timeline seek helper
  const seekTo = (time) => {
    setCurrentTime(Math.min(Math.max(time, 0), TOTAL_DURATION_SEC));
    if (audioRef.current) audioRef.current.ensureContext();
  };

  const jumpToShot = (idx) => {
    seekTo(SHOTS[idx].start + 0.05);
  };

  const togglePlay = () => {
    if (audioRef.current) audioRef.current.ensureContext();
    setIsPlaying((p) => !p);
  };

  // Keyboard shortcut: Space to toggle play
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space" && e.target.tagName !== "INPUT") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(18, 14, 11, 0.94)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, sans-serif)",
        color: "var(--ink, #2B2119)",
        padding: "16px 12px",
        overflow: "hidden",
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
          color: "#FAF6EE",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🎬</span>
          <div>
            <div style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: 14, fontWeight: 700 }}>
              Deccan Heritage Reel
            </div>
            <div style={{ fontSize: 10, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Video-Shotcraft · 9:16 Vertical
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Sound toggle */}
          <button
            type="button"
            onClick={() => {
              if (audioRef.current) audioRef.current.ensureContext();
              setIsMuted((m) => !m);
            }}
            style={{
              background: isMuted ? "rgba(255,255,255,0.12)" : "rgba(168, 68, 31, 0.25)",
              border: `1px solid ${isMuted ? "rgba(255,255,255,0.2)" : "#A8441F"}`,
              color: "#FAF6EE",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 13,
            }}
            title={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          {/* Close button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                color: "#FAF6EE",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 16,
              }}
              title="Close Reel"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 9:16 Vertical Reel Canvas Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 390,
          aspectRatio: "9 / 16",
          maxHeight: "calc(100vh - 150px)",
          background: "#FAF6EE",
          borderRadius: 22,
          boxShadow: "0 22px 65px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(221, 208, 184, 0.4)",
          overflow: "hidden",
          userSelect: "none",
        }}
        onClick={togglePlay}
      >
        {/* Subtle Paper Grain & Archival Texture Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 40,
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.4) 0%, rgba(245, 239, 227, 0) 70%), linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.1) 100%)",
            boxShadow: "inset 0 0 45px rgba(43, 33, 25, 0.12)",
          }}
        />

        {/* ------------------------------------------------------------- */}
        {/* SHOT 01: brand-ink-open (0.0s - 4.0s) */}
        {/* ------------------------------------------------------------- */}
        {activeShotIndex === 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
              textAlign: "center",
              background: "#FAF6EE",
              transition: "opacity 0.4s ease-out",
            }}
          >
            {/* Spinning Compass Ring */}
            <div
              style={{
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: "50%",
                border: "1.5px dashed rgba(139, 58, 26, 0.25)",
                transform: `rotate(${shotProgress * 45}deg)`,
                transition: "transform 0.1s linear",
              }}
            />

            {/* Ink Stamp Logo Deboss (Rule R1: hold >= 1s) */}
            <div
              style={{
                transform: `scale(${1 + Math.max(0, 1 - shotProgress * 3.5) * 0.4})`,
                opacity: Math.min(shotProgress * 3, 1),
                transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  fontSize: 52,
                  marginBottom: 12,
                  filter: "drop-shadow(0 6px 12px rgba(139, 58, 26, 0.25))",
                }}
              >
                🏛️
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: 34,
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: "#2B2119",
                  lineHeight: 1.1,
                }}
              >
                HYDERABAD
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  color: "#8B3A1A",
                  marginTop: 8,
                  textTransform: "uppercase",
                }}
              >
                400 Years of Secrets
              </div>
              <div
                style={{
                  width: 50,
                  height: 2,
                  background: "#8B3A1A",
                  margin: "16px auto",
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  color: "#6D5F52",
                  maxWidth: 240,
                  lineHeight: 1.5,
                }}
              >
                The Interactive Living Heritage Atlas of the Deccan
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SHOT 02: spotlight-hero-card (4.0s - 8.5s) */}
        {/* ------------------------------------------------------------- */}
        {activeShotIndex === 1 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "linear-gradient(180deg, #FBF6EE 0%, #F1E5D1 100%)",
            }}
          >
            {/* Top Coordinate Pill */}
            <div
              style={{
                alignSelf: "center",
                background: "rgba(43, 33, 25, 0.06)",
                border: "1px solid rgba(43, 33, 25, 0.12)",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                color: "#8B3A1A",
                letterSpacing: "0.08em",
              }}
            >
              17.3616° N, 78.4747° E · 1591 CE
            </div>

            {/* 3D Elevated Hero Card with Orbit Tilt */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 340,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 18px 40px rgba(43, 33, 25, 0.25)",
                border: "3px solid #FAF6EE",
                transform: `perspective(800px) rotateY(${(shotProgress - 0.5) * 12}deg) rotateX(4deg) scale(${
                  0.94 + shotProgress * 0.06
                })`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <Image
                src="/photos/charminar.jpg"
                alt="Charminar"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(27, 20, 15, 0.85) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  color: "#FAF6EE",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "#E8C88B", textTransform: "uppercase" }}>
                  Iconic Monument #01
                </div>
                <div style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: 24, fontWeight: 800 }}>
                  Charminar
                </div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>
                  Four Grand Minarets at the Crossroad of Four Empires
                </div>
              </div>
            </div>

            {/* Bottom Counter Stat */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#8B3A1A",
                }}
              >
                85 HISTORIC GEMS
              </div>
              <div style={{ fontSize: 12, color: "#6D5F52", fontWeight: 600 }}>
                From Qutb Shahi Tombs to Restored Stepwells
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SHOT 03: deck-deal-flyin (8.5s - 13.0s) */}
        {/* ------------------------------------------------------------- */}
        {activeShotIndex === 2 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              background: "#FAF6EE",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div
                style={{
                  display: "inline-block",
                  background: "#A8441F",
                  color: "#FFF",
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "3px 9px",
                  borderRadius: 6,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Curated Sanctuaries
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#2B2119",
                  marginTop: 6,
                }}
              >
                37 Lesser-Known Gems
              </div>
              <div style={{ fontSize: 11, color: "#6D5F52" }}>
                Curated by Karthik Vatsavayi & Community
              </div>
            </div>

            {/* 3 Accelerated Fanned Heritage Cards (Rule R2: speed + 0.5s rest) */}
            <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* Card 1: Gachibowli Stepwell */}
              <div
                style={{
                  position: "absolute",
                  width: 250,
                  height: 180,
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
                  border: "2px solid #FAF6EE",
                  transform: `translateY(${Math.max(0, 1 - shotProgress * 2.8) * 120 - 40}px) rotate(${
                    -6 + shotProgress * 3
                  }deg)`,
                  zIndex: 1,
                  opacity: Math.min(shotProgress * 4, 1),
                }}
              >
                <Image
                  src="/photos/gachibowli-stepwell.jpg"
                  alt="Gachibowli Stepwell"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)" }} />
                <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, color: "#FFF" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#FCD34D" }}>200-YEAR STEPWELL</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Gachibowli Bowli</div>
                </div>
              </div>

              {/* Card 2: Premamati Mosque */}
              <div
                style={{
                  position: "absolute",
                  width: 260,
                  height: 190,
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 16px 36px rgba(0,0,0,0.25)",
                  border: "2px solid #FAF6EE",
                  transform: `translateY(${Math.max(0, 1 - shotProgress * 2.2) * 140}px) rotate(${
                    4 - shotProgress * 2
                  }deg)`,
                  zIndex: 2,
                  opacity: Math.min(Math.max((shotProgress - 0.15) * 4, 0), 1),
                }}
              >
                <Image
                  src="/photos/premamati-mosque.jpg"
                  alt="Premamati Mosque"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)" }} />
                <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, color: "#FFF" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#FCD34D" }}>QUTB SHAHI MOSQUE</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Premamati Mosque</div>
                </div>
              </div>

              {/* Card 3: British Residency */}
              <div
                style={{
                  position: "absolute",
                  width: 270,
                  height: 200,
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 20px 42px rgba(0,0,0,0.3)",
                  border: "2.5px solid #FAF6EE",
                  transform: `translateY(${Math.max(0, 1 - shotProgress * 1.8) * 160 + 40}px) rotate(${
                    -2 + shotProgress * 2
                  }deg)`,
                  zIndex: 3,
                  opacity: Math.min(Math.max((shotProgress - 0.3) * 4, 0), 1),
                }}
              >
                <Image
                  src="/photos/british-residency.jpg"
                  alt="British Residency"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)" }} />
                <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, color: "#FFF" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#FCD34D" }}>COLONIAL PALLADIAN</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>British Residency (1805)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SHOT 04: paper-title-card (13.0s - 15.0s) - Breathing Pause */}
        {/* ------------------------------------------------------------- */}
        {activeShotIndex === 3 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
              textAlign: "center",
              background: "#F5EFE3",
            }}
          >
            <div
              style={{
                width: "100%",
                padding: "36px 20px",
                border: "2px solid #DDD0B8",
                borderRadius: 16,
                background: "#FAF6EE",
                boxShadow: "0 12px 32px rgba(43, 33, 25, 0.12)",
                transform: `scale(${0.92 + shotProgress * 0.08})`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
              <div
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#8B3A1A",
                  lineHeight: 1.15,
                }}
              >
                TIME TRAVEL
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  color: "#2B2119",
                  margin: "8px 0 14px",
                }}
              >
                1562 ➔ 1948
              </div>
              <div style={{ fontSize: 12, color: "#6D5F52", lineHeight: 1.5 }}>
                Scrub 400 years of living history across four grand dynasties.
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SHOT 05: interactive-walkable-diorama (15.0s - 19.0s) */}
        {/* ------------------------------------------------------------- */}
        {activeShotIndex === 4 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              background: "#1C140E",
            }}
          >
            {/* Dynamic camera panning across the 3 illustrated districts */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "300%",
                display: "flex",
                transform: `translateX(-${shotProgress * 66.66}%)`,
                transition: "transform 0.05s linear",
              }}
            >
              {/* Scene 1: Charminar Square */}
              <div style={{ position: "relative", width: "33.333%", height: "100%" }}>
                <Image
                  src="/charminar/evening-bazaar.png"
                  alt="Charminar Square Bazaar"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div style={{ position: "absolute", top: 20, left: 20, background: "rgba(0,0,0,0.65)", color: "#FFF", padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}>
                  District 1: Charminar Square
                </div>
              </div>

              {/* Scene 2: Bangle Lane */}
              <div style={{ position: "relative", width: "33.333%", height: "100%" }}>
                <Image
                  src="/charminar/bangle-lane.png"
                  alt="Laad Bazaar Bangle Lane"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div style={{ position: "absolute", top: 20, left: 20, background: "rgba(0,0,0,0.65)", color: "#FFF", padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}>
                  District 2: Laad Bazaar Lane
                </div>
              </div>

              {/* Scene 3: Hidden Courtyard */}
              <div style={{ position: "relative", width: "33.333%", height: "100%" }}>
                <Image
                  src="/charminar/hidden-courtyard.png"
                  alt="The Hidden Courtyard"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div style={{ position: "absolute", top: 20, left: 20, background: "rgba(0,0,0,0.65)", color: "#FFF", padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}>
                  District 3: The Hidden Courtyard
                </div>
              </div>
            </div>

            {/* Gradient overlay and typography */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "24px 20px 20px",
                background: "linear-gradient(180deg, transparent 0%, rgba(20, 15, 11, 0.95) 70%)",
                color: "#FAF6EE",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, color: "#E8C88B", textTransform: "uppercase" }}>
                3-District Living Diorama
              </div>
              <div style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: 21, fontWeight: 800 }}>
                An Evening at Charminar
              </div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>
                Irani chai counters · Lacquer bangles · Vintage Akashvani radios
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SHOT 06: cipher-tumbler-macro (19.0s - 24.0s) */}
        {/* ------------------------------------------------------------- */}
        {activeShotIndex === 5 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "linear-gradient(180deg, #FBF6EE 0%, #EFE5D1 100%)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "inline-block",
                  background: "#8B3A1A",
                  color: "#FFF",
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "3px 9px",
                  borderRadius: 6,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                In-World Mystery
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#2B2119",
                  marginTop: 6,
                }}
              >
                The Nizam's Lost Heirloom Box
              </div>
              <div style={{ fontSize: 11, color: "#6D5F52" }}>
                4 Tactile Mechanical Ciphers
              </div>
            </div>

            {/* Macro Cipher Wheels Animation */}
            <div
              style={{
                background: "#FAF6EE",
                border: "2px solid #C8B99E",
                borderRadius: 16,
                padding: 18,
                boxShadow: "0 14px 34px rgba(43, 33, 25, 0.16)",
              }}
            >
              {/* Lock 1: Bangles */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>1. Lacquer Bangles</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#059669", background: "#D1FAE5", padding: "2px 6px", borderRadius: 4 }}>
                  GREEN · RED · GREEN ✓
                </span>
              </div>

              {/* Lock 2: 1889 Clock Dial */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>2. 1889 Clockworks</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#059669", background: "#D1FAE5", padding: "2px 6px", borderRadius: 4 }}>
                  4:45 PM SOLVED ✓
                </span>
              </div>

              {/* Lock 3: Akashvani Radio */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>3. Akashvani Radio</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#059669", background: "#D1FAE5", padding: "2px 6px", borderRadius: 4 }}>
                  880 kHz TUNED ✓
                </span>
              </div>

              {/* Lock 4: Crescent Seal */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>4. Crescent Seal</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#059669", background: "#D1FAE5", padding: "2px 6px", borderRadius: 4 }}>
                  ORIENTED RIGHT ✓
                </span>
              </div>

              {/* Box Springs Open revealing Basra Pearl */}
              <div
                style={{
                  marginTop: 14,
                  padding: 12,
                  background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                  border: "1.5px solid #F59E0B",
                  borderRadius: 10,
                  textAlign: "center",
                  transform: `scale(${shotProgress > 0.6 ? 1 : 0.95})`,
                  opacity: shotProgress > 0.4 ? 1 : 0.2,
                  transition: "all 0.3s ease-out",
                }}
              >
                <span style={{ fontSize: 24 }}>🦪</span>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#92400E" }}>
                  Unlocked: Royal Basra Pearl
                </div>
                <div style={{ fontSize: 10, color: "#B45309" }}>
                  +150 Passport Points · "Master Sleuth" Badge
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", fontSize: 11, color: "#8B3A1A", fontWeight: 700 }}>
              Solve directly in the Old City diorama
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SHOT 07: outro-group-photo-launch (24.0s - 30.0s) */}
        {/* ------------------------------------------------------------- */}
        {activeShotIndex === 6 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              background: "linear-gradient(180deg, #FAF6EE 0%, #F3E7CC 100%)",
            }}
          >
            {/* Climax Badge & Passport Group */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8B3A1A 0%, #A8441F 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                boxShadow: "0 10px 24px rgba(139, 58, 26, 0.35)",
                marginBottom: 16,
              }}
            >
              🧭
            </div>

            <div
              style={{
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontSize: 28,
                fontWeight: 900,
                color: "#2B2119",
                lineHeight: 1.15,
              }}
            >
              DECCAN HERITAGE MAP
            </div>

            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#8B3A1A",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: "6px 0 16px",
              }}
            >
              Rediscover Hyderabad's Soul
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <span style={{ background: "#FAF6EE", border: "1px solid #DDD0B8", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}>
                📜 85 Sites
              </span>
              <span style={{ background: "#FAF6EE", border: "1px solid #DDD0B8", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}>
                ⏳ 400 Years
              </span>
              <span style={{ background: "#FAF6EE", border: "1px solid #DDD0B8", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}>
                🕵️ Old City Mystery
              </span>
            </div>

            {/* Launch CTA Button (Rule R1: hold >= 1s) */}
            <a
              href="/"
              onClick={(e) => {
                if (onClose) {
                  e.preventDefault();
                  onClose();
                }
              }}
              style={{
                background: "linear-gradient(135deg, #8B3A1A 0%, #A8441F 100%)",
                color: "#FFF",
                fontSize: 14,
                fontWeight: 800,
                padding: "14px 28px",
                borderRadius: 30,
                boxShadow: "0 8px 24px rgba(168, 68, 31, 0.4)",
                textDecoration: "none",
                display: "inline-block",
                letterSpacing: "0.02em",
                transform: `scale(${1 + Math.sin(shotProgress * Math.PI) * 0.05})`,
                transition: "transform 0.15s ease-out",
              }}
            >
              Explore The Map Free →
            </a>

            <div style={{ fontSize: 10, color: "#8E775D", marginTop: 14 }}>
              Open on Mobile & Desktop · No App Download Needed
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* On-Screen Voiceover Subtitles / Captions */}
        {/* ------------------------------------------------------------- */}
        {showCaptions && (
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: 14,
              right: 14,
              background: "rgba(27, 20, 15, 0.82)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              color: "#FAF6EE",
              padding: "8px 14px",
              borderRadius: 10,
              fontSize: 11,
              lineHeight: 1.4,
              textAlign: "center",
              zIndex: 50,
              pointerEvents: "none",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <span style={{ color: "#E8C88B", fontWeight: 700, marginRight: 6 }}>VO:</span>
            {currentShot.caption}
          </div>
        )}

        {/* Play/Pause Watermark Overlay when paused */}
        {!isPlaying && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 60,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.92)",
                color: "#2B2119",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              ▶
            </div>
          </div>
        )}
      </div>

      {/* Scrubber & Controls Toolbar */}
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 10,
        }}
      >
        {/* Progress Bar Scrubber */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={togglePlay}
            style={{
              background: "none",
              border: "none",
              color: "#FAF6EE",
              fontSize: 16,
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <input
            type="range"
            min="0"
            max={TOTAL_DURATION_SEC}
            step="0.05"
            value={currentTime}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            style={{
              flex: 1,
              accentColor: "#A8441F",
              cursor: "pointer",
              height: 4,
            }}
          />

          <div
            style={{
              color: "#FAF6EE",
              fontSize: 11,
              fontVariantNumeric: "tabular-nums",
              minWidth: 70,
              textAlign: "right",
              opacity: 0.8,
            }}
          >
            {currentTime.toFixed(1)}s / {TOTAL_DURATION_SEC.toFixed(0)}s
          </div>
        </div>

        {/* Shot Selection Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {SHOTS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpToShot(idx)}
              style={{
                flexShrink: 0,
                background: activeShotIndex === idx ? "#A8441F" : "rgba(255,255,255,0.1)",
                border: `1px solid ${activeShotIndex === idx ? "#A8441F" : "rgba(255,255,255,0.15)"}`,
                color: "#FAF6EE",
                padding: "3px 8px",
                borderRadius: 12,
                fontSize: 10,
                fontWeight: activeShotIndex === idx ? 800 : 500,
                cursor: "pointer",
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

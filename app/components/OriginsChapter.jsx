"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ORIGINS_BY_ID } from "../../lib/culturalOrigins.js";
import { Icon } from "./Icons.jsx";

const DIR_COLOR  = { inward: "#B9603D", hybrid: "#8B6914", local: "#3A6B4A", outward: "#4A5C8B" };
const DIR_LABEL  = { inward: "Arrived in Hyderabad", hybrid: "Adapted here", local: "Born here", outward: "Sailed out from here" };
const CAT_LABEL  = { dish: "Dish", textile: "Textile", craft: "Craft", attire: "Attire", festival: "Festival" };

// ── Category hero illustrations ───────────────────────────────────────────────
function DishHero({ accent }) {
  return (
    <svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Table surface */}
      <ellipse cx="160" cy="140" rx="130" ry="16" fill={accent} opacity="0.08" />
      {/* Pot body */}
      <ellipse cx="160" cy="108" rx="70" ry="22" fill={accent} opacity="0.18" />
      <path d="M 90 108 Q 90 150 160 150 Q 230 150 230 108 Z" fill={accent} opacity="0.22" />
      <ellipse cx="160" cy="108" rx="70" ry="22" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.5" />
      {/* Lid */}
      <path d="M 105 110 Q 110 88 160 85 Q 210 88 215 110 Z" fill={accent} opacity="0.28" />
      <ellipse cx="160" cy="85" rx="55" ry="9" fill={accent} opacity="0.35" />
      {/* Lid knob */}
      <rect x="155" y="74" width="10" height="12" rx="4" fill={accent} opacity="0.5" />
      {/* Steam wisps */}
      <path d="M 145 70 Q 140 58 145 46" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      <path d="M 160 66 Q 155 52 161 39" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      <path d="M 175 70 Q 181 56 176 44" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      {/* Decorative handle left */}
      <path d="M 90 105 Q 68 105 68 118 Q 68 128 90 128" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      {/* Decorative handle right */}
      <path d="M 230 105 Q 252 105 252 118 Q 252 128 230 128" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      {/* Atta-seal dots around rim */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => {
        const r = 70, cx = 160 + r * Math.cos(a * Math.PI / 180) * 0.9;
        const cy = 108 + 22 * Math.sin(a * Math.PI / 180) * 0.4;
        return <circle key={a} cx={cx} cy={cy} r="2" fill={accent} opacity="0.25" />;
      })}
    </svg>
  );
}

function TextileHero({ accent }) {
  const rows = 5, cols = 8;
  return (
    <svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Loom frame */}
      <rect x="40" y="20" width="240" height="120" rx="4" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      <line x1="40" y1="40" x2="280" y2="40" stroke={accent} strokeWidth="1" opacity="0.2" />
      <line x1="40" y1="120" x2="280" y2="120" stroke={accent} strokeWidth="1" opacity="0.2" />
      {/* Warp threads */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={60 + i * 17} y1="40" x2={60 + i * 17} y2="120"
          stroke={accent} strokeWidth="1" opacity="0.15" />
      ))}
      {/* Weft weave pattern */}
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const over = (row + col) % 2 === 0;
          return (
            <rect key={`${row}-${col}`}
              x={60 + col * 26} y={48 + row * 14}
              width="22" height="10" rx="1"
              fill={accent} opacity={over ? 0.28 : 0.1}
            />
          );
        })
      )}
      {/* Shuttle */}
      <path d="M 55 90 L 260 90" stroke={accent} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <ellipse cx="265" cy="90" rx="14" ry="7" fill={accent} opacity="0.45" />
    </svg>
  );
}

function CraftHero({ accent }) {
  return (
    <svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Vessel body */}
      <path d="M 110 130 Q 95 100 100 70 Q 105 45 160 40 Q 215 45 220 70 Q 225 100 210 130 Z"
        fill={accent} opacity="0.12" stroke={accent} strokeWidth="1.5" />
      {/* Silver inlay pattern — geometric */}
      <path d="M 130 75 L 160 55 L 190 75 L 190 105 L 160 125 L 130 105 Z"
        fill="none" stroke={accent} strokeWidth="1.8" opacity="0.55" />
      <circle cx="160" cy="90" r="12" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.5" />
      <path d="M 148 78 L 172 78 L 172 102 L 148 102 Z"
        fill="none" stroke={accent} strokeWidth="1" opacity="0.35" strokeDasharray="3 2" />
      {/* Inlay highlight dots */}
      {[[160,55],[190,75],[190,105],[160,125],[130,105],[130,75]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={accent} opacity="0.7" />
      ))}
      {/* Tool — chisel */}
      <line x1="220" y1="40" x2="260" y2="120" stroke={accent} strokeWidth="6" strokeLinecap="round" opacity="0.2" />
      <line x1="218" y1="38" x2="258" y2="118" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M 255 114 L 265 124 L 258 122 Z" fill={accent} opacity="0.5" />
    </svg>
  );
}

function AttireHero({ accent }) {
  return (
    <svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Sherwani silhouette */}
      <path d="M 120 25 Q 115 30 108 35 L 88 90 L 100 90 L 100 145 L 160 145 L 220 145 L 220 90 L 232 90 L 212 35 Q 205 30 200 25 Q 185 35 160 35 Q 135 35 120 25 Z"
        fill={accent} opacity="0.14" stroke={accent} strokeWidth="1.5" />
      {/* Center button line */}
      <line x1="160" y1="35" x2="160" y2="145" stroke={accent} strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      {/* Buttons */}
      {[50,65,80,95,110,125].map(y => (
        <circle key={y} cx="160" cy={y} r="3.5" fill={accent} opacity="0.45" />
      ))}
      {/* Stand collar */}
      <path d="M 135 35 Q 145 28 160 25 Q 175 28 185 35"
        fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Dastar hint */}
      <ellipse cx="160" cy="18" rx="28" ry="8" fill={accent} opacity="0.18" />
      <path d="M 132 18 Q 160 8 188 18" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      {/* Frilled crest */}
      {[-14,-7,0,7,14].map(dx => (
        <path key={dx} d={`M ${160+dx} 10 Q ${160+dx+2} 4 ${160+dx} 0`}
          fill="none" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      ))}
      {/* Embroidery on chest */}
      <path d="M 140 65 Q 148 58 155 65 Q 160 70 160 70 Q 160 70 165 65 Q 172 58 180 65"
        fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function FestivalHero({ accent }) {
  return (
    <svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Left banner pole */}
      <line x1="80" y1="25" x2="80" y2="140" stroke={accent} strokeWidth="1.5" opacity="0.5" />
      <path d="M 80 28 L 100 36 L 80 44 Z" fill={accent} opacity="0.4" />
      {/* Right banner pole */}
      <line x1="240" y1="25" x2="240" y2="140" stroke={accent} strokeWidth="1.5" opacity="0.5" />
      <path d="M 240 28 L 220 36 L 240 44 Z" fill={accent} opacity="0.4" />
      {/* Ganesh murti — seated silhouette */}
      {/* Head dome */}
      <ellipse cx="160" cy="42" rx="22" ry="20" fill="none" stroke={accent} strokeWidth="1.5" />
      {/* Large ears */}
      <ellipse cx="138" cy="48" rx="9" ry="12" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.7" />
      <ellipse cx="182" cy="48" rx="9" ry="12" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.7" />
      {/* Crown/mukut */}
      <path d="M 145 23 L 150 15 L 160 20 L 170 15 L 175 23" fill="none" stroke={accent} strokeWidth="1.3" opacity="0.7" />
      {/* Trunk curving left */}
      <path d="M 155 60 Q 135 70 138 80 Q 140 88 148 87" fill="none" stroke={accent} strokeWidth="2" />
      {/* Body */}
      <path d="M 140 62 Q 130 75 128 95 Q 127 108 140 112 Q 160 116 180 112 Q 193 108 192 95 Q 190 75 180 62 Z"
        fill="none" stroke={accent} strokeWidth="1.5" />
      {/* Arms outstretched */}
      <path d="M 130 72 Q 112 68 108 75" fill="none" stroke={accent} strokeWidth="1.3" />
      <path d="M 190 72 Q 208 68 212 75" fill="none" stroke={accent} strokeWidth="1.3" />
      {/* Modak in right hand */}
      <ellipse cx="215" cy="76" rx="7" ry="8" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.8" />
      {/* Lotus base */}
      <path d="M 128 113 Q 140 120 160 122 Q 180 120 192 113" fill="none" stroke={accent} strokeWidth="1" opacity="0.6" />
      <path d="M 135 115 Q 145 125 160 127 Q 175 125 185 115" fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />
      {/* Three diyas at base */}
      <path d="M 145 132 Q 147 126 149 132 Q 152 136 149 138 Q 147 140 145 138 Q 142 136 145 132 Z"
        fill={accent} opacity="0.5" />
      <path d="M 158 130 Q 160 124 162 130 Q 165 134 162 136 Q 160 138 158 136 Q 155 134 158 130 Z"
        fill={accent} opacity="0.6" />
      <path d="M 171 132 Q 173 126 175 132 Q 178 136 175 138 Q 173 140 171 138 Q 168 136 171 132 Z"
        fill={accent} opacity="0.5" />
      {/* Diya flames */}
      <path d="M 147 126 Q 147 122 148 120 Q 149 122 149 126" fill={accent} opacity="0.7" />
      <path d="M 160 124 Q 160 120 161 118 Q 162 120 162 124" fill={accent} opacity="0.8" />
      <path d="M 173 126 Q 173 122 174 120 Q 175 122 175 126" fill={accent} opacity="0.7" />
      {/* Crowd — small circles at bottom */}
      {[30,50,70,90,110,210,230,250,270,290].map((x, i) => (
        <circle key={i} cx={x} cy={152} r="4" fill="none" stroke={accent} strokeWidth="1" opacity="0.35" />
      ))}
      {[40,60,80,100,200,220,240,260,280].map((x, i) => (
        <circle key={"b" + i} cx={x} cy={157} r="3.5" fill="none" stroke={accent} strokeWidth="1" opacity="0.2" />
      ))}
    </svg>
  );
}

function HeroSticker({ item, accent }) {
  if (item?.stickerImage) {
    return (
      <div className="oc-hero-sticker-wrap">
        <img
          src={item.stickerImage}
          alt={item.name}
          className="oc-hero-sticker"
        />
      </div>
    );
  }
  return <HeroIllustration category={item?.category} accent={accent} />;
}

function HeroIllustration({ category, accent }) {
  switch (category) {
    case "dish":     return <DishHero accent={accent} />;
    case "textile":  return <TextileHero accent={accent} />;
    case "craft":    return <CraftHero accent={accent} />;
    case "attire":   return <AttireHero accent={accent} />;
    case "festival": return <FestivalHero accent={accent} />;
    default:         return <DishHero accent={accent} />;
  }
}

// ── Route arc ─────────────────────────────────────────────────────────────────
function RouteArc({ item, accent }) {
  const isLocal   = item.direction === "local";
  const isOutward = item.direction === "outward";

  if (isLocal) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${accent}`, display: "inline-block" }} />
        <span style={{ fontFamily: '"Outfit",sans-serif', fontSize: 11, color: accent, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
          Born in Hyderabad
        </span>
      </div>
    );
  }

  const from = isOutward
    ? "Hyderabad"
    : (item.tradeRoute?.from?.label || "Origin").split("/")[0].split(",")[0].trim();
  const to   = isOutward ? "Europe" : "Hyderabad";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <span style={{ fontFamily: '"Outfit",sans-serif', fontSize: 11, color: "var(--oc-muted)", letterSpacing: "0.04em" }}>{from}</span>
      <svg width="48" height="16" viewBox="0 0 48 16" style={{ flex: "none" }}>
        <line x1="2" y1="8" x2="38" y2="8" stroke={accent} strokeWidth="1.5" opacity="0.6" />
        <path d="M 34 4 L 44 8 L 34 12" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      </svg>
      <span style={{ fontFamily: '"Outfit",sans-serif', fontSize: 11, color: accent, fontWeight: 700, letterSpacing: "0.04em" }}>{to}</span>
    </div>
  );
}

// ── Timeline ──────────────────────────────────────────────────────────────────
function Timeline({ entries }) {
  if (!entries?.length) return null;
  return (
    <div className="oc-timeline">
      {entries.map((e, i) => (
        <div key={i} className="oc-timeline-row">
          <div className="oc-timeline-year">{e.year}</div>
          <div className="oc-timeline-dot" />
          <div className="oc-timeline-event">{e.event}</div>
        </div>
      ))}
    </div>
  );
}

// ── Related stories ───────────────────────────────────────────────────────────
function RelatedStories({ ids, onNavigate }) {
  if (!ids?.length || !onNavigate) return null;
  const items = ids.map(id => ORIGINS_BY_ID[id]).filter(Boolean);
  if (!items.length) return null;
  return (
    <div className="oc-related">
      <div className="oc-section-label">Related stories</div>
      {items.map(item => (
        <button key={item.id} className="oc-related-btn" onClick={() => onNavigate(item)}>
          <div className="oc-related-meta">
            {CAT_LABEL[item.category]} · {item.eraLabel}
          </div>
          <div className="oc-related-name">{item.name}</div>
          <svg width="16" height="16" viewBox="0 0 16 16" style={{ flex: "none", opacity: 0.4 }}>
            <path d="M 5 4 L 11 8 L 5 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OriginsChapter({ item, onClose, onNavigate }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted]             = useState(false);
  const closeRef                          = useRef(null);
  const scrollRef                         = useRef(null);

  useEffect(() => {
    setMounted(true);
    const mq      = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    closeRef.current?.focus();
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [item]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!item || !mounted) return null;

  const accent = DIR_COLOR[item.direction] || "#B9603D";

  const words = item.hook.split(" ");

  return createPortal(
    <div
      className={`oc-shell${mounted ? " oc-shell--in" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Origin story: ${item.name}`}
    >
      {/* ── Top bar ── */}
      <div className="oc-topbar">
        <div className="oc-topbar-era">
          <span className="oc-era-dot" style={{ background: accent }} />
          <span className="oc-era-text">{item.eraLabel}</span>
        </div>
        <button ref={closeRef} className="oc-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M1 1 L13 13 M13 1 L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="oc-scroll" ref={scrollRef}>

        {/* Category + year strip */}
        <div className="oc-meta-strip">
          <span className="oc-meta-badge">{CAT_LABEL[item.category]}</span>
          <span className="oc-meta-sep">·</span>
          <span className="oc-meta-year">{item.yearRange}</span>
        </div>

        {/* Hero title */}
        <h1 className="oc-title">{item.name}</h1>

        {/* Hero illustration / sticker */}
        <div className="oc-hero-art" aria-hidden="true">
          <HeroSticker item={item} accent={accent} />
        </div>

        {/* Hook — opening sentence */}
        <p className="oc-hook">
          {reducedMotion
            ? item.hook
            : words.map((w, i) => (
                <span key={i} className="oc-hook-word" style={{ animationDelay: `${80 + i * 60}ms` }}>
                  {w}{" "}
                </span>
              ))}
        </p>

        {/* Origin connector */}
        <div className="oc-connector">
          <div className="oc-connector-label" style={{ color: accent }}>
            {DIR_LABEL[item.direction]}
          </div>
          <RouteArc item={item} accent={accent} />
        </div>

        {/* The story */}
        <div className="oc-section">
          <div className="oc-section-label">The story</div>
          <p className="oc-body">{item.summary}</p>
        </div>

        {/* Did You Know? / Secret */}
        {item.secret && (
          <div className="oc-secret-card">
            <div className="oc-secret-header">
              <Icon name="lightbulb" size={16} color="var(--oc-terra, #c2603a)" />
              <span className="oc-secret-title">Did You Know?</span>
            </div>
            <p className="oc-secret-text">{item.secret}</p>
          </div>
        )}

        {/* How to Experience It Like a Local */}
        {item.localTip && (
          <div className="oc-localtip-card">
            <div className="oc-localtip-header">
              <Icon name="pin" size={16} color="#4A8C5D" />
              <span className="oc-localtip-title">How to Experience It Like a Local</span>
            </div>
            <p className="oc-localtip-text">{item.localTip}</p>
          </div>
        )}

        {/* Timeline */}
        {item.timeline?.length > 0 && (
          <div className="oc-section">
            <div className="oc-section-label">Timeline</div>
            <Timeline entries={item.timeline} />
          </div>
        )}

        {/* Picture it */}
        <div className="oc-picture-it" style={{ "--oc-pi-accent": accent }}>
          <div className="oc-pi-label">Picture it</div>
          <p className="oc-pi-text">{item.animDetail}</p>
        </div>

        {/* Cultures */}
        <div className="oc-section">
          <div className="oc-section-label">Cultures involved</div>
          <div className="oc-cultures">
            {item.cultures.map(c => (
              <span key={c} className="oc-culture-chip">{c}</span>
            ))}
          </div>
        </div>

        {/* Related stories */}
        <RelatedStories ids={item.relatedIds} onNavigate={onNavigate} />

        <div className="oc-end-rule" />
      </div>
    </div>,
    document.body
  );
}

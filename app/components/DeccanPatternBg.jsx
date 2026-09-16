"use client";

import React from "react";

// Subtle vintage Hyderabad architectural line-art & Deccani motifs
// Renders vector linework of Charminar, Golconda battlements, Musi river, and Deccani Jaali lattice
export default function DeccanPatternBg({ opacity = 0.08, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`dhm-deccan-bg ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        opacity,
      }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          {/* Deccani Geometric 8-point Jaali Tile Pattern */}
          <pattern
            id="deccan-jaali"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0 L80 40 L40 80 L0 40 Z M40 10 L70 40 L40 70 L10 40 Z M0 0 L20 0 L0 20 Z M80 0 L60 0 L80 20 Z M80 80 L60 80 L80 60 Z M0 80 L20 80 L0 60 Z M40 25 C48 25 55 32 55 40 C55 48 48 55 40 55 C32 55 25 48 25 40 C25 32 32 25 40 25 Z"
              fill="none"
              stroke="#8B3A1A"
              strokeWidth="0.75"
              strokeDasharray="3 3"
              opacity="0.6"
            />
          </pattern>

          {/* Hyderabad Heritage Architectural Motif (Charminar, Golconda, Musi River) */}
          <pattern
            id="hyd-heritage-grid"
            x="0"
            y="0"
            width="320"
            height="260"
            patternUnits="userSpaceOnUse"
          >
            {/* Subtle Jaali backdrop */}
            <rect width="320" height="260" fill="url(#deccan-jaali)" opacity="0.35" />

            {/* Charminar Line Drawing Motif */}
            <g transform="translate(30, 40) scale(0.65)" stroke="#2B2119" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {/* Base & Central Arch */}
              <path d="M10 130 L110 130" />
              <path d="M22 130 L22 75 Q22 45 60 45 Q98 45 98 75 L98 130" />
              <path d="M36 130 L36 82 Q36 60 60 60 Q84 60 84 82 L84 130" strokeWidth="0.8" />
              {/* Balcony / Gallery */}
              <line x1="14" y1="72" x2="106" y2="72" strokeWidth="1.5" />
              <line x1="14" y1="76" x2="106" y2="76" strokeWidth="0.8" />
              {/* Upper Arches */}
              <path d="M28 72 L28 50 Q28 42 36 42 Q44 42 44 50 L44 72" strokeWidth="0.8" />
              <path d="M52 72 L52 48 Q52 38 60 38 Q68 38 68 48 L68 72" strokeWidth="0.8" />
              <path d="M76 72 L76 50 Q76 42 84 42 Q92 42 92 50 L92 72" strokeWidth="0.8" />
              {/* Top Parapet */}
              <line x1="18" y1="36" x2="102" y2="36" strokeWidth="1.5" />
              {/* Left Minaret */}
              <rect x="8" y="24" width="12" height="106" rx="2" />
              <line x1="6" y1="90" x2="22" y2="90" strokeWidth="1.2" />
              <line x1="6" y1="56" x2="22" y2="56" strokeWidth="1.2" />
              <path d="M8 24 L14 8 L20 24 Z" />
              <line x1="14" y1="8" x2="14" y2="2" />
              {/* Right Minaret */}
              <rect x="100" y="24" width="12" height="106" rx="2" />
              <line x1="98" y1="90" x2="114" y2="90" strokeWidth="1.2" />
              <line x1="98" y1="56" x2="114" y2="56" strokeWidth="1.2" />
              <path d="M100 24 L106 8 L112 24 Z" />
              <line x1="106" y1="8" x2="106" y2="2" />
            </g>

            {/* Golconda Fort Crenellated Battlements & Hill Silhouette */}
            <g transform="translate(190, 120) scale(0.55)" stroke="#A8441F" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0 80 Q20 50 45 60 T90 40 T140 25 T190 45 L190 80 Z" strokeDasharray="2 2" opacity="0.6" />
              {/* Crenellations */}
              <path d="M10 50 L10 38 L16 38 L16 50 L22 50 L22 38 L28 38 L28 50 L34 50 L34 38 L40 38 L40 50 L46 50 L46 36 L54 36 L54 50 L60 50 L60 36 L68 36 L68 50 L76 50 L76 34 L84 34 L84 50 L92 50 L92 34 L100 34 L100 50 L108 50 L108 32 L118 32 L118 50" />
              {/* Bastion Tower */}
              <rect x="120" y="18" width="24" height="60" rx="3" />
              <path d="M120 18 L132 6 L144 18 Z" />
              <line x1="132" y1="6" x2="132" y2="1" />
              <circle cx="132" cy="34" r="3" />
              {/* Arched Gate */}
              <path d="M150 78 L150 60 Q160 50 170 60 L170 78" />
            </g>

            {/* Musi River Waves & Flowing Curves */}
            <path
              d="M0 220 C60 210 100 235 160 225 C220 215 260 240 320 228 M0 230 C60 220 100 245 160 235 C220 225 260 250 320 238"
              fill="none"
              stroke="#0097A7"
              strokeWidth="0.8"
              opacity="0.5"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#hyd-heritage-grid)" />
      </svg>
    </div>
  );
}

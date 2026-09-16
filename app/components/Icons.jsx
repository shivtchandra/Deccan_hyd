"use client";

import { GLYPH } from "../../lib/iconPaths.js";

// 24×24 round-join stroke icon. name resolves from the single GLYPH map.
export function Icon({ name, size = 20, width = 1.75, color = "currentColor", style, className }) {
  const paths = GLYPH[name];
  if (!paths) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "block", flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

// Type glyph for a heritage site (falls back to a generic monument).
export function TypeIcon({ type, ...props }) {
  return <Icon name={GLYPH[type] ? type : "monument"} {...props} />;
}

// Decorative looping ribbon for empty-state / hero backdrops.
export function Squiggles({ color = "var(--accent)", style }) {
  return (
    <svg viewBox="0 0 240 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" style={{ display: "block", ...style }} aria-hidden="true">
      <path d="M4 20c14-16 28 16 42 0s28-16 42 0 28 16 42 0 28-16 42 0 28 16 42 0" opacity="0.5" />
    </svg>
  );
}

// A poster ribbon that caps a colored hero block.
export function Wave({ color = "var(--cream)", style }) {
  return (
    <svg viewBox="0 0 400 24" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 18, ...style }} aria-hidden="true">
      <path d="M0 24V10c40 12 80 12 120 4s80-16 140-4 100 10 140 0v14z" fill={color} />
    </svg>
  );
}

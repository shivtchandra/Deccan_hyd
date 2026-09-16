"use client";
import { useEffect, useRef } from "react";

export default function EraTransition({ eraKey, label, hook, onDone }) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDone?.(), 3100);
    return () => clearTimeout(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="era-transition-overlay"
      style={{ "--era-c": `var(--era-${eraKey}, var(--accent))` }}
      aria-hidden="true"
    >
      <div className="era-transition-bar" />
      <div className="era-transition-content">
        <span className="era-transition-label">{label}</span>
        <span className="era-transition-hook">{hook}</span>
      </div>
    </div>
  );
}

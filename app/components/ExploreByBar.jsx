"use client";

import React from "react";

export default function ExploreByBar({ activeMode, onSelectMode }) {
  const modes = [
    { id: "all", label: "All Layers", icon: "atlas" },
    { id: "time", label: "Time (1591–2026)", icon: "clock" },
    { id: "trails", label: "Trails & Stories", icon: "path" },
    { id: "maps", label: "Historical Maps", icon: "map" },
    { id: "vanished", label: "What Used to Be Here?", icon: "ghost", isSpecial: true },
  ];

  return (
    <div className="explore-pills">
      {modes.map((mode) => {
        const isActive = activeMode === mode.id;
        const className = `explore-pill ${isActive ? (mode.isSpecial ? "vanished-active" : "active") : ""}`;

        return (
          <button
            key={mode.id}
            className={className}
            onClick={() => onSelectMode(mode.id)}
          >
            {mode.isSpecial && <span style={{ fontSize: 13 }}>⏳</span>}
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}

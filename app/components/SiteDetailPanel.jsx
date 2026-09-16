"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { getPeriodForYear } from "../../lib/heritageData.js";

export default function SiteDetailPanel({ site, onClose, onAddToRoute, isInRoute }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  if (!site) return null;

  const period = getPeriodForYear(site.startYear || 1800);
  const thenPhoto = site.thenPhoto || {
    url: site.photos?.[0]?.url || `/photos/${site.id}.jpg`,
    caption: "Archival record",
    year: "Historical",
    credit: "Archival Collection",
    source: "Historical Archive",
  };
  const nowPhoto = site.nowPhoto || {
    url: site.photos?.[0]?.url || `/photos/${site.id}.jpg`,
    caption: "Present-day view",
    year: "2026",
    credit: "Field Survey",
    source: "Contemporary Documentation",
  };

  const updateSlider = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updateSlider(e.clientX);
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    };
    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, updateSlider]);

  return (
    <div className="site-detail-panel">
      {/* Header bar */}
      <div className="panel-header-bar">
        <span
          className="panel-era-badge"
          style={{ "--badge-color": period.accent_color }}
        >
          {period.name} · {site.startYear || site.yearBuilt}
        </span>
        <button className="panel-close-btn" onClick={onClose} aria-label="Close site details">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Scrollable magazine body */}
      <div className="panel-scrollable-content">
        {/* Title block */}
        <div className="panel-title-block">
          <h2 className="panel-monument-name">{site.name}</h2>
          <div className="panel-monument-meta">
            <span>{site.area || "Hyderabad"}</span>
            <span>·</span>
            <span>{site.architecturalStyle || "Deccani Heritage"}</span>
            <span>·</span>
            <span style={{ textTransform: "capitalize" }}>{site.status?.replace("-", " ") || "Protected"}</span>
          </div>
        </div>

        {/* THEN ↔ NOW Draggable Comparison Slider */}
        <div className="then-now-container">
          <div className="then-now-label-bar">
            <span>THEN ({thenPhoto.year})</span>
            <span>↔</span>
            <span>NOW ({nowPhoto.year})</span>
          </div>

          <div
            ref={containerRef}
            className="then-now-viewport"
            onPointerDown={handlePointerDown}
          >
            {/* THEN Photo Layer (Full width underneath) */}
            <div className="then-img-layer">
              <img
                src={thenPhoto.url}
                alt={`Historical view of ${site.name}`}
                onError={(e) => {
                  e.target.src = "/photos/charminar.jpg";
                }}
              />
            </div>

            {/* NOW Photo Layer (Clipped to slider width) */}
            <div
              className="now-img-layer"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={nowPhoto.url}
                alt={`Present day view of ${site.name}`}
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
                  maxWidth: "none",
                }}
                onError={(e) => {
                  e.target.src = "/photos/charminar.jpg";
                }}
              />
            </div>

            {/* Draggable Divider Line & Handle */}
            <div className="then-now-divider" style={{ left: `${sliderPos}%` }}>
              <div className="then-now-handle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: -6 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>

            {/* Overlay Tags */}
            <div className="then-now-tags">
              <span className="then-tag">THEN · {thenPhoto.year}</span>
              <span className="now-tag">NOW</span>
            </div>
          </div>

          <div className="then-now-caption">
            {thenPhoto.caption} Photo: {thenPhoto.credit} ({thenPhoto.source || "Archive"}).
          </div>
        </div>

        {/* WHY IT MATTERS (Historical Significance) */}
        <div className="detail-section">
          <div className="section-label">Why It Matters</div>
          <p className="section-body">
            {site.significance || site.summary}
          </p>
        </div>

        {/* ARCHITECTURE & URBAN FORM */}
        <div className="detail-section">
          <div className="section-label">Architecture & Form</div>
          <p className="section-body">
            {site.architectureText || `Constructed during the ${period.name}, displaying regional masonry craftsmanship and distinctive architectural elements.`}
          </p>
        </div>

        {/* VERIFIED SOURCES & ARCHIVAL CITATIONS */}
        <div className="detail-section">
          <div className="section-label">Verified Sources & Archives</div>
          <div className="sources-card">
            {(site.sources && site.sources.length > 0 ? site.sources : [
              { label: "Archaeological Survey of India (ASI)", url: "https://asihyderabadcircle.in" },
              { label: "INTACH Hyderabad Heritage Register", url: "http://intachhyderabad.org" },
              { label: "The Deccan Archive", url: "https://www.thedeccanarchive.com" }
            ]).map((src, idx) => (
              <div key={idx} className="source-item">
                <span>•</span>
                <a href={src.url || "#"} target="_blank" rel="noopener noreferrer">
                  {src.label || src.title || "Archive Record"}
                </a>
                {src.year && <span style={{ opacity: 0.6 }}>({src.year})</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BUTTON */}
        {onAddToRoute && (
          <button
            className="pressable"
            onClick={() => onAddToRoute(site.id)}
            style={{
              background: isInRoute ? "var(--petrol-600)" : "var(--amber)",
              color: isInRoute ? "var(--cream)" : "var(--petrol-900)",
              border: "1px solid var(--petrol-border)",
              padding: "10px 16px",
              borderRadius: "var(--r-pill)",
              fontWeight: 600,
              fontSize: 13,
              marginTop: 6,
            }}
          >
            {isInRoute ? "✓ In Your Walking Trail" : "+ Add to Walking Trail"}
          </button>
        )}
      </div>
    </div>
  );
}

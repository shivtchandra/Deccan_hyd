"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { CULTURAL_ORIGINS, ORIGINS_BY_ID } from "../../lib/culturalOrigins.js";
import { Icon } from "./Icons.jsx";

/* ── Real geographic coordinates & historical trade waypoints ──────────── */
const GEO = {
  biryani:               { from: [28.61, 77.21], label: "Delhi / Mughal North" },
  haleem:                { from: [15.55, 48.52], label: "Hadhramaut, Yemen" },
  "irani-chai":          { from: [31.90, 54.37], label: "Yazd, Iran" },
  "double-ka-meetha":    { from: [28.61, 77.21], label: "Delhi / Mughal" },
  qubani:                { from: [40.38, 71.78], label: "Fergana, Central Asia" },
  sherwani:              { from: [40.64, 49.89], label: "Shirvan, Caucasus" },
  bidriware:             { from: [17.91, 77.52], label: "Bidar" },
  himroo:                { from: [28.61, 77.21], label: "Delhi" },
  "lacquer-bangles":     { from: [17.361, 78.474], label: "Laad Bazaar / Hyderabad" },
  kalamkari:             { from: [16.19, 81.14], label: "Machilipatnam", to: [51.5, -0.13] },
  "khairatabad-ganesh":  { from: [17.412, 78.460], label: "Khairatabad" },
  "ganesh-chaturthi-hyd": { from: [18.52, 73.85], label: "Pune" },
};

const ROUTE_WAYPOINTS = {
  // Maritime East India Cotton Voyage: Machilipatnam -> South of Sri Lanka -> Bab-el-Mandeb -> Suez -> Gibraltar -> Europe
  kalamkari: [
    [16.19, 81.14],
    [6.0, 77.0],
    [12.5, 45.0],
    [28.0, 33.5],
    [36.0, -5.3],
    [51.5, -0.13],
  ],
  // Hadhramaut Harees & Spice Sea Voyage: Yemen -> Arabian Sea -> Konkan Coast -> Hyderabad
  haleem: [
    [15.55, 48.52],
    [16.5, 62.0],
    [18.96, 72.82],
    [17.385, 78.487],
  ],
  // Persian Samovar & Tea Route: Yazd -> Bandar Abbas -> Arabian Sea -> Mumbai -> Hyderabad
  "irani-chai": [
    [31.90, 54.37],
    [27.18, 56.28],
    [20.5, 64.0],
    [18.96, 72.82],
    [17.385, 78.487],
  ],
  // Mughal Imperial Highway: Delhi -> Agra -> Burhanpur -> Aurangabad -> Hyderabad
  biryani: [
    [28.61, 77.21],
    [27.17, 78.00],
    [21.31, 76.22],
    [19.87, 75.34],
    [17.385, 78.487],
  ],
  // Fergana Apricot Silk Road: Fergana -> Samarkand -> Kabul -> Delhi -> Hyderabad
  qubani: [
    [40.38, 71.78],
    [39.65, 66.97],
    [34.55, 69.20],
    [28.61, 77.21],
    [17.385, 78.487],
  ],
  // Caucasian Sherwani Route: Shirvan -> Isfahan -> Delhi -> Hyderabad
  sherwani: [
    [40.64, 49.89],
    [32.65, 51.66],
    [28.61, 77.21],
    [17.385, 78.487],
  ],
  // Bidri Inlay Craft: Bidar -> Zahirabad -> Hyderabad
  bidriware: [
    [17.91, 77.52],
    [17.68, 77.60],
    [17.385, 78.487],
  ],
  // Tughlaq Capital Migration: Delhi -> Daulatabad -> Hyderabad
  himroo: [
    [28.61, 77.21],
    [19.87, 75.34],
    [17.385, 78.487],
  ],
  // Mughal Sweetmasters: Delhi -> Malwa -> Hyderabad
  "double-ka-meetha": [
    [28.61, 77.21],
    [23.18, 75.78],
    [17.385, 78.487],
  ],
  // Khairatabad Procession Route: Khairatabad -> Hussain Sagar
  "khairatabad-ganesh": [
    [17.412, 78.460],
    [17.385, 78.487],
  ],
  // Ganesh Chaturthi Spread: Pune -> Solapur -> Hyderabad
  "ganesh-chaturthi-hyd": [
    [18.52, 73.85],
    [17.65, 75.90],
    [17.385, 78.487],
  ],
  // Lacquer Bangles Qutb Shahi Foundation
  "lacquer-bangles": [
    [17.361, 78.474],
    [17.385, 78.487],
  ],
};

const HYD     = [17.385, 78.487];
const MAP_CTR = [22, 65];
const MAP_Z   = 4;

const DIR_COLOR = {
  inward:  "#c2603a",
  hybrid:  "#d97706",
  local:   "#2d7a4f",
  outward: "#3b6998",
};
const DIR_LABEL = {
  inward:  "Arrived",
  hybrid:  "Adapted",
  local:   "Born Here",
  outward: "Sailed Out",
};
const DIR_OPACITY = { inward: 0.78, hybrid: 0.65, local: 0.60, outward: 0.72 };

/* ── Smooth Catmull-Rom to Cubic Bezier Spline ──────────────────────────── */
function getSmoothSplinePath(pts) {
  if (!pts || pts.length === 0) return null;
  if (pts.length === 1) return { d: `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`, lastSegment: null };

  if (pts.length === 2) {
    const p0 = pts[0];
    const p1 = pts[1];
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ctrl = { x: mx - dy * 0.07, y: my + dx * 0.07 - len * 0.03 };
    return {
      d: `M ${p0.x.toFixed(1)},${p0.y.toFixed(1)} Q ${ctrl.x.toFixed(1)},${ctrl.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`,
      lastSegment: { p1: ctrl, p2: p1 },
    };
  }

  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  const tension = 0.22;
  let lastP1 = pts[pts.length - 2];
  let lastP2 = pts[pts.length - 1];

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;

    if (i === pts.length - 2) {
      lastP1 = { x: cp2x, y: cp2y };
      lastP2 = p2;
    }
  }

  return {
    d,
    lastSegment: { p1: lastP1, p2: lastP2 },
  };
}

function arrowHead(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return { x: p2.x, y: p2.y, angle };
}

/* ── SVG route painter ──────────────────────────────────────────────────── */
function paintRoutes(map, svg, selectedId) {
  if (!map || !svg) return;
  svg.innerHTML = "";
  const { x: W, y: H } = map.getSize();
  svg.setAttribute("width", W);
  svg.setAttribute("height", H);

  const mk = (tag, attrs) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };

  CULTURAL_ORIGINS.forEach((item) => {
    const geo = GEO[item.id];
    if (!geo) return;
    const waypoints = ROUTE_WAYPOINTS[item.id] || [geo.from, geo.to ?? HYD];
    if (waypoints.length < 2) return;

    const isSel   = item.id === selectedId;
    const isUnsel = !!selectedId && !isSel;

    // Completely hide unselected routes when a specific detail is opened to prevent stray line clutter
    if (isUnsel) return;

    const pts = waypoints.map((ll) => map.latLngToContainerPoint(ll));
    const spline = getSmoothSplinePath(pts);
    if (!spline || !spline.d) return;

    const opac  = isSel ? 0.98 : DIR_OPACITY[item.direction] ?? 0.70;
    const sw    = isSel ? 3.4 : item.direction === "inward" ? 2.2 : 1.8;
    const color = DIR_COLOR[item.direction];

    // Background glow stroke for active selected route
    if (isSel) {
      svg.appendChild(mk("path", {
        d: spline.d, fill: "none", stroke: color,
        "stroke-width": 8, "stroke-linecap": "round", opacity: 0.22,
      }));
    }

    const pathEl = mk("path", {
      d: spline.d, fill: "none", stroke: color,
      "stroke-width": sw, "stroke-linecap": "round", opacity: opac,
      ...(item.direction === "hybrid" ? { "stroke-dasharray": "6 4" } : {}),
    });
    svg.appendChild(pathEl);

    if (spline.lastSegment) {
      const { p1, p2 } = spline.lastSegment;
      const ar = arrowHead(p1, p2);
      const aSize = isSel ? 6.5 : 4.5;
      const g = mk("g", {
        transform: `translate(${ar.x.toFixed(1)},${ar.y.toFixed(1)}) rotate(${ar.angle.toFixed(1)})`,
        opacity: opac,
      });
      g.appendChild(mk("polygon", {
        points: `0,${-aSize * 0.7} ${aSize * 1.5},0 0,${aSize * 0.7}`,
        fill: color,
      }));
      svg.appendChild(g);
    }
  });
}

/* ── Component ──────────────────────────────────────────────────────────── */
export default function OriginsMap({
  selectedId: controlledSelectedId,
  onSelectId: controlledOnSelectId,
  onSelect,
  onDetailChange,
}) {
  const mapElRef   = useRef(null);
  const mapRef     = useRef(null);
  const svgRef     = useRef(null);
  const markersRef = useRef({});

  const [mapReady,           setMapReady]           = useState(false);
  const [internalSelectedId, setInternalSelectedId] = useState(null);
  const [sheet,              setSheet]              = useState("list"); // Show option cards by default on mobile!

  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;
  const setSelectedId = (id) => {
    if (controlledOnSelectId) controlledOnSelectId(id);
    else setInternalSelectedId(id);
  };

  /* ── Init Leaflet ─── */
  useEffect(() => {
    if (!mapElRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || mapRef.current || mapElRef.current?._leaflet_id) return;

      const map = L.map(mapElRef.current, {
        center: MAP_CTR, zoom: MAP_Z,
        zoomControl: false, attributionControl: false,
        scrollWheelZoom: true,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 120,
        wheelDebounceTime: 35,
        zoomAnimation: true,
        fadeAnimation: true,
        easeLinearity: 0.2,
      });
      if (cancelled) { map.remove(); return; }
      mapRef.current = map;

      L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          className: "og-origins-tile",
          keepBuffer: 6,
          updateWhenZooming: false,
          updateWhenIdle: true,
        }
      ).addTo(map);

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.style.cssText =
        "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:450;overflow:visible";
      mapElRef.current.appendChild(svg);
      svgRef.current = svg;

      const hydIcon = L.divIcon({
        className: "og-hyd-wrap",
        html: `<span class="og-hyd-core"></span><span class="og-hyd-ring"></span>`,
        iconSize: [28, 28], iconAnchor: [14, 14],
      });
      L.marker(HYD, { icon: hydIcon, interactive: false }).addTo(map);

      CULTURAL_ORIGINS.forEach((item) => {
        const geo = GEO[item.id];
        if (!geo || item.direction === "local") return;
        const color = DIR_COLOR[item.direction];
        const icon = L.divIcon({
          className: "og-origin-wrap",
          html: `<span class="og-origin-dot" style="--c:${color}"></span>`,
          iconSize: [16, 16], iconAnchor: [8, 8],
        });
        const marker = L.marker(geo.from, { icon }).addTo(map).on("click", () => {
          setSelectedId(item.id);
          setSheet("detail");
          onDetailChange?.(true);
        });
        markersRef.current[item.id] = marker;
      });

      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      setMapReady(false);
    };
  }, []);

  /* ── Routes + selection ─── */
  useEffect(() => {
    if (!mapReady || !mapRef.current || !svgRef.current) return;
    const map = mapRef.current;
    const svg = svgRef.current;

    const redraw = () => paintRoutes(map, svg, selectedId);
    const onZoomStart = () => { svg.style.visibility = "hidden"; };
    const onZoomEnd   = () => { paintRoutes(map, svg, selectedId); svg.style.visibility = ""; };
    const onMove      = () => { if (svg.style.visibility !== "hidden") paintRoutes(map, svg, selectedId); };
    map.on("zoomstart", onZoomStart);
    map.on("zoomend viewreset moveend", onZoomEnd);
    map.on("move", onMove);
    redraw();

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const dot = marker.getElement()?.querySelector(".og-origin-dot");
      if (!dot) return;
      const isSel = id === selectedId;
      dot.style.opacity       = selectedId && !isSel ? "0" : "1";
      dot.style.pointerEvents = selectedId && !isSel ? "none" : "auto";
      dot.style.transform     = isSel ? "scale(1.6)" : "scale(1)";
    });

    if (selectedId) {
      const geo  = GEO[selectedId];
      const item = ORIGINS_BY_ID[selectedId];
      if (geo && item?.direction !== "local") {
        map.fitBounds([geo.from, geo.to ?? HYD], { padding: [80, 80], maxZoom: 6, animate: true });
      }
    }

    return () => {
      map.off("zoomstart", onZoomStart);
      map.off("zoomend viewreset moveend", onZoomEnd);
      map.off("move", onMove);
    };
  }, [selectedId, mapReady]);

  const select = (id) => {
    setSelectedId(id);
    setSheet("detail");
    onDetailChange?.(true);
  };
  
  const backToList = () => {
    setSelectedId(null);
    setSheet("list");
    onDetailChange?.(false);
    if (mapRef.current) mapRef.current.setView(MAP_CTR, MAP_Z, { animate: true });
  };

  const selItem = selectedId ? ORIGINS_BY_ID[selectedId] : null;
  const selGeo  = selectedId ? GEO[selectedId] : null;

  const touchStartRef = useRef(null);

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current;
    touchStartRef.current = null;
    if (deltaY < -35) {
      setSheet((s) => (s === "collapsed" ? "list" : s === "list" ? "expanded" : s));
    } else if (deltaY > 35) {
      setSheet((s) => (s === "expanded" ? "list" : s === "list" ? "collapsed" : s));
    }
  };

  return (
    <div className="og-root">
      <div ref={mapElRef} className="og-map" />

      {/* Editorial Compass Rose */}
      <div className="og-compass-rose" aria-hidden="true">
        <svg viewBox="0 0 44 44" width="34" height="34" fill="none" stroke="var(--ink-soft)" strokeWidth="1.2">
          <circle cx="22" cy="22" r="18" strokeOpacity="0.3" strokeDasharray="2 2" />
          <polygon points="22,6 24.5,22 22,20 19.5,22" fill="var(--accent)" stroke="none" />
          <polygon points="22,38 24.5,22 22,24 19.5,22" fill="var(--ink-soft)" opacity="0.4" stroke="none" />
          <polygon points="38,22 22,24.5 24,22 22,19.5" fill="var(--ink-soft)" opacity="0.4" stroke="none" />
          <polygon points="6,22 22,24.5 20,22 22,19.5" fill="var(--ink-soft)" opacity="0.4" stroke="none" />
          <text x="22" y="4" fontSize="7.5" fontWeight="800" textAnchor="middle" fill="var(--accent)">N</text>
        </svg>
      </div>

      {/* Quiet Archival Map Key */}
      <div className="og-header-bar material" aria-hidden="true">
        <div className="og-header-title">
          <span className="og-title-serif">Where It Came From</span>
          <span className="og-title-meta">14th–20th C Trade Atlas</span>
        </div>
        <div className="og-header-legend">
          <div className="og-legend-chip">
            <span className="og-legend-sample og-sample-solid" style={{ background: DIR_COLOR.inward }} />
            <span>Arrived</span>
          </div>
          <div className="og-legend-chip">
            <span className="og-legend-sample og-sample-dashed" style={{ borderColor: DIR_COLOR.hybrid }} />
            <span>Adapted</span>
          </div>
          <div className="og-legend-chip">
            <span className="og-legend-sample og-sample-dot" style={{ background: DIR_COLOR.local }} />
            <span>Born Here</span>
          </div>
          <div className="og-legend-chip">
            <span className="og-legend-sample og-sample-arrow" style={{ color: DIR_COLOR.outward }}>➔</span>
            <span>Sailed Out</span>
          </div>
        </div>
      </div>

      {/* Desktop Floating Origin Highlight Preview */}
      {selItem && (
        <div className="og-desktop-card material" role="dialog" aria-label={selItem.name}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="og-item-dot" style={{ background: DIR_COLOR[selItem.direction] }} />
              <span style={{ fontSize: 10.5, fontWeight: 800, color: DIR_COLOR[selItem.direction], textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {DIR_LABEL[selItem.direction]}
              </span>
              <span style={{ fontSize: 10.5, color: "var(--muted)" }}>· {selItem.eraLabel}</span>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              style={{ background: "none", border: "none", color: "var(--ink-soft)", cursor: "pointer", fontSize: 15, padding: "0 2px" }}
              aria-label="Close highlight"
            >
              ✕
            </button>
          </div>
          <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 700, margin: "6px 0 3px", color: "var(--ink)" }}>
            {selItem.name}
          </h3>
          {selGeo && (
            <div style={{ fontSize: 11.5, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>{selGeo.label}</span>
              <span style={{ color: DIR_COLOR[selItem.direction] }}>➔</span>
              <span style={{ fontWeight: 600 }}>{selItem.direction === "outward" ? "Europe" : "Hyderabad"}</span>
            </div>
          )}
          <p style={{ fontSize: 12.5, color: "var(--ink)", lineHeight: 1.45, margin: "0 0 12px" }}>
            {selItem.summary}
          </p>
          <button
            className="og-explore-btn pressable"
            style={{ background: DIR_COLOR[selItem.direction], padding: "8px 12px", fontSize: 12, borderRadius: "var(--r-sm)", cursor: "pointer", border: "none", color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            onClick={() => onSelect && onSelect(selItem.id)}
          >
            Read Full Story & Photos →
          </button>
        </div>
      )}

      {/* Bottom sheet with pull-up gesture & expansion states (mobile only) */}
      <div className={`og-sheet og-sheet--${sheet}`} role="complementary" aria-label="Cultural influences">
        <div
          className="og-handle-area"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => {
            if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
            setSheet((s) => (s === "collapsed" ? "list" : s === "list" ? "expanded" : "list"));
          }}
          title="Drag up or tap to expand options"
        >
          <span className="og-handle-bar" />
          <div className="og-handle-header">
            <span className="og-handle-title">{CULTURAL_ORIGINS.length} CULTURAL INFLUENCES</span>
            <div className="og-handle-btns">
              {sheet === "collapsed" && (
                <button className="og-handle-toggle-btn pressable-sm" onClick={() => setSheet("list")}>
                  ▲ Show List
                </button>
              )}
              {sheet === "list" && (
                <>
                  <button className="og-handle-toggle-btn pressable-sm" onClick={() => setSheet("expanded")}>
                    ⤢ Expand All
                  </button>
                  <button className="og-handle-toggle-btn og-btn-subtle pressable-sm" onClick={() => setSheet("collapsed")}>
                    ▼ Collapse
                  </button>
                </>
              )}
              {sheet === "expanded" && (
                <>
                  <button className="og-handle-toggle-btn pressable-sm" onClick={() => setSheet("list")}>
                    ⤡ Half View
                  </button>
                  <button className="og-handle-toggle-btn og-btn-subtle pressable-sm" onClick={() => setSheet("collapsed")}>
                    ▼ Collapse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {(sheet === "list" || sheet === "expanded") && (
          <div className="og-sheet-body">
            <div className="og-items">
              {CULTURAL_ORIGINS.map((item) => (
                <button
                  key={item.id}
                  className={`og-item pressable-sm${selectedId === item.id ? " og-item--on" : ""}`}
                  onClick={() => select(item.id)}
                >
                  <span className="og-item-dot" style={{ background: DIR_COLOR[item.direction] }} />
                  <span className="og-item-info">
                    <span className="og-item-name">{item.name}</span>
                    <span className="og-item-meta">
                      {item.eraLabel} ·{" "}
                      <span style={{ color: DIR_COLOR[item.direction], fontWeight: 700 }}>
                        {DIR_LABEL[item.direction].toUpperCase()}
                      </span>
                    </span>
                  </span>
                  {item.category && (
                    <span className="og-item-cat-badge">{item.category}</span>
                  )}
                  <span className="og-item-chev" aria-hidden="true">
                    <Icon name="chevron-right" size={15} color="var(--muted)" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {sheet === "detail" && selItem && (
          <div className="og-sheet-body og-detail-body">
            <button className="og-back-pill pressable" onClick={backToList}>
              <Icon name="arrow-left" size={14} color="var(--accent)" /> Back to all 12 cultural influences
            </button>

            <div className="og-detail-hdr">
              <div className="og-detail-badges">
                <span className="og-detail-dir" style={{ color: DIR_COLOR[selItem.direction] }}>
                  {DIR_LABEL[selItem.direction].toUpperCase()}
                </span>
                {selItem.category && (
                  <span className="og-cat-tag">{selItem.category.toUpperCase()}</span>
                )}
              </div>
              <h3 className="og-detail-name">{selItem.name}</h3>
              <span className="og-detail-era">{selItem.eraLabel} · {selItem.yearRange}</span>
            </div>

            {selGeo && (
              <div className="og-detail-route-bar">
                <div className="og-route-pt">
                  <span className="og-route-lbl">ORIGIN</span>
                  <span className="og-route-val">{selGeo.label}</span>
                </div>
                <span className="og-route-arr" style={{ color: DIR_COLOR[selItem.direction] }}>➔</span>
                <div className="og-route-pt">
                  <span className="og-route-lbl">DESTINATION</span>
                  <span className="og-route-val">{selItem.direction === "outward" ? "Europe" : "Hyderabad"}</span>
                </div>
              </div>
            )}

            {/* Section 1: How it changed in Hyderabad */}
            <div className="og-story-sec">
              <h4 className="og-sec-hdr">HOW IT CHANGED IN HYDERABAD</h4>
              <p className="og-detail-summary">{selItem.summary}</p>
              {selItem.secret && (
                <div className="og-detail-secret">
                  <span className="og-secret-icon">💡</span>
                  <span>{selItem.secret}</span>
                </div>
              )}
            </div>

            {/* Section 2: Where to explore */}
            {selItem.localTip && (
              <div className="og-story-sec">
                <h4 className="og-sec-hdr">WHERE TO EXPLORE</h4>
                <div className="og-loc-card">
                  <span className="og-loc-icon">📍</span>
                  <p className="og-loc-tip">{selItem.localTip}</p>
                </div>
              </div>
            )}

            <button
              className="og-explore-btn pressable"
              style={{ background: DIR_COLOR[selItem.direction] }}
              onClick={() => onSelect && onSelect(selItem.id)}
            >
              Read Full Story & Photos →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { eraColor, photoUrl } from "../../lib/heritage.js";
import { GLYPH } from "../../lib/iconPaths.js";
import { spotlight, buildClusters, buildAreas, AREA_ZOOM_MAX } from "../../lib/spotlight.js";
import { VANISHED_PLACES, HISTORICAL_MAPS } from "../../lib/heritageData.js";

const HYD_CENTER = [17.395, 78.474];

function clockSvg(color = "#fff") {
  return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>`;
}

function glyphSvg(type, color) {
  const paths = (GLYPH[type] || GLYPH.monument || []).map((d) => `<path d="${d}"/>`).join("");
  return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

export default function MapCanvas({
  sites,
  routeStops = [],
  selectedId,
  onSelect,
  passport,
  routeIds = [],
  routeGeometry = null,
  pickMode = false,
  onPick,
  onReady,
  userLoc = null,
  vanishedPlaces = [],
  selectedVanished = null,
  onSelectVanished = null,
  activeMapOverlayId = null,
  mapOverlayOpacity = 0.75,
  activeTrail = null,
  trailStopIndex = 0,
  onTrailStopSelect = null,
  baseTile = "standard",
  isTimeTravel = false,
}) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const baseTileRef = useRef(null);
  const spotLayerRef = useRef(null);
  const vanishedLayerRef = useRef(null);
  const overlayLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const meLayerRef = useRef(null);
  const LRef = useRef(null);

  // Persistent marker maps to prevent DOM destruction/re-creation & blinking during updates
  const spotMarkersRef = useRef(new Map());
  const areaMarkersRef = useRef(new Map());
  const vanishedMarkersRef = useRef(new Map());

  const onSelectRef = useRef(onSelect);
  const onPickRef = useRef(onPick);
  const onSelectVanishedRef = useRef(onSelectVanished);
  onSelectRef.current = onSelect;
  onPickRef.current = onPick;
  onSelectVanishedRef.current = onSelectVanished;

  const [ready, setReady] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let dead = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (dead || !elRef.current || mapRef.current) return;
      LRef.current = L;

      const map = L.map(elRef.current, {
        center: HYD_CENTER,
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        minZoom: 10,
        maxZoom: 18,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 120,
        wheelDebounceTime: 35,
        zoomAnimation: true,
        zoomAnimationThreshold: 8,
        fadeAnimation: true,
        markerZoomAnimation: true,
        easeLinearity: 0.2,
      });

      baseTileRef.current = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors · Mapping HYD",
        maxZoom: 19,
        keepBuffer: 8,
        updateWhenZooming: false,
        updateWhenIdle: true,
      }).addTo(map);

      map.on("click", (e) => onPickRef.current && onPickRef.current({ lat: e.latlng.lat, lng: e.latlng.lng }));
      map.on("moveend zoomend", () => setTick((t) => t + 1));

      mapRef.current = map;
      overlayLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
      spotLayerRef.current = L.layerGroup().addTo(map);
      vanishedLayerRef.current = L.layerGroup().addTo(map);
      meLayerRef.current = L.layerGroup().addTo(map);
      setReady((n) => n + 1);

      if (onReady) {
        onReady({
          flyTo: (lat, lng, zoom = 16) => {
            if (!mapRef.current || !LRef.current) return;
            const m = mapRef.current;
            const currentZoom = m.getZoom();
            const center = m.getCenter();
            const dist = LRef.current.latLng(lat, lng).distanceTo(center);

            if (currentZoom >= 13 && dist < 3000) {
              m.panTo([lat, lng], { animate: true, duration: 0.55, easeLinearity: 0.2 });
            } else {
              m.flyTo([lat, lng], zoom, {
                animate: true,
                duration: 0.95,
                easeLinearity: 0.2,
              });
            }
          },
          panTo: (lat, lng, duration = 1.0) => {
            if (!mapRef.current) return;
            mapRef.current.panTo([lat, lng], { animate: true, duration, easeLinearity: 0.2 });
          },
          fitRoute: (coords) => coords?.length && mapRef.current?.fitBounds(coords, { padding: [60, 60], maxZoom: 16, animate: true, duration: 0.8 }),
        });
      }
    })();
    return () => {
      dead = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [onReady]);

  useEffect(() => {
    if (elRef.current) elRef.current.style.cursor = pickMode ? "crosshair" : "";
  }, [pickMode]);

  // Historical Map Overlay Layer
  useEffect(() => {
    const L = LRef.current, map = mapRef.current, layer = overlayLayerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();

    if (activeMapOverlayId) {
      const hMap = HISTORICAL_MAPS.find((m) => m.id === activeMapOverlayId);
      if (hMap && hMap.image_url) {
        if (Array.isArray(hMap.bounds) && hMap.bounds.length === 2 && Array.isArray(hMap.bounds[0])) {
          const imageOverlay = L.imageOverlay(hMap.image_url, hMap.bounds, {
            opacity: mapOverlayOpacity,
            zIndex: 10,
            interactive: false,
          });
          imageOverlay.addTo(layer);
        } else {
          const overlay = L.tileLayer(hMap.image_url, {
            opacity: mapOverlayOpacity,
            maxZoom: 18,
            zIndex: 10,
          });
          overlay.addTo(layer);
        }
      }
    }
  }, [activeMapOverlayId, mapOverlayOpacity, ready]);

  // Base tile swap
  useEffect(() => {
    const L = LRef.current, map = mapRef.current;
    if (!L || !map) return;
    if (baseTileRef.current) map.removeLayer(baseTileRef.current);
    const TILES = {
      standard: { url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", attr: "&copy; OpenStreetMap contributors · Mapping HYD", maxZoom: 19 },
      natgeo: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}", attr: "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ", maxZoom: 16, maxNativeZoom: 12 },
    };
    const cfg = TILES[baseTile] || TILES.standard;
    baseTileRef.current = L.tileLayer(cfg.url, { attribution: cfg.attr, maxZoom: cfg.maxZoom, maxNativeZoom: cfg.maxNativeZoom }).addTo(map);
    baseTileRef.current.bringToBack();
    if (baseTile === "natgeo") {
      map.setMaxZoom(16);
      if (map.getZoom() > 16) map.setZoom(16);
    } else {
      map.setMaxZoom(19);
    }
  }, [ready, baseTile]);

  // Persistent Spot Layer: diffing markers smoothly without clearLayers DOM wipes
  useEffect(() => {
    const L = LRef.current, map = mapRef.current, layer = spotLayerRef.current;
    if (!L || !map || !layer) return;

    const routeSet = new Set(routeIds);
    const list = (sites || []).filter((s) => !routeSet.has(s.id));
    const zoom = map.getZoom();

    const isAreaMode = zoom < AREA_ZOOM_MAX && !isTimeTravel;

    if (isAreaMode) {
      // Clear spot markers when in cluster/area view
      for (const item of spotMarkersRef.current.values()) {
        layer.removeLayer(item.marker);
      }
      spotMarkersRef.current.clear();

      const clusters = buildClusters(list, zoom);
      const currentAreaKeys = new Set();

      for (const c of clusters) {
        if (c.count > 1) {
          const clusterKey = `cluster:${c.id}`;
          currentAreaKeys.add(clusterKey);
          const ps = c.primarySite;
          const eraC = eraColor(ps.era);

          if (!areaMarkersRef.current.has(clusterKey)) {
            const inner = ps.hasPhoto
              ? `<div class="cluster-pin-thumb"><img src="${photoUrl(ps.id)}" alt="" loading="lazy"/></div>`
              : `<div class="cluster-pin-thumb noimg" style="--c:${eraC}">${glyphSvg(ps.type, "#fff")}</div>`;
            const icon = L.divIcon({
              className: "",
              iconSize: [52, 52],
              iconAnchor: [26, 26],
              html: `<div class="cluster-pin" style="--c:${eraC};animation:markerEntry 0.35s ease backwards">${inner}<div class="cluster-badge-count">+${c.count}</div><div class="cluster-label">${c.name} (${c.count})</div></div>`,
            });
            const handleClusterClick = () => {
              if (c.sites && c.sites.length > 1) {
                const bounds = L.latLngBounds(c.sites.map((s) => [s.lat, s.lng]));
                const fitZoom = map.getBoundsZoom(bounds, false, [80, 80]);
                if (fitZoom < 14.2) {
                  map.flyTo([c.lat, c.lng], 14.8, {
                    animate: true,
                    duration: 0.85,
                    easeLinearity: 0.2,
                  });
                } else {
                  map.fitBounds(bounds, {
                    padding: [80, 80],
                    maxZoom: 16.5,
                    animate: true,
                    duration: 0.85,
                    easeLinearity: 0.2,
                  });
                }
              } else {
                map.flyTo([c.lat, c.lng], 15.5, {
                  animate: true,
                  duration: 0.85,
                  easeLinearity: 0.2,
                });
              }
            };
            const m = L.marker([c.lat, c.lng], { icon })
              .on("click", handleClusterClick)
              .addTo(layer);
            m.bindTooltip(`<b>${c.name}</b> · ${c.count} heritage sites<br/><span style="font-size:11px;color:#888;">Tap to zoom in & view all ${c.count} sites</span>`, { direction: "top", offset: [0, -28] });
            areaMarkersRef.current.set(clusterKey, { marker: m });
          }
        } else if (c.primarySite) {
          const s = c.primarySite;
          const spotKey = `spot:${s.id}`;
          currentAreaKeys.add(spotKey);

          if (!areaMarkersRef.current.has(spotKey)) {
            const eraC = eraColor(s.era);
            const active = s.id === selectedId;
            const size = 46;
            const inner = s.hasPhoto
              ? `<div class="photo-pin-img"><img src="${photoUrl(s.id)}" alt="" loading="lazy"/></div>`
              : `<div class="photo-pin-img noimg" style="--c:${eraC}">${glyphSvg(s.type, "#fff")}</div>`;
            const icon = L.divIcon({
              className: "",
              iconSize: [size, size],
              iconAnchor: [size / 2, size + 8],
              html: `<div class="photo-pin${active ? " active" : ""}" style="width:${size}px;--c:${eraC}">${inner}<div class="photo-pin-stem"></div><div class="photo-pin-label">${s.name}</div></div>`,
            });
            const m = L.marker([s.lat, s.lng], { icon }).on("click", () => onSelectRef.current?.(s.id)).addTo(layer);
            m.bindTooltip(`<b>${s.name}</b> (${s.startYear || s.yearBuilt || "Historic"})`, { direction: "top", offset: [0, -42] });
            areaMarkersRef.current.set(spotKey, { marker: m });
          }
        }
      }

      for (const [key, item] of areaMarkersRef.current.entries()) {
        if (!currentAreaKeys.has(key)) {
          layer.removeLayer(item.marker);
          areaMarkersRef.current.delete(key);
        }
      }
      return;
    }

    // Clear area markers if leaving cluster view
    for (const item of areaMarkersRef.current.values()) {
      layer.removeLayer(item.marker);
    }
    areaMarkersRef.current.clear();

    // When zoomed in, show all individual monuments in view as rich photo pins
    const heroList = list;
    const rest = [];

    const nextMarkerKeys = new Set();

    // Hero photo pins diffing
    for (const s of heroList) {
      const active = s.id === selectedId;
      const visited = passport?.visited?.[s.id];
      const c = eraColor(s.era);
      const size = 52;
      const stateKey = `hero:${s.id}:${active}:${visited}:${c}:${s.name}:${s.hasPhoto}`;
      nextMarkerKeys.add(s.id);

      const existing = spotMarkersRef.current.get(s.id);
      if (existing) {
        if (existing.key !== stateKey) {
          const inner = s.hasPhoto
            ? `<div class="photo-pin-img"><img src="${photoUrl(s.id)}" alt="" loading="lazy"/></div>`
            : `<div class="photo-pin-img noimg" style="--c:${c}">${glyphSvg(s.type, "#fff")}</div>`;
          const icon = L.divIcon({
            className: "",
            iconSize: [size, size],
            iconAnchor: [size / 2, size + 8],
            html: `<div class="photo-pin${active ? " active" : ""}${visited ? " collected" : ""}" style="width:${size}px;--c:${c};transform-origin:50% 100%">${inner}<div class="photo-pin-stem"></div><div class="photo-pin-label">${s.name}</div></div>`,
          });
          existing.marker.setIcon(icon);
          existing.marker.setZIndexOffset(active ? 1000 : 0);
          existing.key = stateKey;
        }
      } else {
        // NEW marker popping up on the map for the first time
        const inner = s.hasPhoto
          ? `<div class="photo-pin-img"><img src="${photoUrl(s.id)}" alt="" loading="lazy"/></div>`
          : `<div class="photo-pin-img noimg" style="--c:${c}">${glyphSvg(s.type, "#fff")}</div>`;
        const anim = isTimeTravel
          ? "markerTimelapsePop 0.4s cubic-bezier(0.34,1.56,0.64,1) backwards"
          : "markerEntry 0.35s cubic-bezier(0.34,1.56,0.64,1) backwards";
        const icon = L.divIcon({
          className: "",
          iconSize: [size, size],
          iconAnchor: [size / 2, size + 8],
          html: `<div class="photo-pin${active ? " active" : ""}${visited ? " collected" : ""}" style="width:${size}px;--c:${c};transform-origin:50% 100%;animation:${anim}">${inner}<div class="photo-pin-stem"></div><div class="photo-pin-label">${s.name}</div></div>`,
        });
        const m = L.marker([s.lat, s.lng], { icon, zIndexOffset: active ? 1000 : 0 }).on("click", () => onSelectRef.current?.(s.id)).addTo(layer);
        m.bindTooltip(`<b>${s.name}</b> (${s.startYear || s.yearBuilt || "Historic"})`, { direction: "top", offset: [0, -48] });
        spotMarkersRef.current.set(s.id, { marker: m, key: stateKey });
      }
    }

    // Mini dots diffing
    for (const s of rest) {
      const visited = passport?.visited?.[s.id];
      const stateKey = `dot:${s.id}:${visited}`;
      nextMarkerKeys.add(s.id);

      const existing = spotMarkersRef.current.get(s.id);
      if (existing) {
        if (existing.key !== stateKey) {
          const icon = L.divIcon({
            className: "",
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            html: `<div class="mini-dot${visited ? " visited" : ""}"></div>`,
          });
          existing.marker.setIcon(icon);
          existing.key = stateKey;
        }
      } else {
        const icon = L.divIcon({
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          html: `<div class="mini-dot${visited ? " visited" : ""}" style="animation:dotEntry 0.2s ease backwards"></div>`,
        });
        const m = L.marker([s.lat, s.lng], { icon }).on("click", () => onSelectRef.current?.(s.id)).addTo(layer);
        m.bindTooltip(`<b>${s.name}</b>${s.startYear ? ` (${s.startYear})` : ""}`, { direction: "top", offset: [0, -8] });
        spotMarkersRef.current.set(s.id, { marker: m, key: stateKey });
      }
    }

    // Remove markers that are no longer active
    for (const [id, item] of spotMarkersRef.current.entries()) {
      if (!nextMarkerKeys.has(id)) {
        layer.removeLayer(item.marker);
        spotMarkersRef.current.delete(id);
      }
    }
  }, [sites, selectedId, passport, routeIds, ready, tick, isTimeTravel]);

  // Vanished Places Layer: persistent diffing
  useEffect(() => {
    const L = LRef.current, layer = vanishedLayerRef.current;
    if (!L || !layer) return;

    if (!vanishedPlaces.length) {
      for (const item of vanishedMarkersRef.current.values()) {
        layer.removeLayer(item.marker);
      }
      vanishedMarkersRef.current.clear();
      return;
    }

    const nextVanishedIds = new Set();
    vanishedPlaces.forEach((v) => {
      nextVanishedIds.add(v.id);
      const active = selectedVanished?.id === v.id;
      const stateKey = `${v.id}:${active}`;
      const existing = vanishedMarkersRef.current.get(v.id);

      if (existing) {
        if (existing.key !== stateKey) {
          const icon = L.divIcon({
            className: "",
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            html: `<div class="pressable-sm" style="width:36px;height:36px;border-radius:50%;background:var(--pop);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:var(--e2);border:2.5px solid var(--cream-hi);transform:${active ? "scale(1.2)" : "scale(1)"};">${clockSvg()}</div>`,
          });
          existing.marker.setIcon(icon);
          existing.marker.setZIndexOffset(active ? 1600 : 800);
          existing.key = stateKey;
        }
      } else {
        const icon = L.divIcon({
          className: "",
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          html: `<div class="pressable-sm" style="width:36px;height:36px;border-radius:50%;background:var(--pop);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:var(--e2);border:2.5px solid var(--cream-hi);transform:${active ? "scale(1.2)" : "scale(1)"};animation:markerEntry 0.3s ease backwards">${clockSvg()}</div>`,
        });
        const m = L.marker([v.lat, v.lng], { icon, zIndexOffset: active ? 1600 : 800 })
          .on("click", () => onSelectVanishedRef.current?.(v));
        
        const tooltipContent = `<div style="font-family:inherit;font-size:12px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:4px;">${clockSvg("var(--pop)")} ${v.name}</div><div style="font-size:10.5px;color:var(--accent);font-weight:600;">Active: ${v.start_year}–${v.end_year}</div>`;
        m.bindTooltip(tooltipContent, { direction: "top", offset: [0, -18], opacity: 0.95 });

        const popupContent = `
          <div style="padding: 4px 2px; font-family: system-ui, sans-serif; max-width: 240px;">
            <div style="font-size: 10px; font-weight: 700; color: #a8441f; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">
              VANISHED PLACE (${v.start_year} – ${v.end_year})
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #111; margin-bottom: 2px;">${v.name}</div>
            <div style="font-size: 11px; color: #666; margin-bottom: 6px;">${v.current_location || "Old City"}</div>
            <div style="font-size: 11.5px; color: #333; line-height: 1.35; border-top: 1px solid #eee; padding-top: 6px;">
              <b>THEN:</b> ${v.what_existed}
            </div>
            <div style="font-size: 11.5px; color: #666; line-height: 1.35; margin-top: 4px;">
              <b>TODAY:</b> ${v.what_exists_now}
            </div>
          </div>
        `;
        m.bindPopup(popupContent, { maxWidth: 260, className: "vanished-leaflet-popup" });
        m.addTo(layer);
        vanishedMarkersRef.current.set(v.id, { marker: m, key: stateKey });
      }
    });

    for (const [id, item] of vanishedMarkersRef.current.entries()) {
      if (!nextVanishedIds.has(id)) {
        layer.removeLayer(item.marker);
        vanishedMarkersRef.current.delete(id);
      }
    }
  }, [vanishedPlaces, selectedVanished, ready]);

  // Route Polyline and numbered badges
  useEffect(() => {
    const L = LRef.current, layer = routeLayerRef.current;
    if (!L || !layer) return;
    layer.clearLayers();

    if (activeTrail?.stops?.length) {
      const trailStops = activeTrail.stops
        .map((stop) => {
          const site = (sites || []).find((s) => s.id === stop.site_id) || routeStops.find((s) => s.id === stop.site_id);
          return site ? { ...site, stop } : null;
        })
        .filter(Boolean);

      if (trailStops.length > 1) {
        L.polyline(trailStops.map((s) => [s.lat, s.lng]), { color: "#c2603a", weight: 4, opacity: 0.9 }).addTo(layer);
      }

      trailStops.forEach((s, i) => {
        const isActive = i === trailStopIndex;
        const color = isActive ? "#c2603a" : "#8d6e3d";
        const icon = L.divIcon({
          className: "",
          iconSize: [22, 22],
          iconAnchor: [11, 11],
          html: `<div style="width:22px;height:22px;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:2px solid rgba(255,255,255,0.8);box-shadow:var(--e2)">${i + 1}</div>`,
        });
        L.marker([s.lat, s.lng], { icon, zIndexOffset: isActive ? 1300 : 1000 })
          .on("click", () => onTrailStopSelect?.(s))
          .addTo(layer);
      });
    }

    if (!routeIds.length) return;
    const byId = new Map([...(sites || []), ...routeStops].map((s) => [s.id, s]));
    const stops = routeIds.map((id) => byId.get(id)).filter(Boolean);
    if (routeGeometry?.coordinates?.length) {
      L.polyline(routeGeometry.coordinates.map(([lng, lat]) => [lat, lng]), { color: "#c2603a", weight: 4, opacity: 0.9 }).addTo(layer);
    } else if (stops.length > 1) {
      L.polyline(stops.map((s) => [s.lat, s.lng]), { color: "#c2603a", weight: 3, dashArray: "6 6", opacity: 0.8 }).addTo(layer);
    }
    stops.forEach((s, i) => {
      const icon = L.divIcon({ className: "", iconSize: [22, 22], iconAnchor: [11, 11], html: `<div class="route-badge">${i + 1}</div>` });
      L.marker([s.lat, s.lng], { icon, zIndexOffset: 1200 }).on("click", () => onSelectRef.current?.(s.id)).addTo(layer);
    });
  }, [routeIds, routeGeometry, sites, routeStops, activeTrail, trailStopIndex, onTrailStopSelect, ready]);

  // You-are-here dot
  useEffect(() => {
    const L = LRef.current, layer = meLayerRef.current;
    if (!L || !layer) return;
    layer.clearLayers();
    if (!userLoc) return;
    const icon = L.divIcon({
      className: "",
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      html: `<div class="me-dot"><div class="ring"></div><div class="core"></div></div>`,
    });
    L.marker([userLoc.lat, userLoc.lng], { icon, zIndexOffset: 1500, interactive: false }).addTo(layer);
  }, [userLoc, ready]);

  return <div ref={elRef} className="map" />;
}

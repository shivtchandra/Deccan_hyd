"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GLYPH } from "../../lib/iconPaths.js";
import { HISTORICAL_MAPS } from "../../lib/heritageData.js";

const HYD_CENTER = [17.395, 78.474];

function getGlyphSvg(type, color = "#f5efe3") {
  const paths = (GLYPH[type] || GLYPH.monument || []).map((d) => `<path d="${d}"/>`).join("");
  return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

export default function HeritageMap({
  sites = [],
  vanishedPlaces = [],
  selectedId,
  onSelectSite,
  selectedVanishedId,
  onSelectVanished,
  showVanished = true,
  activeMapOverlayId = null,
  mapOverlayOpacity = 0.8,
  activeTrail = null,
  onReady,
}) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const sitesLayerRef = useRef(null);
  const vanishedLayerRef = useRef(null);
  const historicalMapLayerRef = useRef(null);
  const trailLayerRef = useRef(null);
  const LRef = useRef(null);

  const [coords, setCoords] = useState("17.3950° N, 78.4740° E");
  const [ready, setReady] = useState(0);

  // Initialize Map with custom cartography
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (!isMounted || !elRef.current || mapRef.current) return;
      LRef.current = L;

      const map = L.map(elRef.current, {
        center: HYD_CENTER,
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        minZoom: 10,
        maxZoom: 18,
      });

      // Cartographic basemap
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Mapping HYD · Cartography © OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      map.on("mousemove", (e) => {
        setCoords(`${e.latlng.lat.toFixed(4)}° N, ${e.latlng.lng.toFixed(4)}° E`);
      });

      mapRef.current = map;
      historicalMapLayerRef.current = L.layerGroup().addTo(map);
      trailLayerRef.current = L.layerGroup().addTo(map);
      sitesLayerRef.current = L.layerGroup().addTo(map);
      vanishedLayerRef.current = L.layerGroup().addTo(map);
      setReady((n) => n + 1);

      if (onReady) {
        onReady({
          flyTo: (lat, lng, zoom = 16) => {
            if (!mapRef.current) return;
            mapRef.current.flyTo([lat, lng], zoom, {
              duration: 0.8,
              easeLinearity: 0.25,
            });
          },
          fitBounds: (bounds) => {
            if (!mapRef.current || !bounds) return;
            mapRef.current.fitBounds(bounds, { padding: [60, 60] });
          },
        });
      }
    })();

    return () => {
      isMounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [onReady]);

  // Render Historical Map Overlays
  useEffect(() => {
    const L = LRef.current, map = mapRef.current, layer = historicalMapLayerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();

    if (activeMapOverlayId) {
      const hMap = HISTORICAL_MAPS.find((m) => m.id === activeMapOverlayId);
      if (hMap && hMap.bounds) {
        // Tile layer or Image Overlay
        const overlay = L.tileLayer(hMap.image_url, {
          opacity: mapOverlayOpacity,
          maxZoom: 18,
          zIndex: 10,
        });
        overlay.addTo(layer);
      }
    }
  }, [activeMapOverlayId, mapOverlayOpacity, ready]);

  // Render Trail Polyline & Numbers
  useEffect(() => {
    const L = LRef.current, layer = trailLayerRef.current;
    if (!L || !layer) return;
    layer.clearLayers();

    if (!activeTrail || !activeTrail.stops?.length) return;

    const byId = new Map(sites.map((s) => [s.id, s]));
    const stopSites = activeTrail.stops
      .map((st) => ({ ...st, site: byId.get(st.site_id) }))
      .filter((st) => st.site);

    if (stopSites.length > 1) {
      const latlngs = stopSites.map((st) => [st.site.lat, st.site.lng]);
      L.polyline(latlngs, {
        color: "#c2603a",
        weight: 3.5,
        opacity: 0.9,
        dashArray: "6 6",
      }).addTo(layer);
    }

    stopSites.forEach((st, idx) => {
      const icon = L.divIcon({
        className: "",
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        html: `<div style="width:26px;height:26px;border-radius:50%;background:#c2603a;color:#0a1414;font-family:JetBrains Mono,monospace;font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.6);border:2px solid #f5efe3;">${idx + 1}</div>`,
      });
      L.marker([st.site.lat, st.site.lng], { icon, zIndexOffset: 1500 })
        .on("click", () => onSelectSite?.(st.site.id))
        .addTo(layer);
    });
  }, [activeTrail, sites, ready, onSelectSite]);

  // Render Heritage Sites Markers
  useEffect(() => {
    const L = LRef.current, layer = sitesLayerRef.current;
    if (!L || !layer) return;
    layer.clearLayers();

    sites.forEach((site) => {
      const isSelected = site.id === selectedId;
      const color = site.periodColor || "#f5efe3";
      const glyph = getGlyphSvg(site.type, isSelected ? "#0a1414" : color);

      const markerHtml = `
        <div class="atlas-marker ${isSelected ? "active" : ""}" style="--marker-color: ${color}">
          ${isSelected ? `<div class="marker-focus-ring"></div>` : ""}
          <div class="marker-inner">
            <span class="marker-glyph">${glyph}</span>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        html: markerHtml,
      });

      L.marker([site.lat, site.lng], { icon, zIndexOffset: isSelected ? 2000 : 500 })
        .on("click", () => onSelectSite?.(site.id))
        .addTo(layer);
    });
  }, [sites, selectedId, ready, onSelectSite]);

  // Render Vanished Places Markers
  useEffect(() => {
    const L = LRef.current, layer = vanishedLayerRef.current;
    if (!L || !layer) return;
    layer.clearLayers();

    if (!showVanished) return;

    vanishedPlaces.forEach((place) => {
      const isSelected = place.id === selectedVanishedId;
      const glyph = getGlyphSvg("monument", "#de6b42");

      const markerHtml = `
        <div class="atlas-marker vanished-ghost-marker ${isSelected ? "active" : ""}">
          ${isSelected ? `<div class="marker-focus-ring" style="border-color: var(--terracotta-bright);"></div>` : ""}
          <div class="marker-inner">
            <span class="marker-glyph">${glyph}</span>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        html: markerHtml,
      });

      L.marker([place.lat, place.lng], { icon, zIndexOffset: isSelected ? 2200 : 600 })
        .on("click", () => onSelectVanished?.(place))
        .addTo(layer);
    });
  }, [vanishedPlaces, selectedVanishedId, showVanished, ready, onSelectVanished]);

  return (
    <div className="map-container-wrap">
      <div ref={elRef} className="heritage-map-canvas" />
      <div className="carto-grid-overlay" />
      <div className="carto-coordinates">{coords}</div>
    </div>
  );
}

"use client";

// Click-to-drop / drag-to-adjust location picker shared by the editorial and field desks.

import { useEffect, useRef } from "react";

export const HYD_CENTER = [17.385, 78.4867];

export default function PinPicker({ lat, lng, onChange, className, height = 300 }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const LRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const posRef = useRef({ lat, lng });
  posRef.current = { lat, lng };

  const placeMarker = () => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    const { lat: la, lng: ln } = posRef.current;
    const y = Number(la);
    const x = Number(ln);
    if (la === "" || ln === "" || !Number.isFinite(y) || !Number.isFinite(x)) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    if (!markerRef.current) {
      const icon = L.divIcon({ className: "", html: '<div class="pin-picker-pin"></div>', iconSize: [26, 26], iconAnchor: [13, 26] });
      markerRef.current = L.marker([y, x], { draggable: true, icon }).addTo(map);
      markerRef.current.on("dragend", (e) => {
        const p = e.target.getLatLng();
        onChangeRef.current(p.lat, p.lng);
      });
      map.setView([y, x], Math.max(map.getZoom(), 16), { animate: false });
    } else {
      markerRef.current.setLatLng([y, x]);
      if (!map.getBounds().contains([y, x])) map.panTo([y, x], { animate: false });
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !elRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(elRef.current, { zoomControl: true }).setView(HYD_CENTER, 12);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);
      map.on("click", (e) => onChangeRef.current(e.latlng.lat, e.latlng.lng));
      mapRef.current = map;
      placeMarker(); // pin for a site being edited
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(placeMarker, [lat, lng]);

  return (
    <>
      <div ref={elRef} className={className} style={className ? undefined : { height, borderRadius: 10, border: "1px solid var(--line)", overflow: "hidden", zIndex: 0 }} />
      <style>{`
        .pin-picker-pin { width: 26px; height: 26px; background: var(--accent); border: 3px solid #fff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 2px 6px rgba(43, 33, 25, 0.4); }
      `}</style>
    </>
  );
}

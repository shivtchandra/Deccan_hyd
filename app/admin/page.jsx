"use client";

import React, { useState, useEffect, useRef } from "react";
import masterData from "../../data/heritage-master.json";
import { ERAS, TYPES, STATUS, ACCESS, eraColor, eraLabel, typeLabel, statusLabel } from "../../lib/heritage.js";

const EMPTY_SITE = {
  name: "",
  description: "",
  era: "asaf-jahi",
  type: "civic",
  yearBuilt: "",
  area: "",
  status: "unprotected",
  access: "open",
  lat: "",
  lng: "",
};

function PinPicker({ lat, lng, onChange }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const LRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !elRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(elRef.current, { zoomControl: true }).setView([17.385, 78.4867], 12);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);
      map.on("click", (e) => onChangeRef.current(e.latlng.lat, e.latlng.lng));
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    const la = Number(lat);
    const ln = Number(lng);
    if (!L || !map) return;
    if (lat === "" || lng === "" || !Number.isFinite(la) || !Number.isFinite(ln)) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    if (!markerRef.current) {
      const icon = L.divIcon({ className: "", html: '<div class="admin-pin"></div>', iconSize: [24, 24], iconAnchor: [12, 24] });
      markerRef.current = L.marker([la, ln], { draggable: true, icon }).addTo(map);
      markerRef.current.on("dragend", (e) => {
        const p = e.target.getLatLng();
        onChangeRef.current(p.lat, p.lng);
      });
      map.setView([la, ln], Math.max(map.getZoom(), 15));
    } else {
      markerRef.current.setLatLng([la, ln]);
      if (!map.getBounds().contains([la, ln])) map.panTo([la, ln]);
    }
  }, [lat, lng]);

  return <div ref={elRef} style={{ height: 210, width: "100%", borderRadius: 10, border: "1px solid var(--line, #ddd0b8)", overflow: "hidden" }} />;
}

export default function AdminHeritageCMS() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState("sites"); // 'sites' | 'submissions' | 'periods' | 'vanished' | 'maps' | 'trails' | 'sources'

  // Editable local state initialized from master data & dynamic findings
  const [sites, setSites] = useState([]);
  const [sitesSearch, setSitesSearch] = useState("");
  const [periods, setPeriods] = useState(masterData.historical_periods || []);
  const [historicalMaps, setHistoricalMaps] = useState(masterData.historical_maps || []);
  const [vanishedPlaces, setVanishedPlaces] = useState(masterData.vanished_places || []);
  const [trails, setTrails] = useState(masterData.heritage_trails || []);
  const [sources, setSources] = useState(masterData.sources || []);
  const [submissions, setSubmissions] = useState([]);

  // Site Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [formSite, setFormSite] = useState(EMPTY_SITE);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const [editorName, setEditorName] = useState("Editorial Contributor");
  const [notification, setNotification] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const loadSubmissions = (sec) => {
    const bearer = sec || secret;
    if (!bearer) return;
    fetch("/api/admin/submissions?state=pending", {
      headers: { Authorization: `Bearer ${bearer}` },
    })
      .then((r) => (r.ok ? r.json() : { submissions: [] }))
      .then((d) => setSubmissions(d.submissions || []))
      .catch(() => {});
  };

  const loadAllSites = () => {
    Promise.all([
      fetch("/sites-index.json").then((r) => r.json()).catch(() => []),
      fetch("/api/findings").then((r) => (r.ok ? r.json() : { findings: [] })).catch(() => ({ findings: [] })),
    ])
      .then(([base, { findings }]) => {
        const list = Array.isArray(base) ? base : [];
        const ids = new Set(list.map((x) => x.id));
        const combined = [...(findings || []).filter((f) => !ids.has(f.id)), ...list];
        setSites(combined);
      })
      .catch(() => {});
  };

  useEffect(() => {
    const s = sessionStorage.getItem("dhm_editor_key") || "";
    if (s) {
      setSecret(s);
      fetch("/api/admin/auth", { headers: { Authorization: `Bearer ${s}` } })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data && data.ok) {
            setEditorName(data.name || "Editorial Contributor");
            setAuthed(true);
            loadSubmissions(s);
            loadAllSites();
          } else {
            sessionStorage.removeItem("dhm_editor_key");
          }
        })
        .catch(() => {});
    }
    loadAllSites();
  }, []);

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoginError("");
    const key = (secret || "").trim();
    if (!key) {
      setLoginError("Please enter your editorial access key.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (res.status === 401 || !res.ok) {
        setLoginError("Invalid editorial access key. Please check with your administrator.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      sessionStorage.setItem("dhm_editor_key", key);
      setEditorName(data.name || "Editorial Contributor");
      setSecret(key);
      setAuthed(true);
      loadSubmissions(key);
      loadAllSites();
    } catch {
      setLoginError("Network error verifying access key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("dhm_editor_key");
    setSecret("");
    setAuthed(false);
  };

  const handleSubmissionAction = async (id, action) => {
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        showNotification(action === "approve" ? "✓ Submission approved and added to database!" : "Submission rejected.");
        loadAllSites();
      } else {
        showNotification("Could not update submission.");
      }
    } catch {
      showNotification("Network error updating submission.");
    }
  };

  // Open site modal for new site
  const openAddSite = () => {
    setEditingSite(null);
    setFormSite(EMPTY_SITE);
    setShowMapPicker(false);
    setModalOpen(true);
  };

  // Open site modal for editing
  const openEditSite = (site) => {
    setEditingSite(site);
    setFormSite({
      name: site.name || "",
      description: site.story || site.summary || "",
      era: site.era || "asaf-jahi",
      type: site.type || "civic",
      yearBuilt: site.yearBuilt || "",
      area: site.area || "",
      status: site.status || "unprotected",
      access: site.access || "open",
      lat: site.lat !== undefined ? String(site.lat) : "",
      lng: site.lng !== undefined ? String(site.lng) : "",
    });
    setShowMapPicker(false);
    setModalOpen(true);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return showNotification("Geolocation is not supported by your browser.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormSite((prev) => ({
          ...prev,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
        showNotification("📍 Location coordinates captured!");
      },
      () => {
        setLocating(false);
        showNotification("Could not acquire GPS position.");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // Save site to database
  const handleSaveSite = async (e) => {
    e.preventDefault();
    if (!formSite.name.trim()) return showNotification("Please enter a site name.");
    if (!formSite.lat || !formSite.lng) return showNotification("Please provide Latitude & Longitude.");

    setSaving(true);
    const fd = new FormData();
    Object.entries(formSite).forEach(([k, v]) => fd.append(k, v));

    try {
      const isEdit = !!editingSite?.id;
      const isFinding = isEdit && editingSite.id.startsWith("field-");
      const url = isFinding ? `/api/field/findings/${editingSite.id}` : "/api/field/findings";

      const res = await fetch(url, {
        method: isFinding ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${secret}` },
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.finding) {
        if (isEdit) {
          setSites((prev) => prev.map((s) => (s.id === data.finding.id ? { ...s, ...data.finding } : s)));
          showNotification(`✓ Updated "${data.finding.name}"`);
        } else {
          setSites((prev) => [data.finding, ...prev]);
          showNotification(`✓ Added "${data.finding.name}" — live on the public atlas!`);
        }
        setModalOpen(false);
      } else {
        // Fallback for static demo / local update
        if (isEdit) {
          setSites((prev) => prev.map((s) => (s.id === editingSite.id ? { ...s, ...formSite } : s)));
          showNotification(`✓ Updated "${formSite.name}"`);
          setModalOpen(false);
        } else {
          const newDummy = {
            id: `site-${Date.now().toString(36)}`,
            ...formSite,
            lat: Number(formSite.lat),
            lng: Number(formSite.lng),
          };
          setSites((prev) => [newDummy, ...prev]);
          showNotification(`✓ Added "${newDummy.name}"`);
          setModalOpen(false);
        }
      }
    } catch {
      showNotification("Network error saving site.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSite = async (site) => {
    if (!window.confirm(`Are you sure you want to remove "${site.name}"?`)) return;
    try {
      if (site.id?.startsWith("field-")) {
        await fetch(`/api/field/findings/${site.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${secret}`,
          },
          body: JSON.stringify({ hidden: true }),
        });
      }
      setSites((prev) => prev.filter((s) => s.id !== site.id));
      showNotification(`Removed "${site.name}"`);
    } catch {
      showNotification("Could not remove site.");
    }
  };

  const filteredSites = sites.filter((s) => {
    if (!sitesSearch.trim()) return true;
    const q = sitesSearch.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.era && s.era.toLowerCase().includes(q)) ||
      (s.type && s.type.toLowerCase().includes(q)) ||
      (s.area && s.area.toLowerCase().includes(q))
    );
  });

  // Login View with the exact warm map paper palette
  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--paper, #ece1cd)",
          color: "var(--ink, #2b2119)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            width: 420,
            maxWidth: "100%",
            background: "var(--cream-hi, #fdf9f0)",
            padding: "36px 32px",
            borderRadius: 18,
            border: "1px solid var(--line, #ddd0b8)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            boxShadow: "var(--e2, 0 6px 18px rgba(43, 33, 25, 0.09))",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src="/brand/charminar-logo.png"
              alt="Logo"
              style={{
                width: 44,
                height: 44,
                objectFit: "contain",
                borderRadius: 10,
                background: "#FAF6EE",
                padding: 4,
                border: "1px solid var(--line, #ddd0b8)",
              }}
            />
            <div>
              <div style={{ fontFamily: "var(--font-serif, Fraunces, Georgia, serif)", fontSize: 22, color: "var(--ink, #2b2119)", lineHeight: 1.2, fontWeight: 600 }}>
                Deccan Heritage
              </div>
              <div style={{ fontSize: 11.5, color: "var(--accent-deep, #8b3a1a)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
                Editorial Admin CMS
              </div>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-soft, #6b5d4c)", lineHeight: 1.55 }}>
            Authorized portal for editorial collaborators. Enter your access key to add and curate heritage landmarks, review submissions, and manage atlas content.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink, #2b2119)" }}>
              Editorial Access Key
            </label>
            <input
              type="password"
              placeholder="Enter your editorial access key"
              value={secret}
              onChange={(e) => {
                setSecret(e.target.value);
                setLoginError("");
              }}
              autoFocus
              required
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: "#fff",
                border: "1px solid var(--line, #ddd0b8)",
                color: "var(--ink, #2b2119)",
                fontSize: 14,
                outline: "none",
                fontFamily: "JetBrains Mono, monospace",
              }}
            />
          </div>

          {loginError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: "var(--accent-wash, #f6e2d6)",
                border: "1px solid var(--accent, #c2603a)",
                color: "var(--danger, #b23b2e)",
                fontSize: 12.5,
                lineHeight: 1.4,
              }}
            >
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 20px",
              borderRadius: 999,
              background: "var(--accent, #c2603a)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 2px 8px rgba(194, 96, 58, 0.35)",
            }}
          >
            {loading ? "Verifying..." : "Access Editorial Desk →"}
          </button>
        </form>
      </div>
    );
  }

  // Authenticated Admin CMS Dashboard with the exact map warm color tone
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--paper, #ece1cd)",
        color: "var(--ink, #2b2119)",
        padding: "24px 32px 64px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--line, #ddd0b8)",
          paddingBottom: 18,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src="/brand/charminar-logo.png"
            alt="Logo"
            style={{
              width: 42,
              height: 42,
              objectFit: "contain",
              borderRadius: 10,
              background: "#FAF6EE",
              padding: 4,
              border: "1px solid var(--line, #ddd0b8)",
            }}
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "var(--accent-deep, #8b3a1a)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                Editorial Desk
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "var(--butter, #f3e7cc)",
                  color: "var(--ink, #2b2119)",
                  fontWeight: 600,
                  border: "1px solid var(--line, #ddd0b8)",
                }}
              >
                {editorName}
              </span>
            </div>
            <h1 style={{ margin: "2px 0 0 0", fontSize: 24, fontFamily: "var(--font-serif, Fraunces, Georgia, serif)", color: "var(--ink, #2b2119)" }}>
              Deccan Heritage Content Desk
            </h1>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href="/"
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid var(--line, #ddd0b8)",
              background: "var(--cream-hi, #fdf9f0)",
              color: "var(--ink, #2b2119)",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            ← View Public Atlas
          </a>
          <button
            onClick={handleSignOut}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              background: "transparent",
              border: "1px solid var(--line, #ddd0b8)",
              color: "var(--ink-soft, #6b5d4c)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Notification banner */}
      {notification && (
        <div
          style={{
            background: "var(--cream-hi, #fdf9f0)",
            color: "var(--accent-deep, #8b3a1a)",
            border: "1px solid var(--accent, #c2603a)",
            padding: "10px 18px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 13.5,
            boxShadow: "var(--e1)",
          }}
        >
          {notification}
        </div>
      )}

      {/* CMS Navigation Tabs */}
      <nav style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--line, #ddd0b8)", paddingBottom: 10, overflowX: "auto" }}>
        {[
          { id: "sites", label: `Heritage Sites (${sites.length})` },
          { id: "submissions", label: `Community Submissions (${submissions.length})` },
          { id: "periods", label: `Historical Periods (${periods.length})` },
          { id: "vanished", label: `Vanished Places (${vanishedPlaces.length})` },
          { id: "maps", label: `Historical Maps (${historicalMaps.length})` },
          { id: "trails", label: `Curated Trails (${trails.length})` },
          { id: "sources", label: `Sources & Archives (${sources.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid",
              borderColor: activeTab === tab.id ? "var(--ink, #2b2119)" : "var(--line, #ddd0b8)",
              background: activeTab === tab.id ? "var(--ink, #2b2119)" : "var(--cream-hi, #fdf9f0)",
              color: activeTab === tab.id ? "#fff" : "var(--ink-soft, #6b5d4c)",
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* TAB CONTENT: SITES */}
      {activeTab === "sites" && (
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 20, margin: 0, fontFamily: "var(--font-serif, Fraunces, Georgia, serif)", color: "var(--ink, #2b2119)" }}>
                Heritage Monuments & Structures
              </h2>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--ink-soft, #6b5d4c)" }}>
                Full inventory of active landmarks shown on the Deccan Heritage Map.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search monuments…"
                value={sitesSearch}
                onChange={(e) => setSitesSearch(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid var(--line, #ddd0b8)",
                  background: "#fff",
                  fontSize: 13,
                  outline: "none",
                  width: 220,
                  color: "var(--ink, #2b2119)",
                }}
              />
              <button
                onClick={openAddSite}
                style={{
                  padding: "9px 18px",
                  borderRadius: 999,
                  background: "var(--accent, #c2603a)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "0 2px 6px rgba(194, 96, 58, 0.3)",
                }}
              >
                + Add Heritage Site
              </button>
            </div>
          </div>

          <div style={{ border: "1px solid var(--line, #ddd0b8)", borderRadius: 14, overflow: "hidden", background: "var(--cream-hi, #fdf9f0)", boxShadow: "var(--e1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--butter, #f3e7cc)", textAlign: "left", color: "var(--ink, #2b2119)", borderBottom: "1px solid var(--line, #ddd0b8)" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Monument Name</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Era</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Type</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Coordinates</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Protection Status</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map((site) => {
                  const eCol = eraColor(site.era);
                  return (
                    <tr key={site.id} style={{ borderBottom: "1px solid var(--line, #ddd0b8)" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--ink, #2b2119)" }}>
                        {site.name}
                        {site.area && <span style={{ marginLeft: 6, fontSize: 11, color: "var(--muted, #9a8c78)", fontWeight: 400 }}>({site.area})</span>}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: `${eCol}18`,
                            color: eCol,
                            fontSize: 11,
                            fontWeight: 700,
                            border: `1px solid ${eCol}33`,
                          }}
                        >
                          {eraLabel(site.era)}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textTransform: "capitalize", color: "var(--ink-soft, #6b5d4c)" }}>
                        {typeLabel(site.type)}
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--ink-soft, #6b5d4c)" }}>
                        {Number(site.lat).toFixed(4)}, {Number(site.lng).toFixed(4)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "rgba(43, 33, 25, 0.06)",
                            color: "var(--ink, #2b2119)",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {statusLabel(site.status)}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <button
                          onClick={() => openEditSite(site)}
                          style={{
                            color: "var(--accent-deep, #8b3a1a)",
                            marginRight: 12,
                            fontSize: 12.5,
                            fontWeight: 700,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSite(site)}
                          style={{
                            color: "var(--danger, #b23b2e)",
                            fontSize: 12.5,
                            fontWeight: 600,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB CONTENT: SUBMISSIONS */}
      {activeTab === "submissions" && (
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: 20, margin: 0, fontFamily: "var(--font-serif, Fraunces, Georgia, serif)", color: "var(--ink, #2b2119)" }}>
                Community Heritage Submissions
              </h2>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--ink-soft, #6b5d4c)" }}>
                Suggestions submitted by atlas visitors awaiting editorial review.
              </p>
            </div>
            <button
              onClick={() => loadSubmissions()}
              style={{ padding: "8px 16px", borderRadius: 999, background: "var(--cream-hi, #fdf9f0)", border: "1px solid var(--line, #ddd0b8)", color: "var(--ink, #2b2119)", fontSize: 13, cursor: "pointer", fontWeight: 600 }}
            >
              ↻ Refresh
            </button>
          </div>

          {submissions.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", background: "var(--cream-hi, #fdf9f0)", borderRadius: 14, border: "1px solid var(--line, #ddd0b8)", color: "var(--ink-soft, #6b5d4c)" }}>
              No pending community submissions at this time.
            </div>
          ) : (
            <div style={{ border: "1px solid var(--line, #ddd0b8)", borderRadius: 14, overflow: "hidden", background: "var(--cream-hi, #fdf9f0)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "var(--butter, #f3e7cc)", textAlign: "left", color: "var(--ink, #2b2119)", borderBottom: "1px solid var(--line, #ddd0b8)" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Suggested Site</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Era & Type</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Coordinates</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Notes / Description</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: "1px solid var(--line, #ddd0b8)" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--ink, #2b2119)" }}>{sub.name}</td>
                      <td style={{ padding: "12px 16px", color: "var(--ink-soft, #6b5d4c)" }}>
                        <span>{eraLabel(sub.era)}</span> · <span>{typeLabel(sub.type)}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--ink-soft, #6b5d4c)" }}>
                        {Number(sub.lat).toFixed(4)}, {Number(sub.lng).toFixed(4)}
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--ink-soft, #6b5d4c)", maxWidth: 320, fontSize: 12.5 }}>
                        {sub.note || "No notes provided"}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <button
                          onClick={() => handleSubmissionAction(sub.id, "approve")}
                          style={{ padding: "5px 12px", borderRadius: 6, background: "var(--accent, #c2603a)", color: "#fff", fontWeight: 700, fontSize: 12, marginRight: 8, cursor: "pointer", border: "none" }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleSubmissionAction(sub.id, "reject")}
                          style={{ padding: "5px 12px", borderRadius: 6, background: "var(--accent-wash, #f6e2d6)", color: "var(--danger, #b23b2e)", border: "1px solid var(--line, #ddd0b8)", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB CONTENT: PERIODS */}
      {activeTab === "periods" && (
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontSize: 20, margin: 0, fontFamily: "var(--font-serif, Fraunces, Georgia, serif)", color: "var(--ink, #2b2119)" }}>
            Historical Periods & Timeline Eras
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {periods.map((period) => (
              <div
                key={period.id}
                style={{
                  background: "var(--cream-hi, #fdf9f0)",
                  border: "1px solid var(--line, #ddd0b8)",
                  borderRadius: 14,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  borderLeft: `5px solid ${period.accent_color || "var(--accent)"}`,
                  boxShadow: "var(--e1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--accent-deep, #8b3a1a)", fontWeight: 700 }}>
                    {period.start_year} — {period.end_year}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--muted, #9a8c78)", fontWeight: 600 }}>{period.short_title}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontFamily: "var(--font-serif, Fraunces, Georgia, serif)", color: "var(--ink, #2b2119)" }}>{period.name}</h3>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--ink-soft, #6b5d4c)" }}>
                  {period.description}
                </p>
                <div style={{ fontSize: 11.5, color: "var(--muted, #9a8c78)", paddingTop: 8, borderTop: "1px solid var(--line, #ddd0b8)" }}>
                  Dynasty / Authority: {period.ruler_dynasty}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB CONTENT: VANISHED PLACES */}
      {activeTab === "vanished" && (
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontSize: 20, margin: 0, fontFamily: "var(--font-serif, Fraunces, Georgia, serif)", color: "var(--ink, #2b2119)" }}>
            Vanished / Changed Places ("What Used to Be Here?")
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
            {vanishedPlaces.map((v) => (
              <div
                key={v.id}
                style={{
                  background: "var(--cream-hi, #fdf9f0)",
                  border: "1px solid var(--line, #ddd0b8)",
                  borderRadius: 14,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  boxShadow: "var(--e1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11.5, color: "var(--accent-deep, #8b3a1a)", fontWeight: 700 }}>
                    {v.start_year} — {v.end_year}
                  </span>
                  <span style={{ fontSize: 11.5, color: "var(--muted, #9a8c78)" }}>{v.current_location}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 17, color: "var(--ink, #2b2119)" }}>{v.name}</h3>

                <div style={{ background: "var(--butter, #f3e7cc)", padding: 12, borderRadius: 10, fontSize: 12.5, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div>
                    <span style={{ color: "var(--accent-deep, #8b3a1a)", fontWeight: 700 }}>FORMERLY: </span>
                    <span style={{ color: "var(--ink, #2b2119)" }}>{v.what_existed}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--ink-soft, #6b5d4c)", fontWeight: 700 }}>TODAY: </span>
                    <span style={{ color: "var(--ink, #2b2119)" }}>{v.what_exists_now}</span>
                  </div>
                </div>

                <div style={{ fontSize: 12.5, color: "var(--ink-soft, #6b5d4c)" }}>
                  <b>Reason for Change:</b> {v.reason_for_change}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB CONTENT: HISTORICAL MAPS */}
      {activeTab === "maps" && (
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontSize: 20, margin: 0, fontFamily: "var(--font-serif, Fraunces, Georgia, serif)", color: "var(--ink, #2b2119)" }}>
            Georeferenced Historical Map Overlays
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {historicalMaps.map((map) => (
              <div
                key={map.id}
                style={{
                  background: "var(--cream-hi, #fdf9f0)",
                  border: "1px solid var(--line, #ddd0b8)",
                  borderRadius: 14,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  boxShadow: "var(--e1)",
                }}
              >
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--accent-deep, #8b3a1a)", fontWeight: 700 }}>
                  YEAR: {map.year}
                </span>
                <h3 style={{ margin: 0, fontSize: 17, color: "var(--ink, #2b2119)" }}>{map.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: "var(--ink-soft, #6b5d4c)", lineHeight: 1.5 }}>
                  {map.description}
                </p>
                <div style={{ fontSize: 11.5, color: "var(--muted, #9a8c78)", paddingTop: 8, borderTop: "1px solid var(--line, #ddd0b8)" }}>
                  Archive: {map.source_archive} · {map.license}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB CONTENT: TRAILS */}
      {activeTab === "trails" && (
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontSize: 20, margin: 0, fontFamily: "var(--font-serif, Fraunces, Georgia, serif)", color: "var(--ink, #2b2119)" }}>
            Curated Documentary Trails
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {trails.map((trail) => (
              <div
                key={trail.id}
                style={{
                  background: "var(--cream-hi, #fdf9f0)",
                  border: "1px solid var(--line, #ddd0b8)",
                  borderRadius: 14,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  boxShadow: "var(--e1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ margin: 0, fontSize: 19, fontFamily: "var(--font-serif, Fraunces, Georgia, serif)", color: "var(--ink, #2b2119)" }}>{trail.title}</h3>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--accent-deep, #8b3a1a)", fontWeight: 600 }}>
                    {trail.distance_km} km · {trail.stops.length} Stops · ~{trail.estimated_duration_min} mins
                  </span>
                </div>
                <div style={{ fontSize: 13.5, color: "var(--ink-soft, #6b5d4c)" }}>{trail.subtitle}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {trail.stops.map((st, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 8,
                        background: "var(--butter, #f3e7cc)",
                        fontSize: 12,
                        fontFamily: "JetBrains Mono, monospace",
                        color: "var(--ink, #2b2119)",
                        fontWeight: 600,
                      }}
                    >
                      {i + 1}. {st.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB CONTENT: SOURCES */}
      {activeTab === "sources" && (
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontSize: 20, margin: 0, fontFamily: "var(--font-serif, Fraunces, Georgia, serif)", color: "var(--ink, #2b2119)" }}>
            Verified Sources & Bibliographic Archives
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {sources.map((src) => (
              <div
                key={src.id}
                style={{
                  background: "var(--cream-hi, #fdf9f0)",
                  border: "1px solid var(--line, #ddd0b8)",
                  borderRadius: 14,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  boxShadow: "var(--e1)",
                }}
              >
                <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "var(--accent-deep, #8b3a1a)", textTransform: "uppercase", fontWeight: 700 }}>
                  {src.source_type}
                </span>
                <h3 style={{ margin: 0, fontSize: 17, color: "var(--ink, #2b2119)" }}>{src.title}</h3>
                <div style={{ fontSize: 13, color: "var(--ink-soft, #6b5d4c)" }}>
                  Publisher: {src.publisher}
                </div>
                {src.notes && (
                  <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted, #9a8c78)" }}>
                    {src.notes}
                  </p>
                )}
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12.5, color: "var(--accent, #c2603a)", textDecoration: "underline", marginTop: 4, fontWeight: 600 }}
                >
                  Visit Digital Archive ↗
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT SITE MODAL — Real Form That Saves to Atlas */}
      {/* ========================================================= */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(43, 33, 25, 0.55)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            style={{
              background: "var(--cream-hi, #fdf9f0)",
              border: "1px solid var(--line, #ddd0b8)",
              borderRadius: 18,
              width: 680,
              maxWidth: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "var(--e3, 0 16px 40px rgba(43, 33, 25, 0.16))",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Head */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--line, #ddd0b8)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontFamily: "var(--font-serif, Fraunces, Georgia, serif)", color: "var(--ink, #2b2119)" }}>
                  {editingSite ? `Edit Monument: ${editingSite.name}` : "Add New Heritage Site"}
                </h3>
                <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--ink-soft, #6b5d4c)" }}>
                  Saves directly into the Deccan Heritage inventory and goes live immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer",
                  color: "var(--ink-soft, #6b5d4c)",
                  padding: 4,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveSite} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink, #2b2119)", marginBottom: 6 }}>
                  Monument / Site Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khairtabad Mosque"
                  value={formSite.name}
                  onChange={(e) => setFormSite({ ...formSite, name: e.target.value })}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--line, #ddd0b8)",
                    background: "#fff",
                    fontSize: 14,
                    color: "var(--ink, #2b2119)",
                    outline: "none",
                  }}
                />
              </div>

              {/* Row: Era & Type */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink, #2b2119)", marginBottom: 6 }}>
                    Historical Era *
                  </label>
                  <select
                    value={formSite.era}
                    onChange={(e) => setFormSite({ ...formSite, era: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--line, #ddd0b8)",
                      background: "#fff",
                      fontSize: 14,
                      color: "var(--ink, #2b2119)",
                    }}
                  >
                    {Object.entries(ERAS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink, #2b2119)", marginBottom: 6 }}>
                    Structure Type *
                  </label>
                  <select
                    value={formSite.type}
                    onChange={(e) => setFormSite({ ...formSite, type: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--line, #ddd0b8)",
                      background: "#fff",
                      fontSize: 14,
                      color: "var(--ink, #2b2119)",
                    }}
                  >
                    {Object.entries(TYPES).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row: Year & Area */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink, #2b2119)", marginBottom: 6 }}>
                    Year Built / Period
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1591 or c. 1780"
                    value={formSite.yearBuilt}
                    onChange={(e) => setFormSite({ ...formSite, yearBuilt: e.target.value })}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--line, #ddd0b8)",
                      background: "#fff",
                      fontSize: 14,
                      color: "var(--ink, #2b2119)",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink, #2b2119)", marginBottom: 6 }}>
                    Area / Locality
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Karwan, Charminar"
                    value={formSite.area}
                    onChange={(e) => setFormSite({ ...formSite, area: e.target.value })}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--line, #ddd0b8)",
                      background: "#fff",
                      fontSize: 14,
                      color: "var(--ink, #2b2119)",
                    }}
                  />
                </div>
              </div>

              {/* Row: Status & Access */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink, #2b2119)", marginBottom: 6 }}>
                    Protection Status
                  </label>
                  <select
                    value={formSite.status}
                    onChange={(e) => setFormSite({ ...formSite, status: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--line, #ddd0b8)",
                      background: "#fff",
                      fontSize: 14,
                      color: "var(--ink, #2b2119)",
                    }}
                  >
                    {Object.entries(STATUS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink, #2b2119)", marginBottom: 6 }}>
                    Public Access Level
                  </label>
                  <select
                    value={formSite.access}
                    onChange={(e) => setFormSite({ ...formSite, access: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--line, #ddd0b8)",
                      background: "#fff",
                      fontSize: 14,
                      color: "var(--ink, #2b2119)",
                    }}
                  >
                    {Object.entries(ACCESS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location Coordinates & Pin Picker */}
              <div style={{ border: "1px solid var(--line, #ddd0b8)", borderRadius: 12, padding: 14, background: "var(--cream, #f5efe3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink, #2b2119)" }}>Coordinates (Lat, Lng) *</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={useCurrentLocation}
                      disabled={locating}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: "1px solid var(--line, #ddd0b8)",
                        background: "#fff",
                        fontSize: 11.5,
                        color: "var(--ink, #2b2119)",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {locating ? "Locating…" : "📍 Use GPS"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMapPicker(!showMapPicker)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: "1px solid var(--line, #ddd0b8)",
                        background: showMapPicker ? "var(--ink, #2b2119)" : "#fff",
                        color: showMapPicker ? "#fff" : "var(--ink, #2b2119)",
                        fontSize: 11.5,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {showMapPicker ? "Hide Map" : "🗺️ Pick on Map"}
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted, #9a8c78)", display: "block", marginBottom: 3 }}>Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="e.g. 17.3616"
                      value={formSite.lat}
                      onChange={(e) => setFormSite({ ...formSite, lat: e.target.value })}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid var(--line, #ddd0b8)",
                        background: "#fff",
                        fontSize: 13,
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted, #9a8c78)", display: "block", marginBottom: 3 }}>Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="e.g. 78.4747"
                      value={formSite.lng}
                      onChange={(e) => setFormSite({ ...formSite, lng: e.target.value })}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid var(--line, #ddd0b8)",
                        background: "#fff",
                        fontSize: 13,
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    />
                  </div>
                </div>

                {showMapPicker && (
                  <div style={{ marginTop: 12 }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: 11.5, color: "var(--ink-soft, #6b5d4c)" }}>
                      Click on the map or drag the pin to set exact coordinates:
                    </p>
                    <PinPicker
                      lat={formSite.lat}
                      lng={formSite.lng}
                      onChange={(newLat, newLng) => {
                        setFormSite((prev) => ({
                          ...prev,
                          lat: newLat.toFixed(6),
                          lng: newLng.toFixed(6),
                        }));
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Description / Story */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink, #2b2119)", marginBottom: 6 }}>
                  Historical Narrative & Architecture Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Context, founder, architectural details, current condition, and significance…"
                  value={formSite.description}
                  onChange={(e) => setFormSite({ ...formSite, description: e.target.value })}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--line, #ddd0b8)",
                    background: "#fff",
                    fontSize: 13.5,
                    color: "var(--ink, #2b2119)",
                    lineHeight: 1.5,
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 999,
                    border: "1px solid var(--line, #ddd0b8)",
                    background: "transparent",
                    color: "var(--ink-soft, #6b5d4c)",
                    fontSize: 13.5,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 999,
                    border: "none",
                    background: "var(--accent, #c2603a)",
                    color: "#fff",
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(194, 96, 58, 0.35)",
                  }}
                >
                  {saving ? "Saving…" : editingSite ? "Update Site" : "Save Site to Atlas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scoped CSS for map pin */}
      <style>{`
        .admin-pin {
          width: 24px;
          height: 24px;
          background: var(--accent, #c2603a);
          border: 3px solid #fff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 6px rgba(43, 33, 25, 0.4);
        }
      `}</style>
    </div>
  );
}

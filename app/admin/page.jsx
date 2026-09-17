"use client";

import React, { useState, useEffect } from "react";
import masterData from "../../data/heritage-master.json";

export default function AdminHeritageCMS() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState("sites"); // 'sites' | 'periods' | 'maps' | 'vanished' | 'trails' | 'sources'

  // Editable local state initialized from master data
  const [sites, setSites] = useState([]);
  const [periods, setPeriods] = useState(masterData.historical_periods || []);
  const [historicalMaps, setHistoricalMaps] = useState(masterData.historical_maps || []);
  const [vanishedPlaces, setVanishedPlaces] = useState(masterData.vanished_places || []);
  const [trails, setTrails] = useState(masterData.heritage_trails || []);
  const [sources, setSources] = useState(masterData.sources || []);
  const [submissions, setSubmissions] = useState([]);

  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const loadSubmissions = (sec) => {
    fetch("/api/admin/submissions?state=pending", {
      headers: { Authorization: `Bearer ${sec || secret || "mapping-hyd-admin"}` },
    })
      .then((r) => (r.ok ? r.json() : { submissions: [] }))
      .then((d) => setSubmissions(d.submissions || []))
      .catch(() => {});
  };

  useEffect(() => {
    const s = sessionStorage.getItem("dhm_admin") || "";
    if (s) {
      setSecret(s);
      setAuthed(true);
      loadSubmissions(s);
    }

    fetch("/sites-index.json")
      .then((r) => r.json())
      .then((data) => setSites(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (secret) {
      sessionStorage.setItem("dhm_admin", secret);
      setAuthed(true);
      loadSubmissions(secret);
    }
  };

  const handleSubmissionAction = async (id, action) => {
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret || "mapping-hyd-admin"}`,
        },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        showNotification(action === "approve" ? "Submission approved and added to database!" : "Submission rejected.");
      } else {
        showNotification("Could not update submission.");
      }
    } catch {
      showNotification("Network error updating submission.");
    }
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--petrol-900)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <form onSubmit={handleLogin} style={{ width: 380, background: "var(--petrol-800)", padding: 32, borderRadius: 16, border: "1px solid var(--petrol-border)", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/brand/charminar-logo.png" alt="Logo" style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 8, background: "#FAF6EE", padding: 2 }} />
            <div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: 20, color: "var(--cream)", lineHeight: 1.2 }}>
                Deccan Heritage
              </div>
              <div style={{ fontSize: 11.5, color: "var(--amber)", fontFamily: "JetBrains Mono" }}>
                Editorial Admin CMS
              </div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--cream-dim)", lineHeight: 1.5 }}>
            Enter your administrative key to manage heritage monuments, historical periods, and review community submissions.
          </p>
          <input
            type="password"
            placeholder="Enter ADMIN_SECRET"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 8, background: "var(--petrol-700)", border: "1px solid var(--petrol-border)", color: "var(--cream)", outline: "none" }}
          />
          <button type="submit" style={{ padding: "10px 16px", borderRadius: 999, background: "var(--amber)", color: "var(--petrol-900)", fontWeight: 600, cursor: "pointer" }}>
            Enter Heritage CMS →
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--petrol-900)", color: "var(--cream)", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--petrol-border)", paddingBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src="/brand/charminar-logo.png" alt="Logo" style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 8, background: "#FAF6EE", padding: 2 }} />
          <div>
            <div style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Heritage Editorial Management System
            </div>
            <h1 style={{ margin: "2px 0 0 0", fontSize: 24, fontFamily: "Fraunces, serif" }}>
              Deccan Heritage CMS Dashboard
            </h1>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ padding: "8px 16px", borderRadius: 999, border: "1px solid var(--petrol-border)", color: "var(--cream)", textDecoration: "none", fontSize: 13 }}>
            ← View Public Atlas
          </a>
          <button
            onClick={() => {
              sessionStorage.removeItem("dhm_admin");
              setAuthed(false);
            }}
            style={{ padding: "8px 16px", borderRadius: 999, background: "rgba(245,239,227,0.1)", fontSize: 13 }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {notification && (
        <div style={{ background: "var(--amber)", color: "var(--petrol-900)", padding: "10px 16px", borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
          {notification}
        </div>
      )}

      {/* CMS Navigation Tabs */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--petrol-border)", paddingBottom: 8 }}>
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
              background: activeTab === tab.id ? "var(--cream)" : "transparent",
              color: activeTab === tab.id ? "var(--petrol-900)" : "var(--cream-dim)",
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: 13,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: SITES */}
      {activeTab === "sites" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 18, margin: 0, fontFamily: "Fraunces, serif" }}>Heritage Monuments & Structures</h2>
            <button
              onClick={() => showNotification("New site template ready. Edit and save.")}
              style={{ padding: "8px 16px", borderRadius: 999, background: "var(--amber)", color: "var(--petrol-900)", fontWeight: 600, fontSize: 13 }}
            >
              + Add Heritage Site
            </button>
          </div>

          <div style={{ border: "1px solid var(--petrol-border)", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--petrol-800)", textAlign: "left", color: "var(--cream-dim)", borderBottom: "1px solid var(--petrol-border)" }}>
                  <th style={{ padding: "12px 16px" }}>Monument Name</th>
                  <th style={{ padding: "12px 16px" }}>Era & Year</th>
                  <th style={{ padding: "12px 16px" }}>Type</th>
                  <th style={{ padding: "12px 16px" }}>Coordinates</th>
                  <th style={{ padding: "12px 16px" }}>Status</th>
                  <th style={{ padding: "12px 16px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site.id} style={{ borderBottom: "1px solid rgba(245,239,227,0.06)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{site.name}</td>
                    <td style={{ padding: "12px 16px", color: "var(--cream-dim)" }}>{site.era}</td>
                    <td style={{ padding: "12px 16px", textTransform: "capitalize" }}>{site.type}</td>
                    <td style={{ padding: "12px 16px", fontFamily: "JetBrains Mono", fontSize: 12 }}>
                      {Number(site.lat).toFixed(4)}, {Number(site.lng).toFixed(4)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: 6, background: "rgba(42,157,143,0.2)", color: "#2a9d8f", fontSize: 11, fontWeight: 600 }}>
                        {site.status || "Published"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        onClick={() => showNotification(`Editing ${site.name}`)}
                        style={{ color: "var(--amber)", marginRight: 10, fontSize: 12 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSites(sites.filter((s) => s.id !== site.id));
                          showNotification(`Removed ${site.name}`);
                        }}
                        style={{ color: "#de6b42", fontSize: 12 }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PERIODS */}
      {activeTab === "periods" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 18, margin: 0, fontFamily: "Fraunces, serif" }}>Historical Periods & Timeline Eras</h2>
            <button
              onClick={() => showNotification("Period creator opened.")}
              style={{ padding: "8px 16px", borderRadius: 999, background: "var(--amber)", color: "var(--petrol-900)", fontWeight: 600, fontSize: 13 }}
            >
              + Add Historical Period
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {periods.map((period) => (
              <div
                key={period.id}
                style={{
                  background: "var(--petrol-800)",
                  border: "1px solid var(--petrol-border)",
                  borderRadius: 12,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  borderLeft: `4px solid ${period.accent_color || "var(--amber)"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--amber)", fontWeight: 700 }}>
                    {period.start_year} — {period.end_year}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--cream-dim)" }}>{period.short_title}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 17, fontFamily: "Fraunces, serif" }}>{period.name}</h3>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.45, color: "var(--cream-dim)" }}>
                  {period.description}
                </p>
                <div style={{ fontSize: 11.5, color: "var(--cream-dim)", opacity: 0.75, paddingTop: 6, borderTop: "1px solid var(--petrol-border)" }}>
                  Dynasty / Authority: {period.ruler_dynasty}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: VANISHED PLACES */}
      {activeTab === "vanished" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 18, margin: 0, fontFamily: "Fraunces, serif" }}>Vanished / Changed Places ("What Used to Be Here?")</h2>
            <button
              onClick={() => showNotification("Vanished place creator opened.")}
              style={{ padding: "8px 16px", borderRadius: 999, background: "var(--terracotta)", color: "var(--cream-hi)", fontWeight: 600, fontSize: 13 }}
            >
              + Add Vanished Place
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
            {vanishedPlaces.map((v) => (
              <div
                key={v.id}
                style={{
                  background: "var(--petrol-800)",
                  border: "1px solid var(--petrol-border)",
                  borderRadius: 12,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--terracotta-bright)", fontWeight: 700 }}>
                    {v.start_year} — {v.end_year}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--cream-dim)" }}>{v.current_location}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 17, color: "var(--cream)" }}>{v.name}</h3>

                <div style={{ background: "rgba(22,42,42,0.5)", padding: 10, borderRadius: 8, fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div>
                    <span style={{ color: "var(--terracotta-bright)", fontWeight: 700 }}>FORMERLY: </span>
                    <span style={{ color: "var(--cream)" }}>{v.what_existed}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--amber)", fontWeight: 700 }}>TODAY: </span>
                    <span style={{ color: "var(--cream-dim)" }}>{v.what_exists_now}</span>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: "var(--cream-dim)" }}>
                  <b>Reason for Change:</b> {v.reason_for_change}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HISTORICAL MAPS */}
      {activeTab === "maps" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 18, margin: 0, fontFamily: "Fraunces, serif" }}>Georeferenced Historical Map Overlays</h2>
            <button
              onClick={() => showNotification("Map overlay creator opened.")}
              style={{ padding: "8px 16px", borderRadius: 999, background: "var(--amber)", color: "var(--petrol-900)", fontWeight: 600, fontSize: 13 }}
            >
              + Register Historical Map
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {historicalMaps.map((map) => (
              <div
                key={map.id}
                style={{
                  background: "var(--petrol-800)",
                  border: "1px solid var(--petrol-border)",
                  borderRadius: 12,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--amber)", fontWeight: 700 }}>
                  YEAR: {map.year}
                </span>
                <h3 style={{ margin: 0, fontSize: 16 }}>{map.title}</h3>
                <p style={{ margin: 0, fontSize: 12.5, color: "var(--cream-dim)", lineHeight: 1.4 }}>
                  {map.description}
                </p>
                <div style={{ fontSize: 11, color: "var(--cream-dim)", opacity: 0.8, paddingTop: 6, borderTop: "1px solid var(--petrol-border)" }}>
                  Archive: {map.source_archive} · {map.license}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TRAILS */}
      {activeTab === "trails" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 18, margin: 0, fontFamily: "Fraunces, serif" }}>Curated Documentary Trails</h2>
            <button
              onClick={() => showNotification("Trail builder opened.")}
              style={{ padding: "8px 16px", borderRadius: 999, background: "var(--amber)", color: "var(--petrol-900)", fontWeight: 600, fontSize: 13 }}
            >
              + Create Heritage Trail
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {trails.map((trail) => (
              <div
                key={trail.id}
                style={{
                  background: "var(--petrol-800)",
                  border: "1px solid var(--petrol-border)",
                  borderRadius: 12,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontFamily: "Fraunces, serif" }}>{trail.title}</h3>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--amber)" }}>
                    {trail.distance_km} km · {trail.stops.length} Stops · ~{trail.estimated_duration_min} mins
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "var(--cream-dim)" }}>{trail.subtitle}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {trail.stops.map((st, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "rgba(245,239,227,0.08)",
                        fontSize: 12,
                        fontFamily: "JetBrains Mono",
                      }}
                    >
                      {i + 1}. {st.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SOURCES */}
      {activeTab === "sources" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 18, margin: 0, fontFamily: "Fraunces, serif" }}>Verified Sources & Bibliographic Archives</h2>
            <button
              onClick={() => showNotification("Source creator opened.")}
              style={{ padding: "8px 16px", borderRadius: 999, background: "var(--amber)", color: "var(--petrol-900)", fontWeight: 600, fontSize: 13 }}
            >
              + Register Archival Source
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {sources.map((src) => (
              <div
                key={src.id}
                style={{
                  background: "var(--petrol-800)",
                  border: "1px solid var(--petrol-border)",
                  borderRadius: 12,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "var(--amber)", textTransform: "uppercase" }}>
                  {src.source_type}
                </span>
                <h3 style={{ margin: 0, fontSize: 16 }}>{src.title}</h3>
                <div style={{ fontSize: 12.5, color: "var(--cream-dim)" }}>
                  Publisher: {src.publisher}
                </div>
                {src.notes && (
                  <p style={{ margin: 0, fontSize: 12, color: "var(--cream-dim)", opacity: 0.8 }}>
                    {src.notes}
                  </p>
                )}
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12, color: "var(--amber)", textDecoration: "underline", marginTop: 4 }}
                >
                  Visit Digital Archive ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SUBMISSIONS */}
      {activeTab === "submissions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: 18, margin: 0, fontFamily: "Fraunces, serif" }}>Community Heritage Submissions</h2>
              <p style={{ margin: "4px 0 0 0", fontSize: 12.5, color: "var(--cream-dim)" }}>
                User-suggested heritage monuments and buildings pending editorial review.
              </p>
            </div>
            <button
              onClick={() => loadSubmissions()}
              style={{ padding: "8px 16px", borderRadius: 999, background: "rgba(245,239,227,0.1)", color: "var(--cream)", fontSize: 13 }}
            >
              ↻ Refresh
            </button>
          </div>

          {submissions.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", background: "var(--petrol-800)", borderRadius: 12, border: "1px solid var(--petrol-border)", color: "var(--cream-dim)" }}>
              No pending community submissions at this time.
            </div>
          ) : (
            <div style={{ border: "1px solid var(--petrol-border)", borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "var(--petrol-800)", textAlign: "left", color: "var(--cream-dim)", borderBottom: "1px solid var(--petrol-border)" }}>
                    <th style={{ padding: "12px 16px" }}>Suggested Site</th>
                    <th style={{ padding: "12px 16px" }}>Era & Type</th>
                    <th style={{ padding: "12px 16px" }}>Coordinates</th>
                    <th style={{ padding: "12px 16px" }}>Notes / Description</th>
                    <th style={{ padding: "12px 16px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: "1px solid rgba(245,239,227,0.06)" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{sub.name}</td>
                      <td style={{ padding: "12px 16px", color: "var(--cream-dim)" }}>
                        <span style={{ textTransform: "capitalize" }}>{sub.era || "Unknown"}</span> · <span style={{ textTransform: "capitalize" }}>{sub.type || "Civic"}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "JetBrains Mono", fontSize: 12 }}>
                        {Number(sub.lat).toFixed(4)}, {Number(sub.lng).toFixed(4)}
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--cream-dim)", maxWidth: 300, fontSize: 12.5 }}>
                        {sub.note || "No notes provided"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => handleSubmissionAction(sub.id, "approve")}
                          style={{ padding: "4px 12px", borderRadius: 6, background: "var(--amber)", color: "var(--petrol-900)", fontWeight: 600, fontSize: 12, marginRight: 8, cursor: "pointer" }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleSubmissionAction(sub.id, "reject")}
                          style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(222,107,66,0.15)", color: "#de6b42", border: "1px solid rgba(222,107,66,0.3)", fontSize: 12, cursor: "pointer" }}
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
        </div>
      )}
    </div>
  );
}

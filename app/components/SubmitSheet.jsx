"use client";

import { useState } from "react";
import { ERAS, ERA_ORDER, TYPES } from "../../lib/heritage.js";
import { getIdToken } from "../../lib/identity.js";
import { Icon } from "./Icons.jsx";

// Two-step: (1) drop a pin on the map, (2) fill the form. `pin` is {lat,lng}
// captured by the parent's map pick handler; null means "still picking".
export default function SubmitSheet({ pin, onRequestPin, onClose, onDone }) {
  const [name, setName] = useState("");
  const [era, setEra] = useState("asaf-jahi");
  const [type, setType] = useState("civic");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [submittedData, setSubmittedData] = useState(null);

  async function submit() {
    if (!name.trim()) {
      setErr("Please enter the name of the heritage site.");
      return;
    }
    if (!pin) {
      setErr("Please drop a pin on the map where the site stands.");
      return;
    }
    setBusy(true);
    setErr("");
    
    const token = await getIdToken();
    const submissionPayload = {
      name: name.trim(),
      lat: pin.lat,
      lng: pin.lng,
      era,
      type,
      note: note.trim(),
      date: new Date().toISOString()
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || "local-anon"}` },
        body: JSON.stringify(submissionPayload),
      });
      const data = await res.json().catch(() => ({}));
      setBusy(false);
      
      // Save locally to personal submitted history
      try {
        const stored = JSON.parse(localStorage.getItem("dhm-my-submissions-v1") || "[]");
        stored.unshift(submissionPayload);
        localStorage.setItem("dhm-my-submissions-v1", JSON.stringify(stored.slice(0, 50)));
      } catch {}

      if (res.ok) {
        setSubmittedData(submissionPayload);
      } else {
        setErr(data.error === "rate-limited" ? "You have a few pending submissions already." : (data.error || "Could not send."));
      }
    } catch {
      setBusy(false);
      // Fallback: save locally
      try {
        const stored = JSON.parse(localStorage.getItem("dhm-my-submissions-v1") || "[]");
        stored.unshift(submissionPayload);
        localStorage.setItem("dhm-my-submissions-v1", JSON.stringify(stored.slice(0, 50)));
        setSubmittedData(submissionPayload);
      } catch {
        setErr("Could not save submission. Please try again.");
      }
    }
  }

  const resetForm = () => {
    setName("");
    setNote("");
    setErr("");
    setSubmittedData(null);
  };

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label="Suggest a site">
        <div className="grip" />
        <div className="scroll">
          {submittedData ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(42, 157, 143, 0.15)", color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700 }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                    Submission Received
                  </div>
                  <h2 style={{ margin: 0, fontSize: 20, fontFamily: "Fraunces, serif" }}>
                    Sent for Editorial Review
                  </h2>
                </div>
              </div>

              <div style={{ background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
                  {submittedData.name}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 11.5, padding: "3px 8px", borderRadius: 6, background: "rgba(196, 92, 53, 0.12)", color: "var(--accent)", fontWeight: 600 }}>
                    {TYPES[submittedData.type] || submittedData.type}
                  </span>
                  <span style={{ fontSize: 11.5, padding: "3px 8px", borderRadius: 6, background: "rgba(43, 33, 25, 0.08)", color: "var(--ink-soft)", fontWeight: 500 }}>
                    {ERAS[submittedData.era]?.label || submittedData.era}
                  </span>
                  <span style={{ fontSize: 11.5, padding: "3px 8px", borderRadius: 6, background: "rgba(43, 33, 25, 0.05)", color: "var(--ink-soft)", fontFamily: "JetBrains Mono" }}>
                    📍 {submittedData.lat.toFixed(4)}°, {submittedData.lng.toFixed(4)}°
                  </span>
                </div>
                {submittedData.note && (
                  <p style={{ margin: "4px 0 0 0", fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.45, fontStyle: "italic" }}>
                    "{submittedData.note}"
                  </p>
                )}
              </div>

              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5, background: "rgba(42, 157, 143, 0.08)", padding: 12, borderRadius: 10, border: "1px solid rgba(42, 157, 143, 0.2)" }}>
                💡 <b>What happens next?</b> An editor will verify the architectural details and coordinates. Once approved in the CMS, this monument will go live on the public atlas with documentary photography.
              </div>

              <div className="actions" style={{ marginTop: 8, display: "flex", gap: 10 }}>
                <button className="btn primary" onClick={() => onDone(`✓ "${submittedData.name}" submitted for review!`)} style={{ flex: 1 }}>
                  Return to Map
                </button>
                <button className="btn ghost" onClick={resetForm}>
                  Suggest Another
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2>Spotted a heritage building?</h2>
              <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                Drop a pin where it stands, then tell us what it is. An editor reviews every submission
                before it joins the map.
              </p>

              <div className="form">
                <button className="btn" onClick={onRequestPin} style={{ marginTop: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Icon name="pin" size={16} />
                  <span>{pin ? `Pin set (${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}) — tap map to move` : "Drop a pin on the map"}</span>
                </button>

                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aza Khana-e-Zehra" />

                <label>Era (best guess)</label>
                <select value={era} onChange={(e) => setEra(e.target.value)}>
                  {ERA_ORDER.map((x) => (
                    <option key={x} value={x}>
                      {ERAS[x].label}
                    </option>
                  ))}
                </select>

                <label>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  {Object.entries(TYPES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>

                <label>Notes (what it is, condition, any source)</label>
                <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />

                {err && <p style={{ color: "var(--danger)", fontSize: 12 }}>{err}</p>}

                <div className="actions" style={{ marginTop: 12 }}>
                  <button className="btn primary" onClick={submit} disabled={busy}>
                    {busy ? "Sending…" : "Submit for review"}
                  </button>
                  <button className="btn ghost" onClick={onClose}>
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

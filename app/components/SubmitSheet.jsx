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
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || "local-anon"}` },
        body: JSON.stringify({ name: name.trim(), lat: pin.lat, lng: pin.lng, era, type, note: note.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      setBusy(false);
      
      // Save locally to personal submitted history
      try {
        const stored = JSON.parse(localStorage.getItem("dhm-my-submissions-v1") || "[]");
        stored.unshift({
          name: name.trim(),
          lat: pin.lat,
          lng: pin.lng,
          era,
          type,
          note: note.trim(),
          date: new Date().toISOString()
        });
        localStorage.setItem("dhm-my-submissions-v1", JSON.stringify(stored.slice(0, 50)));
      } catch {}

      if (res.ok) {
        onDone("Thanks — sent for review.");
      } else {
        setErr(data.error === "rate-limited" ? "You have a few pending submissions already." : (data.error || "Could not send."));
      }
    } catch {
      setBusy(false);
      // Fallback: save locally
      try {
        const stored = JSON.parse(localStorage.getItem("dhm-my-submissions-v1") || "[]");
        stored.unshift({
          name: name.trim(),
          lat: pin.lat,
          lng: pin.lng,
          era,
          type,
          note: note.trim(),
          date: new Date().toISOString()
        });
        localStorage.setItem("dhm-my-submissions-v1", JSON.stringify(stored.slice(0, 50)));
        onDone("Thanks — saved for review.");
      } catch {
        setErr("Could not save submission. Please try again.");
      }
    }
  }

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label="Suggest a site">
        <div className="grip" />
        <div className="scroll">
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
        </div>
      </div>
    </>
  );
}

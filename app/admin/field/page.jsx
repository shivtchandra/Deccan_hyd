"use client";

// Field desk: a phone-friendly page for logging new findings on site (name, description, pin).
// Each save goes live on the public map immediately; "My findings" is
// the editor's history with edit / hide controls. Keys come from FIELD_EDITORS
// (ADMIN_SECRET / EDITOR_SECRET also work and see everyone's findings).
// The full editorial desk is /admin.

import React, { useState, useEffect } from "react";
import PinPicker from "../PinPicker.jsx";
import { ERAS, TYPES, ACCESS } from "../../../lib/heritage.js";

const KEY_STORE = "dhm_field_key";

const EMPTY = { name: "", description: "", type: "civic", era: "asaf-jahi", yearBuilt: "", area: "", access: "open", lat: "", lng: "" };

export default function FieldDesk() {
  const [key, setKey] = useState("");
  const [editor, setEditor] = useState(null);
  const [role, setRole] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [view, setView] = useState("new"); // 'new' | 'history'
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null); // finding being edited
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null); // { kind, text, siteId? }
  const [locating, setLocating] = useState(false);

  const authHeader = (k = key) => ({ Authorization: `Bearer ${k}` });

  const loadHistory = async (k = key) => {
    const res = await fetch("/api/field/findings", { headers: authHeader(k), cache: "no-store" });
    if (res.status === 401) throw new Error("unauthorized");
    const data = await res.json();
    setEditor(data.editor);
    setRole(data.role);
    setHistory(data.findings || []);
    return data;
  };

  useEffect(() => {
    let saved = "";
    try {
      saved = localStorage.getItem(KEY_STORE) || "";
    } catch {}
    if (saved) {
      setKey(saved);
      loadHistory(saved).catch(() => {
        try {
          localStorage.removeItem(KEY_STORE);
        } catch {}
      });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await loadHistory(key.trim());
      setKey(key.trim());
      try {
        localStorage.setItem(KEY_STORE, key.trim());
      } catch {}
    } catch (err) {
      setLoginError(err.message === "unauthorized" ? "That key isn't recognised." : "Couldn't reach the server.");
    }
  };

  const signOut = () => {
    try {
      localStorage.removeItem(KEY_STORE);
    } catch {}
    setEditor(null);
    setKey("");
    setHistory([]);
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setPin = (lat, lng) => setForm((f) => ({ ...f, lat: lat.toFixed(6), lng: lng.toFixed(6) }));

  const useMyLocation = () => {
    if (!navigator.geolocation) return setToast({ kind: "error", text: "This device can't share location." });
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPin(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setToast({ kind: "error", text: "Location blocked — tap the map to drop the pin instead." });
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const resetForm = () => {
    setForm(EMPTY);
    setEditing(null);
  };

  const startEdit = (f) => {
    resetForm();
    setEditing(f);
    setForm({
      name: f.name || "",
      description: f.story || f.summary || "",
      type: f.type,
      era: f.era,
      yearBuilt: f.yearBuilt || "",
      area: f.area || "",
      access: f.access || "open",
      lat: String(f.lat),
      lng: String(f.lng),
    });
    setView("new");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.lat === "" || form.lng === "") return setToast({ kind: "error", text: "Drop a pin on the map first." });
    setBusy(true);
    setToast(null);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    try {
      const res = await fetch(editing ? `/api/field/findings/${editing.id}` : "/api/field/findings", {
        method: editing ? "PATCH" : "POST",
        headers: authHeader(),
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.hint || data.error || `Save failed (${res.status})`);
      setToast({ kind: "ok", text: editing ? "Changes saved — map updated." : "Finding is live on the map.", siteId: data.finding.id });
      resetForm();
      await loadHistory();
    } catch (err) {
      setToast({ kind: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const toggleHidden = async (f) => {
    const res = await fetch(`/api/field/findings/${f.id}`, {
      method: "PATCH",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ hidden: !f.hidden }),
    });
    if (res.ok) {
      setToast({ kind: "ok", text: f.hidden ? `"${f.name}" is back on the map.` : `"${f.name}" hidden from the map.` });
      loadHistory();
    } else {
      setToast({ kind: "error", text: "Couldn't update that finding." });
    }
  };

  if (!editor) {
    return (
      <main className="field-page field-login">
        <form onSubmit={handleLogin} className="field-card">
          <img src="/brand/charminar-logo.png" alt="" width="44" height="44" />
          <h1>Field desk</h1>
          <p>Log new heritage findings straight onto the Mapping HYD map. Enter the field key you were given.</p>
          <input type="password" placeholder="Field key" value={key} onChange={(e) => setKey(e.target.value)} autoFocus />
          {loginError && <div className="field-error">{loginError}</div>}
          <button type="submit" className="field-btn primary" disabled={!key.trim()}>
            Open field desk
          </button>
        </form>
      </main>
    );
  }

  const live = history.filter((f) => !f.hidden).length;

  return (
    <main className="field-page">
      <header className="field-head">
        <div>
          <div className="field-eyebrow">Field desk · {editor}</div>
          <h1>{editing ? `Editing “${editing.name}”` : "Log a new finding"}</h1>
        </div>
        <div className="field-head-actions">
          <a href="/" className="field-btn ghost">Map ↗</a>
          {role !== "field" && <a href="/admin" className="field-btn ghost">Editorial desk</a>}
          <button onClick={signOut} className="field-btn ghost">Sign out</button>
        </div>
      </header>

      <nav className="field-tabs">
        <button className={view === "new" ? "on" : ""} onClick={() => setView("new")}>
          {editing ? "Edit finding" : "New finding"}
        </button>
        <button className={view === "history" ? "on" : ""} onClick={() => setView("history")}>
          My findings ({history.length})
        </button>
      </nav>

      {toast && (
        <div className={`field-toast ${toast.kind}`}>
          <span>{toast.text}</span>
          {toast.siteId && (
            <a href={`/?site=${toast.siteId}`} target="_blank" rel="noreferrer">
              View on map ↗
            </a>
          )}
          <button onClick={() => setToast(null)} aria-label="Dismiss">×</button>
        </div>
      )}

      {view === "new" && (
        <form onSubmit={submit} className="field-form">
          <section className="field-card">
            <h2>What did you find?</h2>
            <label>
              Name *
              <input value={form.name} onChange={set("name")} placeholder="e.g. Old stepwell behind Purani Haveli" required maxLength={120} />
            </label>
            <label>
              Description *
              <textarea value={form.description} onChange={set("description")} rows={6} required maxLength={4000}
                placeholder="What it is, condition, history you learned, who you spoke to, how to reach it…" />
              <span className="field-hint">{form.description.length}/4000 · first two lines show on the map card</span>
            </label>
            <div className="field-row">
              <label>
                Type
                <select value={form.type} onChange={set("type")}>
                  {Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <label>
                Era
                <select value={form.era} onChange={set("era")}>
                  {Object.entries(ERAS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </label>
            </div>
            <div className="field-row">
              <label>
                Year / period
                <input value={form.yearBuilt} onChange={set("yearBuilt")} placeholder="e.g. c. 1780" maxLength={40} />
              </label>
              <label>
                Area
                <input value={form.area} onChange={set("area")} placeholder="e.g. Purani Haveli" maxLength={80} />
              </label>
            </div>
            <label>
              Access
              <select value={form.access} onChange={set("access")}>
                {Object.entries(ACCESS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </section>

          <section className="field-card">
            <div className="field-card-head">
              <h2>Location *</h2>
              <button type="button" className="field-btn small" onClick={useMyLocation} disabled={locating}>
                {locating ? "Locating…" : "📍 Use my location"}
              </button>
            </div>
            <p className="field-hint">Tap the map to drop the pin, drag it to fine-tune.</p>
            <PinPicker lat={form.lat} lng={form.lng} onChange={setPin} className="field-map" />
            <div className="field-row">
              <label>
                Latitude
                <input value={form.lat} onChange={set("lat")} inputMode="decimal" placeholder="17.3616" />
              </label>
              <label>
                Longitude
                <input value={form.lng} onChange={set("lng")} inputMode="decimal" placeholder="78.4747" />
              </label>
            </div>
          </section>

          <div className="field-actions">
            {editing && (
              <button type="button" className="field-btn ghost" onClick={resetForm}>
                Cancel edit
              </button>
            )}
            <button type="submit" className="field-btn primary" disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Publish to map"}
            </button>
          </div>
        </form>
      )}

      {view === "history" && (
        <section className="field-history">
          <p className="field-hint">
            {history.length} findings · {live} live on the map
          </p>
          {history.length === 0 && <div className="field-card field-empty">Nothing logged yet. Your findings will appear here.</div>}
          {history.map((f) => (
            <article key={f.id} className={`field-card field-item ${f.hidden ? "is-hidden" : ""}`}>
              {f.thumb && (
                <div className="field-item-thumb">
                  <img src={f.thumb} alt="" />
                </div>
              )}
              <div className="field-item-body">
                <div className="field-item-top">
                  <h3>{f.name}</h3>
                  <span className={`field-badge ${f.hidden ? "off" : "on"}`}>{f.hidden ? "Hidden" : "Live"}</span>
                </div>
                <div className="field-item-meta">
                  {TYPES[f.type] || f.type} · {ERAS[f.era]?.label || f.era}
                  {f.area ? ` · ${f.area}` : ""}
                </div>
                <div className="field-item-meta">
                  Added {new Date(f.createdAt).toLocaleString()}
                  {f.updatedAt && f.updatedAt !== f.createdAt ? ` · edited ${new Date(f.updatedAt).toLocaleString()}` : ""}
                  {role !== "field" && f.addedBy !== editor ? ` · by ${f.addedBy}` : ""}
                </div>
                <p>{f.summary}</p>
                <div className="field-item-actions">
                  {!f.hidden && (
                    <a href={`/?site=${f.id}`} target="_blank" rel="noreferrer" className="field-btn small">
                      View on map ↗
                    </a>
                  )}
                  <button className="field-btn small" onClick={() => startEdit(f)}>Edit</button>
                  <button className="field-btn small ghost" onClick={() => toggleHidden(f)}>
                    {f.hidden ? "Show on map" : "Hide from map"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <style>{`
        .field-page { min-height: 100vh; background: var(--paper); color: var(--ink); padding: 20px 16px 48px; max-width: 760px; margin: 0 auto; font-family: var(--font-sans); }
        .field-page h1 { font-family: var(--font-serif); font-size: 26px; margin: 2px 0 0; line-height: 1.15; }
        .field-page h2 { font-family: var(--font-serif); font-size: 18px; margin: 0; }
        .field-login { display: grid; place-items: center; }
        .field-login .field-card { max-width: 380px; width: 100%; gap: 12px; }
        .field-login p { margin: 0; color: var(--ink-soft); font-size: 14px; line-height: 1.5; }
        .field-card { background: var(--cream-hi); border: 1px solid var(--line); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 12px; box-shadow: var(--e1); }
        .field-card-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
        .field-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
        .field-head-actions { display: flex; gap: 8px; }
        .field-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-deep); font-weight: 600; }
        .field-tabs { display: flex; gap: 6px; margin-bottom: 14px; }
        .field-tabs button { padding: 8px 16px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--ink-soft); font-size: 14px; cursor: pointer; }
        .field-tabs button.on { background: var(--ink); color: var(--cream); border-color: var(--ink); font-weight: 600; }
        .field-form { display: flex; flex-direction: column; gap: 14px; }
        .field-page label { display: flex; flex-direction: column; gap: 5px; font-size: 13px; font-weight: 600; color: var(--ink-soft); flex: 1; min-width: 0; }
        .field-page input:not([type=file]), .field-page textarea, .field-page select { font: inherit; font-size: 16px; font-weight: 400; color: var(--ink); background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; width: 100%; box-sizing: border-box; }
        .field-page textarea { resize: vertical; line-height: 1.5; }
        .field-page input:focus, .field-page textarea:focus, .field-page select:focus { outline: 2px solid var(--accent); outline-offset: 0; border-color: transparent; }
        .field-row { display: flex; gap: 10px; }
        @media (max-width: 480px) { .field-row { flex-direction: column; } }
        .field-hint { font-size: 12px; color: var(--muted); font-weight: 400; margin: 0; }
        .field-map { height: 300px; border-radius: 10px; border: 1px solid var(--line); overflow: hidden; z-index: 0; }
        .field-actions { display: flex; justify-content: flex-end; gap: 8px; position: sticky; bottom: 0; padding: 12px 0; background: linear-gradient(transparent, var(--paper) 35%); }
        .field-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 18px; border-radius: 999px; border: 1px solid var(--line); background: var(--cream-hi); color: var(--ink); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; }
        .field-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
        .field-btn.ghost { background: transparent; }
        .field-btn.small { padding: 6px 12px; font-size: 13px; }
        .field-btn:disabled { opacity: 0.55; cursor: default; }
        .field-error { color: var(--danger); font-size: 13px; }
        .field-toast { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; margin-bottom: 14px; font-size: 14px; }
        .field-toast.ok { background: #e3f1e4; color: #1f5a2a; }
        .field-toast.error { background: var(--accent-wash); color: var(--danger); }
        .field-toast span { flex: 1; }
        .field-toast a { color: inherit; font-weight: 600; }
        .field-toast button { border: none; background: none; font-size: 18px; color: inherit; cursor: pointer; }
        .field-history { display: flex; flex-direction: column; gap: 10px; }
        .field-empty { color: var(--ink-soft); text-align: center; padding: 32px 16px; }
        .field-item { flex-direction: row; align-items: flex-start; }
        .field-item.is-hidden { opacity: 0.6; }
        .field-item-thumb { width: 84px; height: 84px; flex: none; border-radius: 10px; overflow: hidden; background: var(--paper); display: grid; place-items: center; font-size: 11px; color: var(--muted); }
        .field-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .field-item-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
        .field-item-top { display: flex; justify-content: space-between; gap: 8px; align-items: flex-start; }
        .field-item h3 { margin: 0; font-size: 16px; font-family: var(--font-serif); }
        .field-item p { margin: 4px 0; font-size: 14px; color: var(--ink-soft); line-height: 1.45; overflow-wrap: anywhere; }
        .field-item-meta { font-size: 12px; color: var(--muted); }
        .field-item-actions { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
        .field-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; flex: none; }
        .field-badge.on { background: #e3f1e4; color: #1f5a2a; }
        .field-badge.off { background: var(--line); color: var(--ink-soft); }
      `}</style>
    </main>
  );
}

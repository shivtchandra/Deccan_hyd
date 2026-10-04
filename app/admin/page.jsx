"use client";

// Editorial desk: everything a content editor needs to manage the public atlas.
//
//   Sites        every pin on the map — add, edit, hide / show, revert built-in edits.
//                Saves go live immediately (no rebuild): see lib/siteEdits.js + lib/findingsStore.js.
//   Submissions  "Suggest a site" entries from visitors — review & publish, or reject.
//   Reference    periods, vanished places, historical maps, trails, sources — read-only here;
//                they are compiled into the site from data/heritage-master.json.
//
// Roles (from the key, see editorFromRequest): admin / editor can do everything;
// field editors can add sites and change only the ones they added.

import React, { useState, useEffect, useMemo, useCallback } from "react";
import masterData from "../../data/heritage-master.json";
import { ERAS, ERA_ORDER, TYPES, STATUS, ACCESS, eraColor, eraLabel, typeLabel, statusLabel, haversineKm } from "../../lib/heritage.js";
import PinPicker, { HYD_CENTER } from "./PinPicker.jsx";

const KEY_STORE = "dhm_editor_key";
const HELP_STORE = "dhm_admin_help_hidden";

const EMPTY_FORM = {
  name: "",
  area: "",
  yearBuilt: "",
  era: "asaf-jahi",
  type: "civic",
  status: "unprotected",
  access: "open",
  lat: "",
  lng: "",
  summary: "",
  story: "",
  photoUrl: "",
  photoCredit: "",
};

const ROLE_LABEL = { admin: "Admin", editor: "Editor", field: "Field editor" };

const ERROR_TEXT = {
  unauthorized: "Your access key is no longer valid. Please sign in again.",
  forbidden: "You can only change sites you added yourself. Ask an editor to change this one.",
  "not-found": "That item no longer exists — the list has been refreshed.",
  "name-and-description-required": "A name and a story are both required.",
  "location-required": "Set the location: click the map, use GPS, or type the latitude and longitude.",
  "bad-photo-url": "The photo link must start with https:// (for example a Wikimedia Commons image).",
  "bad-request": "The server didn't understand that request.",
};

const errorText = (data, status) =>
  ERROR_TEXT[data?.error] || data?.hint || (data?.error ? `Error: ${data.error}` : `Something went wrong (HTTP ${status}).`);

// Vocabulary options, keeping a record's current value selectable even when it is
// outside the editor vocabulary (some built-in sites use extra types / access levels).
function optionsFor(vocab, current, label = (v) => v) {
  const list = Object.entries(vocab).map(([k, v]) => [k, label(v)]);
  if (current && !vocab[current]) list.push([current, `${current} (current)`]);
  return list;
}

const SITE_FILTERS = [
  { id: "all", label: "All" },
  { id: "desk", label: "Added on desk" },
  { id: "builtin", label: "Built-in" },
  { id: "edited", label: "Edited" },
  { id: "hidden", label: "Hidden" },
];

export default function EditorialDesk() {
  const [key, setKey] = useState("");
  const [me, setMe] = useState(null); // { name, role, canEditAll }
  const [checking, setChecking] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState("sites");
  const [helpHidden, setHelpHidden] = useState(false);

  const [sites, setSites] = useState([]);
  const [sitesState, setSitesState] = useState("idle"); // idle | loading | ready | error
  const [siteFilter, setSiteFilter] = useState("all");
  const [q, setQ] = useState("");
  const [submissions, setSubmissions] = useState([]);

  const [modal, setModal] = useState(null); // { mode: "add" | "edit", site?, submission? }
  const [form, setForm] = useState(EMPTY_FORM);
  const [initialForm, setInitialForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [toast, setToast] = useState(null); // { kind: "ok" | "error", text, siteId? }

  // ---- API ----
  const signOut = useCallback((message = "") => {
    try {
      sessionStorage.removeItem(KEY_STORE);
    } catch {}
    setKey("");
    setMe(null);
    setSites([]);
    setSubmissions([]);
    setModal(null);
    setLoginError(message);
  }, []);

  const api = useCallback(
    async (path, { method = "GET", body, k = key } = {}) => {
      const res = await fetch(path, {
        method,
        cache: "no-store",
        headers: { Authorization: `Bearer ${k}`, ...(body ? { "Content-Type": "application/json" } : {}) },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        signOut(ERROR_TEXT.unauthorized);
        throw new Error(ERROR_TEXT.unauthorized);
      }
      if (!res.ok) throw new Error(errorText(data, res.status));
      return data;
    },
    [key, signOut],
  );

  const loadSites = useCallback(
    async (k = key) => {
      setSitesState((s) => (s === "ready" ? s : "loading"));
      try {
        const data = await api("/api/admin/sites", { k });
        setSites(data.sites || []);
        setSitesState("ready");
      } catch (err) {
        setSitesState("error");
        setToast({ kind: "error", text: `Couldn't load sites. ${err.message}` });
      }
    },
    [api, key],
  );

  const loadSubmissions = useCallback(
    async (k = key, canReview = me?.canEditAll) => {
      if (!canReview) return;
      try {
        const data = await api("/api/admin/submissions?state=pending", { k });
        setSubmissions(data.submissions || []);
      } catch (err) {
        setToast({ kind: "error", text: `Couldn't load submissions. ${err.message}` });
      }
    },
    [api, key, me],
  );

  const enter = async (k) => {
    const res = await fetch("/api/admin/auth", { headers: { Authorization: `Bearer ${k}` }, cache: "no-store" });
    if (!res.ok) return false;
    const who = await res.json();
    setKey(k);
    setMe({ name: who.name, role: who.role, canEditAll: !!who.canEditAll });
    try {
      sessionStorage.setItem(KEY_STORE, k);
    } catch {}
    loadSites(k);
    loadSubmissions(k, !!who.canEditAll);
    return true;
  };

  useEffect(() => {
    let saved = "";
    try {
      saved = sessionStorage.getItem(KEY_STORE) || "";
      setHelpHidden(localStorage.getItem(HELP_STORE) === "1");
    } catch {}
    if (!saved) return setChecking(false);
    enter(saved)
      .then((ok) => {
        if (!ok) signOut();
      })
      .catch(() => {})
      .finally(() => setChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const k = key.trim();
    if (!k) return setLoginError("Enter your access key.");
    setLoginError("");
    setChecking(true);
    try {
      if (!(await enter(k))) setLoginError("That key isn't recognised. Check it with the site owner — keys are case-sensitive.");
    } catch {
      setLoginError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setChecking(false);
    }
  };

  const toggleHelp = () => {
    const next = !helpHidden;
    setHelpHidden(next);
    try {
      localStorage.setItem(HELP_STORE, next ? "1" : "0");
    } catch {}
  };

  useEffect(() => {
    if (toast?.kind !== "ok") return;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [toast]);

  // ---- site form ----
  const openForm = (mode, { site = null, submission = null } = {}) => {
    let f = EMPTY_FORM;
    if (site) {
      f = {
        name: site.name || "",
        area: site.area || "",
        yearBuilt: site.yearBuilt == null ? "" : String(site.yearBuilt),
        era: site.era || "asaf-jahi",
        type: site.type || "civic",
        status: site.status || "unprotected",
        access: site.access || "open",
        lat: site.lat == null ? "" : String(site.lat),
        lng: site.lng == null ? "" : String(site.lng),
        summary: site.summaryAuto ? "" : site.summary || "",
        story: site.story || site.summary || "",
        photoUrl: site.photo?.url || "",
        photoCredit: site.photo?.credit || "",
      };
    } else if (submission) {
      f = {
        ...EMPTY_FORM,
        name: submission.name || "",
        era: ERAS[submission.era] ? submission.era : EMPTY_FORM.era,
        type: TYPES[submission.type] ? submission.type : EMPTY_FORM.type,
        lat: submission.lat == null ? "" : String(submission.lat),
        lng: submission.lng == null ? "" : String(submission.lng),
        story: submission.note || "",
      };
    }
    setForm(f);
    setInitialForm(f);
    setFormError("");
    setModal({ mode, site, submission });
  };

  const dirty = JSON.stringify(form) !== JSON.stringify(initialForm);

  const closeForm = useCallback(() => {
    if (saving) return;
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    setModal(null);
  }, [dirty, saving]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => e.key === "Escape" && closeForm();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, closeForm]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setPin = (lat, lng) => setForm((f) => ({ ...f, lat: lat.toFixed(6), lng: lng.toFixed(6) }));

  const useGps = () => {
    if (!navigator.geolocation) return setFormError("This browser can't share its location — click the map instead.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPin(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setFormError("Location permission was blocked — click the map to drop the pin instead.");
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const saveSite = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) return setFormError(ERROR_TEXT["name-and-description-required"]);
    if (!form.story.trim()) return setFormError(ERROR_TEXT["name-and-description-required"]);
    if (form.lat === "" || form.lng === "") return setFormError(ERROR_TEXT["location-required"]);

    setSaving(true);
    try {
      let siteId = modal.site?.id;
      if (modal.mode === "edit") {
        await api(`/api/admin/sites/${encodeURIComponent(siteId)}`, { method: "PATCH", body: { action: "update", fields: form } });
      } else {
        const data = await api("/api/admin/sites", { method: "POST", body: { ...form, submissionId: modal.submission?.id } });
        siteId = data.site.id;
        if (modal.submission) {
          setSubmissions((list) => list.filter((s) => s.id !== modal.submission.id));
          if (!data.submissionResolved) loadSubmissions();
        }
      }
      setToast({
        kind: "ok",
        text: modal.mode === "edit" ? `Saved "${form.name.trim()}" — the public map is updated.` : `"${form.name.trim()}" is live on the public map.`,
        siteId,
      });
      setModal(null);
      loadSites();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---- row actions ----
  const siteAction = async (site, action) => {
    const prompts = {
      hide: `Hide "${site.name}" from the public map?\n\nNothing is deleted — you can show it again from the "Hidden" filter.`,
      revert: `Undo all desk edits to "${site.name}" and restore the original details?`,
    };
    if (prompts[action] && !window.confirm(prompts[action])) return;
    try {
      await api(`/api/admin/sites/${encodeURIComponent(site.id)}`, { method: "PATCH", body: { action } });
      const done = { hide: "hidden from the map", show: "back on the map", revert: "restored to its original details" };
      setToast({ kind: "ok", text: `"${site.name}" is ${done[action]}.`, siteId: action === "hide" ? null : site.id });
      loadSites();
    } catch (err) {
      setToast({ kind: "error", text: err.message });
      loadSites();
    }
  };

  const rejectSubmission = async (sub) => {
    if (!window.confirm(`Reject "${sub.name}"? It won't be added to the map.`)) return;
    try {
      await api("/api/admin/submissions", { method: "POST", body: { id: sub.id, action: "reject" } });
      setSubmissions((list) => list.filter((s) => s.id !== sub.id));
      setToast({ kind: "ok", text: `Rejected "${sub.name}".` });
    } catch (err) {
      setToast({ kind: "error", text: err.message });
    }
  };

  // ---- derived ----
  const counts = useMemo(
    () => ({
      all: sites.length,
      desk: sites.filter((s) => s.source === "desk").length,
      builtin: sites.filter((s) => s.source === "builtin").length,
      edited: sites.filter((s) => s.edited).length,
      hidden: sites.filter((s) => s.hidden).length,
    }),
    [sites],
  );

  const visibleSites = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sites
      .filter((s) => {
        if (siteFilter === "desk" && s.source !== "desk") return false;
        if (siteFilter === "builtin" && s.source !== "builtin") return false;
        if (siteFilter === "edited" && !s.edited) return false;
        if (siteFilter === "hidden" && !s.hidden) return false;
        if (!needle) return true;
        return [s.name, s.area, eraLabel(s.era), typeLabel(s.type), s.addedBy].some((v) => v && v.toLowerCase().includes(needle));
      })
      .sort((a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || "") || a.name.localeCompare(b.name));
  }, [sites, siteFilter, q]);

  const distanceKm = useMemo(() => {
    const lat = Number(form.lat);
    const lng = Number(form.lng);
    if (form.lat === "" || form.lng === "" || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return haversineKm({ lat: HYD_CENTER[0], lng: HYD_CENTER[1] }, { lat, lng });
  }, [form.lat, form.lng]);

  const duplicate = useMemo(() => {
    const n = form.name.trim().toLowerCase();
    if (!modal || !n) return null;
    return sites.find((s) => s.id !== modal.site?.id && s.name.trim().toLowerCase() === n) || null;
  }, [form.name, sites, modal]);

  // ---- login ----
  if (!me) {
    return (
      <main className="ad-page ad-login">
        <form onSubmit={handleLogin} className="ad-card ad-login-card">
          <div className="ad-brand">
            <img src="/brand/charminar-logo.png" alt="" width="44" height="44" />
            <div>
              <div className="ad-brand-name">Deccan Heritage</div>
              <div className="ad-eyebrow">Editorial desk</div>
            </div>
          </div>
          <p>Add and correct heritage sites, review visitor suggestions, and keep the public atlas accurate. Sign in with the access key the site owner gave you.</p>
          <label className="ad-field">
            Access key
            <input
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setLoginError("");
              }}
              placeholder="Paste your access key"
              autoComplete="current-password"
              autoFocus
            />
          </label>
          {loginError && <div className="ad-alert error">{loginError}</div>}
          <button type="submit" className="ad-btn primary" disabled={checking}>
            {checking ? "Checking…" : "Open editorial desk →"}
          </button>
          <p className="ad-muted">
            Logging finds on site from a phone? Use the <a href="/admin/field">field desk</a>.
          </p>
        </form>
        <AdminStyles />
      </main>
    );
  }

  const canReview = me.canEditAll;
  const tabs = [
    { id: "sites", label: "Sites", count: counts.all },
    ...(canReview ? [{ id: "submissions", label: "Submissions", count: submissions.length, alert: submissions.length > 0 }] : []),
  ];
  const refTabs = [
    { id: "periods", label: "Periods", count: masterData.historical_periods?.length || 0 },
    { id: "vanished", label: "Vanished places", count: masterData.vanished_places?.length || 0 },
    { id: "maps", label: "Historical maps", count: masterData.historical_maps?.length || 0 },
    { id: "trails", label: "Trails", count: masterData.heritage_trails?.length || 0 },
    { id: "sources", label: "Sources", count: masterData.sources?.length || 0 },
  ];

  return (
    <main className="ad-page">
      <header className="ad-head">
        <div className="ad-brand">
          <img src="/brand/charminar-logo.png" alt="" width="42" height="42" />
          <div>
            <div className="ad-eyebrow">
              Editorial desk · {me.name} <span className="ad-role">{ROLE_LABEL[me.role] || me.role}</span>
            </div>
            <h1>Deccan Heritage content</h1>
          </div>
        </div>
        <div className="ad-head-actions">
          <a href="/" target="_blank" rel="noreferrer" className="ad-btn">View public map ↗</a>
          <a href="/admin/field" className="ad-btn ghost">Field desk</a>
          <button onClick={() => signOut()} className="ad-btn ghost">Sign out</button>
        </div>
      </header>

      <section className={`ad-card ad-help ${helpHidden ? "closed" : ""}`}>
        <button className="ad-help-toggle" onClick={toggleHelp} aria-expanded={!helpHidden}>
          <strong>How this desk works</strong>
          <span>{helpHidden ? "Show" : "Hide"}</span>
        </button>
        {!helpHidden && (
          <ul>
            <li><b>Changes go live as soon as you save.</b> The public map updates immediately, with no rebuild or deploy needed.</li>
            {canReview ? (
              <>
                <li><b>Sites</b> lists every pin on the map. <i>Built-in</i> sites come from the original dataset; your edits are layered on top, and <i>Revert</i> restores the original.</li>
                <li><b>Nothing is deleted.</b> <i>Hide</i> takes a site off the map; find it under the <i>Hidden</i> filter and choose <i>Show</i> to put it back.</li>
                <li><b>Submissions</b> are visitor suggestions from “Suggest a site”. <i>Review &amp; publish</i> opens them in the site form so you can complete the details first.</li>
              </>
            ) : (
              <li>As a <b>field editor</b> you can add new sites and edit or hide the ones you added. Built-in sites and other editors’ entries are view-only for you.</li>
            )}
            <li><b>Reference</b> tabs (periods, trails, maps…) are read-only here. They are part of the site’s code (<code>data/heritage-master.json</code>), so ask the developer to change them.</li>
          </ul>
        )}
      </section>

      {toast && (
        <div className={`ad-alert ${toast.kind}`} role="status">
          <span>{toast.text}</span>
          {toast.siteId && (
            <a href={`/?site=${encodeURIComponent(toast.siteId)}`} target="_blank" rel="noreferrer">
              View on map ↗
            </a>
          )}
          <button onClick={() => setToast(null)} aria-label="Dismiss">×</button>
        </div>
      )}

      <nav className="ad-tabs">
        {tabs.map((t) => (
          <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
            {t.label} <span className={`ad-count ${t.alert ? "alert" : ""}`}>{t.count}</span>
          </button>
        ))}
        <span className="ad-tabs-sep">Reference</span>
        {refTabs.map((t) => (
          <button key={t.id} className={`ref ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
            {t.label} <span className="ad-count">{t.count}</span>
          </button>
        ))}
      </nav>

      {/* ---------------- SITES ---------------- */}
      {tab === "sites" && (
        <section className="ad-section">
          <div className="ad-section-head">
            <div>
              <h2>Heritage sites</h2>
              <p className="ad-muted">
                {counts.all} sites · {counts.desk} added on the desk · {counts.edited} edited · {counts.hidden} hidden
              </p>
            </div>
            <button className="ad-btn primary" onClick={() => openForm("add")}>+ Add site</button>
          </div>

          <div className="ad-toolbar">
            <input className="ad-search" type="search" placeholder="Search by name, area, era, type…" value={q} onChange={(e) => setQ(e.target.value)} />
            <div className="ad-chips">
              {SITE_FILTERS.map((f) => (
                <button key={f.id} className={siteFilter === f.id ? "on" : ""} onClick={() => setSiteFilter(f.id)}>
                  {f.label} <span>{counts[f.id]}</span>
                </button>
              ))}
            </div>
          </div>

          {sitesState === "loading" && <div className="ad-card ad-empty">Loading sites…</div>}
          {sitesState === "error" && (
            <div className="ad-card ad-empty">
              Couldn’t load the site list. <button className="ad-link" onClick={() => loadSites()}>Try again</button>
            </div>
          )}
          {sitesState === "ready" && visibleSites.length === 0 && (
            <div className="ad-card ad-empty">
              {siteFilter === "hidden" ? "No hidden sites." : siteFilter === "edited" ? "No built-in site has been edited yet." : siteFilter === "desk" ? "Nothing added on the desk yet — use “+ Add site”." : "No sites match your search."}
            </div>
          )}
          {sitesState === "ready" && visibleSites.length > 0 && (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Site</th>
                    <th>Era</th>
                    <th>Type</th>
                    <th>Protection</th>
                    <th>On map</th>
                    <th className="right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleSites.map((s) => (
                    <tr key={s.id} className={s.hidden ? "is-hidden" : ""}>
                      <td>
                        <div className="ad-site-name">
                          {s.name}
                          {s.area && <span className="ad-muted"> · {s.area}</span>}
                        </div>
                        <div className="ad-tags">
                          {s.source === "desk" ? <span className="ad-tag desk">Added by {s.addedBy || "desk"}</span> : <span className="ad-tag">Built-in</span>}
                          {s.edited && <span className="ad-tag edited" title={`Changed: ${(s.editedFields || []).join(", ")}`}>Edited{s.updatedBy ? ` by ${s.updatedBy}` : ""}</span>}
                          {!s.hasPhoto && <span className="ad-tag warn">No photo</span>}
                        </div>
                      </td>
                      <td>
                        <span className="ad-era" style={{ "--c": eraColor(s.era) }}>{eraLabel(s.era)}</span>
                      </td>
                      <td>{TYPES[s.type] || s.type}</td>
                      <td>{STATUS[s.status] ? statusLabel(s.status) : s.status}</td>
                      <td>
                        <span className={`ad-badge ${s.hidden ? "off" : "on"}`}>{s.hidden ? "Hidden" : "Live"}</span>
                      </td>
                      <td className="right ad-actions">
                        {!s.hidden && (
                          <a href={`/?site=${encodeURIComponent(s.id)}`} target="_blank" rel="noreferrer">View ↗</a>
                        )}
                        {s.canEdit ? (
                          <>
                            <button onClick={() => openForm("edit", { site: s })}>Edit</button>
                            <button onClick={() => siteAction(s, s.hidden ? "show" : "hide")}>{s.hidden ? "Show" : "Hide"}</button>
                            {s.edited && <button onClick={() => siteAction(s, "revert")}>Revert</button>}
                          </>
                        ) : (
                          <span className="ad-muted" title="Only admins and editors can change this site">View only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ---------------- SUBMISSIONS ---------------- */}
      {tab === "submissions" && canReview && (
        <section className="ad-section">
          <div className="ad-section-head">
            <div>
              <h2>Visitor submissions</h2>
              <p className="ad-muted">Suggestions sent from “Suggest a site” on the public map. Publishing adds them to the map; rejecting closes them.</p>
            </div>
            <button className="ad-btn" onClick={() => loadSubmissions()}>↻ Refresh</button>
          </div>
          {submissions.length === 0 ? (
            <div className="ad-card ad-empty">No submissions waiting for review.</div>
          ) : (
            <div className="ad-grid">
              {submissions.map((sub) => (
                <article key={sub.id} className="ad-card ad-sub">
                  <div className="ad-sub-top">
                    <h3>{sub.name}</h3>
                    {sub.createdAt && <span className="ad-muted">{new Date(sub.createdAt).toLocaleDateString()}</span>}
                  </div>
                  <div className="ad-muted">
                    {eraLabel(sub.era)} · {TYPES[sub.type] || sub.type || "Type not given"}
                  </div>
                  <a className="ad-coords" href={`https://www.openstreetmap.org/?mlat=${sub.lat}&mlon=${sub.lng}#map=18/${sub.lat}/${sub.lng}`} target="_blank" rel="noreferrer">
                    {Number(sub.lat).toFixed(5)}, {Number(sub.lng).toFixed(5)} ↗
                  </a>
                  <p>{sub.note || <i className="ad-muted">No note from the visitor.</i>}</p>
                  <div className="ad-sub-actions">
                    <button className="ad-btn primary small" onClick={() => openForm("add", { submission: sub })}>Review &amp; publish</button>
                    <button className="ad-btn ghost small" onClick={() => rejectSubmission(sub)}>Reject</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ---------------- REFERENCE (read-only) ---------------- */}
      {refTabs.some((t) => t.id === tab) && (
        <div className="ad-alert info">
          <span>
            Read-only reference. This content is compiled into the website from <code>data/heritage-master.json</code>; changes need a developer and a redeploy.
          </span>
        </div>
      )}

      {tab === "periods" && (
        <section className="ad-grid">
          {(masterData.historical_periods || []).map((p) => (
            <article key={p.id} className="ad-card ad-ref" style={{ borderLeft: `5px solid ${p.accent_color || "var(--accent)"}` }}>
              <div className="ad-ref-meta">
                <span>{p.start_year} — {p.end_year}</span>
                <span>{p.short_title}</span>
              </div>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="ad-ref-foot">
                <span>{p.ruler_dynasty}</span>
                <a href={`/?period=${encodeURIComponent(p.id)}`} target="_blank" rel="noreferrer">View on map ↗</a>
              </div>
            </article>
          ))}
        </section>
      )}

      {tab === "vanished" && (
        <section className="ad-grid">
          {(masterData.vanished_places || []).map((v) => (
            <article key={v.id} className="ad-card ad-ref">
              <div className="ad-ref-meta">
                <span>{v.start_year} — {v.end_year}</span>
                <span>{v.current_location}</span>
              </div>
              <h3>{v.name}</h3>
              <p><b>Then:</b> {v.what_existed}</p>
              <p><b>Now:</b> {v.what_exists_now}</p>
              <div className="ad-ref-foot"><span>{v.reason_for_change}</span></div>
            </article>
          ))}
        </section>
      )}

      {tab === "maps" && (
        <section className="ad-grid">
          {(masterData.historical_maps || []).map((m) => (
            <article key={m.id} className="ad-card ad-ref">
              <div className="ad-ref-meta"><span>{m.year}</span><span>{m.license}</span></div>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              <div className="ad-ref-foot">
                <span>{m.source_archive}</span>
                {m.source_url && <a href={m.source_url} target="_blank" rel="noreferrer">Source ↗</a>}
              </div>
            </article>
          ))}
        </section>
      )}

      {tab === "trails" && (
        <section className="ad-grid">
          {(masterData.heritage_trails || []).map((t) => (
            <article key={t.id} className="ad-card ad-ref">
              <div className="ad-ref-meta">
                <span>{t.distance_km} km · {t.stops?.length || 0} stops · ~{t.estimated_duration_min} min</span>
              </div>
              <h3>{t.title}</h3>
              <p>{t.subtitle}</p>
              <ol className="ad-stops">
                {(t.stops || []).map((st, i) => <li key={i}>{st.title}</li>)}
              </ol>
              <div className="ad-ref-foot">
                <a href={`/?trail=${encodeURIComponent(t.id)}`} target="_blank" rel="noreferrer">Open on map ↗</a>
                {t.slug && <a href={`/trails/${t.slug}`} target="_blank" rel="noreferrer">Trail page ↗</a>}
              </div>
            </article>
          ))}
        </section>
      )}

      {tab === "sources" && (
        <section className="ad-grid">
          {(masterData.sources || []).map((src) => (
            <article key={src.id} className="ad-card ad-ref">
              <div className="ad-ref-meta"><span>{src.source_type}</span></div>
              <h3>{src.title}</h3>
              <p>{src.publisher}</p>
              {src.notes && <p className="ad-muted">{src.notes}</p>}
              <div className="ad-ref-foot">{src.url && <a href={src.url} target="_blank" rel="noreferrer">Open archive ↗</a>}</div>
            </article>
          ))}
        </section>
      )}

      {/* ---------------- ADD / EDIT SITE ---------------- */}
      {modal && (
        <div className="ad-overlay" onMouseDown={(e) => e.target === e.currentTarget && closeForm()}>
          <form className="ad-modal" onSubmit={saveSite} noValidate>
            <div className="ad-modal-head">
              <div>
                <h2>{modal.mode === "edit" ? `Edit “${modal.site.name}”` : modal.submission ? "Review submission" : "Add a heritage site"}</h2>
                <p className="ad-muted">
                  {modal.mode === "edit" && modal.site.source === "builtin"
                    ? "Built-in site — your changes are layered on top of the original and can be reverted."
                    : modal.submission
                      ? "Check and complete the visitor’s details. Saving publishes the site and closes the submission."
                      : "Saving puts the site on the public map straight away."}
                </p>
              </div>
              <button type="button" className="ad-x" onClick={closeForm} aria-label="Close">×</button>
            </div>

            <div className="ad-modal-body">
              <fieldset>
                <legend>Basics</legend>
                <label className="ad-field">
                  Name *
                  <input value={form.name} onChange={set("name")} maxLength={120} placeholder="e.g. Khairtabad Mosque" autoFocus />
                </label>
                {duplicate && (
                  <div className="ad-alert warn small">
                    <span>A site called “{duplicate.name}” already exists{duplicate.hidden ? " (hidden)" : ""}. Edit that one instead if it’s the same place.</span>
                  </div>
                )}
                <div className="ad-row">
                  <label className="ad-field">
                    Area / locality
                    <input value={form.area} onChange={set("area")} maxLength={80} placeholder="e.g. Purani Haveli" />
                  </label>
                  <label className="ad-field">
                    Year built / period
                    <input value={form.yearBuilt} onChange={set("yearBuilt")} maxLength={40} placeholder="e.g. 1591 or c. 1780" />
                  </label>
                </div>
              </fieldset>

              <fieldset>
                <legend>Classification</legend>
                <div className="ad-row">
                  <label className="ad-field">
                    Era
                    <select value={form.era} onChange={set("era")}>
                      {[...ERA_ORDER, ...(ERAS[form.era] ? [] : [form.era])].map((k) => (
                        <option key={k} value={k}>{ERAS[k] ? `${ERAS[k].label} — ${ERAS[k].note}` : `${k} (current)`}</option>
                      ))}
                    </select>
                  </label>
                  <label className="ad-field">
                    Type
                    <select value={form.type} onChange={set("type")}>
                      {optionsFor(TYPES, form.type).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </label>
                </div>
                <div className="ad-row">
                  <label className="ad-field">
                    Protection status
                    <select value={form.status} onChange={set("status")}>
                      {optionsFor(STATUS, form.status, (v) => v.label).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <span className="ad-hint">“At risk” and “Lost” sites are highlighted on the map.</span>
                  </label>
                  <label className="ad-field">
                    Visitor access
                    <select value={form.access} onChange={set("access")}>
                      {optionsFor(ACCESS, form.access).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </label>
                </div>
              </fieldset>

              <fieldset>
                <legend>Location *</legend>
                <div className="ad-loc-head">
                  <span className="ad-hint">Click the map to drop the pin, then drag it to fine-tune.</span>
                  <button type="button" className="ad-btn small" onClick={useGps} disabled={locating}>
                    {locating ? "Locating…" : "📍 Use my location"}
                  </button>
                </div>
                <PinPicker lat={form.lat} lng={form.lng} onChange={setPin} height={260} />
                <div className="ad-row">
                  <label className="ad-field">
                    Latitude
                    <input value={form.lat} onChange={set("lat")} inputMode="decimal" placeholder="17.3616" />
                  </label>
                  <label className="ad-field">
                    Longitude
                    <input value={form.lng} onChange={set("lng")} inputMode="decimal" placeholder="78.4747" />
                  </label>
                </div>
                {distanceKm != null && distanceKm > 250 && (
                  <div className="ad-alert warn small">
                    <span>This pin is about {Math.round(distanceKm)} km from Hyderabad. If that’s not intended, check that latitude and longitude aren’t swapped (Hyderabad is ≈ 17.4, 78.5).</span>
                  </div>
                )}
              </fieldset>

              <fieldset>
                <legend>Story</legend>
                <label className="ad-field">
                  Short summary
                  <textarea rows={2} value={form.summary} onChange={set("summary")} maxLength={400} placeholder="One or two sentences for the map card. Leave blank to use the opening of the story." />
                  <span className="ad-hint">{form.summary.length}/400 · shown on map cards and search results</span>
                </label>
                <label className="ad-field">
                  Full story *
                  <textarea rows={7} value={form.story} onChange={set("story")} maxLength={8000} placeholder="What it is, who built it and when, architecture, current condition, how to visit…" />
                  <span className="ad-hint">{form.story.length}/8000 · shown on the site’s detail page</span>
                </label>
              </fieldset>

              <fieldset>
                <legend>Photo</legend>
                <div className="ad-photo">
                  <div className="ad-photo-fields">
                    <label className="ad-field">
                      Photo link
                      <input value={form.photoUrl} onChange={set("photoUrl")} inputMode="url" placeholder="https://upload.wikimedia.org/…" />
                    </label>
                    <label className="ad-field">
                      Credit
                      <input value={form.photoCredit} onChange={set("photoCredit")} maxLength={160} placeholder="e.g. Wikimedia Commons / photographer name" />
                    </label>
                    <span className="ad-hint">Use an image you have rights to (Wikimedia Commons works well). Clear the link to remove the photo.</span>
                  </div>
                  <div className="ad-photo-preview">
                    {form.photoUrl ? <img src={form.photoUrl} alt="" onError={(e) => (e.currentTarget.style.opacity = 0.2)} onLoad={(e) => (e.currentTarget.style.opacity = 1)} /> : <span>No photo</span>}
                  </div>
                </div>
              </fieldset>

              {formError && <div className="ad-alert error">{formError}</div>}
            </div>

            <div className="ad-modal-foot">
              <button type="button" className="ad-btn ghost" onClick={closeForm} disabled={saving}>Cancel</button>
              <button type="submit" className="ad-btn primary" disabled={saving}>
                {saving ? "Saving…" : modal.mode === "edit" ? "Save changes" : "Publish to map"}
              </button>
            </div>
          </form>
        </div>
      )}

      <AdminStyles />
    </main>
  );
}

// dangerouslySetInnerHTML keeps quotes in the CSS from being escaped (hydration mismatch).
function AdminStyles() {
  return <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />;
}

const ADMIN_CSS = `
      .ad-page { min-height: 100vh; background: var(--paper); color: var(--ink); font-family: var(--font-sans); padding: 24px 32px 64px; display: flex; flex-direction: column; gap: 18px; box-sizing: border-box; }
      .ad-page *, .ad-page *::before, .ad-page *::after { box-sizing: border-box; }
      .ad-page h1, .ad-page h2, .ad-page h3 { font-family: var(--font-serif); margin: 0; color: var(--ink); }
      .ad-page h1 { font-size: 24px; }
      .ad-page h2 { font-size: 20px; }
      .ad-page h3 { font-size: 16.5px; }
      .ad-page a { color: var(--accent-deep); }
      .ad-page code { font-family: "JetBrains Mono", monospace; font-size: 0.9em; background: var(--butter); padding: 1px 5px; border-radius: 4px; }
      .ad-muted { color: var(--ink-soft); font-size: 13px; margin: 0; }
      .ad-hint { font-size: 12px; color: var(--muted); font-weight: 400; }
      .ad-eyebrow { font-size: 11px; font-family: "JetBrains Mono", monospace; color: var(--accent-deep); text-transform: uppercase; letter-spacing: 0.07em; font-weight: 700; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .ad-role { text-transform: none; letter-spacing: 0; font-family: var(--font-sans); background: var(--butter); color: var(--ink); border: 1px solid var(--line); border-radius: 999px; padding: 1px 8px; font-size: 11px; }
      .ad-card { background: var(--cream-hi); border: 1px solid var(--line); border-radius: 14px; padding: 18px; box-shadow: var(--e1); }

      .ad-login { align-items: center; justify-content: center; }
      .ad-login-card { width: 420px; max-width: 100%; display: flex; flex-direction: column; gap: 16px; padding: 32px 28px; }
      .ad-login-card p { margin: 0; font-size: 14px; color: var(--ink-soft); line-height: 1.55; }
      .ad-brand { display: flex; align-items: center; gap: 14px; }
      .ad-brand img { object-fit: contain; border-radius: 10px; background: #faf6ee; padding: 4px; border: 1px solid var(--line); }
      .ad-brand-name { font-family: var(--font-serif); font-size: 22px; font-weight: 600; }

      .ad-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding-bottom: 16px; border-bottom: 1px solid var(--line); }
      .ad-head-actions { display: flex; gap: 8px; flex-wrap: wrap; }

      .ad-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 18px; border-radius: 999px; border: 1px solid var(--line); background: var(--cream-hi); color: var(--ink) !important; font: inherit; font-size: 13.5px; font-weight: 600; cursor: pointer; text-decoration: none; white-space: nowrap; }
      .ad-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff !important; box-shadow: 0 2px 8px rgba(194, 96, 58, 0.3); }
      .ad-btn.ghost { background: transparent; }
      .ad-btn.small { padding: 6px 12px; font-size: 12.5px; }
      .ad-btn:disabled { opacity: 0.55; cursor: default; }
      .ad-link { background: none; border: none; padding: 0; color: var(--accent-deep); font: inherit; font-weight: 600; text-decoration: underline; cursor: pointer; }

      .ad-help { padding: 0; }
      .ad-help-toggle { width: 100%; display: flex; justify-content: space-between; align-items: center; background: none; border: none; padding: 14px 18px; font: inherit; color: var(--ink); cursor: pointer; font-size: 14px; }
      .ad-help-toggle span { color: var(--accent-deep); font-size: 12.5px; font-weight: 600; }
      .ad-help ul { margin: 0; padding: 0 18px 16px 36px; display: flex; flex-direction: column; gap: 6px; font-size: 13.5px; line-height: 1.5; color: var(--ink-soft); }
      .ad-help b { color: var(--ink); }

      .ad-alert { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; font-size: 13.5px; line-height: 1.45; border: 1px solid transparent; }
      .ad-alert span { flex: 1; }
      .ad-alert a { color: inherit; font-weight: 700; white-space: nowrap; }
      .ad-alert button { background: none; border: none; font-size: 18px; color: inherit; cursor: pointer; line-height: 1; }
      .ad-alert.ok { background: #e3f1e4; color: #1f5a2a; border-color: #bcdcc0; }
      .ad-alert.error { background: var(--accent-wash); color: var(--danger); border-color: var(--accent); }
      .ad-alert.warn { background: #fbf0d4; color: #7a5410; border-color: #ecd49a; }
      .ad-alert.info { background: var(--cream-hi); color: var(--ink-soft); border-color: var(--line); }
      .ad-alert.small { font-size: 12.5px; padding: 8px 12px; }

      .ad-tabs { display: flex; gap: 6px; align-items: center; overflow-x: auto; padding-bottom: 10px; border-bottom: 1px solid var(--line); }
      .ad-tabs button { padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--cream-hi); color: var(--ink-soft); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; }
      .ad-tabs button.ref { background: transparent; }
      .ad-tabs button.on { background: var(--ink); color: #fff; border-color: var(--ink); font-weight: 700; }
      .ad-tabs-sep { margin-left: 10px; padding-left: 12px; border-left: 1px solid var(--line); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); font-weight: 700; white-space: nowrap; }
      .ad-count { display: inline-block; min-width: 20px; padding: 0 6px; margin-left: 4px; border-radius: 999px; background: rgba(43, 33, 25, 0.08); font-size: 11px; font-weight: 700; text-align: center; }
      .ad-tabs button.on .ad-count { background: rgba(255, 255, 255, 0.2); }
      .ad-count.alert { background: var(--accent); color: #fff; }

      .ad-section { display: flex; flex-direction: column; gap: 14px; }
      .ad-section-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
      .ad-toolbar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
      .ad-search { flex: 1 1 240px; max-width: 360px; padding: 9px 14px; border-radius: 999px; border: 1px solid var(--line); background: #fff; font: inherit; font-size: 13.5px; color: var(--ink); }
      .ad-chips { display: flex; gap: 6px; flex-wrap: wrap; }
      .ad-chips button { padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--ink-soft); font: inherit; font-size: 12.5px; cursor: pointer; }
      .ad-chips button span { opacity: 0.7; margin-left: 2px; }
      .ad-chips button.on { background: var(--butter); color: var(--ink); border-color: var(--ink-soft); font-weight: 700; }
      .ad-empty { text-align: center; padding: 40px 16px; color: var(--ink-soft); }

      .ad-table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 14px; background: var(--cream-hi); box-shadow: var(--e1); }
      .ad-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 820px; }
      .ad-table th { background: var(--butter); text-align: left; padding: 11px 14px; font-weight: 700; border-bottom: 1px solid var(--line); white-space: nowrap; }
      .ad-table td { padding: 11px 14px; border-bottom: 1px solid var(--line); vertical-align: top; color: var(--ink-soft); }
      .ad-table tr:last-child td { border-bottom: none; }
      .ad-table tr.is-hidden td { opacity: 0.6; }
      .ad-table .right { text-align: right; }
      .ad-site-name { font-weight: 600; color: var(--ink); }
      .ad-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
      .ad-tag { font-size: 10.5px; font-weight: 600; padding: 1px 7px; border-radius: 999px; background: rgba(43, 33, 25, 0.06); color: var(--ink-soft); }
      .ad-tag.desk { background: #e6eef7; color: #2b4a6f; }
      .ad-tag.edited { background: #fbf0d4; color: #7a5410; }
      .ad-tag.warn { background: transparent; border: 1px dashed var(--line); color: var(--muted); }
      .ad-era { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; white-space: nowrap; color: var(--c); background: color-mix(in srgb, var(--c) 12%, transparent); border: 1px solid color-mix(in srgb, var(--c) 25%, transparent); }
      .ad-badge { font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 999px; }
      .ad-badge.on { background: #e3f1e4; color: #1f5a2a; }
      .ad-badge.off { background: var(--line); color: var(--ink-soft); }
      .ad-actions { white-space: nowrap; }
      .ad-actions a, .ad-actions button { margin-left: 12px; background: none; border: none; padding: 0; font: inherit; font-size: 12.5px; font-weight: 700; color: var(--accent-deep); cursor: pointer; text-decoration: none; }
      .ad-actions .ad-muted { font-size: 12px; }

      .ad-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
      .ad-sub, .ad-ref { display: flex; flex-direction: column; gap: 8px; }
      .ad-sub p, .ad-ref p { margin: 0; font-size: 13px; line-height: 1.5; color: var(--ink-soft); overflow-wrap: anywhere; }
      .ad-sub-top { display: flex; justify-content: space-between; gap: 8px; align-items: baseline; }
      .ad-sub-actions { display: flex; gap: 8px; margin-top: auto; padding-top: 6px; }
      .ad-coords { font-family: "JetBrains Mono", monospace; font-size: 12px; }
      .ad-ref-meta { display: flex; justify-content: space-between; gap: 8px; font-family: "JetBrains Mono", monospace; font-size: 11.5px; color: var(--accent-deep); font-weight: 700; }
      .ad-ref-foot { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-top: auto; padding-top: 8px; border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); }
      .ad-ref-foot a { font-weight: 700; }
      .ad-stops { margin: 0; padding-left: 20px; font-size: 12.5px; color: var(--ink-soft); line-height: 1.6; }

      .ad-overlay { position: fixed; inset: 0; background: rgba(43, 33, 25, 0.55); backdrop-filter: blur(3px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; }
      .ad-modal { background: var(--cream-hi); border: 1px solid var(--line); border-radius: 18px; width: 720px; max-width: 100%; max-height: calc(100vh - 32px); display: flex; flex-direction: column; box-shadow: var(--e3); overflow: hidden; }
      .ad-modal-head { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; padding: 18px 22px; border-bottom: 1px solid var(--line); }
      .ad-modal-head p { margin-top: 3px; }
      .ad-x { background: none; border: none; font-size: 26px; line-height: 1; cursor: pointer; color: var(--ink-soft); padding: 2px 4px; }
      .ad-modal-body { padding: 16px 22px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
      .ad-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 22px; border-top: 1px solid var(--line); background: var(--cream); }
      .ad-modal fieldset { border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px 14px; margin: 0; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
      .ad-modal legend { padding: 0 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent-deep); }
      .ad-field { display: flex; flex-direction: column; gap: 5px; font-size: 13px; font-weight: 600; color: var(--ink); flex: 1; min-width: 0; }
      .ad-field input, .ad-field textarea, .ad-field select { font: inherit; font-size: 14px; font-weight: 400; color: var(--ink); background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 9px 12px; width: 100%; }
      .ad-field textarea { resize: vertical; line-height: 1.5; }
      .ad-field input:focus, .ad-field textarea:focus, .ad-field select:focus, .ad-search:focus { outline: 2px solid var(--accent); outline-offset: 0; border-color: transparent; }
      .ad-row { display: flex; gap: 12px; }
      .ad-loc-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
      .ad-photo { display: flex; gap: 14px; }
      .ad-photo-fields { flex: 1; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
      .ad-photo-preview { width: 140px; flex: none; border-radius: 10px; border: 1px solid var(--line); background: var(--paper); display: grid; place-items: center; overflow: hidden; font-size: 12px; color: var(--muted); min-height: 110px; }
      .ad-photo-preview img { width: 100%; height: 100%; object-fit: cover; }

      @media (max-width: 640px) {
        .ad-page { padding: 16px 16px 48px; }
        .ad-row, .ad-photo { flex-direction: column; }
        .ad-photo-preview { width: 100%; height: 160px; }
        .ad-modal-head, .ad-modal-body, .ad-modal-foot { padding-left: 16px; padding-right: 16px; }
        .ad-overlay { padding: 0; align-items: stretch; }
        .ad-modal { max-height: 100vh; border-radius: 0; }
      }
`;

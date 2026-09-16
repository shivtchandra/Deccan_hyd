"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ERAS, eraLabel, eraColor, typeLabel, statusLabel, ACCESS, photoUrl, haversineKm, distanceLabel } from "../../lib/heritage.js";
import { Icon, TypeIcon } from "./Icons.jsx";
import { enrichSiteRecord } from "../../lib/heritageData.js";

// Draggable bottom sheet with three snaps. Photo hero / Then ↔ Now slider,
// era/type/status badges, summary, significance, facts, sources, and actions.
const SNAP = { peek: 34, half: 72, full: 94 };

export default function DetailSheet({
  site: rawSite,
  pending,
  passportState,
  inRoute,
  onToggleSaved,
  onCheckIn,
  onAddToRoute,
  onClose,
  userLoc,
  onOpenDiorama,
}) {
  const [snap, setSnap] = useState("half");
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const uttRef = useRef(null);

  const site = rawSite ? enrichSiteRecord(rawSite) : null;

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setTtsPlaying(false);
  }, [rawSite?.id]);

  useEffect(() => {
    setSnap("half");
    setSliderPos(50);
  }, [site?.id]);

  const updateSlider = useCallback((clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updateSlider(e.clientX || e.touches?.[0]?.clientX);
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX || e.touches?.[0]?.clientX);
    };
    const handleUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleUp);
    }
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, updateSlider]);

  if (!site && !pending) return null;

  const risk = site && (site.status === "at-risk" || site.status === "lost");
  const thenPhoto = site?.thenPhoto;
  const nowPhoto = site?.nowPhoto;
  const hasThenNow = !!(thenPhoto && nowPhoto && thenPhoto.url && nowPhoto.url && thenPhoto.url !== nowPhoto.url);

  const startY = { v: 0 };
  const onDown = (e) => {
    startY.v = e.touches ? e.touches[0].clientY : e.clientY;
  };
  const onUp = (e) => {
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const dy = startY.v - y;
    if (dy > 40) setSnap((s) => (s === "peek" ? "half" : "full"));
    else if (dy < -40) setSnap((s) => (s === "full" ? "half" : s === "half" ? "peek" : (onClose(), "peek")));
  };

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div
        className="sheet"
        style={{ height: `${SNAP[snap]}%`, transition: "height .28s cubic-bezier(.22,1,.36,1)" }}
        role="dialog"
        aria-label={site?.name || "Site"}
      >
        <div
          className="grip"
          onMouseDown={onDown}
          onMouseUp={onUp}
          onTouchStart={onDown}
          onTouchEnd={onUp}
          style={{ cursor: "grab", padding: "8px 0 6px" }}
        >
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--line)", margin: "0 auto" }} />
        </div>

        <div className="dhm-detail" style={{ overflowY: "auto", padding: "0 18px calc(90px + env(safe-area-inset-bottom, 0px))" }}>
          {pending && !site && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              <span className="swirl" style={{ display: "inline-block" }}>
                <Icon name="compass" size={26} color="var(--accent)" />
              </span>
            </div>
          )}

          {site && (
            <>
              {/* THEN ↔ NOW Comparison Slider / Hero Image */}
              {hasThenNow ? (
                <div
                  ref={sliderRef}
                  className="dhm-then-now-wrap"
                  onPointerDown={handlePointerDown}
                  onTouchStart={handlePointerDown}
                >
                  <div className="dhm-then-img">
                    <img
                      src={thenPhoto.url}
                      alt={`Archival view of ${site.name}`}
                      onError={(e) => {
                        // Show missing image placeholder instead of fake Charminar fallback
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);font-size:12px;padding:20px;text-align:center;">Historical image unavailable</div>';
                      }}
                    />
                  </div>
                  <div className="dhm-now-img" style={{ width: `${sliderPos}%` }}>
                    <img
                      src={nowPhoto.url}
                      alt={`Present view of ${site.name}`}
                      style={{
                        width: sliderRef.current ? `${sliderRef.current.clientWidth}px` : "100%",
                        maxWidth: "none",
                      }}
                      onError={(e) => {
                        // Show missing image placeholder instead of fake Charminar fallback
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);font-size:12px;padding:20px;text-align:center;">Current image unavailable</div>';
                      }}
                    />
                  </div>
                  <div className="dhm-slider-bar" style={{ left: `${sliderPos}%` }}>
                    <div className="dhm-slider-knob">↔</div>
                  </div>
                  <div className="dhm-then-badge">THEN · {thenPhoto.year}</div>
                  <div className="dhm-now-badge">NOW</div>
                </div>
              ) : (
                <div
                  className="dhm-hero"
                  onClick={() => setSnap((s) => (s === "full" ? "half" : "full"))}
                  style={{
                    height: 220,
                    margin: "0 -18px 18px",
                    position: "relative",
                    cursor: "pointer",
                    background: eraColor(site.era),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {site.photos?.[0]?.url ? (
                    <img
                      src={site.photos[0].url}
                      alt={site.name}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.08) contrast(1.03)" }}
                    />
                  ) : (
                    <TypeIcon type={site.type} size={56} width={1.3} color="rgba(255,255,255,0.9)" />
                  )}
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)`, pointerEvents: "none" }} />
                </div>
              )}

              {/* Title & Metadata */}
              <h2 style={{ margin: "2px 0 6px", fontSize: 22, lineHeight: 1.18, fontFamily: "Fraunces, serif" }}>
                {site.name}
              </h2>
              {site.altNames?.length > 0 && (
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                  also {site.altNames.join(", ")}
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                <span
                  className="dhm-badge"
                  style={{ background: eraColor(site.era), color: "#fff", border: "none" }}
                >
                  {eraLabel(site.era)}
                </span>
                <span className="dhm-badge">{typeLabel(site.type)}</span>
                <span
                  className="dhm-badge"
                  style={risk ? { color: "var(--danger)", borderColor: "var(--danger)" } : undefined}
                >
                  {statusLabel(site.status)}
                </span>
                {site.architecturalStyle && (
                  <span className="dhm-badge" style={{ fontStyle: "italic" }}>
                    {site.architecturalStyle}
                  </span>
                )}
              </div>

              {/* 2.5D Isometric Diorama Exploration Trigger — commented out for now
              {site.id === "charminar" && onOpenDiorama && (
                <button
                  type="button"
                  onClick={() => onOpenDiorama(site.id)}
                  className="pressable"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "12px 16px",
                    margin: "0 0 16px",
                    borderRadius: "var(--r-md)",
                    background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
                    border: "1.5px solid var(--accent)",
                    boxShadow: "var(--e1)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 24 }}>🏰</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "var(--accent-deep)" }}>
                        Explore 2.5D Living Diorama
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                        Illustrated isometric precinct & Wimmelbild quest
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 16, color: "var(--accent-deep)", fontWeight: 800 }}>→</span>
                </button>
              )}
              */}

              {site.summary && (
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: "0 0 10px", color: "var(--ink)" }}>
                    {site.summary}
                  </p>
                  <a
                    href={`/sites/${site.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--accent-deep)", textDecoration: "none", borderBottom: "1.5px solid var(--accent)", paddingBottom: 1 }}
                  >
                    Read full story ↗
                  </a>
                </div>
              )}

              {site.significance && (
                <div style={{ margin: "0 0 14px", padding: "10px 14px", background: "var(--butter)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent-deep)", marginBottom: 4 }}>
                    Why It Matters
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink)" }}>
                    {Array.isArray(site.significance) ? site.significance.join(". ") : site.significance}
                  </div>
                </div>
              )}

              {/* History */}
              {site.story && (
                <div style={{ margin: "0 0 18px", borderTop: "1px solid var(--hairline)", paddingTop: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)" }}>The Story</span>
                    <button
                      onClick={() => {
                        if (ttsPlaying) {
                          window.speechSynthesis?.cancel();
                          setTtsPlaying(false);
                        } else {
                          window.speechSynthesis?.cancel();
                          const text = [site.story, site.people?.map(p => `${p.name} — ${p.role}`).join('. '), site.events?.map(ev => `${ev.year}: ${ev.description}`).join('. ')].filter(Boolean).join('. ');
                          const utt = new SpeechSynthesisUtterance(text);
                          utt.rate = 0.88;
                          utt.onend = () => setTtsPlaying(false);
                          utt.onerror = () => setTtsPlaying(false);
                          uttRef.current = utt;
                          window.speechSynthesis.speak(utt);
                          setTtsPlaying(true);
                        }
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        fontSize: 11, fontWeight: 700,
                        color: ttsPlaying ? "var(--accent-deep)" : "var(--ink-soft)",
                        background: ttsPlaying ? "var(--accent-wash)" : "transparent",
                        border: `1px solid ${ttsPlaying ? "var(--accent)" : "var(--line)"}`,
                        borderRadius: "var(--r-pill)", padding: "4px 11px", cursor: "pointer",
                        transition: "all 150ms",
                      }}
                    >
                      <Icon name={ttsPlaying ? "pause" : "volume"} size={14} />
                      <span>{ttsPlaying ? "Pause" : "Listen"}</span>
                    </button>
                  </div>

                  {/* Lead sentence — first sentence displayed larger */}
                  {(() => {
                    const dot = site.story.search(/\.\s/);
                    const lead = dot > 0 ? site.story.slice(0, dot + 1) : null;
                    const rest = dot > 0 ? site.story.slice(dot + 1).trim() : site.story;
                    return (
                      <>
                        {lead && (
                          <p style={{ fontFamily: "Fraunces, serif", fontSize: 15.5, lineHeight: 1.5, color: "var(--ink)", margin: "0 0 10px", fontWeight: 500, fontStyle: "italic" }}>
                            {lead}
                          </p>
                        )}
                        {rest && (
                          <p style={{ fontSize: 13.5, lineHeight: 1.7, margin: "0 0 14px", color: "var(--ink-soft)" }}>
                            {rest}
                          </p>
                        )}
                      </>
                    );
                  })()}

                  {/* People */}
                  {site.people?.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      {site.people.map((p, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: i < site.people.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                          <span style={{ width: 3, borderRadius: 2, background: eraColor(site.era), flexShrink: 0, alignSelf: "stretch" }} />
                          <div>
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>{p.name}</span>
                            <span style={{ fontSize: 12, color: "var(--muted)" }}> — {p.role.split(';')[0]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Events timeline */}
                  {site.events?.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {site.events.map((ev, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, fontWeight: 700, color: "var(--accent-deep)", flex: "0 0 34px", paddingTop: 2 }}>{ev.year}</span>
                          <span style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.45 }}>{ev.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <dl style={{ display: "grid", gridTemplateColumns: "96px 1fr", rowGap: 6, fontSize: 13.5, margin: "0 0 16px" }}>
                {site.yearBuilt && (
                  <>
                    <dt style={{ color: "var(--muted)" }}>Built</dt>
                    <dd style={{ margin: 0, fontWeight: 600 }}>{site.yearBuilt}</dd>
                  </>
                )}
                <dt style={{ color: "var(--muted)" }}>Access</dt>
                <dd style={{ margin: 0 }}>{ACCESS[site.access] || site.access || "—"}</dd>
                {site.area && (
                  <>
                    <dt style={{ color: "var(--muted)" }}>Area</dt>
                    <dd style={{ margin: 0 }}>{site.area}</dd>
                  </>
                )}
                {userLoc && (
                  <>
                    <dt style={{ color: "var(--muted)" }}>From you</dt>
                    <dd style={{ margin: 0, color: "var(--era-qutb-shahi)", fontWeight: 700 }}>
                      {distanceLabel(haversineKm(userLoc, site))} away
                    </dd>
                  </>
                )}
              </dl>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                <button className="dhm-btn primary pressable-sm" onClick={() => onCheckIn(site)}>
                  <Icon name="check" size={16} width={2.2} color="#fff" />
                  {passportState === "visited" ? "Visited" : "Check in"}
                </button>
                <button className="dhm-btn pressable-sm" onClick={() => onToggleSaved(site.id)}>
                  <Icon
                    name="bookmark"
                    size={15}
                    width={2}
                    color={passportState === "saved" ? "var(--accent-deep)" : "var(--ink-soft)"}
                  />
                  {passportState === "saved" ? "Saved" : "Save"}
                </button>
                <button className="dhm-btn ghost pressable-sm" onClick={() => onAddToRoute(site.id)} disabled={inRoute}>
                  <Icon name="route" size={15} width={2} color="var(--ink-soft)" />
                  {inRoute ? "In route" : "Add to route"}
                </button>

              </div>

              {/* Sources */}
              {(site.sources?.length > 0 || site.wikipedia) && (
                <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: 10 }}>
                  <span style={{ fontWeight: 600 }}>Sources: </span>
                  {(site.sources || []).map((x, i) =>
                    x.url ? (
                      <a key={i} href={x.url} target="_blank" rel="noreferrer" style={{ marginRight: 10, color: "var(--accent-deep)" }}>
                        {x.label || x.title}
                      </a>
                    ) : (
                      <span key={i}>{x.label || x.title} </span>
                    )
                  )}
                  {site.wikipedia && (
                    <a href={site.wikipedia} target="_blank" rel="noreferrer" style={{ color: "var(--accent-deep)" }}>
                      Wikipedia ↗
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

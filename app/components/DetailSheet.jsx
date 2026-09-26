"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ERAS, eraLabel, eraColor, typeLabel, statusLabel, ACCESS, photoUrl, haversineKm, distanceLabel } from "../../lib/heritage.js";
import { Icon, TypeIcon } from "./Icons.jsx";
import { enrichSiteRecord } from "../../lib/heritageData.js";
import DeccanPatternBg from "./DeccanPatternBg.jsx";
import PostcardModal from "./PostcardModal.jsx";

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
  const [heroTab, setHeroTab] = useState("photo");
  const [postcardOpen, setPostcardOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const uttRef = useRef(null);

  const site = rawSite ? enrichSiteRecord(rawSite) : null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (lightboxUrl) setLightboxUrl(null);
        else onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxUrl, onClose]);

  useEffect(() => {
    if (!sliderRef.current) return;
    const updateWidth = () => {
      if (sliderRef.current) setContainerWidth(sliderRef.current.clientWidth);
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(sliderRef.current);
    return () => ro.disconnect();
  }, [rawSite?.id]);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setTtsPlaying(false);
    setLightboxUrl(null);
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
        <DeccanPatternBg opacity={0.05} />
        <button
          className="dhm-sheet-close-btn"
          onClick={onClose}
          aria-label="Close place details"
          title="Close (Esc)"
        >
          ✕
        </button>

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

        <div className="dhm-detail" style={{ overflowY: "auto", padding: "16px 16px calc(90px + env(safe-area-inset-bottom, 0px))" }}>
          {pending && !site && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              <span className="swirl" style={{ display: "inline-block" }}>
                <Icon name="compass" size={26} color="var(--accent)" />
              </span>
            </div>
          )}

          {site && (
            <>
              {/* Photo Mode Switcher */}
              <div className="dhm-hero-mode-bar">
                <button
                  className={`dhm-hero-mode-pill ${heroTab === "photo" ? "active" : ""}`}
                  onClick={() => setHeroTab("photo")}
                >
                  Photo
                </button>
                <button
                  className={`dhm-hero-mode-pill ${heroTab === "fieldnote" ? "active" : ""}`}
                  onClick={() => setHeroTab("fieldnote")}
                >
                  Field Note
                </button>
                {hasThenNow && (
                  <button
                    className={`dhm-hero-mode-pill ${heroTab === "thennow" ? "active" : ""}`}
                    onClick={() => setHeroTab("thennow")}
                  >
                    Then & Now
                  </button>
                )}
              </div>

              {/* Multi-Mode Hero Display */}
              {heroTab === "thennow" && hasThenNow ? (
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
                      style={{ objectPosition: "center 25%" }}
                      onError={(e) => {
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
                        width: containerWidth ? `${containerWidth}px` : "100%",
                        maxWidth: "none",
                        objectPosition: "center 25%",
                      }}
                      onError={(e) => {
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
              ) : heroTab === "fieldnote" ? (
                <div
                  className="dhm-hero dhm-hero-fieldnote"
                  onClick={() => setPostcardOpen(true)}
                  title="Click to view vintage postcard"
                  style={{ cursor: "pointer", background: "#FAF6EE" }}
                >
                  {site.id === "charminar" ? (
                    <img
                      src="/charminar-field-note.png"
                      alt={`${site.name} Archival Field Note`}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center center",
                      }}
                    />
                  ) : (
                    <div className="dhm-generic-fieldnote-wrap">
                      {site.photos?.[0]?.url && (
                        <img
                          src={site.photos[0].url}
                          alt={site.name}
                          className="dhm-fn-sketch-img"
                        />
                      )}
                      <div className="dhm-fn-overlay">
                        <div className="dhm-fn-tag">DECCAN ARCHIVE • {eraLabel(site.era)}</div>
                        <div className="dhm-fn-title">{site.name}</div>
                        <div className="dhm-fn-meta">
                          <span>{site.lat ? `${site.lat.toFixed(3)}°N, ${site.lng?.toFixed(3)}°E` : "Deccan"}</span>
                          <span>•</span>
                          <span>Built c. {site.startYear || site.yearBuilt || "Historic"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="dhm-hero-expand-badge">
                    <span>Open Postcard</span>
                  </div>
                </div>
              ) : (
                <div
                  className="dhm-hero"
                  onClick={() => site.photos?.[0]?.url && setLightboxUrl(site.photos[0].url)}
                  style={{
                    background: eraColor(site.era),
                    cursor: site.photos?.[0]?.url ? "pointer" : "default",
                  }}
                  title={site.photos?.[0]?.url ? "Click to view full uncropped photo" : undefined}
                >
                  {site.photos?.[0]?.url ? (
                    <img
                      src={site.photos[0].url}
                      alt={site.name}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center 25%",
                        filter: "saturate(1.06) contrast(1.02)",
                      }}
                    />
                  ) : (
                    <TypeIcon type={site.type} size={56} width={1.3} color="rgba(255,255,255,0.9)" />
                  )}
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)`, pointerEvents: "none" }} />
                  {site.photos?.[0]?.url && (
                    <div className="dhm-hero-expand-badge">
                      <span>Full photo</span>
                    </div>
                  )}
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

              {/* 2.5D Charminar puzzle / diorama trigger disabled for now */}
              {false && site.id === "charminar" && onOpenDiorama && (
                <button
                  type="button"
                  onClick={() => onOpenDiorama(site.id)}
                  className="pressable"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "14px 16px",
                    margin: "0 0 16px",
                    borderRadius: "var(--r-md)",
                    background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                    border: "2px solid #D97706",
                    boxShadow: "0 4px 14px rgba(217, 119, 6, 0.18)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FDE68A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="compass" size={20} color="#92400E" />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: "#92400E" }}>
                          Play: The Nizam's Heirloom Mystery
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 800, background: "#D97706", color: "#FFF", padding: "1px 6px", borderRadius: 4, letterSpacing: 0.5 }}>
                          PUZZLE GAME
                        </span>
                      </div>
                      <div style={{ fontSize: 11.5, color: "#78350F", marginTop: 2 }}>
                        Walk 1985 Charminar bazaar & crack 4 tactile cipher locks · +150 pts
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: "#92400E", fontWeight: 800 }}>→</span>
                </button>
              )}

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
                <button
                  className="dhm-btn pressable-sm"
                  onClick={() => setPostcardOpen(true)}
                  title="Generate Vintage Postcard"
                >
                  Postcard
                </button>
                <button className="dhm-btn ghost pressable-sm" onClick={() => onAddToRoute(site.id)} disabled={inRoute}>
                  <Icon name="route" size={15} width={2} color="var(--ink-soft)" />
                  {inRoute ? "In route" : "Add to route"}
                </button>
              </div>

              {/* Curator Credit Badge & Field Note */}
              {site.curatedBy && (
                <div
                  style={{
                    margin: "14px 0 10px",
                    padding: "12px 14px",
                    borderRadius: "var(--r-md, 10px)",
                    background: "linear-gradient(135deg, rgba(194,96,58,0.08) 0%, rgba(217,119,6,0.06) 100%)",
                    border: "1px solid rgba(194,96,58,0.22)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-deep, #c2603a)", letterSpacing: "0.02em" }}>
                        Curated by {site.curatedBy}
                      </span>
                    </div>
                    {site.curationUrl && (
                      <a
                        href={site.curationUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--accent-deep, #c2603a)",
                          textDecoration: "underline",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                        title="View list on Google Maps"
                      >
                        Google Maps List ↗
                      </a>
                    )}
                  </div>
                  {site.curatorNote && (
                    <div
                      style={{
                        fontSize: 12.5,
                        fontStyle: "italic",
                        color: "var(--ink, #2b2119)",
                        lineHeight: 1.45,
                        paddingLeft: 8,
                        borderLeft: "2.5px solid var(--accent, #c2603a)",
                        margin: "4px 0 2px",
                      }}
                    >
                      &ldquo;{site.curatorNote}&rdquo;
                    </div>
                  )}
                  {site.curationSource && (
                    <div style={{ fontSize: 10.5, color: "var(--muted, #7c6f5e)", fontWeight: 500 }}>
                      Collection: <em>{site.curationSource}</em>
                    </div>
                  )}
                </div>
              )}

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

      {/* Vintage Postcard Modal */}
      {postcardOpen && site && (
        <PostcardModal site={site} onClose={() => setPostcardOpen(false)} />
      )}

      {/* Lightbox Modal for Uncropped Full Photo View */}
      {lightboxUrl && site && (
        <div
          className="dhm-lightbox-modal"
          onClick={() => setLightboxUrl(null)}
          role="dialog"
          aria-label="Full size photo view"
        >
          <div className="dhm-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="dhm-lightbox-close"
              onClick={() => setLightboxUrl(null)}
              aria-label="Close photo view"
            >
              ✕
            </button>
            <img src={lightboxUrl} alt={site.name} className="dhm-lightbox-img" />
            <div className="dhm-lightbox-caption">
              <div style={{ fontWeight: 700, fontSize: 14 }}>{site.name}</div>
              {site.photos?.[0]?.credit && (
                <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
                  Credit: {site.photos[0].credit}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

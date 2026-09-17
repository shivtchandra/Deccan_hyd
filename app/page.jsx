"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useReducer } from "react";
import MapCanvas from "./components/MapCanvas.jsx";
import TopBar from "./components/TopBar.jsx";
import FilterBar from "./components/FilterBar.jsx";
import EraTimeline from "./components/EraTimeline.jsx";
import { Icon } from "./components/Icons.jsx";
import CardRail from "./components/CardRail.jsx";
import DetailSheet from "./components/DetailSheet.jsx";
import RoutePanel from "./components/RoutePanel.jsx";
import PassportPanel from "./components/PassportPanel.jsx";
import LeaderboardPanel from "./components/LeaderboardPanel.jsx";
import SubmitSheet from "./components/SubmitSheet.jsx";
import BottomNav from "./components/BottomNav.jsx";
import HeritageSearch from "./components/HeritageSearch.jsx";
import HeritageTrailStoryMode from "./components/HeritageTrailStoryMode.jsx";
import { matchesFilter, scoreOf, ERAS } from "../lib/heritage.js";
import { getState, toggleSaved as ppToggleSaved, stateOf } from "../lib/passport.js";
import { checkIn as doCheckIn } from "../lib/checkin.js";
import { planRoute, encodeRoute, decodeRoute } from "../lib/routing.js";
import { VANISHED_PLACES, HISTORICAL_MAPS, HISTORICAL_PERIODS, HERITAGE_TRAILS, parseStartYear, isSiteActiveInYear } from "../lib/heritageData.js";
import YearScrubber from "./components/YearScrubber.jsx";
import TimeTravelSidebar from "./components/TimeTravelSidebar.jsx";
import ExploreSidebar from "./components/ExploreSidebar.jsx";
import EraGuide from "./components/EraGuide.jsx";
import EraTransition from "./components/EraTransition.jsx";
// import IsometricDiorama from "./components/IsometricDiorama.jsx";
import { ERA_NARRATIVES } from "../lib/eraNarratives.js";

const initialHeritageState = {
  selectedPeriodId: null,
  selectedSiteId: null,
  selectedVanishedId: null,
  mode: "explore",
  selectedTrailId: null,
  currentTrailStopIndex: 0,
  selectedHistoricalMapId: null,
  historicalMapOpacity: 0.75,
  compareMode: "historical",
  showMapOverlay: false,
};

function getInitialHeritageState() {
  if (typeof window === "undefined") return initialHeritageState;
  try {
    const sp = new URLSearchParams(window.location.search);
    const site = sp.get("site");
    const period = sp.get("period");
    if (site) {
      return {
        ...initialHeritageState,
        selectedSiteId: site,
      };
    }
    if (period) {
      const found = HISTORICAL_PERIODS.find((p) => p.id === period || p.name === period || p.short_title === period);
      if (found) {
        return {
          ...initialHeritageState,
          selectedPeriodId: found.id,
        };
      }
    }
  } catch {}
  return initialHeritageState;
}

function heritageReducer(state, action) {
  switch (action.type) {
    case "SELECT_PERIOD":
      return {
        ...state,
        selectedPeriodId: action.periodId,
        // Only clear site when selecting a period (not when clearing to null)
        selectedSiteId: action.periodId ? null : state.selectedSiteId,
        selectedVanishedId: null,
        selectedTrailId: null,
        currentTrailStopIndex: 0,
        mode: "explore",
      };

    case "SELECT_SITE":
      return {
        ...state,
        selectedSiteId: action.siteId,
        selectedVanishedId: null,
        mode: "explore",
      };

    case "SELECT_VANISHED":
      return {
        ...state,
        selectedVanishedId: action.vanishedId,
        selectedSiteId: null,
        mode: "vanished",
      };

    case "SET_MODE":
      return {
        ...state,
        mode: action.mode,
        selectedSiteId: action.mode === "vanished" ? null : state.selectedSiteId,
        selectedVanishedId: action.mode !== "vanished" ? null : state.selectedVanishedId,
        selectedTrailId: action.mode !== "trail" ? null : state.selectedTrailId,
        currentTrailStopIndex: action.mode !== "trail" ? 0 : state.currentTrailStopIndex,
      };

    case "SELECT_HISTORICAL_MAP":
      return {
        ...state,
        selectedHistoricalMapId: action.mapId,
        showMapOverlay: true,
      };

    case "SET_MAP_OPACITY":
      return {
        ...state,
        historicalMapOpacity: Math.min(1, Math.max(0, action.opacity)),
      };

    case "SET_COMPARE_MODE":
      return {
        ...state,
        compareMode: action.mode,
      };

    case "TOGGLE_MAP_OVERLAY":
      return {
        ...state,
        showMapOverlay: !state.showMapOverlay,
      };

    case "START_TRAIL":
      return {
        ...state,
        mode: "trail",
        selectedTrailId: action.trailId,
        currentTrailStopIndex: 0,
        selectedSiteId: null,
        selectedVanishedId: null,
      };

    case "NEXT_TRAIL_STOP":
      return {
        ...state,
        currentTrailStopIndex: state.currentTrailStopIndex + 1,
      };

    case "EXIT_TRAIL":
      return {
        ...state,
        mode: "explore",
        selectedTrailId: null,
        currentTrailStopIndex: 0,
      };

    default:
      return state;
  }
}

// True only when at least one real (non-OSM-placeholder) raster tile URL exists
const HAS_REAL_OVERLAY = HISTORICAL_MAPS.some(
  (m) => m.image_url && !m.image_url.includes("openstreetmap.org")
);

const isUsableHistoricalMap = (m) =>
  m && m.published !== false && m.image_url && !String(m.image_url).includes("openstreetmap.org");

const firstUsableHistoricalMapId = () =>
  (HISTORICAL_MAPS.find(isUsableHistoricalMap) || {}).id || null;

const emptyFilter = () => ({
  eras: new Set(),
  types: new Set(),
  statuses: new Set(),
  atRiskOnly: false,
  getawaysOnly: false,
  vanishedOnly: false,
  q: "",
});

export default function Page() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(emptyFilter);
  const [detail, setDetail] = useState({});
  const [detailPending, setDetailPending] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return Boolean(new URLSearchParams(window.location.search).get("site"));
    } catch {
      return false;
    }
  });
  const [passport, setPassport] = useState({ visited: {}, saved: {} });
  const [tab, setTab] = useState("map");
  const [routeIds, setRouteIds] = useState([]);
  const [planned, setPlanned] = useState(null);
  const [planning, setPlanning] = useState(false);
  const [presets, setPresets] = useState([]);
  const [submitPin, setSubmitPin] = useState(null);
  const [pickMode, setPickMode] = useState(false);
  const [toast, setToast] = useState("");
  const [userLoc, setUserLoc] = useState(null);
  const [originChapterOpen, setOriginChapterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null); // null = off; number = time-travel active
  const [overlayPanelOpen, setOverlayPanelOpen] = useState(false);
  const [baseTile, setBaseTile] = useState("standard");
  const [eraTransition, setEraTransition] = useState(null);
  const prevEraKeyRef = useRef(null);
  const [activeDiorama, setActiveDiorama] = useState(null);
  const [exploreSubTab, setExploreSubTab] = useState("origins");
  const [selectedOriginId, setSelectedOriginId] = useState(null);
  const [explorersData, setExplorersData] = useState(null);

  // Central Heritage State using reducer with initial URL state
  const [heritageState, dispatch] = useReducer(heritageReducer, null, getInitialHeritageState);

  const mapApi = useRef(null);

  // Derived state from heritageState - don't store these separately
  const selectedId = heritageState.selectedSiteId;
  const selectedVanished = heritageState.selectedVanishedId 
    ? VANISHED_PLACES.find(p => p.id === heritageState.selectedVanishedId) || null 
    : null;
  const selectedPeriodId = heritageState.selectedPeriodId;
  const activeTrail = heritageState.selectedTrailId 
    ? HERITAGE_TRAILS.find(t => t.id === heritageState.selectedTrailId) || null 
    : null;
  const trailStopIndex = heritageState.currentTrailStopIndex;
  const showMapOverlay = heritageState.showMapOverlay;
  const selectedHistoricalMapId = heritageState.selectedHistoricalMapId;
  const historicalMapOpacity = heritageState.historicalMapOpacity;
  const compareMode = heritageState.compareMode;

  const goToStop = useCallback(
    (site) => {
      if (!site || !mapApi.current) return;
      mapApi.current.flyTo(site.lat, site.lng, 16);
      dispatch({ type: "SELECT_SITE", siteId: site.id });
      setSheetOpen(true);
    },
    []
  );

  const flash = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2600);
  };

  // ---- load & restore persisted state ----
  useEffect(() => {
    setPassport(getState());
    fetch("/sites-index.json")
      .then((r) => r.json())
      .then((rows) => {
        setSites(Array.isArray(rows) ? rows : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    fetch("/api/routes")
      .then((r) => r.json())
      .then((d) => setPresets(d.routes || []))
      .catch(() => {});

    const sp = new URLSearchParams(window.location.search);
    const hasExplicitUrlParams = sp.toString().length > 0;
    let savedState = {};
    if (!hasExplicitUrlParams) {
      try {
        const stored = localStorage.getItem("dhm_active_state");
        if (stored) savedState = JSON.parse(stored);
      } catch {}
    }

    const urlTab = sp.get("tab") || savedState.tab;
    const site = sp.get("site") || (hasExplicitUrlParams ? null : savedState.site);
    const period = sp.get("period") || (hasExplicitUrlParams ? null : savedState.period);
    const trail = sp.get("trail");
    const diorama = sp.get("diorama") || savedState.diorama;
    const origin = sp.get("origin") || savedState.origin;
    const r = decodeRoute(sp.get("r"));

    if (urlTab) {
      setTab(urlTab);
    }
    if (diorama) {
      setActiveDiorama(diorama);
    }
    if (origin) {
      setOriginChapterOpen(true);
    }
    if (period) {
      const found = HISTORICAL_PERIODS.find((p) => p.id === period || p.name === period || p.short_title === period);
      if (found) dispatch({ type: "SELECT_PERIOD", periodId: found.id });
    }
    if (site) {
      dispatch({ type: "SELECT_SITE", siteId: site });
      setSheetOpen(true);
      setTab("map");
      fetch(`/api/sites/${site}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setDetail((m) => ({ ...m, [site]: data }));
        })
        .catch(() => {});
    }
    if (trail) {
      const found = HERITAGE_TRAILS.find((t) => t.id === trail || t.slug === trail);
      if (found) dispatch({ type: "START_TRAIL", trailId: found.id });
    }
    if (r.length >= 2) {
      setRouteIds(r);
      setTab("routes");
    }
  }, []);

  // ---- sync active state to URL & LocalStorage so refresh (F5/Cmd+R) NEVER resets to homepage ----
  useEffect(() => {
    if (loading || typeof window === "undefined") return;
    const params = new URLSearchParams();

    if (tab && tab !== "map") params.set("tab", tab);
    if (selectedId) params.set("site", selectedId);
    if (selectedPeriodId) params.set("period", selectedPeriodId);
    if (activeDiorama) params.set("diorama", activeDiorama);
    if (originChapterOpen) params.set("origin", "true");
    if (activeTrail?.id) params.set("trail", activeTrail.id);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;

    window.history.replaceState(null, "", newUrl);

    try {
      localStorage.setItem("dhm_active_state", JSON.stringify({
        tab,
        site: selectedId,
        period: selectedPeriodId,
        diorama: activeDiorama,
        origin: Boolean(originChapterOpen),
        trail: activeTrail?.id,
      }));
    } catch {}
  }, [tab, selectedId, selectedPeriodId, activeDiorama, originChapterOpen, activeTrail, loading]);

  // ---- lazy detail ----
  useEffect(() => {
    if (!selectedId || detail[selectedId]) return;
    setDetailPending(true);
    fetch(`/api/sites/${selectedId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setDetail((m) => ({ ...m, [selectedId]: d }));
      })
      .finally(() => setDetailPending(false));
  }, [selectedId, detail]);

  // ---- derived ----
  const filtered = useMemo(() => {
    // Year-scrubber mode: show only sites that existed at selectedYear
    if (selectedYear !== null) {
      return sites
        .filter((s) => isSiteActiveInYear(s, selectedYear))
        .sort((a, b) => scoreOf(b) - scoreOf(a));
    }

    const f = { ...filter, q: filter.q.trim().toLowerCase() };
    let result = sites.filter((s) => matchesFilter(s, f));

    if (heritageState.mode === "vanished") {
      result = result.slice(0, Math.min(result.length, 5));
    }

    if (selectedPeriodId) {
      const period = HISTORICAL_PERIODS.find(p => p.id === selectedPeriodId);
      if (period) {
        result = result.filter(site => {
          const siteYear = site.startYear || parseStartYear(site.yearBuilt, site.era);
          return siteYear >= period.start_year && siteYear <= period.end_year;
        });
      }
    }

    return result.sort((a, b) => scoreOf(b) - scoreOf(a));
  }, [sites, filter, heritageState.mode, selectedPeriodId, selectedYear]);

  const activeVanishedPlaces = useMemo(() => {
    if (selectedYear !== null) {
      return VANISHED_PLACES.filter((v) => v.start_year <= selectedYear && v.end_year >= selectedYear);
    }
    const q = filter.q.trim().toLowerCase();
    if (filter.vanishedOnly || q.includes("vanished") || q.includes("gate")) {
      return VANISHED_PLACES;
    }
    return [];
  }, [selectedYear, filter.vanishedOnly, filter.q]);

  const sitesById = useMemo(() => new Map(sites.map((s) => [s.id, s])), [sites]);
  const historicalMapsAvailable = useMemo(
    () => HISTORICAL_MAPS.filter(isUsableHistoricalMap),
    []
  );
  const activePeriod = selectedPeriodId ? HISTORICAL_PERIODS.find((p) => p.id === selectedPeriodId) || null : null;
  const effectiveMapOpacity = useMemo(() => {
    if (compareMode === "modern") return 0;
    if (compareMode === "split") return Math.min(0.75, historicalMapOpacity);
    return historicalMapOpacity;
  }, [compareMode, historicalMapOpacity]);

  useEffect(() => {
    if (!selectedPeriodId) return;
    // Sync to a usable map for this period (skip unpublished / empty image records)
    const matchingMaps = HISTORICAL_MAPS.filter(
      (m) => m.period_id === selectedPeriodId && isUsableHistoricalMap(m)
    );
    if (matchingMaps.length === 0) return;
    const belongsToPeriod = matchingMaps.some((m) => m.id === selectedHistoricalMapId);
    if (!belongsToPeriod) {
      dispatch({ type: "SELECT_HISTORICAL_MAP", mapId: matchingMaps[0].id });
    }
  }, [selectedPeriodId, selectedHistoricalMapId]);

  // Opening Old Maps with no selection left the dropdown looking selected while the overlay stayed empty
  useEffect(() => {
    if (!showMapOverlay) return;
    const selected = HISTORICAL_MAPS.find((m) => m.id === selectedHistoricalMapId);
    if (selectedHistoricalMapId && isUsableHistoricalMap(selected)) return;
    const fallbackId = firstUsableHistoricalMapId();
    if (fallbackId) dispatch({ type: "SELECT_HISTORICAL_MAP", mapId: fallbackId });
  }, [showMapOverlay, selectedHistoricalMapId]);

  const selectedEraKey = filter.eras.size === 1 ? Array.from(filter.eras)[0] : null;

  useEffect(() => {
    if (filter.eras.size === 0) {
      dispatch({ type: "SELECT_PERIOD", periodId: null });
      prevEraKeyRef.current = null;
      return;
    }

    const nextEra = Array.from(filter.eras)[0];
    const nextPeriod = HISTORICAL_PERIODS.find((p) => mapEraFromPeriod(p) === nextEra) || null;
    dispatch({ type: "SELECT_PERIOD", periodId: nextPeriod ? nextPeriod.id : null });

    if (nextEra && nextEra !== prevEraKeyRef.current) {
      const content = ERA_NARRATIVES[nextEra];
      if (content) setEraTransition({ eraKey: nextEra, label: ERAS[nextEra]?.label || nextEra, hook: content.hook });
    }
    prevEraKeyRef.current = nextEra;
  }, [filter.eras]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync map to period changes
  useEffect(() => {
    if (!selectedPeriodId || !mapApi.current) return;
    
    const period = HISTORICAL_PERIODS.find(p => p.id === selectedPeriodId);
    if (!period) return;
    
    // Get sites for this period
    const periodSites = sites.filter(site => {
      const siteYear = site.startYear || parseStartYear(site.yearBuilt, site.era);
      return siteYear >= period.start_year && siteYear <= period.end_year;
    });
    
    if (periodSites.length === 0) return;
    
    // Calculate bounds from period sites
    const lats = periodSites.map(s => s.lat);
    const lngs = periodSites.map(s => s.lng);
    const bounds = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ];
    
    mapApi.current.fitRoute(bounds);
  }, [selectedPeriodId, sites]);

  // Sync map to site selection
  useEffect(() => {
    if (!selectedId || !mapApi.current) return;
    
    const site = sitesById.get(selectedId);
    if (!site) return;
    
    mapApi.current.flyTo(site.lat, site.lng, 16);
  }, [selectedId, sitesById]);

  // Cinematic Documentary Chapters for Time Travel Camera Moves & Subtitles
  const activeDocChapter = useMemo(() => {
    if (selectedYear === null) return null;
    const CHAPTERS = [
      { start: 1562, end: 1686, center: [17.3616, 78.4747], zoom: 13.5, title: "1591: Charminar & Golden Age", text: "Muhammad Quli Qutb Shah crosses the Musi, building Charminar & founding Hyderabad." },
      { start: 1687, end: 1723, center: [17.3750, 78.4680], zoom: 13.5, title: "1687: Mughal Siege of Golconda", text: "Aurangzeb's 8-month siege ends the Qutb Shahi dynasty. Hyderabad becomes a Mughal Subah." },
      { start: 1724, end: 1797, center: [17.3650, 78.4710], zoom: 13.5, title: "1724: Asaf Jahi Dynasty", text: "Nizam-ul-Mulk establishes the Deccan state. Walled city, gates & Chowmahalla Palace rise." },
      { start: 1798, end: 1868, center: [17.3880, 78.4820], zoom: 13.5, title: "1798: Subsidiary Alliance", text: "British Residency at Koti and Secunderabad Cantonment shape a twin city silhouette." },
      { start: 1869, end: 1907, center: [17.3850, 78.4650], zoom: 13.5, title: "1869: Railways & Aristocratic Splendour", text: "Nizam VI Mahbub Ali Khan expands state railways, Falaknuma & Errum Manzil palaces." },
      { start: 1908, end: 1947, center: [17.3730, 78.4740], zoom: 13.5, title: "1908: Great Musi Flood & CIB Rebuild", text: "The City Improvement Board hires Vincent Esch to design the High Court, OGH & civic monuments." },
      { start: 1948, end: 1997, center: [17.4080, 78.4700], zoom: 13.5, title: "1948: Integration & Statehood", text: "Operation Polo integrates Hyderabad. Hussain Sagar promenade & public institutions expand." },
      { start: 1998, end: 2026, center: [17.4250, 78.4200], zoom: 13.0, title: "1998: Cyberabad & Modern Era", text: "Cyber Towers & HITEC City propel Hyderabad into a premier global technology powerhouse." },
    ];
    return CHAPTERS.find((c) => selectedYear >= c.start && selectedYear <= c.end) || CHAPTERS[0];
  }, [selectedYear]);

  // Smooth cinematic camera panning when advancing into a new documentary chapter during Time Travel
  const prevChapterTitleRef = useRef(null);
  useEffect(() => {
    if (selectedYear === null || !activeDocChapter || !mapApi.current) return;
    if (activeDocChapter.title !== prevChapterTitleRef.current) {
      prevChapterTitleRef.current = activeDocChapter.title;
      if (mapApi.current.panTo) {
        mapApi.current.panTo(activeDocChapter.center[0], activeDocChapter.center[1], 1.2);
      } else {
        mapApi.current.flyTo(activeDocChapter.center[0], activeDocChapter.center[1], activeDocChapter.zoom);
      }
    }
  }, [selectedYear, activeDocChapter]);

  // Auto-clear selected site or vanished place when playback year moves past active dates
  useEffect(() => {
    if (selectedYear === null) return;
    if (selectedVanished) {
      if (selectedYear < selectedVanished.start_year || selectedYear > selectedVanished.end_year) {
        dispatch({ type: "SELECT_VANISHED", vanishedId: null });
      }
    }
    if (selectedId) {
      const site = sitesById.get(selectedId);
      if (site && !isSiteActiveInYear(site, selectedYear)) {
        dispatch({ type: "SELECT_SITE", siteId: null });
        setSheetOpen(false);
      }
    }
  }, [selectedYear, selectedVanished, selectedId, sitesById]);

  // Handle vanished mode from filter
  useEffect(() => {
    if (filter.vanishedOnly) {
      dispatch({ type: "SET_MODE", mode: "vanished" });
    } else if (heritageState.mode === "vanished") {
      dispatch({ type: "SET_MODE", mode: "explore" });
    }
  }, [filter.vanishedOnly]);

  const mapEraFromPeriod = (period) => {
    if (!period) return "qutb-shahi";
    const start = Number(period.start_year || 0);
    if (start < 1518) return "earlier";
    if (start >= 1518 && start <= 1687) return "qutb-shahi";
    if (start >= 1724 && start < 1798) return "asaf-jahi";
    if (start >= 1798 && start < 1869) return "british-residency";
    if (start >= 1869 && start < 1948) return "nizam-civic";
    if (start >= 1948) return "post-independence";
    return "post-independence";
  };

  const routeStops = useMemo(
    () => routeIds.map((id) => sitesById.get(id)).filter(Boolean),
    [routeIds, sitesById]
  );

  const activeRouteIds = tab === "routes" || planned ? routeIds : [];

  const handleTabChange = (nextTab) => {
    if (nextTab !== "explore") setOriginChapterOpen(false);
    if (nextTab !== "map") {
      setSheetOpen(false);
      dispatch({ type: "SELECT_SITE", siteId: null });
      dispatch({ type: "SELECT_VANISHED", vanishedId: null });
    }
    setTab(nextTab);
  };

  // ---- handlers ----
  const handleReady = useCallback((api) => {
    mapApi.current = api;
    if (selectedId) {
      const s = sitesById.get(selectedId);
      if (s) api.flyTo(s.lat, s.lng, 16);
    }
  }, [selectedId, sitesById]);

  const handleSelect = (id) => {
    dispatch({ type: "SELECT_SITE", siteId: id });
    const s = sitesById.get(id);
    if (s && mapApi.current) mapApi.current.flyTo(s.lat, s.lng, 16);
    setSheetOpen(true);
  };

  const handleSelectVanished = (place) => {
    dispatch({ type: "SELECT_VANISHED", vanishedId: place ? place.id : null });
    setSheetOpen(false);
    if (place && mapApi.current) mapApi.current.flyTo(place.lat, place.lng, 16);
  };

  const onToggleSaved = (id) => setPassport(ppToggleSaved(id));

  const locateMe = () => {
    if (!navigator.geolocation) {
      flash("Location not available on this device.");
      return;
    }
    flash("Finding you…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(loc);
        if (mapApi.current) mapApi.current.flyTo(loc.lat, loc.lng, 14);
        flash("Located — distances are from you now.");
      },
      () => flash("Couldn't get your location."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const onCheckIn = (site) => {
    if (!navigator.geolocation) {
      setPassport(getState());
      flash("Marked visited (no location available).");
      doCheckIn(site.id, null).then(() => setPassport(getState()));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await doCheckIn(site.id, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setPassport(getState());
        if (res.server)
          flash(
            res.already ? "Already checked in here." : `Checked in — +${res.awarded || 0} pts on the board.`
          );
        else if (res.reason === "too-far")
          flash(`Marked visited. You're ${res.distanceKm} km away, so it won't count on the board.`);
        else flash("Marked visited.");
      },
      () => {
        doCheckIn(site.id, null).then(() => setPassport(getState()));
        flash("Marked visited (location denied).");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const addToRoute = (id) => {
    setRouteIds((r) => (r.includes(id) ? r : [...r, id]));
    setPlanned(null);
    flash("Added to route.");
  };
  const removeFromRoute = (id) => {
    setRouteIds((r) => r.filter((x) => x !== id));
    setPlanned(null);
  };
  const clearRoute = () => {
    setRouteIds([]);
    setPlanned(null);
  };
  const loadPreset = (p) => {
    setRouteIds(p.siteIds || []);
    setPlanned(null);
  };

  const runPlan = async () => {
    setPlanning(true);
    const res = await planRoute(routeIds);
    setPlanning(false);
    if (!res.ok) {
      flash("Could not plan the walk.");
      return;
    }
    setRouteIds(res.ordered);
    setPlanned(res);
    if (res.geometry?.coordinates && mapApi.current) {
      mapApi.current.fitRoute(res.geometry.coordinates.map(([lng, lat]) => [lat, lng]));
    }
  };

  const shareRoute = async () => {
    const url = `${window.location.origin}${window.location.pathname}?r=${encodeRoute(routeIds)}`;
    try {
      await navigator.clipboard.writeText(url);
      flash("Route link copied.");
    } catch {
      flash(url);
    }
  };

  const onMapPick = (pt) => {
    if (!pickMode) return;
    setSubmitPin(pt);
    setPickMode(false);
    setTab("submit");
    flash("Pin set.");
  };

  const currentSite = selectedId ? (detail[selectedId] || sitesById.get(selectedId) || null) : null;
  const visitedCount = Object.keys(passport.visited).length;

  return (
    <div className="app">
      {/* Top bar */}
      <div className="dhm-topbar">
        <TopBar
          q={filter.q}
          setQ={(q) => setFilter((f) => ({ ...f, q }))}
          count={sites.length}
          visitedCount={visitedCount}
          eraKey={selectedEraKey}
          onOpenSearch={() => setSearchOpen(true)}
          variant="desktop"
        />
      </div>

      {/* Mobile-only era filter strip (desktop sidebar replaces this) */}
      <div className="dhm-mobile-only">
        {tab === "map" && selectedYear === null && (
          <>
            <EraTimeline
              filter={filter}
              setFilter={setFilter}
              onTimeTravelOpen={() => {
                setSelectedYear(1562);
                if (mapApi.current) mapApi.current.flyTo(17.385, 78.460, 13);
              }}
            />
            <FilterBar filter={filter} setFilter={setFilter} />
          </>
        )}
      </div>

      {/* Desktop sidebar: Time Travel companion rail, Origins/Explorers rail, OR standard monument list */}
      <div className="dhm-sidebar">
        {selectedYear !== null ? (
          <TimeTravelSidebar
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            onClose={() => setSelectedYear(null)}
            sites={sites}
            selectedId={selectedId}
            onSelectSite={handleSelect}
          />
        ) : tab === "explore" ? (
          <ExploreSidebar
            activeTab={exploreSubTab}
            onTabChange={setExploreSubTab}
            selectedOriginId={selectedOriginId}
            onSelectOrigin={(id) => setSelectedOriginId(id)}
            tab={tab}
            onNavTabChange={handleTabChange}
            visitedCount={visitedCount}
            explorersData={explorersData}
          />
        ) : (
          <>
            <div className="dhm-sidebar-era">
              <EraTimeline
                filter={filter}
                setFilter={setFilter}
                layout="sidebar"
                onTimeTravelOpen={() => {
                  setSelectedYear(1562);
                  if (mapApi.current) mapApi.current.flyTo(17.385, 78.460, 13);
                }}
              />
              <FilterBar filter={filter} setFilter={setFilter} />
            </div>
            <CardRail
              layout="list"
              sites={filtered}
              selectedId={selectedId}
              onSelect={handleSelect}
              onOpen={() => setSheetOpen(true)}
              userLoc={userLoc}
            />
            <BottomNav variant="sidebar" tab={tab} onTab={handleTabChange} visitedCount={visitedCount} />
          </>
        )}
      </div>

      <div className="mapwrap">
        {/* Floating Time Travel Scrubber bar — visible on all screen sizes when Time Travel is active */}
        {selectedYear !== null && tab === "map" && (
          <div className="tt-scrubber-banner">
            <YearScrubber
              year={selectedYear}
              onChange={setSelectedYear}
              onClose={() => {
                setSelectedYear(null);
                dispatch({ type: "SELECT_VANISHED", vanishedId: null });
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="loading">Loading Hyderabad’s heritage…</div>
        ) : (
          <MapCanvas
            sites={filtered}
            routeStops={routeStops}
            selectedId={selectedId}
            onSelect={(id) => {
              handleSelect(id);
            }}
            passport={passport}
            routeIds={activeRouteIds}
            routeGeometry={planned?.geometry || null}
            pickMode={pickMode}
            onPick={onMapPick}
            onReady={handleReady}
            userLoc={userLoc}
            vanishedPlaces={activeVanishedPlaces}
            selectedVanished={selectedVanished}
            onSelectVanished={handleSelectVanished}
            activeMapOverlayId={showMapOverlay ? selectedHistoricalMapId : null}
            mapOverlayOpacity={effectiveMapOpacity}
            activeTrail={activeTrail}
            trailStopIndex={trailStopIndex}
            onTrailStopSelect={(site) => {
              const newIndex = Math.max(0, (activeTrail?.stops || []).findIndex((s) => s.site_id === site.id));
              dispatch({ type: "SELECT_SITE", siteId: site.id });
              goToStop(site);
            }}
            baseTile={baseTile}
            isTimeTravel={selectedYear !== null}
          />
        )}

        {/* Cinematic Documentary Subtitle Banner — floats during Time Travel */}
        {selectedYear !== null && activeDocChapter && tab === "map" && !selectedVanished && !selectedId && (
          <div className="tt-doc-banner material">
            <div className="tt-doc-title">{activeDocChapter.title}</div>
            <div className="tt-doc-text">{activeDocChapter.text}</div>
          </div>
        )}

        {/* Locate Me Button */}
        {tab === "map" && !loading && (
          <button
            className="dhm-locate pressable-sm material"
            onClick={locateMe}
            aria-label="Show my location"
            data-on={!!userLoc}
          >
            <Icon name="locate" size={20} width={2} color={userLoc ? "var(--era-qutb-shahi)" : "var(--ink-soft)"} />
          </button>
        )}

        {/* Era Guide (narration + ambient audio) */}
        {tab === "map" && !loading && (
          <EraGuide eraKey={selectedEraKey} />
        )}


        {/* Map style toggle */}
        {tab === "map" && !loading && (
          <button
            className="dhm-tile-toggle pressable-sm material"
            data-on={baseTile === "natgeo"}
            onClick={() => setBaseTile((t) => t === "standard" ? "natgeo" : "standard")}
            aria-label="Toggle map style"
          >
            <Icon name="palette" size={16} width={2} color={baseTile === "natgeo" ? "var(--accent-deep)" : "var(--ink-soft)"} />
            <span>{baseTile === "natgeo" ? "Illustrated" : "Classic"}</span>
          </button>
        )}

        {/* Historical Map Overlay Button - Always visible in map mode */}
        {tab === "map" && !loading && (
          <button
            className="dhm-map-overlay-btn pressable-sm material"
            data-on={showMapOverlay}
            onClick={() => {
              if (showMapOverlay) {
                setOverlayPanelOpen((v) => !v);
                return;
              }
              const fallbackId = selectedHistoricalMapId || firstUsableHistoricalMapId();
              if (fallbackId) {
                dispatch({ type: "SELECT_HISTORICAL_MAP", mapId: fallbackId });
              } else {
                dispatch({ type: "TOGGLE_MAP_OVERLAY" });
              }
              dispatch({ type: "SET_COMPARE_MODE", mode: "historical" });
              if (historicalMapOpacity < 0.05) dispatch({ type: "SET_MAP_OPACITY", opacity: 0.75 });
              setOverlayPanelOpen(true);
            }}
            aria-label="Toggle Historical Maps"
            style={{ zIndex: 430 }}
          >
            <Icon name="layers" size={17} width={2} color={showMapOverlay ? "#fff" : "var(--ink-soft)"} />
            <span>Old Maps</span>
          </button>
        )}

        {/* Historical Map Controls Popup - Always show when overlay is enabled, regardless of site selection */}
        {showMapOverlay && overlayPanelOpen && tab === "map" && (
          <div className="dhm-map-overlay-panel material" style={{ zIndex: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>HISTORICAL MAP OVERLAY</span>
              <button onClick={() => setOverlayPanelOpen(false)} aria-label="Close historical map overlay" style={{ color: "var(--ink-soft)", fontSize: 13 }}>✕</button>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 8 }}>
              {activePeriod ? `${activePeriod.name}` : "Current city"}
            </div>
            {historicalMapsAvailable.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.45, paddingTop: 4 }}>
                No historical map available for this period yet.
              </div>
            ) : (
              <>
                <select
                  value={selectedHistoricalMapId || ""}
                  onChange={(e) => dispatch({ type: "SELECT_HISTORICAL_MAP", mapId: e.target.value })}
                  style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--cream-hi)", fontSize: 12, color: "var(--ink)" }}
                >
                  {historicalMapsAvailable.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.year} — {m.title}
                    </option>
                  ))}
                </select>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "var(--ink-soft)" }}>
                  <span>
                    {compareMode === "modern"
                      ? "Overlay hidden"
                      : `Opacity: ${Math.round(effectiveMapOpacity * 100)}%`}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={historicalMapOpacity}
                    disabled={compareMode === "modern"}
                    onChange={(e) => dispatch({ type: "SET_MAP_OPACITY", opacity: parseFloat(e.target.value) })}
                    style={{ width: 120, accentColor: "var(--accent)", opacity: compareMode === "modern" ? 0.4 : 1 }}
                  />
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {[
                    { id: "modern", label: "Modern" },
                    { id: "historical", label: "Historical" },
                    { id: "split", label: "Split" },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        const fallbackId = selectedHistoricalMapId || firstUsableHistoricalMapId();
                        if (fallbackId && fallbackId !== selectedHistoricalMapId) {
                          dispatch({ type: "SELECT_HISTORICAL_MAP", mapId: fallbackId });
                        }
                        if (preset.id !== "modern" && historicalMapOpacity < 0.05) {
                          dispatch({ type: "SET_MAP_OPACITY", opacity: 0.75 });
                        }
                        dispatch({ type: "SET_COMPARE_MODE", mode: preset.id });
                      }}
                      style={{
                        borderRadius: 999,
                        border: "1px solid var(--line)",
                        background: compareMode === preset.id ? "var(--accent)" : "var(--cream-hi)",
                        color: compareMode === preset.id ? "#fff" : "var(--ink)",
                        padding: "5px 10px",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </>
            )}
            <button
              onClick={() => { dispatch({ type: "TOGGLE_MAP_OVERLAY" }); setOverlayPanelOpen(false); }}
              style={{ marginTop: 4, fontSize: 11, color: "var(--ink-soft)", background: "none", border: "1px solid var(--line)", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}
            >
              Remove overlay
            </button>
          </div>
        )}

        {/* Compact Time Travel Floating Place Card (doesn't obstruct Scrubber or Map playback) */}
        {selectedYear !== null && tab === "map" && (selectedVanished || selectedId) && (
          <div className="tt-place-card material">
            {selectedVanished ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span className="tt-place-badge">
                      ⏳ VANISHED PLACE ({selectedVanished.start_year} — {selectedVanished.end_year})
                    </span>
                    <h4 className="tt-place-title">{selectedVanished.name}</h4>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{selectedVanished.current_location}</div>
                  </div>
                  <button onClick={() => dispatch({ type: "SELECT_VANISHED", vanishedId: null })} aria-label="Close vanished place details" style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 16, cursor: "pointer" }}>✕</button>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink)", marginTop: 6, lineHeight: 1.35 }}>
                  <b>Then:</b> {selectedVanished.what_existed}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 4 }}>
                  <b>Today:</b> {selectedVanished.what_exists_now}
                </div>
              </>
            ) : (
              currentSite && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span className="tt-place-badge" style={{ color: "var(--accent-deep)", background: "var(--accent-wash)" }}>
                        HISTORIC SITE ({currentSite.startYear || currentSite.yearBuilt || "Built in Era"})
                      </span>
                      <h4 className="tt-place-title">{currentSite.name}</h4>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{currentSite.area || "Hyderabad"}</div>
                    </div>
                    <button onClick={() => dispatch({ type: "SELECT_SITE", siteId: null })} aria-label="Close place details" style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 16, cursor: "pointer" }}>✕</button>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 6, lineHeight: 1.35 }}>
                    {currentSite.summary}
                  </div>
                  <button
                    onClick={() => setSheetOpen(true)}
                    style={{ background: "none", border: "none", color: "var(--accent-deep)", fontSize: 12, fontWeight: 700, marginTop: 6, cursor: "pointer", padding: 0 }}
                  >
                    Read full story ↗
                  </button>
                </>
              )
            )}
          </div>
        )}

        {/* Full Vanished Place Card — only rendered in standard map explore mode */}
        {selectedYear === null && selectedVanished && tab === "map" && (
          <div
            className="material"
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              top: 112,
              bottom: 84,
              overflowY: "auto",
              padding: "16px 18px",
              borderRadius: "var(--r-lg)",
              border: "1.5px solid var(--pop)",
              boxShadow: "var(--e3)",
              zIndex: 420,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--pop)" }}>
                  What Used to Be Here? ({selectedVanished.start_year} — {selectedVanished.end_year})
                </span>
                <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "var(--ink)" }}>{selectedVanished.name}</h3>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{selectedVanished.current_location}</div>
              </div>
              <button onClick={() => dispatch({ type: "SELECT_VANISHED", vanishedId: null })} aria-label="Close vanished place details" style={{ color: "var(--ink-soft)", fontSize: 16 }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: "var(--cream-hi)", padding: 10, borderRadius: 8, border: "1px solid var(--line)" }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--pop)", textTransform: "uppercase" }}>THEN</div>
                <div style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.35 }}>{selectedVanished.what_existed}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-deep)", textTransform: "uppercase" }}>TODAY</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.35 }}>{selectedVanished.what_exists_now}</div>
              </div>
            </div>

            <div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.4 }}>
              <b>Reason for change: </b>{selectedVanished.reason_for_change}
            </div>
          </div>
        )}


        {pickMode && <div className="map-hint">Tap the map where the building stands</div>}

        {/* Detail Sheet with Then ↔ Now Slider */}
        {tab === "map" && sheetOpen && selectedId && (
          <DetailSheet
            site={currentSite}
            pending={detailPending}
            passportState={stateOf(passport, selectedId)}
            inRoute={routeIds.includes(selectedId)}
            onToggleSaved={onToggleSaved}
            onCheckIn={onCheckIn}
            onAddToRoute={addToRoute}
            onClose={() => {
              setSheetOpen(false);
              dispatch({ type: "SELECT_SITE", siteId: null });
            }}
            userLoc={userLoc}
            onOpenDiorama={(id) => setActiveDiorama(id)}
          />
        )}

        {/* 2.5D Isometric Illustrated Diorama Modal — commented out for now */}
        {/* {activeDiorama && (
          <IsometricDiorama onClose={() => setActiveDiorama(null)} />
        )} */}

        {/* Routes Tab */}
        {tab === "routes" && (
          <RoutePanel
            routeIds={routeIds}
            sitesById={sitesById}
            planned={planned}
            planning={planning}
            presets={presets}
            trails={HERITAGE_TRAILS}
            onRemove={removeFromRoute}
            onReorderClear={clearRoute}
            onPlan={runPlan}
            onLoadPreset={loadPreset}
            onStartTrail={(trailId) => {
              dispatch({ type: "START_TRAIL", trailId });
              setTab("map");
            }}
            onShare={shareRoute}
            onClose={() => setTab("map")}
          />
        )}

        {/* Explore Tab (Origins & Explorers) */}
        {tab === "explore" && (
          <LeaderboardPanel
            activeTab={exploreSubTab}
            onTabChange={setExploreSubTab}
            selectedOriginId={selectedOriginId}
            onSelectOriginId={setSelectedOriginId}
            onChapterChange={setOriginChapterOpen}
            onExplorerStateReady={setExplorersData}
          />
        )}

        {/* Passport Tab */}
        {tab === "passport" && (
          <PassportPanel
            sites={sites}
            passport={passport}
            onPick={(id) => {
              setTab("map");
              handleSelect(id);
              setSheetOpen(true);
            }}
          />
        )}

        {/* Submit Tab */}
        {tab === "submit" && (
          <SubmitSheet
            pin={submitPin}
            onRequestPin={() => {
              setTab("map");
              setPickMode(true);
            }}
            onClose={() => {
              setTab("map");
              setPickMode(false);
            }}
            onDone={(m) => {
              setSubmitPin(null);
              setTab("map");
              flash(m);
            }}
          />
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>

      <HeritageSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        sites={sites}
        onSelectSite={(id) => {
          setSearchOpen(false);
          dispatch({ type: "SELECT_SITE", siteId: id });
          setSheetOpen(true);
          const s = sitesById.get(id);
          if (s && mapApi.current) mapApi.current.flyTo(s.lat, s.lng, 16);
        }}
        onSelectVanished={(place) => {
          setSearchOpen(false);
          handleSelectVanished(place);
        }}
        onSelectTrail={(trail) => {
          setSearchOpen(false);
          dispatch({ type: "START_TRAIL", trailId: trail.id });
          setTab("map");
          const found = HISTORICAL_PERIODS.find((p) => p.id === trail.period_id);
          if (found) dispatch({ type: "SELECT_PERIOD", periodId: found.id });
          const firstSite = sitesById.get(trail.stops?.[0]?.site_id);
          if (firstSite && mapApi.current) mapApi.current.flyTo(firstSite.lat, firstSite.lng, 15);
        }}
        onSelectPeriod={(year) => {
          setSearchOpen(false);
          const found = HISTORICAL_PERIODS.find((p) => p.start_year === year || p.id === year || p.name.includes(String(year))) || HISTORICAL_PERIODS[0];
          const eraKey = mapEraFromPeriod(found);
          dispatch({ type: "SELECT_PERIOD", periodId: found.id });
          setFilter((f) => ({ ...f, eras: new Set([eraKey]) }));
        }}
      />

      {activeTrail && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 520 }}>
          <HeritageTrailStoryMode
            trail={activeTrail}
            sitesById={sitesById}
            onClose={() => dispatch({ type: "EXIT_TRAIL" })}
            onGoToStop={(site) => goToStop(site)}
          />
        </div>
      )}

      {/* Floating Bottom Nav — mobile only, hidden when modal sheets/panels are open */}
      <div className="dhm-mobile-only" style={{ opacity: (sheetOpen || selectedVanished || originChapterOpen || activeTrail || tab === "submit") ? 0 : 1, pointerEvents: (sheetOpen || selectedVanished || originChapterOpen || activeTrail || tab === "submit") ? "none" : "auto", transition: "opacity 200ms" }}>
        <BottomNav tab={tab} onTab={handleTabChange} visitedCount={visitedCount} />
      </div>



      {/* Era Transport Transition Overlay */}
      {eraTransition && (
        <EraTransition
          key={eraTransition.eraKey}
          eraKey={eraTransition.eraKey}
          label={eraTransition.label}
          hook={eraTransition.hook}
          onDone={() => setEraTransition(null)}
        />
      )}
    </div>
  );
}

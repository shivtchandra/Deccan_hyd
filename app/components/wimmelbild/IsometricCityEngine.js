// Living Illustrated Wimmelbild City Atlas Engine for Old Hyderabad
// Built upon uclab-potsdam/wimmelvis discovery architecture, singhanat/isometric-city navigation,
// and whereismrkim.com aesthetic materiality and micro-vignette interactions.
//
// The background plate (charminar_plate.jpg) is deliberately EMPTY — not a single
// person is painted into it. Every human in the scene is a sprite placed and moved
// by this file. That's the whole reason the crowd can actually walk: nothing is ever
// pasted on top of a frozen painted crowd.

import {
  WIMMEL_RELICS,
  BAZAAR_HOTSPOTS,
  LANDMARK_BUILDINGS,
  SCENE_WIDTH,
  SCENE_HEIGHT,
} from "./charminarCityData.js";

// The 16 cut-out pedestrians. `faces` is the direction the figure is drawn
// walking; sprites are mirrored when their path sends them the other way.
// `scale` is natural height relative to the median figure (keeps the child small
// and the cart-pusher bulky instead of normalising everyone to one height).
const PEOPLE = [
  { name: "person_01", faces: "left", scale: 1.18 },
  { name: "person_02", faces: "left", scale: 1.14 },
  { name: "person_03", faces: "right", scale: 1.13 },
  { name: "person_04", faces: "left", scale: 1.14 },
  { name: "person_05", faces: "right", scale: 1.06 },
  { name: "person_06", faces: "left", scale: 0.81 },
  { name: "person_07", faces: "right", scale: 1.08 },
  { name: "person_08", faces: "left", scale: 1.26 },
  { name: "person_09", faces: "left", scale: 1.02 },
  { name: "person_10", faces: "right", scale: 1.03 },
  { name: "person_11", faces: "right", scale: 1.03 },
  { name: "person_12", faces: "right", scale: 1.02 },
  { name: "person_13", faces: "right", scale: 1.05 },
  { name: "person_14", faces: "left", scale: 1.0 },
  { name: "person_15", faces: "right", scale: 0.99 },
  { name: "person_16", faces: "left", scale: 1.02 },
];

// Where the six findable shopkeepers stand. Each is a stationary sprite drawn
// onto the plate, so a relic's hit position is exact rather than eyeballed off
// a painted figure. Their footprints are punched out of the walkable mask so
// pedestrians walk around them instead of through them.
// `x`/`y` is where the sprite's feet sit; `hitLift` raises the tap target to
// the figure's body so clicking what you see registers. This is the ONLY place
// relic positions are defined — the hit test derives from it too, so the drawn
// stall and its tap target can never drift apart.
const RELIC_PLACEMENTS = [
  { id: "osmania_biscuit", x: 470, y: 880, height: 118, hitLift: 50 },
  { id: "irani_chai_cup", x: 300, y: 1010, height: 104, hitLift: 45 },
  { id: "lac_bangle", x: 690, y: 500, height: 96, hitLift: 40 },
  { id: "ittar_vial", x: 1430, y: 345, height: 128, hitLift: 55 },
  { id: "pearl_necklace", x: 1560, y: 585, height: 104, hitLift: 45 },
  { id: "bidri_hookah", x: 1300, y: 900, height: 92, hitLift: 40 },
];
const RELIC_HIT_RADIUS = 52;

const CROWD_SIZE = 330;
// keep route seeds this far apart (scene units) so the crowd spreads over the
// plaza instead of piling into clumps
const MIN_SEED_GAP = 38;
// 2:1 isometric street axes — walking along these reads as following the grid
// of the painted streets rather than cutting across them.
const ISO_DIRS = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
].map(([x, y]) => {
  const l = Math.hypot(x, y);
  return [x / l, y / l];
});

// Deterministic PRNG so the crowd lays out identically on every load.
function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export class IsometricCityEngine {
  constructor(canvasEl, callbacks = {}) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");
    this.callbacks = callbacks;

    this.sceneWidth = SCENE_WIDTH;
    this.sceneHeight = SCENE_HEIGHT;

    // Viewport & Camera state
    this.zoom = 1.0;
    this.minZoom = 0.55;
    this.maxZoom = 3.5;
    this.offsetX = 0;
    this.offsetY = 0;

    // Interaction state
    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.dragDist = 0;
    this.hoverHotspot = null;
    this.hoverBuilding = null;
    this.focusedTarget = null;

    // Master Illustrated Artwork (empty plate) + the sprite crowd drawn over it
    this.wimmelImg = null;
    this.peopleImgs = {};
    this.relicImgs = {};
    this.crowd = [];
    this.mask = null;
    this.maskW = 0;
    this.maskH = 0;
    this.isLoaded = false;
    this.isDestroyed = false;
    this.animFrameId = null;

    // State & Relics
    this.foundSecrets = new Set();
    this.timeMode = "day"; // "day", "golden", "night"

    this.pulseRipples = [];

    // Touch gesture pinch state
    this.initialPinchDistance = null;
    this.initialPinchZoom = 1.0;
  }

  // Initialize engine, load master artwork, populate ambient actors & motion graph, start 60fps loop
  async init() {
    const loadImage = (src) =>
      new Promise((resolve) => {
        const im = new Image();
        im.src = src;
        im.onload = () => resolve(im);
        im.onerror = () => resolve(null);
      });

    const [plate, maskImg, ...sprites] = await Promise.all([
      loadImage("/wimmelbild/charminar_plate.jpg"),
      loadImage("/wimmelbild/walkable_mask.png"),
      ...PEOPLE.map((p) => loadImage(`/wimmelbild/people/${p.name}.png`)),
      ...RELIC_PLACEMENTS.map((r) => loadImage(`/wimmelbild/relics/${r.id}.png`)),
    ]);

    this.wimmelImg = plate;
    this.isLoaded = Boolean(plate);
    PEOPLE.forEach((p, i) => {
      if (sprites[i]) this.peopleImgs[p.name] = sprites[i];
    });
    RELIC_PLACEMENTS.forEach((r, i) => {
      const img = sprites[PEOPLE.length + i];
      if (img) this.relicImgs[r.id] = img;
    });

    // Decode the walkable mask into a flat byte array once.
    if (maskImg) {
      const mc = document.createElement("canvas");
      mc.width = maskImg.naturalWidth;
      mc.height = maskImg.naturalHeight;
      const mctx = mc.getContext("2d", { willReadFrequently: true });
      mctx.drawImage(maskImg, 0, 0);
      const px = mctx.getImageData(0, 0, mc.width, mc.height).data;
      this.maskW = mc.width;
      this.maskH = mc.height;
      this.mask = new Uint8Array(mc.width * mc.height);
      for (let i = 0; i < this.mask.length; i++) {
        this.mask[i] = px[i * 4] > 127 ? 1 : 0;
      }
      // stalls occupy ground: keep the crowd out of them
      RELIC_PLACEMENTS.forEach((r) => this.blockMaskEllipse(r.x, r.y, 60, 34));
    }

    this.initCrowd();

    if (this.isDestroyed) return;

    this.resize();
    this.centerOnCharminar();
    this.bindEvents();
    this.startLoop();
  }

  // Mask lookup — is this scene coordinate real, standable pavement?
  isWalkable(x, y) {
    if (!this.mask) return true;
    const mx = (x / this.sceneWidth) * this.maskW;
    const my = (y / this.sceneHeight) * this.maskH;
    if (mx < 0 || my < 0 || mx >= this.maskW || my >= this.maskH) return false;
    return this.mask[(my | 0) * this.maskW + (mx | 0)] === 1;
  }

  // Punch a relic's footprint out of the walkable mask so the crowd flows
  // around the stall rather than straight through it.
  blockMaskEllipse(cx, cy, rx, ry) {
    if (!this.mask) return;
    const sx = this.maskW / this.sceneWidth;
    const sy = this.maskH / this.sceneHeight;
    const x0 = Math.max(0, Math.floor((cx - rx) * sx));
    const x1 = Math.min(this.maskW - 1, Math.ceil((cx + rx) * sx));
    const y0 = Math.max(0, Math.floor((cy - ry) * sy));
    const y1 = Math.min(this.maskH - 1, Math.ceil((cy + ry) * sy));
    for (let my = y0; my <= y1; my++) {
      for (let mx = x0; mx <= x1; mx++) {
        const dx = (mx / sx - cx) / rx;
        const dy = (my / sy - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.mask[my * this.maskW + mx] = 0;
      }
    }
  }

  // Walk outward from a seed along a direction until the pavement runs out.
  // Every route is validated against the mask once, here — so at draw time a
  // walker can never be standing on the monument, a cart or a rooftop.
  carveRoute(sx, sy, dx, dy) {
    const step = 5;
    let ax = sx;
    let ay = sy;
    for (let i = 0; i < 500; i++) {
      const nx = ax + dx * step;
      const ny = ay + dy * step;
      if (!this.isWalkable(nx, ny)) break;
      ax = nx;
      ay = ny;
    }
    let bx = sx;
    let by = sy;
    for (let i = 0; i < 500; i++) {
      const nx = bx - dx * step;
      const ny = by - dy * step;
      if (!this.isWalkable(nx, ny)) break;
      bx = nx;
      by = ny;
    }
    // pull the ends in so nobody finishes their walk hard against a kerb
    const len = Math.hypot(ax - bx, ay - by);
    if (len < 70) return null;
    const inset = Math.min(14, len * 0.12) / len;
    return {
      ax: ax - (ax - bx) * inset,
      ay: ay - (ay - by) * inset,
      bx: bx + (ax - bx) * inset,
      by: by + (ay - by) * inset,
    };
  }

  // Build the crowd: scatter seeds on walkable ground, carve each one a route
  // along an isometric street axis, and keep the ones that fit.
  initCrowd() {
    const rand = seededRandom(20260921);
    this.crowd = [];
    const seeds = [];
    let attempts = 0;
    while (this.crowd.length < CROWD_SIZE && attempts < CROWD_SIZE * 60) {
      attempts++;
      const sx = rand() * this.sceneWidth;
      const sy = rand() * this.sceneHeight;
      if (!this.isWalkable(sx, sy)) continue;
      let tooClose = false;
      for (const s of seeds) {
        if (Math.hypot(s[0] - sx, s[1] - sy) < MIN_SEED_GAP) {
          tooClose = true;
          break;
        }
      }
      if (tooClose) continue;
      const [dx, dy] = ISO_DIRS[(rand() * ISO_DIRS.length) | 0];
      const route = this.carveRoute(sx, sy, dx, dy);
      if (!route) continue;
      const person = PEOPLE[(rand() * PEOPLE.length) | 0];
      const len = Math.hypot(route.ax - route.bx, route.ay - route.by);
      seeds.push([sx, sy]);
      this.crowd.push({
        ...route,
        person,
        phase: rand(),
        // pace is roughly constant, so longer routes take proportionally longer.
        // The divisor is scene units walked per second — lower is a slower stroll.
        duration: (len / 11) * (0.8 + rand() * 0.6),
        reverse: rand() < 0.5,
        bobPhase: rand() * Math.PI * 2,
      });
    }
  }

  // A walker's position is a pure function of the clock: no per-frame state to
  // advance, desync or get stuck.
  walkerAt(w, nowSec) {
    let t = ((w.phase + nowSec / w.duration) % 1 + 1) % 1;
    // ping-pong so they pace the street instead of teleporting back to the start
    const forward = t < 0.5;
    const tri = forward ? t * 2 : 2 - t * 2;
    const x = w.bx + (w.ax - w.bx) * tri;
    const y = w.by + (w.ay - w.by) * tri;
    const dirRight = w.ax > w.bx;
    const movingRight = forward ? dirRight : !dirRight;
    return { x, y, movingRight };
  }

  // Center camera directly on Charminar with full-bleed screen coverage
  centerOnCharminar() {
    const viewW = this.canvas.width / (window.devicePixelRatio || 1);
    const viewH = this.canvas.height / (window.devicePixelRatio || 1);

    // Fill the screen completely without empty letterbox margins. On a
    // portrait phone this still crops a lot of width (a wide panorama vs a
    // tall screen), but letterboxing instead just trades that for large
    // empty parchment margins top/bottom, which reads worse. A smaller
    // overshoot than before leaves a bit more of the scene visible either way.
    const scaleX = viewW / this.sceneWidth;
    const scaleY = viewH / this.sceneHeight;
    const fillZoom = Math.max(scaleX, scaleY);

    this.minZoom = fillZoom * 0.95;
    this.zoom = fillZoom * 1.05;
    this.maxZoom = 3.5;

    const targetX = 1040;
    const targetY = 580;

    this.offsetX = viewW / 2 - targetX * this.zoom;
    this.offsetY = viewH / 2 - targetY * this.zoom;
    this.clampBounds();
  }

  // Clamps camera offset so user cannot pan outside the artwork bounds
  clampBounds() {
    const viewW = this.canvas.width / (window.devicePixelRatio || 1);
    const viewH = this.canvas.height / (window.devicePixelRatio || 1);
    const totalW = this.sceneWidth * this.zoom;
    const totalH = this.sceneHeight * this.zoom;

    if (totalW > viewW) {
      this.offsetX = Math.min(60, Math.max(viewW - totalW - 60, this.offsetX));
    } else {
      this.offsetX = (viewW - totalW) / 2;
    }

    if (totalH > viewH) {
      this.offsetY = Math.min(60, Math.max(viewH - totalH - 60, this.offsetY));
    } else {
      this.offsetY = (viewH - totalH) / 2;
    }
  }

  // Resize canvas to match display container with full device pixel ratio
  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth || window.innerWidth;
    const h = parent.clientHeight || window.innerHeight;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Coordinate transforms between screen and artwork
  sceneToScreen(sx, sy) {
    return {
      x: sx * this.zoom + this.offsetX,
      y: sy * this.zoom + this.offsetY,
    };
  }

  screenToScene(screenX, screenY) {
    return {
      x: (screenX - this.offsetX) / this.zoom,
      y: (screenY - this.offsetY) / this.zoom,
    };
  }

  // Main 60FPS Render Loop
  startLoop() {
    const renderFrame = () => {
      if (this.isDestroyed) return;
      this.updateSimulation();
      this.render();
      this.animFrameId = requestAnimationFrame(renderFrame);
    };
    this.animFrameId = requestAnimationFrame(renderFrame);
  }

  // The crowd needs no simulation step — each walker's position is derived from
  // the clock at draw time. Only the tap discovery ripple carries state.
  updateSimulation() {
    if (this.pulseRipples.length > 0) {
      this.pulseRipples.forEach((pr) => {
        pr.radius += 2.6;
        pr.alpha -= 0.02;
      });
      this.pulseRipples = this.pulseRipples.filter((pr) => pr.alpha > 0);
    }
  }

  // Render complete living scene
  render() {
    const dpr = window.devicePixelRatio || 1;
    const cw = this.canvas.width / dpr;
    const ch = this.canvas.height / dpr;

    this.ctx.clearRect(0, 0, cw, ch);

    // Warm parchment base
    this.ctx.fillStyle = this.timeMode === "night" ? "#0B1120" : "#EADBCE";
    this.ctx.fillRect(0, 0, cw, ch);

    if (!this.wimmelImg) return;

    // 1. Draw Master Wimmelbild Illustrated City Artwork
    const drawW = this.sceneWidth * this.zoom;
    const drawH = this.sceneHeight * this.zoom;
    this.ctx.drawImage(
      this.wimmelImg,
      0,
      0,
      this.wimmelImg.width,
      this.wimmelImg.height,
      this.offsetX,
      this.offsetY,
      drawW,
      drawH
    );

    const nowSec = Date.now() / 1000;

    // 2. Draw everyone standing on the plate — the walking crowd and the six
    // stationary shopkeepers — in one y-sorted pass, so nearer figures
    // correctly overlap further ones. Nobody is painted into the plate itself.
    const frames = [];
    for (const w of this.crowd) {
      const pos = this.walkerAt(w, nowSec);
      frames.push({ kind: "walker", w, ...pos });
    }
    for (const r of RELIC_PLACEMENTS) {
      frames.push({ kind: "relic", relic: r, x: r.x, y: r.y });
    }
    frames.sort((a, b) => a.y - b.y);

    for (const f of frames) {
      const p = this.sceneToScreen(f.x, f.y);
      if (f.kind === "relic") {
        const img = this.relicImgs[f.relic.id];
        if (!img) continue;
        const h = f.relic.height * this.zoom;
        const wdt = h * (img.naturalWidth / img.naturalHeight);
        this.ctx.drawImage(img, p.x - wdt / 2, p.y - h, wdt, h);
        continue;
      }
      const img = this.peopleImgs[f.w.person.name];
      if (!img) continue;
      // mild depth cue: people lower in the scene are nearer, so slightly larger
      const depth = 0.86 + 0.28 * (f.y / this.sceneHeight);
      const h = 52 * f.w.person.scale * depth * this.zoom;
      const wdt = h * (img.naturalWidth / img.naturalHeight);
      // a gentle vertical bob sells the walk without needing animation frames
      const bob = Math.sin(nowSec * 1.5 + f.w.bobPhase) * 0.8 * this.zoom;
      this.ctx.save();
      this.ctx.translate(p.x, p.y + bob);
      const mirror = f.movingRight !== (f.w.person.faces === "right");
      if (mirror) this.ctx.scale(-1, 1);
      this.ctx.drawImage(img, -wdt / 2, -h, wdt, h);
      this.ctx.restore();
    }

    // 7. Draw Permanent Golden Discovery Badges for Found Relics
    RELIC_PLACEMENTS.forEach((r) => {
      if (this.foundSecrets.has(r.id)) {
        const p = this.sceneToScreen(r.x, r.y - r.hitLift);
        this.ctx.save();
        this.ctx.strokeStyle = "rgba(217, 119, 6, 0.9)";
        this.ctx.lineWidth = 2.2 * this.zoom;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 18 * this.zoom, 0, Math.PI * 2);
        this.ctx.stroke();

        // Golden check badge
        this.ctx.fillStyle = "#D97706";
        this.ctx.beginPath();
        this.ctx.arc(p.x + 12 * this.zoom, p.y - 12 * this.zoom, 7 * this.zoom, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = `bold ${Math.max(8, Math.round(8.5 * this.zoom))}px sans-serif`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("✓", p.x + 12 * this.zoom, p.y - 12 * this.zoom);
        this.ctx.restore();
      }
    });

    // 8. Draw whereismrkim-style expanding pulse ripples on discovery
    this.pulseRipples.forEach((pr) => {
      const p = this.sceneToScreen(pr.x, pr.y);
      this.ctx.save();
      const alpha = Math.max(0, Math.min(1, pr.alpha));
      this.ctx.strokeStyle = `rgba(217, 119, 6, ${alpha})`;
      this.ctx.lineWidth = 3.2 * this.zoom;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, pr.radius * this.zoom, 0, Math.PI * 2);
      this.ctx.stroke();

      if (pr.radius > 16) {
        this.ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.65})`;
        this.ctx.lineWidth = 1.8 * this.zoom;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, (pr.radius - 12) * this.zoom, 0, Math.PI * 2);
        this.ctx.stroke();
      }
      this.ctx.restore();
    });

    // 9. Draw Focused Target Framing Brackets (when selected from HUD)
    if (this.focusedTarget) {
      const p = this.sceneToScreen(this.focusedTarget.x, this.focusedTarget.y);
      const r = (this.focusedTarget.radius || 34) * this.zoom;
      const corner = Math.max(8, 12 * this.zoom);
      this.ctx.save();
      this.ctx.strokeStyle = "#974631";
      this.ctx.lineWidth = 2.8;

      // Top-Left
      this.ctx.beginPath();
      this.ctx.moveTo(p.x - r, p.y - r + corner);
      this.ctx.lineTo(p.x - r, p.y - r);
      this.ctx.lineTo(p.x - r + corner, p.y - r);
      this.ctx.stroke();

      // Top-Right
      this.ctx.beginPath();
      this.ctx.moveTo(p.x + r - corner, p.y - r);
      this.ctx.lineTo(p.x + r, p.y - r);
      this.ctx.lineTo(p.x + r, p.y - r + corner);
      this.ctx.stroke();

      // Bottom-Left
      this.ctx.beginPath();
      this.ctx.moveTo(p.x - r, p.y + r - corner);
      this.ctx.lineTo(p.x - r, p.y + r);
      this.ctx.lineTo(p.x - r + corner, p.y + r);
      this.ctx.stroke();

      // Bottom-Right
      this.ctx.beginPath();
      this.ctx.moveTo(p.x + r - corner, p.y + r);
      this.ctx.lineTo(p.x + r, p.y + r);
      this.ctx.lineTo(p.x + r, p.y + r - corner);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 10. REAL-TIME HOVER HIGHLIGHTING & PARCHMENT SPEECH BUBBLE (for ALL 35 hotspots)
    if (this.hoverHotspot) {
      const h = this.hoverHotspot;
      const p = this.sceneToScreen(h.x, h.y);
      const r = (h.radius || 32) * this.zoom;

      this.ctx.save();

      // Glowing dashed target ring
      this.ctx.strokeStyle = "rgba(151, 70, 49, 0.9)";
      this.ctx.lineWidth = 2.4;
      this.ctx.setLineDash([5, 4]);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      // Floating Parchment Speech Bubble / Name Card
      const title = h.name;
      const quote = h.quote ? `"${h.quote}"` : "";
      const subtitle = h.speaker || h.category;

      this.ctx.font = "bold 12px sans-serif";
      const tw1 = this.ctx.measureText(title).width;
      this.ctx.font = "italic 11px sans-serif";
      const tw2 = quote ? this.ctx.measureText(quote).width : 0;
      const cardW = Math.max(tw1, tw2, 140) + 24;
      const cardH = quote ? 46 : 28;

      const cardX = Math.min(cw - cardW - 10, Math.max(10, p.x - cardW / 2));
      const cardY = p.y - r - cardH - 12;

      // Bubble shadow
      this.ctx.fillStyle = "rgba(40, 34, 22, 0.2)";
      this.ctx.beginPath();
      this.ctx.roundRect(cardX + 2, cardY + 3, cardW, cardH, 6);
      this.ctx.fill();

      // Bubble background (.paper style)
      this.ctx.fillStyle = "#FAF4E9";
      this.ctx.strokeStyle = "rgba(142, 119, 93, 0.6)";
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.roundRect(cardX, cardY, cardW, cardH, 6);
      this.ctx.fill();
      this.ctx.stroke();

      // Tail pointing down to target
      this.ctx.fillStyle = "#FAF4E9";
      this.ctx.beginPath();
      this.ctx.moveTo(p.x - 6, cardY + cardH);
      this.ctx.lineTo(p.x, cardY + cardH + 7);
      this.ctx.lineTo(p.x + 6, cardY + cardH);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Icon & Text inside bubble
      this.ctx.fillStyle = "#974631";
      this.ctx.font = "bold 9px sans-serif";
      this.ctx.textAlign = "left";
      this.ctx.fillText(`${h.icon || "📍"} ${subtitle.toUpperCase()}`, cardX + 10, cardY + 12);

      this.ctx.fillStyle = "#27372F";
      this.ctx.font = "bold 11px sans-serif";
      this.ctx.fillText(title, cardX + 10, cardY + 25);

      if (quote) {
        this.ctx.fillStyle = "#434D43";
        this.ctx.font = "italic 10.5px sans-serif";
        this.ctx.fillText(quote, cardX + 10, cardY + 39);
      }

      this.ctx.restore();
    }

    // 11. Atmospheric Time-of-Day Lighting Grade
    this.renderAtmosphericLighting(cw, ch);
  }

  // Day / Golden Hour / Night Atmospheric Lighting Overlays
  renderAtmosphericLighting(cw, ch) {
    if (this.timeMode === "day") return;

    this.ctx.save();
    if (this.timeMode === "golden") {
      const grad = this.ctx.createRadialGradient(
        cw / 2,
        ch / 2,
        cw * 0.15,
        cw / 2,
        ch / 2,
        cw * 0.85
      );
      grad.addColorStop(0, "rgba(251, 191, 36, 0.08)");
      grad.addColorStop(0.7, "rgba(245, 158, 11, 0.18)");
      grad.addColorStop(1, "rgba(180, 83, 9, 0.32)");
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, cw, ch);
    } else if (this.timeMode === "night") {
      this.ctx.fillStyle = "rgba(11, 17, 32, 0.68)";
      this.ctx.fillRect(0, 0, cw, ch);

      // Warm glowing light pools under Charminar arches and street lamps
      const lampPositions = [
        { x: 1040, y: 640, radius: 190, intensity: 0.55 },
        { x: 300, y: 780, radius: 120, intensity: 0.45 },
        { x: 520, y: 440, radius: 105, intensity: 0.4 },
        { x: 1480, y: 340, radius: 110, intensity: 0.4 },
        { x: 1820, y: 500, radius: 120, intensity: 0.45 },
      ];

      lampPositions.forEach((lp) => {
        const p = this.sceneToScreen(lp.x, lp.y);
        const r = lp.radius * this.zoom;
        const lampGrad = this.ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          r
        );
        lampGrad.addColorStop(0, `rgba(254, 240, 138, ${lp.intensity})`);
        lampGrad.addColorStop(0.4, `rgba(251, 191, 36, ${lp.intensity * 0.45})`);
        lampGrad.addColorStop(1, "rgba(251, 191, 36, 0)");

        this.ctx.save();
        this.ctx.globalCompositeOperation = "screen";
        this.ctx.fillStyle = lampGrad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      });
    }
    this.ctx.restore();
  }

  // Pointer & Gesture Navigation Handlers
  bindEvents() {
    this._onPointerDown = (e) => this.handlePointerDown(e);
    this._onPointerMove = (e) => this.handlePointerMove(e);
    this._onPointerUp = (e) => this.handlePointerUp(e);
    this._onWheel = (e) => this.handleWheel(e);
    this._onTouchStart = (e) => this.handleTouchStart(e);
    this._onTouchMove = (e) => this.handleTouchMove(e);
    this._onTouchEnd = (e) => this.handleTouchEnd(e);
    this._onResize = () => {
      this.resize();
      this.clampBounds();
    };

    this.canvas.addEventListener("mousedown", this._onPointerDown);
    window.addEventListener("mousemove", this._onPointerMove);
    window.addEventListener("mouseup", this._onPointerUp);
    this.canvas.addEventListener("wheel", this._onWheel, { passive: false });

    this.canvas.addEventListener("touchstart", this._onTouchStart, { passive: false });
    window.addEventListener("touchmove", this._onTouchMove, { passive: false });
    window.addEventListener("touchend", this._onTouchEnd);
    window.addEventListener("resize", this._onResize);
  }

  unbindEvents() {
    this.canvas.removeEventListener("mousedown", this._onPointerDown);
    window.removeEventListener("mousemove", this._onPointerMove);
    window.removeEventListener("mouseup", this._onPointerUp);
    this.canvas.removeEventListener("wheel", this._onWheel);

    this.canvas.removeEventListener("touchstart", this._onTouchStart);
    window.removeEventListener("touchmove", this._onTouchMove);
    window.removeEventListener("touchend", this._onTouchEnd);
    window.removeEventListener("resize", this._onResize);
  }

  handlePointerDown(e) {
    if (e.button !== 0 && e.button !== 1) return;
    this.isDragging = true;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.dragDist = 0;
    if (this.callbacks.onInteraction) this.callbacks.onInteraction();
  }

  handlePointerMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    if (this.isDragging) {
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;
      this.offsetX += dx;
      this.offsetY += dy;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
      this.dragDist += Math.abs(dx) + Math.abs(dy);
      this.clampBounds();
    }

    // Hit-testing ALL 35+ living interactive bazaar hotspots!
    this.hoverHotspot = null;
    this.hoverBuilding = null;
    let isHoverInteractive = false;

    // Check hotspots first
    for (const h of BAZAAR_HOTSPOTS) {
      const p = this.sceneToScreen(h.x, h.y);
      const dist = Math.hypot(screenX - p.x, screenY - p.y);
      if (dist <= Math.max(26, (h.radius || 30) * this.zoom)) {
        this.hoverHotspot = h;
        isHoverInteractive = true;
        break;
      }
    }

    // Check landmark precincts if no specific hotspot is hovered
    if (!this.hoverHotspot) {
      for (const b of LANDMARK_BUILDINGS) {
        const p = this.sceneToScreen(b.x, b.y);
        const dist = Math.hypot(screenX - p.x, screenY - p.y);
        if (dist <= b.radius * this.zoom) {
          this.hoverBuilding = b;
          isHoverInteractive = true;
          break;
        }
      }
    }

    this.canvas.style.cursor = this.isDragging
      ? "grabbing"
      : isHoverInteractive
      ? "pointer"
      : "grab";
  }

  handlePointerUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;

    if (this.dragDist < 8) {
      const rect = this.canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      this.handleClick(screenX, screenY);
    }
  }

  handleWheel(e) {
    e.preventDefault();
    if (this.callbacks.onInteraction) this.callbacks.onInteraction();
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const targetZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom * zoomFactor));

    if (targetZoom !== this.zoom) {
      this.offsetX = mouseX - ((mouseX - this.offsetX) * targetZoom) / this.zoom;
      this.offsetY = mouseY - ((mouseY - this.offsetY) * targetZoom) / this.zoom;
      this.zoom = targetZoom;
      this.clampBounds();
    }
  }

  handleTouchStart(e) {
    if (this.callbacks.onInteraction) this.callbacks.onInteraction();
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.lastPointerX = e.touches[0].clientX;
      this.lastPointerY = e.touches[0].clientY;
      this.dragDist = 0;
    } else if (e.touches.length === 2) {
      e.preventDefault();
      this.isDragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      this.initialPinchDistance = Math.hypot(dx, dy);
      this.initialPinchZoom = this.zoom;
    }
  }

  handleTouchMove(e) {
    if (e.touches.length === 1 && this.isDragging) {
      const dx = e.touches[0].clientX - this.lastPointerX;
      const dy = e.touches[0].clientY - this.lastPointerY;
      this.offsetX += dx;
      this.offsetY += dy;
      this.lastPointerX = e.touches[0].clientX;
      this.lastPointerY = e.touches[0].clientY;
      this.dragDist += Math.abs(dx) + Math.abs(dy);
      this.clampBounds();
    } else if (e.touches.length === 2 && this.initialPinchDistance) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.hypot(dx, dy);
      const scale = currentDist / this.initialPinchDistance;
      const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.initialPinchZoom * scale));

      const rect = this.canvas.getBoundingClientRect();
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

      this.offsetX = midX - ((midX - this.offsetX) * newZoom) / this.zoom;
      this.offsetY = midY - ((midY - this.offsetY) * newZoom) / this.zoom;
      this.zoom = newZoom;
      this.clampBounds();
    }
  }

  handleTouchEnd(e) {
    if (this.isDragging && this.dragDist < 10 && e.changedTouches.length === 1) {
      const rect = this.canvas.getBoundingClientRect();
      const sx = e.changedTouches[0].clientX - rect.left;
      const sy = e.changedTouches[0].clientY - rect.top;
      this.handleClick(sx, sy);
    }
    this.isDragging = false;
    this.initialPinchDistance = null;
  }

  // Hit-detection & Click Handlers for ALL 35+ Living Hotspots & Landmarks
  handleClick(screenX, screenY) {
    // 1. Relics first, positioned from RELIC_PLACEMENTS — the same data that
    // draws the sprite — so the tap target always sits on what you can see.
    // Checked ahead of ambient hotspots so a relic always wins.
    for (const placement of RELIC_PLACEMENTS) {
      const hitY = placement.y - placement.hitLift;
      const p = this.sceneToScreen(placement.x, hitY);
      const dist = Math.hypot(screenX - p.x, screenY - p.y);
      if (dist <= Math.max(30, RELIC_HIT_RADIUS * this.zoom)) {
        const relic = WIMMEL_RELICS.find((r) => r.id === placement.id);
        if (!relic) continue;
        this.triggerPulse(placement.x, hitY);
        if (this.callbacks.onSecretClick) this.callbacks.onSecretClick(relic);
        return;
      }
    }

    // 2. Ambient hotspots. `isRelic` entries are stale duplicates of the six
    // relics left over from the old painted artwork — the loop above owns
    // relics now, so they're skipped here.
    for (const h of BAZAAR_HOTSPOTS) {
      if (h.isRelic) continue;
      const p = this.sceneToScreen(h.x, h.y);
      const dist = Math.hypot(screenX - p.x, screenY - p.y);
      if (dist <= Math.max(28, (h.radius || 30) * this.zoom)) {
        this.triggerPulse(h.x, h.y);
        if (this.callbacks.onHotspotClick) this.callbacks.onHotspotClick(h);
        return;
      }
    }

    // 2. Check Landmark Precincts
    for (const b of LANDMARK_BUILDINGS) {
      const p = this.sceneToScreen(b.x, b.y);
      const dist = Math.hypot(screenX - p.x, screenY - p.y);
      if (dist <= b.radius * this.zoom) {
        if (this.callbacks.onBuildingClick) {
          this.callbacks.onBuildingClick(b);
        }
        return;
      }
    }
  }

  // Discovery pulse trigger
  triggerPulse(sceneX, sceneY, color = "rgba(217, 119, 6, 0.95)") {
    this.pulseRipples.push({
      x: sceneX,
      y: sceneY,
      radius: 6,
      alpha: 1.0,
      color,
    });
  }

  // Focus on a target or relic (draws framing brackets)
  setFocusTarget(target) {
    this.focusedTarget = target;
  }

  // Smoothly center the camera on scene coordinates (e.g. from HUD inspect)
  panTo(sceneX, sceneY, targetZoom = null) {
    const dpr = window.devicePixelRatio || 1;
    const viewW = this.canvas.width / dpr;
    const viewH = this.canvas.height / dpr;

    if (targetZoom) {
      this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, targetZoom));
    }
    this.offsetX = viewW / 2 - sceneX * this.zoom;
    this.offsetY = viewH / 2 - sceneY * this.zoom;
    this.clampBounds();
  }

  // Zoom Button Handlers
  zoomIn() {
    const viewW = this.canvas.width / (window.devicePixelRatio || 1);
    const viewH = this.canvas.height / (window.devicePixelRatio || 1);
    const centerX = viewW / 2;
    const centerY = viewH / 2;

    const targetZoom = Math.min(this.maxZoom, this.zoom * 1.25);
    if (targetZoom !== this.zoom) {
      this.offsetX = centerX - ((centerX - this.offsetX) * targetZoom) / this.zoom;
      this.offsetY = centerY - ((centerY - this.offsetY) * targetZoom) / this.zoom;
      this.zoom = targetZoom;
      this.clampBounds();
    }
  }

  zoomOut() {
    const viewW = this.canvas.width / (window.devicePixelRatio || 1);
    const viewH = this.canvas.height / (window.devicePixelRatio || 1);
    const centerX = viewW / 2;
    const centerY = viewH / 2;

    const targetZoom = Math.max(this.minZoom, this.zoom * 0.8);
    if (targetZoom !== this.zoom) {
      this.offsetX = centerX - ((centerX - this.offsetX) * targetZoom) / this.zoom;
      this.offsetY = centerY - ((centerY - this.offsetY) * targetZoom) / this.zoom;
      this.zoom = targetZoom;
      this.clampBounds();
    }
  }

  // Time Mode & State Sync
  setTimeMode(mode) {
    this.timeMode = mode;
  }

  setFoundSecrets(setOfIds) {
    this.foundSecrets = setOfIds;
  }

  destroy() {
    this.isDestroyed = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.unbindEvents();
  }
}

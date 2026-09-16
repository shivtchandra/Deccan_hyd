// Living Illustrated Wimmelbild City Atlas Engine for Old Hyderabad
// Built upon uclab-potsdam/wimmelvis discovery architecture, singhanat/isometric-city navigation,
// and whereismrkim.com aesthetic materiality and micro-vignette interactions.

import {
  WIMMEL_RELICS,
  BAZAAR_HOTSPOTS,
  LANDMARK_BUILDINGS,
  SCENE_WIDTH,
  SCENE_HEIGHT,
} from "./charminarCityData.js";

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

    // Master Illustrated Artwork
    this.wimmelImg = null;
    this.isLoaded = false;
    this.isDestroyed = false;
    this.animFrameId = null;

    // State & Relics
    this.foundSecrets = new Set();
    this.timeMode = "day"; // "day", "golden", "night"

    // Living Ambient Actors & Particles
    this.steamPuffs = [];
    this.pigeons = [];
    this.dustMotes = [];
    this.pulseRipples = [];
    this.autoExhaustPuffs = [];
    this.sparkles = [];

    // Dynamic Moving Actors (whereismrkim.com motion engine)
    this.movingVehicles = [];
    this.walkingPedestrians = [];
    this.craftsmenVignettes = [];
    this.animals = [];

    // Touch gesture pinch state
    this.initialPinchDistance = null;
    this.initialPinchZoom = 1.0;
  }

  // Initialize engine, load master artwork, populate ambient actors & motion graph, start 60fps loop
  async init() {
    this.initAmbientParticles();
    this.initLivingActors();

    // Load authentic master Wimmelbild artwork
    const img = new Image();
    img.src = "/wimmelbild/hyderabad_wimmelbild.jpg";
    await new Promise((resolve) => {
      img.onload = () => {
        this.wimmelImg = img;
        this.isLoaded = true;
        resolve();
      };
      img.onerror = () => {
        resolve();
      };
    });

    if (this.isDestroyed) return;

    this.resize();
    this.centerOnCharminar();
    this.bindEvents();
    this.startLoop();
  }

  // Initialize living ambient particles
  initAmbientParticles() {
    // 1. Chai steam puffs at Nimrah Cafe samovar (x: 250, y: 720) & bakery oven (x: 340, y: 760)
    this.steamPuffs = Array.from({ length: 9 }).map((_, i) => ({
      originX: i % 2 === 0 ? 250 + (Math.random() * 14 - 7) : 340 + (Math.random() * 14 - 7),
      originY: i % 2 === 0 ? 720 : 755,
      x: 250,
      y: 720 - (i % 5) * 12,
      alpha: 0.65 - (i % 5) * 0.1,
      size: 6 + (i % 5) * 2.2,
      drift: (Math.random() - 0.4) * 0.35,
    }));

    // 2. Pigeons circling Charminar upper minarets in 3D perspective
    this.pigeons = Array.from({ length: 9 }).map((_, i) => ({
      angle: (i / 9) * Math.PI * 2,
      radiusX: 120 + (i % 3) * 28,
      radiusY: 60 + (i % 3) * 14,
      speed: 0.016 + (i % 3) * 0.004,
      altitudeOffset: (i % 4) * 12,
      wingCycle: Math.random() * Math.PI * 2,
    }));

    // 3. Auto-rickshaw idling exhaust puffs at x: 740, y: 780 and x: 390, y: 550
    this.autoExhaustPuffs = Array.from({ length: 6 }).map((_, i) => ({
      originX: i < 3 ? 710 : 365,
      originY: i < 3 ? 810 : 575,
      x: i < 3 ? 710 : 365,
      y: i < 3 ? 810 : 575,
      alpha: 0.5 - (i % 3) * 0.12,
      size: 4 + (i % 3) * 1.5,
      vx: -(0.3 + Math.random() * 0.3),
      vy: -(0.2 + Math.random() * 0.2),
    }));

    // 4. Glitter sparkles on Laad Bazaar bangles & Basra pearls
    this.sparkles = [
      { x: 540, y: 460, phase: 0 },
      { x: 480, y: 430, phase: 1.5 },
      { x: 420, y: 480, phase: 3.0 },
      { x: 1400, y: 215, phase: 4.5 },
      { x: 1480, y: 350, phase: 2.2 },
    ];

    // 5. Deccan sunlight golden dust motes
    this.dustMotes = Array.from({ length: 22 }).map(() => ({
      x: Math.random() * this.sceneWidth,
      y: Math.random() * this.sceneHeight,
      vx: (Math.random() - 0.3) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: 0.2 + Math.random() * 0.4,
      size: 1.5 + Math.random() * 2,
    }));
  }

  // Initialize Living Dynamic Motion Graph (whereismrkim.com actors & corridors)
  initLivingActors() {
    // 1. Moving Auto-Rickshaws along Waypoint Corridors
    this.movingVehicles = [
      {
        id: "auto_east_west",
        points: [
          { x: 100, y: 810 },
          { x: 450, y: 810 },
          { x: 740, y: 810 },
          { x: 1050, y: 810 },
          { x: 1400, y: 810 },
          { x: 1900, y: 810 },
        ],
        speed: 0.85,
        progress: 0.1,
        x: 100,
        y: 810,
        heading: 0,
        color: "#EAB308", // Yellow Bajaj hood
        exhaustTimer: 0,
      },
      {
        id: "auto_north_south",
        points: [
          { x: 1040, y: 120 },
          { x: 1040, y: 380 },
          { x: 1040, y: 620 },
          { x: 1040, y: 880 },
          { x: 1040, y: 1050 },
        ],
        speed: 0.7,
        progress: 0.45,
        x: 1040,
        y: 400,
        heading: Math.PI / 2,
        color: "#F59E0B",
        exhaustTimer: 0,
      },
      {
        id: "auto_laad_bazaar",
        points: [
          { x: 1800, y: 810 },
          { x: 1350, y: 810 },
          { x: 800, y: 810 },
          { x: 300, y: 810 },
        ],
        speed: 0.65,
        progress: 0.7,
        x: 1350,
        y: 810,
        heading: Math.PI,
        color: "#EF4444",
        exhaustTimer: 0,
      },
    ];

    // 2. Navigating Pedestrians (Walking villagers, shoppers, scholars, tea waiters)
    this.walkingPedestrians = [
      {
        id: "ped_burqa_laad",
        type: "burqa",
        name: "Laad Bangle Shopper",
        color: "#1E293B",
        points: [
          { x: 220, y: 480 },
          { x: 380, y: 480 },
          { x: 550, y: 500 },
          { x: 720, y: 520 },
        ],
        speed: 0.45,
        progress: 0.0,
        x: 220,
        y: 480,
        stepTimer: 0,
        heading: 0,
      },
      {
        id: "ped_kurta_pathargatti",
        type: "kurta",
        name: "Granite Arcade Elder",
        color: "#F8FAFC",
        turbanColor: "#059669",
        points: [
          { x: 1120, y: 150 },
          { x: 1120, y: 380 },
          { x: 1120, y: 600 },
        ],
        speed: 0.38,
        progress: 0.3,
        x: 1120,
        y: 280,
        stepTimer: 0,
        heading: Math.PI / 2,
      },
      {
        id: "ped_saree_saffron",
        type: "saree",
        name: "Flower Thali Devotee",
        color: "#D97706",
        points: [
          { x: 1180, y: 680 },
          { x: 1260, y: 720 },
          { x: 1360, y: 750 },
          { x: 1200, y: 700 },
        ],
        speed: 0.4,
        progress: 0.6,
        x: 1260,
        y: 720,
        stepTimer: 0,
        heading: 0,
      },
      {
        id: "ped_tea_wallah",
        type: "tea_wallah",
        name: "Nimrah Irani Tea Runner",
        color: "#2563EB",
        points: [
          { x: 250, y: 730 },
          { x: 330, y: 750 },
          { x: 420, y: 760 },
          { x: 330, y: 750 },
        ],
        speed: 0.52,
        progress: 0.15,
        x: 250,
        y: 730,
        stepTimer: 0,
        heading: 0,
      },
      {
        id: "ped_sherwani_chowk",
        type: "sherwani",
        name: "Chowk Haveli Gentleman",
        color: "#475569",
        capColor: "#991B1B",
        points: [
          { x: 1400, y: 280 },
          { x: 1540, y: 320 },
          { x: 1680, y: 360 },
          { x: 1540, y: 320 },
        ],
        speed: 0.36,
        progress: 0.5,
        x: 1540,
        y: 320,
        stepTimer: 0,
        heading: 0,
      },
      {
        id: "ped_saree_teal",
        type: "saree",
        name: "Attar Buyer",
        color: "#0D9488",
        points: [
          { x: 920, y: 280 },
          { x: 920, y: 440 },
          { x: 920, y: 280 },
        ],
        speed: 0.42,
        progress: 0.8,
        x: 920,
        y: 380,
        stepTimer: 0,
        heading: Math.PI / 2,
      },
    ];

    // 3. Micro-Vignette Animated Craftsmen (Live artisans performing crafts)
    this.craftsmenVignettes = [
      {
        id: "vignette_chai_master",
        name: "Ustad Irani Chai Master",
        x: 245,
        y: 715,
        type: "chai_master",
        actionPhase: 0,
      },
      {
        id: "vignette_bangle_craftsman",
        name: "Lac Bangle Artisan",
        x: 480,
        y: 440,
        type: "bangle_craftsman",
        actionPhase: 0,
      },
      {
        id: "vignette_perfumer",
        name: "Pathargatti Perfumer",
        x: 940,
        y: 350,
        type: "perfumer",
        actionPhase: 0,
      },
      {
        id: "vignette_baker",
        name: "Osmania Biscuit Baker",
        x: 345,
        y: 755,
        type: "baker",
        actionPhase: 0,
      },
      {
        id: "vignette_pigeon_feeder",
        name: "Mecca Masjid Bird Feeder",
        x: 1300,
        y: 780,
        type: "pigeon_feeder",
        actionPhase: 0,
      },
    ];

    // 4. Alleyway Animals (Trotting stray dogs & pecking chickens)
    this.animals = [
      {
        id: "dog_curb",
        type: "dog",
        x: 680,
        y: 825,
        vx: 0.5,
        minX: 620,
        maxX: 760,
        tailPhase: 0,
      },
      {
        id: "chicken_cart_1",
        type: "chicken",
        x: 380,
        y: 840,
        peckTimer: 0,
      },
      {
        id: "chicken_cart_2",
        type: "chicken",
        x: 395,
        y: 848,
        peckTimer: 1.5,
      },
    ];
  }

  // Center camera directly on Charminar with full-bleed screen coverage
  centerOnCharminar() {
    const viewW = this.canvas.width / (window.devicePixelRatio || 1);
    const viewH = this.canvas.height / (window.devicePixelRatio || 1);

    // Fill the screen completely without empty letterbox margins
    const scaleX = viewW / this.sceneWidth;
    const scaleY = viewH / this.sceneHeight;
    const fillZoom = Math.max(scaleX, scaleY);

    this.minZoom = fillZoom * 0.95;
    this.zoom = fillZoom * 1.15;
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

  // Advance ambient simulation (steam, pigeons, dust, exhaust, pulse)
  updateSimulation() {
    // 1. Steam rising from Nimrah Chai samovar & ovens
    this.steamPuffs.forEach((sp) => {
      sp.y -= 0.5;
      sp.x += sp.drift;
      sp.alpha -= 0.007;
      sp.size += 0.04;
      if (sp.alpha <= 0 || sp.y < sp.originY - 70) {
        sp.y = sp.originY;
        sp.x = sp.originX + (Math.random() * 18 - 9);
        sp.alpha = 0.6;
        sp.size = 6;
      }
    });

    // 2. Auto rickshaw exhaust puffs
    this.autoExhaustPuffs.forEach((ep) => {
      ep.x += ep.vx;
      ep.y += ep.vy;
      ep.alpha -= 0.012;
      ep.size += 0.06;
      if (ep.alpha <= 0) {
        ep.x = ep.originX;
        ep.y = ep.originY;
        ep.alpha = 0.45;
        ep.size = 4;
      }
    });

    // 3. Pigeons orbiting Charminar minarets
    this.pigeons.forEach((pg) => {
      pg.angle += pg.speed;
      pg.wingCycle += 0.28;
    });

    // 4. Dust motes drifting in sunlight
    this.dustMotes.forEach((dm) => {
      dm.x += dm.vx;
      dm.y += dm.vy;
      if (dm.x < 0) dm.x = this.sceneWidth;
      if (dm.x > this.sceneWidth) dm.x = 0;
      if (dm.y < 0) dm.y = this.sceneHeight;
      if (dm.y > this.sceneHeight) dm.y = 0;
    });

    // 5. whereismrkim-style discovery pulse ripples
    if (this.pulseRipples.length > 0) {
      this.pulseRipples.forEach((pr) => {
        pr.radius += 2.6;
        pr.alpha -= 0.02;
      });
      this.pulseRipples = this.pulseRipples.filter((pr) => pr.alpha > 0);
    }

    // 6. ADVANCE LIVING VEHICLES (Interpolate along multi-point waypoint paths)
    this.movingVehicles.forEach((v) => {
      v.progress += v.speed * 0.0012;
      if (v.progress >= 1.0) v.progress = 0.0;

      const numSegs = v.points.length - 1;
      const totalT = v.progress * numSegs;
      const segIdx = Math.min(Math.floor(totalT), numSegs - 1);
      const segT = totalT - segIdx;

      const p1 = v.points[segIdx];
      const p2 = v.points[segIdx + 1];
      if (p1 && p2) {
        v.x = p1.x + (p2.x - p1.x) * segT;
        v.y = p1.y + (p2.y - p1.y) * segT;
        v.heading = Math.atan2(p2.y - p1.y, p2.x - p1.x);

        // Spawn exhaust puff behind vehicle occasionally
        v.exhaustTimer += 1;
        if (v.exhaustTimer % 18 === 0) {
          this.autoExhaustPuffs.push({
            originX: v.x,
            originY: v.y,
            x: v.x - Math.cos(v.heading) * 15,
            y: v.y - Math.sin(v.heading) * 15,
            alpha: 0.5,
            size: 4,
            vx: -Math.cos(v.heading) * 0.4,
            vy: -0.2,
          });
          if (this.autoExhaustPuffs.length > 25) this.autoExhaustPuffs.shift();
        }
      }
    });

    // 7. ADVANCE LIVING PEDESTRIANS (Interpolate along waypoint corridors with step bounce)
    this.walkingPedestrians.forEach((ped) => {
      ped.progress += ped.speed * 0.0008;
      if (ped.progress >= 1.0) ped.progress = 0.0;

      const numSegs = ped.points.length - 1;
      const totalT = ped.progress * numSegs;
      const segIdx = Math.min(Math.floor(totalT), numSegs - 1);
      const segT = totalT - segIdx;

      const p1 = ped.points[segIdx];
      const p2 = ped.points[segIdx + 1];
      if (p1 && p2) {
        ped.x = p1.x + (p2.x - p1.x) * segT;
        ped.y = p1.y + (p2.y - p1.y) * segT;
        ped.heading = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        ped.stepTimer += 0.16;
      }
    });

    // 8. ADVANCE CRAFTSMEN VIGNETTE PHASES
    const nowSec = Date.now() / 1000;
    this.craftsmenVignettes.forEach((craft) => {
      craft.actionPhase = nowSec * 2.5;
    });

    // 9. ADVANCE ALLEYWAY ANIMALS
    this.animals.forEach((an) => {
      if (an.type === "dog") {
        an.x += an.vx;
        an.tailPhase += 0.25;
        if (an.x > an.maxX || an.x < an.minX) an.vx *= -1;
      } else if (an.type === "chicken") {
        an.peckTimer += 0.1;
      }
    });
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

    // 2. GATHER DYNAMIC ACTORS & Y-SORT FOR DEPTH OCCLUSION
    const nowSec = Date.now() / 1000;
    const renderActors = [];

    // Add vehicles
    this.movingVehicles.forEach((v) => {
      renderActors.push({ type: "vehicle", y: v.y, data: v });
    });

    // Add walking pedestrians
    this.walkingPedestrians.forEach((p) => {
      renderActors.push({ type: "pedestrian", y: p.y, data: p });
    });

    // Add craftsmen vignettes
    this.craftsmenVignettes.forEach((c) => {
      renderActors.push({ type: "craftsman", y: c.y, data: c });
    });

    // Add animals
    this.animals.forEach((a) => {
      renderActors.push({ type: "animal", y: a.y, data: a });
    });

    // SORT BY Y COORDINATE FOR ACCURATE ISO DEPTH
    renderActors.sort((a, b) => a.y - b.y);

    // RENDER ALL ACTORS IN ISO ORDER
    renderActors.forEach((actor) => {
      if (actor.type === "vehicle") {
        this.drawAutoRickshaw(actor.data);
      } else if (actor.type === "pedestrian") {
        this.drawPedestrian(actor.data);
      } else if (actor.type === "craftsman") {
        this.drawCraftsman(actor.data, nowSec);
      } else if (actor.type === "animal") {
        this.drawAnimal(actor.data, nowSec);
      }
    });

    // 2. Draw Living Ambient Steam Puffs at Nimrah Cafe
    this.steamPuffs.forEach((sp) => {
      const p = this.sceneToScreen(sp.x, sp.y);
      this.ctx.save();
      this.ctx.fillStyle = `rgba(255, 248, 235, ${sp.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, sp.size * this.zoom, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    // 3. Draw Auto Rickshaw Exhaust Puffs
    this.autoExhaustPuffs.forEach((ep) => {
      const p = this.sceneToScreen(ep.x, ep.y);
      this.ctx.save();
      this.ctx.fillStyle = `rgba(215, 205, 190, ${ep.alpha * 0.7})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, ep.size * this.zoom, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    // 4. Draw Twinkling Sparkles on Bangles & Pearls
    this.sparkles.forEach((spk) => {
      const p = this.sceneToScreen(spk.x, spk.y);
      const twinkle = (Math.sin(nowSec * 3 + spk.phase) + 1) / 2;
      if (twinkle > 0.6) {
        const starSize = (twinkle - 0.6) * 14 * this.zoom;
        this.ctx.save();
        this.ctx.fillStyle = `rgba(255, 250, 220, ${(twinkle - 0.6) * 2.5})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, starSize * 0.5, 0, Math.PI * 2);
        this.ctx.fill();

        // 4-point star ray
        this.ctx.strokeStyle = `rgba(255, 235, 160, ${(twinkle - 0.6) * 2})`;
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x - starSize, p.y);
        this.ctx.lineTo(p.x + starSize, p.y);
        this.ctx.moveTo(p.x, p.y - starSize);
        this.ctx.lineTo(p.x, p.y + starSize);
        this.ctx.stroke();
        this.ctx.restore();
      }
    });

    // 5. Draw Circling Pigeons over Charminar with Flapping Wings
    const charminarTop = this.sceneToScreen(1040, 320);
    this.pigeons.forEach((pg) => {
      const px = charminarTop.x + Math.cos(pg.angle) * (pg.radiusX * this.zoom);
      const py = charminarTop.y + Math.sin(pg.angle) * (pg.radiusY * this.zoom) - pg.altitudeOffset * this.zoom;
      const wingSpan = (3.5 + Math.sin(pg.wingCycle) * 2.0) * this.zoom;

      this.ctx.save();
      this.ctx.fillStyle = "#333D47";
      this.ctx.beginPath();
      // Flapping bird silhouette
      this.ctx.ellipse(px, py, 3.5 * this.zoom, 2.0 * this.zoom, pg.angle, 0, Math.PI * 2);
      this.ctx.fill();

      // Wing strokes
      this.ctx.strokeStyle = "#4A5568";
      this.ctx.lineWidth = 1.2 * this.zoom;
      this.ctx.beginPath();
      this.ctx.moveTo(px - wingSpan, py - 2 * this.zoom);
      this.ctx.lineTo(px, py);
      this.ctx.lineTo(px + wingSpan, py - 2 * this.zoom);
      this.ctx.stroke();
      this.ctx.restore();
    });

    // 6. Draw Ambient Deccan Sunlight Dust Motes
    if (this.timeMode !== "night") {
      this.dustMotes.forEach((dm) => {
        const p = this.sceneToScreen(dm.x, dm.y);
        if (p.x > 0 && p.x < cw && p.y > 0 && p.y < ch) {
          this.ctx.save();
          this.ctx.fillStyle = `rgba(255, 245, 215, ${dm.alpha * (this.timeMode === "golden" ? 0.7 : 0.35)})`;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, dm.size * this.zoom, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        }
      });
    }

    // 7. Draw Permanent Golden Discovery Badges for Found Relics
    WIMMEL_RELICS.forEach((r) => {
      if (this.foundSecrets.has(r.id)) {
        const p = this.sceneToScreen(r.x, r.y);
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

  // PROCEDURAL 2D CANVAS DRAWING ROUTINES FOR LIVING ACTORS

  // Draw 2:1 Isometric Auto-Rickshaw with spinning wheels & headlights
  drawAutoRickshaw(v) {
    const p = this.sceneToScreen(v.x, v.y);
    const z = this.zoom;
    const isFacingLeft = Math.cos(v.heading) < 0;

    this.ctx.save();
    this.ctx.translate(p.x, p.y);

    // Contact shadow
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    this.ctx.beginPath();
    this.ctx.ellipse(0, 4 * z, 18 * z, 8 * z, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Auto Body Chassis (Black base + Yellow Hood)
    this.ctx.fillStyle = "#1E293B"; // Dark chassis
    this.ctx.beginPath();
    this.ctx.roundRect(-14 * z, -12 * z, 28 * z, 14 * z, 3 * z);
    this.ctx.fill();

    // Bright Canvas Hood (Yellow / Orange)
    this.ctx.fillStyle = v.color || "#EAB308";
    this.ctx.beginPath();
    this.ctx.roundRect(-13 * z, -24 * z, 26 * z, 14 * z, 5 * z);
    this.ctx.fill();

    // Windshield frame
    this.ctx.fillStyle = "#94A3B8";
    const wsX = isFacingLeft ? -11 * z : 3 * z;
    this.ctx.fillRect(wsX, -22 * z, 8 * z, 10 * z);

    // Wheels (Black rubber + silver hub)
    [-10 * z, 10 * z].forEach((wx) => {
      this.ctx.fillStyle = "#0F172A";
      this.ctx.beginPath();
      this.ctx.arc(wx, 2 * z, 4 * z, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = "#CBD5E1";
      this.ctx.beginPath();
      this.ctx.arc(wx, 2 * z, 1.5 * z, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Night / Golden Headlights
    if (this.timeMode === "night" || this.timeMode === "golden") {
      const hlX = isFacingLeft ? -16 * z : 16 * z;
      this.ctx.fillStyle = "#FEF08A";
      this.ctx.beginPath();
      this.ctx.arc(hlX, -6 * z, 3 * z, 0, Math.PI * 2);
      this.ctx.fill();

      // Light beam cone
      this.ctx.fillStyle = "rgba(254, 240, 138, 0.25)";
      this.ctx.beginPath();
      this.ctx.moveTo(hlX, -6 * z);
      const coneDir = isFacingLeft ? -1 : 1;
      this.ctx.lineTo(hlX + coneDir * 40 * z, -16 * z);
      this.ctx.lineTo(hlX + coneDir * 40 * z, 10 * z);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  // Draw 2:1 Isometric Walking Pedestrian with step cycle bounce
  drawPedestrian(ped) {
    const p = this.sceneToScreen(ped.x, ped.y);
    const z = this.zoom;
    const stepBounce = Math.abs(Math.sin(ped.stepTimer * 7)) * 2.2 * z;
    const legSwing = Math.sin(ped.stepTimer * 7) * 4 * z;

    this.ctx.save();
    this.ctx.translate(p.x, p.y - stepBounce);

    // Contact shadow
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    this.ctx.beginPath();
    this.ctx.ellipse(0, stepBounce + 2 * z, 6 * z, 3 * z, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Legs
    this.ctx.strokeStyle = "#1E293B";
    this.ctx.lineWidth = 2 * z;
    this.ctx.beginPath();
    this.ctx.moveTo(-2 * z, -4 * z);
    this.ctx.lineTo(-2 * z - legSwing, 0);
    this.ctx.moveTo(2 * z, -4 * z);
    this.ctx.lineTo(2 * z + legSwing, 0);
    this.ctx.stroke();

    // Main Torso / Garment
    this.ctx.fillStyle = ped.color || "#2563EB";
    if (ped.type === "burqa") {
      this.ctx.beginPath();
      this.ctx.moveTo(-5 * z, 0);
      this.ctx.lineTo(0, -18 * z);
      this.ctx.lineTo(5 * z, 0);
      this.ctx.closePath();
      this.ctx.fill();
    } else {
      this.ctx.beginPath();
      this.ctx.roundRect(-4.5 * z, -16 * z, 9 * z, 12 * z, 2 * z);
      this.ctx.fill();
    }

    // Head
    this.ctx.fillStyle = "#D97706"; // Skin tone
    this.ctx.beginPath();
    this.ctx.arc(0, -19 * z, 3.5 * z, 0, Math.PI * 2);
    this.ctx.fill();

    // Headgear (Topi / Turban / Dupatta)
    if (ped.turbanColor) {
      this.ctx.fillStyle = ped.turbanColor;
      this.ctx.beginPath();
      this.ctx.arc(0, -21 * z, 3.8 * z, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (ped.capColor) {
      this.ctx.fillStyle = ped.capColor;
      this.ctx.fillRect(-3 * z, -23 * z, 6 * z, 3 * z);
    }

    // Special prop: Tea runner carrying brass tray
    if (ped.type === "tea_wallah") {
      this.ctx.fillStyle = "#CA8A04"; // Brass tray
      this.ctx.fillRect(4 * z, -12 * z, 7 * z, 2 * z);
      this.ctx.fillStyle = "#FAF4E9"; // Chai glass
      this.ctx.fillRect(5 * z, -15 * z, 2 * z, 3 * z);
      this.ctx.fillRect(8 * z, -15 * z, 2 * z, 3 * z);
    }

    this.ctx.restore();
  }

  // Draw Animated Craftsman Vignettes (Chai pouring, Bangle shaping, Attar sampling, Biscuit baking, Pigeon feeding)
  drawCraftsman(craft, timeSec) {
    const p = this.sceneToScreen(craft.x, craft.y);
    const z = this.zoom;

    this.ctx.save();
    this.ctx.translate(p.x, p.y);

    if (craft.type === "chai_master") {
      // Nimrah Irani Chai Master with waving tea stream between two brass vessels
      const waveOffset = Math.sin(timeSec * 6) * 5 * z;

      // Samovar Base
      this.ctx.fillStyle = "#B45309"; // Copper samovar
      this.ctx.beginPath();
      this.ctx.roundRect(-10 * z, -14 * z, 20 * z, 14 * z, 3 * z);
      this.ctx.fill();

      // Top Brass Vessel (Pouring pot)
      this.ctx.fillStyle = "#EAB308";
      this.ctx.beginPath();
      this.ctx.arc(-8 * z, -24 * z + waveOffset * 0.3, 4 * z, 0, Math.PI * 2);
      this.ctx.fill();

      // Bottom Brass Cup
      this.ctx.beginPath();
      this.ctx.arc(6 * z, -6 * z, 3.5 * z, 0, Math.PI * 2);
      this.ctx.fill();

      // Waving Irani Chai Stream (Golden liquid)
      this.ctx.strokeStyle = "#F59E0B";
      this.ctx.lineWidth = 2.2 * z;
      this.ctx.beginPath();
      this.ctx.moveTo(-6 * z, -20 * z + waveOffset * 0.3);
      this.ctx.quadraticCurveTo(0, -12 * z + waveOffset, 6 * z, -6 * z);
      this.ctx.stroke();
    } else if (craft.type === "bangle_craftsman") {
      // Lac Bangle Artisan shaping hot lacquer over fire pot
      const glow = (Math.sin(timeSec * 8) + 1) / 2;

      // Fire Pot Glow
      this.ctx.fillStyle = `rgba(239, 68, 68, ${0.4 + glow * 0.4})`;
      this.ctx.beginPath();
      this.ctx.arc(0, -4 * z, 10 * z, 0, Math.PI * 2);
      this.ctx.fill();

      // Fire coals
      this.ctx.fillStyle = "#F97316";
      this.ctx.beginPath();
      this.ctx.arc(0, -4 * z, 4 * z, 0, Math.PI * 2);
      this.ctx.fill();

      // Glowing hot bangle ring
      this.ctx.strokeStyle = "#FEF08A";
      this.ctx.lineWidth = 2.5 * z;
      this.ctx.beginPath();
      this.ctx.arc(Math.sin(timeSec * 4) * 3 * z, -12 * z, 5 * z, 0, Math.PI * 2);
      this.ctx.stroke();
    } else if (craft.type === "perfumer") {
      // Pathargatti Perfumer sampling Mitti Attar
      const dipY = Math.sin(timeSec * 3) * 4 * z;

      // Crystal Decanter
      this.ctx.fillStyle = "#38BDF8";
      this.ctx.beginPath();
      this.ctx.roundRect(-6 * z, -10 * z, 12 * z, 10 * z, 2 * z);
      this.ctx.fill();

      // Attar Swab Rod
      this.ctx.strokeStyle = "#F59E0B";
      this.ctx.lineWidth = 1.5 * z;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -18 * z + dipY);
      this.ctx.lineTo(0, -6 * z);
      this.ctx.stroke();
    } else if (craft.type === "pigeon_feeder") {
      // Mecca Masjid Pigeon Feeder scattering grain + hopping ground pigeons
      this.ctx.fillStyle = "#D97706";
      this.ctx.beginPath();
      this.ctx.arc(0, -16 * z, 3.5 * z, 0, Math.PI * 2);
      this.ctx.fill();

      // Scattering grain specks
      this.ctx.fillStyle = "#FEF08A";
      for (let i = 0; i < 5; i++) {
        const gx = Math.cos(timeSec * 4 + i) * 14 * z;
        const gy = Math.sin(timeSec * 4 + i) * 8 * z;
        this.ctx.fillRect(gx, gy, 1.5 * z, 1.5 * z);
      }

      // Ground Pigeons hopping & pecking
      for (let i = 0; i < 3; i++) {
        const px = -18 * z + i * 14 * z + Math.sin(timeSec * 5 + i) * 2 * z;
        const py = 4 * z + Math.abs(Math.sin(timeSec * 8 + i)) * -3 * z;
        this.ctx.fillStyle = "#64748B";
        this.ctx.beginPath();
        this.ctx.ellipse(px, py, 3 * z, 2 * z, 0, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.restore();
  }

  // Draw Animals (Trotting stray dogs & pecking chickens)
  drawAnimal(an, timeSec) {
    const p = this.sceneToScreen(an.x, an.y);
    const z = this.zoom;

    this.ctx.save();
    this.ctx.translate(p.x, p.y);

    if (an.type === "dog") {
      const tailWag = Math.sin(an.tailPhase) * 3 * z;
      this.ctx.fillStyle = "#D97706"; // Golden-brown stray dog
      this.ctx.beginPath();
      this.ctx.ellipse(0, -4 * z, 7 * z, 4 * z, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Tail
      this.ctx.strokeStyle = "#B45309";
      this.ctx.lineWidth = 1.8 * z;
      this.ctx.beginPath();
      this.ctx.moveTo(-6 * z, -4 * z);
      this.ctx.lineTo(-10 * z, -6 * z + tailWag);
      this.ctx.stroke();
    } else if (an.type === "chicken") {
      const peck = Math.abs(Math.sin(an.peckTimer)) * 2 * z;
      this.ctx.fillStyle = "#F59E0B"; // White/gold chicken
      this.ctx.beginPath();
      this.ctx.arc(0, -3 * z + peck, 3 * z, 0, Math.PI * 2);
      this.ctx.fill();

      // Red comb
      this.ctx.fillStyle = "#EF4444";
      this.ctx.fillRect(-1 * z, -6 * z + peck, 2 * z, 2 * z);
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
    // 1. Check ALL 35+ Living Hotspots (People, Shops, Pushcarts, Relics, Vehicles)
    for (const h of BAZAAR_HOTSPOTS) {
      const p = this.sceneToScreen(h.x, h.y);
      const dist = Math.hypot(screenX - p.x, screenY - p.y);
      if (dist <= Math.max(28, (h.radius || 30) * this.zoom)) {
        this.triggerPulse(h.x, h.y);
        if (h.isRelic && this.callbacks.onSecretClick) {
          this.callbacks.onSecretClick(h);
        } else if (this.callbacks.onHotspotClick) {
          this.callbacks.onHotspotClick(h);
        }
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

// PixiJS 8 Living City Atlas Engine for Old Hyderabad / Charminar
// Designed for Wimmelbild density, smooth camera navigation, and subtle ambient life

import { Application, Container, Sprite, Graphics, Texture } from "pixi.js";
import {
  SCENE_WIDTH,
  SCENE_HEIGHT,
  SCENE_ENTITIES,
  WIMMEL_SECRETS,
  VEHICLE_CORRIDORS,
  PEDESTRIAN_CORRIDORS,
} from "./sceneData.js";
import {
  renderCharminarCanvas,
  renderNimrahCafeCanvas,
  renderLaadShophouseCanvas,
  renderPathargattiArcadeCanvas,
  renderHaveliCanvas,
  renderMeccaGateCanvas,
} from "./assets/buildingSprites.js";
import {
  renderAutoCanvas,
  renderScooterCanvas,
  renderPushcartCanvas,
  renderTreeCanvas,
  renderStreetLampCanvas,
  renderSintexTankCanvas,
} from "./assets/propSprites.js";
import { renderCharacterCanvas } from "./assets/characterSprites.js";
import { renderRelicCanvas } from "./assets/relicSprites.js";

export class PixiWimmelEngine {
  constructor(containerEl, callbacks) {
    this.containerEl = containerEl;
    this.callbacks = callbacks || {};
    this.app = null;
    this.world = null;

    this.textures = new Map();
    this.secrets = new Set();
    this.timeMode = "day"; // "day", "golden", "night"
    this.isDestroyed = false;

    // Camera state
    this.camera = {
      x: 0,
      y: 0,
      zoom: 1,
      isDragging: false,
      startX: 0,
      startY: 0,
    };

    // Ambient actors
    this.ambientVehicles = [];
    this.ambientPedestrians = [];
    this.steamParticles = [];
    this.pigeons = [];
  }

  // Pre-render authored illustrated vector assets to GPU Textures
  initTextures() {
    // 1. Buildings
    this.textures.set("charminar", Texture.from(renderCharminarCanvas()));
    this.textures.set("nimrah_cafe", Texture.from(renderNimrahCafeCanvas()));
    this.textures.set("shophouse_0", Texture.from(renderLaadShophouseCanvas(0)));
    this.textures.set("shophouse_1", Texture.from(renderLaadShophouseCanvas(1)));
    this.textures.set("shophouse_2", Texture.from(renderLaadShophouseCanvas(2)));
    this.textures.set("shophouse_3", Texture.from(renderLaadShophouseCanvas(3)));
    this.textures.set("pathargatti", Texture.from(renderPathargattiArcadeCanvas()));
    this.textures.set("haveli_0", Texture.from(renderHaveliCanvas(0)));
    this.textures.set("haveli_1", Texture.from(renderHaveliCanvas(1)));
    this.textures.set("haveli_2", Texture.from(renderHaveliCanvas(2)));
    this.textures.set("mecca_gate", Texture.from(renderMeccaGateCanvas()));

    // 2. Props
    this.textures.set("auto_right", Texture.from(renderAutoCanvas(1)));
    this.textures.set("auto_left", Texture.from(renderAutoCanvas(-1)));
    this.textures.set("scooter_blue", Texture.from(renderScooterCanvas("#2563EB")));
    this.textures.set("scooter_red", Texture.from(renderScooterCanvas("#DC2626")));
    this.textures.set("scooter_cream", Texture.from(renderScooterCanvas("#F5EBE1")));
    this.textures.set("scooter_green", Texture.from(renderScooterCanvas("#15803D")));
    this.textures.set("cart_mango", Texture.from(renderPushcartCanvas("mango")));
    this.textures.set("cart_banana", Texture.from(renderPushcartCanvas("banana")));
    this.textures.set("cart_flower", Texture.from(renderPushcartCanvas("flower")));
    this.textures.set("tree_neem", Texture.from(renderTreeCanvas("neem")));
    this.textures.set("tree_palm", Texture.from(renderTreeCanvas("palm")));
    this.textures.set("lamp", Texture.from(renderStreetLampCanvas()));
    this.textures.set("tank", Texture.from(renderSintexTankCanvas()));

    // 3. Characters
    this.textures.set("char_kurta", Texture.from(renderCharacterCanvas("kurta", 1)));
    this.textures.set("char_burqa", Texture.from(renderCharacterCanvas("burqa", 1)));
    this.textures.set("char_saree_saffron", Texture.from(renderCharacterCanvas("saree_saffron", 1)));
    this.textures.set("char_saree_teal", Texture.from(renderCharacterCanvas("saree_teal", 1)));

    // 4. Discoverable Wimmelvis Relics
    WIMMEL_SECRETS.forEach((s) => {
      this.textures.set(s.id, Texture.from(renderRelicCanvas(s.id)));
    });
  }

  // Initialize PixiJS 8 Application & Scene Graph
  async init() {
    this.app = new Application();
    const width = this.containerEl?.clientWidth || window.innerWidth;
    const height = this.containerEl?.clientHeight || window.innerHeight;

    await this.app.init({
      width,
      height,
      backgroundColor: 0xfaf6ee,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    if (this.isDestroyed) {
      try {
        if (this.app?.renderer) this.app.destroy(true);
      } catch {}
      this.app = null;
      return;
    }

    this.containerEl.appendChild(this.app.canvas);
    this.initTextures();

    // World root container
    this.world = new Container();
    this.app.stage.addChild(this.world);

    // 7 Depth-Sorted Scene Layers
    this.groundLayer = new Container();
    this.bgLayer = new Container();
    this.midLayer = new Container();
    this.propsLayer = new Container();
    this.actorLayer = new Container();
    this.fgLayer = new Container();
    this.hotspotLayer = new Container();
    this.lightingLayer = new Container();

    this.world.addChild(
      this.groundLayer,
      this.bgLayer,
      this.midLayer,
      this.propsLayer,
      this.actorLayer,
      this.fgLayer,
      this.hotspotLayer,
      this.lightingLayer
    );

    // Build scene geometry & entities
    this.buildGround();
    this.buildEntities();
    this.buildHotspots();
    this.buildLivingActors();
    this.buildLightingOverlay();

    // Initial camera positioning: Center gracefully on Charminar & Bazaars
    this.centerOnCharminar();

    // ResizeObserver for responsive viewport
    if (typeof window !== "undefined" && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver((entries) => {
        if (this.isDestroyed || !this.app || !this.app.renderer) return;
        for (const entry of entries) {
          const { width: rw, height: rh } = entry.contentRect;
          if (rw > 0 && rh > 0) {
            this.app.renderer.resize(rw, rh);
          }
        }
      });
      this.resizeObserver.observe(this.containerEl);
    }

    // Setup Ticker loop for ambient movement
    this.app.ticker.add((time) => {
      this.update(time.deltaTime);
    });

    // Setup Pointer & Gesture Navigation
    this.bindNavigationEvents();
  }

  // Continuous Illustrated Ground (Sandstone Flagstones, Roads, Curbs)
  buildGround() {
    const g = new Graphics();

    // 1. Sandstone Base Paving
    g.rect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
    g.fill(0xede2d0);

    // 2. Main East-West Bazaar Road Corridor
    g.rect(0, 1070, SCENE_WIDTH, 140);
    g.fill(0xbfaea0);

    // 3. North-South Pathargatti Road Corridor
    g.rect(880, 0, 380, SCENE_HEIGHT);
    g.fill(0xc4b3a4);

    // 4. Central Charminar Flagstone Plaza
    g.rect(780, 680, 580, 440);
    g.fill(0xf5ebe0);
    g.stroke({ width: 3, color: 0xc4a387 });

    // 5. Decorative Paving Medallion around Charminar
    g.circle(1070, 890, 190);
    g.stroke({ width: 2, color: 0xd9bfa7 });

    // 6. Sidewalk Granite Curbs
    g.moveTo(0, 1068);
    g.lineTo(SCENE_WIDTH, 1068);
    g.stroke({ width: 2.5, color: 0x8a7a6c });

    g.moveTo(0, 1212);
    g.lineTo(SCENE_WIDTH, 1212);
    g.stroke({ width: 2.5, color: 0x8a7a6c });

    this.groundLayer.addChild(g);
  }

  // Populate Layered Scene Entities
  buildEntities() {
    SCENE_ENTITIES.forEach((item) => {
      const tex = this.textures.get(item.asset);
      if (!tex) return;

      const sprite = new Sprite(tex);
      sprite.anchor.set(0.5, 0.9); // Anchor near bottom-center
      sprite.position.set(item.x, item.y);
      if (item.scale) sprite.scale.set(item.scale);

      // Interactive hover & inspection
      if (item.interactive) {
        sprite.eventMode = "static";
        sprite.cursor = "pointer";

        sprite.on("pointerover", () => {
          sprite.scale.set((item.scale || 1) * 1.02);
          if (this.callbacks.onHover) this.callbacks.onHover(item);
        });

        sprite.on("pointerout", () => {
          sprite.scale.set(item.scale || 1);
          if (this.callbacks.onHover) this.callbacks.onHover(null);
        });

        sprite.on("pointertap", () => {
          if (this.callbacks.onBuildingClick) this.callbacks.onBuildingClick(item);
        });
      }

      // Assign to appropriate layer
      if (item.layer < 15) {
        this.bgLayer.addChild(sprite);
      } else if (item.layer < 28) {
        this.midLayer.addChild(sprite);
      } else if (item.layer < 38) {
        this.propsLayer.addChild(sprite);
      } else {
        this.fgLayer.addChild(sprite);
      }
    });
  }

  // Wimmelvis Discoverable Cultural Relics
  buildHotspots() {
    WIMMEL_SECRETS.forEach((secret) => {
      const tex = this.textures.get(secret.id);
      if (!tex) return;

      const sprite = new Sprite(tex);
      sprite.anchor.set(0.5, 0.5);
      sprite.position.set(secret.x, secret.y);
      sprite.eventMode = "static";
      sprite.cursor = "pointer";

      // Subtle pulse indicator ring
      const ring = new Graphics();
      ring.position.set(secret.x, secret.y);
      this.hotspotLayer.addChild(ring);

      sprite.on("pointerover", () => {
        sprite.scale.set(1.15);
        if (this.callbacks.onHover) this.callbacks.onHover({ type: "secret", data: secret });
      });

      sprite.on("pointerout", () => {
        sprite.scale.set(1.0);
        if (this.callbacks.onHover) this.callbacks.onHover(null);
      });

      sprite.on("pointertap", () => {
        if (this.callbacks.onSecretClick) this.callbacks.onSecretClick(secret);
      });

      this.hotspotLayer.addChild(sprite);
      secret._sprite = sprite;
      secret._ring = ring;
    });
  }

  // Ambient Living Movement: Autos, Pedestrians, Steam, Pigeons
  buildLivingActors() {
    // 1. Ambient Moving Autos
    VEHICLE_CORRIDORS.forEach((corridor) => {
      const tex = this.textures.get(corridor.direction === 1 ? "auto_right" : "auto_left");
      const auto = new Sprite(tex);
      auto.anchor.set(0.5, 0.85);
      auto.scale.set(1.05);
      auto.position.set(corridor.points[0].x, corridor.points[0].y);
      this.actorLayer.addChild(auto);

      this.ambientVehicles.push({
        sprite: auto,
        corridor,
        progress: Math.random(),
      });
    });

    // 2. Ambient Pedestrians
    PEDESTRIAN_CORRIDORS.forEach((corridor) => {
      const tex = this.textures.get(`char_${corridor.variant}`);
      const ped = new Sprite(tex);
      ped.anchor.set(0.5, 0.9);
      ped.scale.set(1.0);
      ped.position.set(corridor.points[0].x, corridor.points[0].y);
      this.actorLayer.addChild(ped);

      this.ambientPedestrians.push({
        sprite: ped,
        corridor,
        progress: Math.random(),
        bob: 0,
      });
    });

    // 3. Pigeons wheeling around Charminar minarets
    for (let i = 0; i < 6; i++) {
      const pg = new Graphics();
      pg.ellipse(0, 0, 3.5, 2);
      pg.fill(0xd6d3d1);
      this.fgLayer.addChild(pg);

      this.pigeons.push({
        graphic: pg,
        cx: 1040,
        cy: 490,
        radius: 70 + i * 22,
        speed: 0.012 + i * 0.002,
        angle: (i * Math.PI) / 3,
      });
    }
  }

  // Night / Dusk Lighting Overlay
  buildLightingOverlay() {
    this.lightingGraphic = new Graphics();
    this.lightingLayer.addChild(this.lightingGraphic);
    this.updateLighting();
  }

  updateLighting() {
    if (!this.lightingGraphic) return;
    this.lightingGraphic.clear();

    if (this.timeMode === "night") {
      // Midnight Blue Tint
      this.lightingGraphic.rect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
      this.lightingGraphic.fill({ color: 0x0a1020, alpha: 0.52 });

      // Warm Street Lantern Light Pools
      [
        { x: 880, y: 780, r: 70 },
        { x: 1220, y: 780, r: 70 },
        { x: 740, y: 1040, r: 75 },
        { x: 1380, y: 1040, r: 75 },
        { x: 1050, y: 880, r: 180 }, // Charminar core illumination
      ].forEach((spot) => {
        this.lightingGraphic.circle(spot.x, spot.y, spot.r);
        this.lightingGraphic.fill({ color: 0xffe082, alpha: 0.18 });
      });
    } else if (this.timeMode === "golden") {
      // Golden Hour Warm Amber Tint
      this.lightingGraphic.rect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
      this.lightingGraphic.fill({ color: 0xe67e22, alpha: 0.12 });
    }
  }

  // Animation Update Loop
  update(delta) {
    // 1. Update Vehicles
    this.ambientVehicles.forEach((v) => {
      v.progress += (v.corridor.speed * 0.0008 * delta) / 16;
      if (v.progress > 1) v.progress = 0;

      const pts = v.corridor.points;
      const t = v.progress * (pts.length - 1);
      const idx = Math.floor(t);
      const frac = t - idx;
      const p1 = pts[idx];
      const p2 = pts[Math.min(idx + 1, pts.length - 1)];

      v.sprite.x = p1.x + (p2.x - p1.x) * frac;
      v.sprite.y = p1.y + (p2.y - p1.y) * frac;
    });

    // 2. Update Pedestrians
    this.ambientPedestrians.forEach((p) => {
      p.progress += (p.corridor.speed * 0.0006 * delta) / 16;
      if (p.progress > 1) p.progress = 0;

      const pts = p.corridor.points;
      const t = p.progress * (pts.length - 1);
      const idx = Math.floor(t);
      const frac = t - idx;
      const p1 = pts[idx];
      const p2 = pts[Math.min(idx + 1, pts.length - 1)];

      p.bob += 0.12 * delta;
      p.sprite.x = p1.x + (p2.x - p1.x) * frac;
      p.sprite.y = p1.y + (p2.y - p1.y) * frac + Math.sin(p.bob) * 1.5;
    });

    // 3. Pigeons wheeling in formation
    this.pigeons.forEach((pig) => {
      pig.angle += pig.speed * delta;
      pig.graphic.x = pig.cx + Math.cos(pig.angle) * pig.radius;
      pig.graphic.y = pig.cy + Math.sin(pig.angle) * (pig.radius * 0.55);
    });

    // 4. Subtle pulse on undiscovered relics
    const now = performance.now();
    WIMMEL_SECRETS.forEach((s) => {
      if (s._ring) {
        s._ring.clear();
        const isFound = this.secrets.has(s.id);
        if (!isFound) {
          const pulse = (Math.sin(now / 220) + 1) * 0.5;
          s._ring.circle(0, 0, 14 + pulse * 4);
          s._ring.stroke({ width: 1.5, color: 0xd97706, alpha: 0.4 + pulse * 0.4 });
        } else {
          s._ring.circle(0, 0, 16);
          s._ring.stroke({ width: 1.5, color: 0x10b981, alpha: 0.6 });
        }
      }
    });
  }

  // Camera Framing: Center gracefully on Charminar
  centerOnCharminar() {
    if (!this.world || !this.containerEl) return;
    const viewW = this.containerEl.clientWidth;
    const viewH = this.containerEl.clientHeight;

    // Charminar center in world space
    const targetX = 1060;
    const targetY = 820;

    // Set initial zoom so the city fills the viewport nicely
    const initialZoom = Math.max(0.75, Math.min(1.2, viewW / 1200));
    this.camera.zoom = initialZoom;
    this.world.scale.set(initialZoom);

    this.camera.x = viewW / 2 - targetX * initialZoom;
    this.camera.y = viewH / 2 - targetY * initialZoom;
    this.world.position.set(this.camera.x, this.camera.y);
  }

  // Pointer & Touch Drag / Zoom Events
  bindNavigationEvents() {
    const el = this.containerEl;
    let touchDist = 0;
    let touchZoom = 1;

    this._onMouseDown = (e) => {
      this.camera.isDragging = true;
      this.camera.startX = e.clientX - this.world.x;
      this.camera.startY = e.clientY - this.world.y;
      el.style.cursor = "grabbing";
    };

    this._onMouseMove = (e) => {
      if (!this.camera.isDragging) return;
      this.camera.x = e.clientX - this.camera.startX;
      this.camera.y = e.clientY - this.camera.startY;
      this.world.position.set(this.camera.x, this.camera.y);
    };

    this._onMouseUp = () => {
      this.camera.isDragging = false;
      el.style.cursor = "grab";
    };

    this._onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const worldX = (mouseX - this.world.x) / this.camera.zoom;
      const worldY = (mouseY - this.world.y) / this.camera.zoom;

      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      const newZoom = Math.max(0.55, Math.min(2.4, this.camera.zoom * factor));

      this.camera.zoom = newZoom;
      this.world.scale.set(newZoom);

      this.camera.x = mouseX - worldX * newZoom;
      this.camera.y = mouseY - worldY * newZoom;
      this.world.position.set(this.camera.x, this.camera.y);
    };

    this._onTouchStart = (e) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        this.camera.isDragging = true;
        this.camera.startX = t.clientX - this.world.x;
        this.camera.startY = t.clientY - this.world.y;
      } else if (e.touches.length === 2) {
        touchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        touchZoom = this.camera.zoom;
      }
    };

    this._onTouchMove = (e) => {
      if (e.touches.length === 1 && this.camera.isDragging) {
        const t = e.touches[0];
        this.camera.x = t.clientX - this.camera.startX;
        this.camera.y = t.clientY - this.camera.startY;
        this.world.position.set(this.camera.x, this.camera.y);
      } else if (e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const ratio = dist / touchDist;
        const newZoom = Math.max(0.55, Math.min(2.4, touchZoom * ratio));
        this.camera.zoom = newZoom;
        this.world.scale.set(newZoom);
      }
    };

    this._onTouchEnd = () => {
      this.camera.isDragging = false;
    };

    el.addEventListener("mousedown", this._onMouseDown);
    window.addEventListener("mousemove", this._onMouseMove);
    window.addEventListener("mouseup", this._onMouseUp);
    el.addEventListener("wheel", this._onWheel, { passive: false });
    el.addEventListener("touchstart", this._onTouchStart);
    el.addEventListener("touchmove", this._onTouchMove, { passive: false });
    el.addEventListener("touchend", this._onTouchEnd);
  }

  unbindNavigationEvents() {
    const el = this.containerEl;
    if (el) {
      if (this._onMouseDown) el.removeEventListener("mousedown", this._onMouseDown);
      if (this._onWheel) el.removeEventListener("wheel", this._onWheel);
      if (this._onTouchStart) el.removeEventListener("touchstart", this._onTouchStart);
      if (this._onTouchMove) el.removeEventListener("touchmove", this._onTouchMove);
      if (this._onTouchEnd) el.removeEventListener("touchend", this._onTouchEnd);
    }
    if (this._onMouseMove) window.removeEventListener("mousemove", this._onMouseMove);
    if (this._onMouseUp) window.removeEventListener("mouseup", this._onMouseUp);
  }

  // Zoom Button Handlers
  zoomIn() {
    if (!this.world || !this.containerEl) return;
    const viewW = this.containerEl.clientWidth;
    const viewH = this.containerEl.clientHeight;
    const worldX = (viewW / 2 - this.world.x) / this.camera.zoom;
    const worldY = (viewH / 2 - this.world.y) / this.camera.zoom;

    const newZoom = Math.min(2.4, this.camera.zoom * 1.25);
    this.camera.zoom = newZoom;
    this.world.scale.set(newZoom);
    this.camera.x = viewW / 2 - worldX * newZoom;
    this.camera.y = viewH / 2 - worldY * newZoom;
    this.world.position.set(this.camera.x, this.camera.y);
  }

  zoomOut() {
    if (!this.world || !this.containerEl) return;
    const viewW = this.containerEl.clientWidth;
    const viewH = this.containerEl.clientHeight;
    const worldX = (viewW / 2 - this.world.x) / this.camera.zoom;
    const worldY = (viewH / 2 - this.world.y) / this.camera.zoom;

    const newZoom = Math.max(0.55, this.camera.zoom * 0.8);
    this.camera.zoom = newZoom;
    this.world.scale.set(newZoom);
    this.camera.x = viewW / 2 - worldX * newZoom;
    this.camera.y = viewH / 2 - worldY * newZoom;
    this.world.position.set(this.camera.x, this.camera.y);
  }

  // Change Time of Day
  setTimeMode(mode) {
    this.timeMode = mode;
    this.updateLighting();
  }

  // Sync found secrets
  setFoundSecrets(set) {
    this.secrets = set;
  }

  // Safe Cleanup
  destroy() {
    this.isDestroyed = true;
    if (this.resizeObserver) {
      try {
        this.resizeObserver.disconnect();
      } catch {}
      this.resizeObserver = null;
    }
    this.unbindNavigationEvents();
    if (this.app) {
      try {
        if (this.app.renderer) {
          this.app.destroy(true, { children: true });
        }
      } catch (err) {
        // Silently ignore any unmount edge case
      }
      this.app = null;
    }
  }
}

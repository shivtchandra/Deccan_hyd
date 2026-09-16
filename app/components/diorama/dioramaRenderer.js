// Canvas 2.5D Isometric Illustrated Living Engine for Old City / Charminar
// Designed for dense Wimmelbild & Vivacity Hyderabad visual fidelity

import {
  WORLD_SIZE,
  OLD_CITY_ENTITIES,
  CHARMINAR_SECRETS,
  VEHICLE_PATHS,
  PEDESTRIAN_PATHS,
  ROAD_CORRIDORS,
} from "./dioramaData.js";

export const TILE_W = 54;
export const TILE_H = 27;

// Transform grid coordinates (gx, gy, gz) to 2.5D isometric screen coordinates
export function isoToScreen(gx, gy, gz = 0) {
  return {
    x: (gx - gy) * (TILE_W / 2),
    y: (gx + gy) * (TILE_H / 2) - gz,
  };
}

// Transform screen coordinates back to ground plane isometric grid (gx, gy)
export function screenToIso(sx, sy) {
  return {
    gx: (sx / (TILE_W / 2) + sy / (TILE_H / 2)) / 2,
    gy: (sy / (TILE_H / 2) - sx / (TILE_W / 2)) / 2,
  };
}

export class DioramaRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.camera = {
      x: 0,
      y: 110, // Initial center offset framing Charminar and bazaars
      zoom: 1.15,
      isDragging: false,
      startX: 0,
      startY: 0,
    };

    this.timeMode = "day"; // "day", "golden", "night"
    this.foundSecrets = new Set();
    this.hoveredObject = null;

    // Ambient Moving Vehicles (Autos, Scooters)
    this.vehicles = [
      { path: VEHICLE_PATHS[0], progress: 0.12, speed: 0.00045, type: "auto", color: "#FFD000" },
      { path: VEHICLE_PATHS[0], progress: 0.68, speed: 0.00038, type: "auto", color: "#FFD000" },
      { path: VEHICLE_PATHS[1], progress: 0.35, speed: 0.00042, type: "scooter", color: "#2B6CB0" },
      { path: VEHICLE_PATHS[2], progress: 0.22, speed: 0.00048, type: "auto", color: "#FFD000" },
      { path: VEHICLE_PATHS[2], progress: 0.75, speed: 0.0004, type: "scooter", color: "#C53030" },
      { path: VEHICLE_PATHS[3], progress: 0.45, speed: 0.00046, type: "auto", color: "#FFD000" },
    ];

    // Ambient Pedestrians across 5 routes
    this.pedestrians = [
      { path: PEDESTRIAN_PATHS[0], progress: 0.15, speed: 0.00028, variant: 0 },
      { path: PEDESTRIAN_PATHS[0], progress: 0.65, speed: 0.00025, variant: 1 },
      { path: PEDESTRIAN_PATHS[1], progress: 0.3, speed: 0.00026, variant: 2 },
      { path: PEDESTRIAN_PATHS[1], progress: 0.8, speed: 0.00022, variant: 3 },
      { path: PEDESTRIAN_PATHS[2], progress: 0.2, speed: 0.0003, variant: 0 },
      { path: PEDESTRIAN_PATHS[2], progress: 0.7, speed: 0.00027, variant: 1 },
      { path: PEDESTRIAN_PATHS[3], progress: 0.1, speed: 0.00024, variant: 2 },
      { path: PEDESTRIAN_PATHS[3], progress: 0.55, speed: 0.00029, variant: 0 },
      { path: PEDESTRIAN_PATHS[4], progress: 0.4, speed: 0.00026, variant: 3 },
    ];

    // Particle systems: Nimrah tea steam
    this.steamParticles = [];

    // Wheeling flock of pigeons
    this.pigeons = [
      { gx: 9.6, gy: 9.6, gz: 185, flap: 0, rad: 3.2, speed: 0.02, angle: 0 },
      { gx: 12.8, gy: 9.6, gz: 185, flap: 1.2, rad: 3.8, speed: 0.022, angle: 1.5 },
      { gx: 9.6, gy: 12.8, gz: 185, flap: 2.5, rad: 4.2, speed: 0.018, angle: 3.1 },
      { gx: 12.8, gy: 12.8, gz: 185, flap: 3.8, rad: 3.5, speed: 0.024, angle: 4.7 },
      { gx: 11.2, gy: 8.2, gz: 0, flap: 0.5, ground: true },
      { gx: 11.6, gy: 8.5, gz: 0, flap: 0.8, ground: true },
      { gx: 10.8, gy: 8.6, gz: 0, flap: 1.4, ground: true },
    ];
  }

  interpolatePath(points, progress) {
    if (!points || points.length < 2) return { gx: 0, gy: 0, angle: 0 };
    const totalSegments = points.length - 1;
    const clamped = Math.max(0, Math.min(0.9999, progress % 1));
    const segmentFloat = clamped * totalSegments;
    const idx = Math.floor(segmentFloat);
    const t = segmentFloat - idx;
    const p1 = points[idx];
    const p2 = points[idx + 1];
    const gx = p1.gx + (p2.gx - p1.gx) * t;
    const gy = p1.gy + (p2.gy - p1.gy) * t;
    const p1Screen = isoToScreen(p1.gx, p1.gy);
    const p2Screen = isoToScreen(p2.gx, p2.gy);
    const angle = Math.atan2(p2Screen.y - p1Screen.y, p2Screen.x - p1Screen.x);
    return { gx, gy, angle };
  }

  screenToWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    return {
      x: (clientX - rect.left - cx - this.camera.x) / this.camera.zoom,
      y: (clientY - rect.top - cy - this.camera.y) / this.camera.zoom,
    };
  }

  // ==================== MAIN RENDER LOOP ====================
  render(now, dt) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const width = canvas.parentElement?.clientWidth || window.innerWidth;
    const height = canvas.parentElement?.clientHeight || window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. ATMOSPHERIC SKY / HORIZON
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    if (this.timeMode === "night") {
      sky.addColorStop(0, "#0A0E18");
      sky.addColorStop(0.65, "#141A28");
      sky.addColorStop(1, "#1E2230");
    } else if (this.timeMode === "golden") {
      sky.addColorStop(0, "#FBE3C8");
      sky.addColorStop(0.55, "#F7D2AB");
      sky.addColorStop(1, "#EEC194");
    } else {
      sky.addColorStop(0, "#FAF5EC");
      sky.addColorStop(0.7, "#EFE7D8");
      sky.addColorStop(1, "#E6DBC6");
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // 2. CAMERA TRANSFORMATION
    ctx.save();
    ctx.translate(width / 2 + this.camera.x, height / 2 + this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    // 3. CONTINUOUS ILLUSTRATED GROUND (NO CHESSBOARD GRID LINES)
    this.renderGround(ctx);

    // 4. COLLECT ALL ENTITIES FOR RIGID ISOMETRIC DEPTH SORTING
    const drawList = [];

    // Static buildings, trees, walls, props
    OLD_CITY_ENTITIES.forEach((e) => {
      const fx = e.footprintX || 1;
      const fy = e.footprintY || 1;
      // Anchor depth at bottom-front corner of footprint
      const depth = (e.gx + fx) + (e.gy + fy) + (e.layer || 4) * 0.05;
      drawList.push({ ...e, depth, entityType: "static" });
    });

    // Wimmelvis Discoverable Secret Relics
    CHARMINAR_SECRETS.forEach((s) => {
      const isFound = this.foundSecrets.has(s.id);
      const depth = s.gx + s.gy + (s.gz || 0) * 0.0005 + 0.12;
      drawList.push({ ...s, depth, isFound, entityType: "secret" });
    });

    // Update & Push Ambient Vehicles
    this.vehicles.forEach((v) => {
      v.progress += v.speed * (dt / 16);
      const pos = this.interpolatePath(v.path, v.progress);
      const depth = pos.gx + pos.gy + 0.08;
      drawList.push({
        entityType: "vehicle",
        vehicleType: v.type,
        color: v.color,
        gx: pos.gx,
        gy: pos.gy,
        angle: pos.angle,
        depth,
      });
    });

    // Update & Push Ambient Pedestrians
    this.pedestrians.forEach((p) => {
      p.progress += p.speed * (dt / 16);
      const pos = this.interpolatePath(p.path, p.progress);
      const depth = pos.gx + pos.gy + 0.09;
      drawList.push({
        entityType: "pedestrian",
        variant: p.variant,
        gx: pos.gx,
        gy: pos.gy,
        depth,
        bob: Math.sin(now / 150 + p.progress * 20) * 1.5,
      });
    });

    // Tea Steam Generator at Nimrah Cafe
    if (Math.random() < 0.3) {
      this.steamParticles.push({
        gx: 15.6 + (Math.random() - 0.5) * 0.4,
        gy: 8.8 + (Math.random() - 0.5) * 0.4,
        gz: 14,
        vy: 0.32,
        vx: (Math.random() - 0.5) * 0.05,
        life: 1.0,
      });
    }
    for (let i = this.steamParticles.length - 1; i >= 0; i--) {
      const sp = this.steamParticles[i];
      sp.gz += sp.vy;
      sp.gx += sp.vx;
      sp.life -= 0.016;
      if (sp.life <= 0) {
        this.steamParticles.splice(i, 1);
        continue;
      }
      const depth = sp.gx + sp.gy + sp.gz * 0.0005;
      drawList.push({ entityType: "steam", ...sp, depth });
    }

    // Pigeons (wheeling around minarets)
    this.pigeons.forEach((pig) => {
      pig.flap += 0.06;
      if (!pig.ground) {
        pig.angle += pig.speed;
        const cx = 11.5;
        const cy = 11.5;
        pig.gx = cx + Math.cos(pig.angle) * pig.rad;
        pig.gy = cy + Math.sin(pig.angle) * pig.rad;
      }
      const depth = pig.gx + pig.gy + (pig.gz || 0) * 0.0005 + (pig.ground ? 0.02 : 1.5);
      drawList.push({ entityType: "pigeon", ...pig, depth });
    });

    // STRICT ISOMETRIC Z-DEPTH SORT (Back to Front)
    drawList.sort((a, b) => a.depth - b.depth);

    // 5. DRAW EACH DEPTH-SORTED ENTITY
    drawList.forEach((item) => {
      if (item.entityType === "static") {
        this.renderStaticEntity(ctx, item, now);
      } else if (item.entityType === "vehicle") {
        this.renderVehicle(ctx, item);
      } else if (item.entityType === "pedestrian") {
        this.renderPedestrian(ctx, item);
      } else if (item.entityType === "secret") {
        this.renderSecretItem(ctx, item, now);
      } else if (item.entityType === "steam") {
        this.renderSteam(ctx, item);
      } else if (item.entityType === "pigeon") {
        this.renderPigeon(ctx, item);
      }
    });

    // 6. OVERHEAD CATENARY UTILITY WIRES
    this.renderOverheadWires(ctx);

    // 7. NIGHT / DUSK AMBIENT LIGHTING OVERLAY
    if (this.timeMode === "night") {
      ctx.fillStyle = "rgba(10, 14, 26, 0.42)";
      this.fillGroundPolygon(ctx);
    } else if (this.timeMode === "golden") {
      ctx.fillStyle = "rgba(225, 120, 40, 0.08)";
      this.fillGroundPolygon(ctx);
    }

    ctx.restore();
    ctx.restore();
  }

  fillGroundPolygon(ctx) {
    const p0 = isoToScreen(0, 0);
    const p1 = isoToScreen(WORLD_SIZE, 0);
    const p2 = isoToScreen(WORLD_SIZE, WORLD_SIZE);
    const p3 = isoToScreen(0, WORLD_SIZE);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();
  }

  // ==================== CONTINUOUS GROUND SURFACE ====================
  renderGround(ctx) {
    const isNight = this.timeMode === "night";
    const isGolden = this.timeMode === "golden";

    // 1. Overall Base Pavement (Sandstone & Basalt flagstones)
    ctx.fillStyle = isNight ? "#242220" : isGolden ? "#E2D0B5" : "#E8DEC8";
    const p0 = isoToScreen(0, 0);
    const p1 = isoToScreen(WORLD_SIZE, 0);
    const p2 = isoToScreen(WORLD_SIZE, WORLD_SIZE);
    const p3 = isoToScreen(0, WORLD_SIZE);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();

    // 2. Asphalt Road Corridors
    ctx.fillStyle = isNight ? "#1A1918" : isGolden ? "#B7A895" : "#C4B7A5";
    ROAD_CORRIDORS.forEach((rc) => {
      const c0 = isoToScreen(rc.minX, rc.minY);
      const c1 = isoToScreen(rc.maxX, rc.minY);
      const c2 = isoToScreen(rc.maxX, rc.maxY);
      const c3 = isoToScreen(rc.minX, rc.maxY);
      ctx.beginPath();
      ctx.moveTo(c0.x, c0.y);
      ctx.lineTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.lineTo(c3.x, c3.y);
      ctx.closePath();
      ctx.fill();
    });

    // 3. Central Charminar Flagstone Plaza (Light Buff Sandstone with Decorative Apron)
    ctx.fillStyle = isNight ? "#322C25" : isGolden ? "#F2E2C9" : "#F4EADB";
    const pl0 = isoToScreen(8.0, 8.0);
    const pl1 = isoToScreen(15.0, 8.0);
    const pl2 = isoToScreen(15.0, 15.0);
    const pl3 = isoToScreen(8.0, 15.0);
    ctx.beginPath();
    ctx.moveTo(pl0.x, pl0.y);
    ctx.lineTo(pl1.x, pl1.y);
    ctx.lineTo(pl2.x, pl2.y);
    ctx.lineTo(pl3.x, pl3.y);
    ctx.closePath();
    ctx.fill();

    // Octagonal Plaza Medallion
    ctx.strokeStyle = isNight ? "rgba(255, 235, 180, 0.1)" : "rgba(184, 95, 62, 0.18)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const octPoints = [
      isoToScreen(9.5, 8.0),
      isoToScreen(13.5, 8.0),
      isoToScreen(15.0, 9.5),
      isoToScreen(15.0, 13.5),
      isoToScreen(13.5, 15.0),
      isoToScreen(9.5, 15.0),
      isoToScreen(8.0, 13.5),
      isoToScreen(8.0, 9.5),
    ];
    ctx.moveTo(octPoints[0].x, octPoints[0].y);
    for (let i = 1; i < octPoints.length; i++) ctx.lineTo(octPoints[i].x, octPoints[i].y);
    ctx.closePath();
    ctx.stroke();

    // Sidewalk Granite Curb Stone Edges
    ctx.strokeStyle = isNight ? "#121110" : "#A3937F";
    ctx.lineWidth = 1.2;
    [
      [isoToScreen(8.5, 0), isoToScreen(8.5, 24)],
      [isoToScreen(14.5, 0), isoToScreen(14.5, 24)],
      [isoToScreen(0, 8.5), isoToScreen(24, 8.5)],
      [isoToScreen(0, 14.5), isoToScreen(24, 14.5)],
    ].forEach(([sA, sB]) => {
      ctx.beginPath();
      ctx.moveTo(sA.x, sA.y);
      ctx.lineTo(sB.x, sB.y);
      ctx.stroke();
    });
  }

  // ==================== STATIC ENTITY DISPATCHER ====================
  renderStaticEntity(ctx, e, now) {
    const isNight = this.timeMode === "night";
    const isGolden = this.timeMode === "golden";
    const pt = isoToScreen(e.gx, e.gy, e.gz || 0);
    const isHovered = this.hoveredObject?.id === e.id;

    ctx.save();
    ctx.translate(pt.x, pt.y);

    if (e.family === "charminar") {
      this.drawCharminar(ctx, e, isNight, isGolden);
    } else if (e.family === "ceremonial_arch") {
      this.drawCeremonialArch(ctx, e, isNight, isGolden);
    } else if (e.family === "monumental_gate") {
      this.drawMeccaGate(ctx, e, isNight, isGolden);
    } else if (e.family === "stone_wall") {
      this.drawStoneWall(ctx, e, isNight, isGolden);
    } else if (e.family === "pathargatti_arcade") {
      this.drawPathargattiArcade(ctx, e, isNight, isGolden);
    } else if (e.family === "shophouse") {
      this.drawShophouse(ctx, e, isNight, isGolden);
    } else if (e.family === "cafe") {
      this.drawNimrahCafe(ctx, e, isNight, isGolden);
    } else if (e.family === "civic_palace") {
      this.drawCivicPalace(ctx, e, isNight, isGolden);
    } else if (e.family === "haveli") {
      this.drawHaveli(ctx, e, isNight, isGolden);
    } else if (e.family === "commercial") {
      this.drawCommercialBlock(ctx, e, isNight, isGolden);
    } else if (e.type === "tree") {
      this.drawTree(ctx, e, isNight, isGolden);
    } else if (e.type === "prop") {
      this.drawProp(ctx, e, isNight, isGolden);
    }

    // Subtle Architectural Highlight on Hover
    if (e.interactive && isHovered) {
      ctx.strokeStyle = "rgba(217, 119, 54, 0.75)";
      ctx.lineWidth = 2.5;
      const bw = (e.footprintX || 1) * 22;
      const bh = e.height || 45;
      ctx.strokeRect(-bw / 2, -bh - 4, bw, bh + 8);
    }

    ctx.restore();
  }

  // ==================== 1. CHARMINAR ====================
  drawCharminar(ctx, e, isNight, isGolden) {
    const stoneLight = isNight ? "#734A29" : isGolden ? "#E59E65" : "#D89255";
    const stoneDark = isNight ? "#52331B" : isGolden ? "#C47C42" : "#B8733A";
    const trim = isNight ? "#945D33" : isGolden ? "#F4B882" : "#EAB078";
    const archDark = isNight ? "#0D0F14" : "#2B1A13";

    // Ground Shadow
    ctx.fillStyle = "rgba(0,0,0,0.34)";
    ctx.beginPath();
    ctx.ellipse(0, 18, 78, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Central Sandstone Core (Left & Right Faces)
    // Left Face
    ctx.fillStyle = stoneDark;
    ctx.beginPath();
    ctx.moveTo(-54, -14);
    ctx.lineTo(0, 14);
    ctx.lineTo(0, -92);
    ctx.lineTo(-54, -120);
    ctx.closePath();
    ctx.fill();

    // Right Face
    ctx.fillStyle = stoneLight;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.lineTo(54, -14);
    ctx.lineTo(54, -120);
    ctx.lineTo(0, -92);
    ctx.closePath();
    ctx.fill();

    // Upper Balustrade Deck
    ctx.fillStyle = trim;
    ctx.beginPath();
    ctx.moveTo(0, -92);
    ctx.lineTo(54, -120);
    ctx.lineTo(0, -148);
    ctx.lineTo(-54, -120);
    ctx.closePath();
    ctx.fill();

    // Stucco Decorative Frieze Band
    ctx.fillStyle = isNight ? "#613D22" : "#F6CDA6";
    ctx.beginPath();
    ctx.moveTo(-54, -68);
    ctx.lineTo(0, -40);
    ctx.lineTo(54, -68);
    ctx.lineTo(54, -73);
    ctx.lineTo(0, -45);
    ctx.lineTo(-54, -73);
    ctx.closePath();
    ctx.fill();

    // Grand Arched Portals (Pointed Deccan Arches)
    // Left Arch
    ctx.fillStyle = archDark;
    ctx.beginPath();
    ctx.moveTo(-38, -8);
    ctx.lineTo(-12, 5);
    ctx.lineTo(-12, -56);
    ctx.lineTo(-38, -69);
    ctx.closePath();
    ctx.fill();

    // Right Arch
    ctx.beginPath();
    ctx.moveTo(12, 5);
    ctx.lineTo(38, -8);
    ctx.lineTo(38, -69);
    ctx.lineTo(12, -56);
    ctx.closePath();
    ctx.fill();

    // Second Floor Jali Lattice Screen Gallery
    const windowColor = isNight ? "#FFE082" : "#3F261B";
    [-36, -22, 22, 36].forEach((wx) => {
      ctx.fillStyle = windowColor;
      ctx.fillRect(wx - 4, -86, 8, 12);
      ctx.strokeStyle = trim;
      ctx.lineWidth = 1;
      ctx.strokeRect(wx - 4, -86, 8, 12);
    });

    // 4 Grand Octagonal Minarets with Double Cantilever Balconies & Onion Domes
    const minarets = [
      { x: -54, y: -120, z: 128 }, // West
      { x: 0, y: -92, z: 128 },    // South
      { x: 54, y: -120, z: 128 },  // East
      { x: 0, y: -148, z: 128 },   // North
    ];

    minarets.forEach((m) => {
      // Minaret Shaft
      ctx.fillStyle = trim;
      ctx.fillRect(m.x - 6, m.y - m.z, 12, m.z);

      // Balcony 1 (Lower Cantilever)
      ctx.fillStyle = "#E76F51";
      ctx.fillRect(m.x - 9, m.y - m.z + 46, 18, 5);
      ctx.fillStyle = "#2B2119";
      ctx.fillRect(m.x - 7, m.y - m.z + 44, 14, 2);

      // Balcony 2 (Upper Cantilever)
      ctx.fillStyle = "#E76F51";
      ctx.fillRect(m.x - 9, m.y - m.z + 86, 18, 5);
      ctx.fillStyle = "#2B2119";
      ctx.fillRect(m.x - 7, m.y - m.z + 84, 14, 2);

      // Fluted Onion Dome
      ctx.fillStyle = stoneLight;
      ctx.beginPath();
      ctx.arc(m.x, m.y - m.z - 8, 9, 0, Math.PI * 2);
      ctx.fill();

      // Brass Finial
      ctx.fillStyle = "#FFD54F";
      ctx.fillRect(m.x - 1.5, m.y - m.z - 22, 3, 14);
      ctx.beginPath();
      ctx.arc(m.x, m.y - m.z - 22, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Architectural Floodlight Glow at Night
    if (isNight) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.22)";
      ctx.beginPath();
      ctx.arc(0, -70, 115, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ==================== 2. MACHLI KAMAN (CEREMONIAL ARCH) ====================
  drawCeremonialArch(ctx, e, isNight, isGolden) {
    const stone = isNight ? "#4F443B" : isGolden ? "#D2B89D" : "#B8A28C";
    const shadow = isNight ? "#382F28" : isGolden ? "#B4967A" : "#98826D";

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.ellipse(0, 10, 52, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Arch Pillars
    // Left Pillar
    ctx.fillStyle = shadow;
    ctx.fillRect(-38, -75, 14, 75);
    // Right Pillar
    ctx.fillStyle = stone;
    ctx.fillRect(24, -75, 14, 75);

    // Spanning Arch Head
    ctx.fillStyle = stone;
    ctx.beginPath();
    ctx.moveTo(-40, -75);
    ctx.lineTo(40, -75);
    ctx.lineTo(40, -95);
    ctx.lineTo(-40, -95);
    ctx.closePath();
    ctx.fill();

    // Grand Arched Void
    ctx.fillStyle = isNight ? "#11141B" : "#241B15";
    ctx.beginPath();
    ctx.arc(0, -68, 24, Math.PI, 0, false);
    ctx.lineTo(24, 0);
    ctx.lineTo(-24, 0);
    ctx.closePath();
    ctx.fill();

    // Keystone Ornamental Fish Medallion
    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.arc(0, -82, 5, 0, Math.PI * 2);
    ctx.fill();

    // Parapet Merlons
    ctx.fillStyle = shadow;
    for (let x = -36; x <= 36; x += 12) {
      ctx.fillRect(x - 3, -99, 6, 4);
    }
  }

  // ==================== 3. MECCA MASJID GATEWAY & WALL ====================
  drawMeccaGate(ctx, e, isNight, isGolden) {
    const stone = isNight ? "#45403C" : isGolden ? "#7D7268" : "#82776D";
    const shadow = isNight ? "#2F2B28" : isGolden ? "#5C5249" : "#62584F";

    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(0, 10, 50, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gatehouse Left Face
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(-38, -10);
    ctx.lineTo(0, 10);
    ctx.lineTo(0, -50);
    ctx.lineTo(-38, -70);
    ctx.closePath();
    ctx.fill();

    // Gatehouse Right Face
    ctx.fillStyle = stone;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(38, -10);
    ctx.lineTo(38, -70);
    ctx.lineTo(0, -50);
    ctx.closePath();
    ctx.fill();

    // Arched Portal Opening
    ctx.fillStyle = isNight ? "#0E0F12" : "#241D17";
    ctx.beginPath();
    ctx.moveTo(-18, 1);
    ctx.lineTo(18, -8);
    ctx.lineTo(18, -38);
    ctx.lineTo(-18, -29);
    ctx.closePath();
    ctx.fill();

    // Granite Crenellations
    ctx.fillStyle = stone;
    for (let bx = -32; bx <= 32; bx += 10) {
      ctx.fillRect(bx - 3, -68 - (bx > 0 ? bx * 0.35 : -bx * 0.35), 6, 6);
    }
  }

  drawStoneWall(ctx, e, isNight, isGolden) {
    const wallColor = isNight ? "#38332E" : "#756B61";
    const shadowColor = isNight ? "#282420" : "#574E46";
    const length = (e.footprintX || 3) * 16;
    const h = e.height || 36;

    ctx.fillStyle = shadowColor;
    ctx.fillRect(-length / 2, -h, length / 2, h);
    ctx.fillStyle = wallColor;
    ctx.fillRect(0, -h, length / 2, h);

    // Stone Coping
    ctx.fillStyle = isNight ? "#48423C" : "#8A7E72";
    ctx.fillRect(-length / 2 - 2, -h - 3, length + 4, 3);
  }

  // ==================== 4. PATHARGATTI ARCADES (GRANITE COLONNADE) ====================
  drawPathargattiArcade(ctx, e, isNight, isGolden) {
    const graniteLight = isNight ? "#584236" : isGolden ? "#CFA487" : "#C49779";
    const graniteDark = isNight ? "#3E2D24" : isGolden ? "#A87A5E" : "#9E6F54";
    const trim = isNight ? "#735748" : isGolden ? "#E4BF9F" : "#DBB292";

    // Base Shadow
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(0, 6, 42, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main 3-Storey Stone Block
    // Left Face
    ctx.fillStyle = graniteDark;
    ctx.beginPath();
    ctx.moveTo(-34, -8);
    ctx.lineTo(0, 8);
    ctx.lineTo(0, -68);
    ctx.lineTo(-34, -84);
    ctx.closePath();
    ctx.fill();

    // Right Face
    ctx.fillStyle = graniteLight;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(34, -8);
    ctx.lineTo(34, -84);
    ctx.lineTo(0, -68);
    ctx.closePath();
    ctx.fill();

    // Vincent Esch Characteristic Pediment Cornice
    ctx.fillStyle = trim;
    ctx.beginPath();
    ctx.moveTo(0, -68);
    ctx.lineTo(34, -84);
    ctx.lineTo(0, -98);
    ctx.lineTo(-34, -84);
    ctx.closePath();
    ctx.fill();

    // Ground Floor Granite Arches (Pedestrian Walkway)
    ctx.fillStyle = isNight ? "#121419" : "#261A13";
    [-18, 14].forEach((ax) => {
      ctx.beginPath();
      ctx.arc(ax, ax > 0 ? -4 : 4, 7, Math.PI, 0, false);
      ctx.lineTo(ax + 7, ax > 0 ? 3 : 11);
      ctx.lineTo(ax - 7, ax > 0 ? 3 : 11);
      ctx.closePath();
      ctx.fill();
    });

    // Upper Floor Stone-framed Windows
    const winColor = isNight ? "#FFDF80" : "#3B2A20";
    [-20, -8, 8, 20].forEach((wx) => {
      ctx.fillStyle = winColor;
      ctx.fillRect(wx - 3, -48 - (wx > 0 ? wx * 0.25 : -wx * 0.25), 6, 9);
      ctx.strokeStyle = trim;
      ctx.lineWidth = 1;
      ctx.strokeRect(wx - 3, -48 - (wx > 0 ? wx * 0.25 : -wx * 0.25), 6, 9);
    });

    // Signboard Band (e.g. Madina / Zardozi)
    ctx.fillStyle = "#1E293B";
    ctx.fillRect(-26, -22, 52, 6);
    ctx.fillStyle = "#FFD54F";
    ctx.font = "bold 5px 'Outfit', sans-serif";
    ctx.fillText("PATHARGATTI", -18, -17);
  }

  // ==================== 5. LAAD BAZAAR SHOPHOUSES ====================
  drawShophouse(ctx, e, isNight, isGolden) {
    const wallC = isNight ? "#4C4135" : isGolden ? "#F2E2C8" : "#EFE2CD";
    const shadowC = isNight ? "#362D24" : isGolden ? "#C9B69B" : "#C4B094";
    const awningPalettes = [
      ["#2E7D32", "#FFFFFF"], // Emerald & White
      ["#D84315", "#FFE082"], // Saffron & Gold
      ["#AD1457", "#FFFFFF"], // Rose & Cream
      ["#1565C0", "#E0E7FF"], // Royal Deccan Blue
    ];
    const awning = awningPalettes[(e.variant || 0) % awningPalettes.length];

    // Building Wall
    ctx.fillStyle = shadowC;
    ctx.beginPath();
    ctx.moveTo(-28, -6);
    ctx.lineTo(0, 6);
    ctx.lineTo(0, -48);
    ctx.lineTo(-28, -60);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = wallC;
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(28, -6);
    ctx.lineTo(28, -60);
    ctx.lineTo(0, -48);
    ctx.closePath();
    ctx.fill();

    // Sloped Terracotta Eaves Roof
    ctx.fillStyle = "#B85F3E";
    ctx.beginPath();
    ctx.moveTo(0, -48);
    ctx.lineTo(30, -62);
    ctx.lineTo(0, -74);
    ctx.lineTo(-30, -62);
    ctx.closePath();
    ctx.fill();

    // Striped Canvas Awning projecting over street
    ctx.fillStyle = awning[0];
    ctx.beginPath();
    ctx.moveTo(-26, -2);
    ctx.lineTo(26, -14);
    ctx.lineTo(28, -26);
    ctx.lineTo(-24, -14);
    ctx.closePath();
    ctx.fill();

    // Awning Stripes
    ctx.strokeStyle = awning[1];
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    [-18, -8, 4, 16].forEach((ax) => {
      ctx.moveTo(ax, -ax * 0.25 - 6);
      ctx.lineTo(ax + 2, -ax * 0.25 - 19);
    });
    ctx.stroke();

    // Open Street Display Counters: Sparkle Lacquer Bangles / Attar / Pearls
    ctx.fillStyle = "#E91E63";
    ctx.fillRect(-18, 0, 7, 5); // Crimson bangles
    ctx.fillStyle = "#00BCD4";
    ctx.fillRect(-9, 3, 7, 5);  // Turquoise bangles
    ctx.fillStyle = "#FFB300";
    ctx.fillRect(8, -2, 7, 5);   // Gold jewellery tray

    // Warm Window Light at Night
    if (isNight) {
      ctx.fillStyle = "rgba(255, 220, 100, 0.7)";
      ctx.fillRect(-16, -38, 9, 8);
      ctx.fillRect(8, -46, 9, 8);
    }
  }

  // ==================== 6. NIMRAH CAFE & BAKERY ====================
  drawNimrahCafe(ctx, e, isNight, isGolden) {
    // Cafe Walls
    ctx.fillStyle = isNight ? "#543C29" : isGolden ? "#F8E7D1" : "#F4E0C7";
    ctx.beginPath();
    ctx.moveTo(-34, -8);
    ctx.lineTo(0, 8);
    ctx.lineTo(34, -8);
    ctx.lineTo(34, -48);
    ctx.lineTo(0, -32);
    ctx.lineTo(-34, -48);
    ctx.closePath();
    ctx.fill();

    // Deep Green & Cream Cafe Signboard & Awning
    ctx.fillStyle = "#1E3A2F";
    ctx.beginPath();
    ctx.moveTo(-36, -2);
    ctx.lineTo(36, -18);
    ctx.lineTo(38, -30);
    ctx.lineTo(-34, -14);
    ctx.closePath();
    ctx.fill();

    // Signboard Text
    ctx.fillStyle = "#FFFDF9";
    ctx.font = "bold 8px 'Outfit', sans-serif";
    ctx.fillText("NIMRAH CAFE", -18, -20);

    // Bakery Display Counter with Glass Case
    ctx.fillStyle = "#94A3B8";
    ctx.fillRect(-14, -2, 14, 8);
    ctx.fillStyle = "#D97706"; // Osmania biscuits inside
    ctx.fillRect(-12, 0, 10, 4);

    // Outdoor Round Marble Tables
    [-14, 16].forEach((tx) => {
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.ellipse(tx, tx > 0 ? 4 : 10, 8, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Chai Glass on Table
      ctx.fillStyle = "#D97706";
      ctx.fillRect(tx - 1.5, (tx > 0 ? 4 : 10) - 4, 3, 4);
    });

    // Gleaming Brass Tea Samovar
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(2, -5, 8, 13);
    ctx.fillStyle = "#D97706";
    ctx.fillRect(3, -8, 6, 3);
    ctx.fillStyle = "#FFD54F";
    ctx.beginPath();
    ctx.arc(6, -8, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // ==================== 7. SARDAR MAHAL (CIVIC PALACE) ====================
  drawCivicPalace(ctx, e, isNight, isGolden) {
    const palaceLight = isNight ? "#524840" : isGolden ? "#EAE0D3" : "#E2D8CA";
    const palaceDark = isNight ? "#3C342D" : isGolden ? "#C2B5A5" : "#BAAC9C";
    const trim = isNight ? "#6E6257" : isGolden ? "#F6EEE3" : "#F0E7DB";

    // Left Face
    ctx.fillStyle = palaceDark;
    ctx.beginPath();
    ctx.moveTo(-44, -10);
    ctx.lineTo(0, 10);
    ctx.lineTo(0, -74);
    ctx.lineTo(-44, -94);
    ctx.closePath();
    ctx.fill();

    // Right Face
    ctx.fillStyle = palaceLight;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(44, -10);
    ctx.lineTo(44, -94);
    ctx.lineTo(0, -74);
    ctx.closePath();
    ctx.fill();

    // Classical Corinthian Pilasters
    ctx.fillStyle = trim;
    [-32, -16, 16, 32].forEach((px) => {
      ctx.fillRect(px - 2.5, -68 - (px > 0 ? px * 0.22 : -px * 0.22), 5, 50);
    });

    // Grand Classical Pediment Roof
    ctx.fillStyle = trim;
    ctx.beginPath();
    ctx.moveTo(0, -74);
    ctx.lineTo(46, -96);
    ctx.lineTo(0, -112);
    ctx.lineTo(-46, -96);
    ctx.closePath();
    ctx.fill();

    // Arched Windows with Fanlights
    const winC = isNight ? "#FFDF80" : "#3F3025";
    [-24, 24].forEach((wx) => {
      ctx.fillStyle = winC;
      ctx.beginPath();
      ctx.arc(wx, -45 - (wx > 0 ? wx * 0.22 : -wx * 0.22), 6, Math.PI, 0, false);
      ctx.lineTo(wx + 6, -30);
      ctx.lineTo(wx - 6, -30);
      ctx.closePath();
      ctx.fill();
    });
  }

  // ==================== 8. COURTYARD HAVELIS ====================
  drawHaveli(ctx, e, isNight, isGolden) {
    const basePalette = [
      isNight ? "#63472C" : isGolden ? "#F0C895" : "#E8BC85", // Ochre lime wash
      isNight ? "#2E4848" : isGolden ? "#B7E0D2" : "#A7D7C5", // Pale turquoise
      isNight ? "#6B3A30" : isGolden ? "#DF8C7C" : "#D47B6A", // Terracotta wash
    ];
    const baseColor = basePalette[(e.variant || 0) % basePalette.length];
    const shadowColor = isNight ? "#241D17" : "#B88E5E";

    // Walls
    ctx.fillStyle = shadowColor;
    ctx.beginPath();
    ctx.moveTo(-34, -8);
    ctx.lineTo(0, 8);
    ctx.lineTo(0, -58);
    ctx.lineTo(-34, -74);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(34, -8);
    ctx.lineTo(34, -74);
    ctx.lineTo(0, -58);
    ctx.closePath();
    ctx.fill();

    // Carved Teakwood Jharokha Balcony
    ctx.fillStyle = "#5C3D2E";
    ctx.fillRect(8, -50, 16, 18);
    // Jali Lattice inside Jharokha
    ctx.fillStyle = isNight ? "rgba(255,215,0,0.6)" : "#D7CCC8";
    ctx.fillRect(10, -46, 12, 10);

    // Sloped Terracotta Eaves
    ctx.fillStyle = "#A0522D";
    ctx.beginPath();
    ctx.moveTo(0, -58);
    ctx.lineTo(36, -76);
    ctx.lineTo(0, -90);
    ctx.lineTo(-36, -76);
    ctx.closePath();
    ctx.fill();
  }

  // ==================== 9. COMMERCIAL / RESIDENTIAL BLOCKS ====================
  drawCommercialBlock(ctx, e, isNight, isGolden) {
    const wall = isNight ? "#3C424E" : isGolden ? "#E3E7EE" : "#D7DCE5";
    const shadow = isNight ? "#282C35" : isGolden ? "#B5BCC8" : "#AAB2C0";

    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(-32, -8);
    ctx.lineTo(0, 8);
    ctx.lineTo(0, -68);
    ctx.lineTo(-32, -84);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = wall;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(32, -8);
    ctx.lineTo(32, -84);
    ctx.lineTo(0, -68);
    ctx.closePath();
    ctx.fill();

    // Flat Roof Terrace
    ctx.fillStyle = isNight ? "#4B5563" : isGolden ? "#EDF2F7" : "#E2E8F0";
    ctx.beginPath();
    ctx.moveTo(0, -68);
    ctx.lineTo(32, -84);
    ctx.lineTo(0, -100);
    ctx.lineTo(-32, -84);
    ctx.closePath();
    ctx.fill();

    // Terrace Parapet Wall
    ctx.strokeStyle = isNight ? "#1F2937" : "#94A3B8";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Balcony Grilles
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.strokeRect(8, -46, 18, 12);

    // AC Unit
    ctx.fillStyle = "#E2E8F0";
    ctx.fillRect(10, -28, 8, 6);
  }

  // ==================== 10. TREES & URBAN FLORA ====================
  drawTree(ctx, e, isNight, isGolden) {
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(0, 3, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.fillStyle = "#5D4037";
    ctx.fillRect(-2.5, -24, 5, 24);

    if (e.family === "palm") {
      // Date Palm Fronds
      ctx.fillStyle = isNight ? "#1B4332" : isGolden ? "#3D8260" : "#2D6A4F";
      [-28, -14, 0, 14, 28].forEach((deg) => {
        ctx.save();
        ctx.translate(0, -24);
        ctx.rotate((deg * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, -11, 4, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    } else if (e.family === "gulmohar") {
      // Flowering Red Gulmohar
      ctx.fillStyle = isNight ? "#521A1A" : "#D9381E";
      ctx.beginPath();
      ctx.arc(0, -28, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2D6A4F";
      ctx.beginPath();
      ctx.arc(-6, -24, 10, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Peepal / Neem Tree (Lush layered canopy)
      ctx.fillStyle = isNight ? "#1F3B2B" : isGolden ? "#4D7846" : "#386641";
      ctx.beginPath();
      ctx.arc(0, -26, 16, 0, Math.PI * 2);
      ctx.arc(-8, -20, 11, 0, Math.PI * 2);
      ctx.arc(8, -20, 11, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ==================== 11. STREET PROPS & DETAILS ====================
  drawProp(ctx, e, isNight, isGolden) {
    if (e.family === "water_tank") {
      // Black Cylindrical Sintex Water Tank
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(-6, -14, 12, 14);
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.ellipse(0, -14, 6, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // White Band
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(-6, -7, 12, 2);
    } else if (e.family === "utility_pole") {
      // Wooden Pole with Crossbar
      ctx.fillStyle = "#473322";
      ctx.fillRect(-2, -e.height, 4, e.height);
      ctx.fillRect(-10, -e.height + 4, 20, 3);
      ctx.fillStyle = "#94A3B8"; // Insulators
      ctx.fillRect(-9, -e.height + 1, 3, 3);
      ctx.fillRect(6, -e.height + 1, 3, 3);
    } else if (e.family === "street_lamp") {
      // Victorian Cast Iron Street Lamp
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(-1.5, -e.height, 3, e.height);
      ctx.beginPath();
      ctx.arc(0, -e.height - 2, 4, 0, Math.PI * 2);
      ctx.fill();
      if (isNight) {
        ctx.fillStyle = "rgba(255, 235, 120, 0.4)";
        ctx.beginPath();
        ctx.arc(0, -e.height - 2, 18, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (e.family === "chetak_scooter") {
      // Parked Bajaj Chetak Scooter
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(0, 1, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = e.color || "#2B6CB0";
      ctx.fillRect(-4, -6, 8, 5);
      ctx.fillStyle = "#1A1A1A"; // Seat & Handlebar
      ctx.fillRect(-3, -7, 6, 2);
      ctx.fillRect(-5, -4, 2, 4);
    } else if (e.family === "fruit_cart") {
      // Handcart with Bananas or Mangoes
      ctx.fillStyle = "#78350F";
      ctx.fillRect(-9, -5, 18, 5);
      ctx.fillStyle = e.cargo === "mango" ? "#F59E0B" : "#84CC16";
      ctx.beginPath();
      ctx.arc(0, -7, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (e.family === "flower_cart") {
      // Handcart with Marigolds
      ctx.fillStyle = "#78350F";
      ctx.fillRect(-9, -5, 18, 5);
      ctx.fillStyle = "#EA580C"; // Orange marigolds
      ctx.beginPath();
      ctx.arc(-3, -7, 4, 0, Math.PI * 2);
      ctx.arc(3, -7, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (e.family === "bench") {
      ctx.fillStyle = "#854D0E";
      ctx.fillRect(-6, -4, 12, 4);
    } else if (e.family === "dish") {
      ctx.fillStyle = "#CBD5E1";
      ctx.beginPath();
      ctx.arc(0, -6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#475569";
      ctx.fillRect(-1, -6, 2, 7);
    } else if (e.family === "antenna") {
      ctx.strokeStyle = "#64748B";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -14);
      ctx.moveTo(-4, -10);
      ctx.lineTo(4, -10);
      ctx.stroke();
    }
  }

  // ==================== 12. AMBIENT MOVING VEHICLES ====================
  renderVehicle(ctx, v) {
    const pt = isoToScreen(v.gx, v.gy, 0);
    ctx.save();
    ctx.translate(pt.x, pt.y);

    ctx.fillStyle = "rgba(0,0,0,0.26)";
    ctx.beginPath();
    ctx.ellipse(0, 2, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (v.vehicleType === "auto") {
      // Yellow Auto Cabin
      ctx.fillStyle = "#FFD000";
      ctx.fillRect(-7, -8, 14, 7);
      // Black Canvas Canopy
      ctx.fillStyle = "#1A1A1A";
      ctx.fillRect(-7, -13, 14, 6);
      // Windshield
      ctx.fillStyle = "#F6AD55";
      ctx.fillRect(4, -11, 3, 5);

      // Night / Dusk Headlight Beam
      if (this.timeMode === "night" || this.timeMode === "golden") {
        ctx.fillStyle = "rgba(255, 235, 130, 0.38)";
        ctx.beginPath();
        ctx.moveTo(8, -5);
        ctx.lineTo(32, -14);
        ctx.lineTo(30, 8);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      // Moving Scooter
      ctx.fillStyle = v.color || "#2B6CB0";
      ctx.fillRect(-4, -7, 8, 5);
      ctx.fillStyle = "#1A1A1A";
      ctx.fillRect(-2, -9, 4, 3);
    }

    ctx.restore();
  }

  // ==================== 13. PEDESTRIANS ====================
  renderPedestrian(ctx, p) {
    const pt = isoToScreen(p.gx, p.gy, 0);
    ctx.save();
    ctx.translate(pt.x, pt.y + (p.bob || 0));

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(0, 1, 3.5, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Attire
    if (p.variant === 1) {
      // Black Burqa
      ctx.fillStyle = "#1A1A1A";
      ctx.beginPath();
      ctx.moveTo(-2.5, 0);
      ctx.lineTo(2.5, 0);
      ctx.lineTo(1.8, -9);
      ctx.lineTo(-1.8, -9);
      ctx.closePath();
      ctx.fill();
    } else if (p.variant === 2) {
      // Saffron Saree
      ctx.fillStyle = "#EA580C";
      ctx.fillRect(-2, -8, 4, 8);
    } else if (p.variant === 3) {
      // Turquoise Saree
      ctx.fillStyle = "#0D9488";
      ctx.fillRect(-2, -8, 4, 8);
    } else {
      // White Kurta
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(-1.5, -8, 3, 8);
    }

    // Head
    ctx.fillStyle = "#D7CCC8";
    ctx.beginPath();
    ctx.arc(0, -11, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ==================== 14. WIMMELVIS DISCOVERABLE SECRETS ====================
  renderSecretItem(ctx, s, now) {
    const pt = isoToScreen(s.gx, s.gy, s.gz || 0);
    const isHovered = this.hoveredObject?.id === s.id;

    ctx.save();
    ctx.translate(pt.x, pt.y);

    if (s.id === "secret-chai") {
      // Chai Tray & Saucer
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#C05621";
      ctx.fillRect(-2, -4, 4, 4);
    } else if (s.id === "secret-pearl") {
      // Pearl Velvet Jewellery Box
      ctx.fillStyle = "#991B1B";
      ctx.fillRect(-5, -5, 10, 7);
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(0, -2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (s.id === "secret-inscription") {
      // Inscribed Stone Tablet
      ctx.fillStyle = "#78350F";
      ctx.fillRect(-5, -6, 10, 8);
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-4, -5, 8, 6);
    } else if (s.id === "secret-attar") {
      // Crystal Perfume Decanter
      ctx.fillStyle = "#0284C7";
      ctx.fillRect(-3, -6, 6, 6);
      ctx.fillStyle = "#FDE047";
      ctx.fillRect(-1.5, -9, 3, 3);
    } else if (s.id === "secret-lacquer") {
      // Lacquer Bangle Mold
      ctx.fillStyle = "#78350F";
      ctx.fillRect(-6, -3, 12, 3);
      ctx.fillStyle = "#EC4899";
      ctx.beginPath();
      ctx.arc(0, -3, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (s.id === "secret-recipe") {
      // Illuminated Manuscript Scroll
      ctx.fillStyle = "#FEF3C7";
      ctx.fillRect(-5, -4, 10, 6);
      ctx.strokeStyle = "#B45309";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-5, -4, 10, 6);
    }

    // Gentle Golden Sparkle Aura (Restrained & Subtle, NO giant emojis!)
    if (!s.isFound) {
      const pulse = (Math.sin(now / 200) + 1) * 0.5;
      ctx.strokeStyle = `rgba(217, 119, 54, ${0.4 + pulse * 0.4})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, -2, 9 + pulse * 3.5, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Subtle Discovered Marker
      ctx.fillStyle = "#2A9D8F";
      ctx.beginPath();
      ctx.arc(6, -8, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 6px sans-serif";
      ctx.fillText("✓", 4.5, -6);
    }

    // Hover Highlight Circle
    if (isHovered) {
      ctx.strokeStyle = "#2A9D8F";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, -2, 14, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ==================== 15. STEAM & PIGEONS ====================
  renderSteam(ctx, s) {
    const pt = isoToScreen(s.gx, s.gy, s.gz);
    ctx.fillStyle = `rgba(240, 235, 230, ${s.life * 0.35})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, (1.0 - s.life) * 5.5 + 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  renderPigeon(ctx, p) {
    const pt = isoToScreen(p.gx, p.gy, p.gz || 0);
    ctx.save();
    ctx.translate(pt.x, pt.y);
    ctx.fillStyle = "#E2E8F0";
    ctx.beginPath();
    ctx.ellipse(0, 0, 2.5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Wing Flap
    if (!p.ground) {
      const wingY = Math.sin(p.flap) * 2;
      ctx.fillStyle = "#94A3B8";
      ctx.fillRect(-1.5, wingY - 2, 3, 1.5);
    }
    ctx.restore();
  }

  // ==================== 16. CATENARY UTILITY WIRES ====================
  renderOverheadWires(ctx) {
    const pole1 = isoToScreen(8.8, 7.8, 44);
    const pole2 = isoToScreen(14.2, 7.8, 44);
    const pole3 = isoToScreen(14.2, 14.5, 44);
    const pole4 = isoToScreen(8.8, 14.5, 44);
    const pole5 = isoToScreen(8.8, 1.8, 44);
    const pole6 = isoToScreen(1.8, 14.5, 44);

    ctx.strokeStyle = this.timeMode === "night" ? "rgba(0,0,0,0.5)" : "rgba(35, 28, 22, 0.4)";
    ctx.lineWidth = 0.8;

    [
      [pole1, pole2],
      [pole2, pole3],
      [pole3, pole4],
      [pole4, pole1],
      [pole1, pole5],
      [pole4, pole6],
    ].forEach(([pA, pB]) => {
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      const midX = (pA.x + pB.x) / 2;
      const midY = (pA.y + pB.y) / 2 + 7; // Catenary sag
      ctx.quadraticCurveTo(midX, midY, pB.x, pB.y);
      ctx.stroke();
    });
  }
}

// Authored Vector-Illustrated Building Assets for Old Hyderabad / Charminar
// Designed for PixiJS 8 texture caching and soft 2.5D perspective

// Helper to create an offscreen canvas and return a data URL / canvas
function createOffscreen(width, height) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  return c;
}

// 1. CHARMINAR MONUMENT (Art-directed Front-Three-Quarters Soft 2.5D View)
export function renderCharminarCanvas() {
  const w = 360;
  const h = 480;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  // Soft Base Shadow on Pavement
  ctx.fillStyle = "rgba(43, 33, 25, 0.26)";
  ctx.beginPath();
  ctx.ellipse(w / 2, h - 30, 140, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  const cx = w / 2;
  const baseY = h - 60;

  // Main Sandstone Gateway Block
  // Left Shadow Face
  ctx.fillStyle = "#B36B3B";
  ctx.beginPath();
  ctx.moveTo(cx - 100, baseY - 35);
  ctx.lineTo(cx, baseY);
  ctx.lineTo(cx, baseY - 180);
  ctx.lineTo(cx - 100, baseY - 215);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#8A4C24";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Right Sunlight Face
  ctx.fillStyle = "#D68C56";
  ctx.beginPath();
  ctx.moveTo(cx, baseY);
  ctx.lineTo(cx + 100, baseY - 35);
  ctx.lineTo(cx + 100, baseY - 215);
  ctx.lineTo(cx, baseY - 180);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#9E5B2E";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Grand Pointed Deccan Arches (Left Portal)
  ctx.fillStyle = "#261A13";
  ctx.beginPath();
  ctx.moveTo(cx - 75, baseY - 25);
  ctx.lineTo(cx - 20, baseY - 7);
  ctx.lineTo(cx - 20, baseY - 120);
  ctx.bezierCurveTo(cx - 20, baseY - 165, cx - 75, baseY - 185, cx - 75, baseY - 145);
  ctx.closePath();
  ctx.fill();

  // Grand Pointed Deccan Arches (Right Portal)
  ctx.beginPath();
  ctx.moveTo(cx + 20, baseY - 7);
  ctx.lineTo(cx + 75, baseY - 25);
  ctx.lineTo(cx + 75, baseY - 145);
  ctx.bezierCurveTo(cx + 75, baseY - 185, cx + 20, baseY - 165, cx + 20, baseY - 120);
  ctx.closePath();
  ctx.fill();

  // Inner Arch Warm Lantern Glow
  ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
  ctx.beginPath();
  ctx.arc(cx - 48, baseY - 80, 24, 0, Math.PI * 2);
  ctx.arc(cx + 48, baseY - 80, 24, 0, Math.PI * 2);
  ctx.fill();

  // Upper Decorative Plaster Cornice & Frieze
  ctx.fillStyle = "#F5D6B8";
  ctx.beginPath();
  ctx.moveTo(cx - 104, baseY - 135);
  ctx.lineTo(cx, baseY - 98);
  ctx.lineTo(cx + 104, baseY - 135);
  ctx.lineTo(cx + 104, baseY - 145);
  ctx.lineTo(cx, baseY - 108);
  ctx.lineTo(cx - 104, baseY - 145);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#8A4C24";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Second Floor Mosque Gallery with Jali Screen Arches
  const drawJali = (x, y, scale = 1) => {
    ctx.fillStyle = "#3B2519";
    ctx.beginPath();
    ctx.arc(x, y - 8 * scale, 5 * scale, Math.PI, 0, false);
    ctx.lineTo(x + 5 * scale, y + 8 * scale);
    ctx.lineTo(x - 5 * scale, y + 8 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#E8B282";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  };

  [-68, -48, -28, 28, 48, 68].forEach((offset) => {
    drawJali(cx + offset, baseY - 165, 1);
  });

  // Upper Terrace Balustrade Deck
  ctx.fillStyle = "#E8A872";
  ctx.beginPath();
  ctx.moveTo(cx - 106, baseY - 215);
  ctx.lineTo(cx, baseY - 180);
  ctx.lineTo(cx + 106, baseY - 215);
  ctx.lineTo(cx, baseY - 250);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#8A4C24";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Central Clock Medallion
  ctx.fillStyle = "#FFFDF9";
  ctx.beginPath();
  ctx.arc(cx, baseY - 145, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#8A4C24";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 4 Grand Octagonal Minarets with Double Cantilever Balconies & Ribbed Onion Domes
  const minaretPositions = [
    { x: cx - 100, y: baseY - 215, height: 210, zOrder: 1 }, // West
    { x: cx + 100, y: baseY - 215, height: 210, zOrder: 2 }, // East
    { x: cx, y: baseY - 180, height: 215, zOrder: 3 },       // South (Front)
    { x: cx, y: baseY - 250, height: 205, zOrder: 0 },       // North (Back)
  ];

  minaretPositions.forEach((m) => {
    const topY = m.y - m.height;

    // Minaret Shaft
    ctx.fillStyle = "#E2A06E";
    ctx.fillRect(m.x - 10, topY + 40, 20, m.height - 40);
    ctx.strokeStyle = "#8A4C24";
    ctx.lineWidth = 2;
    ctx.strokeRect(m.x - 10, topY + 40, 20, m.height - 40);

    // Lower Cantilevered Balcony
    ctx.fillStyle = "#C25D34";
    ctx.fillRect(m.x - 16, topY + 120, 32, 8);
    ctx.fillStyle = "#261A13";
    ctx.fillRect(m.x - 13, topY + 118, 26, 3);

    // Upper Cantilevered Balcony
    ctx.fillStyle = "#C25D34";
    ctx.fillRect(m.x - 16, topY + 60, 32, 8);
    ctx.fillStyle = "#261A13";
    ctx.fillRect(m.x - 13, topY + 58, 26, 3);

    // Fluted Chhatri Pavilion
    ctx.fillStyle = "#F5D6B8";
    ctx.fillRect(m.x - 11, topY + 20, 22, 20);

    // Fluted Onion Dome
    ctx.fillStyle = "#D68C56";
    ctx.beginPath();
    ctx.arc(m.x, topY + 10, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#8A4C24";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Golden Lotus Finial
    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.moveTo(m.x, topY - 14);
    ctx.lineTo(m.x + 3, topY);
    ctx.lineTo(m.x - 3, topY);
    ctx.closePath();
    ctx.fill();
  });

  return canvas;
}

// 2. NIMRAH CAFE & BAKERY (Iconic Irani Tea Stall & Corner House)
export function renderNimrahCafeCanvas() {
  const w = 260;
  const h = 220;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  // Shadow
  ctx.fillStyle = "rgba(43, 33, 25, 0.24)";
  ctx.beginPath();
  ctx.ellipse(w / 2, h - 20, 95, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  const bx = 30;
  const by = 40;
  const bw = 190;
  const bh = 140;

  // Cream & Stucco Wall
  ctx.fillStyle = "#F5EAD7";
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = "#6B4931";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);

  // Deep British-Deccan Green & Cream Awning
  ctx.fillStyle = "#1E4D38";
  ctx.fillRect(bx - 10, by + 40, bw + 20, 28);
  ctx.strokeStyle = "#133325";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx - 10, by + 40, bw + 20, 28);

  // Scalloped Awning Frill
  ctx.fillStyle = "#FAF5EC";
  for (let x = bx - 10; x < bx + bw + 10; x += 15) {
    ctx.beginPath();
    ctx.arc(x + 7.5, by + 68, 6.5, 0, Math.PI);
    ctx.fill();
  }

  // Signboard: NIMRAH CAFE & BAKERY
  ctx.fillStyle = "#FFFDF9";
  ctx.fillRect(bx + 15, by + 45, bw - 30, 18);
  ctx.strokeStyle = "#C99342";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx + 15, by + 45, bw - 30, 18);

  ctx.fillStyle = "#1E4D38";
  ctx.font = "bold 9.5px 'Outfit', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("NIMRAH CAFE & BAKERY", bx + bw / 2, by + 58);

  // Large Glass Showcase with Golden Osmania Biscuits & Tie Biscuits
  ctx.fillStyle = "#94A3B8";
  ctx.fillRect(bx + 20, by + 85, 75, 45);
  ctx.fillStyle = "#E0F2FE";
  ctx.fillRect(bx + 22, by + 87, 71, 41);
  ctx.fillStyle = "#D97706"; // Piles of Osmania biscuits
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      ctx.beginPath();
      ctx.arc(bx + 32 + c * 13, by + 98 + r * 11, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Large Boiling Brass Samovar (Gleaming Gold)
  ctx.fillStyle = "#F59E0B";
  ctx.fillRect(bx + 115, by + 78, 22, 38);
  ctx.fillStyle = "#D97706";
  ctx.fillRect(bx + 118, by + 70, 16, 8);
  ctx.fillStyle = "#FBBF24";
  ctx.beginPath();
  ctx.arc(bx + 126, by + 68, 6, 0, Math.PI * 2);
  ctx.fill();
  // Samovar Spigot
  ctx.fillStyle = "#B45309";
  ctx.fillRect(bx + 110, by + 98, 7, 4);

  // Outdoor Round Marble Tables with Chai Cups
  [-1, 1].forEach((dir) => {
    const tx = bx + bw / 2 + dir * 65;
    const ty = by + bh + 8;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.ellipse(tx, ty, 20, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Table Pedestal
    ctx.fillStyle = "#475569";
    ctx.fillRect(tx - 2, ty + 2, 4, 16);

    // Irani Chai Glasses
    ctx.fillStyle = "#D97706";
    ctx.fillRect(tx - 5, ty - 8, 4, 6);
    ctx.fillRect(tx + 3, ty - 8, 4, 6);
  });

  return canvas;
}

// 3. LAAD BAZAAR SHOPHOUSE (Lacquer Bangles, Pearls, Zardozi)
export function renderLaadShophouseCanvas(variant = 0) {
  const w = 220;
  const h = 260;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  const colors = [
    { awning1: "#2E7D32", awning2: "#FFFFFF", wall: "#F7EEDF", trim: "#B85F3E" }, // Emerald & Cream
    { awning1: "#C25D34", awning2: "#FDE68A", wall: "#EDE0CD", trim: "#8A3D2E" }, // Saffron & Gold
    { awning1: "#9F1239", awning2: "#FCE7F3", wall: "#F5E6DA", trim: "#701A75" }, // Rose & Velvet
    { awning1: "#1E40AF", awning2: "#DBEAFE", wall: "#EDE7DE", trim: "#1E3A8A" }, // Deccan Royal Blue
  ];
  const c = colors[variant % colors.length];

  // Ground Shadow
  ctx.fillStyle = "rgba(43, 33, 25, 0.22)";
  ctx.beginPath();
  ctx.ellipse(w / 2, h - 20, 85, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  const bx = 25;
  const by = 35;
  const bw = 170;
  const bh = 185;

  // 3-Storey Stucco Wall
  ctx.fillStyle = c.wall;
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = "#5C4033";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);

  // Upper Floor Carved Wooden Jharokha (Balcony)
  ctx.fillStyle = "#4A2E1B";
  ctx.fillRect(bx + 35, by + 20, 100, 52);
  ctx.fillStyle = "#FAF5EE";
  // Jali Screen Windows
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(bx + 44 + i * 22, by + 28, 14, 24);
    ctx.strokeStyle = "#4A2E1B";
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 44 + i * 22, by + 28, 14, 24);
  }

  // Sloped Terracotta Eaves Roof
  ctx.fillStyle = c.trim;
  ctx.beginPath();
  ctx.moveTo(bx - 8, by);
  ctx.lineTo(bx + bw + 8, by);
  ctx.lineTo(bx + bw / 2, by - 24);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#5C4033";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Striped Canvas Street Awning
  const ay = by + 105;
  ctx.fillStyle = c.awning1;
  ctx.beginPath();
  ctx.moveTo(bx - 12, ay);
  ctx.lineTo(bx + bw + 12, ay);
  ctx.lineTo(bx + bw + 16, ay + 36);
  ctx.lineTo(bx - 16, ay + 36);
  ctx.closePath();
  ctx.fill();

  // Awning Stripes
  ctx.fillStyle = c.awning2;
  for (let x = bx - 14; x < bx + bw + 14; x += 22) {
    ctx.fillRect(x, ay, 11, 36);
  }
  ctx.strokeStyle = "#382212";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx - 16, ay, bw + 32, 36);

  // Ground Floor Open Shopfront Display
  ctx.fillStyle = "#2D1B10";
  ctx.fillRect(bx + 10, ay + 36, bw - 20, 44);

  // Glittering Bangle & Attar Displays
  const gems = ["#EC4899", "#06B6D4", "#F59E0B", "#10B981", "#8B5CF6"];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      ctx.fillStyle = gems[(row + col) % gems.length];
      ctx.fillRect(bx + 20 + col * 22, ay + 45 + row * 10, 16, 7);
    }
  }

  return canvas;
}

// 4. PATHARGATTI STONE ARCADES (Vincent Esch Granite Colonnade)
export function renderPathargattiArcadeCanvas() {
  const w = 240;
  const h = 260;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  // Shadow
  ctx.fillStyle = "rgba(43, 33, 25, 0.25)";
  ctx.beginPath();
  ctx.ellipse(w / 2, h - 20, 90, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  const bx = 20;
  const by = 30;
  const bw = 200;
  const bh = 190;

  // Red Ashlar Granite Wall
  ctx.fillStyle = "#C48A69";
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = "#6B3D23";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);

  // Vincent Esch Characteristic Cornice & Balustrade
  ctx.fillStyle = "#E4B08F";
  ctx.fillRect(bx - 6, by - 6, bw + 12, 12);
  ctx.strokeStyle = "#6B3D23";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx - 6, by - 6, bw + 12, 12);

  // Upper Floor Arch Windows
  [-45, 0, 45].forEach((offset) => {
    const wx = bx + bw / 2 + offset;
    ctx.fillStyle = "#331F14";
    ctx.beginPath();
    ctx.arc(wx, by + 50, 14, Math.PI, 0, false);
    ctx.lineTo(wx + 14, by + 85);
    ctx.lineTo(wx - 14, by + 85);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#F2CCA8";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Ground Floor Monumental Granite Arches (Pedestrian Walkway)
  [-50, 50].forEach((offset) => {
    const ax = bx + bw / 2 + offset;
    ctx.fillStyle = "#1E120A";
    ctx.beginPath();
    ctx.arc(ax, by + 130, 28, Math.PI, 0, false);
    ctx.lineTo(ax + 28, by + bh);
    ctx.lineTo(ax - 28, by + bh);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#F2CCA8";
    ctx.lineWidth = 3;
    ctx.stroke();
  });

  // Shop Signboard
  ctx.fillStyle = "#1E293B";
  ctx.fillRect(bx + 25, by + 95, bw - 50, 16);
  ctx.fillStyle = "#FDE68A";
  ctx.font = "bold 8px 'Outfit', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PATHARGATTI TEXTILE GUILD", bx + bw / 2, by + 106);

  return canvas;
}

// 5. HYDERABADI COURTYARD HAVELI (Deodhi with Teak Balconies)
export function renderHaveliCanvas(variant = 0) {
  const w = 240;
  const h = 260;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  const palettes = [
    { wall: "#F4DEC3", trim: "#A45028", wood: "#503019" }, // Ochre
    { wall: "#D4EBE2", trim: "#286D5B", wood: "#402613" }, // Pale Turquoise
    { wall: "#F2D5CE", trim: "#9C3C28", wood: "#4A2812" }, // Terracotta
  ];
  const p = palettes[variant % palettes.length];

  // Ground Shadow
  ctx.fillStyle = "rgba(43, 33, 25, 0.22)";
  ctx.beginPath();
  ctx.ellipse(w / 2, h - 20, 85, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  const bx = 25;
  const by = 35;
  const bw = 190;
  const bh = 185;

  ctx.fillStyle = p.wall;
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = "#5C3E26";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);

  // Carved Teakwood Jharokha Balcony
  ctx.fillStyle = p.wood;
  ctx.fillRect(bx + 45, by + 30, 100, 60);
  ctx.strokeStyle = "#2B160A";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx + 45, by + 30, 100, 60);

  // Jali Lattice & Stained Glass Fanlights
  ctx.fillStyle = "#F5EBE1";
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(bx + 55 + i * 30, by + 40, 20, 32);
    ctx.strokeStyle = p.wood;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx + 55 + i * 30, by + 40, 20, 32);
  }

  // Sloped Terracotta Roof Eaves
  ctx.fillStyle = p.trim;
  ctx.beginPath();
  ctx.moveTo(bx - 10, by);
  ctx.lineTo(bx + bw + 10, by);
  ctx.lineTo(bx + bw / 2, by - 26);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#4A2612";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Grand Studded Arched Teakwood Deodhi Gateway
  const gx = bx + bw / 2;
  ctx.fillStyle = "#3B1E0C";
  ctx.beginPath();
  ctx.arc(gx, by + bh - 60, 26, Math.PI, 0, false);
  ctx.lineTo(gx + 26, by + bh);
  ctx.lineTo(gx - 26, by + bh);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#C29B38"; // Brass studs
  ctx.lineWidth = 2;
  ctx.stroke();

  return canvas;
}

// 6. MAKKA MASJID NORTH GATEWAY (Granite Ashlar Portal)
export function renderMeccaGateCanvas() {
  const w = 260;
  const h = 240;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  // Shadow
  ctx.fillStyle = "rgba(43, 33, 25, 0.28)";
  ctx.beginPath();
  ctx.ellipse(w / 2, h - 20, 95, 26, 0, 0, Math.PI * 2);
  ctx.fill();

  const bx = 30;
  const by = 40;
  const bw = 200;
  const bh = 160;

  // Dark Deccan Ashlar Granite
  ctx.fillStyle = "#6E6359";
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = "#383129";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);

  // Stone Battlements / Crenellations
  ctx.fillStyle = "#544B43";
  for (let x = bx; x < bx + bw; x += 22) {
    ctx.fillRect(x, by - 14, 14, 14);
  }

  // Monumental Islamic Arched Portal
  const cx = bx + bw / 2;
  ctx.fillStyle = "#1E1A16";
  ctx.beginPath();
  ctx.arc(cx, by + bh - 70, 36, Math.PI, 0, false);
  ctx.lineTo(cx + 36, by + bh);
  ctx.lineTo(cx - 36, by + bh);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#8A7D71";
  ctx.lineWidth = 3;
  ctx.stroke();

  return canvas;
}

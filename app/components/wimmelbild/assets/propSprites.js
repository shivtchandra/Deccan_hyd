// Authored Vector-Illustrated Props & Street Life Assets
// Designed for PixiJS 8 texture caching

function createOffscreen(width, height) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  return c;
}

// 1. AUTO RICKSHAW (Yellow & Black Hyderabad Icon)
export function renderAutoCanvas(direction = 1) {
  const w = 70;
  const h = 60;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  ctx.save();
  if (direction === -1) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }

  // Shadow
  ctx.fillStyle = "rgba(43, 33, 25, 0.28)";
  ctx.beginPath();
  ctx.ellipse(35, 52, 26, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wheels
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.arc(18, 48, 8, 0, Math.PI * 2);
  ctx.arc(52, 48, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#94A3B8";
  ctx.beginPath();
  ctx.arc(18, 48, 3, 0, Math.PI * 2);
  ctx.arc(52, 48, 3, 0, Math.PI * 2);
  ctx.fill();

  // Yellow Body
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.moveTo(10, 44);
  ctx.lineTo(60, 44);
  ctx.lineTo(62, 30);
  ctx.lineTo(48, 24);
  ctx.lineTo(14, 24);
  ctx.lineTo(10, 36);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#8A4C24";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Black Canvas Canopy
  ctx.fillStyle = "#1E2229";
  ctx.beginPath();
  ctx.moveTo(12, 24);
  ctx.lineTo(50, 24);
  ctx.lineTo(46, 12);
  ctx.lineTo(16, 12);
  ctx.closePath();
  ctx.fill();

  // Windshield & Open Passenger Window
  ctx.fillStyle = "#BAE6FD";
  ctx.fillRect(45, 25, 12, 12);
  ctx.fillStyle = "#1E1A16"; // Passenger cabin shadow
  ctx.fillRect(18, 25, 24, 12);

  // Headlight
  ctx.fillStyle = "#FEF08A";
  ctx.beginPath();
  ctx.arc(61, 35, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  return canvas;
}

// 2. BAJAJ CHETAK SCOOTER
export function renderScooterCanvas(color = "#2563EB") {
  const w = 50;
  const h = 45;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  // Shadow
  ctx.fillStyle = "rgba(43, 33, 25, 0.25)";
  ctx.beginPath();
  ctx.ellipse(25, 39, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wheels
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.arc(12, 36, 6, 0, Math.PI * 2);
  ctx.arc(38, 36, 6, 0, Math.PI * 2);
  ctx.fill();

  // Body Chassis
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(10, 34);
  ctx.lineTo(40, 34);
  ctx.lineTo(38, 22);
  ctx.lineTo(24, 26);
  ctx.lineTo(16, 18);
  ctx.lineTo(12, 26);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#1E293B";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Black Leather Seat & Spare Tyre
  ctx.fillStyle = "#1E1A16";
  ctx.fillRect(18, 22, 14, 4);
  ctx.beginPath();
  ctx.arc(8, 28, 4, 0, Math.PI * 2);
  ctx.fill();

  // Handlebar & Round Headlight
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(16, 18);
  ctx.lineTo(14, 12);
  ctx.stroke();

  ctx.fillStyle = "#FEF08A";
  ctx.beginPath();
  ctx.arc(14, 12, 3, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

// 3. STREET PUSHCARTS (Fruit & Marigold Flowers)
export function renderPushcartCanvas(type = "mango") {
  const w = 60;
  const h = 50;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  // Shadow
  ctx.fillStyle = "rgba(43, 33, 25, 0.25)";
  ctx.beginPath();
  ctx.ellipse(30, 44, 22, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wooden Cart Wheels
  ctx.strokeStyle = "#451A03";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(18, 38, 8, 0, Math.PI * 2);
  ctx.arc(42, 38, 8, 0, Math.PI * 2);
  ctx.stroke();

  // Wooden Handcart Bed
  ctx.fillStyle = "#78350F";
  ctx.fillRect(6, 26, 48, 8);
  ctx.strokeStyle = "#451A03";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(6, 26, 48, 8);

  // Cart Cargo
  if (type === "mango") {
    ctx.fillStyle = "#F59E0B";
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(14 + i * 6, 23, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === "banana") {
    ctx.fillStyle = "#84CC16";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.ellipse(15 + i * 7, 22, 3, 6, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Bright Orange & Yellow Marigold Garlands
    ctx.fillStyle = "#EA580C";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(14 + i * 9, 21, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#FACC15";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(18 + i * 9, 18, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return canvas;
}

// 4. TREES (Peepal / Neem & Royal Date Palm)
export function renderTreeCanvas(type = "neem") {
  const w = 110;
  const h = 130;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  const cx = w / 2;
  const baseY = h - 15;

  // Shadow
  ctx.fillStyle = "rgba(43, 33, 25, 0.24)";
  ctx.beginPath();
  ctx.ellipse(cx, baseY, 36, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  if (type === "palm") {
    // Tall Slender Trunk
    ctx.strokeStyle = "#5C3E26";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(cx, baseY);
    ctx.quadraticCurveTo(cx - 6, baseY - 50, cx, baseY - 90);
    ctx.stroke();

    // Arching Fronds
    ctx.fillStyle = "#2D6A4F";
    [-45, -25, -5, 15, 35, 55].forEach((deg) => {
      ctx.save();
      ctx.translate(cx, baseY - 90);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(0, -22, 6, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  } else {
    // Sturdy Gnarled Trunk
    ctx.fillStyle = "#4A311D";
    ctx.beginPath();
    ctx.moveTo(cx - 8, baseY);
    ctx.lineTo(cx + 8, baseY);
    ctx.lineTo(cx + 4, baseY - 45);
    ctx.lineTo(cx - 4, baseY - 45);
    ctx.closePath();
    ctx.fill();

    // Layered Lush Green Canopy
    ctx.fillStyle = "#2D5A3C";
    ctx.beginPath();
    ctx.arc(cx - 18, baseY - 65, 24, 0, Math.PI * 2);
    ctx.arc(cx + 18, baseY - 65, 24, 0, Math.PI * 2);
    ctx.arc(cx, baseY - 85, 28, 0, Math.PI * 2);
    ctx.fill();

    // Sunlit Foliage Highlights
    ctx.fillStyle = "#407B53";
    ctx.beginPath();
    ctx.arc(cx - 12, baseY - 70, 18, 0, Math.PI * 2);
    ctx.arc(cx + 12, baseY - 70, 18, 0, Math.PI * 2);
    ctx.arc(cx, baseY - 88, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

// 5. VICTORIAN CAST-IRON STREET LAMP
export function renderStreetLampCanvas() {
  const w = 30;
  const h = 75;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  const cx = 15;
  const baseY = 70;

  // Shadow
  ctx.fillStyle = "rgba(43, 33, 25, 0.2)";
  ctx.beginPath();
  ctx.ellipse(cx, baseY, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Post
  ctx.strokeStyle = "#1E293B";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, baseY);
  ctx.lineTo(cx, baseY - 50);
  ctx.stroke();

  // Lantern Base & Glass Housing
  ctx.fillStyle = "#1E293B";
  ctx.fillRect(cx - 6, baseY - 54, 12, 3);
  ctx.fillStyle = "#FEF08A";
  ctx.fillRect(cx - 4, baseY - 64, 8, 10);
  ctx.strokeStyle = "#1E293B";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(cx - 4, baseY - 64, 8, 10);

  // Lantern Cap & Finial
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.moveTo(cx - 7, baseY - 64);
  ctx.lineTo(cx + 7, baseY - 64);
  ctx.lineTo(cx, baseY - 70);
  ctx.closePath();
  ctx.fill();

  return canvas;
}

// 6. ROOFTOP SINTEX WATER TANK
export function renderSintexTankCanvas() {
  const w = 40;
  const h = 40;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  // Black Cylindrical Tank
  ctx.fillStyle = "#1E293B";
  ctx.fillRect(8, 12, 24, 22);
  ctx.beginPath();
  ctx.ellipse(20, 12, 12, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(20, 34, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // White Brand Band
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(8, 20, 24, 3);

  return canvas;
}

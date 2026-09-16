// Lived-in Micro-Scenes & Storytelling Clusters for Old Hyderabad
// Each micro-scene combines multiple characters, props, furniture, and environmental details
// into cohesive narrative moments with soft ground shadows.

function createOffscreen(width, height) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  return c;
}

function drawSoftShadow(ctx, cx, cy, rx, ry, opacity = 0.25) {
  ctx.save();
  ctx.fillStyle = `rgba(40, 26, 16, ${opacity})`;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// --------------------------------------------------------------------------------------
// 1. CHAI KHANA PATRONS MICRO-SCENE (Marble Table, 2 Seated Patrons, Waiter, Chai Glasses)
// --------------------------------------------------------------------------------------
export function renderChaiTableMicroScene() {
  const w = 110;
  const h = 85;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const cy = h - 22;

  // Unified ground shadow
  drawSoftShadow(ctx, cx, cy + 4, 38, 14, 0.28);

  // Round marble table top on cast-iron pedestal
  ctx.fillStyle = "#1E293B";
  ctx.fillRect(cx - 2, cy - 14, 4, 14); // central leg
  ctx.fillStyle = "#E2E8F0"; // Marble top
  ctx.beginPath();
  ctx.ellipse(cx, cy - 14, 20, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 1;
  ctx.stroke();

  // 2 Small Chai Glasses & Biscuit on Table
  ctx.fillStyle = "#D97706";
  ctx.fillRect(cx - 8, cy - 20, 3, 5);
  ctx.fillRect(cx + 4, cy - 19, 3, 5);
  ctx.fillStyle = "#E59866"; // Osmania biscuit
  ctx.beginPath();
  ctx.ellipse(cx - 2, cy - 15, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Patron 1 (Left, seated on bentwood chair, dipping biscuit into chai)
  // Bentwood Chair Left
  ctx.strokeStyle = "#4A2810";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 28, cy - 2);
  ctx.lineTo(cx - 22, cy - 16);
  ctx.lineTo(cx - 15, cy - 16);
  ctx.stroke();

  // Figure Left (Elder in White Kurta & Jinnah cap)
  ctx.fillStyle = "#F8FAFC"; // White Kurta
  ctx.beginPath();
  ctx.ellipse(cx - 20, cy - 24, 7, 10, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Arm reaching to dip biscuit
  ctx.strokeStyle = "#F8FAFC";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 16, cy - 26);
  ctx.lineTo(cx - 7, cy - 18);
  ctx.stroke();
  // Head
  ctx.fillStyle = "#B45309";
  ctx.beginPath();
  ctx.arc(cx - 22, cy - 36, 4.5, 0, Math.PI * 2);
  ctx.fill();
  // Black velvet Jinnah cap
  ctx.fillStyle = "#0F172A";
  ctx.fillRect(cx - 25, cy - 41, 7, 3);

  // Patron 2 (Right, seated, reading Urdu newspaper)
  // Chair Right
  ctx.strokeStyle = "#4A2810";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx + 28, cy - 2);
  ctx.lineTo(cx + 22, cy - 16);
  ctx.lineTo(cx + 15, cy - 16);
  ctx.stroke();

  // Figure Right (Brown Nehru jacket over cream kurta)
  ctx.fillStyle = "#78350F";
  ctx.beginPath();
  ctx.ellipse(cx + 20, cy - 24, 7, 10, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.fillStyle = "#B45309";
  ctx.beginPath();
  ctx.arc(cx + 22, cy - 36, 4.5, 0, Math.PI * 2);
  ctx.fill();
  // Newspaper held in hands
  ctx.fillStyle = "#F1F5F9";
  ctx.beginPath();
  ctx.moveTo(cx + 12, cy - 22);
  ctx.lineTo(cx + 22, cy - 22);
  ctx.lineTo(cx + 20, cy - 12);
  ctx.lineTo(cx + 10, cy - 12);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Chai Server (Standing behind table with brass kettle)
  ctx.fillStyle = "#0284C7"; // Blue shirt
  ctx.fillRect(cx - 4, cy - 42, 8, 14);
  ctx.fillStyle = "#F8FAFC"; // White apron
  ctx.fillRect(cx - 3, cy - 34, 6, 12);
  // Head
  ctx.fillStyle = "#B45309";
  ctx.beginPath();
  ctx.arc(cx, cy - 46, 4, 0, Math.PI * 2);
  ctx.fill();
  // Brass Kettle in hand
  ctx.fillStyle = "#D97706";
  ctx.beginPath();
  ctx.arc(cx + 7, cy - 32, 3.5, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

// --------------------------------------------------------------------------------------
// 2. LAAD BAZAAR BANGLE BARGAINING MICRO-SCENE (Artisan, Mother & Daughter, Velvet Trays)
// --------------------------------------------------------------------------------------
export function renderBangleBargainingMicroScene() {
  const w = 95;
  const h = 75;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const cy = h - 18;

  drawSoftShadow(ctx, cx, cy + 3, 34, 12, 0.28);

  // Low Wooden Takht / Workshop Counter
  ctx.fillStyle = "#5C381E";
  ctx.fillRect(cx - 16, cy - 12, 32, 10);
  ctx.strokeStyle = "#381E0C";
  ctx.lineWidth = 1;
  ctx.strokeRect(cx - 16, cy - 12, 32, 10);

  // Crimson Velvet Bangle Cushion on counter with colorful glass rings
  ctx.fillStyle = "#9F1239";
  ctx.beginPath();
  ctx.ellipse(cx, cy - 13, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(cx - 8, cy - 15, 16, 2);

  // Artisan (Seated behind counter with cotton skullcap)
  ctx.fillStyle = "#065F46"; // Green kurta
  ctx.beginPath();
  ctx.ellipse(cx, cy - 24, 7, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#B45309"; // Head
  ctx.beginPath();
  ctx.arc(cx, cy - 35, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF"; // Skullcap
  ctx.fillRect(cx - 3, cy - 39, 6, 2.5);

  // Mother (Standing in front of counter in vermilion red saree, holding wrist out)
  ctx.fillStyle = "#DC2626"; // Red saree
  ctx.beginPath();
  ctx.ellipse(cx - 18, cy - 20, 6, 12, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Saree Pallu over shoulder
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 28);
  ctx.lineTo(cx - 14, cy - 20);
  ctx.lineTo(cx - 18, cy - 12);
  ctx.stroke();
  // Head
  ctx.fillStyle = "#B45309";
  ctx.beginPath();
  ctx.arc(cx - 18, cy - 33, 4, 0, Math.PI * 2);
  ctx.fill();

  // Young Daughter (Standing next to mother in sunflower yellow salwar)
  ctx.fillStyle = "#EAB308";
  ctx.beginPath();
  ctx.ellipse(cx - 28, cy - 14, 4.5, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#B45309";
  ctx.beginPath();
  ctx.arc(cx - 28, cy - 23, 3, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

// --------------------------------------------------------------------------------------
// 3. ATTAR PERFUMERY SAMPLING MICRO-SCENE (Attarwala with glass applicator, Customer)
// --------------------------------------------------------------------------------------
export function renderAttarSamplingMicroScene() {
  const w = 90;
  const h = 75;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const cy = h - 18;

  drawSoftShadow(ctx, cx, cy + 3, 30, 11, 0.28);

  // Polished Wooden Perfume Counter
  ctx.fillStyle = "#451A03";
  ctx.fillRect(cx - 14, cy - 12, 28, 10);
  // Cut glass decanters on counter
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.arc(cx - 6, cy - 14, 2.5, 0, Math.PI * 2);
  ctx.arc(cx + 2, cy - 14, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Perfumer in Traditional Velvet Topi & Embroidered Sherwani
  ctx.fillStyle = "#312E81"; // Deep Indigo Sherwani
  ctx.fillRect(cx - 6, cy - 30, 10, 15);
  ctx.fillStyle = "#B45309"; // Head
  ctx.beginPath();
  ctx.arc(cx - 1, cy - 34, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#7C2D12"; // Velvet Rumi Topi
  ctx.fillRect(cx - 4, cy - 39, 6, 3);

  // Customer in Crisp Cream Kurta, inhaling scent from back of wrist
  ctx.fillStyle = "#FEF3C7"; // Cream Kurta
  ctx.fillRect(cx + 12, cy - 28, 8, 16);
  ctx.fillStyle = "#B45309"; // Head
  ctx.beginPath();
  ctx.arc(cx + 16, cy - 32, 4, 0, Math.PI * 2);
  ctx.fill();
  // Hand raised to nose
  ctx.strokeStyle = "#B45309";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx + 14, cy - 24);
  ctx.lineTo(cx + 16, cy - 30);
  ctx.stroke();

  return canvas;
}

// --------------------------------------------------------------------------------------
// 4. FRUIT THELA (PUSHCART) MICRO-SCENE (4-Wheeled Cart, Hanging Scale, Bananas, Mangoes)
// --------------------------------------------------------------------------------------
export function renderFruitThelaMicroScene() {
  const w = 110;
  const h = 80;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const cy = h - 22;

  drawSoftShadow(ctx, cx, cy + 4, 42, 14, 0.3);

  // Cart Wooden Bed
  ctx.fillStyle = "#78350F";
  ctx.fillRect(cx - 24, cy - 16, 48, 10);
  ctx.strokeStyle = "#451A03";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(cx - 24, cy - 16, 48, 10);

  // Spoke Wooden Cart Wheels
  const drawCartWheel = (wx, wy) => {
    ctx.strokeStyle = "#271202";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(wx, wy, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#542507";
    ctx.beginPath();
    ctx.arc(wx, wy, 3, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCartWheel(cx - 16, cy - 2);
  drawCartWheel(cx + 16, cy - 2);

  // Heaped Fresh Fruits
  // Golden Mangoes & Papayas
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.ellipse(cx - 10, cy - 19, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Yellow Bananas bunch
  ctx.fillStyle = "#EAB308";
  ctx.beginPath();
  ctx.ellipse(cx + 8, cy - 19, 12, 5, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Green Sweet Limes
  ctx.fillStyle = "#10B981";
  ctx.beginPath();
  ctx.arc(cx - 2, cy - 21, 4, 0, Math.PI * 2);
  ctx.arc(cx + 3, cy - 21, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Brass Hanging Balance Scale
  ctx.strokeStyle = "#78350F";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cx + 18, cy - 16);
  ctx.lineTo(cx + 18, cy - 34);
  ctx.lineTo(cx + 12, cy - 34);
  ctx.stroke();
  ctx.fillStyle = "#F59E0B"; // Brass scale pans
  ctx.beginPath();
  ctx.arc(cx + 12, cy - 28, 3, 0, Math.PI * 2);
  ctx.fill();

  // Vendor (Standing beside cart in check lungi & banyan)
  ctx.fillStyle = "#F8FAFC"; // White banyan
  ctx.fillRect(cx - 36, cy - 26, 7, 12);
  ctx.fillStyle = "#1E3A8A"; // Blue check lungi
  ctx.fillRect(cx - 36, cy - 14, 7, 14);
  ctx.fillStyle = "#B45309"; // Head
  ctx.beginPath();
  ctx.arc(cx - 33, cy - 30, 4, 0, Math.PI * 2);
  ctx.fill();

  // Customer (Holding cloth tote bag)
  ctx.fillStyle = "#4B5563"; // Shirt
  ctx.fillRect(cx + 30, cy - 26, 7, 12);
  ctx.fillStyle = "#1F2937"; // Trousers
  ctx.fillRect(cx + 30, cy - 14, 7, 14);
  ctx.fillStyle = "#B45309"; // Head
  ctx.beginPath();
  ctx.arc(cx + 33, cy - 30, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#D97706"; // Cloth bag
  ctx.fillRect(cx + 37, cy - 18, 4, 6);

  return canvas;
}

// --------------------------------------------------------------------------------------
// 5. MARIGOLD FLOWER GARLAND VENDOR MICRO-SCENE (Weaving garlands, jasmine baskets)
// --------------------------------------------------------------------------------------
export function renderFlowerVendorMicroScene() {
  const w = 90;
  const h = 70;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const cy = h - 18;

  drawSoftShadow(ctx, cx, cy + 3, 32, 12, 0.28);

  // Woven Cane Baskets
  ctx.fillStyle = "#A16207";
  ctx.beginPath();
  ctx.ellipse(cx - 10, cy - 8, 12, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 12, cy - 8, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Baskets overflowing with bright Orange Marigolds (Genda Phool)
  ctx.fillStyle = "#EA580C";
  ctx.beginPath();
  ctx.arc(cx - 10, cy - 12, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.arc(cx - 8, cy - 14, 6, 0, Math.PI * 2);
  ctx.fill();

  // White Fragrant Jasmine Garlands (Mogra)
  ctx.fillStyle = "#F8FAFC";
  ctx.beginPath();
  ctx.arc(cx + 12, cy - 11, 7, 0, Math.PI * 2);
  ctx.fill();

  // Florist (Seated cross-legged weaving flowers with thread)
  ctx.fillStyle = "#047857"; // Green kurta
  ctx.beginPath();
  ctx.ellipse(cx - 2, cy - 20, 6, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#B45309"; // Head
  ctx.beginPath();
  ctx.arc(cx - 2, cy - 29, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Long garland hanging down
  ctx.strokeStyle = "#EA580C";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 2, cy - 18);
  ctx.bezierCurveTo(cx + 6, cy - 12, cx + 4, cy - 6, cx - 2, cy - 4);
  ctx.stroke();

  return canvas;
}

// --------------------------------------------------------------------------------------
// 6. STREET VEHICLE: Classic Bajaj Chetak Scooter with Shadow & Rider
// --------------------------------------------------------------------------------------
export function renderDetailedScooterCanvas(color = "#2563EB", hasRider = false) {
  const w = 65;
  const h = 55;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const cy = h - 14;

  // Ground Contact Shadow
  drawSoftShadow(ctx, cx, cy + 2, 22, 7, 0.32);

  // Rubber Wheels with Steel Rims
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.ellipse(cx - 14, cy - 2, 4.5, 7, -0.4, 0, Math.PI * 2);
  ctx.ellipse(cx + 12, cy - 2, 4.5, 7, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#CBD5E1";
  ctx.beginPath();
  ctx.ellipse(cx - 14, cy - 2, 2, 4, -0.4, 0, Math.PI * 2);
  ctx.ellipse(cx + 12, cy - 2, 2, 4, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // Bulbous Rear Engine Cowl & Chassis
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx - 8, cy - 9, 12, 7, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Front Mudguard & Legshield
  ctx.beginPath();
  ctx.moveTo(cx + 4, cy - 7);
  ctx.lineTo(cx + 16, cy - 14);
  ctx.lineTo(cx + 11, cy - 23);
  ctx.lineTo(cx + 2, cy - 16);
  ctx.closePath();
  ctx.fill();

  // Chrome Handlebars & Round Headlight
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx + 9, cy - 22);
  ctx.lineTo(cx + 7, cy - 28);
  ctx.lineTo(cx + 3, cy - 29);
  ctx.stroke();

  // Headlight with yellow tint
  ctx.fillStyle = "#FEF08A";
  ctx.beginPath();
  ctx.arc(cx + 8, cy - 28, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Black Leather Dual-Seat
  ctx.fillStyle = "#0F172A";
  ctx.beginPath();
  ctx.ellipse(cx - 3, cy - 15, 10, 3.5, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Spare Tire mounted on rear
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.ellipse(cx - 16, cy - 14, 2.5, 5, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Optional Rider in casual clothes & sunglasses
  if (hasRider) {
    ctx.fillStyle = "#0369A1"; // Blue shirt
    ctx.fillRect(cx - 6, cy - 30, 8, 14);
    ctx.fillStyle = "#334155"; // Trousers
    ctx.fillRect(cx - 6, cy - 18, 8, 10);
    ctx.fillStyle = "#B45309"; // Head
    ctx.beginPath();
    ctx.arc(cx - 2, cy - 34, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0F172A"; // Sunglasses
    ctx.fillRect(cx, cy - 35, 3, 1.5);
  }

  return canvas;
}

// --------------------------------------------------------------------------------------
// 7. STREET VEHICLE: Yellow & Black Auto Rickshaw with Realistic Canvas Top & Shadows
// --------------------------------------------------------------------------------------
export function renderDetailedAutoCanvas(direction = 1) {
  const w = 85;
  const h = 75;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const cy = h - 16;

  // Ground Contact Shadow
  drawSoftShadow(ctx, cx, cy + 3, 30, 11, 0.35);

  ctx.save();
  if (direction < 0) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }

  // 3 Black Rubber Wheels
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.ellipse(cx - 18, cy - 3, 5, 8, -0.4, 0, Math.PI * 2);
  ctx.ellipse(cx + 16, cy - 3, 5, 8, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // Lower Metallic Body (Classic Deccan Old City Auto: Dark Olive Green or Black)
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy - 7);
  ctx.lineTo(cx + 20, cy - 7);
  ctx.lineTo(cx + 22, cy - 20);
  ctx.lineTo(cx - 18, cy - 20);
  ctx.closePath();
  ctx.fill();

  // Open Cabin Interior & Rexine Passenger Bench
  ctx.fillStyle = "#0F172A";
  ctx.fillRect(cx - 14, cy - 28, 22, 14);
  ctx.fillStyle = "#7C2D12"; // Brown passenger seat
  ctx.fillRect(cx - 12, cy - 22, 12, 6);

  // Upper Canvas Hood (Vibrant Canary Yellow)
  ctx.fillStyle = "#EAB308";
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 26);
  ctx.lineTo(cx + 18, cy - 26);
  ctx.lineTo(cx + 14, cy - 44);
  ctx.lineTo(cx - 16, cy - 44);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#CA8A04";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Slanted Front Windshield
  ctx.fillStyle = "rgba(186, 230, 253, 0.75)";
  ctx.beginPath();
  ctx.moveTo(cx + 18, cy - 26);
  ctx.lineTo(cx + 14, cy - 44);
  ctx.lineTo(cx + 19, cy - 42);
  ctx.lineTo(cx + 22, cy - 26);
  ctx.closePath();
  ctx.fill();

  // Front Single Round Headlight
  ctx.fillStyle = "#FEF08A";
  ctx.beginPath();
  ctx.arc(cx + 22, cy - 14, 3, 0, Math.PI * 2);
  ctx.fill();

  // Auto Driver in Khaki Uniform in front seat
  ctx.fillStyle = "#92400E"; // Khaki shirt
  ctx.fillRect(cx + 4, cy - 28, 7, 10);
  ctx.fillStyle = "#B45309"; // Head
  ctx.beginPath();
  ctx.arc(cx + 7, cy - 32, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  return canvas;
}

// --------------------------------------------------------------------------------------
// 8. OLD CITY CITIZENS: Diverse Walking Figures (Kurta, Saree, Burqa, Youth)
// --------------------------------------------------------------------------------------
export function renderPedestrianSilhouetteCanvas(type = "kurta", direction = 1) {
  const w = 40;
  const h = 55;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const cy = h - 8;

  drawSoftShadow(ctx, cx, cy + 2, 10, 4, 0.28);

  ctx.save();
  if (direction < 0) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }

  const skinTone = "#B45309";

  if (type === "kurta") {
    // Man in White Lucknowi Kurta & Pajama
    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(cx - 3.5, cy - 30, 7, 18);
    ctx.fillRect(cx - 3, cy - 14, 3, 12);
    ctx.fillRect(cx + 1, cy - 14, 3, 12);
    // Head
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.arc(cx, cy - 34, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // Skullcap
    ctx.fillStyle = "#E2E8F0";
    ctx.fillRect(cx - 2.5, cy - 38, 5, 2);
  } else if (type === "saree_saffron") {
    // Woman in Saffron/Gold Silk Saree
    ctx.fillStyle = "#EA580C";
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy - 28);
    ctx.lineTo(cx + 4, cy - 28);
    ctx.lineTo(cx + 6, cy - 4);
    ctx.lineTo(cx - 6, cy - 4);
    ctx.closePath();
    ctx.fill();
    // Pallu drape
    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy - 28);
    ctx.lineTo(cx + 2, cy - 18);
    ctx.lineTo(cx - 2, cy - 10);
    ctx.stroke();
    // Head with hair bun
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.arc(cx, cy - 33, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1E293B"; // Black hair
    ctx.beginPath();
    ctx.arc(cx - 2, cy - 34, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "burqa") {
    // Woman in Flowing Black Burqa with subtle gold hem
    ctx.fillStyle = "#0F172A";
    ctx.beginPath();
    ctx.moveTo(cx - 2, cy - 35);
    ctx.lineTo(cx + 2, cy - 35);
    ctx.lineTo(cx + 7, cy - 4);
    ctx.lineTo(cx - 7, cy - 4);
    ctx.closePath();
    ctx.fill();
    // Delicate gold border hem
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy - 4);
    ctx.lineTo(cx + 7, cy - 4);
    ctx.stroke();
  } else if (type === "saree_teal") {
    // Woman in Peacock Teal Saree
    ctx.fillStyle = "#0F766E";
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy - 28);
    ctx.lineTo(cx + 4, cy - 28);
    ctx.lineTo(cx + 6, cy - 4);
    ctx.lineTo(cx - 6, cy - 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.arc(cx, cy - 33, 3.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "youth_camera") {
    // Student / Tourist taking photo
    ctx.fillStyle = "#BE185D"; // Maroon t-shirt
    ctx.fillRect(cx - 3.5, cy - 28, 7, 14);
    ctx.fillStyle = "#1E293B"; // Jeans
    ctx.fillRect(cx - 3, cy - 14, 3, 12);
    ctx.fillRect(cx + 1, cy - 14, 3, 12);
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.arc(cx, cy - 32, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // Smartphone in raised hand
    ctx.fillStyle = "#64748B";
    ctx.fillRect(cx + 3, cy - 33, 3, 4);
  }

  ctx.restore();
  return canvas;
}

// --------------------------------------------------------------------------------------
// 9. FOREGROUND TREE: Large Overhanging Gulmohar / Neem Canopy
// --------------------------------------------------------------------------------------
export function renderForegroundTreeCanvas() {
  const w = 220;
  const h = 200;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  // Trunk entering from lower corner
  ctx.fillStyle = "#382013";
  ctx.beginPath();
  ctx.moveTo(0, 180);
  ctx.bezierCurveTo(40, 160, 50, 110, 80, 80);
  ctx.lineTo(95, 85);
  ctx.bezierCurveTo(60, 120, 50, 170, 15, 200);
  ctx.closePath();
  ctx.fill();

  // Dense, layered lush green canopy overlapping top/side
  const leafClusters = [
    { x: 90, y: 70, r: 35, c: "#2D5A27" },
    { x: 130, y: 55, r: 45, c: "#1F431A" },
    { x: 170, y: 65, r: 40, c: "#2D5A27" },
    { x: 110, y: 35, r: 38, c: "#3E7B35" },
    { x: 150, y: 30, r: 42, c: "#4A8F40" },
    { x: 75, y: 45, r: 30, c: "#2D5A27" },
  ];

  leafClusters.forEach((lc) => {
    ctx.fillStyle = lc.c;
    ctx.beginPath();
    ctx.arc(lc.x, lc.y, lc.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Fiery Orange/Red Gulmohar Blossom Flecks
  ctx.fillStyle = "#E63946";
  const blossoms = [
    [105, 45], [125, 30], [145, 60], [165, 40], [85, 60], [135, 75], [115, 65]
  ];
  blossoms.forEach(([bx, by]) => {
    ctx.beginPath();
    ctx.arc(bx, by, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  return canvas;
}

// --------------------------------------------------------------------------------------
// 10. FOREGROUND CORNER RAILING & CAST-IRON LAMP POST
// --------------------------------------------------------------------------------------
export function renderForegroundRailingAndLampCanvas() {
  const w = 140;
  const h = 180;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = 35;
  const cy = h - 20;

  drawSoftShadow(ctx, cx, cy + 2, 20, 6, 0.35);

  // Cast Iron Lamp Post Column
  ctx.fillStyle = "#1E293B";
  ctx.fillRect(cx - 3, cy - 120, 6, 120);

  // Decorative Victorian Base Fluting
  ctx.fillRect(cx - 7, cy - 16, 14, 16);

  // Curved Lantern Bracket & Hexagonal Glass Lantern
  ctx.strokeStyle = "#1E293B";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 120);
  ctx.bezierCurveTo(cx + 15, cy - 135, cx + 25, cy - 125, cx + 25, cy - 110);
  ctx.stroke();

  // Glass Lantern with Warm Flame Glow
  ctx.fillStyle = "rgba(254, 240, 138, 0.9)";
  ctx.beginPath();
  ctx.moveTo(cx + 20, cy - 110);
  ctx.lineTo(cx + 30, cy - 110);
  ctx.lineTo(cx + 28, cy - 94);
  ctx.lineTo(cx + 22, cy - 94);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#0F172A";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Low Dressed Sandstone Balustrade / Railing
  ctx.fillStyle = "#D4C4B2";
  ctx.fillRect(cx + 15, cy - 28, 85, 26);
  ctx.strokeStyle = "#A89682";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(cx + 15, cy - 28, 85, 26);

  // Balustrade Pier Cap
  ctx.fillStyle = "#E8DC CE";
  ctx.fillRect(cx + 12, cy - 32, 90, 5);

  return canvas;
}

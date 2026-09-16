// Hand-Crafted Hyderabad Building Family System
// Authentic Old City architecture with realistic isometric 2:1 depth, directional wall shading,
// roof thickness, recessed windows, jharokha balconies, awnings, and soft ground contact shadows.

function createOffscreen(width, height) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  return c;
}

// Helper for soft ground contact shadow
function drawContactShadow(ctx, cx, cy, rx, ry, opacity = 0.26) {
  ctx.save();
  ctx.fillStyle = `rgba(42, 28, 18, ${opacity})`;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// --------------------------------------------------------------------------------------
// 1. OLD SHOP A: Zari & Textile Emporium (Wide 2-Story, Crimson/Gold Striped Awning)
// --------------------------------------------------------------------------------------
export function renderTextileShopCanvas() {
  const w = 240;
  const h = 220;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const baseY = h - 28;

  // Ground Contact Shadow
  drawContactShadow(ctx, cx - 10, baseY + 6, 95, 32, 0.28);

  // Isometric dimensions (2:1 ratio)
  // Left face (shaded), Right face (sunlit)
  const lengthL = 72; // Left face length
  const lengthR = 86; // Right face length
  const wallH = 125;  // Height of 2-story building

  // Base coordinates
  const pBase = { x: cx, y: baseY };
  const pLeft = { x: cx - lengthL, y: baseY - lengthL * 0.5 };
  const pRight = { x: cx + lengthR, y: baseY - lengthR * 0.5 };
  const pTop = { x: cx - lengthL + lengthR, y: baseY - (lengthL + lengthR) * 0.5 };

  // --- Left Wall (In Shadow: Warm Burnt Ochre) ---
  ctx.fillStyle = "#A85D38";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y);
  ctx.lineTo(pLeft.x, pLeft.y);
  ctx.lineTo(pLeft.x, pLeft.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#7D3D20";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Left wall brick/coursing lines
  ctx.strokeStyle = "rgba(70, 30, 15, 0.18)";
  ctx.lineWidth = 1;
  for (let dy = 20; dy < wallH; dy += 16) {
    ctx.beginPath();
    ctx.moveTo(pBase.x, pBase.y - dy);
    ctx.lineTo(pLeft.x, pLeft.y - dy);
    ctx.stroke();
  }

  // --- Right Wall (Sunlit: Warm Sandstone Terracotta) ---
  ctx.fillStyle = "#D47E53";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y);
  ctx.lineTo(pRight.x, pRight.y);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#9E502C";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // --- Roof Surface (Dusty Terracotta Flat Roof with Thickness) ---
  ctx.fillStyle = "#B36340";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y - wallH);
  ctx.lineTo(pLeft.x, pLeft.y - wallH);
  ctx.lineTo(pTop.x, pTop.y - wallH);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.closePath();
  ctx.fill();

  // Parapet Wall Lip
  ctx.fillStyle = "#E4966E";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y - wallH - 10);
  ctx.lineTo(pRight.x, pRight.y - wallH - 10);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#8A4020";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Left parapet
  ctx.fillStyle = "#8F4522";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y - wallH - 10);
  ctx.lineTo(pLeft.x, pLeft.y - wallH - 10);
  ctx.lineTo(pLeft.x, pLeft.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // --- Upper Floor Windows (Teak Wood Shutters & Recessed Lintel) ---
  // Window on right face
  const wRx = cx + 36;
  const wRy = baseY - 88;
  // Recessed dark interior
  ctx.fillStyle = "#2D180F";
  ctx.beginPath();
  ctx.moveTo(wRx - 16, wRy + 8);
  ctx.lineTo(wRx + 16, wRy - 8);
  ctx.lineTo(wRx + 16, wRy - 32);
  ctx.lineTo(wRx - 16, wRy - 16);
  ctx.closePath();
  ctx.fill();
  // Open Teak Shutter
  ctx.fillStyle = "#5C3317";
  ctx.beginPath();
  ctx.moveTo(wRx - 24, wRy + 12);
  ctx.lineTo(wRx - 16, wRy + 8);
  ctx.lineTo(wRx - 16, wRy - 16);
  ctx.lineTo(wRx - 24, wRy - 12);
  ctx.closePath();
  ctx.fill();
  // Jali arched top trim
  ctx.strokeStyle = "#F2CCA8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(wRx - 16, wRy - 16);
  ctx.lineTo(wRx + 16, wRy - 32);
  ctx.stroke();

  // --- Ground Floor Open Shop Front (Takht with Silk Rolls) ---
  // Large arched shop portal on right face
  ctx.fillStyle = "#1E1109";
  ctx.beginPath();
  ctx.moveTo(cx + 12, baseY - 6);
  ctx.lineTo(cx + 74, baseY - 37);
  ctx.lineTo(cx + 74, baseY - 75);
  ctx.lineTo(cx + 12, baseY - 44);
  ctx.closePath();
  ctx.fill();

  // Shelves with stacked colorful silk fabric bolts (Crimson, Royal Blue, Saffron, Emerald)
  const fabricColors = ["#E63946", "#F4A261", "#2A9D8F", "#E76F51", "#8338EC", "#FFB703"];
  for (let i = 0; i < 4; i++) {
    const fy = baseY - 48 + i * 8;
    ctx.fillStyle = fabricColors[i % fabricColors.length];
    ctx.fillRect(cx + 26 + i * 2, fy - 6, 26, 6);
  }

  // --- Bold Crimson & Gold Striped Awning (Projects with 3D Depth) ---
  // Awning shadow onto shop front
  ctx.fillStyle = "rgba(20, 10, 5, 0.4)";
  ctx.beginPath();
  ctx.moveTo(cx + 6, baseY - 42);
  ctx.lineTo(cx + 80, baseY - 79);
  ctx.lineTo(cx + 80, baseY - 69);
  ctx.lineTo(cx + 6, baseY - 32);
  ctx.closePath();
  ctx.fill();

  // Awning Canvas Roof
  const awW = 76;
  const awDrop = 14;
  const awProj = 18;
  ctx.fillStyle = "#A31621"; // Rich Crimson
  ctx.beginPath();
  ctx.moveTo(cx + 8, baseY - 45);
  ctx.lineTo(cx + 8 + awW, baseY - 45 - awW * 0.5);
  ctx.lineTo(cx + 8 + awW + awProj, baseY - 45 - awW * 0.5 + awDrop + awProj * 0.5);
  ctx.lineTo(cx + 8 + awProj, baseY - 45 + awDrop + awProj * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#5C0C13";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Gold stripes on awning
  ctx.fillStyle = "#FFD166";
  for (let s = 1; s < 5; s++) {
    const sx = cx + 8 + s * 14;
    const sy = baseY - 45 - s * 7;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 7, sy - 3.5);
    ctx.lineTo(sx + 7 + awProj, sy - 3.5 + awDrop + awProj * 0.5);
    ctx.lineTo(sx + awProj, sy + awDrop + awProj * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  // Awning Scalloped Edge Trim
  ctx.fillStyle = "#FFD166";
  ctx.beginPath();
  ctx.moveTo(cx + 8 + awProj, baseY - 45 + awDrop + awProj * 0.5);
  ctx.lineTo(cx + 8 + awW + awProj, baseY - 45 - awW * 0.5 + awDrop + awProj * 0.5);
  ctx.lineTo(cx + 8 + awW + awProj, baseY - 45 - awW * 0.5 + awDrop + awProj * 0.5 + 4);
  ctx.lineTo(cx + 8 + awProj, baseY - 45 + awDrop + awProj * 0.5 + 4);
  ctx.closePath();
  ctx.fill();

  // --- Hand-Painted Urdu/English Signboard ---
  ctx.fillStyle = "#2B1E13";
  ctx.beginPath();
  ctx.moveTo(cx + 14, baseY - 82);
  ctx.lineTo(cx + 66, baseY - 108);
  ctx.lineTo(cx + 66, baseY - 96);
  ctx.lineTo(cx + 14, baseY - 70);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 7px sans-serif";
  ctx.save();
  ctx.translate(cx + 18, baseY - 74);
  ctx.rotate(-0.46);
  ctx.fillText("MADINA ZARI", 0, 0);
  ctx.restore();

  return canvas;
}

// --------------------------------------------------------------------------------------
// 2. OLD SHOP B: Laad Bazaar Lac Bangle Guild (Narrow 3-Story, Jharokha Balcony, Lantern)
// --------------------------------------------------------------------------------------
export function renderBangleShopCanvas() {
  const w = 210;
  const h = 260;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const baseY = h - 26;

  // Ground Contact Shadow
  drawContactShadow(ctx, cx - 12, baseY + 6, 80, 28, 0.28);

  const lengthL = 58;
  const lengthR = 64;
  const wallH = 180; // Tall narrow 3-story shophouse

  const pBase = { x: cx, y: baseY };
  const pLeft = { x: cx - lengthL, y: baseY - lengthL * 0.5 };
  const pRight = { x: cx + lengthR, y: baseY - lengthR * 0.5 };
  const pTop = { x: cx - lengthL + lengthR, y: baseY - (lengthL + lengthR) * 0.5 };

  // Left Shaded Wall (Dark Dusty Ochre)
  ctx.fillStyle = "#9C7A4A";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y);
  ctx.lineTo(pLeft.x, pLeft.y);
  ctx.lineTo(pLeft.x, pLeft.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#6E522B";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Right Sunlit Wall (Warm Pale Ochre Lime Plaster)
  ctx.fillStyle = "#D6B072";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y);
  ctx.lineTo(pRight.x, pRight.y);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#A38048";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Roof Surface with Decorative Cornice
  ctx.fillStyle = "#BFA067";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y - wallH);
  ctx.lineTo(pLeft.x, pLeft.y - wallH);
  ctx.lineTo(pTop.x, pTop.y - wallH);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.closePath();
  ctx.fill();

  // Stepped Decorative Parapet with Cresting
  ctx.fillStyle = "#E8CCA0";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y - wallH - 12);
  ctx.lineTo(pRight.x, pRight.y - wallH - 12);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#7A5726";
  ctx.stroke();

  // --- 2nd Floor: Carved Wooden Jharokha Balcony (Projecting out in 3D) ---
  const jbx = cx + 24;
  const jby = baseY - 105;
  // Balcony under-shadow
  ctx.fillStyle = "rgba(30, 18, 10, 0.35)";
  ctx.beginPath();
  ctx.ellipse(jbx, jby + 16, 22, 9, -0.46, 0, Math.PI * 2);
  ctx.fill();

  // Teak Wood Balcony Box
  ctx.fillStyle = "#4A2912";
  ctx.beginPath();
  ctx.moveTo(jbx - 14, jby + 7);
  ctx.lineTo(jbx + 16, jby - 8);
  ctx.lineTo(jbx + 16, jby - 32);
  ctx.lineTo(jbx - 14, jby - 17);
  ctx.closePath();
  ctx.fill();

  // Decorative Jali screen panels on balcony
  ctx.fillStyle = "#D4A373";
  ctx.fillRect(jbx - 10, jby - 12, 10, 12);
  ctx.fillRect(jbx + 4, jby - 19, 10, 12);
  ctx.strokeStyle = "#2E1505";
  ctx.lineWidth = 1;
  ctx.strokeRect(jbx - 10, jby - 12, 10, 12);
  ctx.strokeRect(jbx + 4, jby - 19, 10, 12);

  // Tiny brass hanging lantern beneath balcony
  ctx.strokeStyle = "#B8860B";
  ctx.beginPath();
  ctx.moveTo(jbx, jby + 6);
  ctx.lineTo(jbx, jby + 14);
  ctx.stroke();
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(jbx, jby + 16, 3, 0, Math.PI * 2);
  ctx.fill();

  // --- Ground Floor Bangle Shopfront with Stacked Velvet Bangle Displays ---
  ctx.fillStyle = "#1A0F07";
  ctx.beginPath();
  ctx.moveTo(cx + 8, baseY - 4);
  ctx.lineTo(cx + 56, baseY - 28);
  ctx.lineTo(cx + 56, baseY - 68);
  ctx.lineTo(cx + 8, baseY - 44);
  ctx.closePath();
  ctx.fill();

  // Glittering Red, Gold & Green Bangle Tiers
  const bangleTiers = [
    { y: baseY - 32, col: "#D90429" },
    { y: baseY - 42, col: "#FFD166" },
    { y: baseY - 52, col: "#06D6A0" },
  ];
  bangleTiers.forEach((bt) => {
    ctx.fillStyle = bt.col;
    ctx.beginPath();
    ctx.ellipse(cx + 30, bt.y, 16, 4, -0.46, 0, Math.PI * 2);
    ctx.fill();
    // Tiny glitter glints
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(cx + 26, bt.y - 2, 2, 2);
    ctx.fillRect(cx + 34, bt.y - 1, 2, 2);
  });

  // Emerald & Ochre Striped Canopy
  const awW = 54;
  const awProj = 14;
  ctx.fillStyle = "#1B4332"; // Deep Forest Green
  ctx.beginPath();
  ctx.moveTo(cx + 6, baseY - 44);
  ctx.lineTo(cx + 6 + awW, baseY - 44 - awW * 0.5);
  ctx.lineTo(cx + 6 + awW + awProj, baseY - 44 - awW * 0.5 + 10 + awProj * 0.5);
  ctx.lineTo(cx + 6 + awProj, baseY - 44 + 10 + awProj * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#081C15";
  ctx.stroke();

  // Yellow Ochre Stripes
  ctx.fillStyle = "#E9C46A";
  for (let s = 1; s < 4; s++) {
    const sx = cx + 6 + s * 14;
    const sy = baseY - 44 - s * 7;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 6, sy - 3);
    ctx.lineTo(sx + 6 + awProj, sy - 3 + 10 + awProj * 0.5);
    ctx.lineTo(sx + awProj, sy + 10 + awProj * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  return canvas;
}

// --------------------------------------------------------------------------------------
// 3. OLD SHOP C: Pathargatti Attar & Perfumery (Dressed Ashlar Granite Arcade)
// --------------------------------------------------------------------------------------
export function renderAttarShopCanvas() {
  const w = 240;
  const h = 230;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const baseY = h - 28;

  drawContactShadow(ctx, cx - 8, baseY + 6, 92, 30, 0.28);

  const lengthL = 70;
  const lengthR = 82;
  const wallH = 135;

  const pBase = { x: cx, y: baseY };
  const pLeft = { x: cx - lengthL, y: baseY - lengthL * 0.5 };
  const pRight = { x: cx + lengthR, y: baseY - lengthR * 0.5 };
  const pTop = { x: cx - lengthL + lengthR, y: baseY - (lengthL + lengthR) * 0.5 };

  // Shaded Left Wall (Shadowed Grey Basalt Granite)
  ctx.fillStyle = "#6B7280";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y);
  ctx.lineTo(pLeft.x, pLeft.y);
  ctx.lineTo(pLeft.x, pLeft.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#4B5563";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Sunlit Right Wall (Vincent Esch Dressed Ashlar Grey Granite)
  ctx.fillStyle = "#9CA3AF";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y);
  ctx.lineTo(pRight.x, pRight.y);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#6B7280";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Ashlar Stone Joint Courses
  ctx.strokeStyle = "rgba(55, 65, 81, 0.28)";
  ctx.lineWidth = 1;
  for (let dy = 16; dy < wallH; dy += 14) {
    ctx.beginPath();
    ctx.moveTo(pBase.x, pBase.y - dy);
    ctx.lineTo(pRight.x, pRight.y - dy);
    ctx.stroke();
  }

  // Flat Roof & Heavy Stone Cornice
  ctx.fillStyle = "#4B5563";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y - wallH);
  ctx.lineTo(pLeft.x, pLeft.y - wallH);
  ctx.lineTo(pTop.x, pTop.y - wallH);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.closePath();
  ctx.fill();

  // Monumental Moorish Arch Portico on Right Face
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.moveTo(cx + 14, baseY - 7);
  ctx.lineTo(cx + 68, baseY - 34);
  ctx.lineTo(cx + 68, baseY - 78);
  ctx.bezierCurveTo(cx + 68, baseY - 105, cx + 14, baseY - 90, cx + 14, baseY - 62);
  ctx.closePath();
  ctx.fill();

  // Polished Mahogany Vitrine with Cut-Glass Attar Decanters
  ctx.fillStyle = "#3E2723";
  ctx.fillRect(cx + 28, baseY - 48, 28, 24);
  // Cut glass bottles with amber/rose oils
  const bottleCols = ["#F59E0B", "#EF4444", "#10B981", "#EC4899"];
  bottleCols.forEach((bc, idx) => {
    ctx.fillStyle = bc;
    ctx.beginPath();
    ctx.arc(cx + 33 + idx * 6, baseY - 40, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#F3F4F6"; // Crystal stopper
    ctx.fillRect(cx + 32 + idx * 6, baseY - 45, 2, 3);
  });

  // Calligraphic Arch Signboard: "GULAB & MITTI ATTAR"
  ctx.fillStyle = "#D1D5DB";
  ctx.font = "bold 6.5px serif";
  ctx.save();
  ctx.translate(cx + 20, baseY - 86);
  ctx.rotate(-0.46);
  ctx.fillText("PATHARGATTI ITTAR", 0, 0);
  ctx.restore();

  return canvas;
}

// --------------------------------------------------------------------------------------
// 4. OLD SHOP D: Irani Cafe & Chai Khana (Corner Building, Samovar, Marble Tables)
// --------------------------------------------------------------------------------------
export function renderIraniCafeCanvas() {
  const w = 270;
  const h = 250;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const baseY = h - 30;

  drawContactShadow(ctx, cx - 10, baseY + 6, 110, 35, 0.3);

  const lengthL = 82;
  const lengthR = 88;
  const wallH = 145;

  const pBase = { x: cx, y: baseY };
  const pLeft = { x: cx - lengthL, y: baseY - lengthL * 0.5 };
  const pRight = { x: cx + lengthR, y: baseY - lengthR * 0.5 };
  const pTop = { x: cx - lengthL + lengthR, y: baseY - (lengthL + lengthR) * 0.5 };

  // Left Shaded Wall (Aged Mustard Yellow in Shadow)
  ctx.fillStyle = "#B5933F";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y);
  ctx.lineTo(pLeft.x, pLeft.y);
  ctx.lineTo(pLeft.x, pLeft.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#806320";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Sunlit Right Wall (Warm Irani Cafe Butter Yellow)
  ctx.fillStyle = "#F4D06F";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y);
  ctx.lineTo(pRight.x, pRight.y);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#BFA043";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Flat Roof with Water Tank & Corner Balustrade
  ctx.fillStyle = "#9C7D30";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y - wallH);
  ctx.lineTo(pLeft.x, pLeft.y - wallH);
  ctx.lineTo(pTop.x, pTop.y - wallH);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.closePath();
  ctx.fill();

  // Sintex Water Tank on roof
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.arc(cx - 25, baseY - wallH - 20, 9, 0, Math.PI * 2);
  ctx.fill();

  // Arched Corner Portico & Warm Glowing Chai Counter
  ctx.fillStyle = "#1A140B";
  ctx.beginPath();
  ctx.moveTo(cx + 8, baseY - 4);
  ctx.lineTo(cx + 74, baseY - 37);
  ctx.lineTo(cx + 74, baseY - 84);
  ctx.lineTo(cx + 8, baseY - 51);
  ctx.closePath();
  ctx.fill();

  // Shining Brass/Copper Tea Samovar with boiling chai
  ctx.fillStyle = "#D97706";
  ctx.fillRect(cx + 20, baseY - 42, 10, 16);
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.arc(cx + 25, baseY - 44, 6, Math.PI, 0, false);
  ctx.fill();

  // Outdoor Round White Marble Cafe Table
  const tx = cx + 85;
  const ty = baseY - 8;
  ctx.fillStyle = "rgba(35, 20, 10, 0.3)";
  ctx.beginPath();
  ctx.ellipse(tx, ty + 8, 18, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#E2E8F0"; // Marble table top
  ctx.beginPath();
  ctx.ellipse(tx, ty, 16, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 1;
  ctx.stroke();

  // 2 Tiny Glass Chai Tumblers on Table
  ctx.fillStyle = "#D97706"; // Golden chai
  ctx.fillRect(tx - 6, ty - 5, 4, 5);
  ctx.fillRect(tx + 2, ty - 4, 4, 5);

  // Iconic Green-and-Red Awnings
  const awW = 78;
  const awProj = 16;
  ctx.fillStyle = "#2D6A4F"; // Vintage Green
  ctx.beginPath();
  ctx.moveTo(cx + 6, baseY - 50);
  ctx.lineTo(cx + 6 + awW, baseY - 50 - awW * 0.5);
  ctx.lineTo(cx + 6 + awW + awProj, baseY - 50 - awW * 0.5 + 12 + awProj * 0.5);
  ctx.lineTo(cx + 6 + awProj, baseY - 50 + 12 + awProj * 0.5);
  ctx.closePath();
  ctx.fill();

  // Red Stripes
  ctx.fillStyle = "#D00000";
  for (let s = 1; s < 5; s++) {
    const sx = cx + 6 + s * 16;
    const sy = baseY - 50 - s * 8;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 7, sy - 3.5);
    ctx.lineTo(sx + 7 + awProj, sy - 3.5 + 12 + awProj * 0.5);
    ctx.lineTo(sx + awProj, sy + 12 + awProj * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  // Signboard: "IRANI CHAI KHANA"
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.moveTo(cx + 12, baseY - 90);
  ctx.lineTo(cx + 70, baseY - 119);
  ctx.lineTo(cx + 70, baseY - 106);
  ctx.lineTo(cx + 12, baseY - 77);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#F59E0B";
  ctx.stroke();

  ctx.fillStyle = "#FEF08A";
  ctx.font = "bold 7px sans-serif";
  ctx.save();
  ctx.translate(cx + 16, baseY - 82);
  ctx.rotate(-0.46);
  ctx.fillText("IRANI CHAI & SIKANDAR", 0, 0);
  ctx.restore();

  return canvas;
}

// --------------------------------------------------------------------------------------
// 5. OLD HOUSE A: Asaf Jahi Deorhi Haveli (Pointed Teak Gateway, Jharokha, Eaves)
// --------------------------------------------------------------------------------------
export function renderHaveliCanvas(variant = 0) {
  const w = 260;
  const h = 250;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const baseY = h - 28;

  drawContactShadow(ctx, cx - 10, baseY + 6, 105, 34, 0.3);

  const lengthL = 80;
  const lengthR = 84;
  const wallH = 150;

  const pBase = { x: cx, y: baseY };
  const pLeft = { x: cx - lengthL, y: baseY - lengthL * 0.5 };
  const pRight = { x: cx + lengthR, y: baseY - lengthR * 0.5 };
  const pTop = { x: cx - lengthL + lengthR, y: baseY - (lengthL + lengthR) * 0.5 };

  // Left Face in Shadow (Muted Olive Khaki / Sandstone)
  const leftColors = ["#8C7A6B", "#7E8570", "#9E8279"];
  ctx.fillStyle = leftColors[variant % leftColors.length];
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y);
  ctx.lineTo(pLeft.x, pLeft.y);
  ctx.lineTo(pLeft.x, pLeft.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(40, 25, 15, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Sunlit Right Face (Warm Deccan Lime Stucco)
  const rightColors = ["#D9C5B2", "#CAD2C5", "#E3D5CA"];
  ctx.fillStyle = rightColors[variant % rightColors.length];
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y);
  ctx.lineTo(pRight.x, pRight.y);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(40, 25, 15, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Terracotta Overhanging Eaves (Chhajja with wooden corbels)
  ctx.fillStyle = "#A34828";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y - wallH);
  ctx.lineTo(pRight.x + 8, pRight.y - wallH - 4);
  ctx.lineTo(pRight.x + 8, pRight.y - wallH - 12);
  ctx.lineTo(pBase.x, pBase.y - wallH - 8);
  ctx.closePath();
  ctx.fill();

  // Monumental Pointed Arched Teak Gateway with brass studs
  ctx.fillStyle = "#26150D";
  ctx.beginPath();
  ctx.moveTo(cx + 18, baseY - 9);
  ctx.lineTo(cx + 56, baseY - 28);
  ctx.lineTo(cx + 56, baseY - 64);
  ctx.bezierCurveTo(cx + 56, baseY - 86, cx + 18, baseY - 75, cx + 18, baseY - 50);
  ctx.closePath();
  ctx.fill();

  // Carved Teak Jharokha Balcony on upper floor with wooden brackets
  const jx = cx + 36;
  const jy = baseY - 100;
  ctx.fillStyle = "#3D2314";
  ctx.beginPath();
  ctx.moveTo(jx - 16, jy + 8);
  ctx.lineTo(jx + 18, jy - 9);
  ctx.lineTo(jx + 18, jy - 36);
  ctx.lineTo(jx - 16, jy - 19);
  ctx.closePath();
  ctx.fill();

  // Balcony Window Grille & Jali Screen
  ctx.fillStyle = "#D4AF37";
  ctx.fillRect(jx - 8, jy - 14, 8, 12);
  ctx.fillRect(jx + 6, jy - 21, 8, 12);

  // Colorful drying dupatta / textile on rooftop railing
  const dupattaCols = ["#FF5964", "#35A7FF", "#FFD166"];
  ctx.fillStyle = dupattaCols[variant % dupattaCols.length];
  ctx.beginPath();
  ctx.moveTo(cx + 12, baseY - wallH - 2);
  ctx.bezierCurveTo(cx + 28, baseY - wallH + 12, cx + 45, baseY - wallH - 4, cx + 62, baseY - wallH - 18);
  ctx.lineWidth = 4;
  ctx.strokeStyle = dupattaCols[variant % dupattaCols.length];
  ctx.stroke();

  return canvas;
}

// --------------------------------------------------------------------------------------
// 6. SMALL MOSQUE / DARGAH GATEWAY (White & Mint Stucco, Stone Jali, Crescent Finial)
// --------------------------------------------------------------------------------------
export function renderMosqueGatewayCanvas() {
  const w = 240;
  const h = 260;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = w / 2;
  const baseY = h - 28;

  drawContactShadow(ctx, cx - 8, baseY + 6, 95, 32, 0.3);

  const lengthL = 68;
  const lengthR = 76;
  const wallH = 155;

  const pBase = { x: cx, y: baseY };
  const pLeft = { x: cx - lengthL, y: baseY - lengthL * 0.5 };
  const pRight = { x: cx + lengthR, y: baseY - lengthR * 0.5 };

  // Left Shaded Wall (Soft Mint Shadow)
  ctx.fillStyle = "#A8C5B8";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y);
  ctx.lineTo(pLeft.x, pLeft.y);
  ctx.lineTo(pLeft.x, pLeft.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#719B88";
  ctx.stroke();

  // Sunlit Right Wall (Bright White & Mint Stucco)
  ctx.fillStyle = "#E8F4F0";
  ctx.beginPath();
  ctx.moveTo(pBase.x, pBase.y);
  ctx.lineTo(pRight.x, pRight.y);
  ctx.lineTo(pRight.x, pRight.y - wallH);
  ctx.lineTo(pBase.x, pBase.y - wallH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#A4C7B8";
  ctx.stroke();

  // Grand Pointed Arch Portal with Green Glass Hanging Lantern
  ctx.fillStyle = "#132E23";
  ctx.beginPath();
  ctx.moveTo(cx + 12, baseY - 6);
  ctx.lineTo(cx + 62, baseY - 31);
  ctx.lineTo(cx + 62, baseY - 84);
  ctx.bezierCurveTo(cx + 62, baseY - 114, cx + 12, baseY - 98, cx + 12, baseY - 65);
  ctx.closePath();
  ctx.fill();

  // Glowing Green Glass Lantern in Archway
  ctx.fillStyle = "#10B981";
  ctx.beginPath();
  ctx.arc(cx + 37, baseY - 65, 5, 0, Math.PI * 2);
  ctx.fill();

  // Central Fluted Onion Dome with Brass Crescent Finial
  ctx.fillStyle = "#2D6A4F";
  ctx.beginPath();
  ctx.arc(cx + 15, baseY - wallH - 22, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#52B788";
  ctx.beginPath();
  ctx.arc(cx + 15, baseY - wallH - 25, 18, 0, Math.PI * 2);
  ctx.fill();

  // Brass Crescent
  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx + 15, baseY - wallH - 46, 5, 0.4, Math.PI * 1.8);
  ctx.stroke();

  // Miniature Corner Minarets with Lotus Domes
  const drawMinaret = (mx, my) => {
    ctx.fillStyle = "#E8F4F0";
    ctx.fillRect(mx - 4, my - 35, 8, 35);
    ctx.fillStyle = "#52B788";
    ctx.beginPath();
    ctx.arc(mx, my - 38, 5, 0, Math.PI * 2);
    ctx.fill();
  };
  drawMinaret(pBase.x, pBase.y - wallH);
  drawMinaret(pRight.x, pRight.y - wallH);

  return canvas;
}

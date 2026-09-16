// Authored Vector-Illustrated Wimmelvis Relic Assets
// Designed for PixiJS 8 texture caching

function createOffscreen(width, height) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  return c;
}

export function renderRelicCanvas(id) {
  const w = 44;
  const h = 44;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");
  const cx = 22;
  const cy = 22;

  if (id === "secret-chai") {
    // Silver / Porcelain Saucer & Golden Tea Cup
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Hot Chai Cup
    ctx.fillStyle = "#C25D34";
    ctx.fillRect(cx - 6, cy - 6, 12, 10);
    // 2 Osmania Biscuits on side
    ctx.fillStyle = "#D97706";
    ctx.beginPath();
    ctx.arc(cx + 9, cy + 2, 3.5, 0, Math.PI * 2);
    ctx.arc(cx - 9, cy + 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === "secret-pearl") {
    // Crimson Velvet Jewellery Box
    ctx.fillStyle = "#991B1B";
    ctx.fillRect(cx - 10, cy - 6, 20, 14);
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(cx - 10, cy - 6, 20, 14);

    // Glowing Basra Pearl Choker
    ctx.fillStyle = "#FFFDF9";
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(cx + i * 2.5, cy + 1, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === "secret-inscription") {
    // Ancient Carved Stone Tablet
    ctx.fillStyle = "#78350F";
    ctx.fillRect(cx - 10, cy - 10, 20, 18);
    ctx.strokeStyle = "#FDE68A";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 9, cy - 9, 18, 16);

    // Arabic Calligraphy Strokes
    ctx.fillStyle = "#FEF08A";
    for (let i = -6; i <= 4; i += 4) {
      ctx.fillRect(cx - 6, cy + i, 12, 1.5);
    }
  } else if (id === "secret-attar") {
    // Belgian Cut-Crystal Flacon
    ctx.fillStyle = "#0284C7";
    ctx.fillRect(cx - 6, cy - 6, 12, 14);
    ctx.fillStyle = "#38BDF8";
    ctx.fillRect(cx - 4, cy - 4, 8, 10);
    // Gold Stopper
    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.arc(cx, cy - 9, 3.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === "secret-lacquer") {
    // Wooden Bangle Mold with Lacquer Crystals
    ctx.fillStyle = "#78350F";
    ctx.fillRect(cx - 12, cy - 4, 24, 6);
    ctx.fillStyle = "#EC4899";
    ctx.beginPath();
    ctx.arc(cx, cy - 1, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FBBF24";
    ctx.beginPath();
    ctx.arc(cx, cy - 1, 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Royal Dastarkhwan Recipe Manuscript Scroll
    ctx.fillStyle = "#FEF3C7";
    ctx.fillRect(cx - 10, cy - 8, 20, 16);
    ctx.strokeStyle = "#B45309";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 10, cy - 8, 20, 16);
    ctx.fillStyle = "#92400E";
    ctx.fillRect(cx - 7, cy - 4, 14, 2);
    ctx.fillRect(cx - 7, cy, 14, 2);
    ctx.fillRect(cx - 7, cy + 4, 10, 2);
  }

  return canvas;
}

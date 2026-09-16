// Authored Vector-Illustrated Pedestrian & Character Assets
// Designed for PixiJS 8 texture caching

function createOffscreen(width, height) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  return c;
}

// Stylized Old Hyderabad Pedestrian
export function renderCharacterCanvas(type = "kurta", direction = 1) {
  const w = 32;
  const h = 48;
  const canvas = createOffscreen(w, h);
  const ctx = canvas.getContext("2d");

  ctx.save();
  if (direction === -1) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }

  const cx = 16;
  const baseY = 42;

  // Shadow
  ctx.fillStyle = "rgba(43, 33, 25, 0.25)";
  ctx.beginPath();
  ctx.ellipse(cx, baseY, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  if (type === "burqa") {
    // Flowing Black Abaya / Burqa
    ctx.fillStyle = "#1E2229";
    ctx.beginPath();
    ctx.moveTo(cx - 7, baseY);
    ctx.lineTo(cx + 7, baseY);
    ctx.lineTo(cx + 4, baseY - 26);
    ctx.lineTo(cx - 4, baseY - 26);
    ctx.closePath();
    ctx.fill();

    // Head / Hijab
    ctx.fillStyle = "#1E2229";
    ctx.beginPath();
    ctx.arc(cx, baseY - 30, 5.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "saree_saffron" || type === "saree_teal") {
    const color = type === "saree_saffron" ? "#EA580C" : "#0D9488";
    // Saree Pallu & Pleats
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx - 6, baseY);
    ctx.lineTo(cx + 6, baseY);
    ctx.lineTo(cx + 4, baseY - 25);
    ctx.lineTo(cx - 4, baseY - 25);
    ctx.closePath();
    ctx.fill();

    // Golden Border Accent
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(cx - 5, baseY - 3, 10, 2);

    // Head with Bun
    ctx.fillStyle = "#D7CCC8";
    ctx.beginPath();
    ctx.arc(cx, baseY - 29, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1E1A16"; // Hair
    ctx.beginPath();
    ctx.arc(cx - 2, baseY - 30, 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // White Hyderabadi Kurta & Pyjama
    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(cx - 4, baseY - 12, 8, 12); // Pyjama
    ctx.fillRect(cx - 5, baseY - 26, 10, 16); // Kurta
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 5, baseY - 26, 10, 16);

    // Head & White Embroidered Skullcap (Topi)
    ctx.fillStyle = "#D7CCC8";
    ctx.beginPath();
    ctx.arc(cx, baseY - 29, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(cx - 4, baseY - 35, 8, 4);
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 0.8;
    ctx.strokeRect(cx - 4, baseY - 35, 8, 4);
  }

  ctx.restore();
  return canvas;
}

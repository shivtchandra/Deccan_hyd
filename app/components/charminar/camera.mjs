export const WORLD = { width: 1536, height: 1024 };

export function fitScale(view) {
  return Math.max(view.width / WORLD.width, view.height / WORLD.height);
}

export function clampCamera(camera, view) {
  const minimum = fitScale(view);
  const scale = Math.max(minimum, Math.min(minimum * 2.8, camera.scale));
  return {
    scale,
    x: Math.min(0, Math.max(view.width - WORLD.width * scale, camera.x)),
    y: Math.min(0, Math.max(view.height - WORLD.height * scale, camera.y)),
  };
}

export function framePoint(point, view, zoom = 1, anchor = { x: 0.5, y: 0.5 }) {
  const scale = fitScale(view) * zoom;
  return clampCamera({ scale, x: view.width * anchor.x - point.x * scale, y: view.height * anchor.y - point.y * scale }, view);
}

export function zoomAt(camera, point, factor, view) {
  const scale = Math.max(fitScale(view), Math.min(fitScale(view) * 2.8, camera.scale * factor));
  const ratio = scale / camera.scale;
  return clampCamera({ scale, x: point.x - (point.x - camera.x) * ratio, y: point.y - (point.y - camera.y) * ratio }, view);
}

export function validMemories(value, allowed) {
  return Array.isArray(value) ? [...new Set(value.filter((id) => allowed.includes(id)))] : [];
}

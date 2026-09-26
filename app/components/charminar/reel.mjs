/** Continuous evening photo reel — three districts as one horizontal walk. */

export const PANEL = 1536;
export const OVERLAP = 96;
export const REEL = {
  width: PANEL * 3 - OVERLAP * 2, // 4416
  height: 1024,
  image: '/charminar/evening-reel.png',
  alt: 'A continuous evening walk from Charminar square through bangle lane into a hidden courtyard.',
};

export const MOMENTS = [
  {
    id: 'square',
    name: 'Charminar square',
    time: 'Dusk',
    caption: 'A familiar beginning.',
    x0: 0,
    focus: { x: 768, y: 460 },
    thumb: '/charminar/timeline-moment-square.png',
  },
  {
    id: 'lane',
    name: 'Bangle lane',
    time: 'Lamplight',
    caption: 'Follow the colour.',
    x0: PANEL - OVERLAP, // 1440
    focus: { x: 1440 + 768, y: 460 },
    thumb: '/charminar/timeline-moment-lane.png',
  },
  {
    id: 'courtyard',
    name: 'Hidden courtyard',
    time: 'Lamps on',
    caption: 'The city takes a breath.',
    x0: 2 * (PANEL - OVERLAP), // 2880
    focus: { x: 2880 + 768, y: 460 },
    thumb: '/charminar/timeline-moment-courtyard.png',
  },
];

export function sceneOffset(sceneId) {
  return MOMENTS.find((m) => m.id === sceneId)?.x0 ?? 0;
}

export function worldPoint(item) {
  const ox = sceneOffset(item.scene || 'square');
  return {
    x: item.x + ox,
    y: item.y,
    camera: {
      x: (item.camera?.x ?? item.x) + ox,
      y: item.camera?.y ?? item.y,
    },
  };
}

/** Which moment the camera centre is currently in. */
export function momentAtCamera(camera, view) {
  const centreX = (view.width / 2 - camera.x) / camera.scale;
  let best = MOMENTS[0];
  for (const m of MOMENTS) {
    if (centreX >= m.x0) best = m;
  }
  return best;
}

export function momentById(id) {
  return MOMENTS.find((m) => m.id === id) || MOMENTS[0];
}

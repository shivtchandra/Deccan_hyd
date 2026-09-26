export const VISIT_KEY = 'dhm_charminar_1985_v1';
export const LEGACY_KEY = 'dhm_charminar_evening_v1';
export const SIZE = { width: 1536, height: 1024 };
export const PLACES = {
  square: { title: 'A seat in the square', subtitle: 'The kettle is still on.', center: [470, 530], action: 'chai', point: [300, 788], arrival: [520, 690], passages: ['lane'], bounds: [440, 540, 670, 755] },
  lane: { title: 'A little colour to take home', subtitle: 'Zehra holds a bangle up to the light.', center: [1090, 350], action: 'bangles', point: [1040, 385], arrival: [925, 445], passages: ['square', 'courtyard'], bounds: [990, 375, 1110, 405] },
  courtyard: { title: 'Behind the green arch', subtitle: 'Even the pigeons know their way home.', center: [1180, 685], action: 'grain', point: [1185, 745], arrival: [1110, 745], passages: ['lane'], bounds: [1140, 722, 1250, 760] },
};
export const MOMENTS = {
  chai: { label: 'Take a seat for chai', person: 'Bashir', greeting: 'There’s room here. I’ll pour you a cup.', returning: 'Your usual seat? The kettle’s just boiled.', steps: ['Bashir makes room on the bench.', 'Tea falls in a thin amber stream.', 'A warm cup, and nowhere else to be.'], duration: 6, title: 'A place on the bench', note: 'Bashir slid a cup towards me. Nobody asked when I was leaving.' },
  bangles: { label: 'Try a colour with Zehra', person: 'Zehra', greeting: 'Hold your hand here, in the light.', returning: 'Back for another colour? Let’s see.', steps: ['Zehra slips a few bangles from the stand.', 'She turns your wrist towards the light.', 'A little colour follows you into the evening.'], duration: 5.5, title: 'Colour in the evening light', note: 'Zehra knew the right size before I said a word.' },
  grain: { label: 'Scatter a handful of grain', person: 'Amina', greeting: 'A small handful. They’ll come to you.', returning: 'They remember where you were standing.', steps: ['Grain scatters across the warm stone.', 'The first pigeon is followed by the others.', 'For a moment, the whole courtyard settles.'], duration: 7, title: 'Company in the courtyard', note: 'I stood still. One by one, they came closer.' },
};
export function restoreVisit(raw) {
  try {
    const v = JSON.parse(raw || '{}');
    return { memories: Object.fromEntries(Object.entries(v?.memories || {}).filter(([k, x]) => MOMENTS[k] && x && typeof x === 'object').map(([k,x]) => [k, { colour: x.colour === 'green' ? 'green' : 'red' }])), elapsed: Number.isFinite(v?.elapsed) ? Math.max(0, Math.min(v.elapsed, 240)) : 0 };
  } catch { return { memories: {}, elapsed: 0 }; }
}
export function startMoment(current, id, colour = 'red') {
  if (current || !MOMENTS[id]) return current;
  return { id, elapsed: 0, colour: colour === 'green' ? 'green' : 'red', phase: 0, done: false };
}
export function advanceMoment(current, dt) {
  if (!current || current.done) return current;
  const elapsed = Math.min(MOMENTS[current.id].duration, current.elapsed + Math.max(0, dt));
  const progress = elapsed / MOMENTS[current.id].duration;
  return { ...current, elapsed, phase: Math.min(2, Math.floor(progress * 3)), done: progress >= 1 };
}
export function eveningPhase(elapsed) { return elapsed < 45 ? 'sunset' : elapsed < 130 ? 'lamplight' : 'closing'; }
export function constrainCamera(c, view) {
  const min = Math.max(view.width / SIZE.width, view.height / SIZE.height);
  const scale = Math.min(Math.max(c.scale, min), Math.max(2.4, min * 2));
  return { scale, x: Math.min(0, Math.max(view.width - SIZE.width * scale, c.x)), y: Math.min(0, Math.max(view.height - SIZE.height * scale, c.y)) };
}
export function cameraFor(point, view) {
  const scale = Math.max(view.width / SIZE.width, view.height / SIZE.height, view.width < 600 ? 1.05 : 1.18);
  return constrainCamera({ scale, x: view.width * .5 - point[0] * scale, y: view.height * .48 - point[1] * scale }, view);
}
export function moveAlong(actor, target, dt, speed = 24) {
  const dx = target[0] - actor.x, dy = target[1] - actor.y;
  const distance = Math.hypot(dx, dy), step = Math.min(distance, speed * dt);
  if (distance > 0) { actor.x += dx / distance * step; actor.y += dy / distance * step; }
  return { arrived: distance <= step, distance: step, direction: Math.atan2(dy, dx) };
}

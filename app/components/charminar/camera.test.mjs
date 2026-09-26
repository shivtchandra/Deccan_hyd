import test from 'node:test';
import assert from 'node:assert/strict';
import { WORLD, clampCamera, framePoint, zoomAt, validMemories } from './camera.mjs';

test('landscape and portrait framing never expose empty world edges', () => {
  for (const view of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
    for (const point of [{ x: 0, y: 0 }, { x: WORLD.width, y: WORLD.height }, { x: 800, y: 700 }]) {
      const c = framePoint(point, view, 1.6);
      assert.ok(c.x <= 0 && c.y <= 0);
      assert.ok(c.x + WORLD.width * c.scale >= view.width - 0.001);
      assert.ok(c.y + WORLD.height * c.scale >= view.height - 0.001);
    }
  }
});

test('zoom preserves the world point beneath the finger away from bounds', () => {
  const view = { width: 1200, height: 800 };
  const before = framePoint({ x: 768, y: 512 }, view, 1.5);
  const finger = { x: 610, y: 410 };
  const after = zoomAt(before, finger, 1.2, view);
  assert.ok(Math.abs((finger.x - before.x) / before.scale - (finger.x - after.x) / after.scale) < 0.001);
  assert.ok(Math.abs((finger.y - before.y) / before.scale - (finger.y - after.y) / after.scale) < 0.001);
});

test('extreme gestures stay bounded and corrupt saved state is rejected', () => {
  const c = clampCamera({ x: 99999, y: -99999, scale: 99999 }, { width: 375, height: 812 });
  assert.equal(c.x, 0);
  assert.ok(c.scale < 3);
  assert.deepEqual(validMemories({ chai: true }, ['chai']), []);
  assert.deepEqual(validMemories(['chai', 'chai', 'unknown'], ['chai']), ['chai']);
});

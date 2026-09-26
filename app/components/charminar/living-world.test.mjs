import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceMoment, startMoment, restoreVisit, eveningPhase, constrainCamera, moveAlong, PLACES } from './living-world.mjs';
test('one action at a time; completion follows the full visible sequence', () => {
  const first = startMoment(null, 'chai');
  assert.equal(startMoment(first, 'grain'), first);
  assert.equal(startMoment(null, 'unknown'), null);
  assert.equal(advanceMoment(first, 5.9).done, false);
  const done = advanceMoment(first, 6);
  assert.equal(done.done, true);
  assert.equal(done.phase, 2);
  assert.equal(advanceMoment(done, 2), done);
});
test('save validation preserves recognised outcomes without trusting corrupt input', () => {
  assert.deepEqual(restoreVisit('broken'), { memories: {}, elapsed: 0 });
  assert.deepEqual(restoreVisit('null'), { memories: {}, elapsed: 0 });
  assert.deepEqual(restoreVisit('{"memories":{"bangles":{"colour":"green"},"bogus":{}},"elapsed":999}'), { memories: { bangles: { colour: 'green' } }, elapsed: 240 });
});
test('passages are bidirectional and evening phases share one clock', () => {
  for (const [id, place] of Object.entries(PLACES)) for (const to of place.passages) assert.ok(PLACES[to].passages.includes(id));
  assert.deepEqual([0, 45, 130].map(eveningPhase), ['sunset', 'lamplight', 'closing']);
});
test('bounded movement cannot overshoot; camera never exposes outside world', () => {
  const a = { x: 0, y: 0 };
  assert.equal(moveAlong(a, [3,4], 10).arrived, true);
  assert.deepEqual(a, { x:3, y:4 });
  for (const width of [375, 1440]) {
    const v = { width, height: 812 }, c = constrainCamera({x:5000,y:-9999,scale:.01},v);
    assert.ok(c.x <= 0 && c.y <= 0);
    assert.ok(c.x + 1536*c.scale >= width && c.y+1024*c.scale >= 812);
  }
});

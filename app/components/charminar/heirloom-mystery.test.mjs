import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOCK_DEFINITIONS,
  defaultHeirloomState,
  restoreHeirloomState,
  checkLock1,
  checkLock2,
  checkLock3,
  checkLock4,
  countUnlocked,
  isBoxFullyUnlocked
} from './heirloom-mystery.mjs';

test('Lock 1: Concentric Lacquer Bangle Rings validates green-red-green sequence', () => {
  assert.equal(checkLock1(['green', 'red', 'green']), true);
  assert.equal(checkLock1(['red', 'gold', 'green']), false);
  assert.equal(checkLock1(['green', 'green', 'green']), false);
});

test('Lock 2: 1889 Clock Tower Dial validates 4:45 PM', () => {
  assert.equal(checkLock2({ hour: 4, minute: 45 }), true);
  assert.equal(checkLock2({ hour: 4, minute: 30 }), false);
  assert.equal(checkLock2({ hour: 12, minute: 0 }), false);
});

test('Lock 3: Vintage Radio Akashvani Hyderabad validates 880 kHz within tolerance', () => {
  assert.equal(checkLock3(880), true);
  assert.equal(checkLock3(875), true); // within tolerance 15
  assert.equal(checkLock3(895), true); // within tolerance 15
  assert.equal(checkLock3(1100), false);
  assert.equal(checkLock3(1278), false);
});

test('Lock 4: Royal Crescent Seal validates right orientation', () => {
  assert.equal(checkLock4('right'), true);
  assert.equal(checkLock4('up'), false);
  assert.equal(checkLock4('down'), false);
  assert.equal(checkLock4('left'), false);
});

test('countUnlocked and isBoxFullyUnlocked correctly evaluate box state', () => {
  const state = defaultHeirloomState();
  assert.equal(countUnlocked(state.unlocked), 0);
  assert.equal(isBoxFullyUnlocked(state.unlocked), false);

  state.unlocked.lock1 = true;
  assert.equal(countUnlocked(state.unlocked), 1);
  assert.equal(isBoxFullyUnlocked(state.unlocked), false);

  state.unlocked.lock2 = true;
  state.unlocked.lock3 = true;
  state.unlocked.lock4 = true;
  assert.equal(countUnlocked(state.unlocked), 4);
  assert.equal(isBoxFullyUnlocked(state.unlocked), true);
});

test('restoreHeirloomState correctly sanitizes corrupted or partial JSON', () => {
  const empty = restoreHeirloomState(null);
  assert.equal(empty.version, 1);
  assert.equal(empty.unlocked.lock1, false);

  const partial = restoreHeirloomState(JSON.stringify({
    unlocked: { lock1: true },
    values: { lock3: 880, lock4: 'right' },
    hintsUsed: { lock1: 5 } // should cap at 3
  }));
  assert.equal(partial.unlocked.lock1, true);
  assert.equal(partial.unlocked.lock2, false);
  assert.equal(partial.values.lock3, 880);
  assert.equal(partial.values.lock4, 'right');
  assert.equal(partial.hintsUsed.lock1, 3);
});

test('lock definitions contain rich 3-tier clues and historical facts', () => {
  for (const key of ['lock1', 'lock2', 'lock3', 'lock4']) {
    const def = LOCK_DEFINITIONS[key];
    assert.ok(def.name, `Lock ${key} has a name`);
    assert.ok(def.hint1, `Lock ${key} has tier 1 hint`);
    assert.ok(def.hint2, `Lock ${key} has tier 2 hint`);
    assert.ok(def.hint3, `Lock ${key} has tier 3 hint`);
    assert.ok(def.fact, `Lock ${key} has historical trivia`);
  }
});

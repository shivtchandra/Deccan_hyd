import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLUES,
  SPOT_PUZZLES,
  CHAPTERS,
  defaultCipherState,
  restoreCipherState,
  collectClue,
  attemptSpot,
  applyClueToLock,
  activeChapter,
  cipherProgress,
  isCipherComplete,
  nextCipherHint,
  useCipherHint,
  spotPuzzleForEncounter,
  lockSolution,
  chapterComplete,
} from './evening-cipher.mjs';

test('restoreCipherState sanitizes corrupt payloads', () => {
  const empty = restoreCipherState(null);
  assert.equal(empty.version, 1);
  assert.deepEqual(empty.clues, []);

  const partial = restoreCipherState(JSON.stringify({
    clues: ['bangle_pattern', 'bogus'],
    spotted: ['clock_face'],
    applied: ['lock2', 'lock9'],
    hintsUsed: 99,
  }));
  assert.deepEqual(partial.clues, ['bangle_pattern']);
  assert.deepEqual(partial.spotted, ['clock_face']);
  assert.deepEqual(partial.applied, ['lock2']);
  assert.equal(partial.hintsUsed, 3);
});

test('spot puzzle rejects decoys and awards clue on correct pick', () => {
  let state = collectClue(defaultCipherState(), 'invitation');
  const wrong = attemptSpot(state, 'bangle_pattern', 'a');
  assert.equal(wrong.ok, false);
  assert.equal(wrong.state.wrongTries.bangle_pattern, 1);
  assert.equal(wrong.state.clues.includes('bangle_pattern'), false);

  const right = attemptSpot(wrong.state, 'bangle_pattern', 'b');
  assert.equal(right.ok, true);
  assert.ok(right.state.spotted.includes('bangle_pattern'));
  assert.ok(right.state.clues.includes('bangle_pattern'));
});

test('applyClueToLock requires held clue and returns lock solution', () => {
  let state = defaultCipherState();
  const blocked = applyClueToLock(state, 'lock1');
  assert.equal(blocked.ok, false);

  state = collectClue(state, 'bangle_pattern');
  const applied = applyClueToLock(state, 'lock1');
  assert.equal(applied.ok, true);
  assert.deepEqual(applied.values.lock1, ['green', 'red', 'green']);
  assert.ok(applied.state.applied.includes('lock1'));
  assert.deepEqual(lockSolution('lock2'), { lock2: { hour: 4, minute: 45 } });
});

test('activeChapter walks explore → spot → apply in order', () => {
  let cipher = defaultCipherState();
  let memories = [];
  let chapter = activeChapter(cipher, memories, {});
  assert.equal(chapter.id, 'arrive');

  memories = ['letter'];
  cipher = collectClue(cipher, 'invitation');
  chapter = activeChapter(cipher, memories, {});
  assert.equal(chapter.id, 'name_remembered');

  memories = ['letter', 'seller'];
  chapter = activeChapter(cipher, memories, {});
  assert.equal(chapter.id, 'spot_bangles');

  const spotted = attemptSpot(cipher, 'bangle_pattern', 'b');
  cipher = spotted.state;
  chapter = activeChapter(cipher, memories, {});
  assert.equal(chapter.id, 'apply_bangles');

  const applied = applyClueToLock(cipher, 'lock1');
  cipher = applied.state;
  chapter = activeChapter(cipher, memories, { lock1: true });
  assert.equal(chapter.id, 'spot_clock');
});

test('every spot puzzle has exactly one correct option and clue mapping', () => {
  for (const puzzle of Object.values(SPOT_PUZZLES)) {
    const correct = puzzle.options.filter((o) => o.correct);
    assert.equal(correct.length, 1, `${puzzle.id} should have one answer`);
    assert.ok(CLUES[puzzle.clueId], `${puzzle.id} maps to a clue`);
    assert.equal(spotPuzzleForEncounter(puzzle.encounterId)?.id, puzzle.id);
  }
});

test('chapters are reachable and finale completes the cipher', () => {
  assert.ok(CHAPTERS.length >= 8);
  let cipher = collectClue(defaultCipherState(), 'invitation');
  const memories = ['letter', 'seller', 'runner', 'recipient', 'reunion', 'clock', 'radio', 'seal', 'heirloom', 'chai', 'bangles', 'attar'];
  for (const spotId of Object.keys(SPOT_PUZZLES)) {
    const correct = SPOT_PUZZLES[spotId].options.find((o) => o.correct);
    cipher = attemptSpot(cipher, spotId, correct.id).state;
  }
  for (const lockId of ['lock1', 'lock2', 'lock3', 'lock4']) {
    cipher = applyClueToLock(cipher, lockId).state;
  }
  const unlocked = { lock1: true, lock2: true, lock3: true, lock4: true };
  assert.equal(isCipherComplete(cipher, memories, unlocked), true);
  assert.equal(activeChapter(cipher, memories, unlocked), null);
  const { done, total, pct } = cipherProgress(cipher, memories, unlocked);
  assert.equal(done, total);
  assert.equal(pct, 100);
});

test('hint ladder advances up to three tiers', () => {
  const cipher = collectClue(defaultCipherState(), 'invitation');
  const memories = ['letter'];
  const h1 = nextCipherHint(cipher, memories, {});
  assert.equal(h1.tier, 1);
  const after1 = useCipherHint(cipher);
  const h2 = nextCipherHint(after1, memories, {});
  assert.equal(h2.tier, 2);
  const after2 = useCipherHint(after1);
  const h3 = nextCipherHint(after2, memories, {});
  assert.equal(h3.tier, 3);
  assert.ok(chapterComplete(CHAPTERS[0], cipher, ['letter'], {}));
});

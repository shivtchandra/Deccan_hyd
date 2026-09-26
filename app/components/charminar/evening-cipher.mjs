/**
 * The Evening Cipher — cohesive explore → spot → clue → unlock loop
 * for the Charminar evening diorama.
 *
 * Patterns adapted (not copied) from Chinese indie GitHub puzzle games:
 * - qjngbac/seven-games RidiculousToolbox: use clue-on-lock, chapter gates
 * - qjngbac/seven-games WhoBrokeProd: evidence always inspectable, never soft-locked
 * - muxiaoqi007/puzzle-craft: ghost silhouette of next target, 3-tier hints, local save
 * - yi-jy/find-different: careful looking among near-identical options
 * - YeLuo45/room-escape-puzzle: room/district progression + inventory apply
 */

export const CIPHER_KEY = 'dhm_evening_cipher_v1';

export const CLUES = {
  invitation: {
    id: 'invitation',
    name: 'Forgotten invitation',
    icon: '✉',
    summary: 'Addressed to the Moon Bangle House. A green door on the back.',
    appliesTo: null,
  },
  bangle_pattern: {
    id: 'bangle_pattern',
    name: 'Lacquer sequence scrap',
    icon: '◎',
    summary: 'GREEN · RED · GREEN — Zehra’s remembered shop colours.',
    appliesTo: 'lock1',
  },
  clock_face: {
    id: 'clock_face',
    name: '1889 clock sketch',
    icon: '◷',
    summary: 'Four faces frozen at the evening chime: 4:45.',
    appliesTo: 'lock2',
  },
  radio_band: {
    id: 'radio_band',
    name: 'Akashvani dial note',
    icon: '◈',
    summary: 'Medium wave 880 kHz — Hyderabad A, green magic-eye peak.',
    appliesTo: 'lock3',
  },
  crescent_seal: {
    id: 'crescent_seal',
    name: 'Crescent rubbing',
    icon: '☽',
    summary: 'Asaf Jahi crescent with horns opening to the right.',
    appliesTo: 'lock4',
  },
};

/** Spot-the-detail puzzles (find-different style among decoys). */
export const SPOT_PUZZLES = {
  bangle_pattern: {
    id: 'bangle_pattern',
    clueId: 'bangle_pattern',
    encounterId: 'seller',
    scene: 'lane',
    title: 'Which board matches the scrap?',
    prompt: 'Zehra kept three velvet boards. The invitation scrap shows a lacquer ring pattern. Pick the exact match.',
    ghostHint: 'Look for emerald edges with a pomegranate centre.',
    options: [
      { id: 'a', label: 'RED · GREEN · RED', detail: 'Edges reversed — familiar, but wrong.', correct: false },
      { id: 'b', label: 'GREEN · RED · GREEN', detail: 'Emerald, pomegranate, emerald. Exact match.', correct: true },
      { id: 'c', label: 'BLUE · GOLD · BLUE', detail: 'Pretty Feroza set — not on the scrap.', correct: false },
      { id: 'd', label: 'GOLD · GOLD · GOLD', detail: 'Festival zari only. Wrong colours.', correct: false },
    ],
  },
  clock_face: {
    id: 'clock_face',
    clueId: 'clock_face',
    encounterId: 'clock',
    scene: 'square',
    title: 'What time do the faces show?',
    prompt: 'The Vulliamy dials overlook four roads. Which reading matches the evening bazaar chime sketched on the scrap?',
    ghostHint: 'Hour near four. Minute hand on the nine.',
    options: [
      { id: 'a', label: '12:00', detail: 'Noon. The bazaar is quieter then.', correct: false },
      { id: 'b', label: '3:15', detail: 'Close, but the minute hand is wrong.', correct: false },
      { id: 'c', label: '4:45', detail: 'The evening chime. Four and three-quarters.', correct: true },
      { id: 'd', label: '6:30', detail: 'Too late — lamps already fully lit.', correct: false },
    ],
  },
  radio_band: {
    id: 'radio_band',
    clueId: 'radio_band',
    encounterId: 'radio',
    scene: 'lane',
    title: 'Where does the magic eye peak?',
    prompt: 'Salim’s repair bench has four remembered dials. Find the band where the green eye glows brightest.',
    ghostHint: 'Medium wave near nine hundred — Hyderabad A.',
    options: [
      { id: 'a', label: '720 kHz', detail: 'A distant station. The eye barely stirs.', correct: false },
      { id: 'b', label: '880 kHz', detail: 'Akashvani Hyderabad. The eye blooms green.', correct: true },
      { id: 'c', label: '1010 kHz', detail: 'Busy band, wrong city.', correct: false },
      { id: 'd', label: '1278 kHz', detail: 'Short of the peak. Eye dims.', correct: false },
    ],
  },
  crescent_seal: {
    id: 'crescent_seal',
    clueId: 'crescent_seal',
    encounterId: 'seal',
    scene: 'courtyard',
    title: 'Which way do the horns open?',
    prompt: 'Four brass rubbings of the courtyard medallion. Match the carving above the green arch.',
    ghostHint: 'Horns welcome the morning — open toward the east / right.',
    options: [
      { id: 'a', label: 'Horns up (north)', detail: 'A common seal pose — not this arch.', correct: false },
      { id: 'b', label: 'Horns right (east)', detail: 'Opens to the right. Matches the arch.', correct: true },
      { id: 'c', label: 'Horns down (south)', detail: 'Inverted. Wrong rubbing.', correct: false },
      { id: 'd', label: 'Horns left (west)', detail: 'Mirror image of the true seal.', correct: false },
    ],
  },
};

/**
 * Ordered chapters for the objective HUD.
 * kind: story | spot | apply | finale
 */
export const CHAPTERS = [
  {
    id: 'arrive',
    kind: 'story',
    title: 'An invitation without an address',
    hint: 'Find Bashir at the chai counter and take the envelope.',
    scene: 'square',
    encounterId: 'letter',
    ghost: '✉',
    requires: [],
  },
  {
    id: 'name_remembered',
    kind: 'story',
    title: 'A name remembered',
    hint: 'Ask Zehra in bangle lane about the Moon Bangle House.',
    scene: 'lane',
    encounterId: 'seller',
    ghost: '◎',
    requires: ['invitation'],
  },
  {
    id: 'spot_bangles',
    kind: 'spot',
    title: 'Match the lacquer rings',
    hint: 'Compare Zehra’s velvet boards to the scrap. Pick the true pattern.',
    scene: 'lane',
    encounterId: 'seller',
    spotId: 'bangle_pattern',
    ghost: '◎',
    requires: ['invitation'],
  },
  {
    id: 'apply_bangles',
    kind: 'apply',
    title: 'Set the bangle cipher',
    hint: 'Open the Heirloom Box and apply the lacquer sequence to Lock 1.',
    scene: 'courtyard',
    encounterId: 'heirloom',
    lockId: 'lock1',
    clueId: 'bangle_pattern',
    ghost: '🎁',
    requires: ['bangle_pattern'],
  },
  {
    id: 'spot_clock',
    kind: 'spot',
    title: 'Read the 1889 dials',
    hint: 'Look up at Charminar’s clocks. Spot the evening chime time.',
    scene: 'square',
    encounterId: 'clock',
    spotId: 'clock_face',
    ghost: '◷',
    requires: ['invitation'],
  },
  {
    id: 'apply_clock',
    kind: 'apply',
    title: 'Set the clock cipher',
    hint: 'Apply the 4:45 sketch to Lock 2 on the Heirloom Box.',
    scene: 'courtyard',
    encounterId: 'heirloom',
    lockId: 'lock2',
    clueId: 'clock_face',
    ghost: '🎁',
    requires: ['clock_face'],
  },
  {
    id: 'follow_rafi',
    kind: 'story',
    title: 'Someone knows the way',
    hint: 'Find Rafi with his parcel in bangle lane.',
    scene: 'lane',
    encounterId: 'runner',
    ghost: '↗',
    requires: ['invitation'],
  },
  {
    id: 'spot_radio',
    kind: 'spot',
    title: 'Tune the magic eye',
    hint: 'At Salim’s radio shop, find the band where the eye peaks.',
    scene: 'lane',
    encounterId: 'radio',
    spotId: 'radio_band',
    ghost: '◈',
    requires: ['invitation'],
  },
  {
    id: 'apply_radio',
    kind: 'apply',
    title: 'Set the radio cipher',
    hint: 'Apply the 880 kHz note to Lock 3.',
    scene: 'courtyard',
    encounterId: 'heirloom',
    lockId: 'lock3',
    clueId: 'radio_band',
    ghost: '🎁',
    requires: ['radio_band'],
  },
  {
    id: 'enter_courtyard',
    kind: 'story',
    title: 'Through the green arch',
    hint: 'Step into the courtyard and give Amina the invitation.',
    scene: 'courtyard',
    encounterId: 'recipient',
    ghost: '❀',
    requires: ['invitation'],
  },
  {
    id: 'spot_crescent',
    kind: 'spot',
    title: 'Read the courtyard seal',
    hint: 'Study the brass crescent above the arch. Match the rubbing.',
    scene: 'courtyard',
    encounterId: 'seal',
    spotId: 'crescent_seal',
    ghost: '☽',
    requires: ['invitation'],
  },
  {
    id: 'apply_crescent',
    kind: 'apply',
    title: 'Set the crescent cipher',
    hint: 'Apply the right-opening crescent to Lock 4.',
    scene: 'courtyard',
    encounterId: 'heirloom',
    lockId: 'lock4',
    clueId: 'crescent_seal',
    ghost: '🎁',
    requires: ['crescent_seal'],
  },
  {
    id: 'reunion',
    kind: 'finale',
    title: 'One more place at the table',
    hint: 'Stay with Bashir’s chai. The box and the evening are yours.',
    scene: 'courtyard',
    encounterId: 'reunion',
    ghost: '☕',
    requires: ['invitation'],
  },
];

export function defaultCipherState() {
  return {
    version: 1,
    clues: [],
    spotted: [],
    applied: [],
    wrongTries: {},
    hintsUsed: 0,
    completedAt: null,
  };
}

export function restoreCipherState(raw) {
  const d = defaultCipherState();
  if (!raw) return d;
  try {
    const p = JSON.parse(raw);
    if (!p || typeof p !== 'object') return d;
    const clueIds = Object.keys(CLUES);
    const spotIds = Object.keys(SPOT_PUZZLES);
    return {
      version: 1,
      clues: Array.isArray(p.clues) ? [...new Set(p.clues.filter((id) => clueIds.includes(id)))] : [],
      spotted: Array.isArray(p.spotted) ? [...new Set(p.spotted.filter((id) => spotIds.includes(id)))] : [],
      applied: Array.isArray(p.applied)
        ? [...new Set(p.applied.filter((id) => ['lock1', 'lock2', 'lock3', 'lock4'].includes(id)))]
        : [],
      wrongTries: p.wrongTries && typeof p.wrongTries === 'object' ? { ...p.wrongTries } : {},
      hintsUsed: Math.min(3, Math.max(0, Number(p.hintsUsed) || 0)),
      completedAt: p.completedAt || null,
    };
  } catch {
    return d;
  }
}

export function saveCipherState(state) {
  try {
    localStorage.setItem(CIPHER_KEY, JSON.stringify(state));
  } catch {}
}

export function hasClue(state, clueId) {
  return state.clues.includes(clueId);
}

export function isSpotted(state, spotId) {
  return state.spotted.includes(spotId);
}

export function isApplied(state, lockId) {
  return state.applied.includes(lockId);
}

/** Collect a story clue (invitation) without a spot puzzle. */
export function collectClue(state, clueId) {
  if (!CLUES[clueId] || state.clues.includes(clueId)) return state;
  return { ...state, clues: [...state.clues, clueId] };
}

/**
 * Attempt a spot-puzzle option.
 * Wrong picks increment wrongTries (find-different style pressure, no hard fail).
 */
export function attemptSpot(state, spotId, optionId) {
  const puzzle = SPOT_PUZZLES[spotId];
  if (!puzzle) return { state, ok: false, feedback: 'That detail is not part of this evening.' };
  if (state.spotted.includes(spotId)) {
    return { state, ok: true, feedback: 'You already matched this detail.', already: true };
  }
  const option = puzzle.options.find((o) => o.id === optionId);
  if (!option) return { state, ok: false, feedback: 'Choose one of the details.' };
  if (!option.correct) {
    const wrongTries = {
      ...state.wrongTries,
      [spotId]: (state.wrongTries[spotId] || 0) + 1,
    };
    return {
      state: { ...state, wrongTries },
      ok: false,
      feedback: option.detail + ' Look again — the scrap is more particular.',
    };
  }
  const next = {
    ...state,
    spotted: [...state.spotted, spotId],
    clues: state.clues.includes(puzzle.clueId) ? state.clues : [...state.clues, puzzle.clueId],
  };
  return { state: next, ok: true, feedback: option.detail, clueId: puzzle.clueId };
}

/**
 * Apply a held clue to its heirloom lock (RidiculousToolbox: use item on hotspot).
 * Returns lock values that should be written into heirloom state.
 */
export function applyClueToLock(cipherState, lockId) {
  const clue = Object.values(CLUES).find((c) => c.appliesTo === lockId);
  if (!clue) return { state: cipherState, ok: false, feedback: 'No clue fits that lock.' };
  if (!cipherState.clues.includes(clue.id)) {
    return { state: cipherState, ok: false, feedback: 'You have not found that clue yet. Keep wandering.' };
  }
  if (cipherState.applied.includes(lockId)) {
    return { state: cipherState, ok: true, feedback: 'Already applied.', already: true, values: lockSolution(lockId) };
  }
  const next = { ...cipherState, applied: [...cipherState.applied, lockId] };
  return {
    state: next,
    ok: true,
    feedback: `Applied ${clue.name} to the lock.`,
    values: lockSolution(lockId),
    clueId: clue.id,
  };
}

export function lockSolution(lockId) {
  switch (lockId) {
    case 'lock1':
      return { lock1: ['green', 'red', 'green'] };
    case 'lock2':
      return { lock2: { hour: 4, minute: 45 } };
    case 'lock3':
      return { lock3: 880 };
    case 'lock4':
      return { lock4: 'right' };
    default:
      return {};
  }
}

export function chapterComplete(chapter, cipherState, memories, heirloomUnlocked) {
  switch (chapter.kind) {
    case 'story':
    case 'finale':
      return memories.includes(chapter.encounterId);
    case 'spot':
      return isSpotted(cipherState, chapter.spotId);
    case 'apply':
      return isApplied(cipherState, chapter.lockId) || !!heirloomUnlocked?.[chapter.lockId];
    default:
      return false;
  }
}

export function chapterAvailable(chapter, cipherState) {
  return chapter.requires.every((id) => cipherState.clues.includes(id) || cipherState.spotted.includes(id));
}

/**
 * Next incomplete available chapter for the objective HUD (PuzzleCraft-style target card).
 */
export function activeChapter(cipherState, memories, heirloomUnlocked = {}) {
  for (const chapter of CHAPTERS) {
    if (!chapterAvailable(chapter, cipherState)) continue;
    if (!chapterComplete(chapter, cipherState, memories, heirloomUnlocked)) return chapter;
  }
  return null;
}

export function cipherProgress(cipherState, memories, heirloomUnlocked = {}) {
  const total = CHAPTERS.length;
  const done = CHAPTERS.filter((c) => chapterComplete(c, cipherState, memories, heirloomUnlocked)).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export function isCipherComplete(cipherState, memories, heirloomUnlocked = {}) {
  return CHAPTERS.every((c) => chapterComplete(c, cipherState, memories, heirloomUnlocked));
}

/** Soft global hint ladder (max 3), PuzzleCraft-style. */
export function nextCipherHint(cipherState, memories, heirloomUnlocked = {}) {
  const chapter = activeChapter(cipherState, memories, heirloomUnlocked);
  if (!chapter) return { text: 'The evening is complete. Wander as you like.', exhausted: true };
  const level = cipherState.hintsUsed;
  if (level <= 0) return { text: chapter.hint, chapter, tier: 1 };
  if (level === 1) {
    const spot = chapter.spotId ? SPOT_PUZZLES[chapter.spotId] : null;
    return { text: spot?.ghostHint || `Travel to ${chapter.scene} and look for the marked encounter.`, chapter, tier: 2 };
  }
  return {
    text: chapter.kind === 'apply'
      ? `Open the Heirloom Box → select ${chapter.lockId.replace('lock', 'Lock ')} → Apply clue.`
      : `Tap encounter “${chapter.encounterId}” in ${chapter.scene}.`,
    chapter,
    tier: 3,
    exhausted: level >= 3,
  };
}

export function useCipherHint(state) {
  if (state.hintsUsed >= 3) return state;
  return { ...state, hintsUsed: state.hintsUsed + 1 };
}

export function spotPuzzleForEncounter(encounterId) {
  return Object.values(SPOT_PUZZLES).find((p) => p.encounterId === encounterId) || null;
}

export function markCipherFinished(state) {
  if (state.completedAt) return state;
  return { ...state, completedAt: new Date().toISOString() };
}

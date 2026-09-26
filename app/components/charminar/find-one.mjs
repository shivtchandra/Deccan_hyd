/** Spot one neighbour on the Charminar street — Old City evening, not a Waldo clone. */

export const FIND_KEY = 'dhm_neighbour_v1';

/**
 * The evening asks you to recognise one person who belongs to this street.
 * Portrait from game-residents.png (4×3). Look 4 = teal sari, silver hair.
 */
export const FIND = {
  id: 'courtyard-neighbour',
  personId: 'neighbour-amina',
  look: 4,
  name: 'Amina',
  title: 'A face from the courtyard',
  paper: 'Bashir left a scrap at the chai counter.',
  clue: 'Teal sari · silver hair · grain for the pigeons',
  hint: 'She is not behind a stall. Walk the street until a neighbour matches the scrap.',
  softHints: [
    'She keeps to quieter corners — past the loudest of the bazaar.',
    'East of the radio shop, where the street opens into another square.',
    'She is marked for a moment. Walk close and tap her.',
  ],
  point: { x: 5520, y: 1045 },
  atlas: { cols: 4, rows: 3, src: '/charminar/game-residents.png' },
};

export function restoreFind(raw) {
  try {
    const v = JSON.parse(raw);
    return {
      found: Boolean(v?.found),
      hintsUsed: Number.isInteger(v?.hintsUsed) ? Math.min(3, Math.max(0, v.hintsUsed)) : 0,
      misses: Number.isInteger(v?.misses) ? Math.max(0, v.misses) : 0,
    };
  } catch {
    return { found: false, hintsUsed: 0, misses: 0 };
  }
}

export function saveFind(state) {
  try {
    localStorage.setItem(FIND_KEY, JSON.stringify(state));
  } catch {}
}

export function tryFindPerson(state, personId) {
  if (state.found) {
    return { state, ok: true, feedback: 'You already recognised her. The street is still yours.' };
  }
  if (personId === FIND.personId) {
    return {
      state: { ...state, found: true },
      ok: true,
      feedback: 'Yes — the scrap matches. Teal sari, silver hair, a handful of grain. Amina nods as if she has been expecting you.',
    };
  }
  return {
    state: { ...state, misses: state.misses + 1 },
    ok: false,
    feedback: 'A neighbour, but not the one on the scrap. Keep walking.',
  };
}

export function useFindHint(state) {
  if (state.found || state.hintsUsed >= 3) return state;
  return { ...state, hintsUsed: state.hintsUsed + 1 };
}

export function portraitStyle() {
  const { cols, rows, src } = FIND.atlas;
  const col = FIND.look % cols;
  const row = Math.floor(FIND.look / cols);
  return {
    backgroundImage: `url(${src})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${(col / Math.max(1, cols - 1)) * 100}% ${(row / Math.max(1, rows - 1)) * 100}%`,
  };
}

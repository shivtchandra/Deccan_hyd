// app/components/charminar/heirloom-mystery.mjs
// Core state model, validation, clues, and 3-tier progressive hints
// for "The Nizam's Lost Heirloom Box" puzzle adventure.

export const HEIRLOOM_STORAGE_KEY = 'dhm_heirloom_box_v1';

export const BANGLE_COLORS = ['green', 'red', 'blue', 'gold'];

export const LOCK_DEFINITIONS = {
  lock1: {
    id: 'lock1',
    name: 'Laad Bazaar Lacquer Rings',
    subtitle: 'Concentric Bangle Cipher',
    target: ['green', 'red', 'green'], // Outer, Middle, Inner
    hint1: 'A paper scrap was dropped near the steaming samovar at the chai bench.',
    hint2: 'Visit Zehra at the bangle stall and compare the velvet display boards.',
    hint3: 'The secret royal sequence is Emerald GREEN (outer), Pomegranate RED (middle), and Emerald GREEN (inner).',
    fact: 'Laad Bazaar has crafted lac (lacquer) and glass bangles since the founding of Hyderabad in 1591, using natural resin harvested from palas trees.',
  },
  lock2: {
    id: 'lock2',
    name: 'Charminar 1889 Clock Dial',
    subtitle: 'Architectural Timepiece',
    targetHour: 4,
    targetMinute: 45, // 4:45 PM
    hint1: 'Charminar’s four giant clocks look out across the four cardinal roads.',
    hint2: 'Salim at the radio shop keeps a repair ledger recording the evening broadcast schedule.',
    hint3: 'Set the hour hand to 4 and the minute hand to 9 (4:45 PM — the start of the evening bazaar).',
    fact: 'The four clock faces of Charminar were ordered from Vulliamy & Co. of London and installed in 1889 during the reign of Nizam VI Mir Mahbub Ali Khan.',
  },
  lock3: {
    id: 'lock3',
    name: 'Vintage Radio Tuner',
    subtitle: 'Akashvani Frequency',
    targetFrequency: 880, // 880 kHz (Hyderabad A station)
    tolerance: 15, // 865 - 895 kHz
    hint1: 'Salim’s radio shop hums with evening ghazals and Deccani melodies.',
    hint2: 'Rafi was carrying a parcel addressed with a transmission band for Hyderabad A.',
    hint3: 'Slide the tuning dial to 880 kHz until the green tuning eye glows brightest.',
    fact: 'Hyderabad was one of the earliest princely states with its own broadcasting service, Deccan Radio, established in 1933 before merging into All India Radio.',
  },
  lock4: {
    id: 'lock4',
    name: 'Royal Crescent Seal',
    subtitle: 'Asaf Jahi Medallion',
    targetOrientation: 'right', // Crescent opens to the right (90 deg)
    hint1: 'Delivery crates in the narrow alley between the repair shops carry shipping stamps.',
    hint2: 'A crescent moon that opens to the right marks the family that once owned this box.',
    hint3: 'Rotate the brass medallion so the crescent horns open towards the right (90° east).',
    fact: 'The crescent moon and sunburst cartouche was an imperial emblem seen across royal Asaf Jahi firmans, coins (Hali Sicca), and architecture.',
  },
};

export function defaultHeirloomState() {
  return {
    version: 1,
    unlocked: {
      lock1: false,
      lock2: false,
      lock3: false,
      lock4: false,
    },
    values: {
      lock1: ['red', 'green', 'gold'], // initial scrambled state
      lock2: { hour: 12, minute: 0 },
      lock3: 1100, // 1100 kHz
      lock4: 'up', // 'up' | 'right' | 'down' | 'left'
    },
    hintsUsed: {
      lock1: 0,
      lock2: 0,
      lock3: 0,
      lock4: 0,
    },
    cluesFound: [],
    completedAt: null,
  };
}

export function restoreHeirloomState(raw) {
  const d = defaultHeirloomState();
  if (!raw) return d;
  try {
    const p = JSON.parse(raw);
    if (!p || typeof p !== 'object') return d;
    return {
      version: 1,
      unlocked: {
        lock1: !!p.unlocked?.lock1,
        lock2: !!p.unlocked?.lock2,
        lock3: !!p.unlocked?.lock3,
        lock4: !!p.unlocked?.lock4,
      },
      values: {
        lock1: Array.isArray(p.values?.lock1) && p.values.lock1.length === 3 ? p.values.lock1 : d.values.lock1,
        lock2: {
          hour: Number.isInteger(p.values?.lock2?.hour) ? p.values.lock2.hour : 12,
          minute: Number.isInteger(p.values?.lock2?.minute) ? p.values.lock2.minute : 0,
        },
        lock3: typeof p.values?.lock3 === 'number' ? p.values.lock3 : d.values.lock3,
        lock4: ['up', 'right', 'down', 'left'].includes(p.values?.lock4) ? p.values.lock4 : d.values.lock4,
      },
      hintsUsed: {
        lock1: Math.min(3, Math.max(0, p.hintsUsed?.lock1 || 0)),
        lock2: Math.min(3, Math.max(0, p.hintsUsed?.lock2 || 0)),
        lock3: Math.min(3, Math.max(0, p.hintsUsed?.lock3 || 0)),
        lock4: Math.min(3, Math.max(0, p.hintsUsed?.lock4 || 0)),
      },
      cluesFound: Array.isArray(p.cluesFound) ? p.cluesFound : [],
      completedAt: p.completedAt || null,
    };
  } catch {
    return d;
  }
}

export function saveHeirloomState(state) {
  try {
    localStorage.setItem(HEIRLOOM_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function checkLock1(values) {
  const t = LOCK_DEFINITIONS.lock1.target;
  return values[0] === t[0] && values[1] === t[1] && values[2] === t[2];
}

export function checkLock2(values) {
  const def = LOCK_DEFINITIONS.lock2;
  return values.hour === def.targetHour && values.minute === def.targetMinute;
}

export function checkLock3(freq) {
  const def = LOCK_DEFINITIONS.lock3;
  return Math.abs(freq - def.targetFrequency) <= def.tolerance;
}

export function checkLock4(orientation) {
  return orientation === LOCK_DEFINITIONS.lock4.targetOrientation;
}

export function countUnlocked(unlocked) {
  return Object.values(unlocked).filter(Boolean).length;
}

export function isBoxFullyUnlocked(unlocked) {
  return unlocked.lock1 && unlocked.lock2 && unlocked.lock3 && unlocked.lock4;
}

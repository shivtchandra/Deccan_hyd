"use client";

// Zero-wall identity. Firebase Anonymous Auth gives every device a stable,
// server-verifiable uid without a sign-up screen. The display name is a local
// nicety; the uid is the real key.
//
// NOTE: Anonymous sign-in must be enabled once in the Firebase console
// (Authentication -> Sign-in method -> Anonymous). Until then ensureUser()
// resolves to null and the app stays in local-only mode.

import { getFirebaseAuth } from "./firebase.js";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

const NAME_KEY = "dhm-name-v1";

let userPromise = null;

export function ensureUser() {
  if (userPromise) return userPromise;
  const auth = getFirebaseAuth();
  if (!auth) {
    userPromise = Promise.resolve(null);
    return userPromise;
  }
  userPromise = new Promise((resolve) => {
    let settled = false;
    const done = (u) => {
      if (!settled) {
        settled = true;
        resolve(u);
      }
    };
    try {
      const unsub = onAuthStateChanged(
        auth,
        (u) => {
          if (u) {
            unsub();
            done(u);
          }
        },
        () => done(null)
      );
      signInAnonymously(auth).catch(() => done(null));
      setTimeout(() => done(null), 6000);
    } catch {
      done(null);
    }
  });
  return userPromise;
}

const LOCAL_UID_KEY = "dhm-local-uid-v1";

export function getLocalDeviceId() {
  if (typeof window === "undefined") return "local-device";
  try {
    let id = localStorage.getItem(LOCAL_UID_KEY);
    if (!id) {
      id = "local-" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem(LOCAL_UID_KEY, id);
    }
    return id;
  } catch {
    return "local-session";
  }
}

export async function getIdToken() {
  const u = await ensureUser();
  if (u) {
    try {
      const t = await u.getIdToken();
      if (t) return t;
    } catch {
      /* fallback below */
    }
  }
  return `local:${getLocalDeviceId()}`;
}

export async function getUid() {
  const u = await ensureUser();
  if (u?.uid) return u.uid;
  return getLocalDeviceId();
}

export function getName() {
  try {
    return localStorage.getItem(NAME_KEY) || "";
  } catch {
    return "";
  }
}

export function setName(name) {
  const clean = (name || "").trim().slice(0, 24);
  try {
    localStorage.setItem(NAME_KEY, clean);
  } catch {
    /* private mode — name is session-only */
  }
  return clean;
}

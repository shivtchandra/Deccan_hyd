"use client";

// Zero-wall identity. Firebase Anonymous Auth gives every device a stable,
// server-verifiable uid without a sign-up screen. The display name is a local
// nicety; the uid is the real key.
//
// NOTE: Anonymous sign-in must be enabled once in the Firebase console
// (Authentication -> Sign-in method -> Anonymous). Until then ensureUser()
// resolves to null and the app stays in local-only mode.

import { auth } from "./firebase.js";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

const NAME_KEY = "dhm-name-v1";

let userPromise = null;

export function ensureUser() {
  if (userPromise) return userPromise;
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

export async function getIdToken() {
  const u = await ensureUser();
  if (!u) return null;
  try {
    return await u.getIdToken();
  } catch {
    return null;
  }
}

export async function getUid() {
  const u = await ensureUser();
  return u?.uid ?? null;
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

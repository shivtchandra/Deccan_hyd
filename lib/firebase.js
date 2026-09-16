"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const configured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let _app = null;
let _db = null;
let _auth = null;

export function getFirebaseApp() {
  if (!configured) return null;
  if (!_app) {
    try {
      _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    } catch {
      _app = null;
    }
  }
  return _app;
}

export function getFirebaseAuth() {
  if (!_auth) {
    const a = getFirebaseApp();
    if (a) {
      try {
        _auth = getAuth(a);
      } catch {
        _auth = null;
      }
    }
  }
  return _auth;
}

export function getFirebaseDb() {
  if (!_db) {
    const a = getFirebaseApp();
    if (a) {
      try {
        _db = getFirestore(a);
      } catch {
        _db = null;
      }
    }
  }
  return _db;
}

// Backward-compatible getters
export const db = {
  get instance() { return getFirebaseDb(); }
};
export const auth = {
  get instance() { return getFirebaseAuth(); }
};

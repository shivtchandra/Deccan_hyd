let cachedApp = null;

async function getApp() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) return null;
  const { initializeApp, getApps, cert } = await import("firebase-admin/app");
  if (!cachedApp) {
    cachedApp = getApps().length
      ? getApps()[0]
      : initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  }
  return cachedApp;
}

export async function getAdminDb() {
  const app = await getApp();
  if (!app) return null;
  const { getFirestore } = await import("firebase-admin/firestore");
  return getFirestore(app);
}

// Cloud Storage bucket for uploaded photos, or null when Firebase/bucket isn't configured.
export async function getAdminBucket() {
  const app = await getApp();
  const name = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!app || !name) return null;
  const { getStorage } = await import("firebase-admin/storage");
  return getStorage(app).bucket(name);
}

// Verifies a client's Firebase ID token and returns its uid, or null.
// A raw uid in the request body could be forged; a signed token cannot.
export async function verifyUid(idToken) {
  const app = await getApp();
  if (!app || !idToken) return null;
  try {
    const { getAuth } = await import("firebase-admin/auth");
    const decoded = await getAuth(app).verifyIdToken(idToken);
    return decoded.uid;
  } catch {
    return null;
  }
}

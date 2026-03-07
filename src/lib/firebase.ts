import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredFirebaseConfigKeys: Array<keyof typeof firebaseConfig> = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

const missingFirebaseConfigKeys = requiredFirebaseConfigKeys.filter((k) => {
  const value = firebaseConfig[k];
  return typeof value !== "string" || value.trim().length === 0 || value.includes("your_actual_");
});

if (missingFirebaseConfigKeys.length > 0) {
  throw new Error(
    `Missing Firebase config env vars: ${missingFirebaseConfigKeys
      .map((k) => `VITE_FIREBASE_${String(k).toUpperCase()}`)
      .join(", ")}. Create a .env.local file in the project root with your Firebase Web App config values.`
  );
}

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const analyticsPromise = isSupported().then((supported) => {
  if (!supported) return null;
  return getAnalytics(app);
});

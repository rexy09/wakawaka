import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Env from "./env";

const firebaseConfig = {
  apiKey: Env.FIREBASE_API_KEY,
  authDomain: "daywaka-768aa.firebaseapp.com",
  projectId: "daywaka-768aa",
  storageBucket: "daywaka-768aa.firebasestorage.app",
  messagingSenderId: "476064351728",
  appId: "1:476064351728:web:cbf66db67d2ee925380935",
  measurementId: "G-HWQR5JX8KC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth = getAuth(app);

// Set auth persistence to LOCAL (persists until explicit sign out)
setPersistence(auth, browserLocalPersistence);

// Messaging service
export const messaging = getMessaging(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const storage = getStorage(app);
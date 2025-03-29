import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCxTYSm_mXBuwOJ7mFxpR5k8HO1i2BrD5w",
  authDomain: "thinking-digit-368121.firebaseapp.com",
  projectId: "thinking-digit-368121",
  storageBucket: "thinking-digit-368121.appspot.com",
  messagingSenderId: "872224361329",
  appId: "1:872224361329:web:8fb83a40fc8ae9a689c4d0",
  measurementId: "G-E6Y0P339GJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Messaging service
export const messaging = getMessaging(app);

// Initialize Firebase
// const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
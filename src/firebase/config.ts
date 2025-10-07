import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCufYxGje83hdeWpOmaFczzgQO4sAQBhXs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "qg-workship.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "qg-workship",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "qg-workship.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "893794036853",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:893794036853:web:2774e757369e17c8a3dc3c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

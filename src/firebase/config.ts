import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCufYxGje83hdeWpOmaFczzgQO4sAQBhXs",
  authDomain: "qg-workship.firebaseapp.com",
  projectId: "qg-workship",
  storageBucket: "qg-workship.firebasestorage.app",
  messagingSenderId: "893794036853",
  appId: "1:893794036853:web:2774e757369e17c8a3dc3c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

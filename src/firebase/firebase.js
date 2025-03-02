import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "approvd-10fe6.firebaseapp.com",
  projectId: "approvd-10fe6",
  storageBucket: "approvd-10fe6.firebasestorage.app",
  messagingSenderId: "966406405774",
  appId: "1:966406405774:web:fceb6bca9929003f9c53df",
  measurementId: "G-5P82LVR48X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db };

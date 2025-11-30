// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // if using Firestore
import { getAuth } from "firebase/auth"; // if using Authentication
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB5YM-KTxjui1g3GCMupChosXDbBw81gJ8",
  authDomain: "projecxhub.firebaseapp.com",
  projectId: "projecxhub",
  storageBucket: "projecxhub.firebasestorage.app",
  messagingSenderId: "605775044411",
  appId: "1:605775044411:web:b73c578c38c6e38ae2a11e",
  measurementId: "G-H1QBLQ6K1Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firebase services you plan to use
const db = getFirestore(app);
const auth = getAuth(app);
export { app, analytics, auth, db };


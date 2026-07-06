import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjPvBT3v0ZIedvknnRzzknUriD776jyXQ",
  authDomain: "smarthostel-cc625.firebaseapp.com",
  projectId: "smarthostel-cc625",
  storageBucket: "smarthostel-cc625.firebasestorage.app",
  messagingSenderId: "473787641631",
  appId: "1:473787641631:web:e0600b939da296cf020a2a",
  measurementId: "G-85VXK5W6F3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Expose to window so other non-module scripts can use them
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseAPI = {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCWzXtvhC_IxgNvY5-C_xaZankyJP9zQsw",
  authDomain: "smarthostel-815f1.firebaseapp.com",
  projectId: "smarthostel-815f1",
  storageBucket: "smarthostel-815f1.firebasestorage.app",
  messagingSenderId: "965348831983",
  appId: "1:965348831983:web:ce66aac514918b7b28a11a",
  measurementId: "G-VRD1FZJQZC"
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

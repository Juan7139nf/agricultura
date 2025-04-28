// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  databaseURL: "https://agricultura-eac73-default-rtdb.firebaseio.com",
  apiKey: "AIzaSyBUNKSgYPMY-6K3bSQWtTFM6uyzSr4jD6A",
  authDomain: "agricultura-eac73.firebaseapp.com",
  projectId: "agricultura-eac73",
  storageBucket: "agricultura-eac73.firebasestorage.app",
  messagingSenderId: "1012324908629",
  appId: "1:1012324908629:web:f4af055a0862ba840b5edc",
  measurementId: "G-N7328YL8RZ",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

export { auth, provider, database };

/*


// src/firebase.jsx
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Configuración de Firebase (obtén estos valores desde la consola de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyDcS0j7bmiK7S6GeH2W63yVTWpFYrqKbPM",
  authDomain: "pruebaagro.firebaseapp.com",
  projectId: "pruebaagro",
  storageBucket: "pruebaagro.firebasestorage.app",
  messagingSenderId: "371296543565",
  appId: "1:371296543565:web:eff861cc3202f3784ccd04"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene las referencias a Firestore, Firebase Authentication y Firebase Database
const db = getDatabase(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Exporta las configuraciones
export { db, auth, provider };

*/
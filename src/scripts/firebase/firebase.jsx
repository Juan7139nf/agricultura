
// src/firebase.jsx
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
//import { getDatabase } from "firebase/database";
//import { getFirestore } from "firebase/firestore"; // <-- usa Firestore

import { getDatabase, ref, onValue, push, set } from "firebase/database";  

// Configuración de Firebase (obtén estos valores desde la consola de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyBUNKSgYPMY-6K3bSQWtTFM6uyzSr4jD6A",
  authDomain: "agricultura-eac73.firebaseapp.com",
  databaseURL: "https://agricultura-eac73-default-rtdb.firebaseio.com",
  projectId: "agricultura-eac73",
  storageBucket: "agricultura-eac73.firebasestorage.app",
  messagingSenderId: "1012324908629",
  appId: "1:1012324908629:web:f4af055a0862ba840b5edc",
  measurementId: "G-N7328YL8RZ"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene las referencias a Firestore, Firebase Authentication y Firebase Database
 const database = getDatabase(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
//const database = getDatabase(app);
//const database = getFirestore(app); // <-- cambia esto
export { auth, provider };
export { database, ref, onValue, push, set };



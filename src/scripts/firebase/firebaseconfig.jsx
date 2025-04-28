/*
// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración de Firebase (Obtén esto desde la consola de Firebase)
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-project-id.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-project-id.appspot.com",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene la referencia a Firestore
const db = getFirestore(app);

// Obtiene la referencia a Firebase Authentication
const auth = getAuth(app);

export { db, auth };

// src/firebase.jsx (o el archivo donde ejecutarás la lógica)

// Importar Firebase y Firestore
import { db, auth } from './firebaseconfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Función para registrar un usuario con rol
const registrarUsuario = async (email, password, rol, nombre) => {
  try {
    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guardar el usuario y su rol en Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      email: user.email,
      rol: rol,
      nombre: nombre,
      productos: [],  // Inicialmente, sin productos
    });

    console.log("Usuario registrado correctamente:", user.email);
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
  }
};

// Crear tres clientes
registrarUsuario("cliente1@example.com", "password123", "cliente", "Cliente 1");
registrarUsuario("cliente2@example.com", "password123", "cliente", "Cliente 2");
registrarUsuario("cliente3@example.com", "password123", "cliente", "Cliente 3");

// Crear tres productores
registrarUsuario("productor1@example.com", "password123", "productor", "Productor 1");
registrarUsuario("productor2@example.com", "password123", "productor", "Productor 2");
registrarUsuario("productor3@example.com", "password123", "productor", "Productor 3");

// Crear tres comerciantes
registrarUsuario("comerciante1@example.com", "password123", "comerciante", "Comerciante 1");
registrarUsuario("comerciante2@example.com", "password123", "comerciante", "Comerciante 2");
registrarUsuario("comerciante3@example.com", "password123", "comerciante", "Comerciante 3");

// Crear un administrador
registrarUsuario("admin@example.com", "admin123", "admin", "Administrador");

// Función para agregar productos a los productores o comerciantes
const agregarProducto = async (userId, producto) => {
  try {
    const productorRef = doc(db, "usuarios", userId);
    await updateDoc(productorRef, {
      productos: arrayUnion(producto),
    });
    console.log("Producto agregado correctamente");
  } catch (error) {
    console.error("Error al agregar producto:", error.message);
  }
};

// Ejemplo: Agregar productos a un productor
agregarProducto("productor1_uid", {
  nombre: "Tomate",
  descripcion: "Tomate orgánico",
  precio: 10,
});

// Función para crear eventos
const crearEvento = async (nombre, descripcion, fecha) => {
  try {
    const docRef = await addDoc(collection(db, "eventos"), {
      nombre: nombre,
      descripcion: descripcion,
      fecha: fecha,
    });
    console.log("Evento creado con ID: ", docRef.id);
  } catch (e) {
    console.error("Error al crear evento: ", e);
  }
};

// Crear tres eventos
crearEvento("Evento 1", "Descripción del evento 1", "2025-05-01");
crearEvento("Evento 2", "Descripción del evento 2", "2025-06-01");
crearEvento("Evento 3", "Descripción del evento 3", "2025-07-01");
export { db, auth };

// src/firebaseConfig.jsx
import { db, auth, provider } from './firebase';  // Importa las configuraciones desde firebase.jsx
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { addDoc, collection } from 'firebase/firestore';

// Función para registrar un usuario con rol
const registrarUsuario = async (email, password, rol, nombre) => {
  try {
    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guardar el usuario y su rol en Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      email: user.email,
      rol: rol,
      nombre: nombre,
      productos: [],  // Inicialmente, sin productos
    });

    console.log("Usuario registrado correctamente:", user.email);
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
  }
};

// Crear tres clientes
registrarUsuario("cliente1@example.com", "password123", "cliente", "Cliente 1");
registrarUsuario("cliente2@example.com", "password123", "cliente", "Cliente 2");
registrarUsuario("cliente3@example.com", "password123", "cliente", "Cliente 3");

// Crear tres productores
registrarUsuario("productor1@example.com", "password123", "productor", "Productor 1");
registrarUsuario("productor2@example.com", "password123", "productor", "Productor 2");
registrarUsuario("productor3@example.com", "password123", "productor", "Productor 3");

// Crear tres comerciantes
registrarUsuario("comerciante1@example.com", "password123", "comerciante", "Comerciante 1");
registrarUsuario("comerciante2@example.com", "password123", "comerciante", "Comerciante 2");
registrarUsuario("comerciante3@example.com", "password123", "comerciante", "Comerciante 3");

// Crear un administrador
registrarUsuario("admin@example.com", "admin123", "admin", "Administrador");

// Función para agregar productos a los productores o comerciantes
const agregarProducto = async (userId, producto) => {
  try {
    const productorRef = doc(db, "usuarios", userId);
    await updateDoc(productorRef, {
      productos: arrayUnion(producto),
    });
    console.log("Producto agregado correctamente");
  } catch (error) {
    console.error("Error al agregar producto:", error.message);
  }
};

// Ejemplo: Agregar productos a un productor
agregarProducto("productor1_uid", {
  nombre: "Tomate",
  descripcion: "Tomate orgánico",
  precio: 10,
});

// Función para crear eventos
const crearEvento = async (nombre, descripcion, fecha) => {
  try {
    const docRef = await addDoc(collection(db, "eventos"), {
      nombre: nombre,
      descripcion: descripcion,
      fecha: fecha,
    });
    console.log("Evento creado con ID: ", docRef.id);
  } catch (e) {
    console.error("Error al crear evento: ", e);
  }
};

// Crear tres eventos
crearEvento("Evento 1", "Descripción del evento 1", "2025-05-01");
crearEvento("Evento 2", "Descripción del evento 2", "2025-06-01");
crearEvento("Evento 3", "Descripción del evento 3", "2025-07-01");

export { db, auth, provider };
*/
import { ref, get } from "firebase/database"; 
import { database } from "../firebase/firebase";

const obtenerUsuarioDeLocalStorage = () => {
  const usuario = localStorage.getItem("user");
  return usuario ? JSON.parse(usuario) : null;
};

const obtenerUsuarioDesdeFirebase = async (uid) => {
  const userRef = ref(database, `usuarios/${uid}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

export { obtenerUsuarioDeLocalStorage, obtenerUsuarioDesdeFirebase };

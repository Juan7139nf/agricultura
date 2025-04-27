import React, { useEffect, useState } from "react";
import { database } from "../../scripts/firebase/firebase";
import { ref, onValue } from "firebase/database";

export function ProductorProductos() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Ruta a los usuarios
    const usuariosRef = ref(database, 'usuarios/');

    // Escucha en tiempo real los cambios en los datos
    const unsubscribe = onValue(usuariosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convierte el objeto a un arreglo
        const usuariosArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        setUsuarios(usuariosArray);
      } else {
        console.log("No hay datos disponibles");
      }
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      {usuarios.length > 0 ? (
        <ul>
          {usuarios.map((usuario) => (
            <li key={usuario.id}>
              {usuario.nombre} - {usuario.edad}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay usuarios registrados.</p>
      )}
    </div>
  );
}

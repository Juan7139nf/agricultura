import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { database } from "../../scripts/firebase/firebase";
import { NavLink } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditProfileModal from "./editProfileModal";
import { Button } from "react-bootstrap";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Para almacenar el usuario autenticado
  const [showModal, setShowModal] = useState(false);

  // Obtener el usuario autenticado
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Guardamos el usuario autenticado en el estado
      } else {
        setUser(null); // Si no hay usuario, lo establecemos en null
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  // Obtener los datos del usuario y los pedidos después de que el usuario esté autenticado
  useEffect(() => {
    if (user) {
      // Obtener datos del perfil del usuario
      const usuarioRef = ref(database, `usuarios/${user.uid}`);
      get(usuarioRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setUsuario(snapshot.val());
          } else {
            setError("No se encontró el usuario");
          }
        })
        .catch((error) => {
          setError("Error al obtener el usuario: " + error.message);
        });

      // Obtener los pedidos
      const pedidosRef = ref(database, "pedidos");
      get(pedidosRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const pedidosData = snapshot.val();

            // Usar Object.entries para obtener tanto las claves (ID) como los valores
            const pedidosFiltrados = Object.entries(pedidosData)
              .filter(([id, pedido]) => pedido.clientUid === user.uid)
              .map(([id, pedido]) => ({
                id, // Aquí se guarda el ID del pedido
                ...pedido, // Los demás datos del pedido
              }));

            setPedidos(pedidosFiltrados);
          } else {
            setError("No se encontraron pedidos");
          }
        })
        .catch((error) => {
          setError("Error al obtener los pedidos: " + error.message);
        });
    }
  }, [user]); // Dependencia en user para ejecutar el código solo cuando el usuario esté disponible

  return (
    <div className="container py-5">
      {error && <p className="text-danger">{error}</p>}

      {usuario && (
        <div>
          <div className="w-100 d-flex align-items-center">
            <div className="">
              <img
                src={usuario.photoURL}
                alt=""
                width={100}
                className="rounded-circle"
              />
            </div>
            <div className="ms-3">
              <h3 className="fw-bolder fs-3">{usuario.displayName}</h3>
              <div className="fs-5 text-break">
                <b>Email: </b>
                <span>{usuario.email}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowModal(true)}>Editar perfil</Button>

          <EditProfileModal
            show={showModal}
            onHide={() => setShowModal(false)}
            userData={usuario}
            onUpdate={(updatedUser) => {
              setUserData(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
            }}
          />
        </div>
      )}

      <h3 className="pt-5">Pedidos</h3>
      {pedidos.length > 0 ? (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Ver</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido, index) => (
                <tr key={index}>
                  <td className="text-nowrap">{pedido.id}</td>
                  <td className="text-nowrap">{pedido.fecha}</td>
                  <td className="text-nowrap">{pedido.total.toFixed(2)} Bs</td>
                  <td className="text-nowrap">
                    <span
                      className={`badge bg-${
                        pedido.estado === "completado" ? "primary" : "warning"
                      } text-light`}
                    >
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="text-nowrap">
                    <NavLink
                      to={`/pedido/${pedido.id}`}
                      className="btn btn-success p-0 px-2 d-flex"
                    >
                      <VisibilityIcon />
                      <div className="ms-1">Ver Detalle</div>
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No tienes pedidos.</p>
      )}
    </div>
  );
};

export default Perfil;

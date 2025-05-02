"use client";

import { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../../scripts/firebase/firebase";
import { AdminNav } from "../../scripts/components/adminNav";

export default function GestionProductores() {
  const [productores, setProductores] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [rolSeleccionado, setRolSeleccionado] = useState("todos");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nuevosRoles, setNuevosRoles] = useState([]);

  useEffect(() => {
    const usuariosRef = ref(database, "usuarios");

    const unsubscribe = onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaUsuarios = Object.entries(data).map(([id, usuario]) => ({
          id,
          ...usuario,
        }));
        setProductores(listaUsuarios);
      }
    });

    return () => unsubscribe();
  }, []);

  const elementosPorPagina = 10;

  const productoresFiltrados = productores
    .filter(
      (productor) =>
        productor.displayName
          ?.toLowerCase()
          .includes(terminoBusqueda.toLowerCase()) ||
        productor.email?.toLowerCase().includes(terminoBusqueda.toLowerCase())
    )
    .filter((productor) =>
      rolSeleccionado === "todos"
        ? true
        : productor.roles?.includes(rolSeleccionado)
    );

  const totalPaginas = Math.ceil(
    productoresFiltrados.length / elementosPorPagina
  );
  const productoresPaginados = productoresFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const manejarActualizacionRoles = async (usuarioId) => {
    try {
      if (!usuarioId) {
        console.error("ID de usuario no válido");
        alert("Error: ID de usuario no válido");
        return;
      }

      const usuarioRef = ref(database, `usuarios/${usuarioId}`);

      await update(usuarioRef, {
        roles: nuevosRoles,
      });

      setProductores((prev) =>
        prev.map((prod) =>
          prod.id === usuarioId ? { ...prod, roles: [...nuevosRoles] } : prod
        )
      );

      alert("Roles actualizados con éxito");
      setUsuarioEditando(null);
    } catch (error) {
      console.error("Error al actualizar roles:", error);
      alert("Error al actualizar los roles: " + error.message);
    }
  };

  return (
    <div className="container-md">
      <div className="row">
        <div className="col-lg-3 col-md-4 col-12 border-end">
          <AdminNav />
        </div>

        <div className="col-lg-9 col-md-8 col-12 py-4 p-md-5 p-lg-6">
          <h1 className="mb-4">Gestión de Usuarios</h1>

          <div className="card p-4 shadow-sm rounded-4 mb-5">
            <input
              className="form-control mb-3"
              type="text"
              placeholder="Buscar productores..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>

          <div className="mb-4">
            {["todos", "cliente", "comerciante", "productor"].map((rol) => (
              <button
                key={rol}
                className={`btn ${
                  rolSeleccionado === rol
                    ? "btn-primary"
                    : "btn-outline-primary"
                } me-2`}
                onClick={() => setRolSeleccionado(rol)}
              >
                {rol.charAt(0).toUpperCase() + rol.slice(1)}
              </button>
            ))}
          </div>

          <div className="row">
            {productoresPaginados.map((prod, idx) => (
              <div key={idx} className="col-md-6 mb-4">
                <div className="card p-3 shadow-sm rounded-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <img
                        src={prod.photoURL || "/placeholder.svg"}
                        alt="avatar"
                        width={40}
                        className="rounded-circle"
                      />
                      <div className="ms-3">
                        <strong>{prod.displayName || "Sin nombre"}</strong>
                        <div>{prod.email}</div>
                        <div className="mt-1">
                          {prod.roles?.map((rol, i) => (
                            <span key={i} className="badge bg-primary me-1">
                              {rol}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-light"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        ⋮
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() =>
                              alert(`Ver perfil de ${prod.displayName}`)
                            }
                          >
                            Ver perfil
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              setUsuarioEditando(prod);
                              setNuevosRoles(prod.roles || []);
                            }}
                          >
                            Editar roles
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de edición de roles */}
          {usuarioEditando && (
            <div
              className="modal fade show"
              tabIndex="-1"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Editar Roles de {usuarioEditando.displayName}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setUsuarioEditando(null);
                        setNuevosRoles([]);
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>ID: {usuarioEditando.id}</p>
                    {["cliente", "comerciante", "productor", "administrador"].map((rol) => (
                      <div className="form-check" key={rol}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`rol-${rol}`}
                          checked={nuevosRoles.includes(rol)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNuevosRoles((prev) => [...prev, rol]);
                            } else {
                              setNuevosRoles((prev) =>
                                prev.filter((r) => r !== rol)
                              );
                            }
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`rol-${rol}`}
                        >
                          {rol.charAt(0).toUpperCase() + rol.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setUsuarioEditando(null);
                        setNuevosRoles([]);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        manejarActualizacionRoles(usuarioEditando.id)
                      }
                    >
                      Guardar cambios
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

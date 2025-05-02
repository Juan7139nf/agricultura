"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../scripts/firebase/firebase";
import { AdminNav } from "../../scripts/components/adminNav";
import { NavLink } from "react-router-dom";

export default function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    const productosRef = ref(database, "productos");

    const unsubscribe = onValue(productosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaProductos = Object.entries(data).map(([id, producto]) => ({
          id,
          ...producto,
        }));
        setProductos(listaProductos);
      }
    });

    return () => unsubscribe();
  }, []);

  const elementosPorPagina = 10;

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre?.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(
    productosFiltrados.length / elementosPorPagina
  );
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <div className="container-md">
      <div className="row">
        <div className="col-lg-3 col-md-4 col-12">
          <AdminNav />
        </div>

        <div className="col-lg-9 col-md-8 col-12 py-4 p-md-5 p-lg-6">
          <h1 className="mb-4">Gestión de Productos</h1>

          <div className="card p-4 shadow-sm rounded-4 mb-5">
            <input
              className="form-control mb-3"
              type="text"
              placeholder="Buscar productos..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>

          <div className="row">
            {productosPaginados.map((prod, idx) => (
              <div key={idx} className="col-md-6 mb-4">
                <div className="card p-3 shadow-sm rounded-4">
                  <NavLink to={`/detalle/${prod.id}`} className="text-body link-underline link-underline-opacity-0">
                    <div className="d-flex">
                      <img
                        src={prod.url || "/placeholder.svg"}
                        alt="producto"
                        width={80}
                        height={80}
                        className="rounded me-3"
                        style={{ objectFit: "cover" }}
                      />
                      <div>
                        <strong>{prod.nombre}</strong>
                        <div>SKU: {prod.sku}</div>
                        <div>Precio: {prod.precio} Bs</div>
                        {prod.precioOferta && (
                          <div className="text-success">
                            Oferta: {prod.precioOferta} Bs
                          </div>
                        )}
                        <div>Categoría: {prod.categoria}</div>
                        <div>
                          Unidad: {prod.peso} {prod.unidad}
                        </div>
                        <div className="mt-2">
                          <span
                            className={`badge ${
                              prod.estado === "Activo"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {prod.estado}
                          </span>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación simple */}
          {totalPaginas > 1 && (
            <div className="mt-4 d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  {Array.from({ length: totalPaginas }, (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        paginaActual === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPaginaActual(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

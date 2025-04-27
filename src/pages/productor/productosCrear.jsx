import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ref, push } from "firebase/database";
import { database } from "../../scripts/firebase/firebase";

export function ProductorProductoCrear() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataRef = ref(database, "productos");
    await push(dataRef, {
      nombre,
      edad,
    });

    alert("Datos enviados a Firebase");
    setNombre("");
    setEdad("");
  };

  return (
    <>
      <div className="container py-3">
        <div className="mb-5 row">
          <div className="col-md-12">
            <div className="d-md-flex justify-content-between align-items-center">
              <div>
                <h2>Agregar nuevo producto</h2>
                <nav aria-label="migaja de pan" className="mb-0">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link
                        to={"/productor"}
                        className="text-body-emphasis fw-bolder"
                      >
                        Panel
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link
                        to={"/productor/productos"}
                        className="text-primary fw-bolder"
                      >
                        Productos
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Agregar producto
                    </li>
                  </ol>
                </nav>
              </div>
              <div>
                <Link to={"/productor/productos"} className="btn btn-light">
                  Volver al producto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { database } from "../../scripts/firebase/firebase";
import { ref, onValue } from "firebase/database";
import { ProductorNav } from "../../scripts/components/productorNav";
import { Link } from "react-router-dom";
import {
  Card,
  Form,
  Table,
  InputGroup,
  Row,
  Col,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import VerEvento from "../cliente/verevento";

export function ProductorEventos() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Ruta a los usuarios
    const usuariosRef = ref(database, "usuarios/");

    // Escucha en tiempo real los cambios en los datos
    const unsubscribe = onValue(usuariosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convierte el objeto a un arreglo
        const usuariosArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
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
    <>
      <div className="container-md">
        <div className="row">
          <ProductorNav />
          <div className="col-lg-9 col-md-8 col-12">
            <div className="py-5 p-md-6 p-lg-10">
              <VerEvento />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

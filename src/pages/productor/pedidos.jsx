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

const datos = [
  {
    url: "https://freshcart-next-js.vercel.app/images/products/product-img-1.jpg",
    nombre: "Sev Bhujia de Haldiram",
    orden: "#145678",
    fecha: "24 de noviembre de 2022",
    elementos: 3,
    estado: "Terminado",
    total: 56,
  },
  {
    url: "https://freshcart-next-js.vercel.app/images/products/product-img-1.jpg",
    nombre: "Sev Bhujia de Haldiram",
    orden: "#145678",
    fecha: "24 de noviembre de 2022",
    elementos: 3,
    estado: "Terminado",
    total: 56,
  },
  {
    url: "https://freshcart-next-js.vercel.app/images/products/product-img-1.jpg",
    nombre: "Sev Bhujia de Haldiram",
    orden: "#145678",
    fecha: "24 de noviembre de 2022",
    elementos: 3,
    estado: "Terminado",
    total: 56,
  },
  {
    url: "https://freshcart-next-js.vercel.app/images/products/product-img-1.jpg",
    nombre: "Sev Bhujia de Haldiram",
    orden: "#145678",
    fecha: "24 de noviembre de 2022",
    elementos: 3,
    estado: "Terminado",
    total: 56,
  },
];

export function ProductorPedidos() {
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
              <div className="container py-3">
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-md-flex justify-content-between align-items-center">
                      <div>
                        <h2>Pedidos</h2>
                        <nav aria-label="migaja de pan" className="mb-0">
                          <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                              <Link
                                to={"/productor"}
                                className="text-primary fw-bolder"
                              >
                                Panel
                              </Link>
                            </li>
                            <li
                              className="breadcrumb-item active"
                              aria-current="page"
                            >
                              Pedidos
                            </li>
                          </ol>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Row>
                <Col xl={12} className="mb-5">
                  <Card className="h-100">
                    <Card.Body className="px-4 py-4">
                      <Row className="justify-content-between">
                        <Col lg={4} md={6} className="mb-2 mb-lg-0">
                          <InputGroup>
                            <Form.Control
                              type="search"
                              placeholder="Buscar pedidos"
                            />
                          </InputGroup>
                        </Col>
                        <Col lg={2} md={4}>
                          <Form.Select>
                            <option value="">Estado</option>
                            <option value="active">Activo</option>
                            <option value="draft">Borrador</option>
                            <option value="deactive">Desactivar</option>
                          </Form.Select>
                        </Col>
                      </Row>
                    </Card.Body>

                    <Card.Body className="p-0">
                      <div className="table-responsive">
                        <Table
                          borderless
                          hover
                          className="text-nowrap mb-0 table-centered"
                        >
                          <thead className="bg-light">
                            <tr>
                              <th className="bg-secondary">Imagen</th>
                              <th className="bg-secondary">
                                Producto
                              </th>
                              <th className="bg-secondary">Orden</th>
                              <th className="bg-secondary">Fecha</th>
                              <th className="bg-secondary">Elementos</th>
                              <th className="bg-secondary">Estado</th>
                              <th className="bg-secondary">Cantidad</th>
                              <th className="bg-secondary"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {datos.map((e, i) => (
                              <tr key={i}>
                                <td>
                                  <img
                                    src={e.url}
                                    alt="Producto"
                                    className="img-thumbnail"
                                    style={{ width: "50px" }}
                                  />
                                </td>
                                <td>{e.nombre}</td>
                                <td>{e.orden}</td>
                                <td>{e.fecha}</td>
                                <td>{e.elementos}</td>
                                <td>
                                  <span className="badge bg-primary text-light">
                                    {e.estado}
                                  </span>
                                </td>
                                <td>
                                  {e.total} bs
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

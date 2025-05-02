import React, { useEffect, useState } from "react";
import { database } from "../../scripts/firebase/firebase";
import { ref, onValue } from "firebase/database";
import { ProductorNav } from "../../scripts/components/productorNav";
import { Link, NavLink } from "react-router-dom";
import {
  Card,
  Form,
  Table,
  InputGroup,
  Row,
  Col,
  Dropdown,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import { getAuth } from "firebase/auth";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export function ProductorProductos() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const datosRef = ref(database, "productos/");

    const unsubscribe = onValue(datosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const datosArray = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .filter((item) => item.userId === user.uid); // <-- filtra por usuario

        setDatos(datosArray);
      } else {
        console.log("No hay datos disponibles");
      }
    });

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
                        <h2>Productos</h2>
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
                              Agregar producto
                            </li>
                          </ol>
                        </nav>
                      </div>
                      <div>
                        <Link
                          to={"/productor/productos/crear"}
                          className="btn btn-primary fw-bolder"
                        >
                          Agregar productos
                        </Link>
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
                              placeholder="Buscar productos"
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
                                Nombre del producto
                              </th>
                              <th className="bg-secondary">Categoría</th>
                              <th className="bg-secondary">Estado</th>
                              <th className="bg-secondary">Precio</th>
                              <th className="bg-secondary">Precio oferta</th>
                              <th className="bg-secondary">Acciones</th>
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
                                <td><NavLink to={`/detalle/${e.id}`}>{e.nombre}</NavLink></td>
                                <td>{e.categoria}</td>
                                <td>
                                  <span className="badge bg-primary text-light">
                                    {e.estado}
                                  </span>
                                </td>
                                <td className="text-end">{e.precio} Bs</td>
                                <td className="text-end">
                                  {e.precioOferta} Bs
                                </td>
                                <td>
                                  <div className="btn-group">
                                    <NavLink to={`/productor/productos/editar/${e.id}`} className="btn btn-success py-0 px-1">
                                      <EditSquareIcon />
                                    </NavLink>
                                    <Button variant="danger py-0 px-1">
                                      <DeleteIcon />
                                    </Button>
                                    <Button variant="warning py-0 px-1">
                                      <RestartAltIcon />
                                    </Button>
                                  </div>
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

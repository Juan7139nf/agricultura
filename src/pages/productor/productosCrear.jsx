import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ref, push } from "firebase/database";
import ReactQuill, { displayName } from "react-quill";
import { database } from "../../scripts/firebase/firebase";
import { Module1 } from "../../scripts/customs/formQuill";
import { Button, Form } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { getAuth } from "firebase/auth";

export function ProductorProductoCrear() {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [peso, setPeso] = useState(0);
  const [unidad, setUnidad] = useState("");
  const [foto, setFoto] = useState(null);
  const [url, setUrl] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState(true);
  const [codigo, setCodigo] = useState("");
  const [sku, setSku] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [precioOferta, setPrecioOferta] = useState(0);
  const [precio, setPrecio] = useState(0);

  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleImagenChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foto) {
      alert("Por favor selecciona una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("imagen", foto);

    try {
      const response = await fetch("/api/upload.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.ruta) {
        const imagenUrl = `/api/${data.ruta}`;

        const dataRef = ref(database, "productos");
        await push(dataRef, {
          userId: user.uid,
          nombre,
          categoria,
          peso,
          unidad,
          url: imagenUrl,
          descripcion,
          stock,
          codigo,
          sku,
          estado,
          precio,
          precioOferta,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        });

        toast.success("Datos enviados exitosamante");

        setTimeout(() => {
          navigate("/productor/productos");
        }, 1000);
      } else if (data.error) {
        toast.error("Error: " + data.error);
      } else {
        toast.error("Respuesta inesperada del servidor.");
      }
    } catch (error) {
      toast.error("Error al subir la imagen: " + error.message);
    }
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
        <Form onSubmit={handleSubmit} className="row mb-5">
          <div className="col-lg-8 col-12">
            <div className="mb-4 card-lg card">
              <div className="p-4 card-body">
                <h4>Información del producto</h4>
                <div className="row">
                  <Form.Group
                    className="mb-3 col-lg-6"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Nombre del producto</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese el nombre del producto"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3 col-lg-6"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Categoría del producto</Form.Label>
                    <Form.Select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    >
                      <option value="">Selecciona una categoria</option>
                      <option value="frutas">Frutas</option>
                      <option value="vegetales">Vegetales</option>
                      <option value="snacks">Snacks</option>
                      <option value="semillas y cereales">
                        Semillas y cereales
                      </option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group
                    className="mb-3 col-lg-6"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Peso unidad</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Ingrese el peso unidad"
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3 col-lg-6"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Unidad de medida</Form.Label>
                    <Form.Select
                      value={unidad}
                      onChange={(e) => setUnidad(e.target.value)}
                    >
                      <option value="">Selecciona una unidad de medida</option>
                      <option value="kg">Kilogramos</option>
                      <option value="g">Gramos</option>
                      <option value="lb">Libras</option>
                      <option value="oz">Onzas</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Foto del producto</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleImagenChange}
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <ReactQuill
                    theme="snow"
                    placeholder="Escribe la descripcion que quieras"
                    value={descripcion}
                    onChange={setDescripcion}
                    modules={Module1}
                  />
                </Form.Group>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-12">
            <div className="mb-4 card-lg card">
              <div className="p-4 card-body">
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="En stock"
                  checked={stock}
                  onChange={(e) => setStock(e.target.checked)}
                />
                <Form.Group
                  className="my-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Código del producto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el código del producto"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput2"
                >
                  <Form.Label>SKU del producto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el código de inventario interno"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                  <Form.Text id="skuHelpBlock" muted>
                    SKU (Stock Keeping Unit) es un código de inventario interno
                    usado para controlar el stock. Puede ser diferente del
                    código del producto.
                  </Form.Text>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Activo"
                      name="estado"
                      id="inlineRadio1"
                      value="Activo"
                      checked={estado === "Activo"}
                      onChange={(e) => setEstado(e.target.value)}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Inactivo"
                      name="estado"
                      id="inlineRadio2"
                      value="Inactivo"
                      checked={estado === "Inactivo"}
                      onChange={(e) => setEstado(e.target.value)}
                    />
                  </div>
                </Form.Group>
              </div>
            </div>
            <div className="mb-4 card-lg card">
              <div className="p-4 card-body">
                <h4>Precio del producto</h4>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Precio regular</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el precio regular"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label>Precio de venta</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el precio de venta"
                    value={precioOferta}
                    onChange={(e) => setPrecioOferta(e.target.value)}
                  />
                  <Form.Text id="skuHelpBlock" muted>
                    Es el precio con descuento o promoción.
                  </Form.Text>
                </Form.Group>
              </div>
            </div>
            <div className="d-grid">
              <Button type="submit" className="fw-bolder">
                Agregar producto
              </Button>
            </div>
          </div>
        </Form>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onValue, push, ref, remove, set } from "firebase/database";
import { database } from "../../scripts/firebase/firebase";

export function PedidoDesing() {
  const [activeKey, setActiveKey] = useState("0");
  const [metodo, setMetodo] = useState("");
  const [direccionN, setDireccionN] = useState({
    nombre: "",
    apellido: "",
    ciudad: "",
    direccion: "",
    codigoPostal: "000",
    telefono: "",
    predeterminado: false,
  });
  const [direccionE, setDireccionE] = useState({
    nombre: "",
    apellido: "",
    ciudad: "",
    direccion: "",
    codigoPostal: "000",
    telefono: "",
    predeterminado: false,
  });
  const [direccion, setDireccion] = useState({});
  const [direcciones, setDirecciones] = useState([]);
  const [show, setShow] = useState(false);
  const [showE, setShowE] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseE = () => setShowE(false);
  const handleShowE = () => setShowE(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) return;

      const direccionesRef = ref(
        database,
        `usuarios/${firebaseUser.uid}/direccion`
      );

      onValue(direccionesRef, (snapshot) => {
        const data = snapshot.val() || {};
        // Convierte a array si es necesario
        const direcciones = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setDirecciones(direcciones);
      });
    });

    return () => unsubscribeAuth();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDireccionN((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChangeE = (e) => {
    const { name, value, type, checked } = e.target;
    setDireccionE((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelect = (e) => {
    setMetodo(e.target.value);
  };

  const handleDireccion = (e) => {
    setDireccionE(e);
    setShowE(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const direccion = direccionN;
    const direccionRef = ref(database, `usuarios/${user.uid}/direccion`);
    push(direccionRef, direccion);
    setDireccionN({
      nombre: "",
      apellido: "",
      ciudad: "",
      direccion: "",
      codigoPostal: "000",
      telefono: "",
      predeterminado: false,
    });
    handleClose();
  };

  const handleSubmitDireccion = (e) => {
    e.preventDefault();
    if (!direccionE.id) return;

    const direccion = direccionE;
    const direccionRef = ref(
      database,
      `usuarios/${user.uid}/direccion/${direccionE.id}`
    );
    set(direccionRef, direccion) // <- aquí usamos set en lugar de push
      .then(() => {
        setDireccionE({
          nombre: "",
          apellido: "",
          ciudad: "",
          direccion: "",
          codigoPostal: "000",
          telefono: "",
          predeterminado: false,
        });
        handleCloseE();
      });
  };

  const eliminarItem = (id) => {
    const itemRef = ref(database, `usuarios/${user.uid}/direccion/${id}`);
    remove(itemRef);
  };

  const handleToggle = (key) => {
    // Solo permite abrir, pero no cerrar
    if (activeKey !== key) {
      setActiveKey(key);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        fullscreen={"sm-down"}
        backdrop="static"
        keyboard={false}
        centered
        scrollable
      >
        <Modal.Header className="pb-0 border-0" closeButton>
          <Modal.Title>Nueva dirección de envío</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-0">
          <div>
            <span className="small text-muted">
              Añade una nueva dirección de envío para la entrega de tu pedido.
            </span>
            <Form id="direccionN" onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={direccionN.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={direccionN.apellido}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  type="text"
                  name="ciudad"
                  value={direccionN.ciudad}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  value={direccionN.direccion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Código Postal</Form.Label>
                <Form.Control
                  type="text"
                  name="codigoPostal"
                  value={direccionN.codigoPostal}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  value={direccionN.telefono}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Usar como dirección predeterminada"
                  name="predeterminado"
                  checked={direccionN.predeterminado}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer className="pt-0 border-0">
          <Button variant="outline-primary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" form="direccionN">
            Guardar dirección
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showE}
        onHide={handleCloseE}
        fullscreen={"sm-down"}
        backdrop="static"
        keyboard={false}
        centered
        scrollable
      >
        <Modal.Header className="pb-0 border-0" closeButton>
          <Modal.Title>Editar dirección de envío</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-0">
          <div>
            <span className="small text-muted">
              Edita la dirección del envío para la entrega de tu pedido.
            </span>
            <Form id="direccionE" onSubmit={handleSubmitDireccion}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={direccionE.nombre}
                  onChange={handleChangeE}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={direccionE.apellido}
                  onChange={handleChangeE}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  type="text"
                  name="ciudad"
                  value={direccionE.ciudad}
                  onChange={handleChangeE}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  value={direccionE.direccion}
                  onChange={handleChangeE}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Código Postal</Form.Label>
                <Form.Control
                  type="text"
                  name="codigoPostal"
                  value={direccionE.codigoPostal}
                  onChange={handleChangeE}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  value={direccionE.telefono}
                  onChange={handleChangeE}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Usar como dirección predeterminada"
                  name="predeterminado"
                  checked={direccionE.predeterminado}
                  onChange={handleChangeE}
                />
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer className="pt-0 border-0">
          <Button variant="outline-primary" onClick={handleCloseE}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" form="direccionE">
            Actualizar dirección
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container py-4">
        <h1 className="fw-bolder mb-5">Verificar</h1>
        <div className="row">
          <Form>
            <div className="col-lg-7 col-md-12">
              <Accordion activeKey={activeKey}>
                <Accordion.Item eventKey="0" className="border-0">
                  <Accordion.Header onClick={() => handleToggle("0")}>
                    <div className="w-100 d-flex justify-content-between align-items-center bg-body text-body py-2">
                      <div className="d-flex">
                        <PlaceOutlinedIcon fontSize="large" />
                        <h3>Añadir dirección de entrega</h3>
                      </div>
                      <Button
                        variant="outline-primary btn-sm"
                        onClick={handleShow}
                      >
                        Agregar una nueva dirección
                      </Button>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="p-0">
                    <div className="row">
                      {direcciones.map((e, i) => (
                        <div className="mb-4 col-lg-6 col-12" key={i}>
                          <Card>
                            <Card.Body>
                              <Form.Check
                                type="radio"
                                label={e.direccion}
                                name="direccionSeleccionada"
                                value={e.id}
                                onChange={() => setDireccion(e)}
                                checked={direccion.id === e.id}
                              />
                              <div className="ms-3">
                                <span className="row">
                                  {e.nombre} {e.apellido}
                                </span>
                                <span className="row">{e.direccion}</span>
                                <span className="row">
                                  {e.ciudad} - {e.telefono}
                                </span>
                                {e.predeterminado ? (
                                  <p className="text-success mb-1">
                                    Dirección predeterminada
                                  </p>
                                ) : (
                                  <p className="text-danger mb-1">
                                    Dirección no predeterminada
                                  </p>
                                )}
                                <div className="d-flex gap-5">
                                  <Button
                                    variant="outline-success btn-sm fw-bolder"
                                    onClick={() => handleDireccion(e)}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    variant="outline-danger btn-sm fw-bolder"
                                    onClick={() => eliminarItem(e.id)}
                                  >
                                    Eliminar
                                  </Button>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" className="border-0">
                  <Accordion.Header onClick={() => handleToggle("1")}>
                    <div className="w-100 bg-body text-body border-top border-3 py-2">
                      <div className="d-flex">
                        <CreditCardIcon fontSize="large" />
                        <h3 className="ms-1">Método de pago</h3>
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="p-0">
                    {/* Paypal */}
                    <Card className="mb-3">
                      <Card.Body>
                        <Form.Check
                          type="radio"
                          id="paypal"
                          name="metodoPago"
                          label="Pago con Paypal"
                          value="paypal"
                          checked={metodo === "paypal"}
                          onChange={handleSelect}
                        />
                        <small className="text-muted ms-4">
                          Serás redirigido al sitio web de PayPal para completar
                          tu compra de forma segura.
                        </small>
                      </Card.Body>
                    </Card>

                    {/* Tarjeta */}
                    <Card className="mb-3">
                      <Card.Body>
                        <Form.Check
                          type="radio"
                          id="tarjeta"
                          name="metodoPago"
                          label="Tarjeta de crédito/débito"
                          value="tarjeta"
                          checked={metodo === "tarjeta"}
                          onChange={handleSelect}
                        />
                        <small className="text-muted ms-4">
                          Transferencias seguras a través de su cuenta bancaria.
                          Aceptamos Mastercard, Visa, etc.
                        </small>
                        {metodo === "tarjeta" && (
                          <div className="mt-3 ms-4">
                            <Form.Group className="mb-2">
                              <Form.Label>Número de tarjeta</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="1234 5678 9012 3456"
                              />
                            </Form.Group>
                            <Row>
                              <Col>
                                <Form.Group className="mb-2">
                                  <Form.Label>Nombre en la tarjeta</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Ingrese su nombre"
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group className="mb-2">
                                  <Form.Label>Fecha de caducidad</Form.Label>
                                  <Form.Control type="month" min="2025-05" />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group className="mb-2">
                                  <Form.Label>Código CVV</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="xxx"
                                    maxLength={4}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </div>
                        )}
                      </Card.Body>
                    </Card>

                    {/* Payoneer */}
                    <Card className="mb-3">
                      <Card.Body>
                        <Form.Check
                          type="radio"
                          id="qr"
                          name="metodoPago"
                          label="Pagar con Qr"
                          value="qr"
                          checked={metodo === "qr"}
                          onChange={handleSelect}
                        />
                        <small className="text-muted ms-4">
                          Pago por QR, debes enviar el comprobante del pago para
                          que sea aceptado.
                        </small>
                        {metodo === "qr" && (
                          <>
                            <div className="w-100 p-3">
                              <img
                                src="/img/qr.jpeg"
                                alt=""
                                className="rounded rounded-4 p-0 border border-black"
                              />
                            </div>
                            <Form.Group className="mb-2">
                              <Form.Label>Comprobante</Form.Label>
                              <Form.Control type="file" accept="image" />
                            </Form.Group>
                          </>
                        )}
                      </Card.Body>
                    </Card>

                    {/* Contra reembolso */}
                    <Card className="mb-3">
                      <Card.Body>
                        <Form.Check
                          type="radio"
                          id="reembolso"
                          name="metodoPago"
                          label="Pago contra reembolso"
                          value="reembolso"
                          checked={metodo === "reembolso"}
                          onChange={handleSelect}
                        />
                        <small className="text-muted ms-4">
                          Pague en efectivo cuando se entregue su pedido.
                        </small>
                      </Card.Body>
                    </Card>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
            <div className="col-lg-4 col-md-12 col-12 offset-lg-1"></div>
          </Form>
        </div>
      </div>
    </>
  );
}

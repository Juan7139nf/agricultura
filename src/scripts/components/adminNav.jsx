import React, { useState } from "react";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import { NavLink } from "react-router-dom";
import Logout from "../../pages/authentication/logout";

export function AdminNav() {//CAMBIAR EL PANEL A ADMIN
  const opciones = [
    { name: "Panel", url: "/productor" },
    { name: "Productos", url: "/productor/productos" },
    { name: "Pedidos", url: "/productor/pedidos" },
    { name: "Facturación", url: "/productor/facturacion" },
    { name: "Eventos", url: "/productor/eventos" },
  ];

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Productor opciones</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column nav-pills-dark nav-pills">
            <Nav.Item>
              {opciones.map((e, i) => (
                <NavLink
                  key={i}
                  to={e.url}
                  className="d-flex align-items-center gap-1 nav-link text-body-emphasis"
                >
                  {e.name}
                </NavLink>
              ))}
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center d-md-none py-4">
          <h3 className="fs-5 mb-0">Productor opciones</h3>
          <Button variant="outline-primary p-0" onClick={handleShow}>
            <ListRoundedIcon fontSize="large" />
          </Button>
        </div>
      </div>

      <div className="border-end d-none d-md-block col-lg-3 col-md-4 col-12">
        <div className="pt-5 pe-lg-5">
          <Nav className="flex-column nav-pills-dark nav-pills">
            <Nav.Item>
              {opciones.map((e, i) => (
                <NavLink
                  key={i}
                  to={e.url}
                  className="d-flex align-items-center gap-1 nav-link"
                >
                  {e.name}
                </NavLink>
              ))}
            </Nav.Item>
          </Nav>
        <Logout/>
        </div>
      </div>
    </>
  );
}

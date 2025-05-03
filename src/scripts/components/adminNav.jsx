import React, { useState } from "react";
import { Button, Nav, Offcanvas, Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import PeopleIcon from "@mui/icons-material/People";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import EventIcon from "@mui/icons-material/Event";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import { handleLogout as LogoutF } from "../../pages/authentication/logout";

export function AdminNav() {
  const [show, setShow] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const opciones = [
    {
      name: "Panel",
      url: "/adminicio",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      name: "Usuarios",
      url: "/gestionproductores",
      icon: <PeopleIcon fontSize="small" />,
    },
    {
      name: "Productos",
      url: "/admin/productos",
      icon: <ShoppingCartIcon fontSize="small" />,
    },
    {
      name: "Pedidos",
      url: "/gestionpedido",
      icon: <ShoppingCartIcon fontSize="small" />,
    },
    {
      name: "Facturación",
      url: "/productor/facturacion",
      icon: <ReceiptIcon fontSize="small" />,
    },
    {
      name: "Eventos",
      url: "/gestionevento",
      icon: <EventIcon fontSize="small" />,
    },
  ];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    LogoutF();
  };

  return (
    <>
      {/* MODAL DE CONFIRMACIÓN */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar cierre de sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas cerrar sesión?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmLogout}>
            Cerrar sesión
          </Button>
        </Modal.Footer>
      </Modal>

      {/* OFFCANVAS - Responsive móvil */}
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Body>
          <Nav
            className="flex-column nav-pills-dark nav-pills"
            role="navigation"
          >
            <Nav.Item>
              {opciones.map((e, i) => (
                <NavLink
                  key={i}
                  to={e.url}
                  className={({ isActive }) =>
                    `d-flex align-items-center gap-2 nav-link ${
                      isActive ? "active text-primary fw-bold" : "text-body"
                    }`
                  }
                >
                  {e.icon} {e.name}
                </NavLink>
              ))}
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* VERSIÓN ESCRITORIO */}
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center d-md-none py-4">
          <Button variant="outline-primary p-0" onClick={handleShow}>
            <ListRoundedIcon fontSize="large" />
          </Button>
        </div>
      </div>
      <div className="d-none d-md-block col-lg-3 col-md-4 col-12">
        <div className="pt-5 pe-lg-5">
          <Nav
            className="flex-column nav-pills-dark nav-pills"
            role="navigation"
          >
            <Nav.Item>
              {opciones.map((e, i) => (
                <NavLink
                  key={i}
                  to={e.url}
                  className={({ isActive }) =>
                    `d-flex align-items-center gap-2 nav-link px-3 py-2 ${
                      isActive ? "active text-primary fw-bold" : "text-body"
                    }`
                  }
                >
                  {e.icon} {e.name}
                </NavLink>
              ))}
            </Nav.Item>
          </Nav>
          <Button variant="outline-danger mt-4 ms-3" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      {/* Renderiza Logout si fue confirmado */}
      {showLogoutModal === false}
    </>
  );
}

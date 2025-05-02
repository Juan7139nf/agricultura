import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import CrueltyFreeIcon from "@mui/icons-material/CrueltyFree";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Logout from "../../pages/authentication/logout";
import { obtenerUsuarioDeLocalStorage } from "../customs/localStorage";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { auth } from "../../scripts/firebase/firebase"; // o donde tengas tu configuración de Firebase

const Navegador = ({ expand, show, handleClose }) => {
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await signOut(auth);
    localStorage.clear(); // limpia también el rol guardado
    navigate("/");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
  const ini = obtenerUsuarioDeLocalStorage();
  return (
    <>
      <Navbar key={expand} expand={expand} className="bg-body py-0 py-md-2">
        <Container fluid="lg">
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="start"
            show={show}
            onHide={handleClose}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title
                id={`offcanvasNavbarLabel-expand-${expand}`}
                className="d-flex align-content-center"
              >
                <CrueltyFreeIcon sx={{ fontSize: 50 }} />
                <span className="h1 fw-bolder">AgroShop</span>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-start flex-grow-1 pe-3">
                <NavLink className="nav-link" to={"/"}>
                  Inicio
                </NavLink>
                <Nav.Link href="#action1">Productos</Nav.Link>
                <NavDropdown
                  title="Filtrar"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                  <NavDropdown.Item href="#action3">
                    Productores
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action4">
                    Comerciantes
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Categorias
                  </NavDropdown.Item>
                </NavDropdown>
                {ini && (
                  <NavDropdown
                    title="Panel administrativo"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                  >
                    <NavLink className="dropdown-item" to={"/productor"}>
                      Productor
                    </NavLink>
                    <NavLink className="dropdown-item" to={"/comerciante"}>
                      Comerciante
                    </NavLink>
                    <NavDropdown.Divider />
                    <NavLink className="dropdown-item" to={"/adminicio"}>
                      Administracion
                    </NavLink>
                  </NavDropdown>
                )}
                <Nav.Link href="/paneladmin">Eventos</Nav.Link>
              </Nav>
              <hr className="d-lg-none my-2 text-white-50"></hr>
              <Nav className="justify-content-end">

                {ini ? (
                  <>
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        variant="link"
                        className="nav-link d-flex position-relative py-0 align-content-center border-0 bg-transparent"
                        id="dropdown-user"
                      >
                        {ini.photoURL ? (
                          <img
                            src={ini.photoURL}
                            alt="Usuario"
                            width={40}
                            height={40}
                            className="rounded-circle"
                          />
                        ) : (
                          <div style={{ minHeight: "40px" }}>
                            <AccountCircleRoundedIcon fontSize="large" />
                          </div>
                        )}
                        <span className="d-block d-md-none ms-1 my-auto">{ini.displayName}</span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item disabled>Editar perfil</Dropdown.Item>
                        <Dropdown.Item disabled>Configuraciones</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                ) : (
                  <>
                    <NavLink
                      className="nav-link d-flex position-relative"
                      to={"/login"}
                    >
                      <ErrorRoundedIcon className="text-danger" />
                      <span className="text-danger fw-bolder ms-1">
                        Iniciar sesion
                      </span>
                    </NavLink>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Navegador;

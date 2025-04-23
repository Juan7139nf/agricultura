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
import CrueltyFreeIcon from "@mui/icons-material/CrueltyFree";
import { NavLink } from "react-router-dom";

const Navegador = ({ expand, show, handleClose }) => {
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
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className="d-flex align-content-center">
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

                <NavDropdown
                  title="Panel administrativo"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="#action2">Eventos</Nav.Link>
              </Nav>
              <hr className="d-lg-none my-2 text-white-50"></hr>
              <Nav className="justify-content-end">
                <NavLink
                  className="nav-link d-flex position-relative"
                  to={"/cart"}
                >
                  <ShoppingCartRoundedIcon />
                  <span className="d-block d-md-none ms-1">Carrito</span>
                  <span class="custom-badge position-absolute start-100 translate-middle badge rounded-pill bg-success d-none d-md-block">
                    44
                  </span>
                  <span className="ms-2 fw-bolder px-2 rounded-pill bg-success d-block d-md-none">
                    44
                  </span>
                </NavLink>
                <Nav.Link
                  className="nav-link d-flex position-relative"
                  href="#action1"
                >
                  <NotificationsRoundedIcon />
                  <span className="d-block d-md-none ms-1">Notificaciones</span>
                </Nav.Link>
                <Nav.Link
                  className="nav-link d-flex position-relative"
                  href="#action1"
                >
                  <AccountCircleRoundedIcon />
                  <span className="d-block d-md-none ms-1">
                    Ezequiel Rivera
                  </span>
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Navegador;

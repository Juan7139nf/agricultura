import { useState } from "react";
import {
  Col,
  InputGroup,
  Row,
  Button,
  Form,
  Navbar,
  Nav,
  Container,
} from "react-bootstrap";
import CrueltyFreeIcon from "@mui/icons-material/CrueltyFree";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import Navegador from "./nav";
import ThemeSwitcher from "../customs/themeSwitcher";
import { NavLink } from "react-router-dom";
import SearchAutocomplete from "../customs/searchAutocomplete";

const Header = () => {
  const expand = "md";

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar className="bg-body justify-content-between">
        <Container fluid="lg">
          <NavLink
            className="navbar-brand p-0 m-0 d-flex align-content-center"
            to={"/"}
          >
            <CrueltyFreeIcon sx={{ fontSize: 50 }} />
            <span className="h1 fw-bolder d-none d-md-block">AgroShop</span>
          </NavLink>
          <Nav className="w-100">
            <div className="px-5 w-100">
              <SearchAutocomplete />
            </div>
          </Nav>
          <Nav>
            <Nav.Link className="my-auto">
              <ThemeSwitcher />
            </Nav.Link>
            <Nav.Link className="my-auto">
              <Button variant="outline-primary p-0" onClick={handleShow}>
                <MenuOpenRoundedIcon fontSize="large" />
              </Button>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Navegador expand={expand} show={show} handleClose={handleClose} />
    </>
  );
};

export default Header;

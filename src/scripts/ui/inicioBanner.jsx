import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Inicio_Banner = () => {
  return (
    <>
      <section
        className="py-lg-16 py-10"
        style={{
          backgroundImage: 'url("/img/inicio_banner.webp")',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      >
        <Container>
          <Row>
            <Col xl={4} lg={6} md={7}>
              <Card className="shadow border-0">
                <Card.Body className="p-6">
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-danger"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <h1 className="mt-3 mb-0 h4">
                      Consulta lo que hay en tu ciudad
                    </h1>
                    <small>Ver opciones de entrega y recogida</small>
                  </div>
                  <NavLink
                    className="btn btn-primary"
                    to={"/control/ubicacion"}
                  >
                    Controlar
                  </NavLink>
                </Card.Body>
              </Card>
              <div className="mt-3">
                <small className="text-white">
                  Hola, inicia sesión para disfrutar de la mejor experiencia.
                  ¿Eres nuevo en AgroShop?
                  <NavLink className="fw-bolder text-white ms-1" to={"/register"}>
                    Registrate.
                  </NavLink>
                </small>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Inicio_Banner;

import React from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Modal,
  CloseButton,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, provider, database } from "../../scripts/firebase/firebase";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuario autenticado:", user);

      const userRef = ref(database, `usuarios/${user.uid}`);
      const snapshot = await get(userRef);

      let userData;

      if (!snapshot.exists()) {
        userData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          providerData: user.providerData,
          roles: ["cliente"],
          createdAt: user.metadata.creationTime,
          lastLoginAt: user.metadata.lastSignInTime,
          isAnonymous: user.isAnonymous,
        };
        await set(userRef, userData);
        console.log("Usuario nuevo guardado en la base de datos");
      } else {
        userData = snapshot.val();
        console.log("Datos del usuario cargados desde la base de datos");
      }

      localStorage.setItem("user", JSON.stringify(userData));

      window.location.href = "/";
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <>
      <Modal show={true} animation={false} fullscreen={true}>
        <Modal.Header className="border-0">
          <NavLink to={"/"} className="btn-close" />
        </Modal.Header>
        <Modal.Body className="align-content-center">
          <section className="my-lg-14">
            <Container>
              <Row className="justify-content-center align-items-center pb-5">
                <Col lg={4} md={6} xs={12} className="order-lg-1 order-2">
                  <Image src="/svg/signin.svg" alt="" fluid />
                </Col>

                <Col
                  lg={4}
                  md={6}
                  xs={12}
                  className="order-lg-2 offset-lg-1 order-1"
                >
                  <div className="mb-lg-9 mb-4">
                    <h1 className="mb-2 h2 fw-bold">Inicia sesión</h1>
                    <p>
                      ¡Bienvenido de nuevo! Introduce tu correo electrónico para
                      empezar.
                    </p>
                  </div>

                  <Form className="needs-validation">
                    <Row className="g-3">
                      <Col xs={12}>
                        <Form.Label visuallyHidden htmlFor="formSigninEmail">
                          Email address
                        </Form.Label>
                        <Form.Control
                          id="formSigninEmail"
                          type="email"
                          placeholder="Email"
                          name="email"
                        />
                      </Col>

                      <Col xs={12}>
                        <Form.Label visuallyHidden htmlFor="formSigninPassword">
                          Password
                        </Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            id="formSigninPassword"
                            type="password"
                            placeholder="*****"
                            name="password"
                            className="form-control"
                          />
                          <span className="position-absolute top-50 end-0 translate-middle-y me-3">
                            <i className="bi bi-eye-slash"></i>
                          </span>
                        </div>
                      </Col>

                      <Col xs={12} className="d-flex justify-content-between">
                        <div>
                          ¿Olvidaste tu contraseña?{" "}
                          <NavLink to="/forgot-password">Restablecer</NavLink>
                        </div>
                      </Col>

                      <Col xs={12} className="d-grid">
                        <Button type="submit" variant="primary fw-bolder fs-5">
                          Iniciar sesion
                        </Button>
                      </Col>

                      <Col xs={12}>
                        ¿No tienes una cuenta?{" "}
                        <NavLink to="/register">Registrar</NavLink>
                      </Col>

                      <Col xs={12} className="d-grid">
                        <Button variant="secondary" onClick={handleGoogleLogin}>
                          <GoogleIcon />
                          <span className="fw-bolder">
                            {" "}
                            Iniciar sesión con Google
                          </span>
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </Container>
          </section>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;

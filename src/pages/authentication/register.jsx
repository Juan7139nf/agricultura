import React, { useState } from "react";
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
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, provider, database } from "../../scripts/firebase/firebase";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value;
    const apellido = e.target.apellido.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      setError("");
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      // Actualiza el perfil con nombre completo
      await updateProfile(user, {
        displayName: `${nombre} ${apellido}`,
      });

      const userData = {
        uid: user.uid,
        nombre,
        apellido,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL,
        providerData: user.providerData,
        roles: ["cliente"],
        createdAt: user.metadata.creationTime,
        lastLoginAt: user.metadata.lastSignInTime,
        isAnonymous: user.isAnonymous,
      };

      // Guardar en la base de datos
      const userRef = ref(database, `usuarios/${user.uid}`);
      await set(userRef, userData);

      localStorage.setItem("user", JSON.stringify(userData));

      // Redireccionar
      window.location.href = "/";
    } catch (error) {
      console.error("Error al registrar:", error);
      setError("Error al registrar el usuario");
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
                    <h1 className="mb-2 h2 fw-bold">Crear cuenta</h1>
                    <p>
                      ¡Bienvenido de nuevo! Introduce tu correo electrónico para
                      crear cuenta.
                    </p>
                  </div>

                  <Form className="needs-validation" onSubmit={handleRegister}>
                    <Row className="g-3">
                      <Col xs={6}>
                        <Form.Control
                          type="text"
                          placeholder="Nombre"
                          name="nombre"
                          required
                        />
                      </Col>

                      <Col xs={6}>
                        <Form.Control
                          type="text"
                          placeholder="Apellido"
                          name="apellido"
                          required
                        />
                      </Col>

                      <Col xs={12}>
                        <Form.Label visuallyHidden htmlFor="formSigninEmail">
                          Correo electrónico
                        </Form.Label>
                        <Form.Control
                          id="formSigninEmail"
                          type="email"
                          placeholder="Correo electrónico"
                          name="email"
                        />
                      </Col>

                      <Col xs={12}>
                        <Form.Label visuallyHidden htmlFor="formSigninPassword">
                          Contraseña
                        </Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            id="formSigninPassword"
                            placeholder="*****"
                            name="password"
                            className="form-control"
                            type={showPassword ? "text" : "password"}
                          />
                          <span
                            className="position-absolute top-50 end-0 translate-middle-y me-3"
                            role="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i
                              className={`bi ${
                                showPassword ? "bi-eye" : "bi-eye-slash"
                              }`}
                            ></i>
                          </span>
                        </div>
                      </Col>

                      {error && (
                        <Col xs={12} className="text-bg-danger rounded-2">
                          <div className="">{error}</div>
                        </Col>
                      )}

                      <Col xs={12} className="d-grid">
                        <Button type="submit" variant="primary fw-bolder fs-5">
                          Registrarse
                        </Button>
                      </Col>

                      <Col xs={12}>
                        ¿Ya tienes una cuenta?{" "}
                        <NavLink to="/login">Iniciar sesión</NavLink>
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

export default Register;

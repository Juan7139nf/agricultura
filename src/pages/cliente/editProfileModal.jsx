import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateProfile } from "firebase/auth";
import { ref, update } from "firebase/database";
import { auth, database } from "../../scripts/firebase/firebase";

const EditProfileModal = ({ show, onHide, userData, onUpdate }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  useEffect(() => {
    if (userData) {
      setNombre(userData.nombre);
      setApellido(userData.apellido);
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      const displayName = `${nombre} ${apellido}`;

      // Actualizar perfil en Firebase Auth
      await updateProfile(auth.currentUser, { displayName });

      // Actualizar datos en la base de datos
      const userRef = ref(database, `usuarios/${userData.uid}`);
      await update(userRef, {
        nombre,
        apellido,
        displayName,
      });

      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="apellido" className="mt-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;

"use client"

import { useState } from "react"
import { database } from "../../scripts/firebase/firebase"
import { ref, push } from "firebase/database"

function InscripcionModal({ evento, onClose, onSubmit, usuario }) {
  const [inscripcion, setInscripcion] = useState({
    mensaje: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setInscripcion((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    onSubmit(inscripcion)

    try {
      const nuevaNotificacion = {
        tipo: "solicitud_participacion",
        titulo: "Nueva solicitud de participación",
        mensaje: `${usuario.nombre} ha solicitado participar en el evento "${evento.nombre}".`,
        eventoId: evento.id,
        usuarioId: usuario.id,
        leida: false,
        fechaCreacion: new Date().toISOString(),
      }

      const notificacionesRef = ref(database, "notificaciones/admin")
      await push(notificacionesRef, nuevaNotificacion)
    } catch (error) {
      console.error("Error al guardar notificación:", error)
    }

    onClose()
  }

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">Solicitud de participación</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-light border mb-4">
              <div className="d-flex align-items-center mb-2">
                <div
                  className={`badge bg-${
                    evento.categoria === "feria"
                      ? "success"
                      : evento.categoria === "taller"
                      ? "warning"
                      : "primary"
                  } me-2`}
                >
                  {evento.categoria.charAt(0).toUpperCase() + evento.categoria.slice(1)}
                </div>
                <h5 className="mb-0">{evento.nombre}</h5>
              </div>
              <p className="mb-1">
                <small>
                  <strong>Fecha:</strong> {evento.fecha} | {evento.hora}
                </small>
              </p>
              <p className="mb-0">
                <small>
                  <strong>Cupos disponibles:</strong> {evento.cuposDisponibles} de {evento.cuposTotal}
                </small>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">¿Por qué quieres participar en este evento?</label>
                <textarea
                  className="form-control"
                  name="mensaje"
                  placeholder="Cuéntanos brevemente por qué estás interesado en participar..."
                  value={inscripcion.mensaje}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="alert alert-info">
                <small>
                  <i className="bi bi-info-circle me-2"></i>
                  Tu solicitud será revisada por el administrador. Recibirás una notificación cuando sea aprobada o rechazada.
                </small>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Enviar solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InscripcionModal;

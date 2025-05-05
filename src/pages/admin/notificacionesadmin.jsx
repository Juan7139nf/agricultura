"use client"

import { useState, useEffect } from "react"
import { ref, onValue, update, get, remove } from "firebase/database"
import { database } from "../../scripts/firebase/firebase"

function NotificacionesAdmin({ onClose, onVerPropuesta, onVerSolicitud }) {
  const [notificaciones, setNotificaciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const notificacionesRef = ref(database, "notificaciones/admin")

    const unsubscribe = onValue(notificacionesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        // Convertir a array y ordenar por fecha (más recientes primero)
        const notificacionesList = Object.keys(data)
          .map((id) => ({
            id,
            ...data[id],
          }))
          .sort((a, b) => {
            // Si no tiene fechaCreacion, ponerlo al final
            if (!a.fechaCreacion) return 1
            if (!b.fechaCreacion) return -1
            return new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
          })

        setNotificaciones(notificacionesList)
      } else {
        setNotificaciones([])
      }
      setLoading(false)
    })

    // Marcar todas como leídas al abrir
    marcarTodasComoLeidas()

    return () => unsubscribe()
  }, [])

  const marcarTodasComoLeidas = async () => {
    try {
      const notificacionesRef = ref(database, "notificaciones/admin")
      const snapshot = await get(notificacionesRef)

      if (snapshot.exists()) {
        const updates = {}

        Object.keys(snapshot.val()).forEach((id) => {
          updates[`${id}/leida`] = true
        })

        await update(notificacionesRef, updates)
      }
    } catch (error) {
      console.error("Error al marcar notificaciones como leídas:", error)
    }
  }

  const eliminarNotificacion = async (id) => {
    try {
      const notificacionRef = ref(database, `notificaciones/admin/${id}`)
      await remove(notificacionRef)
    } catch (error) {
      console.error("Error al eliminar notificación:", error)
    }
  }

  const getIconoNotificacion = (tipo) => {
    switch (tipo) {
      case "propuesta_evento":
        return "bi-calendar-plus"
      case "solicitud_participacion":
        return "bi-person-plus"
      default:
        return "bi-bell"
    }
  }

  const getColorNotificacion = (tipo) => {
    switch (tipo) {
      case "propuesta_evento":
        return "success"
      case "solicitud_participacion":
        return "primary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="card shadow-sm rounded-4 mb-4">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Notificaciones</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="card-body p-0" style={{ maxHeight: "400px", overflowY: "auto" }}>
        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="text-center p-4 text-muted">
            <i className="bi bi-bell-slash fs-4 mb-2"></i>
            <p>No tienes notificaciones</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {notificaciones.map((notificacion) => (
              <div key={notificacion.id} className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between align-items-start">
                  <div className="d-flex gap-3">
                    <div className={`bg-${getColorNotificacion(notificacion.tipo)} text-white rounded-circle p-2`}>
                      <i className={`bi ${getIconoNotificacion(notificacion.tipo)}`}></i>
                    </div>
                    <div>
                      <h6 className="mb-1">{notificacion.titulo}</h6>
                      <p className="mb-1">{notificacion.mensaje}</p>
                      <small className="text-muted">
                        {notificacion.fechaCreacion
                          ? new Date(notificacion.fechaCreacion).toLocaleString()
                          : "Fecha desconocida"}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {notificacion.tipo === "propuesta_evento" && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => onVerPropuesta(notificacion.propuestaId)}
                      >
                        Ver propuesta
                      </button>
                    )}
                    {notificacion.tipo === "solicitud_participacion" && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onVerSolicitud(notificacion.eventoId, notificacion.usuarioId)}
                      >
                        Ver solicitud
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => eliminarNotificacion(notificacion.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificacionesAdmin

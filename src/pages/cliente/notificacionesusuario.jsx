"use client"

import { useState, useEffect } from "react"
import { ref, onValue, update, remove } from "firebase/database"
import { database } from "../../scripts/firebase/firebase"
import { obtenerUsuarioDeLocalStorage } from "../customs/localStorage"

function NotificacionesUsuario() {
  const [notificaciones, setNotificaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const usuario = obtenerUsuarioDeLocalStorage()

  useEffect(() => {
    if (!usuario) {
      setLoading(false)
      return
    }

    const notificacionesRef = ref(database, `notificaciones/usuarios/${usuario.uid}`)

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

    return () => unsubscribe()
  }, [usuario])

  const marcarComoLeida = async (id) => {
    if (!usuario) return

    try {
      const notificacionRef = ref(database, `notificaciones/usuarios/${usuario.uid}/${id}`)
      await update(notificacionRef, { leida: true })
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error)
    }
  }

  const marcarTodasComoLeidas = async () => {
    if (!usuario || notificaciones.length === 0) return

    try {
      const updates = {}
      notificaciones.forEach((notif) => {
        if (!notif.leida) {
          updates[`${notif.id}/leida`] = true
        }
      })

      const notificacionesRef = ref(database, `notificaciones/usuarios/${usuario.uid}`)
      await update(notificacionesRef, updates)
    } catch (error) {
      console.error("Error al marcar todas las notificaciones como leídas:", error)
    }
  }

  const eliminarNotificacion = async (id) => {
    if (!usuario) return

    try {
      const notificacionRef = ref(database, `notificaciones/usuarios/${usuario.uid}/${id}`)
      await remove(notificacionRef)
    } catch (error) {
      console.error("Error al eliminar notificación:", error)
    }
  }

  const getIconoNotificacion = (tipo) => {
    switch (tipo) {
      case "solicitud_aprobada":
        return "bi-check-circle-fill text-success"
      case "solicitud_rechazada":
        return "bi-x-circle-fill text-danger"
      default:
        return "bi-bell-fill text-primary"
    }
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Mis Notificaciones</h1>
            {notificaciones.some((n) => !n.leida) && (
              <button className="btn btn-outline-primary" onClick={marcarTodasComoLeidas}>
                Marcar todas como leídas
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Cargando notificaciones...</p>
            </div>
          ) : notificaciones.length === 0 ? (
            <div className="alert alert-info text-center py-5">
              <i className="bi bi-bell-slash fs-1 mb-3"></i>
              <h4>No tienes notificaciones</h4>
              <p>Cuando recibas notificaciones, aparecerán aquí.</p>
            </div>
          ) : (
            <div className="card shadow-sm rounded-4">
              <div className="list-group list-group-flush">
                {notificaciones.map((notificacion) => (
                  <div
                    key={notificacion.id}
                    className={`list-group-item ${!notificacion.leida ? "bg-light" : ""}`}
                    onClick={() => marcarComoLeida(notificacion.id)}
                  >
                    <div className="d-flex">
                      <div className="me-3 fs-4">
                        <i className={`bi ${getIconoNotificacion(notificacion.tipo)}`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <h5 className="mb-1">{notificacion.titulo}</h5>
                          <div>
                            <small className="text-muted me-3">
                              {new Date(notificacion.fechaCreacion).toLocaleString()}
                            </small>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={(e) => {
                                e.stopPropagation()
                                eliminarNotificacion(notificacion.id)
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                        <p className="mb-1">{notificacion.mensaje}</p>
                        {!notificacion.leida && <span className="badge bg-primary">Nueva</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificacionesUsuario

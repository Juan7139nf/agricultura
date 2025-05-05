"use client"

import { useState, useEffect } from "react"
import { ref, onValue, push, set, serverTimestamp } from "firebase/database"
import { database } from "../../scripts/firebase/firebase"
import PropuestaEventoModal from "../admin/propuestaeventomodal"
import InscripcionModal from "../admin/inscripcionmodal"
import { obtenerUsuarioDeLocalStorage } from "../../scripts/customs/localStorage"

function VerEvento() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [usuario, setUsuario] = useState(null)
  const [showPropuestaModal, setShowPropuestaModal] = useState(false)
  const [showInscripcionModal, setShowInscripcionModal] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)
  const [eventoPreview, setEventoPreview] = useState(null) // Para la vista previa del evento

  useEffect(() => {
    // Cargar eventos
    const eventosRef = ref(database, "eventos")
    onValue(eventosRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const eventosList = Object.keys(data)
          .map((id) => ({ id, ...data[id] }))
          .filter((evento) => evento.estado === "activo")
        setEventos(eventosList)
      } else {
        setEventos([])
      }
      setLoading(false)
    })

    // Obtener datos del usuario actual
    const usuarioActual = obtenerUsuarioDeLocalStorage()
    if (usuarioActual) {
      const userRef = ref(database, `usuarios/${usuarioActual.uid}`)
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val()
          setUsuario({
            id: usuarioActual.uid,
            nombre: userData.displayName || usuarioActual.displayName,
            email: userData.email || usuarioActual.email,
            roles: userData.roles || ["cliente"],
            foto: userData.photoURL || usuarioActual.photoURL,
          })
        }
      })
    }
  }, [])

  // Filtrar eventos por categoría
  const ferias = eventos.filter((evento) => evento.categoria === "feria")
  const talleres = eventos.filter((evento) => evento.categoria === "taller")
  const cooperativas = eventos.filter((evento) => evento.categoria === "cooperativa")

  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case "feria":
        return "success"
      case "cooperativa":
        return "primary"
      case "taller":
        return "warning"
      default:
        return "secondary"
    }
  }

  const handlePropuestaSubmit = async (propuesta) => {
    try {
      if (!usuario) {
        alert("Debes iniciar sesión para proponer un evento")
        return
      }

      // Guardar la propuesta en Firebase
      const propuestasRef = ref(database, "propuestas")
      const nuevaPropuestaRef = push(propuestasRef)

      await set(nuevaPropuestaRef, {
        ...propuesta,
        usuarioId: usuario.id,
        usuarioNombre: usuario.nombre,
        usuarioEmail: usuario.email,
        estado: "pendiente",
        fechaCreacion: serverTimestamp(),
      })

      // Crear notificación para el administrador
      const notificacionesAdminRef = ref(database, "notificaciones/admin")
      const nuevaNotificacionRef = push(notificacionesAdminRef)

      await set(nuevaNotificacionRef, {
        tipo: "propuesta_evento",
        titulo: "Nueva propuesta de evento",
        mensaje: `${usuario.nombre} ha propuesto un nuevo evento: ${propuesta.nombre}`,
        propuestaId: nuevaPropuestaRef.key,
        leida: false,
        fechaCreacion: serverTimestamp(),
      })

      setShowPropuestaModal(false)
      alert("Tu propuesta ha sido enviada. El administrador la revisará pronto.")
    } catch (error) {
      console.error("Error al enviar propuesta:", error)
      alert("Hubo un error al enviar tu propuesta. Inténtalo de nuevo.")
    }
  }

  const handleInscripcionSubmit = async (inscripcion) => {
    try {
      if (!usuario) {
        alert("Debes iniciar sesión para inscribirte")
        return
      }

      if (!eventoSeleccionado) return

      // Guardar la solicitud en el evento
      const solicitudesRef = ref(database, `eventos/${eventoSeleccionado.id}/solicitudes/${usuario.id}`)

      await set(solicitudesRef, {
        usuarioId: usuario.id,
        usuarioNombre: usuario.nombre,
        usuarioEmail: usuario.email,
        mensaje: inscripcion.mensaje,
        estado: "pendiente",
        fechaCreacion: serverTimestamp(),
      })

      // Crear notificación para el administrador
      const notificacionesAdminRef = ref(database, "notificaciones/admin")
      const nuevaNotificacionRef = push(notificacionesAdminRef)

      await set(nuevaNotificacionRef, {
        tipo: "solicitud_participacion",
        titulo: "Nueva solicitud de participación",
        mensaje: `${usuario.nombre} quiere participar en el evento: ${eventoSeleccionado.nombre}`,
        eventoId: eventoSeleccionado.id,
        usuarioId: usuario.id,
        leida: false,
        fechaCreacion: serverTimestamp(),
      })

      setShowInscripcionModal(false)
      setEventoSeleccionado(null)
      alert("Tu solicitud ha sido enviada. El administrador la revisará pronto.")
    } catch (error) {
      console.error("Error al enviar solicitud:", error)
      alert("Hubo un error al enviar tu solicitud. Inténtalo de nuevo.")
    }
  }

  const handleInscripcionClick = (evento) => {
    setEventoSeleccionado(evento)
    setShowInscripcionModal(true)
  }

  const handleVerDetalles = (evento) => {
    setEventoPreview(evento)
  }

  const cerrarPreview = () => {
    setEventoPreview(null)
  }

  // Verificar si el usuario puede inscribirse (es comerciante o productor)
  const puedeInscribirse =
    usuario && usuario.roles && (usuario.roles.includes("comerciante") || usuario.roles.includes("productor"))

  // Componente de tarjeta de evento para reutilizar
  const EventoCard = ({ evento }) => (
    <div className="col-md-4 col-sm-6 mb-4">
      <div className="card h-100 shadow-sm rounded-4 border-0 hover-shadow transition-all">
        <div className="position-relative">
          <img
            src={evento.imagen || "/placeholder.svg"}
            alt={evento.nombre}
            className="card-img-top rounded-top-4"
            style={{ height: "180px", objectFit: "cover" }}
          />
          <span
            className={`position-absolute top-0 end-0 badge bg-${getCategoriaColor(
              evento.categoria,
            )} m-2 px-3 py-2 rounded-pill`}
          >
            {evento.categoria.charAt(0).toUpperCase() + evento.categoria.slice(1)}
          </span>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold">{evento.nombre}</h5>
          <p className="card-text text-muted mb-2">
            <small>
              <i className="bi bi-calendar-event me-2"></i>
              {evento.fecha} | {evento.hora}
            </small>
          </p>
          {evento.ubicacion && (
            <p className="card-text text-muted mb-2">
              <small>
                <i className="bi bi-geo-alt me-2"></i>
                {evento.ubicacion}
              </small>
            </p>
          )}
          <p className="card-text flex-grow-1">{evento.descripcion}</p>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="badge bg-light text-dark">
              Cupos: {evento.cuposDisponibles} / {evento.cuposTotal}
            </span>
            <div className="d-flex gap-2">

              {puedeInscribirse && (
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleInscripcionClick(evento)}>
                  Inscribirse
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Componente para sección de categoría
  const CategoriaSection = ({ titulo, eventos, color }) => {
    if (eventos.length === 0) return null

    return (
      <section className="mb-5">
        <div className="d-flex align-items-center mb-4">
          <h2 className="mb-0">{titulo}</h2>
          <div className={`ms-3 flex-grow-1 border-top border-${color}`}></div>
        </div>
        <div className="row">
          {eventos.map((evento) => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className="container py-5">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">Eventos</h1>
        <p className="lead text-muted">
          Descubre nuestras ferias, talleres y cooperativas. ¡Participa y forma parte de nuestra comunidad!
        </p>
      </header>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando eventos...</p>
        </div>
      ) : eventos.length === 0 ? (
        <div className="text-center py-5">
          <div className="alert alert-info">
            <h4>No hay eventos disponibles en este momento</h4>
            <p>Vuelve a consultar más tarde para ver nuevos eventos.</p>
          </div>
        </div>
      ) : (
        <>
          <CategoriaSection titulo="Ferias" eventos={ferias} color="success" />
          <CategoriaSection titulo="Talleres" eventos={talleres} color="warning" />
          <CategoriaSection titulo="Cooperativas" eventos={cooperativas} color="primary" />
        </>
      )}

      {/* Banner informativo */}
      <div className="card bg-light border-0 rounded-4 p-4 mt-5">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h3>¿Quieres proponer un evento?</h3>
            <p className="mb-md-0">
              Si tienes una idea para una feria, taller o cooperativa, nos encantaría conocerla.
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <button className="btn btn-primary rounded-pill px-4 py-2" onClick={() => setShowPropuestaModal(true)}>
              Contactar
            </button>
          </div>
        </div>
      </div>

      {/* Modal para proponer evento */}
      {showPropuestaModal && (
        <PropuestaEventoModal onClose={() => setShowPropuestaModal(false)} onSubmit={handlePropuestaSubmit} />
      )}

      {/* Modal para inscripción */}
      {showInscripcionModal && eventoSeleccionado && (
        <InscripcionModal
          evento={eventoSeleccionado}
          onClose={() => {
            setShowInscripcionModal(false)
            setEventoSeleccionado(null)
          }}
          onSubmit={handleInscripcionSubmit}
        />
      )}


    </div>
  )
}

export default VerEvento

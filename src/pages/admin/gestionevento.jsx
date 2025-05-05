"use client"

import { useState, useEffect } from "react"
import { ref, set, push, onValue, update, get } from "firebase/database"
import { database } from "../../scripts/firebase/firebase"
import { AdminNav } from "../../scripts/components/adminNav"

function GestionEvento() {
  const [eventos, setEventos] = useState([])
  const [modoEdicion, setModoEdicion] = useState(false)
  const [eventoIdEdicion, setEventoIdEdicion] = useState(null)
  const [mostrarPreview, setMostrarPreview] = useState(false)
  const [imagenPreview, setImagenPreview] = useState(null)
  const [participantesEvento, setParticipantesEvento] = useState(null)
  const [solicitudesEvento, setSolicitudesEvento] = useState(null)
  const [mostrarParticipantes, setMostrarParticipantes] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)

  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    hora: "",
    cuposTotal: 0,
    categoria: "feria", // Valor por defecto
    imagen: "/placeholder.svg",
    ubicacion: "", // Nuevo campo para la ubicación
  })

  useEffect(() => {
    // Cargar eventos
    const eventosRef = ref(database, "eventos")
    onValue(eventosRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const eventosList = Object.keys(data).map((id) => ({ id, ...data[id] }))
        setEventos(eventosList)
      } else {
        setEventos([])
      }
    })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNuevoEvento((prev) => ({
      ...prev,
      [name]: name === "cuposTotal" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // En un entorno real, aquí subirías la imagen a Firebase Storage
      // Por ahora, solo creamos una URL temporal para la vista previa
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagenPreview(event.target.result)
        setNuevoEvento((prev) => ({
          ...prev,
          imagen: event.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const togglePreview = () => {
    setMostrarPreview(!mostrarPreview)
  }

  const crearEvento = async () => {
    const { nombre, descripcion, fecha, hora, cuposTotal, categoria, imagen, ubicacion } = nuevoEvento

    if (!nombre || !descripcion || !fecha || !hora || cuposTotal <= 0 || !categoria || !ubicacion) {
      alert("Por favor complete todos los campos correctamente")
      return
    }

    const nuevoEventoCompleto = {
      ...nuevoEvento,
      cuposDisponibles: cuposTotal,
      estado: "activo",
      imagen: imagen || "/placeholder.svg",
      participantes: {},
      solicitudes: {},
    }

    try {
      if (modoEdicion && eventoIdEdicion) {
        // Actualizar evento existente
        const eventoRef = ref(database, `eventos/${eventoIdEdicion}`)
        await update(eventoRef, nuevoEventoCompleto)
        setModoEdicion(false)
        setEventoIdEdicion(null)
      } else {
        // Crear nuevo evento
        const eventosRef = ref(database, "eventos")
        const nuevoRef = push(eventosRef)
        await set(nuevoRef, nuevoEventoCompleto)
      }

      // Resetear el formulario
      setNuevoEvento({
        nombre: "",
        descripcion: "",
        fecha: "",
        hora: "",
        cuposTotal: 0,
        categoria: "feria",
        imagen: "/placeholder.svg",
        ubicacion: "",
      })
      setImagenPreview(null)
      setMostrarPreview(false)
    } catch (error) {
      console.error("Error al gestionar evento:", error)
    }
  }

  const editarEvento = async (id) => {
    try {
      const eventoRef = ref(database, `eventos/${id}`)
      const snapshot = await get(eventoRef)

      if (snapshot.exists()) {
        const eventoData = snapshot.val()
        setNuevoEvento({
          nombre: eventoData.nombre || "",
          descripcion: eventoData.descripcion || "",
          fecha: eventoData.fecha || "",
          hora: eventoData.hora || "",
          cuposTotal: eventoData.cuposTotal || 0,
          categoria: eventoData.categoria || "feria",
          imagen: eventoData.imagen || "/placeholder.svg",
          ubicacion: eventoData.ubicacion || "",
        })

        setImagenPreview(eventoData.imagen)
        setModoEdicion(true)
        setEventoIdEdicion(id)
        setMostrarPreview(true)

        // Scroll hacia el formulario
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    } catch (error) {
      console.error("Error al cargar evento para edición:", error)
    }
  }

  const cancelarEdicion = () => {
    setNuevoEvento({
      nombre: "",
      descripcion: "",
      fecha: "",
      hora: "",
      cuposTotal: 0,
      categoria: "feria",
      imagen: "/placeholder.svg",
      ubicacion: "",
    })
    setImagenPreview(null)
    setModoEdicion(false)
    setEventoIdEdicion(null)
    setMostrarPreview(false)
  }

  const verParticipantes = async (id) => {
    try {
      const evento = eventos.find((e) => e.id === id)
      if (!evento) return

      setEventoSeleccionado(evento)

      // Cargar participantes y solicitudes
      const participantesRef = ref(database, `eventos/${id}/participantes`)
      const solicitudesRef = ref(database, `eventos/${id}/solicitudes`)

      const participantesSnapshot = await get(participantesRef)
      const solicitudesSnapshot = await get(solicitudesRef)

      const participantesData = participantesSnapshot.val() || {}
      const solicitudesData = solicitudesSnapshot.val() || {}

      setParticipantesEvento(
        Object.entries(participantesData).map(([id, data]) => ({
          id,
          ...data,
        })),
      )

      setSolicitudesEvento(
        Object.entries(solicitudesData).map(([id, data]) => ({
          id,
          ...data,
        })),
      )

      setMostrarParticipantes(true)

      // Crear notificación para el administrador con enlace a ver participantes
      const notificacionesAdminRef = ref(database, "notificaciones/admin")
      const nuevaNotificacionRef = push(notificacionesAdminRef)

      await set(nuevaNotificacionRef, {
        tipo: "ver_participantes",
        titulo: "Lista de participantes",
        mensaje: `Ver participantes del evento: ${evento.nombre}`,
        eventoId: id,
        leida: false,
        fechaCreacion: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error al cargar participantes:", error)
    }
  }

  const aprobarSolicitud = async (usuarioId) => {
    try {
      if (!eventoSeleccionado) return

      // Obtener datos de la solicitud
      const solicitudRef = ref(database, `eventos/${eventoSeleccionado.id}/solicitudes/${usuarioId}`)
      const solicitudSnapshot = await get(solicitudRef)

      if (!solicitudSnapshot.exists()) {
        alert("La solicitud ya no existe")
        return
      }

      const solicitudData = solicitudSnapshot.val()

      // Verificar cupos disponibles
      if (eventoSeleccionado.cuposDisponibles <= 0) {
        alert("No hay cupos disponibles para este evento")
        return
      }

      // Actualizar estado de la solicitud
      await update(solicitudRef, {
        estado: "aprobada",
      })

      // Añadir a participantes
      const participanteRef = ref(database, `eventos/${eventoSeleccionado.id}/participantes/${usuarioId}`)
      await set(participanteRef, {
        usuarioId: solicitudData.usuarioId,
        usuarioNombre: solicitudData.usuarioNombre,
        usuarioEmail: solicitudData.usuarioEmail,
        fechaAprobacion: new Date().toISOString(),
      })

      // Actualizar cupos disponibles
      const eventoRef = ref(database, `eventos/${eventoSeleccionado.id}`)
      await update(eventoRef, {
        cuposDisponibles: eventoSeleccionado.cuposDisponibles - 1,
      })

      // Crear notificación para el usuario
      const notificacionUsuarioRef = ref(database, `notificaciones/usuarios/${usuarioId}`)
      const nuevaNotificacionRef = push(notificacionUsuarioRef)

      await set(nuevaNotificacionRef, {
        tipo: "solicitud_aprobada",
        titulo: "Solicitud aprobada",
        mensaje: `Tu solicitud para participar en "${eventoSeleccionado.nombre}" ha sido aprobada.`,
        eventoId: eventoSeleccionado.id,
        leida: false,
        fechaCreacion: new Date().toISOString(),
      })

      // Actualizar la vista
      verParticipantes(eventoSeleccionado.id)

      alert("Solicitud aprobada correctamente")
    } catch (error) {
      console.error("Error al aprobar solicitud:", error)
      alert("Error al aprobar la solicitud")
    }
  }

  const rechazarSolicitud = async (usuarioId) => {
    try {
      if (!eventoSeleccionado) return

      // Actualizar estado de la solicitud
      const solicitudRef = ref(database, `eventos/${eventoSeleccionado.id}/solicitudes/${usuarioId}`)
      await update(solicitudRef, {
        estado: "rechazada",
      })

      // Crear notificación para el usuario
      const notificacionUsuarioRef = ref(database, `notificaciones/usuarios/${usuarioId}`)
      const nuevaNotificacionRef = push(notificacionUsuarioRef)

      await set(nuevaNotificacionRef, {
        tipo: "solicitud_rechazada",
        titulo: "Solicitud rechazada",
        mensaje: `Tu solicitud para participar en "${eventoSeleccionado.nombre}" ha sido rechazada.`,
        eventoId: eventoSeleccionado.id,
        leida: false,
        fechaCreacion: new Date().toISOString(),
      })

      // Actualizar la vista
      verParticipantes(eventoSeleccionado.id)

      alert("Solicitud rechazada")
    } catch (error) {
      console.error("Error al rechazar solicitud:", error)
      alert("Error al rechazar la solicitud")
    }
  }

  const getCategoriaLabel = (categoria) => {
    switch (categoria) {
      case "feria":
        return "Feria"
      case "cooperativa":
        return "Cooperativa"
      case "taller":
        return "Taller"
      default:
        return "Evento"
    }
  }

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

  return (
    <div className="container-md">
      <div className="row">
        <AdminNav />
        <div className="col-lg-9 col-md-8 col-12">
          <div className="py-5 p-md-6 p-lg-10">
            <h1 className="mb-4">{modoEdicion ? "Editar Evento" : "Crear Nuevo Evento"}</h1>

            {/* Formulario de evento */}
            <div className="card p-4 shadow-sm rounded-4 mb-5">
              <div className="mb-3">
                <label className="form-label">Tipo de evento</label>
                <select
                  className="form-select"
                  name="categoria"
                  value={nuevoEvento.categoria}
                  onChange={handleInputChange}
                >
                  <option value="feria">Feria</option>
                  <option value="cooperativa">Cooperativa</option>
                  <option value="taller">Taller</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre del evento</label>
                <input
                  className="form-control"
                  type="text"
                  name="nombre"
                  placeholder="Nombre del evento"
                  value={nuevoEvento.nombre}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  name="descripcion"
                  placeholder="Descripción"
                  value={nuevoEvento.descripcion}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              {/* Nuevo campo para ubicación */}
              <div className="mb-3">
                <label className="form-label">Ubicación</label>
                <input
                  className="form-control"
                  type="text"
                  name="ubicacion"
                  placeholder="Dirección o lugar del evento"
                  value={nuevoEvento.ubicacion}
                  onChange={handleInputChange}
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Fecha</label>
                  <input
                    className="form-control"
                    type="date"
                    name="fecha"
                    value={nuevoEvento.fecha}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Hora</label>
                  <input
                    className="form-control"
                    type="time"
                    name="hora"
                    value={nuevoEvento.hora}
                    onChange={handleInputChange}
                  />
                </div>
                
              </div>

              <div className="mb-3">
                <label className="form-label">Cupos Totales</label>
                <input
                  className="form-control"
                  type="number"
                  name="cuposTotal"
                  placeholder="Cupos Totales"
                  value={nuevoEvento.cuposTotal}
                  onChange={handleInputChange}
                  min={1}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Imagen del evento</label>
                <input className="form-control" type="file" accept="image/*" onChange={handleImagenChange} />
                {imagenPreview && (
                  <div className="mt-2">
                    <img
                      src={imagenPreview || "/placeholder.svg"}
                      alt="Vista previa"
                      className="img-thumbnail"
                      style={{ maxHeight: "150px" }}
                    />
                  </div>
                )}
              </div>

              <div className="d-flex gap-2 mb-3">
                <button className="btn btn-outline-secondary" onClick={togglePreview}>
                  {mostrarPreview ? "Ocultar vista previa" : "Mostrar vista previa"}
                </button>
              </div>

              {mostrarPreview && (
                <div className="card p-3 shadow-sm rounded-4 mb-4 border-primary">
                  <h5 className="text-center mb-3">Vista Previa</h5>
                  <div className="text-center mb-3">
                    <img
                      src={imagenPreview || nuevoEvento.imagen || "/placeholder.svg"}
                      alt="Imagen del evento"
                      className="img-fluid rounded"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                  <h4>{nuevoEvento.nombre || "Nombre del evento"}</h4>
                  <span className={`badge bg-${getCategoriaColor(nuevoEvento.categoria)} mb-2`}>
                    {getCategoriaLabel(nuevoEvento.categoria)}
                  </span>
                  <p>{nuevoEvento.descripcion || "Descripción del evento"}</p>
                  <p>
                    <strong>Ubicación:</strong> {nuevoEvento.ubicacion || "Por definir"}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {nuevoEvento.fecha || "Pendiente"}
                  </p>
                  <p>
                    <strong>Hora:</strong> {nuevoEvento.hora || "Pendiente"}
                  </p>
                  <p>
                    <strong>Cupos:</strong> {nuevoEvento.cuposTotal || 0} disponibles
                  </p>
                </div>
              )}

              <div className="d-flex gap-2">
                {modoEdicion ? (
                  <>
                    <button className="btn btn-primary flex-grow-1" onClick={crearEvento}>
                      Guardar Cambios
                    </button>
                    <button className="btn btn-outline-secondary" onClick={cancelarEdicion}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button className="btn btn-success w-100" onClick={crearEvento}>
                    Crear Evento
                  </button>
                )}
              </div>
            </div>

            {/* Modal de participantes */}
            {mostrarParticipantes && eventoSeleccionado && (
              <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content rounded-4">
                    <div className="modal-header">
                      <h5 className="modal-title">Participantes y Solicitudes - {eventoSeleccionado.nombre}</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          setMostrarParticipantes(false)
                          setEventoSeleccionado(null)
                          setParticipantesEvento(null)
                          setSolicitudesEvento(null)
                        }}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                          <a className="nav-link active" data-bs-toggle="tab" href="#solicitudes">
                            Solicitudes pendientes (
                            {solicitudesEvento?.filter((s) => s.estado === "pendiente").length || 0})
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" data-bs-toggle="tab" href="#participantes">
                            Participantes ({participantesEvento?.length || 0})
                          </a>
                        </li>
                      </ul>

                      <div className="tab-content">
                        <div className="tab-pane fade show active" id="solicitudes">
                          {solicitudesEvento?.filter((s) => s.estado === "pendiente").length === 0 ? (
                            <div className="alert alert-info">No hay solicitudes pendientes</div>
                          ) : (
                            <div className="list-group">
                              {solicitudesEvento
                                ?.filter((s) => s.estado === "pendiente")
                                .map((solicitud) => (
                                  <div key={solicitud.id} className="list-group-item list-group-item-action">
                                    <div className="d-flex w-100 justify-content-between align-items-center">
                                      <div>
                                        <h6 className="mb-1">{solicitud.usuarioNombre}</h6>
                                        <p className="mb-1 text-muted small">{solicitud.usuarioEmail}</p>
                                        {solicitud.mensaje && <p className="mb-1">{solicitud.mensaje}</p>}
                                        <small className="text-muted">
                                          Solicitado: {new Date(solicitud.fechaCreacion).toLocaleString()}
                                        </small>
                                      </div>
                                      <div className="d-flex gap-2">
                                        <button
                                          className="btn btn-sm btn-success"
                                          onClick={() => aprobarSolicitud(solicitud.usuarioId)}
                                        >
                                          Aprobar
                                        </button>
                                        <button
                                          className="btn btn-sm btn-danger"
                                          onClick={() => rechazarSolicitud(solicitud.usuarioId)}
                                        >
                                          Rechazar
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                        <div className="tab-pane fade" id="participantes">
                          {participantesEvento?.length === 0 ? (
                            <div className="alert alert-info">No hay participantes registrados</div>
                          ) : (
                            <div className="list-group">
                              {participantesEvento?.map((participante) => (
                                <div key={participante.id} className="list-group-item">
                                  <div className="d-flex w-100 justify-content-between align-items-center">
                                    <div>
                                      <h6 className="mb-1">{participante.usuarioNombre}</h6>
                                      <p className="mb-1 text-muted small">{participante.usuarioEmail}</p>
                                      <small className="text-muted">
                                        Aprobado: {new Date(participante.fechaAprobacion).toLocaleString()}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setMostrarParticipantes(false)
                          setEventoSeleccionado(null)
                          setParticipantesEvento(null)
                          setSolicitudesEvento(null)
                        }}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <h2 className="mb-4">Eventos Existentes</h2>
            <div className="row">
              {eventos.map((evento) => (
                <div key={evento.id} className="col-md-6 mb-4">
                  <div className="card p-3 shadow-sm rounded-4 h-100">
                    <div className="text-center mb-3">
                      <img
                        src={evento.imagen || "/placeholder.svg"}
                        alt={evento.nombre}
                        className="img-fluid rounded"
                        style={{ maxHeight: "150px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5>{evento.nombre}</h5>
                      <span className={`badge bg-${getCategoriaColor(evento.categoria || "feria")}`}>
                        {getCategoriaLabel(evento.categoria || "feria")}
                      </span>
                    </div>
                    <p>{evento.descripcion}</p>
                    {evento.ubicacion && (
                      <p>
                        <strong>Ubicación:</strong> {evento.ubicacion}
                      </p>
                    )}
                    <p>
                      <strong>Fecha:</strong> {evento.fecha}
                    </p>
                    <p>
                      <strong>Hora:</strong> {evento.hora}
                    </p>
                    <p>
                      <strong>Cupos:</strong> {evento.cuposDisponibles} / {evento.cuposTotal}
                    </p>
                    <span className="badge bg-success text-uppercase mb-3">{evento.estado}</span>

                    <div className="mt-auto d-flex gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => editarEvento(evento.id)}>
                        Editar
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => verParticipantes(evento.id)}>
                        Participantes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GestionEvento

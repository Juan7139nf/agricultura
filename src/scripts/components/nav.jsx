"use client"

import { Container, Dropdown, Nav, Navbar, NavDropdown, Offcanvas } from "react-bootstrap"
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded"
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded"
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded"
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded"
import CrueltyFreeIcon from "@mui/icons-material/CrueltyFree"
import { NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import { handleLogout } from "../../pages/authentication/logout"
import { obtenerUsuarioDeLocalStorage } from "../customs/localStorage"
import { getAuth } from "firebase/auth"
import { database, onValue, ref, update, get, push, set } from "../firebase/firebase"
import SolicitudModal from "../../pages/admin/solicitudmodal"
import ParticipantesModal from "../../pages/admin/participantesmodal"

const Navegador = ({ expand, show, handleClose }) => {
  const ini = obtenerUsuarioDeLocalStorage()
  const [iniC, setIni] = useState(null) // estado para los datos del usuario
  const [notificaciones, setNotificaciones] = useState([])
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0)
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false)
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null)
  const [mostrarSolicitudModal, setMostrarSolicitudModal] = useState(false)
  const [mostrarParticipantesModal, setMostrarParticipantesModal] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)
  const [participantes, setParticipantes] = useState([])
  const auth = getAuth()
  const user = auth.currentUser

  useEffect(() => {
    if (!ini) return

    const userRef = ref(database, `usuarios/${ini.uid}`)

    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const datos = snapshot.val()
        setIni(datos) // actualiza el estado ini con los datos del usuario
      } else {
        console.warn("Usuario no encontrado en la base de datos.")
        setIni(null)
      }
    })

    // Cargar notificaciones del usuario
    const notificacionesRef = ref(database, `notificaciones/usuarios/${ini.uid}`)
    let notificacionesAdminRef = null
    let notificacionesAdminUnsubscribe = null

    // Verificar si el usuario es administrador
    const esAdmin = iniC && iniC.roles && iniC.roles.includes("administrador")

    if (esAdmin) {
      // Si es administrador, también cargar notificaciones de admin
      notificacionesAdminRef = ref(database, "notificaciones/admin")

      notificacionesAdminUnsubscribe = onValue(notificacionesAdminRef, (snapshot) => {
        if (snapshot.exists()) {
          const notificacionesData = snapshot.val()
          const notificacionesList = Object.keys(notificacionesData)
            .map((id) => ({
              id,
              ...notificacionesData[id],
              esNotificacionAdmin: true, // Marcar como notificación de admin
            }))
            .sort((a, b) => {
              if (!a.fechaCreacion) return 1
              if (!b.fechaCreacion) return -1
              return new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
            })

          // Combinar con las notificaciones de usuario existentes
          setNotificaciones((prevNotificaciones) => {
            // Filtrar las notificaciones de usuario (sin la marca esNotificacionAdmin)
            const notificacionesUsuario = prevNotificaciones.filter((n) => !n.esNotificacionAdmin)
            // Combinar y ordenar por fecha
            return [...notificacionesUsuario, ...notificacionesList].sort((a, b) => {
              if (!a.fechaCreacion) return 1
              if (!b.fechaCreacion) return -1
              return new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
            })
          })

          // Actualizar contador de no leídas
          setNotificacionesNoLeidas((prevCount) => {
            const adminNoLeidas = notificacionesList.filter((notif) => !notif.leida).length
            // Obtener solo las no leídas de usuario del estado actual
            const usuarioNoLeidas = notificaciones.filter((n) => !n.esNotificacionAdmin && !n.leida).length
            return usuarioNoLeidas + adminNoLeidas
          })
        }
      })
    }

    const notificacionesUsuarioUnsubscribe = onValue(notificacionesRef, (snapshot) => {
      if (snapshot.exists()) {
        const notificacionesData = snapshot.val()
        const notificacionesList = Object.keys(notificacionesData)
          .map((id) => ({
            id,
            ...notificacionesData[id],
            esNotificacionAdmin: false, // Marcar como notificación de usuario
          }))
          .sort((a, b) => {
            // Ordenar por fecha (más recientes primero)
            if (!a.fechaCreacion) return 1
            if (!b.fechaCreacion) return -1
            return new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
          })

        // Si es admin, combinar con las notificaciones de admin existentes
        if (esAdmin) {
          setNotificaciones((prevNotificaciones) => {
            // Filtrar las notificaciones de admin
            const notificacionesAdmin = prevNotificaciones.filter((n) => n.esNotificacionAdmin)
            // Combinar y ordenar por fecha
            return [...notificacionesAdmin, ...notificacionesList].sort((a, b) => {
              if (!a.fechaCreacion) return 1
              if (!b.fechaCreacion) return -1
              return new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
            })
          })

          // Actualizar contador de no leídas
          setNotificacionesNoLeidas((prevCount) => {
            const usuarioNoLeidas = notificacionesList.filter((notif) => !notif.leida).length
            // Obtener solo las no leídas de admin del estado actual
            const adminNoLeidas = notificaciones.filter((n) => n.esNotificacionAdmin && !n.leida).length
            return usuarioNoLeidas + adminNoLeidas
          })
        } else {
          // Si no es admin, solo mostrar notificaciones de usuario
          setNotificaciones(notificacionesList)
          // Contar notificaciones no leídas
          const noLeidas = notificacionesList.filter((notif) => !notif.leida).length
          setNotificacionesNoLeidas(noLeidas)
        }
      } else if (!esAdmin) {
        // Si no hay notificaciones y no es admin, limpiar
        setNotificaciones([])
        setNotificacionesNoLeidas(0)
      } else {
        // Si no hay notificaciones pero es admin, mantener solo las de admin
        setNotificaciones((prevNotificaciones) => prevNotificaciones.filter((n) => n.esNotificacionAdmin))
        setNotificacionesNoLeidas(notificaciones.filter((n) => n.esNotificacionAdmin && !n.leida).length)
      }
    })

    return () => {
      unsubscribe() // limpia el listener cuando el componente se desmonta
      notificacionesUsuarioUnsubscribe()
      if (notificacionesAdminUnsubscribe) {
        notificacionesAdminUnsubscribe()
      }
    }
  }, [ini, iniC])

  // Marcar notificación como leída
  const marcarComoLeida = (notificacionId, esAdmin = false) => {
    if (!ini) return

    const path = esAdmin
      ? `notificaciones/admin/${notificacionId}`
      : `notificaciones/usuarios/${ini.uid}/${notificacionId}`

    const notificacionRef = ref(database, path)
    update(notificacionRef, { leida: true })
  }

  // Marcar todas como leídas
  const marcarTodasComoLeidas = () => {
    if (!ini || notificaciones.length === 0) return

    const updates = {}
    const esAdmin = iniC && iniC.roles && iniC.roles.includes("administrador")

    notificaciones.forEach((notif) => {
      if (!notif.leida) {
        if (notif.esNotificacionAdmin && esAdmin) {
          updates[`notificaciones/admin/${notif.id}/leida`] = true
        } else if (!notif.esNotificacionAdmin) {
          updates[`notificaciones/usuarios/${ini.uid}/${notif.id}/leida`] = true
        }
      }
    })

    update(ref(database), updates)
  }

  // Manejar clic en notificación
  const handleNotificacionClick = async (notif) => {
    // Marcar como leída
    marcarComoLeida(notif.id, notif.esNotificacionAdmin)

    // Si es una notificación de solicitud de participación y es admin
    if (
      notif.tipo === "solicitud_participacion" &&
      notif.esNotificacionAdmin &&
      iniC?.roles?.includes("administrador")
    ) {
      try {
        // Obtener datos del evento
        const eventoRef = ref(database, `eventos/${notif.eventoId}`)
        const eventoSnapshot = await get(eventoRef)

        if (!eventoSnapshot.exists()) {
          alert("El evento ya no existe")
          return
        }

        const eventoData = eventoSnapshot.val()

        // Obtener datos de la solicitud
        const solicitudRef = ref(database, `eventos/${notif.eventoId}/solicitudes/${notif.usuarioId}`)
        const solicitudSnapshot = await get(solicitudRef)

        if (!solicitudSnapshot.exists()) {
          alert("La solicitud ya no existe")
          return
        }

        const solicitudData = solicitudSnapshot.val()

        // Preparar datos para el modal
        setSolicitudSeleccionada({
          id: notif.usuarioId,
          eventoId: notif.eventoId,
          evento: {
            id: notif.eventoId,
            nombre: eventoData.nombre,
            cuposDisponibles: eventoData.cuposDisponibles,
            ...eventoData,
          },
          ...solicitudData,
        })

        // Mostrar modal
        setMostrarSolicitudModal(true)
      } catch (error) {
        console.error("Error al cargar datos de la solicitud:", error)
        alert("Error al cargar los datos de la solicitud")
      }
    }
    // Si es una notificación de participantes
    else if (
      notif.tipo === "ver_participantes" &&
      notif.esNotificacionAdmin &&
      iniC?.roles?.includes("administrador")
    ) {
      try {
        // Obtener datos del evento
        const eventoRef = ref(database, `eventos/${notif.eventoId}`)
        const eventoSnapshot = await get(eventoRef)

        if (!eventoSnapshot.exists()) {
          alert("El evento ya no existe")
          return
        }

        const eventoData = eventoSnapshot.val()

        // Obtener participantes
        const participantesRef = ref(database, `eventos/${notif.eventoId}/participantes`)
        const participantesSnapshot = await get(participantesRef)

        const participantesData = participantesSnapshot.val() || {}
        const participantesList = Object.keys(participantesData).map((id) => ({
          id,
          ...participantesData[id],
        }))

        // Preparar datos para el modal
        setEventoSeleccionado({
          id: notif.eventoId,
          nombre: eventoData.nombre,
          ...eventoData,
        })

        setParticipantes(participantesList)

        // Mostrar modal
        setMostrarParticipantesModal(true)
      } catch (error) {
        console.error("Error al cargar participantes:", error)
        alert("Error al cargar los participantes del evento")
      }
    }
  }

  // Aprobar solicitud
  const aprobarSolicitud = async (solicitud) => {
    try {
      // Verificar cupos disponibles
      if (solicitud.evento.cuposDisponibles <= 0) {
        alert("No hay cupos disponibles para este evento")
        return
      }

      // Actualizar estado de la solicitud
      const solicitudRef = ref(database, `eventos/${solicitud.eventoId}/solicitudes/${solicitud.id}`)
      await update(solicitudRef, {
        estado: "aprobada",
      })

      // Añadir a participantes
      const participanteRef = ref(database, `eventos/${solicitud.eventoId}/participantes/${solicitud.id}`)
      await set(participanteRef, {
        usuarioId: solicitud.usuarioId,
        usuarioNombre: solicitud.usuarioNombre,
        usuarioEmail: solicitud.usuarioEmail,
        fechaAprobacion: new Date().toISOString(),
      })

      // Actualizar cupos disponibles
      const eventoRef = ref(database, `eventos/${solicitud.eventoId}`)
      await update(eventoRef, {
        cuposDisponibles: solicitud.evento.cuposDisponibles - 1,
      })

      // Crear notificación para el usuario
      const notificacionUsuarioRef = ref(database, `notificaciones/usuarios/${solicitud.usuarioId}`)
      const nuevaNotificacionRef = push(notificacionUsuarioRef)

      await set(nuevaNotificacionRef, {
        tipo: "solicitud_aprobada",
        titulo: "Solicitud aprobada",
        mensaje: `Tu solicitud para participar en "${solicitud.evento.nombre}" ha sido aprobada.`,
        eventoId: solicitud.eventoId,
        leida: false,
        fechaCreacion: new Date().toISOString(),
      })

      // Cerrar modal
      setMostrarSolicitudModal(false)
      setSolicitudSeleccionada(null)

      alert("Solicitud aprobada correctamente")
    } catch (error) {
      console.error("Error al aprobar solicitud:", error)
      alert("Error al aprobar la solicitud")
    }
  }

  // Rechazar solicitud
  const rechazarSolicitud = async (solicitud) => {
    try {
      // Actualizar estado de la solicitud
      const solicitudRef = ref(database, `eventos/${solicitud.eventoId}/solicitudes/${solicitud.id}`)
      await update(solicitudRef, {
        estado: "rechazada",
      })

      // Crear notificación para el usuario
      const notificacionUsuarioRef = ref(database, `notificaciones/usuarios/${solicitud.usuarioId}`)
      const nuevaNotificacionRef = push(notificacionUsuarioRef)

      await set(nuevaNotificacionRef, {
        tipo: "solicitud_rechazada",
        titulo: "Solicitud rechazada",
        mensaje: `Tu solicitud para participar en "${solicitud.evento.nombre}" ha sido rechazada.`,
        eventoId: solicitud.eventoId,
        leida: false,
        fechaCreacion: new Date().toISOString(),
      })

      // Cerrar modal
      setMostrarSolicitudModal(false)
      setSolicitudSeleccionada(null)

      alert("Solicitud rechazada")
    } catch (error) {
      console.error("Error al rechazar solicitud:", error)
      alert("Error al rechazar la solicitud")
    }
  }

  return (
    <>
      <Navbar key={expand} expand={expand} className="bg-body py-0 py-md-2">
        <Container fluid="lg">
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="start"
            show={show}
            onHide={handleClose}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className="d-flex align-content-center">
                <CrueltyFreeIcon sx={{ fontSize: 50 }} />
                <span className="h1 fw-bolder">AgroShop</span>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-start flex-grow-1 pe-3">
                <NavLink className="nav-link" to={"/"}>
                  Inicio
                </NavLink>
                <NavLink className="nav-link" to={"/productos"}>
                  Productos
                </NavLink>
                <NavLink className="nav-link" to={"/eventos"}>
                  Eventos
                </NavLink>
                {iniC && iniC.roles && iniC.roles.some((role) => role !== "cliente") && (
                  <NavDropdown title="Panel administrativo" id={`offcanvasNavbarDropdown-expand-${expand}`}>
                    {iniC.roles.some((role) => role == "productor") && (
                      <NavLink className="dropdown-item" to={"/productor"}>
                        Productor
                      </NavLink>
                    )}
                    {iniC.roles.some((role) => role == "comerciante") && (
                      <NavLink className="dropdown-item" to={"/productor"}>
                        Comerciante
                      </NavLink>
                    )}
                    <NavDropdown.Divider />
                    {iniC.roles.some((role) => role == "administrador") && (
                      <NavLink className="dropdown-item" to={"/adminicio"}>
                        Administracion
                      </NavLink>
                    )}
                  </NavDropdown>
                )}
              </Nav>
              <hr className="d-lg-none my-2 text-white-50"></hr>
              <Nav className="justify-content-end">
                {ini ? (
                  <>
                    <NavLink className="nav-link d-flex position-relative me-3" to={"/cart"}>
                      <ShoppingCartRoundedIcon />
                      <span className="d-block d-md-none ms-1">Carrito</span>
                      {iniC?.carrito && (
                        <>
                          <span className="custom-badge position-absolute start-100 translate-middle badge rounded-pill bg-success d-none d-md-block">
                            {iniC?.carrito
                              ? Object.values(iniC.carrito).reduce((total, prod) => total + (prod.cantidad || 0), 0)
                              : 0}
                          </span>
                          <span className="ms-2 fw-bolder px-2 rounded-pill bg-success d-block d-md-none">
                            {iniC?.carrito
                              ? Object.values(iniC.carrito).reduce((total, prod) => total + (prod.cantidad || 0), 0)
                              : 0}
                          </span>
                        </>
                      )}
                    </NavLink>

                    {/* Icono de Notificaciones */}
                    <Dropdown align="end" className="me-3">
                      <Dropdown.Toggle
                        variant="link"
                        className="nav-link d-flex position-relative py-0 align-content-center border-0 bg-transparent"
                        id="dropdown-notifications"
                      >
                        <div className="position-relative">
                          <NotificationsRoundedIcon />
                          {notificacionesNoLeidas > 0 && (
                            <span className="custom-badge position-absolute start-100 translate-middle badge rounded-pill bg-danger d-none d-md-block">
                              {notificacionesNoLeidas}
                            </span>
                          )}
                        </div>
                        <span className="d-block d-md-none ms-1 my-auto">
                          Notificaciones
                          {notificacionesNoLeidas > 0 && (
                            <span className="ms-2 fw-bolder px-2 rounded-pill bg-danger d-block d-md-none">
                              {notificacionesNoLeidas}
                            </span>
                          )}
                        </span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="dropdown-menu-end notification-dropdown">
                        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                          <h6 className="mb-0">Notificaciones</h6>
                          {notificacionesNoLeidas > 0 && (
                            <button className="btn btn-sm text-primary p-0" onClick={marcarTodasComoLeidas}>
                              Marcar todas como leídas
                            </button>
                          )}
                        </div>
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                          {notificaciones.length === 0 ? (
                            <Dropdown.Item disabled>No tienes notificaciones</Dropdown.Item>
                          ) : (
                            notificaciones.map((notif) => (
                              <Dropdown.Item
                                key={notif.id}
                                className={notif.leida ? "" : "bg-light"}
                                onClick={() => handleNotificacionClick(notif)}
                              >
                                <div className="d-flex flex-column">
                                  {notif.esNotificacionAdmin && <span className="badge bg-primary mb-1">Admin</span>}
                                  <strong>{notif.titulo}</strong>
                                  <small>{notif.mensaje}</small>
                                  <small className="text-muted">{new Date(notif.fechaCreacion).toLocaleString()}</small>
                                </div>
                              </Dropdown.Item>
                            ))
                          )}
                        </div>
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-center">
                          <NavLink to="/notificaciones" className="text-decoration-none">
                            Ver todas
                          </NavLink>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown align="end">
                      <Dropdown.Toggle
                        variant="link"
                        className="nav-link d-flex position-relative py-0 align-content-center border-0 bg-transparent"
                        id="dropdown-user"
                      >
                        {ini.photoURL ? (
                          <img
                            src={ini.photoURL || "/placeholder.svg"}
                            alt="Usuario"
                            width={40}
                            height={40}
                            className="rounded-circle"
                          />
                        ) : (
                          <div style={{ minHeight: "40px" }}>
                            <AccountCircleRoundedIcon fontSize="large" />
                          </div>
                        )}
                        <span className="d-block d-md-none ms-1 my-auto">{ini.displayName}</span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item disabled>Editar perfil</Dropdown.Item>
                        <Dropdown.Item disabled>Configuraciones</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                ) : (
                  <>
                    <NavLink className="nav-link d-flex position-relative" to={"/login"}>
                      <ErrorRoundedIcon className="text-danger" />
                      <span className="text-danger fw-bolder ms-1">Iniciar sesion</span>
                    </NavLink>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* Modal de Solicitud */}
      {mostrarSolicitudModal && solicitudSeleccionada && (
        <SolicitudModal
          solicitud={solicitudSeleccionada}
          onClose={() => {
            setMostrarSolicitudModal(false)
            setSolicitudSeleccionada(null)
          }}
          onAprobar={aprobarSolicitud}
          onRechazar={rechazarSolicitud}
        />
      )}

      {/* Modal de Participantes */}
      {mostrarParticipantesModal && eventoSeleccionado && (
        <ParticipantesModal
          evento={eventoSeleccionado}
          participantes={participantes}
          onClose={() => {
            setMostrarParticipantesModal(false)
            setEventoSeleccionado(null)
            setParticipantes([])
          }}
        />
      )}

      {/* Estilos adicionales para las notificaciones */}
      <style jsx>{`
        .notification-dropdown {
          width: 320px;
        }
        
        @media (max-width: 576px) {
          .notification-dropdown {
            width: 280px;
          }
        }
      `}</style>
    </>
  )
}

export default Navegador;

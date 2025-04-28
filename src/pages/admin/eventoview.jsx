"use client"

import { useState, useEffect } from "react"
import { useParams, NavLink } from "react-router-dom"
import { Calendar, Clock, Users, ArrowLeft, Check, X } from "lucide-react"

// Datos de ejemplo - eventos (los mismos que en gestionevento.jsx)
const eventosIniciales = [
  {
    id: "1",
    nombre: "Feria Agrícola Regional",
    descripcion:
      "Exposición de productos agrícolas locales con oportunidades de networking. Los participantes podrán exhibir sus productos, establecer contactos comerciales y asistir a charlas sobre tendencias del mercado agrícola. Se contará con espacios dedicados para productores y comerciantes, facilitando el intercambio directo entre ambos sectores.",
    fecha: "15 Junio, 2023",
    hora: "09:00 - 18:00",
    cuposDisponibles: 25,
    cuposTotal: 50,
    estado: "activo",
    imagen: "/placeholder.svg",
    participantes: [
      { id: "2", nombre: "Judy Nelson", tipo: "comerciante" },
      { id: "5", nombre: "Rhonda Pinson", tipo: "comerciante" },
      { id: "3", nombre: "John Mattox", tipo: "productor" },
    ],
    solicitudes: [
      { id: "6", nombre: "Ricardo Méndez", tipo: "productor" },
      { id: "9", nombre: "Carlos Ramírez", tipo: "productor" },
    ],
  },
  {
    id: "2",
    nombre: "Taller de Técnicas de Cultivo Sostenible",
    descripcion:
      "Aprende técnicas avanzadas de cultivo sostenible y ecológico. Este taller práctico está dirigido a productores que deseen implementar métodos de agricultura sostenible. Se abordarán temas como rotación de cultivos, control biológico de plagas, compostaje y uso eficiente del agua. Los participantes recibirán material didáctico y certificado de asistencia.",
    fecha: "22 Julio, 2023",
    hora: "10:00 - 14:00",
    cuposDisponibles: 15,
    cuposTotal: 30,
    estado: "activo",
    imagen: "/placeholder.svg",
    participantes: [
      { id: "3", nombre: "John Mattox", tipo: "productor" },
      { id: "6", nombre: "Ricardo Méndez", tipo: "productor" },
    ],
    solicitudes: [{ id: "7", nombre: "María González", tipo: "comerciante" }],
  },
  {
    id: "3",
    nombre: "Encuentro de Productores y Comerciantes",
    descripcion:
      "Espacio para establecer contactos comerciales entre productores y comerciantes del sector agrícola. Este evento facilita la creación de redes comerciales directas, eliminando intermediarios y mejorando los márgenes para ambas partes. Incluye rondas de negociación programadas, presentaciones de productos y oportunidades para establecer acuerdos comerciales a largo plazo.",
    fecha: "5 Agosto, 2023",
    hora: "14:00 - 20:00",
    cuposDisponibles: 0,
    cuposTotal: 40,
    estado: "completo",
    imagen: "/placeholder.svg",
    participantes: [
      { id: "2", nombre: "Judy Nelson", tipo: "comerciante" },
      { id: "5", nombre: "Rhonda Pinson", tipo: "comerciante" },
      { id: "7", nombre: "María González", tipo: "comerciante" },
      { id: "3", nombre: "John Mattox", tipo: "productor" },
      { id: "6", nombre: "Ricardo Méndez", tipo: "productor" },
      { id: "9", nombre: "Carlos Ramírez", tipo: "productor" },
    ],
    solicitudes: [],
  },
]

export default function EventoView() {
  const { id } = useParams()
  const [evento, setEvento] = useState(null)
  const [vistaActual, setVistaActual] = useState("detalles") // detalles, solicitudes, participantes
  const [eventos, setEventos] = useState(eventosIniciales)

  // Cargar el evento según el ID
  useEffect(() => {
    const eventoEncontrado = eventosIniciales.find((e) => e.id === id)
    setEvento(eventoEncontrado)
  }, [id])

  // Función para aceptar una solicitud
  const aceptarSolicitud = (solicitudId) => {
    if (!evento) return

    // Encontrar la solicitud
    const solicitud = evento.solicitudes.find((s) => s.id === solicitudId)
    if (!solicitud) return

    // Actualizar el evento
    const eventoActualizado = {
      ...evento,
      participantes: [...evento.participantes, solicitud],
      solicitudes: evento.solicitudes.filter((s) => s.id !== solicitudId),
      cuposDisponibles: evento.cuposDisponibles - 1,
      estado: evento.cuposDisponibles - 1 <= 0 ? "completo" : "activo",
    }

    // Actualizar el estado
    setEvento(eventoActualizado)

    // Actualizar la lista de eventos
    const eventosActualizados = eventos.map((e) => (e.id === id ? eventoActualizado : e))
    setEventos(eventosActualizados)
  }

  // Función para rechazar una solicitud
  const rechazarSolicitud = (solicitudId) => {
    if (!evento) return

    // Actualizar el evento
    const eventoActualizado = {
      ...evento,
      solicitudes: evento.solicitudes.filter((s) => s.id !== solicitudId),
    }

    // Actualizar el estado
    setEvento(eventoActualizado)

    // Actualizar la lista de eventos
    const eventosActualizados = eventos.map((e) => (e.id === id ? eventoActualizado : e))
    setEventos(eventosActualizados)
  }

  // Si no se encuentra el evento
  if (!evento) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Evento no encontrado</h2>
        <NavLink to="/eventoview" style={{ color: "#3b82f6", textDecoration: "none" }}>
          Volver a la lista de eventos
        </NavLink>
      </div>
    )
  }

  // Estilos en línea
  const styles = {
    container: {
      padding: "1.5rem",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "1.5rem",
    },
    backButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#3b82f6",
      textDecoration: "none",
      fontWeight: "500",
    },
    breadcrumbs: {
      display: "flex",
      gap: "0.5rem",
      fontSize: "0.875rem",
      color: "#6b7280",
    },
    mainContent: {
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
    },
    eventoHeader: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    eventoTitulo: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    eventoEstado: {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    eventoEstadoActivo: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    eventoEstadoCompleto: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
    },
    eventoInfo: {
      display: "flex",
      gap: "2rem",
      flexWrap: "wrap",
    },
    eventoImagen: {
      width: "100%",
      maxWidth: "400px",
      height: "250px",
      objectFit: "cover",
      borderRadius: "0.5rem",
    },
    eventoDetalles: {
      flex: "1",
      minWidth: "300px",
    },
    eventoDescripcion: {
      marginBottom: "1.5rem",
      lineHeight: "1.6",
    },
    eventoMetadatos: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    eventoMetadato: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    tabs: {
      display: "flex",
      borderBottom: "1px solid #e2e8f0",
      marginBottom: "1.5rem",
    },
    tab: {
      padding: "0.75rem 1.5rem",
      cursor: "pointer",
      fontWeight: "500",
      borderBottom: "2px solid transparent",
    },
    tabActive: {
      borderBottomColor: "#3b82f6",
      color: "#3b82f6",
    },
    btn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.5rem 1rem",
      borderRadius: "0.375rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
    },
    btnPrimary: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    btnSuccess: {
      backgroundColor: "#10b981",
      color: "white",
    },
    btnDanger: {
      backgroundColor: "#ef4444",
      color: "white",
    },
    btnOutline: {
      backgroundColor: "transparent",
      border: "1px solid #e2e8f0",
    },
    tablaContainer: {
      overflowX: "auto",
    },
    tabla: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tablaHeader: {
      padding: "0.75rem",
      textAlign: "left",
      borderBottom: "1px solid #e2e8f0",
      backgroundColor: "#f8fafc",
    },
    tablaCell: {
      padding: "0.75rem",
      borderBottom: "1px solid #e2e8f0",
    },
    badgeTipo: {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.25rem 0.5rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "500",
    },
    badgeProductor: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    badgeComerciante: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
    },
    accionesContainer: {
      display: "flex",
      gap: "0.5rem",
    },
    mensajeVacio: {
      padding: "2rem",
      textAlign: "center",
      color: "#6b7280",
      backgroundColor: "#f9fafb",
      borderRadius: "0.5rem",
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <NavLink to="/eventoview" style={styles.backButton}>
          <ArrowLeft size={16} />
          Volver a eventos
        </NavLink>

        {/* Breadcrumbs con NavLink */}
        <div style={styles.breadcrumbs}>
          <NavLink to="/admin" style={({ isActive }) => (isActive ? { color: "#3b82f6", fontWeight: "600" } : {})}>
            Panel
          </NavLink>
          <span> / </span>
          <NavLink
            to="/admin/eventos"
            style={({ isActive }) => (isActive ? { color: "#3b82f6", fontWeight: "600" } : {})}
          >
            Eventos
          </NavLink>
          <span> / </span>
          <span>{evento.nombre}</span>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.eventoHeader}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={styles.eventoTitulo}>{evento.nombre}</h1>
            <span
              style={{
                ...styles.eventoEstado,
                ...(evento.estado === "activo" ? styles.eventoEstadoActivo : styles.eventoEstadoCompleto),
              }}
            >
              {evento.estado === "activo" ? "Activo" : "Completo"}
            </span>
          </div>
        </div>

        <div style={styles.eventoInfo}>
          <img src={evento.imagen || "/placeholder.svg"} alt={evento.nombre} style={styles.eventoImagen} />

          <div style={styles.eventoDetalles}>
            <p style={styles.eventoDescripcion}>{evento.descripcion}</p>

            <div style={styles.eventoMetadatos}>
              <div style={styles.eventoMetadato}>
                <Calendar size={18} />
                <span>Fecha: {evento.fecha}</span>
              </div>
              <div style={styles.eventoMetadato}>
                <Clock size={18} />
                <span>Hora: {evento.hora}</span>
              </div>
              <div style={styles.eventoMetadato}>
                <Users size={18} />
                <span>
                  Cupos: {evento.cuposDisponibles} disponibles de {evento.cuposTotal} totales
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={styles.tabs}>
            <div
              style={{
                ...styles.tab,
                ...(vistaActual === "detalles" ? styles.tabActive : {}),
              }}
              onClick={() => setVistaActual("detalles")}
            >
              Detalles
            </div>
            <div
              style={{
                ...styles.tab,
                ...(vistaActual === "solicitudes" ? styles.tabActive : {}),
              }}
              onClick={() => setVistaActual("solicitudes")}
            >
              Solicitudes de Cupo ({evento.solicitudes.length})
            </div>
            <div
              style={{
                ...styles.tab,
                ...(vistaActual === "participantes" ? styles.tabActive : {}),
              }}
              onClick={() => setVistaActual("participantes")}
            >
              Participantes ({evento.participantes.length})
            </div>
          </div>

          {vistaActual === "detalles" && (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>Información del Evento</h2>
              <p style={{ marginBottom: "1rem" }}>
                Este evento cuenta actualmente con {evento.participantes.length} participantes confirmados y{" "}
                {evento.solicitudes.length} solicitudes pendientes.
              </p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => setVistaActual("solicitudes")}>
                  Ver Solicitudes
                </button>
                <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => setVistaActual("participantes")}>
                  Ver Participantes
                </button>
              </div>
            </div>
          )}

          {vistaActual === "solicitudes" && (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>Solicitudes de Cupo</h2>

              {evento.solicitudes.length === 0 ? (
                <div style={styles.mensajeVacio}>No hay solicitudes pendientes para este evento.</div>
              ) : (
                <div style={styles.tablaContainer}>
                  <table style={styles.tabla}>
                    <thead>
                      <tr>
                        <th style={styles.tablaHeader}>Nombre</th>
                        <th style={styles.tablaHeader}>Tipo</th>
                        <th style={styles.tablaHeader}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evento.solicitudes.map((solicitud) => (
                        <tr key={solicitud.id}>
                          <td style={styles.tablaCell}>{solicitud.nombre}</td>
                          <td style={styles.tablaCell}>
                            <span
                              style={{
                                ...styles.badgeTipo,
                                ...(solicitud.tipo === "productor" ? styles.badgeProductor : styles.badgeComerciante),
                              }}
                            >
                              {solicitud.tipo === "productor" ? "Productor" : "Comerciante"}
                            </span>
                          </td>
                          <td style={styles.tablaCell}>
                            <div style={styles.accionesContainer}>
                              <button
                                style={{ ...styles.btn, ...styles.btnSuccess }}
                                onClick={() => aceptarSolicitud(solicitud.id)}
                                disabled={evento.cuposDisponibles <= 0}
                                title={evento.cuposDisponibles <= 0 ? "No hay cupos disponibles" : ""}
                              >
                                <Check size={16} />
                                Aceptar
                              </button>
                              <button
                                style={{ ...styles.btn, ...styles.btnDanger }}
                                onClick={() => rechazarSolicitud(solicitud.id)}
                              >
                                <X size={16} />
                                Rechazar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {vistaActual === "participantes" && (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>Participantes Confirmados</h2>

              {evento.participantes.length === 0 ? (
                <div style={styles.mensajeVacio}>No hay participantes confirmados para este evento.</div>
              ) : (
                <div style={styles.tablaContainer}>
                  <table style={styles.tabla}>
                    <thead>
                      <tr>
                        <th style={styles.tablaHeader}>Nombre</th>
                        <th style={styles.tablaHeader}>Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evento.participantes.map((participante) => (
                        <tr key={participante.id}>
                          <td style={styles.tablaCell}>{participante.nombre}</td>
                          <td style={styles.tablaCell}>
                            <span
                              style={{
                                ...styles.badgeTipo,
                                ...(participante.tipo === "productor"
                                  ? styles.badgeProductor
                                  : styles.badgeComerciante),
                              }}
                            >
                              {participante.tipo === "productor" ? "Productor" : "Comerciante"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

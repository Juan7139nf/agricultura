"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Calendar, Clock, Plus, Search, Users } from "lucide-react"

// Datos de ejemplo - eventos
const eventosIniciales = [
  {
    id: "1",
    nombre: "Feria Agrícola Regional",
    descripcion: "Exposición de productos agrícolas locales con oportunidades de networking.",
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
    descripcion: "Aprende técnicas avanzadas de cultivo sostenible y ecológico.",
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
    descripcion: "Espacio para establecer contactos comerciales entre productores y comerciantes del sector agrícola.",
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

export default function GestionEvento() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [eventos, setEventos] = useState(eventosIniciales)
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false)
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    hora: "",
    cuposTotal: 0,
  })

  // Filtrar eventos según el término de búsqueda
  const eventosFiltrados = eventos.filter((evento) => {
    const coincideBusqueda =
      evento.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      evento.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase())

    return coincideBusqueda
  })

  // Función para abrir el modal de crear evento
  const abrirModalCrear = () => {
    setNuevoEvento({
      nombre: "",
      descripcion: "",
      fecha: "",
      hora: "",
      cuposTotal: 0,
    })
    setModalCrearAbierto(true)
  }

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNuevoEvento({
      ...nuevoEvento,
      [name]: name === "cuposTotal" ? Number.parseInt(value) || 0 : value,
    })
  }

  // Función para crear un nuevo evento
  const crearEvento = () => {
    // Validar que todos los campos estén completos
    if (
      !nuevoEvento.nombre ||
      !nuevoEvento.descripcion ||
      !nuevoEvento.fecha ||
      !nuevoEvento.hora ||
      nuevoEvento.cuposTotal <= 0
    ) {
      alert("Por favor complete todos los campos correctamente")
      return
    }

    const nuevoEventoCompleto = {
      id: (eventos.length + 1).toString(),
      ...nuevoEvento,
      cuposDisponibles: nuevoEvento.cuposTotal,
      estado: "activo",
      imagen: "/placeholder.svg",
      participantes: [],
      solicitudes: [],
    }

    setEventos([...eventos, nuevoEventoCompleto])
    setModalCrearAbierto(false)
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
    title: {
      fontSize: "1.875rem",
      fontWeight: "bold",
    },
    breadcrumbs: {
      display: "flex",
      gap: "0.5rem",
      fontSize: "0.875rem",
      color: "#6b7280",
    },
    searchContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
    },
    searchBox: {
      position: "relative",
      width: "100%",
      maxWidth: "33.333333%",
    },
    searchIcon: {
      position: "absolute",
      left: "0.75rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
    },
    searchInput: {
      width: "100%",
      padding: "0.5rem",
      paddingLeft: "2.5rem",
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
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
    btnOutline: {
      backgroundColor: "transparent",
      border: "1px solid #e2e8f0",
    },
    eventosGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "1.5rem",
    },
    eventoCard: {
      border: "1px solid #e2e8f0",
      borderRadius: "0.5rem",
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
    },
    eventoCardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    },
    eventoImagen: {
      width: "100%",
      height: "160px",
      objectFit: "cover",
    },
    eventoContenido: {
      padding: "1rem",
    },
    eventoNombre: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
    },
    eventoDescripcion: {
      fontSize: "0.875rem",
      color: "#6b7280",
      marginBottom: "1rem",
      display: "-webkit-box",
      WebkitLineClamp: "2",
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    eventoDetalles: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      fontSize: "0.875rem",
    },
    eventoDetalle: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    eventoEstado: {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.25rem 0.5rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
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
    modal: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "50",
    },
    modalBox: {
      backgroundColor: "white",
      borderRadius: "0.5rem",
      padding: "1.5rem",
      width: "100%",
      maxWidth: "32rem",
    },
    modalHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "1rem",
    },
    modalTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
    },
    formGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
    },
    textarea: {
      width: "100%",
      padding: "0.5rem",
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
      minHeight: "100px",
      resize: "vertical",
    },
    modalFooter: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.5rem",
      marginTop: "1.5rem",
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Eventos</h1>

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
        </div>
      </div>

      <div style={styles.searchContainer}>
        <div style={styles.searchBox}>
          <Search style={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Buscar eventos..."
            style={styles.searchInput}
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
          />
        </div>

        <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={abrirModalCrear}>
          <Plus size={16} />
          Crear Nuevo Evento
        </button>
      </div>

      {/* Grid de eventos */}
      <div style={styles.eventosGrid}>
        {eventosFiltrados.map((evento) => (
          <div
            key={evento.id}
            style={styles.eventoCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.eventoCardHover.transform
              e.currentTarget.style.boxShadow = styles.eventoCardHover.boxShadow
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none"
              e.currentTarget.style.boxShadow = "none"
            }}
            onClick={() => (window.location.href = `/eventoview/${evento.id}`)}
          >
            <img src={evento.imagen || "/placeholder.svg"} alt={evento.nombre} style={styles.eventoImagen} />
            <div style={styles.eventoContenido}>
              <h3 style={styles.eventoNombre}>{evento.nombre}</h3>
              <p style={styles.eventoDescripcion}>{evento.descripcion}</p>
              <div style={styles.eventoDetalles}>
                <div style={styles.eventoDetalle}>
                  <Calendar size={16} />
                  <span>{evento.fecha}</span>
                </div>
                <div style={styles.eventoDetalle}>
                  <Clock size={16} />
                  <span>{evento.hora}</span>
                </div>
                <div style={styles.eventoDetalle}>
                  <Users size={16} />
                  <span>
                    Cupos: {evento.cuposDisponibles} de {evento.cuposTotal}
                  </span>
                </div>
                <div>
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
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear evento */}
      {modalCrearAbierto && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Crear Nuevo Evento</h2>
              <button
                onClick={() => setModalCrearAbierto(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem" }}
              >
                &times;
              </button>
            </div>

            <div>
              <div style={styles.formGroup}>
                <label htmlFor="nombre" style={styles.label}>
                  Nombre del Evento
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  style={styles.input}
                  value={nuevoEvento.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="descripcion" style={styles.label}>
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  style={styles.textarea}
                  value={nuevoEvento.descripcion}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="fecha" style={styles.label}>
                  Fecha de Realización
                </label>
                <input
                  type="text"
                  id="fecha"
                  name="fecha"
                  placeholder="Ej: 15 Junio, 2023"
                  style={styles.input}
                  value={nuevoEvento.fecha}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="hora" style={styles.label}>
                  Hora
                </label>
                <input
                  type="text"
                  id="hora"
                  name="hora"
                  placeholder="Ej: 09:00 - 18:00"
                  style={styles.input}
                  value={nuevoEvento.hora}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="cuposTotal" style={styles.label}>
                  Cupos Disponibles
                </label>
                <input
                  type="number"
                  id="cuposTotal"
                  name="cuposTotal"
                  min="1"
                  style={styles.input}
                  value={nuevoEvento.cuposTotal}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button style={{ ...styles.btn, ...styles.btnOutline }} onClick={() => setModalCrearAbierto(false)}>
                Cancelar
              </button>
              <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={crearEvento}>
                Crear Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

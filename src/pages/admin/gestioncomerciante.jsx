"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import { MoreVertical, Search, Shield, UserCog } from "lucide-react"

// Datos de ejemplo - solo usuarios tipo "comerciante"
const comerciantes = [
  {
    id: "2",
    nombre: "Judy Nelson",
    email: "judynelson@gmail.com",
    fechaCompra: "27 Abril, 2023 a las 2:47pm",
    telefono: "435-239-6436",
    gastado: "$490.00",
    tipo: "comerciante",
    avatar: "https://freshcart-next-js.vercel.app/images/avatar/avatar-4.jpg",
    cuentaHabilitada: true,
  },
  {
    id: "5",
    nombre: "Rhonda Pinson",
    email: "rhondapinson@gmail.com",
    fechaCompra: "18 Marzo, 2023 a las 2:47pm",
    telefono: "304-471-8451",
    gastado: "$213.00",
    tipo: "comerciante",
    avatar: "https://freshcart-next-js.vercel.app/images/avatar/avatar-4.jpg",
    cuentaHabilitada: true,
  },
  {
    id: "7",
    nombre: "María González",
    email: "mariagonzalez@gmail.com",
    fechaCompra: "18 Marzo, 2023 a las 2:47pm",
    telefono: "845-294-6681",
    gastado: "$39.00",
    tipo: "comerciante",
    avatar: "https://freshcart-next-js.vercel.app/images/avatar/avatar-4.jpg",
    cuentaHabilitada: false,
  },
]

export default function GestionComerciante() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [comercianteSeleccionado, setComercianteSeleccionado] = useState(null)
  const [dialogoEstadoAbierto, setDialogoEstadoAbierto] = useState(false)
  const [estadoTemporal, setEstadoTemporal] = useState(false)
  const [justificacion, setJustificacion] = useState("")
  const [menuAbierto, setMenuAbierto] = useState(null)

  const elementosPorPagina = 10

  // Filtrar comerciantes según el término de búsqueda
  const comerciantesFiltrados = comerciantes.filter((comerciante) => {
    const coincideBusqueda =
      comerciante.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      comerciante.email.toLowerCase().includes(terminoBusqueda.toLowerCase())

    return coincideBusqueda
  })

  // Calcular paginación
  const totalPaginas = Math.ceil(comerciantesFiltrados.length / elementosPorPagina)
  const comerciantesPaginados = comerciantesFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina,
  )

  // Función para abrir el diálogo de estado de cuenta
  const abrirDialogoEstado = (comerciante) => {
    setComercianteSeleccionado(comerciante)
    setEstadoTemporal(comerciante.cuentaHabilitada)
    setJustificacion("")
    setDialogoEstadoAbierto(true)
    setMenuAbierto(null) // Cerrar el menú al abrir el diálogo
  }

  // Función para guardar el estado de la cuenta
  const guardarEstadoCuenta = () => {
    if (comercianteSeleccionado) {
      // En una aplicación real, aquí enviarías los cambios a la API
      console.log(`Cambiando estado de cuenta para ${comercianteSeleccionado.nombre}:`, {
        habilitada: estadoTemporal,
        justificacion: justificacion,
      })

      // Cerrar el diálogo
      setDialogoEstadoAbierto(false)
    }
  }

  // Función para alternar el menú desplegable
  const toggleMenu = (id) => {
    if (menuAbierto === id) {
      setMenuAbierto(null)
    } else {
      setMenuAbierto(id)
    }
  }

  // Estilos en línea
  const styles = {
    badge: {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.25rem 0.5rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "500",
    },
    badgeGreen: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    badgeRed: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
    },
    btn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.5rem 1rem",
      borderRadius: "0.375rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
    },
    btnGhost: {
      backgroundColor: "transparent",
      padding: "0.25rem",
    },
    btnOutline: {
      backgroundColor: "transparent",
      border: "1px solid #e2e8f0",
    },
    btnPrimary: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    btnDisabled: {
      backgroundColor: "#93c5fd",
      cursor: "not-allowed",
    },
    dropdown: {
      position: "relative",
      display: "inline-block",
    },
    dropdownContent: {
      display: "block",
      position: "absolute",
      right: "0",
      backgroundColor: "white",
      minWidth: "10rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      borderRadius: "0.375rem",
      zIndex: "10",
      border: "1px solid #e2e8f0",
    },
    dropdownHidden: {
      display: "none",
    },
    menuItem: {
      display: "block",
      padding: "0.5rem 1rem",
      cursor: "pointer",
      color: "#374151",
      textAlign: "left",
      width: "100%",
      backgroundColor: "transparent",
      border: "none",
      fontSize: "0.875rem",
    },
    menuItemHover: {
      backgroundColor: "#f3f4f6",
    },
    menuItemDanger: {
      color: "#dc2626",
    },
    divider: {
      height: "1px",
      backgroundColor: "#e2e8f0",
      margin: "0.25rem 0",
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
      justifyContent: "center0,0,0.5)",
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
    modalAction: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.5rem",
      marginTop: "1.5rem",
    },
    toggle: {
      appearance: "none",
      width: "3rem",
      height: "1.5rem",
      backgroundColor: "#e2e8f0",
      borderRadius: "9999px",
      position: "relative",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    toggleChecked: {
      backgroundColor: "#3b82f6",
    },
    toggleBefore: {
      content: '""',
      position: "absolute",
      width: "1rem",
      height: "1rem",
      borderRadius: "50%",
      backgroundColor: "white",
      top: "0.25rem",
      left: "0.25rem",
      transition: "all 0.2s",
    },
    toggleCheckedBefore: {
      left: "1.75rem",
    },
    menuIcon: {
      marginRight: "0.5rem",
    },
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Gestión de Comerciantes</h1>

          {/* Breadcrumbs con NavLink */}
          <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
            <NavLink to="/admin" style={({ isActive }) => (isActive ? { color: "#3b82f6", fontWeight: "600" } : {})}>
              Panel
            </NavLink>
            <span> / </span>
            <NavLink
              to="/admin/comerciantes"
              style={({ isActive }) => (isActive ? { color: "#3b82f6", fontWeight: "600" } : {})}
            >
              Comerciantes
            </NavLink>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "33.333333%" }}>
            <Search
              style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar comerciantes..."
              style={{
                width: "100%",
                padding: "0.5rem",
                paddingLeft: "2.5rem",
                border: "1px solid #e2e8f0",
                borderRadius: "0.375rem",
              }}
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla de comerciantes */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                  <input type="checkbox" />
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Nombre</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Email</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                  Fecha de Compra
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Teléfono</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Gastado</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Estado</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}></th>
              </tr>
            </thead>
            <tbody>
              {comerciantesPaginados.map((comerciante) => (
                <tr key={comerciante.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "0.75rem" }}>
                    <input type="checkbox" />
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "9999px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          src={comerciante.avatar || "/placeholder.svg"}
                          alt={comerciante.nombre}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <span style={{ fontWeight: "500" }}>{comerciante.nombre}</span>
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem" }}>{comerciante.email}</td>
                  <td style={{ padding: "0.75rem" }}>{comerciante.fechaCompra}</td>
                  <td style={{ padding: "0.75rem" }}>{comerciante.telefono || "-"}</td>
                  <td style={{ padding: "0.75rem" }}>{comerciante.gastado}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span
                      style={{
                        ...styles.badge,
                        ...(comerciante.cuentaHabilitada ? styles.badgeGreen : styles.badgeRed),
                      }}
                    >
                      {comerciante.cuentaHabilitada ? "Habilitada" : "Deshabilitada"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={styles.dropdown}>
                      <button
                        onClick={() => toggleMenu(comerciante.id)}
                        style={{ ...styles.btn, ...styles.btnGhost }}
                        aria-label="Opciones"
                      >
                        <MoreVertical size={16} />
                      </button>
                      <div
                        style={
                          menuAbierto === comerciante.id
                            ? styles.dropdownContent
                            : { ...styles.dropdownContent, ...styles.dropdownHidden }
                        }
                      >
                        <button
                          style={styles.menuItem}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = styles.menuItemHover.backgroundColor
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent"
                          }}
                        >
                          Ver detalles
                        </button>
                        <button
                          style={styles.menuItem}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = styles.menuItemHover.backgroundColor
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent"
                          }}
                        >
                          Editar comerciante
                        </button>
                        <div style={styles.divider}></div>
                        <button
                          style={styles.menuItem}
                          onClick={() => abrirDialogoEstado(comerciante)}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = styles.menuItemHover.backgroundColor
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent"
                          }}
                        >
                          <UserCog size={16} style={styles.menuIcon} />
                          Gestionar estado
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            Mostrando {(paginaActual - 1) * elementosPorPagina + 1} a{" "}
            {Math.min(paginaActual * elementosPorPagina, comerciantesFiltrados.length)} de{" "}
            {comerciantesFiltrados.length} entradas
          </p>

          <div style={{ display: "flex", gap: "0.25rem" }}>
            <button
              style={{
                ...styles.btn,
                ...styles.btnOutline,
                padding: "0.25rem 0.5rem",
                fontSize: "0.875rem",
              }}
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>

            {Array.from({ length: Math.min(totalPaginas, 5) }, (_, i) => (
              <button
                key={i}
                style={{
                  ...styles.btn,
                  ...(paginaActual === i + 1 ? styles.btnPrimary : styles.btnOutline),
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.875rem",
                }}
                onClick={() => setPaginaActual(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              style={{
                ...styles.btn,
                ...styles.btnOutline,
                padding: "0.25rem 0.5rem",
                fontSize: "0.875rem",
              }}
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Diálogo de estado de cuenta */}
      {dialogoEstadoAbierto && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3
              style={{ fontWeight: "bold", fontSize: "1.125rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Shield size={20} />
              Gestionar Estado de Cuenta
            </h3>

            {comercianteSeleccionado && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "9999px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={comercianteSeleccionado.avatar || "/placeholder.svg"}
                    alt={comercianteSeleccionado.nombre}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <p style={{ fontWeight: "500" }}>{comercianteSeleccionado.nombre}</p>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{comercianteSeleccionado.email}</p>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gap: "1rem", padding: "1rem 0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label htmlFor="habilitar-cuenta" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  Cuenta Habilitada
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="checkbox"
                    id="habilitar-cuenta"
                    checked={estadoTemporal}
                    onChange={(e) => setEstadoTemporal(e.target.checked)}
                    style={{
                      ...styles.toggle,
                      ...(estadoTemporal ? styles.toggleChecked : {}),
                    }}
                  />
                  <span
                    style={{
                      ...styles.toggleBefore,
                      ...(estadoTemporal ? styles.toggleCheckedBefore : {}),
                    }}
                  ></span>
                </div>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <label
                  htmlFor="justificacion"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.25rem",
                  }}
                >
                  Justificación
                </label>
                <textarea
                  id="justificacion"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.375rem",
                  }}
                  placeholder="Ingrese la justificación para este cambio de estado..."
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            <div style={styles.modalAction}>
              <button style={{ ...styles.btn, ...styles.btnOutline }} onClick={() => setDialogoEstadoAbierto(false)}>
                Cancelar
              </button>
              <button
                style={{
                  ...styles.btn,
                  ...styles.btnPrimary,
                  ...(justificacion.trim() === "" ? styles.btnDisabled : {}),
                }}
                onClick={guardarEstadoCuenta}
                disabled={justificacion.trim() === ""}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

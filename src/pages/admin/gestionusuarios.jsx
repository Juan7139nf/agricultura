"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import { MoreVertical, Search, Shield, UserCog } from "lucide-react"

// Datos de ejemplo - solo usuarios tipo "usuario" (clientes)
const usuarios = [
  {
    id: "1",
    nombre: "Bonnie Howe",
    email: "bonniehowe@gmail.com",
    fechaCompra: "17 Mayo, 2023 a las 3:18pm",
    telefono: null,
    gastado: "$49.00",
    tipo: "usuario",
    avatar: "https://freshcart-next-js.vercel.app/images/avatar/avatar-2.jpg",
    cuentaHabilitada: true,
  },
  {
    id: "4",
    nombre: "Wayne Rossman",
    email: "waynerossman@gmail.com",
    fechaCompra: "27 Abril, 2023 a las 2:47pm",
    telefono: null,
    gastado: "$39.00",
    tipo: "usuario",
    avatar: "https://freshcart-next-js.vercel.app/images/avatar/avatar-2.jpg",
    cuentaHabilitada: true,
  },
  {
    id: "8",
    nombre: "Richard Shelton",
    email: "richarddhelton@jourrapide.com",
    fechaCompra: "12 Marzo, 2023 a las 9:47am",
    telefono: "313-887-8495",
    gastado: "$19.00",
    tipo: "usuario",
    avatar: "https://freshcart-next-js.vercel.app/images/avatar/avatar-2.jpg",
    cuentaHabilitada: true,
  },
  {
    id: "10",
    nombre: "Ana Martínez",
    email: "anamartinez@gmail.com",
    fechaCompra: "27 Abril, 2023 a las 2:47pm",
    telefono: null,
    gastado: "$39.00",
    tipo: "usuario",
    avatar: "https://freshcart-next-js.vercel.app/images/avatar/avatar-2.jpg",
    cuentaHabilitada: false,
  },
]

export default function GestionUsuarios() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [dialogoEstadoAbierto, setDialogoEstadoAbierto] = useState(false)
  const [estadoTemporal, setEstadoTemporal] = useState(false)
  const [justificacion, setJustificacion] = useState("")
  const [menuAbierto, setMenuAbierto] = useState(null)

  const elementosPorPagina = 10

  // Filtrar usuarios según el término de búsqueda
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideBusqueda =
      usuario.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(terminoBusqueda.toLowerCase())

    return coincideBusqueda
  })

  // Calcular paginación
  const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina)
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina,
  )

  // Función para abrir el diálogo de estado de cuenta
  const abrirDialogoEstado = (usuario) => {
    setUsuarioSeleccionado(usuario)
    setEstadoTemporal(usuario.cuentaHabilitada)
    setJustificacion("")
    setDialogoEstadoAbierto(true)
    setMenuAbierto(null) // Cerrar el menú al abrir el diálogo
  }

  // Función para guardar el estado de la cuenta
  const guardarEstadoCuenta = () => {
    if (usuarioSeleccionado) {
      // En una aplicación real, aquí enviarías los cambios a la API
      console.log(`Cambiando estado de cuenta para ${usuarioSeleccionado.nombre}:`, {
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
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Gestión de Clientes</h1>

          {/* Breadcrumbs con NavLink */}
          <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
            <NavLink to="/admin" style={({ isActive }) => (isActive ? { color: "#3b82f6", fontWeight: "600" } : {})}>
              Panel
            </NavLink>
            <span> / </span>
            <NavLink
              to="/admin/usuarios"
              style={({ isActive }) => (isActive ? { color: "#3b82f6", fontWeight: "600" } : {})}
            >
              Clientes
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
              placeholder="Buscar clientes..."
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

        {/* Tabla de usuarios */}
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
              {usuariosPaginados.map((usuario) => (
                <tr key={usuario.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
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
                          src={usuario.avatar || "/placeholder.svg"}
                          alt={usuario.nombre}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <span style={{ fontWeight: "500" }}>{usuario.nombre}</span>
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem" }}>{usuario.email}</td>
                  <td style={{ padding: "0.75rem" }}>{usuario.fechaCompra}</td>
                  <td style={{ padding: "0.75rem" }}>{usuario.telefono || "-"}</td>
                  <td style={{ padding: "0.75rem" }}>{usuario.gastado}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span
                      style={{
                        ...styles.badge,
                        ...(usuario.cuentaHabilitada ? styles.badgeGreen : styles.badgeRed),
                      }}
                    >
                      {usuario.cuentaHabilitada ? "Habilitada" : "Deshabilitada"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={styles.dropdown}>
                      <button
                        onClick={() => toggleMenu(usuario.id)}
                        style={{ ...styles.btn, ...styles.btnGhost }}
                        aria-label="Opciones"
                      >
                        <MoreVertical size={16} />
                      </button>
                      <div
                        style={
                          menuAbierto === usuario.id
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
                          Editar cliente
                        </button>
                        <div style={styles.divider}></div>
                        <button
                          style={styles.menuItem}
                          onClick={() => abrirDialogoEstado(usuario)}
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
            {Math.min(paginaActual * elementosPorPagina, usuariosFiltrados.length)} de {usuariosFiltrados.length}{" "}
            entradas
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

            {usuarioSeleccionado && (
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
                    src={usuarioSeleccionado.avatar || "/placeholder.svg"}
                    alt={usuarioSeleccionado.nombre}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <p style={{ fontWeight: "500" }}>{usuarioSeleccionado.nombre}</p>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{usuarioSeleccionado.email}</p>
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

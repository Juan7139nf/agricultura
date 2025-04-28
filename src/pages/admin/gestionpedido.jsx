"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import { MoreVertical, Search, Package, FileText, Truck } from "lucide-react"

// Datos de ejemplo - pedidos
const pedidos = [
  {
    id: "1",
    numeroPedido: "PED-2023-001",
    cliente: {
      id: "2",
      nombre: "Judy Nelson",
      tipo: "comerciante",
      avatar: "/placeholder.svg",
    },
    fechaPedido: "27 Abril, 2023 a las 2:47pm",
    total: "$490.00",
    estado: "pendiente",
    productos: [
      { nombre: "Tomates orgánicos", cantidad: 20, precio: "$10.00" },
      { nombre: "Lechugas hidropónicas", cantidad: 15, precio: "$12.00" },
    ],
  },
  {
    id: "2",
    numeroPedido: "PED-2023-002",
    cliente: {
      id: "3",
      nombre: "John Mattox",
      tipo: "productor",
      avatar: "/placeholder.svg",
    },
    fechaPedido: "28 Abril, 2023 a las 10:15am",
    total: "$235.50",
    estado: "realizado",
    productos: [
      { nombre: "Fertilizante orgánico", cantidad: 5, precio: "$25.00" },
      { nombre: "Semillas de tomate", cantidad: 10, precio: "$8.50" },
    ],
  },
  {
    id: "3",
    numeroPedido: "PED-2023-003",
    cliente: {
      id: "5",
      nombre: "Rhonda Pinson",
      tipo: "comerciante",
      avatar: "/placeholder.svg",
    },
    fechaPedido: "30 Abril, 2023 a las 3:20pm",
    total: "$750.00",
    estado: "cancelado",
    productos: [
      { nombre: "Papas orgánicas", cantidad: 100, precio: "$5.00" },
      { nombre: "Cebollas", cantidad: 50, precio: "$3.00" },
    ],
  },
  {
    id: "4",
    numeroPedido: "PED-2023-004",
    cliente: {
      id: "6",
      nombre: "Ricardo Méndez",
      tipo: "productor",
      avatar: "/placeholder.svg",
    },
    fechaPedido: "2 Mayo, 2023 a las 9:10am",
    total: "$320.75",
    estado: "pendiente",
    productos: [
      { nombre: "Herramientas de jardín", cantidad: 3, precio: "$45.00" },
      { nombre: "Sistema de riego", cantidad: 1, precio: "$185.75" },
    ],
  },
  {
    id: "5",
    numeroPedido: "PED-2023-005",
    cliente: {
      id: "7",
      nombre: "María González",
      tipo: "comerciante",
      avatar: "/placeholder.svg",
    },
    fechaPedido: "5 Mayo, 2023 a las 11:45am",
    total: "$1,250.00",
    estado: "realizado",
    productos: [
      { nombre: "Fresas orgánicas", cantidad: 200, precio: "$3.50" },
      { nombre: "Manzanas", cantidad: 150, precio: "$2.50" },
    ],
  },
  {
    id: "6",
    numeroPedido: "PED-2023-006",
    cliente: {
      id: "9",
      nombre: "Carlos Ramírez",
      tipo: "productor",
      avatar: "/placeholder.svg",
    },
    fechaPedido: "7 Mayo, 2023 a las 4:30pm",
    total: "$560.25",
    estado: "pendiente",
    productos: [
      { nombre: "Abono orgánico", cantidad: 10, precio: "$18.50" },
      { nombre: "Pesticida natural", cantidad: 5, precio: "$75.25" },
    ],
  },
  {
    id: "7",
    numeroPedido: "PED-2023-007",
    cliente: {
      id: "1",
      nombre: "Bonnie Howe",
      tipo: "usuario",
      avatar: "/placeholder.svg",
    },
    fechaPedido: "10 Mayo, 2023 a las 2:15pm",
    total: "$125.50",
    estado: "realizado",
    productos: [
      { nombre: "Verduras surtidas", cantidad: 1, precio: "$45.50" },
      { nombre: "Frutas de temporada", cantidad: 1, precio: "$80.00" },
    ],
  },
]

export default function GestionPedido() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [dialogoDetalleAbierto, setDialogoDetalleAbierto] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(null)

  const elementosPorPagina = 10

  // Filtrar pedidos según el término de búsqueda y el filtro de estado
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const coincideBusqueda =
      pedido.numeroPedido.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      pedido.cliente.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())

    const coincideEstado = filtroEstado === "todos" || pedido.estado === filtroEstado

    return coincideBusqueda && coincideEstado
  })

  // Calcular paginación
  const totalPaginas = Math.ceil(pedidosFiltrados.length / elementosPorPagina)
  const pedidosPaginados = pedidosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina,
  )

  // Función para abrir el diálogo de detalles del pedido
  const abrirDialogoDetalle = (pedido) => {
    setPedidoSeleccionado(pedido)
    setDialogoDetalleAbierto(true)
    setMenuAbierto(null) // Cerrar el menú al abrir el diálogo
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
    badgePendiente: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    },
    badgeRealizado: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    badgeCancelado: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
    },
    badgeProductor: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    badgeComerciante: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
    },
    badgeUsuario: {
      backgroundColor: "#e0e7ff",
      color: "#3730a3",
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
    modalFooter: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.5rem",
      marginTop: "1.5rem",
    },
    menuIcon: {
      marginRight: "0.5rem",
    },
    filterButton: {
      padding: "0.5rem 1rem",
      borderRadius: "0.375rem",
      border: "1px solid #e2e8f0",
      backgroundColor: "transparent",
      cursor: "pointer",
      marginRight: "0.5rem",
    },
    filterButtonActive: {
      backgroundColor: "#3b82f6",
      color: "white",
      borderColor: "#3b82f6",
    },
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Gestión de Pedidos</h1>

          {/* Breadcrumbs con NavLink */}
          <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
            <NavLink to="/admin" style={({ isActive }) => (isActive ? { color: "#3b82f6", fontWeight: "600" } : {})}>
              Panel
            </NavLink>
            <span> / </span>
            <NavLink
              to="/admin/pedidos"
              style={({ isActive }) => (isActive ? { color: "#3b82f6", fontWeight: "600" } : {})}
            >
              Pedidos
            </NavLink>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                placeholder="Buscar pedidos..."
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

            <div>
              <button
                style={{
                  ...styles.filterButton,
                  ...(filtroEstado === "todos" ? styles.filterButtonActive : {}),
                }}
                onClick={() => setFiltroEstado("todos")}
              >
                Todos
              </button>
              <button
                style={{
                  ...styles.filterButton,
                  ...(filtroEstado === "pendiente" ? styles.filterButtonActive : {}),
                }}
                onClick={() => setFiltroEstado("pendiente")}
              >
                Pendientes
              </button>
              <button
                style={{
                  ...styles.filterButton,
                  ...(filtroEstado === "realizado" ? styles.filterButtonActive : {}),
                }}
                onClick={() => setFiltroEstado("realizado")}
              >
                Realizados
              </button>
              <button
                style={{
                  ...styles.filterButton,
                  ...(filtroEstado === "cancelado" ? styles.filterButtonActive : {}),
                }}
                onClick={() => setFiltroEstado("cancelado")}
              >
                Cancelados
              </button>
            </div>
          </div>

          {/* Tabla de pedidos */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                    <input type="checkbox" />
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                    Nº Pedido
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Cliente</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Tipo</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                    Fecha Pedido
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Total</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Estado</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}></th>
                </tr>
              </thead>
              <tbody>
                {pedidosPaginados.map((pedido) => (
                  <tr key={pedido.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "0.75rem" }}>
                      <input type="checkbox" />
                    </td>
                    <td style={{ padding: "0.75rem" }}>{pedido.numeroPedido}</td>
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
                            src={pedido.cliente.avatar || "/placeholder.svg"}
                            alt={pedido.cliente.nombre}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                        <span style={{ fontWeight: "500" }}>{pedido.cliente.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          ...styles.badge,
                          ...(pedido.cliente.tipo === "productor"
                            ? styles.badgeProductor
                            : pedido.cliente.tipo === "comerciante"
                              ? styles.badgeComerciante
                              : styles.badgeUsuario),
                        }}
                      >
                        {pedido.cliente.tipo === "productor"
                          ? "Productor"
                          : pedido.cliente.tipo === "comerciante"
                            ? "Comerciante"
                            : "Usuario"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>{pedido.fechaPedido}</td>
                    <td style={{ padding: "0.75rem" }}>{pedido.total}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          ...styles.badge,
                          ...(pedido.estado === "pendiente"
                            ? styles.badgePendiente
                            : pedido.estado === "realizado"
                              ? styles.badgeRealizado
                              : styles.badgeCancelado),
                        }}
                      >
                        {pedido.estado === "pendiente"
                          ? "Pendiente"
                          : pedido.estado === "realizado"
                            ? "Realizado"
                            : "Cancelado"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div style={styles.dropdown}>
                        <button
                          onClick={() => toggleMenu(pedido.id)}
                          style={{ ...styles.btn, ...styles.btnGhost }}
                          aria-label="Opciones"
                        >
                          <MoreVertical size={16} />
                        </button>
                        <div
                          style={
                            menuAbierto === pedido.id
                              ? styles.dropdownContent
                              : { ...styles.dropdownContent, ...styles.dropdownHidden }
                          }
                        >
                          <button
                            style={styles.menuItem}
                            onClick={() => abrirDialogoDetalle(pedido)}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = styles.menuItemHover.backgroundColor
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "transparent"
                            }}
                          >
                            <FileText size={16} style={styles.menuIcon} />
                            Ver detalles
                          </button>
                          {pedido.estado === "pendiente" && (
                            <>
                              <button
                                style={styles.menuItem}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = styles.menuItemHover.backgroundColor
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = "transparent"
                                }}
                              >
                                <Truck size={16} style={styles.menuIcon} />
                                Marcar como realizado
                              </button>
                              <div style={styles.divider}></div>
                              <button
                                style={{ ...styles.menuItem, color: "#dc2626" }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = styles.menuItemHover.backgroundColor
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = "transparent"
                                }}
                              >
                                Cancelar pedido
                              </button>
                            </>
                          )}
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
              {Math.min(paginaActual * elementosPorPagina, pedidosFiltrados.length)} de {pedidosFiltrados.length}{" "}
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
      </div>

      {/* Diálogo de detalles del pedido */}
      {dialogoDetalleAbierto && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <Package size={20} style={{ display: "inline", marginRight: "0.5rem" }} />
                Detalles del Pedido
              </h3>
              <button
                onClick={() => setDialogoDetalleAbierto(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem" }}
              >
                &times;
              </button>
            </div>

            {pedidoSeleccionado && (
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: "500" }}>Número de Pedido:</span>
                    <span>{pedidoSeleccionado.numeroPedido}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: "500" }}>Cliente:</span>
                    <span>{pedidoSeleccionado.cliente.nombre}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: "500" }}>Tipo de Cliente:</span>
                    <span
                      style={{
                        ...styles.badge,
                        ...(pedidoSeleccionado.cliente.tipo === "productor"
                          ? styles.badgeProductor
                          : pedidoSeleccionado.cliente.tipo === "comerciante"
                            ? styles.badgeComerciante
                            : styles.badgeUsuario),
                      }}
                    >
                      {pedidoSeleccionado.cliente.tipo === "productor"
                        ? "Productor"
                        : pedidoSeleccionado.cliente.tipo === "comerciante"
                          ? "Comerciante"
                          : "Usuario"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: "500" }}>Fecha del Pedido:</span>
                    <span>{pedidoSeleccionado.fechaPedido}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: "500" }}>Estado:</span>
                    <span
                      style={{
                        ...styles.badge,
                        ...(pedidoSeleccionado.estado === "pendiente"
                          ? styles.badgePendiente
                          : pedidoSeleccionado.estado === "realizado"
                            ? styles.badgeRealizado
                            : styles.badgeCancelado),
                      }}
                    >
                      {pedidoSeleccionado.estado === "pendiente"
                        ? "Pendiente"
                        : pedidoSeleccionado.estado === "realizado"
                          ? "Realizado"
                          : "Cancelado"}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>Productos</h4>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "0.5rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                          Producto
                        </th>
                        <th style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>
                          Cantidad
                        </th>
                        <th style={{ padding: "0.5rem", textAlign: "right", borderBottom: "1px solid #e2e8f0" }}>
                          Precio
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidoSeleccionado.productos.map((producto, index) => (
                        <tr key={index}>
                          <td style={{ padding: "0.5rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                            {producto.nombre}
                          </td>
                          <td style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>
                            {producto.cantidad}
                          </td>
                          <td style={{ padding: "0.5rem", textAlign: "right", borderBottom: "1px solid #e2e8f0" }}>
                            {producto.precio}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            padding: "0.5rem",
                            textAlign: "right",
                            fontWeight: "600",
                            borderTop: "2px solid #e2e8f0",
                          }}
                        >
                          Total:
                        </td>
                        <td
                          style={{
                            padding: "0.5rem",
                            textAlign: "right",
                            fontWeight: "600",
                            borderTop: "2px solid #e2e8f0",
                          }}
                        >
                          {pedidoSeleccionado.total}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            <div style={styles.modalFooter}>
              <button style={{ ...styles.btn, ...styles.btnOutline }} onClick={() => setDialogoDetalleAbierto(false)}>
                Cerrar
              </button>
              {pedidoSeleccionado && pedidoSeleccionado.estado === "pendiente" && (
                <>
                  <button
                    style={{ ...styles.btn, ...styles.btnPrimary }}
                    onClick={() => {
                      // Aquí iría la lógica para marcar como realizado
                      setDialogoDetalleAbierto(false)
                    }}
                  >
                    <Truck size={16} style={{ marginRight: "0.5rem" }} />
                    Marcar como realizado
                  </button>
                  <button
                    style={{ ...styles.btn, backgroundColor: "#ef4444", color: "white" }}
                    onClick={() => {
                      // Aquí iría la lógica para cancelar el pedido
                      setDialogoDetalleAbierto(false)
                    }}
                  >
                    Cancelar pedido
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

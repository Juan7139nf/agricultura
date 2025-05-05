"use client"

import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { MoreVertical, Search, Package, FileText, Truck } from "lucide-react"
import { ref, onValue, update, get } from "firebase/database"
import { database } from "../../scripts/firebase/firebase"
import { AdminNav } from "../../scripts/components/adminNav"

export default function GestionPedido() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [dialogoDetalleAbierto, setDialogoDetalleAbierto] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(null)

  const elementosPorPagina = 10

  // Cargar pedidos desde Firebase
  useEffect(() => {
    const pedidosRef = ref(database, "pedidos")

    const unsubscribe = onValue(pedidosRef, (snapshot) => {
      if (snapshot.exists()) {
        const pedidosData = snapshot.val()
        const pedidosArray = Object.keys(pedidosData).map((id) => {
          const pedido = pedidosData[id]

          // Obtener información del cliente si está disponible
          const obtenerInfoCliente = async (clienteId) => {
            if (!clienteId) return null

            try {
              const clienteRef = ref(database, `usuarios/${clienteId}`)
              const clienteSnapshot = await get(clienteRef)
              if (clienteSnapshot.exists()) {
                return clienteSnapshot.val()
              }
              return null
            } catch (error) {
              console.error("Error al obtener datos del cliente:", error)
              return null
            }
          }

          // Formatear el pedido según la estructura real
          return {
            id,
            numeroPedido: id.substring(0, 8).toUpperCase(), // Usar parte del ID como número de pedido
            clientUid: pedido.clientUid,
            cliente: {
              id: pedido.clientUid,
              nombre: "Cliente", // Valor por defecto, se actualizará después
              tipo: "usuario",
              avatar: "/placeholder.svg",
            },
            fechaPedido: pedido.fecha ? new Date(pedido.fecha).toLocaleString() : "Fecha desconocida",
            total: pedido.total ? `$${pedido.total.toFixed(2)}` : `$${pedido.subTotal?.toFixed(2) || "0.00"}`,
            subTotal: pedido.subTotal,
            estado: pedido.estado || "pendiente",
            carrito: pedido.carrito || [],
            productos: pedido.carrito
              ? Object.values(pedido.carrito).map((item) => ({
                  nombre: item.nombre || "Producto",
                  cantidad: item.cantidad || 1,
                  precio: item.precio ? `$${item.precio.toFixed(2)}` : "$0.00",
                }))
              : [],
          }
        })

        // Obtener información de clientes
        pedidosArray.forEach(async (pedido) => {
          if (pedido.clientUid) {
            const clienteRef = ref(database, `usuarios/${pedido.clientUid}`)
            onValue(clienteRef, (clienteSnapshot) => {
              if (clienteSnapshot.exists()) {
                const clienteData = clienteSnapshot.val()
                setPedidos((prevPedidos) =>
                  prevPedidos.map((p) =>
                    p.id === pedido.id
                      ? {
                          ...p,
                          cliente: {
                            id: pedido.clientUid,
                            nombre: clienteData.displayName || clienteData.email || "Cliente",
                            tipo: clienteData.roles?.includes("comerciante")
                              ? "comerciante"
                              : clienteData.roles?.includes("productor")
                                ? "productor"
                                : "usuario",
                            avatar: clienteData.photoURL || "/placeholder.svg",
                          },
                        }
                      : p,
                  ),
                )
              }
            })
          }
        })

        // Ordenar por fecha (más recientes primero)
        pedidosArray.sort((a, b) => {
          if (!a.fecha) return 1
          if (!b.fecha) return -1
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        })

        setPedidos(pedidosArray)
      } else {
        setPedidos([])
      }
      setCargando(false)
    })

    return () => unsubscribe()
  }, [])

  // Filtrar pedidos según el término de búsqueda y el filtro de estado
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const coincideBusqueda =
      pedido.numeroPedido?.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      pedido.cliente?.nombre?.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      pedido.clientUid?.toLowerCase().includes(terminoBusqueda.toLowerCase())

    const coincideEstado =
      filtroEstado === "todos" ||
      pedido.estado === filtroEstado ||
      (filtroEstado === "realizado" && pedido.estado === "completado")

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

  // Función para marcar un pedido como realizado
  const marcarComoRealizado = async (pedido) => {
    try {
      const pedidoRef = ref(database, `pedidos/${pedido.id}`)
      await update(pedidoRef, {
        estado: "completado",
      })

      // Cerrar el diálogo
      setDialogoDetalleAbierto(false)
      setMenuAbierto(null)

      // Opcional: mostrar mensaje de éxito
      alert("Pedido marcado como completado correctamente")
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error)
      alert("Error al actualizar el estado del pedido")
    }
  }

  // Función para cancelar un pedido
  const cancelarPedido = async (pedido) => {
    try {
      const pedidoRef = ref(database, `pedidos/${pedido.id}`)
      await update(pedidoRef, {
        estado: "cancelado",
      })

      // Cerrar el diálogo
      setDialogoDetalleAbierto(false)
      setMenuAbierto(null)

      // Opcional: mostrar mensaje de éxito
      alert("Pedido cancelado correctamente")
    } catch (error) {
      console.error("Error al cancelar el pedido:", error)
      alert("Error al cancelar el pedido")
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
    <div className="container-md">
      <div className="row">
        {/* Panel lateral */}
        <div className="col-lg-3 col-md-4 col-12">
          <AdminNav />
        </div>
  
        {/* Contenido principal */}
        <div className="col-lg-9 col-md-8 col-12 py-4 p-md-5 p-lg-6">
          <h1 className="mb-4">Gestión de Pedidos</h1>
  
          {/* Breadcrumbs */}
          <div className="d-flex gap-2 mb-4 text-muted small">
            <NavLink
              to="/admin"
              className={({ isActive }) => isActive ? "text-primary fw-semibold" : ""}
            >
              Panel
            </NavLink>
            <span>/</span>
            <NavLink
              to="/admin/pedidos"
              className={({ isActive }) => isActive ? "text-primary fw-semibold" : ""}
            >
              Pedidos
            </NavLink>
          </div>
  
          {/* Filtros y buscador */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div className="position-relative w-100" style={{ maxWidth: "33.333333%" }}>
              <Search
                className="position-absolute"
                style={{ left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar pedidos..."
                className="form-control ps-5"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
            </div>
  
            <div className="d-flex flex-wrap gap-2">
              {["todos", "pendiente", "realizado", "cancelado"].map((estado) => (
                <button
                  key={estado}
                  className={`btn ${filtroEstado === estado ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setFiltroEstado(estado)}
                >
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </button>
              ))}
            </div>
          </div>
  
          {/* Contenido: Cargando / Vacío / Tabla */}
          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3">Cargando pedidos...</p>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-5 bg-light rounded-4">
              <Package size={48} className="text-muted mb-3" />
              <h3 className="h5 fw-semibold mb-2">No hay pedidos</h3>
              <p className="text-muted">No se encontraron pedidos en la base de datos.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>Nº Pedido</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Fecha Pedido</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosPaginados.map((pedido) => (
                    <tr key={pedido.id}>
                      <td><input type="checkbox" /></td>
                      <td>{pedido.numeroPedido}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle overflow-hidden" style={{ width: "2.5rem", height: "2.5rem" }}>
                            <img src={pedido.cliente?.avatar || "/placeholder.svg"} alt={pedido.cliente?.nombre} className="img-fluid" />
                          </div>
                          <span className="fw-medium">{pedido.cliente?.nombre}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          pedido.cliente?.tipo === "productor"
                            ? "bg-success-subtle text-success"
                            : pedido.cliente?.tipo === "comerciante"
                            ? "bg-warning-subtle text-warning"
                            : "bg-secondary-subtle text-secondary"
                        }`}>
                          {pedido.cliente?.tipo === "productor"
                            ? "Productor"
                            : pedido.cliente?.tipo === "comerciante"
                            ? "Comerciante"
                            : "Usuario"}
                        </span>
                      </td>
                      <td>{pedido.fechaPedido}</td>
                      <td>{pedido.total}</td>
                      <td>
                        <span className={`badge ${
                          pedido.estado === "pendiente"
                            ? "bg-info-subtle text-info"
                            : pedido.estado === "realizado" || pedido.estado === "completado"
                            ? "bg-success-subtle text-success"
                            : "bg-danger-subtle text-danger"
                        }`}>
                          {pedido.estado === "pendiente"
                            ? "Pendiente"
                            : pedido.estado === "realizado" || pedido.estado === "completado"
                            ? "Completado"
                            : "Cancelado"}
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-light border dropdown-toggle"
                            type="button"
                            onClick={() => toggleMenu(pedido.id)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          {menuAbierto === pedido.id && (
                            <div className="dropdown-menu show position-absolute">
                              <button className="dropdown-item" onClick={() => abrirDialogoDetalle(pedido)}>
                                <FileText size={16} className="me-2" />
                                Ver detalles
                              </button>
                              {pedido.estado === "pendiente" && (
                                <button className="dropdown-item" onClick={() => marcarComoRealizado(pedido)}>
                                  <Truck size={16} className="me-2" />
                                  Marcar como completado
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}  
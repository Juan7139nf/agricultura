"use client"

import { useState, useEffect, useMemo } from "react"
import { NavLink } from "react-router-dom"
import { MoreVertical, Search, Package, FileText, Truck, AlertCircle, Download } from "lucide-react"
import { ref, onValue, update, get, query, limitToLast } from "firebase/database"
import { database } from "../../scripts/firebase/firebase"
import { AdminNav } from "../../scripts/components/adminNav"

export default function GestionPedido() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [dialogoDetalleAbierto, setDialogoDetalleAbierto] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(null)
  const [clientesCache, setClientesCache] = useState({})
  const [cargandoClientes, setCargandoClientes] = useState(false)

  // Configuración
  const LIMITE_PEDIDOS = 50
  const elementosPorPagina = 10

  // Cargar pedidos desde Firebase con optimizaciones
  useEffect(() => {
    console.log("Iniciando carga de pedidos...")
    setCargando(true)
    setError(null)

    // Usar query con limitToLast para mejorar rendimiento
    const pedidosRef = query(ref(database, "pedidos"), limitToLast(LIMITE_PEDIDOS))

    const unsubscribe = onValue(
      pedidosRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const pedidosData = snapshot.val()
          console.log(`Recibidos ${Object.keys(pedidosData).length} pedidos de Firebase`)

          // Agregar este log para depuración
          console.log("Muestra de datos de pedido:", Object.values(pedidosData)[0])
          if (Object.values(pedidosData)[0]?.carrito) {
            console.log("Muestra de carrito:", Object.values(Object.values(pedidosData)[0].carrito)[0])
            console.log("Tipo de precio:", typeof Object.values(Object.values(pedidosData)[0].carrito)[0].precio)
          }

          // Transformar los datos una sola vez
          const pedidosArray = Object.keys(pedidosData).map((id) => {
            const pedido = pedidosData[id]

            // Formatear el pedido según la estructura real
            return {
              id,
              numeroPedido: id.substring(0, 8).toUpperCase(),
              clientUid: pedido.clientUid,
              cliente: {
                id: pedido.clientUid,
                nombre: "Cliente", // Valor por defecto, se actualizará después
                tipo: "usuario",
                avatar: "/placeholder.svg",
              },
              fechaPedido: pedido.fecha ? new Date(pedido.fecha).toLocaleString() : "Fecha desconocida",
              fecha: pedido.fecha, // Guardar fecha original para ordenamiento
              total:
                typeof pedido.total === "number"
                  ? `$${pedido.total.toFixed(2)}`
                  : typeof pedido.subTotal === "number"
                    ? `$${pedido.subTotal.toFixed(2)}`
                    : "$0.00",
              totalNumerico:
                typeof pedido.total === "number"
                  ? pedido.total
                  : typeof pedido.subTotal === "number"
                    ? pedido.subTotal
                    : 0, // Para ordenamiento
              subTotal: pedido.subTotal,
              estado: pedido.estado || "pendiente",
              carrito: pedido.carrito || [],
              productos: pedido.carrito
                ? Object.values(pedido.carrito).map((item) => ({
                    nombre: item.nombre || "Producto",
                    cantidad: item.cantidad || 1,
                    precio:
                      typeof item.precio === "number"
                        ? `$${item.precio.toFixed(2)}`
                        : item.precio
                          ? `$${item.precio}`
                          : "$0.00",
                  }))
                : [],
            }
          })

          // Ordenar por fecha (más recientes primero)
          pedidosArray.sort((a, b) => {
            if (!a.fecha) return 1
            if (!b.fecha) return -1
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          })

          setPedidos(pedidosArray)

          // Cargar información de clientes en segundo plano
          cargarInfoClientes(pedidosArray)
        } else {
          console.log("No se encontraron pedidos")
          setPedidos([])
        }
        setCargando(false)
      },
      (error) => {
        console.error("Error al cargar pedidos:", error)
        setError("Error al cargar los pedidos. Por favor, intenta de nuevo.")
        setCargando(false)
      },
    )

    return () => {
      // Limpiar suscripción
      unsubscribe()
    }
  }, [])

  // Cargar información de clientes de forma optimizada
  const cargarInfoClientes = async (pedidosArray) => {
    if (pedidosArray.length === 0) return

    setCargandoClientes(true)

    // Obtener IDs de cliente únicos para evitar consultas duplicadas
    const clientesUnicos = [...new Set(pedidosArray.map((pedido) => pedido.clientUid).filter(Boolean))]
    console.log(`Cargando información para ${clientesUnicos.length} clientes únicos`)

    // Crear un nuevo objeto de caché para evitar mutaciones de estado
    const nuevoCache = { ...clientesCache }

    // Cargar información de clientes en lotes para evitar sobrecarga
    const TAMANO_LOTE = 10
    for (let i = 0; i < clientesUnicos.length; i += TAMANO_LOTE) {
      const lote = clientesUnicos.slice(i, i + TAMANO_LOTE)

      // Cargar clientes en paralelo usando Promise.all
      await Promise.all(
        lote.map(async (clienteId) => {
          // Evitar cargar clientes que ya están en caché
          if (nuevoCache[clienteId]) return

          try {
            const clienteRef = ref(database, `usuarios/${clienteId}`)
            const snapshot = await get(clienteRef)

            if (snapshot.exists()) {
              const clienteData = snapshot.val()
              nuevoCache[clienteId] = {
                id: clienteId,
                nombre: clienteData.displayName || clienteData.email || "Cliente",
                tipo: clienteData.roles?.includes("comerciante")
                  ? "comerciante"
                  : clienteData.roles?.includes("productor")
                    ? "productor"
                    : "usuario",
                avatar: clienteData.photoURL || "/placeholder.svg",
              }
            }
          } catch (error) {
            console.error(`Error al cargar cliente ${clienteId}:`, error)
          }
        }),
      )
    }

    // Actualizar caché de clientes
    setClientesCache(nuevoCache)

    // Actualizar pedidos con información de clientes
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) => {
        if (pedido.clientUid && nuevoCache[pedido.clientUid]) {
          return {
            ...pedido,
            cliente: nuevoCache[pedido.clientUid],
          }
        }
        return pedido
      }),
    )

    setCargandoClientes(false)
  }

  // Filtrar pedidos según el término de búsqueda y el filtro de estado - Memoizado
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((pedido) => {
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
  }, [pedidos, terminoBusqueda, filtroEstado])

  // Calcular paginación - Memoizado
  const totalPaginas = useMemo(
    () => Math.ceil(pedidosFiltrados.length / elementosPorPagina),
    [pedidosFiltrados.length, elementosPorPagina],
  )

  // Obtener pedidos para la página actual - Memoizado
  const pedidosPaginados = useMemo(
    () => pedidosFiltrados.slice((paginaActual - 1) * elementosPorPagina, paginaActual * elementosPorPagina),
    [pedidosFiltrados, paginaActual, elementosPorPagina],
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

  // Cambiar página
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina)
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
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "text-primary fw-semibold" : "")}>
              Panel
            </NavLink>
            <span>/</span>
            <NavLink to="/admin/pedidos" className={({ isActive }) => (isActive ? "text-primary fw-semibold" : "")}>
              Pedidos
            </NavLink>
          </div>

          {/* Filtros y buscador */}
          <div className="card p-4 shadow-sm rounded-4 mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
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
          </div>

          {/* Contenido: Cargando / Error / Vacío / Tabla */}
          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3">Cargando pedidos...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <AlertCircle className="me-2" size={20} />
              <div>{error}</div>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-5 bg-light rounded-4">
              <Package size={48} className="text-muted mb-3" />
              <h3 className="h5 fw-semibold mb-2">No hay pedidos</h3>
              <p className="text-muted">No se encontraron pedidos en la base de datos.</p>
            </div>
          ) : (
            <>
              {/* Información de carga de clientes */}
              {cargandoClientes && (
                <div className="alert alert-info d-flex align-items-center mb-3" role="alert">
                  <div className="spinner-border spinner-border-sm text-info me-2" role="status"></div>
                  <div>Cargando información adicional de clientes...</div>
                </div>
              )}

              {/* Tabla de pedidos */}
              <div className="card shadow-sm rounded-4">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
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
                          <td>{pedido.numeroPedido}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle overflow-hidden"
                                style={{ width: "2.5rem", height: "2.5rem" }}
                              >
                                <img
                                  src={pedido.cliente?.avatar || "/placeholder.svg"}
                                  alt={pedido.cliente?.nombre}
                                  className="img-fluid"
                                />
                              </div>
                              <span className="fw-medium">{pedido.cliente?.nombre}</span>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                pedido.cliente?.tipo === "productor"
                                  ? "bg-success-subtle text-success"
                                  : pedido.cliente?.tipo === "comerciante"
                                    ? "bg-warning-subtle text-warning"
                                    : "bg-secondary-subtle text-secondary"
                              }`}
                            >
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
                            <span
                              className={`badge ${
                                pedido.estado === "pendiente"
                                  ? "bg-info-subtle text-info"
                                  : pedido.estado === "realizado" || pedido.estado === "completado"
                                    ? "bg-success-subtle text-success"
                                    : "bg-danger-subtle text-danger"
                              }`}
                            >
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

                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <nav aria-label="Navegación de páginas">
                    <ul className="pagination">
                      <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => cambiarPagina(paginaActual - 1)}>
                          Anterior
                        </button>
                      </li>
                      {[...Array(totalPaginas)].map((_, i) => (
                        <li key={i} className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}>
                          <button className="page-link" onClick={() => cambiarPagina(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => cambiarPagina(paginaActual + 1)}>
                          Siguiente
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}

          {/* Modal de detalle de pedido */}
          {dialogoDetalleAbierto && pedidoSeleccionado && (
            <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content rounded-4">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      <Package className="me-2" />
                      Detalle de Pedido #{pedidoSeleccionado.numeroPedido}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setDialogoDetalleAbierto(false)
                        setPedidoSeleccionado(null)
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="card bg-light border-0 p-3 h-100">
                          <h6 className="mb-3">Información del Pedido</h6>
                          <p className="mb-1">
                            <strong>ID:</strong> {pedidoSeleccionado.id}
                          </p>
                          <p className="mb-1">
                            <strong>Fecha:</strong> {pedidoSeleccionado.fechaPedido}
                          </p>
                          <p className="mb-1">
                            <strong>Estado:</strong>{" "}
                            <span
                              className={`badge ${
                                pedidoSeleccionado.estado === "pendiente"
                                  ? "bg-info-subtle text-info"
                                  : pedidoSeleccionado.estado === "realizado" ||
                                      pedidoSeleccionado.estado === "completado"
                                    ? "bg-success-subtle text-success"
                                    : "bg-danger-subtle text-danger"
                              }`}
                            >
                              {pedidoSeleccionado.estado === "pendiente"
                                ? "Pendiente"
                                : pedidoSeleccionado.estado === "realizado" ||
                                    pedidoSeleccionado.estado === "completado"
                                  ? "Completado"
                                  : "Cancelado"}
                            </span>
                          </p>
                          <p className="mb-1">
                            <strong>Total:</strong> {pedidoSeleccionado.total}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6 mt-3 mt-md-0">
                        <div className="card bg-light border-0 p-3 h-100">
                          <h6 className="mb-3">Información del Cliente</h6>
                          <div className="d-flex align-items-center mb-2">
                            <div
                              className="rounded-circle overflow-hidden me-2"
                              style={{ width: "2.5rem", height: "2.5rem" }}
                            >
                              <img
                                src={pedidoSeleccionado.cliente?.avatar || "/placeholder.svg"}
                                alt={pedidoSeleccionado.cliente?.nombre}
                                className="img-fluid"
                              />
                            </div>
                            <div>
                              <p className="mb-0 fw-medium">{pedidoSeleccionado.cliente?.nombre}</p>
                              <span
                                className={`badge ${
                                  pedidoSeleccionado.cliente?.tipo === "productor"
                                    ? "bg-success-subtle text-success"
                                    : pedidoSeleccionado.cliente?.tipo === "comerciante"
                                      ? "bg-warning-subtle text-warning"
                                      : "bg-secondary-subtle text-secondary"
                                }`}
                              >
                                {pedidoSeleccionado.cliente?.tipo === "productor"
                                  ? "Productor"
                                  : pedidoSeleccionado.cliente?.tipo === "comerciante"
                                    ? "Comerciante"
                                    : "Usuario"}
                              </span>
                            </div>
                          </div>
                          <p className="mb-1">
                            <strong>ID Cliente:</strong> {pedidoSeleccionado.clientUid}
                          </p>
                        </div>
                      </div>
                    </div>

                    <h6 className="mb-3">Productos</h6>
                    <div className="table-responsive">
                      <table className="table">
                        <thead className="table-light">
                          <tr>
                            <th>Producto</th>
                            <th className="text-center">Cantidad</th>
                            <th className="text-end">Precio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedidoSeleccionado.productos.length > 0 ? (
                            pedidoSeleccionado.productos.map((producto, index) => (
                              <tr key={index}>
                                <td>{producto.nombre}</td>
                                <td className="text-center">{producto.cantidad}</td>
                                <td className="text-end">{producto.precio}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="text-center py-3">
                                No hay productos disponibles
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot className="table-light">
                          <tr>
                            <td colSpan="2" className="text-end fw-bold">
                              Total:
                            </td>
                            <td className="text-end fw-bold">{pedidoSeleccionado.total}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setDialogoDetalleAbierto(false)
                        setPedidoSeleccionado(null)
                      }}
                    >
                      Cerrar
                    </button>

                    
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

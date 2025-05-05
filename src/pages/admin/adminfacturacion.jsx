"use client"

import { useState, useEffect } from "react"
import { ref, onValue, update, get } from "firebase/database"
import { database } from "../../scripts/firebase/firebase"
import { AdminNav } from "../../scripts/components/adminNav"
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  User,
} from "lucide-react"

function AdminFacturacion() {
  const [facturas, setFacturas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [ordenarPor, setOrdenarPor] = useState("fecha")
  const [ordenDireccion, setOrdenDireccion] = useState("desc")
  const [detallesPedido, setDetallesPedido] = useState(null)
  const [cargandoDetalles, setCargandoDetalles] = useState(false)
  const [clienteInfo, setClienteInfo] = useState(null)

  useEffect(() => {
    // Cargar facturas desde Firebase
    const facturasRef = ref(database, "facturacion")

    const unsubscribe = onValue(facturasRef, (snapshot) => {
      if (snapshot.exists()) {
        const facturasData = snapshot.val()
        const facturasList = Object.keys(facturasData).map((id) => ({
          id,
          ...facturasData[id],
        }))

        console.log("Facturas cargadas:", facturasList)
        setFacturas(facturasList)
      } else {
        console.log("No se encontraron facturas")
        setFacturas([])
      }
      setCargando(false)
    })

    return () => unsubscribe()
  }, [])

  // Filtrar facturas según el término de búsqueda y el filtro de estado
  const facturasFiltradas = facturas.filter((factura) => {
    // Adaptar a la estructura real de tus datos
    const clienteId = factura.pedido?.clientUid || factura.clientUid || ""
    const estadoFactura = factura.pedido?.estado || factura.estado || ""

    const coincideBusqueda =
      (factura.id && factura.id.toLowerCase().includes(terminoBusqueda.toLowerCase())) ||
      (clienteId && clienteId.toLowerCase().includes(terminoBusqueda.toLowerCase()))

    const coincideEstado = filtroEstado === "todos" || estadoFactura === filtroEstado

    return coincideBusqueda && coincideEstado
  })

  // Ordenar facturas
  const facturasOrdenadas = [...facturasFiltradas].sort((a, b) => {
    if (ordenarPor === "fecha") {
      const fechaA = new Date(a.fecha || a.pedido?.fecha || 0)
      const fechaB = new Date(b.fecha || b.pedido?.fecha || 0)
      return ordenDireccion === "asc" ? fechaA - fechaB : fechaB - fechaA
    } else if (ordenarPor === "monto") {
      const montoA = Number.parseFloat(a.pedido?.total || a.total || 0)
      const montoB = Number.parseFloat(b.pedido?.total || b.total || 0)
      return ordenDireccion === "asc" ? montoA - montoB : montoB - montoA
    } else if (ordenarPor === "numero") {
      return ordenDireccion === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
    }
    return 0
  })

  const cargarInfoCliente = async (clienteId) => {
    if (!clienteId) return null

    try {
      const clienteRef = ref(database, `usuarios/${clienteId}`)
      const snapshot = await get(clienteRef)

      if (snapshot.exists()) {
        return snapshot.val()
      }
      return null
    } catch (error) {
      console.error("Error al cargar información del cliente:", error)
      return null
    }
  }

  const verDetalleFactura = async (factura) => {
    setFacturaSeleccionada(factura)
    setMostrarDetalle(true)
    setCargandoDetalles(true)

    try {
      // Cargar información del cliente
      const clienteId = factura.pedido?.clientUid || factura.clientUid
      if (clienteId) {
        const infoCliente = await cargarInfoCliente(clienteId)
        setClienteInfo(infoCliente)
      }

      // Cargar detalles del pedido si existe un idPedido
      const pedidoId = factura.idPedido || factura.pedido?.id
      if (pedidoId) {
        const pedidoRef = ref(database, `pedidos/${pedidoId}`)
        const snapshot = await get(pedidoRef)

        if (snapshot.exists()) {
          setDetallesPedido({
            id: pedidoId,
            ...snapshot.val(),
          })
        } else {
          // Si no hay detalles adicionales, usar los datos del pedido incluidos en la factura
          if (factura.pedido) {
            setDetallesPedido({
              id: pedidoId || factura.id,
              ...factura.pedido,
            })
          } else {
            setDetallesPedido(null)
          }
        }
      } else if (factura.pedido) {
        // Si no hay idPedido pero hay datos de pedido en la factura
        setDetallesPedido({
          id: factura.id,
          ...factura.pedido,
        })
      } else {
        setDetallesPedido(null)
      }
    } catch (error) {
      console.error("Error al cargar detalles:", error)
      setDetallesPedido(null)
    } finally {
      setCargandoDetalles(false)
    }
  }

  const cambiarEstadoFactura = async (facturaId, nuevoEstado) => {
    try {
      const facturaRef = ref(database, `facturacion/${facturaId}/pedido`)
      await update(facturaRef, {
        estado: nuevoEstado,
      })

      // Cerrar el modal de detalle
      setMostrarDetalle(false)
      setFacturaSeleccionada(null)

      // Mostrar mensaje de éxito
      alert(`Estado de la factura actualizado a: ${nuevoEstado}`)
    } catch (error) {
      console.error("Error al actualizar el estado de la factura:", error)
      alert("Error al actualizar el estado de la factura")
    }
  }

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "Fecha no disponible"

    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pagada":
      case "completado":
        return "success"
      case "pendiente":
      case "en proceso":
        return "warning"
      case "cancelada":
      case "cancelado":
        return "danger"
      case "vencida":
        return "secondary"
      default:
        return "primary"
    }
  }

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case "pagada":
      case "completado":
        return <CheckCircle className="me-1" size={16} />
      case "pendiente":
      case "en proceso":
        return <Clock className="me-1" size={16} />
      case "cancelada":
      case "cancelado":
        return <XCircle className="me-1" size={16} />
      case "vencida":
        return <Calendar className="me-1" size={16} />
      default:
        return <FileText className="me-1" size={16} />
    }
  }

  const toggleOrden = (campo) => {
    if (ordenarPor === campo) {
      setOrdenDireccion(ordenDireccion === "asc" ? "desc" : "asc")
    } else {
      setOrdenarPor(campo)
      setOrdenDireccion("desc")
    }
  }

  const descargarFactura = (factura) => {
    // En un entorno real, aquí se generaría y descargaría el PDF de la factura
    alert(`Descargando factura ${factura.id}`)
  }

  return (
    <div className="container-md">
      <div className="row">
        <AdminNav />
        <div className="col-lg-9 col-md-8 col-12">
          <div className="py-5 p-md-6 p-lg-10">
            <h1 className="mb-4">Gestión de Facturación</h1>

            {/* Filtros y búsqueda */}
            <div className="card p-4 shadow-sm rounded-4 mb-5">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <Search size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por ID o cliente..."
                      value={terminoBusqueda}
                      onChange={(e) => setTerminoBusqueda(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2">
                    <select
                      className="form-select"
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                      <option value="todos">Todos los estados</option>
                      <option value="pagada">Pagadas</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="cancelada">Canceladas</option>
                      <option value="completado">Completadas</option>
                    </select>
                    <button className="btn btn-outline-secondary d-flex align-items-center">
                      <Filter size={18} className="me-1" />
                      Filtros
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Estado de carga */}
            {cargando ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando facturas...</p>
              </div>
            ) : facturas.length === 0 ? (
              <div className="alert alert-info text-center py-5">
                <FileText size={48} className="mb-3" />
                <h4>No hay facturas disponibles</h4>
                <p>No se encontraron facturas en la base de datos.</p>
              </div>
            ) : (
              <>
                {/* Tabla de facturas */}
                <div className="card shadow-sm rounded-4">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0 cursor-pointer" onClick={() => toggleOrden("numero")}>
                            <div className="d-flex align-items-center">
                              Nº Factura
                              {ordenarPor === "numero" && (
                                <span className="ms-1">{ordenDireccion === "asc" ? "↑" : "↓"}</span>
                              )}
                            </div>
                          </th>
                          <th className="border-0">Cliente</th>
                          <th className="border-0 cursor-pointer" onClick={() => toggleOrden("fecha")}>
                            <div className="d-flex align-items-center">
                              Fecha
                              {ordenarPor === "fecha" && (
                                <span className="ms-1">{ordenDireccion === "asc" ? "↑" : "↓"}</span>
                              )}
                            </div>
                          </th>
                          <th className="border-0 cursor-pointer" onClick={() => toggleOrden("monto")}>
                            <div className="d-flex align-items-center">
                              Total
                              {ordenarPor === "monto" && (
                                <span className="ms-1">{ordenDireccion === "asc" ? "↑" : "↓"}</span>
                              )}
                            </div>
                          </th>
                          <th className="border-0">Estado</th>
                          <th className="border-0 text-end">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facturasOrdenadas.map((factura) => {
                          // Adaptar a la estructura real de tus datos
                          const estado = factura.pedido?.estado || factura.estado || "pendiente"
                          const total = factura.pedido?.total || factura.total || 0
                          const fecha = factura.fecha || factura.pedido?.fecha
                          const clienteId = factura.pedido?.clientUid || factura.clientUid || "Sin cliente"

                          return (
                            <tr key={factura.id}>
                              <td>
                                <span className="fw-medium">{`FAC-${factura.id.substring(0, 8).toUpperCase()}`}</span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-sm rounded-circle bg-light me-2 d-flex align-items-center justify-content-center">
                                    <User size={14} />
                                  </div>
                                  <div>
                                    <span>Cliente</span>
                                    <div className="small text-muted">{clienteId}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{formatearFecha(fecha)}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <DollarSign size={16} className="text-muted me-1" />
                                  <span>{typeof total === "number" ? total.toFixed(2) : total || "0.00"}</span>
                                </div>
                              </td>
                              <td>
                                <span className={`badge bg-${getEstadoColor(estado)} d-flex align-items-center`}>
                                  {getEstadoIcono(estado)}
                                  {estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : "Pendiente"}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex justify-content-end gap-2">
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => verDetalleFactura(factura)}
                                    title="Ver detalle"
                                  >
                                    <FileText size={16} className="me-1" />
                                    Ver detalles
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => descargarFactura(factura)}
                                    title="Descargar factura"
                                  >
                                    <Download size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Modal de detalle de factura */}
            {mostrarDetalle && facturaSeleccionada && (
              <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content rounded-4">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        <FileText className="me-2" />
                        Detalle de Factura
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          setMostrarDetalle(false)
                          setFacturaSeleccionada(null)
                          setDetallesPedido(null)
                          setClienteInfo(null)
                        }}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <div className="card bg-light border-0 p-3 h-100">
                            <h6 className="mb-3">Información de Factura</h6>
                            <p className="mb-1">
                              <strong>Número:</strong> {`FAC-${facturaSeleccionada.id.substring(0, 8).toUpperCase()}`}
                            </p>
                            <p className="mb-1">
                              <strong>Fecha:</strong>{" "}
                              {formatearFecha(facturaSeleccionada.fecha || facturaSeleccionada.pedido?.fecha)}
                            </p>
                            <p className="mb-1">
                              <strong>Estado:</strong>{" "}
                              <span
                                className={`badge bg-${getEstadoColor(facturaSeleccionada.pedido?.estado || facturaSeleccionada.estado)}`}
                              >
                                {(facturaSeleccionada.pedido?.estado || facturaSeleccionada.estado || "pendiente")
                                  .charAt(0)
                                  .toUpperCase() +
                                  (
                                    facturaSeleccionada.pedido?.estado ||
                                    facturaSeleccionada.estado ||
                                    "pendiente"
                                  ).slice(1)}
                              </span>
                            </p>
                            {facturaSeleccionada.metodo && (
                              <p className="mb-1">
                                <strong>Método de Pago:</strong> {facturaSeleccionada.metodo}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6 mt-3 mt-md-0">
                          <div className="card bg-light border-0 p-3 h-100">
                            <h6 className="mb-3">Información del Cliente</h6>
                            {cargandoDetalles ? (
                              <div className="text-center py-2">
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                  <span className="visually-hidden">Cargando...</span>
                                </div>
                              </div>
                            ) : clienteInfo ? (
                              <>
                                <p className="mb-1">
                                  <strong>Nombre:</strong>{" "}
                                  {clienteInfo.nombre || clienteInfo.displayName || "No disponible"}
                                </p>
                                <p className="mb-1">
                                  <strong>Email:</strong> {clienteInfo.email || "No disponible"}
                                </p>
                                <p className="mb-1">
                                  <strong>ID Cliente:</strong>{" "}
                                  {facturaSeleccionada.pedido?.clientUid ||
                                    facturaSeleccionada.clientUid ||
                                    "No disponible"}
                                </p>
                                {facturaSeleccionada.direccion && (
                                  <p className="mb-1">
                                    <strong>Dirección:</strong>{" "}
                                    {typeof facturaSeleccionada.direccion === "object"
                                      ? `${facturaSeleccionada.direccion.calle || ""}, ${facturaSeleccionada.direccion.ciudad || ""}`
                                      : facturaSeleccionada.direccion}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="mb-1">
                                <strong>ID Cliente:</strong>{" "}
                                {facturaSeleccionada.pedido?.clientUid ||
                                  facturaSeleccionada.clientUid ||
                                  "No disponible"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <h6 className="mb-3">Detalle de Productos</h6>
                      <div className="table-responsive">
                        <table className="table">
                          <thead className="table-light">
                            <tr>
                              <th>Producto</th>
                              <th className="text-center">Cantidad</th>
                              <th className="text-end">Precio</th>
                              <th className="text-end">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {facturaSeleccionada.pedido?.carrito ? (
                              Array.isArray(facturaSeleccionada.pedido.carrito) ? (
                                facturaSeleccionada.pedido.carrito.map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      <div>
                                        <span className="fw-medium">{item.nombre || item.title || "Producto"}</span>
                                        {item.descripcion && <div className="small text-muted">{item.descripcion}</div>}
                                      </div>
                                    </td>
                                    <td className="text-center">{item.cantidad || 1}</td>
                                    <td className="text-end">
                                      $
                                      {typeof item.precio === "number"
                                        ? item.precio.toFixed(2)
                                        : item.precio || item.price?.toFixed(2) || "0.00"}
                                    </td>
                                    <td className="text-end">
                                      $
                                      {typeof item.subtotal === "number"
                                        ? item.subtotal.toFixed(2)
                                        : ((item.precio || item.price || 0) * (item.cantidad || 1)).toFixed(2)}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                Object.values(facturaSeleccionada.pedido.carrito).map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      <div>
                                        <span className="fw-medium">{item.nombre || item.title || "Producto"}</span>
                                        {item.descripcion && <div className="small text-muted">{item.descripcion}</div>}
                                      </div>
                                    </td>
                                    <td className="text-center">{item.cantidad || 1}</td>
                                    <td className="text-end">
                                      $
                                      {typeof item.precio === "number"
                                        ? item.precio.toFixed(2)
                                        : item.precio || item.price?.toFixed(2) || "0.00"}
                                    </td>
                                    <td className="text-end">
                                      $
                                      {typeof item.subtotal === "number"
                                        ? item.subtotal.toFixed(2)
                                        : ((item.precio || item.price || 0) * (item.cantidad || 1)).toFixed(2)}
                                    </td>
                                  </tr>
                                ))
                              )
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center">
                                  No hay productos disponibles
                                </td>
                              </tr>
                            )}
                          </tbody>
                          <tfoot className="table-light">
                            <tr>
                              <td colSpan="3" className="text-end fw-bold">
                                Subtotal:
                              </td>
                              <td className="text-end">
                                $
                                {typeof facturaSeleccionada.pedido?.subTotal === "number"
                                  ? facturaSeleccionada.pedido.subTotal.toFixed(2)
                                  : "0.00"}
                              </td>
                            </tr>
                            {facturaSeleccionada.pedido?.impuestos && (
                              <tr>
                                <td colSpan="3" className="text-end">
                                  Impuestos:
                                </td>
                                <td className="text-end">
                                  $
                                  {typeof facturaSeleccionada.pedido.impuestos === "number"
                                    ? facturaSeleccionada.pedido.impuestos.toFixed(2)
                                    : facturaSeleccionada.pedido.impuestos}
                                </td>
                              </tr>
                            )}
                            {facturaSeleccionada.pedido?.descuento && (
                              <tr>
                                <td colSpan="3" className="text-end">
                                  Descuento:
                                </td>
                                <td className="text-end">
                                  -$
                                  {typeof facturaSeleccionada.pedido.descuento === "number"
                                    ? facturaSeleccionada.pedido.descuento.toFixed(2)
                                    : facturaSeleccionada.pedido.descuento}
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td colSpan="3" className="text-end fw-bold">
                                Total:
                              </td>
                              <td className="text-end fw-bold">
                                $
                                {typeof facturaSeleccionada.pedido?.total === "number"
                                  ? facturaSeleccionada.pedido.total.toFixed(2)
                                  : facturaSeleccionada.pedido?.total || "0.00"}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {detallesPedido && (
                        <div className="mt-4">
                          <h6 className="mb-3 d-flex align-items-center">
                            <Package className="me-2" size={18} />
                            Detalles del Pedido
                          </h6>

                          {cargandoDetalles ? (
                            <div className="text-center py-3">
                              <div className="spinner-border spinner-border-sm text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                              </div>
                              <p className="mt-2 mb-0">Cargando detalles del pedido...</p>
                            </div>
                          ) : (
                            <div className="card bg-light border-0 p-3">
                              <div className="row">
                                <div className="col-md-6">
                                  <p className="mb-1">
                                    <strong>ID del Pedido:</strong> {detallesPedido.id}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Fecha del Pedido:</strong> {formatearFecha(detallesPedido.fecha)}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Estado del Pedido:</strong>
                                    <span className={`badge bg-${getEstadoColor(detallesPedido.estado)} ms-1`}>
                                      {detallesPedido.estado
                                        ? detallesPedido.estado.charAt(0).toUpperCase() + detallesPedido.estado.slice(1)
                                        : "Procesando"}
                                    </span>
                                  </p>
                                </div>
                                <div className="col-md-6">
                                  {facturaSeleccionada.direccion && (
                                    <>
                                      <p className="mb-1">
                                        <strong>Dirección de Envío:</strong>
                                      </p>
                                      <p className="mb-1 ms-3 small">
                                        {typeof facturaSeleccionada.direccion === "object"
                                          ? `${facturaSeleccionada.direccion.calle || ""}, ${facturaSeleccionada.direccion.ciudad || ""}`
                                          : facturaSeleccionada.direccion}
                                      </p>
                                    </>
                                  )}
                                  {facturaSeleccionada.metodo && (
                                    <p className="mb-1">
                                      <strong>Método de Pago:</strong> {facturaSeleccionada.metodo}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {detallesPedido.seguimiento && (
                                <div className="mt-3">
                                  <p className="mb-1">
                                    <strong>Información de Seguimiento:</strong>
                                  </p>
                                  <p className="mb-1 ms-3 small">
                                    <strong>Número de Seguimiento:</strong> {detallesPedido.seguimiento.numero}
                                    <br />
                                    <strong>Servicio:</strong> {detallesPedido.seguimiento.servicio}
                                    <br />
                                    <strong>Enlace:</strong>{" "}
                                    <a
                                      href={detallesPedido.seguimiento.enlace}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Ver seguimiento
                                    </a>
                                  </p>
                                </div>
                              )}

                              {detallesPedido.notas && (
                                <div className="mt-3">
                                  <p className="mb-1">
                                    <strong>Notas del Pedido:</strong>
                                  </p>
                                  <p className="mb-0 bg-white p-2 rounded small">{detallesPedido.notas}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {facturaSeleccionada.notas && (
                        <div className="mt-3">
                          <h6>Notas</h6>
                          <p className="bg-light p-3 rounded">{facturaSeleccionada.notas}</p>
                        </div>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setMostrarDetalle(false)
                          setFacturaSeleccionada(null)
                          setDetallesPedido(null)
                          setClienteInfo(null)
                        }}
                      >
                        Cerrar
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => descargarFactura(facturaSeleccionada)}
                      >
                        <Download size={16} className="me-1" />
                        Descargar Factura
                      </button>
                      
                      {(facturaSeleccionada.pedido?.estado === "pagada" || facturaSeleccionada.estado === "pagada") && (
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={() => cambiarEstadoFactura(facturaSeleccionada.id, "pendiente")}
                        >
                          <Clock size={16} className="me-1" />
                          Marcar como Pendiente
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminFacturacion

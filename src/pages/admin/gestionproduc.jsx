"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import { MoreVertical, Search, Shield, UserCog } from "lucide-react"

// Datos de ejemplo - solo usuarios tipo "productor"
const productores = [
  {
    id: "3",
    nombre: "John Mattox",
    email: "johnmattox@gmail.com",
    fechaCompra: "27 Abril, 2023 a las 2:47pm",
    telefono: "347-424-9526",
    gastado: "$29.00",
    tipo: "productor",
    avatar: "/placeholder.svg",
    cuentaHabilitada: true,
  },
  {
    id: "6",
    nombre: "Ricardo Méndez",
    email: "ricardomendez@gmail.com",
    fechaCompra: "18 Marzo, 2023 a las 2:47pm",
    telefono: "410-636-2682",
    gastado: "$490.00",
    tipo: "productor",
    avatar: "/placeholder.svg",
    cuentaHabilitada: true,
  },
  {
    id: "9",
    nombre: "Carlos Ramírez",
    email: "carlosramirez@gmail.com",
    fechaCompra: "27 Abril, 2023 a las 2:47pm",
    telefono: "347-424-9526",
    gastado: "$29.00",
    tipo: "productor",
    avatar: "/placeholder.svg",
    cuentaHabilitada: false,
  },
]

export default function GestionProductores() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [productorSeleccionado, setProductorSeleccionado] = useState(null)
  const [dialogoEstadoAbierto, setDialogoEstadoAbierto] = useState(false)
  const [estadoTemporal, setEstadoTemporal] = useState(false)
  const [justificacion, setJustificacion] = useState("")

  const elementosPorPagina = 10

  // Filtrar productores según el término de búsqueda
  const productoresFiltrados = productores.filter((productor) => {
    const coincideBusqueda =
      productor.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      productor.email.toLowerCase().includes(terminoBusqueda.toLowerCase())

    return coincideBusqueda
  })

  // Calcular paginación
  const totalPaginas = Math.ceil(productoresFiltrados.length / elementosPorPagina)
  const productoresPaginados = productoresFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina,
  )

  // Función para abrir el diálogo de estado de cuenta
  const abrirDialogoEstado = (productor) => {
    setProductorSeleccionado(productor)
    setEstadoTemporal(productor.cuentaHabilitada)
    setJustificacion("")
    setDialogoEstadoAbierto(true)
  }

  // Función para guardar el estado de la cuenta
  const guardarEstadoCuenta = () => {
    if (productorSeleccionado) {
      // En una aplicación real, aquí enviarías los cambios a la API
      console.log(`Cambiando estado de cuenta para ${productorSeleccionado.nombre}:`, {
        habilitada: estadoTemporal,
        justificacion: justificacion,
      })

      // Cerrar el diálogo
      setDialogoEstadoAbierto(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestión de Productores</h1>

          {/* Breadcrumbs con NavLink */}
          <div className="breadcrumbs">
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Panel
            </NavLink>
            <span> / </span>
            <NavLink to="/admin/productores" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Productores
            </NavLink>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar productores..."
              className="input pl-10 w-full"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla de productores */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" className="checkbox" />
                </th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Fecha de Compra</th>
                <th>Teléfono</th>
                <th>Gastado</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productoresPaginados.map((productor) => (
                <tr key={productor.id}>
                  <td>
                    <input type="checkbox" className="checkbox" />
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full">
                          <img src={productor.avatar || "/placeholder.svg"} alt={productor.nombre} />
                        </div>
                      </div>
                      <span className="font-medium">{productor.nombre}</span>
                    </div>
                  </td>
                  <td>{productor.email}</td>
                  <td>{productor.fechaCompra}</td>
                  <td>{productor.telefono || "-"}</td>
                  <td>{productor.gastado}</td>
                  <td>
                    <span
                      className={`badge ${productor.cuentaHabilitada ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {productor.cuentaHabilitada ? "Habilitada" : "Deshabilitada"}
                    </span>
                  </td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-xs">
                        <MoreVertical className="h-4 w-4" />
                      </label>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                          <a>Ver detalles</a>
                        </li>
                        <li>
                          <a>Editar productor</a>
                        </li>
                        <li className="divider"></li>
                        <li>
                          <a onClick={() => abrirDialogoEstado(productor)}>
                            <UserCog className="h-4 w-4 mr-2" />
                            Gestionar estado
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Mostrando {(paginaActual - 1) * elementosPorPagina + 1} a{" "}
            {Math.min(paginaActual * elementosPorPagina, productoresFiltrados.length)} de {productoresFiltrados.length}{" "}
            entradas
          </p>

          <div className="flex gap-1">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>

            {Array.from({ length: Math.min(totalPaginas, 5) }, (_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${paginaActual === i + 1 ? "btn-primary" : "btn-outline"}`}
                onClick={() => setPaginaActual(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-outline btn-sm"
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
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Gestionar Estado de Cuenta
            </h3>

            {productorSeleccionado && (
              <div className="flex items-center gap-2 mt-2">
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full">
                    <img src={productorSeleccionado.avatar || "/placeholder.svg"} alt={productorSeleccionado.nombre} />
                  </div>
                </div>
                <div>
                  <p className="font-medium">{productorSeleccionado.nombre}</p>
                  <p className="text-sm text-gray-500">{productorSeleccionado.email}</p>
                </div>
              </div>
            )}

            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <label htmlFor="habilitar-cuenta" className="flex items-center gap-2">
                  Cuenta Habilitada
                </label>
                <input
                  type="checkbox"
                  id="habilitar-cuenta"
                  className="toggle"
                  checked={estadoTemporal}
                  onChange={(e) => setEstadoTemporal(e.target.checked)}
                />
              </div>

              <div className="mt-2">
                <label htmlFor="justificacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Justificación
                </label>
                <textarea
                  id="justificacion"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ingrese la justificación para este cambio de estado..."
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn btn-outline" onClick={() => setDialogoEstadoAbierto(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={guardarEstadoCuenta} disabled={!justificacion.trim()}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"

function PropuestaEventoModal({ onClose, onSubmit }) {
  const [propuesta, setPropuesta] = useState({
    nombre: "",
    descripcion: "",
    categoria: "feria",
    fechaPropuesta: "",
    imagen: null,
    imagenPreview: null,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPropuesta((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // En un entorno real, aquí subirías la imagen a Firebase Storage
      // Por ahora, solo creamos una URL temporal para la vista previa
      const reader = new FileReader()
      reader.onload = (event) => {
        setPropuesta((prev) => ({
          ...prev,
          imagen: file,
          imagenPreview: event.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!propuesta.nombre || !propuesta.descripcion || !propuesta.fechaPropuesta) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    onSubmit(propuesta)
  }

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">Proponer un nuevo evento</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tipo de evento</label>
                <select
                  className="form-select"
                  name="categoria"
                  value={propuesta.categoria}
                  onChange={handleInputChange}
                >
                  <option value="feria">Feria</option>
                  <option value="cooperativa">Cooperativa</option>
                  <option value="taller">Taller</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre del evento *</label>
                <input
                  className="form-control"
                  type="text"
                  name="nombre"
                  placeholder="Nombre del evento"
                  value={propuesta.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción *</label>
                <textarea
                  className="form-control"
                  name="descripcion"
                  placeholder="Describe tu idea para este evento"
                  value={propuesta.descripcion}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha propuesta *</label>
                <input
                  className="form-control"
                  type="date"
                  name="fechaPropuesta"
                  value={propuesta.fechaPropuesta}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Imagen del evento</label>
                <input className="form-control" type="file" accept="image/*" onChange={handleImagenChange} />
                {propuesta.imagenPreview && (
                  <div className="mt-2">
                    <img
                      src={propuesta.imagenPreview || "/placeholder.svg"}
                      alt="Vista previa"
                      className="img-thumbnail"
                      style={{ maxHeight: "150px" }}
                    />
                  </div>
                )}
              </div>

              <div className="alert alert-info">
                <small>
                  <i className="bi bi-info-circle me-2"></i>
                  Tu propuesta será revisada por nuestro equipo. Te contactaremos pronto con una respuesta.
                </small>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Enviar propuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropuestaEventoModal

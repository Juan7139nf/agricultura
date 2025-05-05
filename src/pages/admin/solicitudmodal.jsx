"use client"

function SolicitudModal({ solicitud, onClose, onAprobar, onRechazar }) {
  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">Solicitud de participación</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-light border mb-4">
              <div className="d-flex align-items-center mb-2">
                <div
                  className={`badge bg-${
                    solicitud.evento.categoria === "feria"
                      ? "success"
                      : solicitud.evento.categoria === "taller"
                        ? "warning"
                        : "primary"
                  } me-2`}
                >
                  {solicitud.evento.categoria.charAt(0).toUpperCase() + solicitud.evento.categoria.slice(1)}
                </div>
                <h5 className="mb-0">{solicitud.evento.nombre}</h5>
              </div>
              <p className="mb-1">
                <small>
                  <strong>Fecha:</strong> {solicitud.evento.fecha} | {solicitud.evento.hora}
                </small>
              </p>
              <p className="mb-0">
                <small>
                  <strong>Cupos disponibles:</strong> {solicitud.evento.cuposDisponibles} de{" "}
                  {solicitud.evento.cuposTotal}
                </small>
              </p>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">Datos del solicitante</h6>
              </div>
              <div className="card-body">
                <p>
                  <strong>Nombre:</strong> {solicitud.usuarioNombre}
                </p>
                <p>
                  <strong>Email:</strong> {solicitud.usuarioEmail}
                </p>
                {solicitud.mensaje && (
                  <div>
                    <strong>Mensaje:</strong>
                    <p className="border-start ps-3 mt-2 text-muted">{solicitud.mensaje}</p>
                  </div>
                )}
                <p className="mb-0 text-muted">
                  <small>
                    <strong>Fecha de solicitud:</strong> {new Date(solicitud.fechaCreacion).toLocaleString()}
                  </small>
                </p>
              </div>
            </div>

            <div className="alert alert-info">
              <small>
                <i className="bi bi-info-circle me-2"></i>
                {solicitud.evento.cuposDisponibles > 0
                  ? "Hay cupos disponibles para este evento."
                  : "No hay cupos disponibles para este evento."}
              </small>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cerrar
              </button>
              <button type="button" className="btn btn-danger" onClick={() => onRechazar(solicitud)}>
                Rechazar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => onAprobar(solicitud)}
                disabled={solicitud.evento.cuposDisponibles <= 0}
              >
                Aprobar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolicitudModal;

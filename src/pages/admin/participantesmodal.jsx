"use client"

function ParticipantesModal({ evento, participantes, onClose }) {
  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">Participantes del evento: {evento.nombre}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-light border mb-4">
              <div className="d-flex align-items-center mb-2">
                <div
                  className={`badge bg-${
                    evento.categoria === "feria" ? "success" : evento.categoria === "taller" ? "warning" : "primary"
                  } me-2`}
                >
                  {evento.categoria.charAt(0).toUpperCase() + evento.categoria.slice(1)}
                </div>
                <h5 className="mb-0">{evento.nombre}</h5>
              </div>
              <p className="mb-1">
                <small>
                  <strong>Fecha:</strong> {evento.fecha} | {evento.hora}
                </small>
              </p>
              <p className="mb-0">
                <small>
                  <strong>Cupos ocupados:</strong> {evento.cuposTotal - evento.cuposDisponibles} de {evento.cuposTotal}
                </small>
              </p>
            </div>

            {participantes.length === 0 ? (
              <div className="alert alert-info">
                <p className="mb-0">No hay participantes registrados para este evento.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Fecha de aprobación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantes.map((participante) => (
                      <tr key={participante.id}>
                        <td>{participante.usuarioNombre}</td>
                        <td>{participante.usuarioEmail}</td>
                        <td>{new Date(participante.fechaAprobacion).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantesModal;

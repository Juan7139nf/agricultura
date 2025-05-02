import React, { useState, useEffect } from "react";
import { ref, set, push, onValue, update } from "firebase/database";
import { database } from "../../scripts/firebase/firebase";
import { AdminNav } from "../../scripts/components/adminNav";

function GestionEvento() {
  const [eventos, setEventos] = useState([]);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    hora: "",
    cuposTotal: 0,
  });

  useEffect(() => {
    const eventosRef = ref(database, "eventos");
    onValue(eventosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventosList = Object.keys(data).map((id) => ({ id, ...data[id] }));
        setEventos(eventosList);
      } else {
        setEventos([]);
      }
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEvento((prev) => ({
      ...prev,
      [name]: name === "cuposTotal" ? Number.parseInt(value) || 0 : value,
    }));
  };

  const crearEvento = async () => {
    const { nombre, descripcion, fecha, hora, cuposTotal } = nuevoEvento;

    if (!nombre || !descripcion || !fecha || !hora || cuposTotal <= 0) {
      alert("Por favor complete todos los campos correctamente");
      return;
    }

    const nuevoEventoCompleto = {
      ...nuevoEvento,
      cuposDisponibles: cuposTotal,
      estado: "activo",
      imagen: "/placeholder.svg",
      participantes: {},
      solicitudes: {},
    };

    try {
      const eventosRef = ref(database, "eventos");
      const nuevoRef = push(eventosRef);
      await set(nuevoRef, nuevoEventoCompleto);
      setNuevoEvento({
        nombre: "",
        descripcion: "",
        fecha: "",
        hora: "",
        cuposTotal: 0,
      });
    } catch (error) {
      console.error("Error al crear evento:", error);
    }
  };

  const editarEvento = (id) => {
    alert("Función de edición en desarrollo para el evento: " + id);
  };

  const verParticipantes = (id) => {
    alert("Aquí se mostrará la lista de participantes y solicitudes para: " + id);
  };

  return (
    <div className="container-md">
      <div className="row">
        <AdminNav />
        <div className="col-lg-9 col-md-8 col-12">
          <div className="py-5 p-md-6 p-lg-10">
            <h1 className="mb-4">Gestión de Eventos</h1>

            <div className="card p-4 shadow-sm rounded-4 mb-5">
              <input
                className="form-control mb-3"
                type="text"
                name="nombre"
                placeholder="Nombre del evento"
                value={nuevoEvento.nombre}
                onChange={handleInputChange}
              />
              <textarea
                className="form-control mb-3"
                name="descripcion"
                placeholder="Descripción"
                value={nuevoEvento.descripcion}
                onChange={handleInputChange}
              />
              <input
                className="form-control mb-3"
                type="text"
                name="fecha"
                placeholder="Fecha"
                value={nuevoEvento.fecha}
                onChange={handleInputChange}
              />
              <input
                className="form-control mb-3"
                type="text"
                name="hora"
                placeholder="Hora"
                value={nuevoEvento.hora}
                onChange={handleInputChange}
              />
              <input
                className="form-control mb-3"
                type="number"
                name="cuposTotal"
                placeholder="Cupos Totales"
                value={nuevoEvento.cuposTotal}
                onChange={handleInputChange}
              />
              <button className="btn btn-success w-100" onClick={crearEvento}>
                Crear Evento
              </button>
            </div>

            <div className="row">
              {eventos.map((evento) => (
                <div key={evento.id} className="col-md-6 mb-4">
                  <div className="card p-3 shadow-sm rounded-4">
                    <h5>{evento.nombre}</h5>
                    <p>{evento.descripcion}</p>
                    <p><strong>Fecha:</strong> {evento.fecha}</p>
                    <p><strong>Hora:</strong> {evento.hora}</p>
                    <p><strong>Cupos:</strong> {evento.cuposDisponibles} / {evento.cuposTotal}</p>
                    <span className="badge bg-success text-uppercase">
                      {evento.estado}
                    </span>

                    <div className="mt-3 d-flex gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => editarEvento(evento.id)}>
                        Editar
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => verParticipantes(evento.id)}>
                        Participantes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionEvento;

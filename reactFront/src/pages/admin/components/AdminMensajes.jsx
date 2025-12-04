import React, { useState, useEffect } from "react";
import MensajeModal from "./MensajeModal";
import { obtenerMensajes } from "../services/adminService";

const AdminMensajes = () => {
  const [mensajes, setMensajes] = useState([]);
  const [mensajesFiltrados, setMensajesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    hoy: 0,
    semana: 0,
  });

  // Cargar mensajes
  useEffect(() => {
    cargarMensajes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrar mensajes
  useEffect(() => {
    filtrarMensajes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, dateFilter, mensajes]);

  const cargarMensajes = async () => {
    setLoading(true);
    try {
      const data = await obtenerMensajes();
      console.log("Mensajes cargados:", data);
      setMensajes(data || []);
      actualizarEstadisticas(data || []);
    } catch (error) {
      console.error("Error cargando mensajes:", error);
      alert("Error cargando mensajes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadisticas = (mensajesData) => {
    const total = mensajesData.length;

    // Mensajes de hoy
    const hoy = mensajesData.filter(
      (m) => new Date(m.fechaEnvio).toDateString() === new Date().toDateString()
    ).length;

    // Mensajes de la semana
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    const semana = mensajesData.filter(
      (m) => new Date(m.fechaEnvio) >= hace7Dias
    ).length;

    setStats({ total, hoy, semana });
  };

  const filtrarMensajes = () => {
    let filtrados = mensajes;

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtrados = filtrados.filter(
        (msg) =>
          (msg.cliente?.nombre || "").toLowerCase().includes(q) ||
          (msg.cliente?.email || "").toLowerCase().includes(q) ||
          (msg.mensaje || "").toLowerCase().includes(q)
      );
    }

    // Filtro por fecha
    if (dateFilter) {
      filtrados = filtrados.filter((msg) => {
        const fechaMensaje = new Date(msg.fechaEnvio)
          .toISOString()
          .split("T")[0];
        return fechaMensaje === dateFilter;
      });
    }

    // Ordenar por fecha más reciente primero
    filtrados.sort((a, b) => new Date(b.fechaEnvio) - new Date(a.fechaEnvio));

    setMensajesFiltrados(filtrados);
  };

  const handleVerMensaje = (mensaje) => {
    setMensajeSeleccionado(mensaje);
    setShowModal(true);
  };

  const handleLimpiarFiltros = () => {
    setSearchQuery("");
    setDateFilter("");
  };

  const esNuevo = (fechaEnvio) => {
    return Date.now() - new Date(fechaEnvio).getTime() < 24 * 60 * 60 * 1000;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString("es-ES");
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Mensajes de Contacto</h2>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div
            className="card"
            style={{
              borderRadius: "18px",
              backgroundColor: "#f8f9fa",
              border: "none",
            }}
          >
            <div className="card-body">
              <h3 className="card-title fw-bold text-danger mb-0">
                {stats.total}
              </h3>
              <p className="card-text text-muted mb-0">Total de mensajes</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card"
            style={{
              borderRadius: "18px",
              backgroundColor: "#f8f9fa",
              border: "none",
            }}
          >
            <div className="card-body">
              <h3 className="card-title fw-bold text-danger mb-0">
                {stats.hoy}
              </h3>
              <p className="card-text text-muted mb-0">Mensajes hoy</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card"
            style={{
              borderRadius: "18px",
              backgroundColor: "#f8f9fa",
              border: "none",
            }}
          >
            <div className="card-body">
              <h3 className="card-title fw-bold text-danger mb-0">
                {stats.semana}
              </h3>
              <p className="card-text text-muted mb-0">Mensajes esta semana</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "300px" }}
          placeholder="Buscar por nombre, email o mensaje..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          style={{ maxWidth: "180px" }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary"
          onClick={handleLimpiarFiltros}
        >
          <i className="bi bi-x-circle"></i> Limpiar filtros
        </button>
        <button className="btn btn-outline-primary" onClick={cargarMensajes}>
          <i className="bi bi-arrow-clockwise"></i> Actualizar
        </button>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle table-admin">
          <thead className="table-success">
            <tr>
              <th style={{ width: "50px" }}>ID</th>
              <th style={{ width: "150px" }}>Nombre</th>
              <th style={{ width: "180px" }}>Email</th>
              <th style={{ width: "100px" }}>DNI</th>
              <th style={{ width: "120px" }}>Teléfono</th>
              <th>Mensaje</th>
              <th style={{ width: "160px" }}>Fecha de Envío</th>
              <th style={{ width: "100px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mensajesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <div className="d-flex flex-column align-items-center">
                    <i
                      className="bi bi-inbox text-muted"
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <p className="h5 mt-3 mb-0 text-muted">
                      No hay mensajes para mostrar
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              mensajesFiltrados.map((mensaje) => (
                <tr key={mensaje.id}>
                  <td>{mensaje.id}</td>
                  <td>{mensaje.cliente?.nombre || "—"}</td>
                  <td>{mensaje.cliente?.email || "—"}</td>
                  <td>{mensaje.cliente?.dni || "—"}</td>
                  <td>{mensaje.cliente?.telefono || "—"}</td>
                  <td
                    style={{
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                    }}
                    title={mensaje.mensaje}
                  >
                    {mensaje.mensaje}
                    {esNuevo(mensaje.fechaEnvio) && (
                      <span
                        className="badge ms-2"
                        style={{
                          backgroundColor: "#28a745",
                          fontSize: "0.75rem",
                        }}
                      >
                        Nuevo
                      </span>
                    )}
                  </td>
                  <td>{formatDate(mensaje.fechaEnvio)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleVerMensaje(mensaje)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <MensajeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        mensaje={mensajeSeleccionado}
      />
    </div>
  );
};

export default AdminMensajes;

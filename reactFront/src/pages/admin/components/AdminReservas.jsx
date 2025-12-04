import React, { useState, useEffect } from "react";
import ReservaModal from "./ReservaModal";
import { obtenerReservas, actualizarReserva } from "../services/adminService";

const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Cargar reservas
  useEffect(() => {
    cargarReservas();
  }, []);

  // Filtrar reservas
  useEffect(() => {
    filtrarReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, reservas]);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const data = await obtenerReservas();
      console.log("Reservas cargadas:", data);
      setReservas(data || []);
    } catch (error) {
      console.error("Error cargando reservas:", error);
      alert("Error cargando reservas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filtrarReservas = () => {
    if (!reservas || reservas.length === 0) {
      setReservasFiltradas([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const filtered = reservas.filter((reserva) => {
      const matchesSearch =
        (reserva.cliente?.nombre || "").toLowerCase().includes(q) ||
        (reserva.numeroReserva || "").toString().includes(q);

      const estado = normalizeEstado(reserva.estado);
      const matchesStatus =
        statusFilter === "all" || estado === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    // Ordenar: pendiente primero, luego por fecha más reciente
    const ordenados = filtered.sort((a, b) => {
      const estadoA = normalizeEstado(a.estado);
      const estadoB = normalizeEstado(b.estado);
      const ordenEstados = { pendiente: 1, completada: 2, cancelada: 3 };

      if (ordenEstados[estadoA] !== ordenEstados[estadoB]) {
        return ordenEstados[estadoA] - ordenEstados[estadoB];
      }

      return new Date(b.fechaReserva) - new Date(a.fechaReserva);
    });

    setReservasFiltradas(ordenados);
  };

  const normalizeEstado = (estado) => {
    switch (estado?.toUpperCase()) {
      case "PENDIENTE":
        return "pendiente";
      case "ENTREGADA":
        return "completada";
      case "CANCELADA":
        return "cancelada";
      default:
        return estado?.toLowerCase() || "desconocido";
    }
  };

  const getEstadoColor = (estado) => {
    const normalized = normalizeEstado(estado);
    switch (normalized) {
      case "pendiente":
        return "warning";
      case "completada":
        return "success";
      case "cancelada":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleVerDetalles = (reserva) => {
    setReservaSeleccionada(reserva);
    setShowModal(true);
  };

  const handleCompletarReserva = async (reserva) => {
    try {
      const payload = {
        ...reserva,
        estado: "ENTREGADA",
        fechaEntrega: new Date().toISOString(),
        detalles: (reserva.detalles || []).map((d) => ({
          ...d,
          producto: {
            idProducto: d.producto?.idProducto,
          },
        })),
        cliente: {
          idCliente: reserva.cliente?.idCliente,
        },
      };

      await actualizarReserva(reserva.idReserva, payload);
      alert("Reserva completada exitosamente");
      await cargarReservas();
      setShowModal(false);
    } catch (error) {
      alert("Error al completar la reserva: " + error.message);
      console.error(error);
    }
  };

  const handleCancelarReserva = async (reserva) => {
    if (!window.confirm("¿Está seguro de que desea cancelar esta reserva?")) {
      return;
    }

    try {
      const payload = {
        ...reserva,
        estado: "CANCELADA",
        detalles: (reserva.detalles || []).map((d) => ({
          ...d,
          producto: {
            idProducto: d.producto?.idProducto,
          },
        })),
        cliente: {
          idCliente: reserva.cliente?.idCliente,
        },
      };

      await actualizarReserva(reserva.idReserva, payload);
      alert("Reserva cancelada exitosamente");
      await cargarReservas();
      setShowModal(false);
    } catch (error) {
      alert("Error al cancelar la reserva: " + error.message);
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
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
      <h2 className="mb-4">Gestión de Reservas</h2>

      <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
        <button className="btn btn-danger" onClick={handleLogout}>
          Cerrar sesión
        </button>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "300px" }}
          placeholder="Buscar por nombre de cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle table-admin">
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <div className="d-flex flex-column align-items-center">
                    <i
                      className="bi bi-inbox text-muted"
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <p className="h5 mt-3 mb-0 text-muted">
                      No hay reservas disponibles
                    </p>
                    <p className="text-muted">
                      Las reservas realizadas por los clientes aparecerán aquí
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              reservasFiltradas.map((reserva) => (
                <tr key={reserva.idReserva}>
                  <td>{reserva.numeroReserva || reserva.idReserva}</td>
                  <td>{reserva.cliente?.nombre || "N/A"}</td>
                  <td>
                    {new Date(reserva.fechaReserva).toLocaleString("es-ES")}
                  </td>
                  <td>
                    <span
                      className={`badge bg-${getEstadoColor(reserva.estado)}`}
                    >
                      {normalizeEstado(reserva.estado)}
                    </span>
                  </td>
                  <td>S/ {reserva.total?.toFixed(2) || "0.00"}</td>
                  <td>{(reserva.detalles || []).length} productos</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleVerDetalles(reserva)}
                    >
                      <i className="bi bi-eye"></i> Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ReservaModal
        show={showModal}
        onHide={() => setShowModal(false)}
        reserva={reservaSeleccionada}
        onCompletarReserva={handleCompletarReserva}
        onCancelarReserva={handleCancelarReserva}
      />
    </div>
  );
};

export default AdminReservas;

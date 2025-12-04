import React, { useState, useEffect } from "react";
import ClienteModal from "./ClienteModal";
import {
  obtenerClientes,
  actualizarCliente,
} from "../services/adminService";

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [showDetalles, setShowDetalles] = useState(false);
  const [clienteDetalles, setClienteDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Cargar datos
  useEffect(() => {
    cargarDatos();
  }, []);

  // Filtrar clientes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setClientesFiltrados(clientes);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = clientes.filter(
        (c) =>
          (c.nombre || "").toLowerCase().includes(q) ||
          (c.dni || "").toLowerCase().includes(q)
      );
      setClientesFiltrados(filtered);
    }
  }, [searchQuery, clientes]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const clientesData = await obtenerClientes();
      console.log("Clientes cargados:", clientesData);
      setClientes(clientesData || []);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ver detalles
  const handleVerDetalles = (cliente) => {
    setClienteDetalles(cliente);
    setShowDetalles(true);
  };

  // Editar cliente
  const handleEditar = (cliente) => {
    setClienteEditando(cliente);
    setShowModal(true);
  };

  // Guardar cliente
  const handleGuardar = async (formData) => {
    try {
      await actualizarCliente(clienteEditando.idCliente, formData);
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      alert("Error al actualizar el cliente: " + error.message);
      console.error(error);
    }
  };

  // Logout
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
      <h2 className="mb-2 d-flex align-items-center">
        Gestión de Clientes
        <span className="badge bg-primary ms-3">{clientesFiltrados.length}</span>
      </h2>

      <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
        <button className="btn btn-danger ms-2" onClick={handleLogout}>
          Cerrar sesión
        </button>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "300px" }}
          placeholder="Buscar por nombre o DNI..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle table-admin">
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Condición Crónica</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No hay clientes registrados
                </td>
              </tr>
            ) : (
              clientesFiltrados.map((cli) => (
                <tr key={cli.idCliente}>
                  <td>{cli.idCliente}</td>
                  <td>{cli.nombre}</td>
                  <td>{cli.dni}</td>
                  <td>{cli.email || "-"}</td>
                  <td>{cli.telefono || "-"}</td>
                  <td>
                    {cli.tieneCondicionCronica ? (
                      <span className="badge bg-warning text-dark">Sí</span>
                    ) : (
                      <span className="badge bg-secondary">No</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-1"
                      onClick={() => handleVerDetalles(cli)}
                    >
                      <i className="bi bi-eye"></i> Ver
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditar(cli)}
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detalles */}
      {showDetalles && clienteDetalles && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Detalles del Cliente</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDetalles(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>ID:</strong> {clienteDetalles.idCliente}
                  </li>
                  <li className="list-group-item">
                    <strong>Nombre:</strong> {clienteDetalles.nombre}
                  </li>
                  <li className="list-group-item">
                    <strong>DNI:</strong> {clienteDetalles.dni}
                  </li>
                  <li className="list-group-item">
                    <strong>Email:</strong> {clienteDetalles.email || "-"}
                  </li>
                  <li className="list-group-item">
                    <strong>Teléfono:</strong> {clienteDetalles.telefono || "-"}
                  </li>
                  <li className="list-group-item">
                    <strong>Dirección:</strong>{" "}
                    {clienteDetalles.direccion || "-"}
                  </li>
                  <li className="list-group-item">
                    <strong>Fecha de nacimiento:</strong>{" "}
                    {clienteDetalles.fechaNacimiento || "-"}
                  </li>
                  <li className="list-group-item">
                    <strong>Condición crónica:</strong>{" "}
                    {clienteDetalles.tieneCondicionCronica ? "Sí" : "No"}
                  </li>
                  <li className="list-group-item">
                    <strong>Notas especiales:</strong>{" "}
                    {clienteDetalles.notasEspeciales || "Ninguna"}
                  </li>
                  <li className="list-group-item">
                    <strong>Acepta notificaciones:</strong>{" "}
                    {clienteDetalles.aceptaNotificaciones ? "Sí" : "No"}
                  </li>
                </ul>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetalles(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ClienteModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleGuardar}
        cliente={clienteEditando}
      />
    </div>
  );
};

export default AdminClientes;
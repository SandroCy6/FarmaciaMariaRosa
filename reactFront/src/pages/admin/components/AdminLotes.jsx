import React, { useState, useEffect } from "react";
import LoteModal from "./LoteModal";
import {
  obtenerLotes,
  obtenerProductos,
  crearLote,
  actualizarLote,
  eliminarLote,
} from "../services/adminService";

const AdminLotes = () => {
  const [lotes, setLotes] = useState([]);
  const [lotesFiltrados, setLotesFiltrados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loteEditando, setLoteEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Cargar datos
  useEffect(() => {
    cargarDatos();
  }, []);

  // Filtrar lotes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setLotesFiltrados(lotes);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = lotes.filter(
        (l) =>
          (l.numeroLote || "").toLowerCase().includes(q) ||
          (l.nombreProducto || "").toLowerCase().includes(q)
      );
      setLotesFiltrados(filtered);
    }
  }, [searchQuery, lotes]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [lotesData, productosData] = await Promise.all([
        obtenerLotes(),
        obtenerProductos(),
      ]);
      console.log("Lotes cargados:", lotesData);
      console.log("Productos cargados:", productosData);
      setLotes(lotesData || []);
      setProductos(productosData || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
      alert("Error cargando datos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Agregar lote
  const handleAgregar = () => {
    setLoteEditando(null);
    setShowModal(true);
  };

  // Editar lote
  const handleEditar = (lote) => {
    setLoteEditando(lote);
    setShowModal(true);
  };

  // Guardar lote
  const handleGuardar = async (formData) => {
    try {
      if (loteEditando) {
        await actualizarLote(loteEditando.idLote, formData);
      } else {
        await crearLote(formData);
      }
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      alert("Error al guardar el lote: " + error.message);
      console.error(error);
    }
  };

  // Eliminar lote
  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este lote?")) {
      try {
        await eliminarLote(id);
        await cargarDatos();
      } catch (error) {
        alert("Error al eliminar el lote: " + error.message);
        console.error(error);
      }
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  };

  // Obtener clase de estado
  const getEstadoClass = (estado) => {
    const estadoMap = {
      ACTIVO: "bg-success",
      VENCIDO: "bg-danger",
      AGOTADO: "bg-warning",
      INACTIVO: "bg-secondary",
    };
    return estadoMap[estado] || "bg-secondary";
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString("es-ES", options);
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
      <h2 className="mb-2 d-flex align-items-center">
        Gestión de Lotes
        <span className="badge bg-primary ms-3">{lotesFiltrados.length}</span>
      </h2>

      <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
        <button className="btn btn-primary" onClick={handleAgregar}>
          Agregar Lote
        </button>
        <button className="btn btn-danger ms-2" onClick={handleLogout}>
          Cerrar sesión
        </button>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "300px" }}
          placeholder="Buscar por número de lote..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle table-admin">
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>Número de Lote</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Fecha de Vencimiento</th>
              <th>Fecha de Fabricación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lotesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No hay lotes registrados
                </td>
              </tr>
            ) : (
              lotesFiltrados.map((lote) => (
                <tr key={lote.idLote}>
                  <td>{lote.idLote}</td>
                  <td>
                    <strong>{lote.numeroLote || "N/A"}</strong>
                  </td>
                  <td>{lote.nombreProducto || "N/A"}</td>
                  <td>
                    {lote.stockActual || 0}/{lote.stockInicial || 0}
                  </td>
                  <td>{formatDate(lote.fechaVencimiento)}</td>
                  <td>{formatDate(lote.fechaIngreso)}</td>
                  <td>
                    <span className={`badge ${getEstadoClass(lote.estado)}`}>
                      {lote.estado || "N/A"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-1"
                      onClick={() => handleEditar(lote)}
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(lote.idLote)}
                    >
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <LoteModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleGuardar}
        lote={loteEditando}
        productos={productos}
      />
    </div>
  );
};

export default AdminLotes;
import React, { useState, useEffect } from "react";
import CategoriaModal from "./CategoriaModal";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../services/adminService";

const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchNombre, setSearchNombre] = useState("");

  // Cargar datos
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const categoriasData = await obtenerCategorias();
      console.log("Categorías cargadas:", categoriasData);
      setCategorias(categoriasData || []);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar categorías
  const categoriasFiltradas = categorias.filter((c) =>
    searchNombre === ""
      ? true
      : c.nombre.toLowerCase().includes(searchNombre.toLowerCase())
  );

  // Agregar categoría
  const handleAgregar = () => {
    setCategoriaEditando(null);
    setShowModal(true);
  };

  // Editar categoría
  const handleEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setShowModal(true);
  };

  // Guardar categoría
  const handleGuardar = async (formData) => {
    try {
      const payload = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        imagenUrl: formData.imagenUrl.trim() || null,
        estado: formData.estado,
        orden: formData.orden ? Number(formData.orden) : null,
      };

      if (categoriaEditando) {
        await actualizarCategoria(categoriaEditando.idCategoria, payload);
      } else {
        await crearCategoria(payload);
      }
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      alert("Error al guardar la categoría: " + error.message);
      console.error(error);
    }
  };

  // Eliminar categoría
  const handleEliminar = async (id) => {
    if (
      window.confirm(
        "¿Eliminar esta categoría? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await eliminarCategoria(id);
        await cargarDatos();
      } catch (error) {
        alert("Error al eliminar la categoría");
        console.error(error);
      }
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
        Gestión de Categorías
        <span className="badge bg-primary ms-3">{categoriasFiltradas.length}</span>
      </h2>

      <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
        <button className="btn btn-primary" onClick={handleAgregar}>
          Agregar Categoría
        </button>
        <button className="btn btn-danger ms-2" onClick={handleLogout}>
          Cerrar sesión
        </button>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "300px" }}
          placeholder="Buscar por nombre..."
          value={searchNombre}
          onChange={(e) => setSearchNombre(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle table-admin">
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Orden</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No hay categorías disponibles
                </td>
              </tr>
            ) : (
              categoriasFiltradas.map((cat) => (
                <tr key={cat.idCategoria}>
                  <td>{cat.idCategoria}</td>
                  <td>{cat.nombre}</td>
                  <td>{cat.descripcion || ""}</td>
                  <td>
                    {cat.estado ? (
                      <span className="badge bg-success">Activo</span>
                    ) : (
                      <span className="badge bg-secondary">Inactivo</span>
                    )}
                  </td>
                  <td>{cat.orden ?? ""}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditar(cat)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleEliminar(cat.idCategoria)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CategoriaModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleGuardar}
        categoria={categoriaEditando}
      />
    </div>
  );
};

export default AdminCategorias;
import React, { useState, useEffect } from "react";
import ProductModal from "./ProductoModal";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerCategorias,
} from "../services/adminService";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [searchNombre, setSearchNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("all");

  // Cargar datos
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [productosData, categoriasData] = await Promise.all([
        obtenerProductos(),
        obtenerCategorias(),
      ]);
      console.log("Productos cargados:", productosData);
      console.log("Categorías cargadas:", categoriasData);
      setProductos(productosData || []);
      setCategorias(categoriasData || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter((p) => {
    const coincideId =
      searchId === "" || p.idProducto.toString().includes(searchId);
    const coincideNombre =
      searchNombre === "" ||
      p.nombre.toLowerCase().includes(searchNombre.toLowerCase());
    const coincideCategoria =
      filtroCategoria === "all" || p.idCategoria === parseInt(filtroCategoria);
    return coincideId && coincideNombre && coincideCategoria;
  });

  // Agregar producto
  const handleAgregar = () => {
    setProductoEditando(null);
    setShowModal(true);
  };

  // Editar producto
  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setShowModal(true);
  };

  // Guardar producto
  const handleGuardar = async (formData) => {
    try {
      if (productoEditando) {
        await actualizarProducto(productoEditando.idProducto, formData);
      } else {
        await crearProducto(formData);
      }
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      alert("Error al guardar el producto");
      console.error(error);
    }
  };

  // Eliminar producto
  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await eliminarProducto(id);
        await cargarDatos();
      } catch (error) {
        alert("Error al eliminar el producto");
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
      <h2 className="mb-4">Gestión de Productos</h2>

      <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
        <button
          className="btn btn-primary"
          onClick={handleAgregar}
        >
          Agregar Producto
        </button>
        <button className="btn btn-danger ms-2" onClick={handleLogout}>
          Cerrar sesión
        </button>
        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.idCategoria} value={cat.idCategoria}>
              {cat.nombre}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "120px" }}
          placeholder="Buscar por ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "300px" }}
          placeholder="Buscar producto..."
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
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Imagen</th>
              <th>Caducidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  No hay productos disponibles
                </td>
              </tr>
            ) : (
              productosFiltrados.map((p) => (
                <tr key={p.idProducto}>
                  <td>{p.idProducto}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoriaNombre || "Sin categoría"}</td>
                  <td>{p.descripcion || ""}</td>
                  <td>S/ {(p.precio ?? 0).toFixed(2)}</td>
                  <td>{p.stockActual ?? 0}</td>
                  <td>
                    <img
                      src={p.imagenPrincipal || "/assets/img/no-image.png"}
                      alt="img"
                      width="60"
                    />
                  </td>
                  <td>
                    {p.fechaVencimiento
                      ? new Date(p.fechaVencimiento).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditar(p)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleEliminar(p.idProducto)}
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

      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleGuardar}
        producto={productoEditando}
        categorias={categorias}
      />
    </div>
  );
};

export default AdminProductos;
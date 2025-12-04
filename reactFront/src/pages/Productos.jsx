import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const API_BASE = "/api";
const TOKEN = "dummy-token";

const Productos = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || []
  );
  const [clienteData, setClienteData] = useState({
    email: user?.email || "",
    nombre: "",
    dni: "",
    telefono: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(false);
  const [processingReserva, setProcessingReserva] = useState(false);

  const itemsPerPage = 6;
  const maxVisiblePages = 5;

  // Cargar categorías
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE}/categorias`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error cargando categorías:", error);
        setCategorias([]);
      }
    };
    loadCategorias();
  }, []);

  // Cargar productos
  useEffect(() => {
    const loadProductos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/productos`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const productosDTO = await response.json();

        // Mapear ProductoDTO a estructura del frontend
        const productosMapped = productosDTO.map((dto) => {
          const categoria = categorias.find(
            (c) => c.idCategoria === dto.idCategoria
          );
          return {
            idProducto: dto.idProducto,
            nombre: dto.nombre,
            descripcion: dto.descripcion,
            precio: dto.precio,
            stock: dto.stockActual,
            categoria: categoria ? categoria.nombre : "Sin categoría",
            imagen: dto.imagenPrincipal || "https://via.placeholder.com/150",
            rating: 4.5,
            requiereReceta: false,
          };
        });

        setProductos(productosMapped);
        setProductosFiltrados(productosMapped);
      } catch (error) {
        console.error("Error cargando productos:", error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    if (categorias.length > 0) {
      loadProductos();
    }
  }, [categorias]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = productos;

    const search = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.nombre.toLowerCase().includes(search) ||
        p.descripcion.toLowerCase().includes(search)
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.categoria === selectedCategory);
    }

    setProductosFiltrados(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, productos]);

  // Paginación
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentProducts = productosFiltrados.slice(start, end);
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  // Agregar producto al carrito
  const handleAddToCart = (producto) => {
    if (producto.requiereReceta) {
      const notas = prompt(
        "Este producto requiere receta médica. Por favor, indique detalles:"
      );
      if (!notas) return;
      producto.notas = notas;
    }

    const existente = carrito.find(
      (item) => item.idProducto === producto.idProducto
    );
    let nuevoCarrito;

    if (existente) {
      nuevoCarrito = carrito.map((item) =>
        item.idProducto === producto.idProducto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    alert("Producto agregado al carrito");
    setShowDetailModal(false);
  };

  // Buscar cliente por DNI
  const findClientIdByDni = async (dni) => {
    try {
      let response = await fetch(`${API_BASE}/clientes/dni/${dni}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const cliente = await response.json();
        return cliente.idCliente || cliente.id || null;
      }

      // Fallback: buscar en lista de clientes
      response = await fetch(`${API_BASE}/clientes`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const clientes = await response.json();
        const found = clientes.find(
          (c) => (c.dni || "").toLowerCase() === dni.toLowerCase()
        );
        return found ? found.idCliente || found.id || null : null;
      }

      return null;
    } catch (error) {
      console.error("Error buscando cliente por DNI:", error);
      return null;
    }
  };

  // Buscar cliente por email
//   const findClientIdByEmail = async (email) => {
//     try {
//       const response = await fetch(`${API_BASE}/clientes`, {
//         headers: {
//           Authorization: `Bearer ${TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.ok) {
//         const clientes = await response.json();
//         const found = clientes.find(
//           (c) => (c.email || c.mail || "").toLowerCase() === email.toLowerCase()
//         );
//         return found ? found.idCliente || found.id || null : null;
//       }

//       return null;
//     } catch (error) {
//       console.error("Error buscando cliente por email:", error);
//       return null;
//     }
//   };

  // Crear cliente
  const createCliente = async (clienteData) => {
    try {
      const clienteDTO = {
        nombre: clienteData.nombre,
        email: clienteData.email || null,
        dni: clienteData.dni,
        telefono: clienteData.telefono || null,
        direccion: clienteData.direccion || null,
        fechaNacimiento: null,
        tieneCondicionCronica: false,
        notasEspeciales: null,
        aceptaNotificaciones: true,
      };

      const response = await fetch(`${API_BASE}/clientes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteDTO),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear cliente");
      }

      const created = await response.json();
      return created.idCliente || created.id || null;
    } catch (error) {
      console.error("Error creando cliente:", error);
      throw error;
    }
  };

  // Realizar reserva
  const handleCreateClienteAndReserve = async () => {
    if (
      !clienteData.nombre ||
      !clienteData.dni ||
      !clienteData.telefono ||
      !clienteData.direccion
    ) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    setProcessingReserva(true);

    try {
      // Buscar por DNI
      let clientId = await findClientIdByDni(clienteData.dni);

      // Si no existe, crear cliente
      if (!clientId) {
        clientId = await createCliente(clienteData);
      }

      if (!clientId) {
        alert("Error al crear/encontrar el cliente");
        setProcessingReserva(false);
        return;
      }

      // Crear reserva
      const reservaDTO = {
        cliente: { idCliente: clientId },
        estado: "PENDIENTE",
        metodoNotificacion: "EMAIL",
        fechaLimiteRetiro: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        detalles: carrito.map((item) => ({
          producto: { idProducto: item.idProducto },
          cantidad: item.cantidad,
          precioUnitario: item.precio.toFixed(2),
          subtotal: (item.precio * item.cantidad).toFixed(2),
          disponible: true,
          notas: item.notas || "",
        })),
      };

      const response = await fetch(`${API_BASE}/reservas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservaDTO),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al procesar la reserva");
      }

      alert(
        "¡Tu reserva se ha realizado con éxito! Acércate a la farmacia para recogerla."
      );
      setCarrito([]);
      localStorage.removeItem("carrito");
      setShowClienteModal(false);
      setShowDetailModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar tu reserva: " + error.message);
    } finally {
      setProcessingReserva(false);
    }
  };

  if (loading) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando productos...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Sección de Productos */}
      <section className="py-5">
        <div className="container">
          {/* Título */}
          <h1 className="text-center fw-bold mb-2 titulo-gradiente">
            Nuestros Productos
          </h1>
          <p className="text-center text-muted mb-5">
            Encuentra los productos que necesitas para tu salud y bienestar
          </p>

          {/* Búsqueda y Filtro */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <input
                type="text"
                id="searchInput"
                className="form-control"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <select
                id="categoryFilter"
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.idCategoria} value={cat.nombre}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contador de resultados */}
          <p className="text-muted mb-4">
            <strong id="resultCount">{productosFiltrados.length}</strong>{" "}
            resultados
          </p>

          {/* Grid de Productos */}
          <div id="products-container" className="row g-4">
            {currentProducts.length > 0 ? (
              currentProducts.map((producto) => (
                <div key={producto.idProducto} className="col-md-4 mb-4">
                  <div
                    className="card shadow-sm h-100 position-relative producto-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedProduct(producto);
                      setShowDetailModal(true);
                    }}
                  >
                    <span className="badge-categoria">
                      {producto.categoria}
                    </span>
                    <img
                      src={producto.imagen}
                      className="card-img-top p-3"
                      alt={producto.nombre}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{producto.nombre}</h5>
                      <p className="card-text text-muted">
                        {producto.descripcion}
                      </p>
                      <p className="mb-1">
                        <strong>Stock:</strong> {producto.stock}
                      </p>
                      <div className="mt-auto">
                        <p className="fw-bold text-success">
                          S/ {producto.precio.toFixed(2)}
                        </p>
                        <small className="text-warning">
                          ⭐ {producto.rating}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <i className="bi bi-search display-1 text-muted"></i>
                <h3 className="mt-3">No se encontraron productos</h3>
                <p className="text-muted">
                  Intenta con otros términos de búsqueda o categorías
                </p>
              </div>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <nav className="mt-5">
              <ul id="pagination" className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    « Anterior
                  </button>
                </li>

                {visiblePages.map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente »
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>

      {/* Modal Detalles del Producto */}
      {showDetailModal && selectedProduct && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Producto</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-5">
                    <img
                      src={selectedProduct.imagen}
                      alt={selectedProduct.nombre}
                      className="img-fluid rounded"
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-7">
                    <h4 className="mb-3">{selectedProduct.nombre}</h4>
                    <p className="text-muted">{selectedProduct.descripcion}</p>
                    <p>
                      <strong>Categoría:</strong> {selectedProduct.categoria}
                    </p>
                    <p>
                      <strong>Stock:</strong> {selectedProduct.stock}
                    </p>
                    <p>
                      <strong>Precio:</strong>{" "}
                      <span className="text-success fw-bold">
                        S/ {selectedProduct.precio.toFixed(2)}
                      </span>
                    </p>
                    <p>
                      <strong>Rating:</strong>{" "}
                      <span className="text-warning">
                        ⭐ {selectedProduct.rating}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailModal(false)}
                >
                  Cerrar
                </button>
                {!user ? (
                  <button
                    type="button"
                    className="btn btn-custom"
                    onClick={() =>
                      alert("Debes iniciar sesión para hacer reservas")
                    }
                  >
                    Inicia sesión para reservar
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-custom"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setShowClienteModal(true);
                    }}
                  >
                    Agregar al Carrito
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cliente para Reserva */}
      {showClienteModal && user && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Completa tus datos para la reserva
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowClienteModal(false)}
                  disabled={processingReserva}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="clientEmail" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="clientEmail"
                    value={clienteData.email}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="clientNombre" className="form-label">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="clientNombre"
                    value={clienteData.nombre}
                    onChange={(e) =>
                      setClienteData({ ...clienteData, nombre: e.target.value })
                    }
                    required
                    disabled={processingReserva}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="clientDNI" className="form-label">
                    DNI (8 dígitos)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="clientDNI"
                    value={clienteData.dni}
                    onChange={(e) =>
                      setClienteData({ ...clienteData, dni: e.target.value })
                    }
                    maxLength="8"
                    required
                    disabled={processingReserva}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="clientPhone" className="form-label">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="clientPhone"
                    value={clienteData.telefono}
                    onChange={(e) =>
                      setClienteData({
                        ...clienteData,
                        telefono: e.target.value,
                      })
                    }
                    required
                    disabled={processingReserva}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="clientAddress" className="form-label">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="clientAddress"
                    value={clienteData.direccion}
                    onChange={(e) =>
                      setClienteData({
                        ...clienteData,
                        direccion: e.target.value,
                      })
                    }
                    required
                    disabled={processingReserva}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowClienteModal(false)}
                  disabled={processingReserva}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-custom"
                  onClick={handleCreateClienteAndReserve}
                  disabled={processingReserva}
                >
                  {processingReserva
                    ? "Procesando..."
                    : "Crear cliente y reservar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Productos;

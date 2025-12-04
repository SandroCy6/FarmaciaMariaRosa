import React, { useState, useEffect } from "react";

const ProductModal = ({ show, onHide, onSave, producto = null, categorias }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    idCategoria: "",
    descripcion: "",
    precio: "",
    stockActual: "",
    imagenPrincipal: "",
    fechaVencimiento: "",
    requiereReceta: false,
    esControlado: false,
    laboratorio: "",
    principioActivo: "",
    concentracion: "",
    formaFarmaceutica: "",
    estado: true,
  });

  const [loading, setLoading] = useState(false);

  // Llenar formulario cuando hay producto a editar
  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || "",
        idCategoria: producto.idCategoria || "",
        descripcion: producto.descripcion || "",
        precio: producto.precio ?? "",
        stockActual: producto.stockActual ?? "",
        imagenPrincipal: producto.imagenPrincipal || "",
        fechaVencimiento: producto.fechaVencimiento
          ? producto.fechaVencimiento.split("T")[0]
          : "",
        requiereReceta: producto.requiereReceta || false,
        esControlado: producto.esControlado || false,
        laboratorio: producto.laboratorio || "",
        principioActivo: producto.principioActivo || "",
        concentracion: producto.concentracion || "",
        formaFarmaceutica: producto.formaFarmaceutica || "",
        estado: producto.estado !== false,
      });
    } else {
      setFormData({
        nombre: "",
        idCategoria: "",
        descripcion: "",
        precio: "",
        stockActual: "",
        imagenPrincipal: "",
        fechaVencimiento: "",
        requiereReceta: false,
        esControlado: false,
        laboratorio: "",
        principioActivo: "",
        concentracion: "",
        formaFarmaceutica: "",
        estado: true,
      });
    }
  }, [producto, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error guardando producto:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {producto ? "Editar Producto" : "Agregar Producto"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onHide}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-select"
                    name="idCategoria"
                    value={formData.idCategoria}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.idCategoria} value={cat.idCategoria}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-12">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="2"
                  ></textarea>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stockActual"
                    value={formData.stockActual}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaVencimiento"
                    value={formData.fechaVencimiento}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Imagen (URL)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="imagenPrincipal"
                    value={formData.imagenPrincipal}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Laboratorio</label>
                  <input
                    type="text"
                    className="form-control"
                    name="laboratorio"
                    value={formData.laboratorio}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Principio Activo</label>
                  <input
                    type="text"
                    className="form-control"
                    name="principioActivo"
                    value={formData.principioActivo}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Concentración</label>
                  <input
                    type="text"
                    className="form-control"
                    name="concentracion"
                    value={formData.concentracion}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Forma Farmacéutica</label>
                  <input
                    type="text"
                    className="form-control"
                    name="formaFarmaceutica"
                    value={formData.formaFarmaceutica}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Requiere Receta</label>
                  <select
                    className="form-select"
                    name="requiereReceta"
                    value={formData.requiereReceta ? "true" : "false"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        requiereReceta: e.target.value === "true",
                      }))
                    }
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Controlado</label>
                  <select
                    className="form-select"
                    name="esControlado"
                    value={formData.esControlado ? "true" : "false"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        esControlado: e.target.value === "true",
                      }))
                    }
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
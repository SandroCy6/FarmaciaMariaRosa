import React, { useState, useEffect } from "react";

const CategoriaModal = ({
  show,
  onHide,
  onSave,
  categoria = null,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagenUrl: "",
    estado: true,
    orden: "",
  });

  const [loading, setLoading] = useState(false);

  // Llenar formulario cuando hay categoría a editar
  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre || "",
        descripcion: categoria.descripcion || "",
        imagenUrl: categoria.imagenUrl || "",
        estado: categoria.estado !== false,
        orden: categoria.orden ?? "",
      });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        imagenUrl: "",
        estado: true,
        orden: "",
      });
    }
  }, [categoria, show]);

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
      if (!formData.nombre.trim()) {
        alert("El nombre es requerido");
        return;
      }
      await onSave(formData);
    } catch (error) {
      console.error("Error guardando categoría:", error);
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
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {categoria ? "Editar Categoría" : "Agregar Categoría"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onHide}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
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

              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="2"
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Imagen (URL)</label>
                <input
                  type="text"
                  className="form-control"
                  name="imagenUrl"
                  value={formData.imagenUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    name="estado"
                    value={formData.estado ? "true" : "false"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        estado: e.target.value === "true",
                      }))
                    }
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Orden</label>
                  <input
                    type="number"
                    className="form-control"
                    name="orden"
                    value={formData.orden}
                    onChange={handleChange}
                  />
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

export default CategoriaModal;
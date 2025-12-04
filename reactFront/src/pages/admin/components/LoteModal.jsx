import React, { useState, useEffect } from "react";

const LoteModal = ({ show, onHide, onSave, lote, productos }) => {
  const [formData, setFormData] = useState({
    idProducto: "",
    numeroLote: "",
    fechaVencimiento: "",
    stockInicial: "",
    stockActual: "",
    fechaIngreso: "",
    estado: "ACTIVO",
    observaciones: "",
  });

  useEffect(() => {
    if (show && lote) {
      setFormData({
        idProducto: lote.idProducto || "",
        numeroLote: lote.numeroLote || "",
        fechaVencimiento: lote.fechaVencimiento || "",
        stockInicial: lote.stockInicial || "",
        stockActual: lote.stockActual || "",
        fechaIngreso: lote.fechaIngreso || "",
        estado: lote.estado || "ACTIVO",
        observaciones: lote.observaciones || "",
      });
    } else if (show && !lote) {
      setFormData({
        idProducto: "",
        numeroLote: "",
        fechaVencimiento: "",
        stockInicial: "",
        stockActual: "",
        fechaIngreso: "",
        estado: "ACTIVO",
        observaciones: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, lote?.idLote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {lote ? "Editar Lote" : "Agregar Lote"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onHide}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Número de Lote *</label>
                <input
                  type="text"
                  className="form-control"
                  name="numeroLote"
                  value={formData.numeroLote}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Producto *</label>
                <select
                  className="form-select"
                  name="idProducto"
                  value={formData.idProducto}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un producto...</option>
                  {productos && productos.map((prod) => (
                    <option key={prod.idProducto} value={prod.idProducto}>
                      {prod.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Stock Inicial *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stockInicial"
                    value={formData.stockInicial}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Stock Actual *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stockActual"
                    value={formData.stockActual}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha de Fabricación *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaIngreso"
                    value={formData.fechaIngreso}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha de Vencimiento *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaVencimiento"
                    value={formData.fechaVencimiento}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Estado *</label>
                <select
                  className="form-select"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="VENCIDO">Vencido</option>
                  <option value="AGOTADO">Agotado</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Observaciones</label>
                <textarea
                  className="form-control"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
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
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoteModal;
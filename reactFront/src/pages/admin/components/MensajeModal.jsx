import React from "react";

const MensajeModal = ({ show, onHide, mensaje }) => {
  if (!show || !mensaje) return null;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString("es-ES");
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "N/A";
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalle del Mensaje</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Nombre:</label>
                <p>{mensaje.cliente?.nombre || "—"}</p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Email:</label>
                <p>{mensaje.cliente?.email || "—"}</p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">DNI:</label>
                <p>{mensaje.cliente?.dni || "—"}</p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Teléfono:</label>
                <p>{mensaje.cliente?.telefono || "—"}</p>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">Fecha de Envío:</label>
                <p>{formatDate(mensaje.fechaEnvio)}</p>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">Mensaje:</label>
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    backgroundColor: "#f8f9fa",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                >
                  {mensaje.mensaje}
                </p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MensajeModal;

import React from "react";

const ReservaModal = ({
  show,
  onHide,
  reserva,
  onCompletarReserva,
  onCancelarReserva,
}) => {
  if (!show || !reserva) return null;

  const normalizeEstado = (estado) => {
    switch (estado?.toUpperCase()) {
      case "PENDIENTE":
        return "Pendiente";
      case "ENTREGADA":
        return "Completada";
      case "CANCELADA":
        return "Cancelada";
      default:
        return estado || "Desconocido";
    }
  };

  const canComplete = reserva.estado?.toUpperCase() === "PENDIENTE";
  const canCancel = reserva.estado?.toUpperCase() === "PENDIENTE";

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalles de la Reserva</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <h6>Información del Cliente</h6>
                <p className="mb-1">
                  <strong>Cliente:</strong> {reserva.cliente?.nombre || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong>{" "}
                  {reserva.cliente?.email || "No especificado"}
                </p>
                <p className="mb-1">
                  <strong>Teléfono:</strong>{" "}
                  {reserva.cliente?.telefono || "No especificado"}
                </p>
              </div>
              <div className="col-md-6">
                <h6>Información de la Reserva</h6>
                <p className="mb-1">
                  <strong>ID Reserva:</strong>{" "}
                  {reserva.numeroReserva || reserva.idReserva}
                </p>
                <p className="mb-1">
                  <strong>Fecha:</strong>{" "}
                  {new Date(reserva.fechaReserva).toLocaleString("es-ES")}
                </p>
                <p className="mb-1">
                  <strong>Estado:</strong>{" "}
                  <span className="badge bg-info">
                    {normalizeEstado(reserva.estado)}
                  </span>
                </p>
              </div>
            </div>

            <h6>Productos</h6>
            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(reserva.detalles || []).map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.producto?.nombre || "N/A"}</td>
                      <td>{detalle.cantidad}</td>
                      <td>S/ {detalle.precioUnitario?.toFixed(2) || "0.00"}</td>
                      <td>
                        S/{" "}
                        {(
                          (detalle.cantidad || 0) *
                          (detalle.precioUnitario || 0)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="3" className="text-end">
                      Total:
                    </th>
                    <td>
                      <strong>S/ {reserva.total?.toFixed(2) || "0.00"}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            {canComplete && (
              <button
                type="button"
                className="btn btn-success"
                onClick={() => onCompletarReserva(reserva)}
              >
                Marcar como Completada
              </button>
            )}
            {canCancel && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => onCancelarReserva(reserva)}
              >
                Cancelar Reserva
              </button>
            )}
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

export default ReservaModal;

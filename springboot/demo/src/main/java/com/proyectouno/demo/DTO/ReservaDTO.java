package com.proyectouno.demo.DTO;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para la entidad Reserva, utilizado para transferir datos de reservas.
 */
public class ReservaDTO {

    private Long idReserva;

    @Size(max = 20, message = "El número de reserva no puede exceder los 20 caracteres")
    private String numeroReserva;

    @NotNull(message = "El ID del cliente no puede ser nulo")
    private Long idCliente;

    @NotNull(message = "El estado no puede ser nulo")
    private String estado;

    @DecimalMin(value = "0.0", inclusive = true, message = "El total debe ser mayor o igual a 0")
    private BigDecimal total;

    private LocalDateTime fechaReserva;

    @NotNull(message = "La fecha límite de retiro no puede ser nula")
    private LocalDateTime fechaLimiteRetiro;

    private LocalDateTime fechaEntrega;

    private String notasCliente;

    private String notasFarmacia;

    private String metodoNotificacion;

    private Long idUsuarioAtencion;

    @NotNull(message = "Los detalles no pueden ser nulos")
    @Size(min = 1, message = "Debe haber al menos un producto en la reserva")
    private List<DetalleReservaDTO> detalles;

    // Getters y Setters
    public Long getIdReserva() { return idReserva; }
    public void setIdReserva(Long idReserva) { this.idReserva = idReserva; }
    public String getNumeroReserva() { return numeroReserva; }
    public void setNumeroReserva(String numeroReserva) { this.numeroReserva = numeroReserva; }
    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public LocalDateTime getFechaReserva() { return fechaReserva; }
    public void setFechaReserva(LocalDateTime fechaReserva) { this.fechaReserva = fechaReserva; }
    public LocalDateTime getFechaLimiteRetiro() { return fechaLimiteRetiro; }
    public void setFechaLimiteRetiro(LocalDateTime fechaLimiteRetiro) { this.fechaLimiteRetiro = fechaLimiteRetiro; }
    public LocalDateTime getFechaEntrega() { return fechaEntrega; }
    public void setFechaEntrega(LocalDateTime fechaEntrega) { this.fechaEntrega = fechaEntrega; }
    public String getNotasCliente() { return notasCliente; }
    public void setNotasCliente(String notasCliente) { this.notasCliente = notasCliente; }
    public String getNotasFarmacia() { return notasFarmacia; }
    public void setNotasFarmacia(String notasFarmacia) { this.notasFarmacia = notasFarmacia; }
    public String getMetodoNotificacion() { return metodoNotificacion; }
    public void setMetodoNotificacion(String metodoNotificacion) { this.metodoNotificacion = metodoNotificacion; }
    public Long getIdUsuarioAtencion() { return idUsuarioAtencion; }
    public void setIdUsuarioAtencion(Long idUsuarioAtencion) { this.idUsuarioAtencion = idUsuarioAtencion; }
    public List<DetalleReservaDTO> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleReservaDTO> detalles) { this.detalles = detalles; }
}
package com.proyectouno.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad que representa la tabla "reservas" en la base de datos.
 * Gestiona las reservas de productos realizadas por clientes.
 */
@Entity
@Table(name = "reservas")
public class Reserva {

    /** Identificador único de la reserva (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReserva;

    /** Número de reserva generado automáticamente. */
    @NotNull(message = "El número de reserva no puede ser nulo")
    @Size(max = 20, message = "El número de reserva no puede exceder los 20 caracteres")
    @Column(length = 20, nullable = false, unique = true)
    private String numeroReserva;

    /** Cliente que realiza la reserva. */
    @NotNull(message = "El cliente no puede ser nulo")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    /** Estado actual de la reserva. */
    @NotNull(message = "El estado no puede ser nulo")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReserva estado;

    /** Valor total de la reserva. */
    @NotNull(message = "El total no puede ser nulo")
    @DecimalMin(value = "0.0", inclusive = true, message = "El total debe ser mayor o igual a 0")
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal total;

    /** Fecha y hora de la reserva. */
    @Column(name = "fecha_reserva", nullable = false)
    private LocalDateTime fechaReserva = LocalDateTime.now();

    /** Fecha límite para retirar la reserva. */
    @NotNull(message = "La fecha límite no puede ser nula")
    @Column(name = "fecha_limite_retiro", nullable = false)
    private LocalDateTime fechaLimiteRetiro;

    /** Fecha real de entrega. */
    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;

    /** Notas adicionales del cliente. */
    @Column(columnDefinition = "TEXT")
    private String notasCliente;

    /** Notas internas de la farmacia. */
    @Column(columnDefinition = "TEXT")
    private String notasFarmacia;

    /** Método preferido de notificación. */
    @Enumerated(EnumType.STRING)
    @Column
    private MetodoNotificacion metodoNotificacion;

    /** Usuario que atendió la reserva. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_atencion")
    private Usuario usuarioAtencion;

    // Enum para estado
    public enum EstadoReserva {
        PENDIENTE, CONFIRMADA, LISTA, ENTREGADA, CANCELADA
    }

    // Enum para método de notificación
    public enum MetodoNotificacion {
        EMAIL, WHATSAPP, AMBOS
    }

    // ================== MÉTODOS GETTER Y SETTER ==================
    public Long getIdReserva() { return idReserva; }
    public void setIdReserva(Long idReserva) { this.idReserva = idReserva; }
    public String getNumeroReserva() { return numeroReserva; }
    public void setNumeroReserva(String numeroReserva) { this.numeroReserva = numeroReserva; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public EstadoReserva getEstado() { return estado; }
    public void setEstado(EstadoReserva estado) { this.estado = estado; }
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
    public MetodoNotificacion getMetodoNotificacion() { return metodoNotificacion; }
    public void setMetodoNotificacion(MetodoNotificacion metodoNotificacion) { this.metodoNotificacion = metodoNotificacion; }
    public Usuario getUsuarioAtencion() { return usuarioAtencion; }
    public void setUsuarioAtencion(Usuario usuarioAtencion) { this.usuarioAtencion = usuarioAtencion; }
}
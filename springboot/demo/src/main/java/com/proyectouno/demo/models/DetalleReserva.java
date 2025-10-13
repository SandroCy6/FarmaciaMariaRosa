package com.proyectouno.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * Entidad que representa la tabla "detalle_reservas" en la base de datos.
 * Almacena los productos específicos incluidos en cada reserva.
 */
@Entity
@Table(name = "detalle_reservas")
public class DetalleReserva {

    /** Identificador único del detalle (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetalle;

    /** Reserva asociada. */
    @NotNull(message = "La reserva no puede ser nula")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reserva", nullable = false)
    private Reserva reserva;

    /** Producto reservado. */
    @NotNull(message = "El producto no puede ser nulo")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    /** Cantidad reservada. */
    @NotNull(message = "La cantidad no puede ser nula")
    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    @Column(nullable = false)
    private Integer cantidad;

    /** Precio unitario al momento de la reserva. */
    @NotNull(message = "El precio unitario no puede ser nulo")
    @DecimalMin(value = "0.0", inclusive = true, message = "El precio unitario debe ser mayor o igual a 0")
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precioUnitario;

    /** Subtotal del producto. */
    @NotNull(message = "El subtotal no puede ser nulo")
    @DecimalMin(value = "0.0", inclusive = true, message = "El subtotal debe ser mayor o igual a 0")
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;

    /** Disponibilidad al momento de preparar. */
    @Column(nullable = false)
    private Boolean disponible = true;

    /** Notas específicas del producto. */
    @Column(columnDefinition = "TEXT")
    private String notas;

    // ================== MÉTODOS GETTER Y SETTER ==================
    public Long getIdDetalle() { return idDetalle; }
    public void setIdDetalle(Long idDetalle) { this.idDetalle = idDetalle; }
    public Reserva getReserva() { return reserva; }
    public void setReserva(Reserva reserva) { this.reserva = reserva; }
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
}
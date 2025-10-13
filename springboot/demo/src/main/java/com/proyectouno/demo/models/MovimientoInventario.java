package com.proyectouno.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad que representa la tabla "movimientos_inventario" en la base de datos.
 * Registra los movimientos de entrada y salida de productos.
 */
@Entity
@Table(name = "movimientos_inventario")
public class MovimientoInventario {

    /** Identificador único del movimiento (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMovimiento;

    /** Producto asociado al movimiento. */
    @NotNull(message = "El producto no puede ser nulo")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    /** Tipo de movimiento. */
    @NotNull(message = "El tipo de movimiento no puede ser nulo")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimiento tipoMovimiento;

    /** Cantidad del movimiento (positiva o negativa). */
    @NotNull(message = "La cantidad no puede ser nula")
    @Column(nullable = false)
    private Integer cantidad;

    /** Stock antes del movimiento. */
    @NotNull(message = "El stock anterior no puede ser nulo")
    @Min(value = 0, message = "El stock anterior debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Integer stockAnterior;

    /** Stock después del movimiento. */
    @NotNull(message = "El stock nuevo no puede ser nulo")
    @Min(value = 0, message = "El stock nuevo debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Integer stockNuevo;

    /** Razón del movimiento. */
    @NotNull(message = "El motivo no puede ser nulo")
    @Size(max = 200, message = "El motivo no puede exceder los 200 caracteres")
    @Column(length = 200, nullable = false)
    private String motivo;

    /** Número de lote (para entradas). */
    @Size(max = 50, message = "El número de lote no puede exceder los 50 caracteres")
    @Column(length = 50)
    private String numeroLote;

    /** Fecha de vencimiento del lote. */
    @Column(name = "fecha_vencimiento_lote")
    private LocalDate fechaVencimientoLote;

    /** Costo unitario (para entradas). */
    @DecimalMin(value = "0.0", inclusive = true, message = "El costo unitario debe ser mayor o igual a 0")
    @Column(precision = 10, scale = 2)
    private BigDecimal costoUnitario;

    /** Usuario que realizó el movimiento. */
    @NotNull(message = "El usuario no puede ser nulo")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    /** Reserva asociada (para salidas por venta). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reserva")
    private Reserva reserva;

    /** Fecha y hora del movimiento. */
    @Column(name = "fecha_movimiento", nullable = false)
    private LocalDateTime fechaMovimiento = LocalDateTime.now();

    /** Observaciones adicionales. */
    @Column(columnDefinition = "TEXT")
    private String observaciones;

    // Enum para tipo de movimiento
    public enum TipoMovimiento {
        ENTRADA, SALIDA, AJUSTE, VENCIMIENTO
    }

    // ================== MÉTODOS GETTER Y SETTER ==================
    public Long getIdMovimiento() { return idMovimiento; }
    public void setIdMovimiento(Long idMovimiento) { this.idMovimiento = idMovimiento; }
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    public TipoMovimiento getTipoMovimiento() { return tipoMovimiento; }
    public void setTipoMovimiento(TipoMovimiento tipoMovimiento) { this.tipoMovimiento = tipoMovimiento; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public Integer getStockAnterior() { return stockAnterior; }
    public void setStockAnterior(Integer stockAnterior) { this.stockAnterior = stockAnterior; }
    public Integer getStockNuevo() { return stockNuevo; }
    public void setStockNuevo(Integer stockNuevo) { this.stockNuevo = stockNuevo; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public String getNumeroLote() { return numeroLote; }
    public void setNumeroLote(String numeroLote) { this.numeroLote = numeroLote; }
    public LocalDate getFechaVencimientoLote() { return fechaVencimientoLote; }
    public void setFechaVencimientoLote(LocalDate fechaVencimientoLote) { this.fechaVencimientoLote = fechaVencimientoLote; }
    public BigDecimal getCostoUnitario() { return costoUnitario; }
    public void setCostoUnitario(BigDecimal costoUnitario) { this.costoUnitario = costoUnitario; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Reserva getReserva() { return reserva; }
    public void setReserva(Reserva reserva) { this.reserva = reserva; }
    public LocalDateTime getFechaMovimiento() { return fechaMovimiento; }
    public void setFechaMovimiento(LocalDateTime fechaMovimiento) { this.fechaMovimiento = fechaMovimiento; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
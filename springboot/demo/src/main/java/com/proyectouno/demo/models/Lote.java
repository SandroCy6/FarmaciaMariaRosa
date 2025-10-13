package com.proyectouno.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad que representa la tabla "lotes" en la base de datos.
 * Gestiona los lotes de productos con fechas de vencimiento y stock.
 */
@Entity
@Table(name = "lotes")
public class Lote {

    /** Identificador único del lote (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLote;

    /** Producto asociado al lote. */
    @NotNull(message = "El producto no puede ser nulo")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    /** Número de lote del fabricante. */
    @NotNull(message = "El número de lote no puede ser nulo")
    @Size(max = 50, message = "El número de lote no puede exceder los 50 caracteres")
    @Column(length = 50, nullable = false)
    private String numeroLote;

    /** Fecha de vencimiento del lote. */
    @NotNull(message = "La fecha de vencimiento no puede ser nula")
    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;

    /** Stock inicial del lote. */
    @NotNull(message = "El stock inicial no puede ser nulo")
    @Min(value = 0, message = "El stock inicial debe ser mayor o igual a 0")
    @Column(name = "stock_inicial", nullable = false)
    private Integer stockInicial;

    /** Stock actual disponible. */
    @NotNull(message = "El stock actual no puede ser nulo")
    @Min(value = 0, message = "El stock actual debe ser mayor o igual a 0")
    @Column(name = "stock_actual", nullable = false)
    private Integer stockActual;

    /** Costo unitario de compra. */
    @DecimalMin(value = "0.0", inclusive = true, message = "El costo unitario debe ser mayor o igual a 0")
    @Column(precision = 10, scale = 2)
    private BigDecimal costoUnitario;

    /** Proveedor del lote. */
    @Size(max = 100, message = "El proveedor no puede exceder los 100 caracteres")
    @Column(length = 100)
    private String proveedor;

    /** Fecha de ingreso del lote. */
    @NotNull(message = "La fecha de ingreso no puede ser nula")
    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fechaIngreso;

    /** Estado del lote (ACTIVO, VENCIDO, AGOTADO). */
    @NotNull(message = "El estado no puede ser nulo")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoLote estado;

    /** Observaciones del lote. */
    @Column(columnDefinition = "TEXT")
    private String observaciones;

    /** Fecha de creación del registro. */
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    /** Fecha de última actualización. */
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Enum para estado del lote
    public enum EstadoLote {
        ACTIVO, VENCIDO, AGOTADO
    }

    // ================== MÉTODOS GETTER Y SETTER ==================
    public Long getIdLote() { return idLote; }
    public void setIdLote(Long idLote) { this.idLote = idLote; }
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    public String getNumeroLote() { return numeroLote; }
    public void setNumeroLote(String numeroLote) { this.numeroLote = numeroLote; }
    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(LocalDate fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }
    public Integer getStockInicial() { return stockInicial; }
    public void setStockInicial(Integer stockInicial) { this.stockInicial = stockInicial; }
    public Integer getStockActual() { return stockActual; }
    public void setStockActual(Integer stockActual) { this.stockActual = stockActual; }
    public BigDecimal getCostoUnitario() { return costoUnitario; }
    public void setCostoUnitario(BigDecimal costoUnitario) { this.costoUnitario = costoUnitario; }
    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }
    public LocalDate getFechaIngreso() { return fechaIngreso; }
    public void setFechaIngreso(LocalDate fechaIngreso) { this.fechaIngreso = fechaIngreso; }
    public EstadoLote getEstado() { return estado; }
    public void setEstado(EstadoLote estado) { this.estado = estado; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
package com.proyectouno.demo.DTO;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para la entidad MovimientoInventario, utilizado para transferir datos de movimientos de inventario.
 */
public class MovimientoInventarioDTO {

    @NotNull(message = "El ID del producto no puede ser nulo")
    private Long idProducto;

    @NotNull(message = "El tipo de movimiento no puede ser nulo")
    private String tipoMovimiento;

    @NotNull(message = "La cantidad no puede ser nula")
    private Integer cantidad;

    @NotNull(message = "El stock anterior no puede ser nulo")
    @Min(value = 0, message = "El stock anterior debe ser mayor o igual a 0")
    private Integer stockAnterior;

    @NotNull(message = "El stock nuevo no puede ser nulo")
    @Min(value = 0, message = "El stock nuevo debe ser mayor o igual a 0")
    private Integer stockNuevo;

    @NotNull(message = "El motivo no puede ser nulo")
    @Size(max = 200, message = "El motivo no puede exceder los 200 caracteres")
    private String motivo;

    @Size(max = 50, message = "El número de lote no puede exceder los 50 caracteres")
    private String numeroLote;

    private LocalDate fechaVencimientoLote;

    @DecimalMin(value = "0.0", inclusive = true, message = "El costo unitario debe ser mayor o igual a 0")
    private BigDecimal costoUnitario;

    private Long idUsuario;

    private Long idReserva;

    private LocalDateTime fechaMovimiento;

    private String observaciones;

    // Getters y Setters
    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }
    public String getTipoMovimiento() { return tipoMovimiento; }
    public void setTipoMovimiento(String tipoMovimiento) { this.tipoMovimiento = tipoMovimiento; }
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
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    public Long getIdReserva() { return idReserva; }
    public void setIdReserva(Long idReserva) { this.idReserva = idReserva; }
    public LocalDateTime getFechaMovimiento() { return fechaMovimiento; }
    public void setFechaMovimiento(LocalDateTime fechaMovimiento) { this.fechaMovimiento = fechaMovimiento; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
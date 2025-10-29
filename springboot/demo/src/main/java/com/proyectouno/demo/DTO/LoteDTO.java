package com.proyectouno.demo.DTO;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para la entidad Lote, utilizado para transferir datos de lotes de productos.
 */
public class LoteDTO {

    private Long idLote;  // ← AGREGAR ESTE CAMPO

    @NotNull(message = "El ID del producto no puede ser nulo")
    private Long idProducto;

    private String nombreProducto;  // ← AGREGAR ESTE CAMPO

    @NotNull(message = "El número de lote no puede ser nulo")
    @Size(max = 50, message = "El número de lote no puede exceder los 50 caracteres")
    private String numeroLote;

    @NotNull(message = "La fecha de vencimiento no puede ser nula")
    private LocalDate fechaVencimiento;

    @NotNull(message = "El stock inicial no puede ser nulo")
    @Min(value = 0, message = "El stock inicial debe ser mayor o igual a 0")
    private Integer stockInicial;

    @NotNull(message = "El stock actual no puede ser nulo")
    @Min(value = 0, message = "El stock actual debe ser mayor o igual a 0")
    private Integer stockActual;

    @DecimalMin(value = "0.0", inclusive = true, message = "El costo unitario debe ser mayor o igual a 0")
    private BigDecimal costoUnitario;

    private String proveedor;

    private LocalDate fechaIngreso;

    private String estado;

    private String observaciones;

    // Getters y Setters
    public Long getIdLote() { return idLote; }
    public void setIdLote(Long idLote) { this.idLote = idLote; }
    
    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }
    
    public String getNombreProducto() { return nombreProducto; }
    public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }
    
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
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
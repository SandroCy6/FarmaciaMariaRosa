package com.proyectouno.demo.DTO;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO para la entidad Producto, utilizado para transferir datos de productos.
 */
public class ProductoDTO {

    private Long idProducto;

    @Size(max = 50, message = "El código de barras no puede exceder los 50 caracteres")
    private String codigoBarras;

    @NotNull(message = "El nombre no puede ser nulo")
    @Size(max = 200, message = "El nombre no puede exceder los 200 caracteres")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio no puede ser nulo")
    @DecimalMin(value = "0.0", inclusive = true, message = "El precio debe ser mayor o igual a 0")
    private BigDecimal precio;

    @NotNull(message = "El stock actual no puede ser nulo")
    @Min(value = 0, message = "El stock actual debe ser mayor o igual a 0")
    private Integer stockActual;

    @Min(value = 0, message = "El stock mínimo debe ser mayor o igual a 0")
    private Integer stockMinimo;

    @NotNull(message = "El ID de la categoría no puede ser nulo")
    private Long idCategoria;

    private String imagenPrincipal;

    private List<String> imagenesAdicionales;

    @NotNull(message = "El campo requiereReceta no puede ser nulo")
    private Boolean requiereReceta;

    @NotNull(message = "El campo esControlado no puede ser nulo")
    private Boolean esControlado;

    private LocalDate fechaVencimiento;

    private String laboratorio;

    private String principioActivo;

    private String concentracion;

    private String formaFarmaceutica;

    @NotNull(message = "El estado no puede ser nulo")
    private Boolean estado;

    // Getters y Setters
    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }
    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public Integer getStockActual() { return stockActual; }
    public void setStockActual(Integer stockActual) { this.stockActual = stockActual; }
    public Integer getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(Integer stockMinimo) { this.stockMinimo = stockMinimo; }
    public Long getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Long idCategoria) { this.idCategoria = idCategoria; }
    public String getImagenPrincipal() { return imagenPrincipal; }
    public void setImagenPrincipal(String imagenPrincipal) { this.imagenPrincipal = imagenPrincipal; }
    public List<String> getImagenesAdicionales() { return imagenesAdicionales; }
    public void setImagenesAdicionales(List<String> imagenesAdicionales) { this.imagenesAdicionales = imagenesAdicionales; }
    public Boolean getRequiereReceta() { return requiereReceta; }
    public void setRequiereReceta(Boolean requiereReceta) { this.requiereReceta = requiereReceta; }
    public Boolean getEsControlado() { return esControlado; }
    public void setEsControlado(Boolean esControlado) { this.esControlado = esControlado; }
    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(LocalDate fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }
    public String getLaboratorio() { return laboratorio; }
    public void setLaboratorio(String laboratorio) { this.laboratorio = laboratorio; }
    public String getPrincipioActivo() { return principioActivo; }
    public void setPrincipioActivo(String principioActivo) { this.principioActivo = principioActivo; }
    public String getConcentracion() { return concentracion; }
    public void setConcentracion(String concentracion) { this.concentracion = concentracion; }
    public String getFormaFarmaceutica() { return formaFarmaceutica; }
    public void setFormaFarmaceutica(String formaFarmaceutica) { this.formaFarmaceutica = formaFarmaceutica; }
    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }
}
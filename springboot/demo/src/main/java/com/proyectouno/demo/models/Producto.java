package com.proyectouno.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;

    @Size(max = 50, message = "El código de barras no puede exceder los 50 caracteres")
    @Column(length = 50, unique = true)
    private String codigoBarras;

    @NotNull(message = "El nombre no puede ser nulo")
    @Size(max = 200, message = "El nombre no puede exceder los 200 caracteres")
    @Column(length = 200, nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @NotNull(message = "El precio no puede ser nulo")
    @DecimalMin(value = "0.0", inclusive = true, message = "El precio debe ser mayor o igual a 0")
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precio;

    @NotNull(message = "El stock actual no puede ser nulo")
    @Min(value = 0, message = "El stock actual debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Integer stockActual;

    @Min(value = 0, message = "El stock mínimo debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Integer stockMinimo = 5;

    @NotNull(message = "La categoría no puede ser nula")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @Size(max = 255, message = "La URL de la imagen no puede exceder los 255 caracteres")
    @Column(length = 255)
    private String imagenPrincipal;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<String> imagenesAdicionales;

    @Column(nullable = false)
    private Boolean requiereReceta = false;

    @Column(nullable = false)
    private Boolean esControlado = false;

    @Column
    private LocalDate fechaVencimiento;

    @Size(max = 100, message = "El laboratorio no puede exceder los 100 caracteres")
    @Column(length = 100)
    private String laboratorio;

    @Size(max = 200, message = "El principio activo no puede exceder los 200 caracteres")
    @Column(length = 200)
    private String principioActivo;

    @Size(max = 50, message = "La concentración no puede exceder los 50 caracteres")
    @Column(length = 50)
    private String concentracion;

    @Size(max = 50, message = "La forma farmacéutica no puede exceder los 50 caracteres")
    @Column(length = 50)
    private String formaFarmaceutica;

    @Column(nullable = false)
    private Boolean estado = true;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

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
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
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
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
package com.proyectouno.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Entidad que representa la tabla "categorias" en la base de datos.
 * Clasifica los productos de la farmacia.
 */
@Entity
@Table(name = "categorias")
public class Categoria {

    /** Identificador único de la categoría (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCategoria;

    /** Nombre de la categoría. */
    @NotNull(message = "El nombre no puede ser nulo")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    @Column(length = 100, nullable = false, unique = true)
    private String nombre;

    /** Descripción detallada de la categoría. */
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    /** URL de la imagen representativa. */
    @Size(max = 255, message = "La URL de la imagen no puede exceder los 255 caracteres")
    @Column(length = 255)
    private String imagenUrl;

    /** Estado activo/inactivo de la categoría. */
    @Column(nullable = false)
    private Boolean estado = true;

    /** Orden de visualización en el frontend. */
    @Column(nullable = false)
    private Integer orden = 0;

    /** Fecha de creación del registro. */
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // ================== MÉTODOS GETTER Y SETTER ==================
    public Long getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Long idCategoria) { this.idCategoria = idCategoria; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }
    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
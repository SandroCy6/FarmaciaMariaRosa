package com.proyectouno.demo.DTO;


import jakarta.validation.constraints.*;

/**
 * DTO para la entidad Categoria, utilizado para transferir datos de categorías.
 */
public class CategoriaDTO {

    @NotNull(message = "El nombre no puede ser nulo")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String nombre;

    private String descripcion;

    @Size(max = 255, message = "La URL de la imagen no puede exceder los 255 caracteres")
    private String imagenUrl;

    @NotNull(message = "El estado no puede ser nulo")
    private Boolean estado;

    @NotNull(message = "El orden no puede ser nulo")
    private Integer orden;

    // Getters y Setters
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
}
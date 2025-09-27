package com.proyectouno.demo.DTO;

import java.math.BigDecimal;

/**
 * DTO que representa la información detallada de un producto.
 * Incluye datos básicos como nombre, descripción, precio y stock,
 * así como la categoría a la que pertenece.
 */
public class ProductoDetalleDTO {
    private Long id;                // ID único del producto
    private String nombre;          // Nombre del producto
    private String descripcion;     // Descripción detallada del producto
    private BigDecimal precio;      // Precio unitario del producto
    private Integer stock;          // Cantidad disponible en inventario
    private CategoriaDTO categoria; // Categoría asociada al producto

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public CategoriaDTO getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaDTO categoria) {
        this.categoria = categoria;
    }
}

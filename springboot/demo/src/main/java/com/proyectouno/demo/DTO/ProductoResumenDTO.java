package com.proyectouno.demo.DTO;

import java.math.BigDecimal;

/**
 * DTO para representar un producto en formato resumido.
 * Contiene solo los datos básicos necesarios para listados o
 * referencias rápidas, sin la información detallada.
 */
public class ProductoResumenDTO {
    private Long id;            // ID único del producto
    private String nombre;      // Nombre del producto
    private BigDecimal precio;  // Precio unitario del producto

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

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }
}

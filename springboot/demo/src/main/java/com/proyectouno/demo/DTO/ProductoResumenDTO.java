package com.proyectouno.demo.DTO;

import java.math.BigDecimal;

public class ProductoResumenDTO {
    private Long id;
    private String nombre;
    private BigDecimal precio;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
}

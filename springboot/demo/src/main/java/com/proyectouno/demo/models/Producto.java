package com.proyectouno.demo.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombre del producto.
     * No puede ser nulo y tiene un máximo de 100 caracteres.
     */
    @Column(length = 100, nullable = false)
    private String nombre;

    /**
     * Relación N:1 con Categoria.
     * Cada producto pertenece a una categoría.
     */
    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    /**
     * Precio del producto con precisión de hasta 10 dígitos y 2 decimales.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    /**
     * Cantidad disponible en inventario.
     */
    @Column(nullable = false)
    private Integer stock;

    /**
     * Descripción detallada del producto.
     * Se almacena como un campo largo de texto (TEXT).
     */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // ================== MÉTODOS GETTER Y SETTER ==================
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
    public Categoria getCategoria() {
        return categoria;
    }
    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
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
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}

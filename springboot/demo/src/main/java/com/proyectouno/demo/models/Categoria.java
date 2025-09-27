package com.proyectouno.demo.models;

import jakarta.persistence.*;
/**
 * Entidad que representa la tabla "categorias" en la base de datos.
 * Cada categoría se utiliza para clasificar productos en la farmacia.
 */
@Entity
@Table(name = "categorias")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Identificador único de la categoría (clave primaria)

    @Column(length = 50, nullable = false, unique = true)
    private String nombre; // Nombre de la categoría (ej: Analgésicos, Antibióticos, Vitaminas)

    // ================== MÉTODOS GETTER Y SETTER ==================
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}

package com.proyectouno.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Entidad que representa la tabla "producto_sintomas" en la base de datos.
 * Relación muchos a muchos entre productos y síntomas.
 */
@Entity
@Table(name = "producto_sintomas")
public class ProductoSintoma {

    /** Identificador único de la relación (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Producto relacionado. */
    @NotNull(message = "El producto no puede ser nulo")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    /** Síntoma relacionado. */
    @NotNull(message = "El síntoma no puede ser nulo")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sintoma", nullable = false)
    private Sintoma sintoma;

    /** Nivel de relevancia (1-5). */
    @Min(value = 1, message = "La relevancia debe estar entre 1 y 5")
    @Max(value = 5, message = "La relevancia debe estar entre 1 y 5")
    @Column(nullable = false)
    private Integer relevancia = 1;

    /** Fecha de creación de la relación. */
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // ================== MÉTODOS GETTER Y SETTER ==================
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    public Sintoma getSintoma() { return sintoma; }
    public void setSintoma(Sintoma sintoma) { this.sintoma = sintoma; }
    public Integer getRelevancia() { return relevancia; }
    public void setRelevancia(Integer relevancia) { this.relevancia = relevancia; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
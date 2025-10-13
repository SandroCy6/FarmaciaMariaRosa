package com.proyectouno.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Entidad que representa la tabla "sintomas" en la base de datos.
 * Catálogo de síntomas para búsqueda avanzada de medicamentos.
 */
@Entity
@Table(name = "sintomas")
public class Sintoma {

    /** Identificador único del síntoma (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSintoma;

    /** Nombre del síntoma. */
    @NotNull(message = "El nombre no puede ser nulo")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    @Column(length = 100, nullable = false, unique = true)
    private String nombre;

    /** Descripción del síntoma. */
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    /** Array de palabras relacionadas. */
    @Column(columnDefinition = "JSON")
    private String palabrasClave;

    /** Fecha de creación del registro. */
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // ================== MÉTODOS GETTER Y SETTER ==================
    public Long getIdSintoma() { return idSintoma; }
    public void setIdSintoma(Long idSintoma) { this.idSintoma = idSintoma; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getPalabrasClave() { return palabrasClave; }
    public void setPalabrasClave(String palabrasClave) { this.palabrasClave = palabrasClave; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
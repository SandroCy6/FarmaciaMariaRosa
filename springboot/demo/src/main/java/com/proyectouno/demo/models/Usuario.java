package com.proyectouno.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Entidad que representa la tabla "usuarios" en la base de datos.
 * Almacena la información de los administradores del sistema.
 */
@Entity
@Table(name = "usuarios")
public class Usuario {

    /** Identificador único del usuario (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    /** Nombre completo del administrador. */
    @NotNull(message = "El nombre no puede ser nulo")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    @Column(length = 100, nullable = false)
    private String nombre;

    /** Correo electrónico del administrador. */
    @NotNull(message = "El email no puede ser nulo")
    @Email(message = "El email debe ser válido")
    @Size(max = 150, message = "El email no puede exceder los 150 caracteres")
    @Column(length = 150, nullable = false, unique = true)
    private String email;

    /** Contraseña encriptada con bcrypt. */
    @NotNull(message = "La contraseña no puede ser nula")
    @Size(max = 255, message = "La contraseña no puede exceder los 255 caracteres")
    @Column(length = 255, nullable = false)
    private String passwordHash;

    /** Rol del usuario (ADMIN, SUPER_ADMIN). */
    @NotNull(message = "El rol no puede ser nulo")
    @Size(max = 50, message = "El rol no puede exceder los 50 caracteres")
    @Column(length = 50, nullable = false)
    private String rol;

    /** Estado activo/inactivo del usuario. */
    @Column(nullable = false)
    private Boolean estado = true;

    /** Fecha de creación del registro. */
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    /** Fecha de última actualización. */
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // ================== MÉTODOS GETTER Y SETTER ==================
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
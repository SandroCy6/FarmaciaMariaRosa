package com.proyectouno.demo.DTO;

import jakarta.validation.constraints.*;

/**
 * DTO para la entidad Usuario, utilizado para transferir datos de usuarios (administradores).
 */
public class UsuarioDTO {

    @NotNull(message = "El nombre no puede ser nulo")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String nombre;

    @NotNull(message = "El email no puede ser nulo")
    @Email(message = "El email debe ser válido")
    @Size(max = 150, message = "El email no puede exceder los 150 caracteres")
    private String email;

    @NotNull(message = "La contraseña no puede ser nula")
    @Size(max = 255, message = "La contraseña no puede exceder los 255 caracteres")
    private String passwordHash;

    @NotNull(message = "El rol no puede ser nulo")
    @Size(max = 50, message = "El rol no puede exceder los 50 caracteres")
    private String rol;

    @NotNull(message = "El estado no puede ser nulo")
    private Boolean estado;

    // Getters y Setters
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
}
package com.proyectouno.demo.DTO;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * DTO para la entidad Cliente, utilizado para transferir datos del cliente entre frontend y backend.
 */
public class ClienteDTO {

    private Long idCliente;

    @NotNull(message = "El nombre no puede ser nulo")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String nombre;

    @Email(message = "El email debe ser válido")
    @Size(max = 150, message = "El email no puede exceder los 150 caracteres")
    private String email;

    @NotNull(message = "El DNI no puede ser nulo")
    @Size(min = 8, max = 8, message = "El DNI debe tener exactamente 8 caracteres")
    private String dni;

    @Size(max = 9, message = "El teléfono no puede exceder los 9 caracteres")
    private String telefono;

    private String direccion;

    private LocalDate fechaNacimiento;

    @NotNull(message = "El campo tieneCondicionCronica no puede ser nulo")
    private Boolean tieneCondicionCronica;

    private String notasEspeciales;

    @NotNull(message = "El campo aceptaNotificaciones no puede ser nulo")
    private Boolean aceptaNotificaciones;

    // Getters y Setters
    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public Boolean getTieneCondicionCronica() { return tieneCondicionCronica; }
    public void setTieneCondicionCronica(Boolean tieneCondicionCronica) { this.tieneCondicionCronica = tieneCondicionCronica; }
    public String getNotasEspeciales() { return notasEspeciales; }
    public void setNotasEspeciales(String notasEspeciales) { this.notasEspeciales = notasEspeciales; }
    public Boolean getAceptaNotificaciones() { return aceptaNotificaciones; }
    public void setAceptaNotificaciones(Boolean aceptaNotificaciones) { this.aceptaNotificaciones = aceptaNotificaciones; }
}
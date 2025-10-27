package com.proyectouno.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad que representa la tabla "clientes" en la base de datos.
 * Almacena información de los clientes que realizan reservas.
 */
@Entity
@Table(name = "clientes")
public class Cliente {

    /** Identificador único del cliente (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCliente;

    /** Nombre completo del cliente. */
    @NotNull(message = "El nombre no puede ser nulo")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    @Column(length = 100, nullable = false)
    private String nombre;

    /** Correo electrónico del cliente. */
    @Email(message = "El email debe ser válido")
    @Size(max = 150, message = "El email no puede exceder los 150 caracteres")
    @Column(length = 150)
    private String email;

    /** Número de DNI. */
    @NotNull(message = "El DNI no puede ser nulo")
    @Pattern(regexp = "\\d{8}", message = "El DNI debe contener exactamente 8 dígitos numéricos")
    @Column(length = 8, nullable = false)
    private String dni;

    /** Número de teléfono. */
    @Size(max = 9, message = "El teléfono no puede exceder los 9 caracteres")
    @Column(length = 9)
    private String telefono;

    /** Dirección del cliente. */
    @Column(columnDefinition = "TEXT")
    private String direccion;

    /** Fecha de nacimiento. */
    @Column
    private LocalDate fechaNacimiento;

    /** Indica si tiene condición médica crónica. */
    @Column(nullable = false)
    private Boolean tieneCondicionCronica = false;

    /** Notas médicas o especiales. */
    @Column(columnDefinition = "TEXT")
    private String notasEspeciales;

    /** Acepta recibir notificaciones. */
    @Column(nullable = false)
    private Boolean aceptaNotificaciones = true;

    /** Fecha de creación del registro. */
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    /** Fecha de última actualización. */
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // ================== MÉTODOS GETTER Y SETTER ==================
    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDni() { return dni; }
    // Normalizar / limpiar el DNI al setear para evitar espacios u otros caracteres invisibles
    public void setDni(String dni) { this.dni = (dni == null) ? null : dni.trim(); }
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
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
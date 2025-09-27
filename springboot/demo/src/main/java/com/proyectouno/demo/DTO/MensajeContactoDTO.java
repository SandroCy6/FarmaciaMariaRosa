package com.proyectouno.demo.DTO;

import java.time.LocalDateTime;

/**
 * DTO para transferir información de un mensaje de contacto.
 * Contiene los datos del cliente que envía el mensaje, el contenido del
 * mensaje,
 * fechas de envío y respuesta, estado de contestación y referencia al cliente.
 */
public class MensajeContactoDTO {
    private Long id;                    // ID del mensaje
    private String nombre;              // Nombre del remitente
    private String email;               // Correo electrónico del remitente
    private String dni;                 // DNI del remitente
    private String telefono;            // Teléfono de contacto
    private String mensaje;             // Contenido del mensaje
    private LocalDateTime fechaEnvio;   // Fecha en que se envió el mensaje
    private Boolean estadoContestado;   // True si el mensaje ha sido respondido
    private LocalDateTime fechaRespuesta; // Fecha de la respuesta (si existe)
    private Long clienteId;             // ID del cliente asociado

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getnombre() {
        return nombre;
    }

    public void setnombre(String nombre) {
        this.nombre = nombre;
    }

    public String getemail() {
        return email;
    }

    public void setemail(String email) {
        this.email = email;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public Boolean getEstadoContestado() {
        return estadoContestado;
    }

    public void setEstadoContestado(Boolean estadoContestado) {
        this.estadoContestado = estadoContestado;
    }

    public LocalDateTime getFechaRespuesta() {
        return fechaRespuesta;
    }

    public void setFechaRespuesta(LocalDateTime fechaRespuesta) {
        this.fechaRespuesta = fechaRespuesta;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }
}

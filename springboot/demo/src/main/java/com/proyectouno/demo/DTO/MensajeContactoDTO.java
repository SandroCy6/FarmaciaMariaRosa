package com.proyectouno.demo.DTO;

import java.time.LocalDateTime;

public class MensajeContactoDTO {
    private Long id;
    private String nombreCompleto;
    private String correoElectronico;
    private String dni;
    private String telefono;
    private String mensaje;
    private LocalDateTime fechaEnvio;
    private Boolean estadoContestado;
    private LocalDateTime fechaRespuesta;
    private Long clienteId;

    // Getters y setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNombreCompleto() {
        return nombreCompleto;
    }
    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    public String getCorreoElectronico() {
        return correoElectronico;
    }
    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
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

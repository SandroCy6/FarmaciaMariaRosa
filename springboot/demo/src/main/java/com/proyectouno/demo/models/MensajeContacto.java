package com.proyectouno.demo.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
/**
 * Entidad que representa un mensaje enviado por un cliente 
 * a través del formulario de contacto.
 * 
 * Permite llevar un registro de los mensajes recibidos, 
 * si fueron contestados y en qué fecha se respondió.
 */
@Entity
@Table(name = "mensajes_contacto")
public class MensajeContacto {

    /** Identificador único del mensaje (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Cliente que envió el mensaje (relación N:1). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    /** Contenido del mensaje escrito por el cliente. */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensaje;

    /** Fecha y hora en que el mensaje fue enviado. */
    @Column(name = "fecha_envio", nullable = false)
    private LocalDateTime fechaEnvio = LocalDateTime.now();

    /** Indica si el mensaje ya fue contestado o no. */
    @Column(name = "estado_contestado", nullable = false)
    private Boolean estadoContestado = false;

    /** Fecha en que se respondió el mensaje (puede ser null). */
    @Column(name = "fecha_respuesta")
    private LocalDateTime fechaRespuesta;

    // ================== MÉTODOS GETTER Y SETTER ==================
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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
    public Cliente getCliente() {
        return cliente;
    }
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}

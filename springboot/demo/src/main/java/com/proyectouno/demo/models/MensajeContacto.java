package com.proyectouno.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Entidad que representa la tabla "mensajes_contacto" en la base de datos.
 * Almacena mensajes enviados por clientes a través del formulario de contacto.
 */
@Entity
@Table(name = "mensajes_contacto")
public class MensajeContacto {

    /** Identificador único del mensaje (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Cliente que envió el mensaje. */
    @NotNull(message = "El cliente no puede ser nulo")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", referencedColumnName = "id_cliente", nullable = false)
    private Cliente cliente;
    // Campo espejo para satisfacer NOT NULL en cliente_id
    // @Column(name = "cliente_id", nullable = false)
    // private Long clienteIdEspejo; // getters/setters

    /** Contenido del mensaje escrito por el cliente. */
    @NotNull(message = "El mensaje no puede ser nulo")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensaje;

    /** Fecha y hora en que el mensaje fue enviado. */
    @NotNull(message = "La fecha de envío no puede ser nula")
    @Column(name = "fecha_envio", nullable = false)
    private LocalDateTime fechaEnvio = LocalDateTime.now();

    /** Indica si el mensaje ya fue contestado o no. */
    @Column(name = "estado_contestado", nullable = false)
    private Boolean estadoContestado = false;

    /** Fecha en que se respondió el mensaje. */
    @Column(name = "fecha_respuesta")
    private LocalDateTime fechaRespuesta;

    // ================== MÉTODOS GETTER Y SETTER ==================
    // public Long clienteIdEspejo() {
    //     return clienteIdEspejo;
    // }

    // public void setClienteIdEspejo(Long clienteIdEspejo) {
    //     this.clienteIdEspejo = clienteIdEspejo;
    // }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
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
}
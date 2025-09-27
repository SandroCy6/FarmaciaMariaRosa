package com.proyectouno.demo.DTO;

import java.util.List;
/**
 * DTO para transferir información detallada de un cliente.
 * Incluye datos básicos del cliente y relaciones con pedidos y mensajes de contacto.
 * Se utiliza para enviar datos al frontend sin exponer la entidad completa de la base de datos.
 */
public class ClienteDetalleDTO {
    private Long id;                    // ID del cliente
    private String nombreCompleto;      // Nombre completo del cliente
    private String correoElectronico;   // Correo electrónico
    private String dni;                 // Documento de identidad
    private String telefono;            // Teléfono de contacto

    // Relación con pedidos (detallados)
    private List<PedidoDetalleDTO> pedidos; // Lista de pedidos del cliente

    // Relación con mensajes de contacto
    private List<MensajeContactoDTO> mensajesContacto; // Lista de mensajes de contacto asociados

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
    public List<PedidoDetalleDTO> getPedidos() {
        return pedidos;
    }
    public void setPedidos(List<PedidoDetalleDTO> pedidos) {
        this.pedidos = pedidos;
    }
    public List<MensajeContactoDTO> getMensajesContacto() {
        return mensajesContacto;
    }
    public void setMensajesContacto(List<MensajeContactoDTO> mensajesContacto) {
        this.mensajesContacto = mensajesContacto;
    }
}

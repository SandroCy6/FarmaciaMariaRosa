package com.proyectouno.demo.DTO;

import java.util.List;

public class ClienteDetalleDTO {
    private Long id;
    private String nombreCompleto;
    private String correoElectronico;
    private String dni;
    private String telefono;

    // Relación con pedidos (detallados)
    private List<PedidoDetalleDTO> pedidos;

    // Relación con mensajes de contacto
    private List<MensajeContactoDTO> mensajesContacto;

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

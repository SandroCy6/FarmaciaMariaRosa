package com.proyectouno.demo.DTO;

import java.time.LocalDateTime;

/**
 * DTO para representar un pedido en formato resumido.
 * Contiene solo los datos esenciales para listados,
 * sin incluir los detalles de los productos.
 */
public class PedidoResumenDTO {
    private Long id;                // ID único del pedido
    private LocalDateTime fecha;    // Fecha en que se realizó el pedido
    private String estado;          // Estado actual del pedido (ej: PENDIENTE, PAGADO, ENTREGADO)
    private ClienteResumenDTO cliente; // Información resumida del cliente que hizo el pedido

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public ClienteResumenDTO getCliente() {
        return cliente;
    }

    public void setCliente(ClienteResumenDTO cliente) {
        this.cliente = cliente;
    }
}

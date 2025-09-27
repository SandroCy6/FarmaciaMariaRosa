package com.proyectouno.demo.DTO;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO que representa el detalle completo de un pedido.
 * Incluye información general del pedido, el cliente asociado
 * y la lista de productos solicitados (detalles).
 */
public class PedidoDetalleDTO {
    private Long id;                        // ID único del pedido
    private LocalDateTime fecha;            // Fecha en que se generó el pedido
    private String estado;                  // Estado actual del pedido (ej: PENDIENTE, PAGADO, ENTREGADO)
    private ClienteDetalleDTO cliente;      // Información detallada del cliente que hizo el pedido
    private List<DetallePedidoDTO> detalles; // Lista de productos incluidos en el pedido

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

    public ClienteDetalleDTO getCliente() {
        return cliente;
    }

    public void setCliente(ClienteDetalleDTO cliente) {
        this.cliente = cliente;
    }

    public List<DetallePedidoDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedidoDTO> detalles) {
        this.detalles = detalles;
    }
}

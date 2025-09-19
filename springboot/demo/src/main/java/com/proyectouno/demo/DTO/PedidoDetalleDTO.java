package com.proyectouno.demo.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class PedidoDetalleDTO {
    private Long id;
    private LocalDateTime fecha;
    private String estado;
    private ClienteDetalleDTO cliente;
    private List<DetallePedidoDTO> detalles;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public ClienteDetalleDTO getCliente() { return cliente; }
    public void setCliente(ClienteDetalleDTO cliente) { this.cliente = cliente; }
    public List<DetallePedidoDTO> getDetalles() { return detalles; }
    public void setDetalles(List<DetallePedidoDTO> detalles) { this.detalles = detalles; }
}

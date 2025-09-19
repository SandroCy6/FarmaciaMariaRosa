package com.proyectouno.demo.DTO;

import java.time.LocalDateTime;

public class PedidoResumenDTO {
    private Long id;
    private LocalDateTime fecha;
    private String estado;
    private ClienteResumenDTO cliente;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public ClienteResumenDTO getCliente() { return cliente; }
    public void setCliente(ClienteResumenDTO cliente) { this.cliente = cliente; }
}

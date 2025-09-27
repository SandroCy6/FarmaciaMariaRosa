package com.proyectouno.demo.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * Relación N:1 con Cliente.
     * Cada pedido pertenece a un cliente.
     */
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    /**
     * Fecha en la que se creó el pedido.
     * Se inicializa automáticamente al momento de persistir.
     */
    private LocalDateTime fecha = LocalDateTime.now();

    /**
     * Estado del pedido.
     * Puede tomar valores como: PENDIENTE, PAGADO, ENTREGADO o CANCELADO.
     */
    @Column(length = 20, nullable = false)
    private String estado;

    /**
     * Relación 1:N con DetallePedido.
     * Un pedido puede tener varios productos asociados (sus detalles).
     */
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles;

    // ================== MÉTODOS GETTER Y SETTER ==================
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
    public List<DetallePedido> getDetalles() {
        return detalles;
    }
    public void setDetalles(List<DetallePedido> detalles) {
        this.detalles = detalles;
    }
}

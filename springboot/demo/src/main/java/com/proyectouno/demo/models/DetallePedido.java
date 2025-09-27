package com.proyectouno.demo.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Entidad que representa el detalle de un pedido.
 * 
 * Cada detalle asocia un producto con un pedido específico, indicando
 * la cantidad solicitada, el precio unitario en el momento de la compra
 * y el subtotal resultante.
 */
@Entity
@Table(name = "detalles_pedido")
public class DetallePedido {
    /** Identificador único del detalle (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Pedido al que pertenece este detalle (relación N:1). */
    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    /** Producto asociado al pedido (relación N:1). */
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    /** Cantidad de unidades del producto en este pedido. */
    @Column(nullable = false)
    private Integer cantidad;
    /**
     * Precio unitario del producto en el momento de la compra.
     * Se guarda explícitamente para no depender de cambios futuros en el precio del
     * producto.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;
    /**
     * Subtotal = cantidad * precioUnitario.
     * También se almacena para simplificar cálculos y reportes.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    // ================== MÉTODOS GETTER Y SETTER ==================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}

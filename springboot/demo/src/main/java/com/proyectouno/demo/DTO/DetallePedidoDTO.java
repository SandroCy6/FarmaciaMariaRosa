package com.proyectouno.demo.DTO;

import java.math.BigDecimal;

/**
 * DTO para transferir información de un detalle de pedido.
 * Contiene el producto, cantidad, precio unitario y subtotal.
 * Se utiliza para enviar datos de un pedido al frontend sin exponer la entidad
 * completa.
 */

public class DetallePedidoDTO {
    private Long id;                     // ID del detalle de pedido
    private ProductoResumenDTO producto; // Información resumida del producto
    private Integer cantidad;            // Cantidad de unidades pedidas
    private BigDecimal precioUnitario;   // Precio por unidad del producto
    private BigDecimal subtotal;         // Precio total (cantidad * precioUnitario)

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductoResumenDTO getProducto() {
        return producto;
    }

    public void setProducto(ProductoResumenDTO producto) {
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

package com.proyectouno.demo.DTO;

import jakarta.validation.constraints.*;
import com.proyectouno.demo.models.Producto;
import java.math.BigDecimal;

/**
 * DTO para la entidad DetalleReserva, utilizado para transferir datos de detalles de reservas.
 */
public class DetalleReservaDTO {

    @NotNull(message = "El ID de la reserva no puede ser nulo")
    private Long idReserva;

    @NotNull(message = "El ID del producto no puede ser nulo")
    private Long idProducto;

    @NotNull(message = "La cantidad no puede ser nula")
    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    private Integer cantidad;

    @NotNull(message = "El precio unitario no puede ser nulo")
    @DecimalMin(value = "0.0", inclusive = true, message = "El precio unitario debe ser mayor o igual a 0")
    private BigDecimal precioUnitario;

    @NotNull(message = "El subtotal no puede ser nulo")
    @DecimalMin(value = "0.0", inclusive = true, message = "El subtotal debe ser mayor o igual a 0")
    private BigDecimal subtotal;

    @NotNull(message = "El campo disponible no puede ser nulo")
    private Boolean disponible;

    private String notas;

    // Información anidada para respuestas: producto completo
    private Producto producto;

    // Getters y Setters
    public Long getIdReserva() { return idReserva; }
    public void setIdReserva(Long idReserva) { this.idReserva = idReserva; }
    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
}
package com.proyectouno.demo.DTO;

import jakarta.validation.constraints.*;

/**
 * DTO para la entidad ProductoSintoma, utilizado para transferir relaciones entre productos y síntomas.
 */
public class ProductoSintomaDTO {

    @NotNull(message = "El ID del producto no puede ser nulo")
    private Long idProducto;

    @NotNull(message = "El ID del síntoma no puede ser nulo")
    private Long idSintoma;

    @Min(value = 1, message = "La relevancia debe estar entre 1 y 5")
    @Max(value = 5, message = "La relevancia debe estar entre 1 y 5")
    @NotNull(message = "La relevancia no puede ser nula")
    private Integer relevancia;

    // Getters y Setters
    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }
    public Long getIdSintoma() { return idSintoma; }
    public void setIdSintoma(Long idSintoma) { this.idSintoma = idSintoma; }
    public Integer getRelevancia() { return relevancia; }
    public void setRelevancia(Integer relevancia) { this.relevancia = relevancia; }
}
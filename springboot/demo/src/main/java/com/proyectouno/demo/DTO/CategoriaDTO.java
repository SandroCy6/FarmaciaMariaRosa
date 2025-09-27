package com.proyectouno.demo.DTO;

/**
 * DTO (Data Transfer Object) para la entidad Categoria.
 * Se utiliza para transferir datos de categoría entre el frontend y el backend,
 * sin exponer directamente la entidad de la base de datos.
 */
public class CategoriaDTO {
    private Long id;        // ID de la categoría
    private String nombre;  // Nombre de la categoría

    // Getters y Setters
    /**
     * Obtener el ID de la categoría.
     * 
     * @return ID de la categoría
     */
    public Long getId() {
        return id;
    }

    /**
     * Establecer el ID de la categoría.
     * 
     * @param id ID de la categoría
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Obtener el nombre de la categoría.
     * 
     * @return Nombre de la categoría
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Establecer el nombre de la categoría.
     * 
     * @param nombre Nombre de la categoría
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}

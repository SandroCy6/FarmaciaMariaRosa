package com.proyectouno.demo.DTO;

/**
 * DTO para enviar un resumen de información del cliente.
 * Contiene solo los datos básicos necesarios para listados o resúmenes
 * sin exponer toda la información del cliente.
 */
public class ClienteResumenDTO {
    private Long id;        // ID del cliente
    private String nombre;  // Nombre del cliente
    private String email;   // Correo electrónico del cliente

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

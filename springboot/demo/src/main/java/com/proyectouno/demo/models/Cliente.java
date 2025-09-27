package com.proyectouno.demo.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

/**
 * Entidad JPA que representa a un Cliente dentro del sistema.
 * 
 * Esta clase se mapea directamente a la tabla "clientes" en la base de datos.
 * Un cliente puede estar asociado a múltiples mensajes de contacto.
 */
@Entity
@Table(name = "clientes") // Especifica el nombre de la tabla en la BD
public class Cliente {
    /**
     * Identificador único del cliente (Primary Key).
     * Se genera automáticamente mediante estrategia IDENTITY.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * Nombre completo del cliente.
     * - No puede ser nulo.
     * - Longitud máxima: 100 caracteres.
     */
    @Column(length = 100, nullable = false)
    private String nombre;
    /**
     * Documento Nacional de Identidad (DNI) del cliente.
     * - Obligatorio.
     * - Único (no se pueden repetir DNIs en la tabla).
     * - Longitud máxima: 20 caracteres.
     */
    @Column(length = 20, unique = true, nullable = false)
    private String dni;
    /**
     * Número de teléfono del cliente.
     * - Opcional.
     * - Longitud máxima: 15 caracteres.
     */
    @Column(length = 15)
    private String telefono;
    /**
     * Correo electrónico del cliente.
     * - Opcional.
     * - Único (no se pueden repetir correos en la tabla).
     * - Longitud máxima: 100 caracteres.
     */
    @Column(length = 100, unique = true)
    private String email;
    /**
     * Relación uno a muchos con MensajeContacto.
     * Un cliente puede tener varios mensajes asociados.
     * 
     * - mappedBy = "cliente": la relación se gestiona desde MensajeContacto.
     * - cascade = ALL: las operaciones sobre el cliente se propagan a sus mensajes.
     * - orphanRemoval = true: si un mensaje se elimina de la lista, también se
     * elimina en BD.
     */
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MensajeContacto> mensajesContacto = new ArrayList<>();

    // ================== MÉTODOS GETTER Y SETTER ==================
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

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    /** Obtiene la lista de mensajes de contacto asociados al cliente. */
    public List<MensajeContacto> getMensajesContacto() {
        return mensajesContacto;
    }
    /** Asigna una lista de mensajes de contacto al cliente. */
    public void setMensajesContacto(List<MensajeContacto> mensajesContacto) {
        this.mensajesContacto = mensajesContacto;
    }
}

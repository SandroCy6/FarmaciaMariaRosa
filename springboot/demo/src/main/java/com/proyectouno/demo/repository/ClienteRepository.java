package com.proyectouno.demo.repository;

import com.proyectouno.demo.models.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
/**
 * Repositorio de la entidad Cliente.
 * 
 * Esta interfaz hereda de JpaRepository, lo que permite realizar operaciones
 * CRUD (crear, leer, actualizar y eliminar) sin necesidad de escribir SQL manual.
 * 
 * JpaRepository ya provee métodos como:
 * - findAll() → listar todos los clientes
 * - findById(Long id) → buscar cliente por id
 * - save(Cliente cliente) → guardar o actualizar
 * - deleteById(Long id) → eliminar por id
 */
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    /**
     * Busca un cliente en base a su DNI y correo electrónico.
     * 
     * Spring Data JPA interpreta automáticamente el nombre del método y genera la consulta:
     * SELECT * FROM clientes WHERE dni = ? AND email = ?
     *
     * @param dni   Documento nacional de identidad del cliente.
     * @param email Correo electrónico del cliente.
     * @return Un Optional que contiene el cliente encontrado o vacío si no existe.
     */
    Optional<Cliente> findByDniAndEmail(String dni, String email);
    Optional<Cliente> findByDni(String dni);
    Optional<Cliente> findByEmail(String email);

}

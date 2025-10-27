package com.proyectouno.demo.repository;

import com.proyectouno.demo.models.Cliente;
import com.proyectouno.demo.models.MensajeContacto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
/**
 * Repositorio de la entidad MensajeContacto.
 *
 * Esta interfaz extiende de JpaRepository, lo que significa que hereda
 * todos los métodos CRUD y de consulta básicos sin necesidad de implementarlos.
 *
 * Ejemplos de métodos ya disponibles:
 * - findAll() → listar todos los mensajes de contacto.
 * - findById(Long id) → obtener un mensaje específico por su ID.
 * - save(MensajeContacto mensaje) → guardar o actualizar un mensaje.
 * - deleteById(Long id) → eliminar un mensaje por su ID.
 *
 * Nota: Aquí no se han definido métodos personalizados, pero se pueden agregar
 * en caso de que se requieran consultas específicas (ej: buscar mensajes no contestados).
 */
public interface MensajeContactoRepository extends JpaRepository<MensajeContacto, Long> {
    /**
     * Busca todos los mensajes de contacto asociados a un cliente específico.
     *
     * @param cliente El cliente cuyos mensajes se desean buscar.
     * @return Una lista de mensajes de contacto asociados al cliente.
     */
    List<MensajeContacto> findByCliente(Cliente cliente);
}


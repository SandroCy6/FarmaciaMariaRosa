package com.proyectouno.demo.repository;

import com.proyectouno.demo.models.MensajeContacto;
import org.springframework.data.jpa.repository.JpaRepository;
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
}

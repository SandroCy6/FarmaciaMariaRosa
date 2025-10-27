package com.proyectouno.demo.repository;
import com.proyectouno.demo.models.Cliente;
import com.proyectouno.demo.models.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    /**
     * Busca todas las reservas asociadas a un cliente específico.
     *
     * @param cliente El cliente cuyas reservas se desean buscar.
     * @return Una lista de reservas asociadas al cliente.
     */
    List<Reserva> findByCliente(Cliente cliente);

    /**
     * Busca una reserva por su número de reserva.
     *
     * @param numeroReserva El número de reserva único.
     * @return La reserva encontrada o null si no existe.
     */
    Reserva findByNumeroReserva(String numeroReserva);
}
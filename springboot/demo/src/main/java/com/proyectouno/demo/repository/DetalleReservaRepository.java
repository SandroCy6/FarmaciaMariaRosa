package com.proyectouno.demo.repository;

import com.proyectouno.demo.models.DetalleReserva;
import com.proyectouno.demo.models.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetalleReservaRepository extends JpaRepository<DetalleReserva, Long> {
    List<DetalleReserva> findByReserva(Reserva reserva);
    void deleteByReserva(Reserva reserva);
}
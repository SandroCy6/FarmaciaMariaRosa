package com.proyectouno.demo.repository;

import com.proyectouno.demo.models.MensajeContacto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensajeContactoRepository extends JpaRepository<MensajeContacto, Long> {
}

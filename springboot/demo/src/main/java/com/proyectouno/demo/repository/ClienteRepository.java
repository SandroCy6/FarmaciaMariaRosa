package com.proyectouno.demo.repository;

import com.proyectouno.demo.models.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByDniAndEmail(String dni, String email);
}

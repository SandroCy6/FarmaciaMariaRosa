package com.proyectouno.demo.repository;

import com.proyectouno.demo.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query("SELECT p FROM Producto p LEFT JOIN FETCH p.categoria")
    List<Producto> findAllWithCategoria();

}

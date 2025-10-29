package com.proyectouno.demo.repository;

import com.proyectouno.demo.models.Lote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoteRepository extends JpaRepository<Lote, Long> {

    @Query("SELECT l FROM Lote l LEFT JOIN FETCH l.producto")
    List<Lote> findAllWithProducto();

    @Query("SELECT l FROM Lote l WHERE l.producto.idProducto = :idProducto")
    List<Lote> findByProductoId(Long idProducto);

}
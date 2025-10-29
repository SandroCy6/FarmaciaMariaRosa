package com.proyectouno.demo.Controller;

import com.proyectouno.demo.DTO.LoteDTO;
import com.proyectouno.demo.models.Lote;
import com.proyectouno.demo.models.Producto;
import com.proyectouno.demo.repository.LoteRepository;
import com.proyectouno.demo.repository.ProductoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lotes")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class LoteController {

    @Autowired
    private LoteRepository loteRepository;

    @Autowired
    private ProductoRepository productoRepository;

    /**
     * Obtener todos los lotes
     */
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<LoteDTO>> getAllLotes() {
        List<LoteDTO> lotes = loteRepository.findAllWithProducto().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lotes);
    }

    /**
     * Obtener lote por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<LoteDTO> getLoteById(@PathVariable Long id) {
        Lote lote = loteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lote no encontrado con ID: " + id));
        return ResponseEntity.ok(convertToDTO(lote));
    }

    /**
     * Obtener lotes por producto
     */
    @GetMapping("/producto/{idProducto}")
    public ResponseEntity<List<LoteDTO>> getLotesByProducto(@PathVariable Long idProducto) {
        List<LoteDTO> lotes = loteRepository.findByProductoId(idProducto).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lotes);
    }

    /**
     * Crear nuevo lote
     */
    @PostMapping
    public ResponseEntity<?> createLote(@Valid @RequestBody LoteDTO loteDTO) {
        try {
            Lote lote = convertToEntity(loteDTO);
            lote.setFechaCreacion(LocalDateTime.now());
            
            // Establecer estado automáticamente como ACTIVO
            if (lote.getEstado() == null) {
                lote.setEstado(Lote.EstadoLote.ACTIVO);
            }
            
            Lote saved = loteRepository.save(lote);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Actualizar lote existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLote(@PathVariable Long id, @Valid @RequestBody LoteDTO loteDTO) {
        try {
            Lote lote = loteRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Lote no encontrado con ID: " + id));
            
            updateEntityFromDTO(lote, loteDTO);
            lote.setFechaActualizacion(LocalDateTime.now());
            
            Lote updated = loteRepository.save(lote);
            return ResponseEntity.ok(convertToDTO(updated));
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Eliminar lote
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLote(@PathVariable Long id) {
        Lote lote = loteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lote no encontrado con ID: " + id));
        loteRepository.delete(lote);
        return ResponseEntity.noContent().build();
    }

    /**
     * Convertir entidad a DTO
     */
    private LoteDTO convertToDTO(Lote lote) {
        LoteDTO dto = new LoteDTO();
        dto.setIdLote(lote.getIdLote());
        dto.setIdProducto(lote.getProducto().getIdProducto());
        dto.setNumeroLote(lote.getNumeroLote());
        dto.setFechaVencimiento(lote.getFechaVencimiento());
        dto.setStockInicial(lote.getStockInicial());
        dto.setStockActual(lote.getStockActual());
        dto.setCostoUnitario(lote.getCostoUnitario());
        dto.setProveedor(lote.getProveedor());
        dto.setFechaIngreso(lote.getFechaIngreso());
        dto.setEstado(lote.getEstado().toString());
        dto.setObservaciones(lote.getObservaciones());
        // Agregar nombre del producto
        dto.setNombreProducto(lote.getProducto().getNombre());
        return dto;
    }

    /**
     * Convertir DTO a entidad
     */
    private Lote convertToEntity(LoteDTO dto) {
        Lote lote = new Lote();
        lote.setNumeroLote(dto.getNumeroLote());
        lote.setFechaVencimiento(dto.getFechaVencimiento());
        lote.setStockInicial(dto.getStockInicial());
        lote.setStockActual(dto.getStockActual());
        lote.setCostoUnitario(dto.getCostoUnitario());
        lote.setProveedor(dto.getProveedor());
        lote.setFechaIngreso(dto.getFechaIngreso());
        
        // Obtener producto
        Producto producto = productoRepository.findById(dto.getIdProducto())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + dto.getIdProducto()));
        lote.setProducto(producto);
        
        // Convertir estado de String a Enum
        if (dto.getEstado() != null) {
            try {
                lote.setEstado(Lote.EstadoLote.valueOf(dto.getEstado()));
            } catch (IllegalArgumentException e) {
                lote.setEstado(Lote.EstadoLote.ACTIVO);
            }
        }
        
        lote.setObservaciones(dto.getObservaciones());
        return lote;
    }

    /**
     * Actualizar entidad desde DTO
     */
    private void updateEntityFromDTO(Lote lote, LoteDTO dto) {
        lote.setNumeroLote(dto.getNumeroLote());
        lote.setFechaVencimiento(dto.getFechaVencimiento());
        lote.setStockInicial(dto.getStockInicial());
        lote.setStockActual(dto.getStockActual());
        lote.setCostoUnitario(dto.getCostoUnitario());
        lote.setProveedor(dto.getProveedor());
        lote.setFechaIngreso(dto.getFechaIngreso());
        
        // Actualizar producto si cambió
        if (!lote.getProducto().getIdProducto().equals(dto.getIdProducto())) {
            Producto producto = productoRepository.findById(dto.getIdProducto())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + dto.getIdProducto()));
            lote.setProducto(producto);
        }
        
        // Actualizar estado
        if (dto.getEstado() != null) {
            try {
                lote.setEstado(Lote.EstadoLote.valueOf(dto.getEstado()));
            } catch (IllegalArgumentException e) {
                lote.setEstado(Lote.EstadoLote.ACTIVO);
            }
        }
        
        lote.setObservaciones(dto.getObservaciones());
    }
}

/**
 * Manejador global de excepciones
 */
@ControllerAdvice
class LoteExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
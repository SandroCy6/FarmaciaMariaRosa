package com.proyectouno.demo.Controller;

import com.proyectouno.demo.DTO.ProductoDTO;
import com.proyectouno.demo.models.Producto;
import com.proyectouno.demo.repository.ProductoRepository;
import com.proyectouno.demo.repository.CategoriaRepository;
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
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping("/productos")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProductoDTO>> getAllProductos() {
        List<ProductoDTO> productos = productoRepository.findAllWithCategoria().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }


    @GetMapping("/productos/{id}")
    public ResponseEntity<ProductoDTO> getProductoById(@PathVariable Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        return ResponseEntity.ok(convertToDTO(producto));
    }

    @PostMapping("/productos")
    public ResponseEntity<?> createProducto(@Valid @RequestBody ProductoDTO productoDTO) {
        try {
            Producto producto = convertToEntity(productoDTO);
            producto.setFechaCreacion(LocalDateTime.now());
            Producto saved = productoRepository.save(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/productos/{id}")
    public ResponseEntity<?> updateProducto(@PathVariable Long id, @Valid @RequestBody ProductoDTO productoDTO) {
        try {
            Producto producto = productoRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
            updateEntityFromDTO(producto, productoDTO);
            producto.setFechaActualizacion(LocalDateTime.now());
            Producto updated = productoRepository.save(producto);
            return ResponseEntity.ok(convertToDTO(updated));
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        productoRepository.delete(producto);
        return ResponseEntity.noContent().build();
    }

    private ProductoDTO convertToDTO(Producto producto) {
        return new ProductoDTO(producto);
    }


    private Producto convertToEntity(ProductoDTO dto) {
        Producto producto = new Producto();
        producto.setCodigoBarras(dto.getCodigoBarras());
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStockActual(dto.getStockActual());
        producto.setStockMinimo(dto.getStockMinimo() != null ? dto.getStockMinimo() : 5);
        producto.setCategoria(categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + dto.getIdCategoria())));
        producto.setImagenPrincipal(dto.getImagenPrincipal());
        producto.setImagenesAdicionales(dto.getImagenesAdicionales());
        producto.setRequiereReceta(dto.getRequiereReceta());
        producto.setEsControlado(dto.getEsControlado());
        producto.setFechaVencimiento(dto.getFechaVencimiento());
        producto.setLaboratorio(dto.getLaboratorio());
        producto.setPrincipioActivo(dto.getPrincipioActivo());
        producto.setConcentracion(dto.getConcentracion());
        producto.setFormaFarmaceutica(dto.getFormaFarmaceutica());
        producto.setEstado(dto.getEstado());
        return producto;
    }

    private void updateEntityFromDTO(Producto producto, ProductoDTO dto) {
        producto.setCodigoBarras(dto.getCodigoBarras());
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStockActual(dto.getStockActual());
        producto.setStockMinimo(dto.getStockMinimo() != null ? dto.getStockMinimo() : 5);
        producto.setCategoria(categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + dto.getIdCategoria())));
        producto.setImagenPrincipal(dto.getImagenPrincipal());
        producto.setImagenesAdicionales(dto.getImagenesAdicionales());
        producto.setRequiereReceta(dto.getRequiereReceta());
        producto.setEsControlado(dto.getEsControlado());
        producto.setFechaVencimiento(dto.getFechaVencimiento());
        producto.setLaboratorio(dto.getLaboratorio());
        producto.setPrincipioActivo(dto.getPrincipioActivo());
        producto.setConcentracion(dto.getConcentracion());
        producto.setFormaFarmaceutica(dto.getFormaFarmaceutica());
        producto.setEstado(dto.getEstado());
    }
}

@ControllerAdvice
class GlobalExceptionHandler {
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

class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
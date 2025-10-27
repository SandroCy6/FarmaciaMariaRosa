package com.proyectouno.demo.Controller;

import com.proyectouno.demo.DTO.ClienteDTO;
import com.proyectouno.demo.DTO.DetalleReservaDTO;
import com.proyectouno.demo.DTO.ProductoDTO;
import com.proyectouno.demo.DTO.ReservaDTO;
import com.proyectouno.demo.exceptions.ResourceNotFoundException;
import com.proyectouno.demo.models.*;
import com.proyectouno.demo.repository.ClienteRepository;
import com.proyectouno.demo.repository.DetalleReservaRepository;
import com.proyectouno.demo.repository.ProductoRepository;
import com.proyectouno.demo.repository.ReservaRepository;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private DetalleReservaRepository detalleReservaRepository;

    @GetMapping("/reservas")
    public ResponseEntity<List<ReservaDTO>> getAllReservas() {
        List<ReservaDTO> reservas = reservaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/reservas/{id}")
    public ResponseEntity<ReservaDTO> getReservaById(@PathVariable Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con ID: " + id));
        return ResponseEntity.ok(convertToDTO(reserva));
    }

    @PostMapping("/reservas")
    @Transactional
    public ResponseEntity<?> createReserva(@Valid @RequestBody ReservaDTO reservaDTO) {
        try {
            // Validar cliente
            Cliente cliente = clienteRepository.findById(reservaDTO.getCliente().getIdCliente())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + reservaDTO.getCliente().getIdCliente()));

            // Validar stock, receta médica y calcular total
            BigDecimal total = BigDecimal.ZERO;
            for (DetalleReservaDTO detalleDTO : reservaDTO.getDetalles()) {
                Producto producto = productoRepository.findById(detalleDTO.getProducto().getIdProducto())
                        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + detalleDTO.getProducto().getIdProducto()));
                if (producto.getStockActual() < detalleDTO.getCantidad()) {
                    throw new IllegalStateException("Stock insuficiente para el producto: " + producto.getNombre());
                }
                if (producto.getRequiereReceta() && (detalleDTO.getNotas() == null || !detalleDTO.getNotas().contains("Receta proporcionada"))) {
                    throw new IllegalStateException("El producto " + producto.getNombre() + " requiere receta médica");
                }
                BigDecimal subtotal = producto.getPrecio().multiply(new BigDecimal(detalleDTO.getCantidad()));
                detalleDTO.setPrecioUnitario(producto.getPrecio());
                detalleDTO.setSubtotal(subtotal);
                detalleDTO.setDisponible(true);
                total = total.add(subtotal);
            }
            reservaDTO.setTotal(total);

            // Generar número de reserva único
            String numeroReserva = "RES-" + UUID.randomUUID().toString().substring(0, 8);
            while (reservaRepository.findByNumeroReserva(numeroReserva) != null) {
                numeroReserva = "RES-" + UUID.randomUUID().toString().substring(0, 8);
            }
            reservaDTO.setNumeroReserva(numeroReserva);
            reservaDTO.setFechaReserva(LocalDateTime.now());
            if (reservaDTO.getFechaLimiteRetiro() == null) {
                reservaDTO.setFechaLimiteRetiro(LocalDateTime.now().plusDays(7));
            }

            // Crear reserva
            Reserva reserva = convertToEntity(reservaDTO);
            reserva.setEstado(Reserva.EstadoReserva.valueOf(reservaDTO.getEstado()));
            reserva = reservaRepository.save(reserva);

            // Crear detalles y actualizar stock
            for (DetalleReservaDTO detalleDTO : reservaDTO.getDetalles()) {
                Producto producto = productoRepository.findById(detalleDTO.getProducto().getIdProducto()).get();
                DetalleReserva detalle = new DetalleReserva();
                detalle.setReserva(reserva);
                detalle.setProducto(producto);
                detalle.setCantidad(detalleDTO.getCantidad());
                detalle.setPrecioUnitario(detalleDTO.getPrecioUnitario());
                detalle.setSubtotal(detalleDTO.getSubtotal());
                detalle.setDisponible(detalleDTO.getDisponible());
                detalle.setNotas(detalleDTO.getNotas());
                detalleReservaRepository.save(detalle);

                // Actualizar stock
                producto.setStockActual(producto.getStockActual() - detalleDTO.getCantidad());
                productoRepository.save(producto);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(reserva));
        } catch (ConstraintViolationException e) {
            String errorMessage = e.getConstraintViolations().stream()
                    .map(violation -> violation.getMessage())
                    .findFirst()
                    .orElse("Error de validación desconocido");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", errorMessage));
        } catch (ResourceNotFoundException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("status", "error", "message", "Error al crear la reserva: " + e.getMessage()));
        }
    }

    @PutMapping("/reservas/{id}")
    @Transactional
    public ResponseEntity<?> updateReserva(@PathVariable Long id, @Valid @RequestBody ReservaDTO reservaDTO) {
        try {
            Reserva reserva = reservaRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con ID: " + id));

            // Validar cliente
            Cliente cliente = clienteRepository.findById(reservaDTO.getCliente().getIdCliente())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + reservaDTO.getCliente().getIdCliente()));

            // Validar cambio de estado
            Reserva.EstadoReserva nuevoEstado = Reserva.EstadoReserva.valueOf(reservaDTO.getEstado());
            if (reserva.getEstado() == Reserva.EstadoReserva.ENTREGADA && nuevoEstado != Reserva.EstadoReserva.ENTREGADA) {
                throw new IllegalStateException("No se puede cambiar el estado de una reserva ENTREGADA");
            }
            if (nuevoEstado == Reserva.EstadoReserva.ENTREGADA && reservaDTO.getFechaEntrega() == null) {
                reservaDTO.setFechaEntrega(LocalDateTime.now());
            }

            // Si se cambia a CANCELADA, restaurar stock
            if (nuevoEstado == Reserva.EstadoReserva.CANCELADA && reserva.getEstado() == Reserva.EstadoReserva.PENDIENTE) {
                List<DetalleReserva> detalles = detalleReservaRepository.findByReserva(reserva);
                for (DetalleReserva detalle : detalles) {
                    Producto producto = detalle.getProducto();
                    producto.setStockActual(producto.getStockActual() + detalle.getCantidad());
                    productoRepository.save(producto);
                }
            }

            // Validar stock y receta médica para nuevos detalles si está en PENDIENTE
            BigDecimal total = BigDecimal.ZERO;
            if (reserva.getEstado() == Reserva.EstadoReserva.PENDIENTE && !reservaDTO.getDetalles().isEmpty()) {
                // Restaurar stock de los detalles anteriores
                List<DetalleReserva> detallesAnteriores = detalleReservaRepository.findByReserva(reserva);
                for (DetalleReserva detalle : detallesAnteriores) {
                    Producto producto = detalle.getProducto();
                    producto.setStockActual(producto.getStockActual() + detalle.getCantidad());
                    productoRepository.save(producto);
                }
                detalleReservaRepository.deleteByReserva(reserva);

                // Validar y actualizar stock para nuevos detalles
                for (DetalleReservaDTO detalleDTO : reservaDTO.getDetalles()) {
                    Producto producto = productoRepository.findById(detalleDTO.getProducto().getIdProducto())
                            .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + detalleDTO.getProducto().getIdProducto()));
                    if (producto.getStockActual() < detalleDTO.getCantidad()) {
                        throw new IllegalStateException("Stock insuficiente para el producto: " + producto.getNombre());
                    }
                    if (producto.getRequiereReceta() && (detalleDTO.getNotas() == null || !detalleDTO.getNotas().contains("Receta proporcionada"))) {
                        throw new IllegalStateException("El producto " + producto.getNombre() + " requiere receta médica");
                    }
                    BigDecimal subtotal = producto.getPrecio().multiply(new BigDecimal(detalleDTO.getCantidad()));
                    detalleDTO.setPrecioUnitario(producto.getPrecio());
                    detalleDTO.setSubtotal(subtotal);
                    detalleDTO.setDisponible(true);
                    total = total.add(subtotal);
                }
                reservaDTO.setTotal(total);
            } else {
                reservaDTO.setTotal(reserva.getTotal());
            }

            // Actualizar reserva
            updateEntityFromDTO(reserva, reservaDTO);
            reserva = reservaRepository.save(reserva);

            // Guardar nuevos detalles si se proporcionaron
            if (reserva.getEstado() == Reserva.EstadoReserva.PENDIENTE && !reservaDTO.getDetalles().isEmpty()) {
                for (DetalleReservaDTO detalleDTO : reservaDTO.getDetalles()) {
                    Producto producto = productoRepository.findById(detalleDTO.getProducto().getIdProducto()).get();
                    DetalleReserva detalle = new DetalleReserva();
                    detalle.setReserva(reserva);
                    detalle.setProducto(producto);
                    detalle.setCantidad(detalleDTO.getCantidad());
                    detalle.setPrecioUnitario(detalleDTO.getPrecioUnitario());
                    detalle.setSubtotal(detalleDTO.getSubtotal());
                    detalle.setDisponible(detalleDTO.getDisponible());
                    detalle.setNotas(detalleDTO.getNotas());
                    detalleReservaRepository.save(detalle);

                    // Actualizar stock
                    producto.setStockActual(producto.getStockActual() - detalleDTO.getCantidad());
                    productoRepository.save(producto);
                }
            }

            return ResponseEntity.ok(convertToDTO(reserva));
        } catch (ConstraintViolationException e) {
            String errorMessage = e.getConstraintViolations().stream()
                    .map(violation -> violation.getMessage())
                    .findFirst()
                    .orElse("Error de validación desconocido");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", errorMessage));
        } catch (ResourceNotFoundException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("status", "error", "message", "Error al actualizar la reserva: " + e.getMessage()));
        }
    }

    @DeleteMapping("/reservas/{id}")
    @Transactional
    public ResponseEntity<?> deleteReserva(@PathVariable Long id) {
        try {
            Reserva reserva = reservaRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con ID: " + id));
            if (reserva.getEstado() == Reserva.EstadoReserva.PENDIENTE) {
                List<DetalleReserva> detalles = detalleReservaRepository.findByReserva(reserva);
                for (DetalleReserva detalle : detalles) {
                    Producto producto = detalle.getProducto();
                    producto.setStockActual(producto.getStockActual() + detalle.getCantidad());
                    productoRepository.save(producto);
                }
            }
            detalleReservaRepository.deleteByReserva(reserva);
            reservaRepository.delete(reserva);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("status", "error", "message", "Error al eliminar la reserva: " + e.getMessage()));
        }
    }

    private ReservaDTO convertToDTO(Reserva reserva) {
        ReservaDTO dto = new ReservaDTO();
        dto.setIdReserva(reserva.getIdReserva());
        dto.setNumeroReserva(reserva.getNumeroReserva());
        ClienteDTO clienteDTO = new ClienteDTO();
        clienteDTO.setIdCliente(reserva.getCliente().getIdCliente());
        clienteDTO.setNombre(reserva.getCliente().getNombre());
        clienteDTO.setEmail(reserva.getCliente().getEmail());
        clienteDTO.setDni(reserva.getCliente().getDni());
        clienteDTO.setTelefono(reserva.getCliente().getTelefono());
        clienteDTO.setDireccion(reserva.getCliente().getDireccion());
        clienteDTO.setFechaNacimiento(reserva.getCliente().getFechaNacimiento());
        clienteDTO.setTieneCondicionCronica(reserva.getCliente().getTieneCondicionCronica());
        clienteDTO.setNotasEspeciales(reserva.getCliente().getNotasEspeciales());
        clienteDTO.setAceptaNotificaciones(reserva.getCliente().getAceptaNotificaciones());
        dto.setCliente(clienteDTO);
        dto.setEstado(reserva.getEstado().name());
        dto.setTotal(reserva.getTotal());
        dto.setFechaReserva(reserva.getFechaReserva());
        dto.setFechaLimiteRetiro(reserva.getFechaLimiteRetiro());
        dto.setFechaEntrega(reserva.getFechaEntrega());
        dto.setNotasCliente(reserva.getNotasCliente());
        dto.setNotasFarmacia(reserva.getNotasFarmacia());
        dto.setMetodoNotificacion(reserva.getMetodoNotificacion() != null ? reserva.getMetodoNotificacion().name() : null);
        dto.setIdUsuarioAtencion(reserva.getUsuarioAtencion() != null ? reserva.getUsuarioAtencion().getIdUsuario() : null);
        List<DetalleReserva> detalles = detalleReservaRepository.findByReserva(reserva);
        dto.setDetalles(detalles.stream().map(detalle -> {
            DetalleReservaDTO detalleDTO = new DetalleReservaDTO();
            detalleDTO.setIdReserva(reserva.getIdReserva());
            ProductoDTO productoDTO = new ProductoDTO();
            productoDTO.setIdProducto(detalle.getProducto().getIdProducto());
            productoDTO.setNombre(detalle.getProducto().getNombre());
            productoDTO.setPrecio(detalle.getProducto().getPrecio());
            productoDTO.setStockActual(detalle.getProducto().getStockActual());
            productoDTO.setStockMinimo(detalle.getProducto().getStockMinimo());
            productoDTO.setIdCategoria(detalle.getProducto().getCategoria().getIdCategoria());
            productoDTO.setCategoriaNombre(detalle.getProducto().getCategoria().getNombre());
            productoDTO.setImagenPrincipal(detalle.getProducto().getImagenPrincipal());
            productoDTO.setImagenesAdicionales(detalle.getProducto().getImagenesAdicionales());
            productoDTO.setRequiereReceta(detalle.getProducto().getRequiereReceta());
            productoDTO.setEsControlado(detalle.getProducto().getEsControlado());
            productoDTO.setFechaVencimiento(detalle.getProducto().getFechaVencimiento());
            productoDTO.setLaboratorio(detalle.getProducto().getLaboratorio());
            productoDTO.setPrincipioActivo(detalle.getProducto().getPrincipioActivo());
            productoDTO.setConcentracion(detalle.getProducto().getConcentracion());
            productoDTO.setFormaFarmaceutica(detalle.getProducto().getFormaFarmaceutica());
            productoDTO.setEstado(detalle.getProducto().getEstado());
            detalleDTO.setProducto(productoDTO);
            detalleDTO.setCantidad(detalle.getCantidad());
            detalleDTO.setPrecioUnitario(detalle.getPrecioUnitario());
            detalleDTO.setSubtotal(detalle.getSubtotal());
            detalleDTO.setDisponible(detalle.getDisponible());
            detalleDTO.setNotas(detalle.getNotas());
            return detalleDTO;
        }).collect(Collectors.toList()));
        return dto;
    }

    private Reserva convertToEntity(ReservaDTO dto) {
        Reserva reserva = new Reserva();
        reserva.setNumeroReserva(dto.getNumeroReserva());
        Cliente cliente = clienteRepository.findById(dto.getCliente().getIdCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + dto.getCliente().getIdCliente()));
        reserva.setCliente(cliente);
        reserva.setEstado(Reserva.EstadoReserva.valueOf(dto.getEstado()));
        reserva.setTotal(dto.getTotal());
        reserva.setFechaReserva(dto.getFechaReserva());
        reserva.setFechaLimiteRetiro(dto.getFechaLimiteRetiro());
        reserva.setFechaEntrega(dto.getFechaEntrega());
        reserva.setNotasCliente(dto.getNotasCliente());
        reserva.setNotasFarmacia(dto.getNotasFarmacia());
        if (dto.getMetodoNotificacion() != null) {
            reserva.setMetodoNotificacion(Reserva.MetodoNotificacion.valueOf(dto.getMetodoNotificacion()));
        }
        if (dto.getIdUsuarioAtencion() != null) {
            Usuario usuario = new Usuario();
            usuario.setIdUsuario(dto.getIdUsuarioAtencion());
            reserva.setUsuarioAtencion(usuario);
        }
        return reserva;
    }

    private void updateEntityFromDTO(Reserva reserva, ReservaDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.getCliente().getIdCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + dto.getCliente().getIdCliente()));
        reserva.setCliente(cliente);
        reserva.setNumeroReserva(dto.getNumeroReserva());
        reserva.setEstado(Reserva.EstadoReserva.valueOf(dto.getEstado()));
        reserva.setTotal(dto.getTotal());
        reserva.setFechaLimiteRetiro(dto.getFechaLimiteRetiro());
        reserva.setFechaEntrega(dto.getFechaEntrega());
        reserva.setNotasCliente(dto.getNotasCliente());
        reserva.setNotasFarmacia(dto.getNotasFarmacia());
        if (dto.getMetodoNotificacion() != null) {
            reserva.setMetodoNotificacion(Reserva.MetodoNotificacion.valueOf(dto.getMetodoNotificacion()));
        } else {
            reserva.setMetodoNotificacion(null);
        }
        if (dto.getIdUsuarioAtencion() != null) {
            Usuario usuario = new Usuario();
            usuario.setIdUsuario(dto.getIdUsuarioAtencion());
            reserva.setUsuarioAtencion(usuario);
        } else {
            reserva.setUsuarioAtencion(null);
        }
    }
}

@ControllerAdvice
class ReservaExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("status", "error", "message", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("status", "error", "message", "Errores de validación", "errors", errors));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolation(ConstraintViolationException ex) {
        String errorMessage = ex.getConstraintViolations().stream()
                .map(violation -> violation.getMessage())
                .findFirst()
                .orElse("Error de validación desconocido");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("status", "error", "message", errorMessage));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalStateException(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("status", "error", "message", ex.getMessage()));
    }
}
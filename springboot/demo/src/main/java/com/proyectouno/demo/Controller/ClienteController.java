package com.proyectouno.demo.Controller;

import com.proyectouno.demo.DTO.ClienteDTO;
import com.proyectouno.demo.exceptions.ResourceNotFoundException;
import com.proyectouno.demo.models.Cliente;
import com.proyectouno.demo.repository.ClienteRepository;
import com.proyectouno.demo.repository.MensajeContactoRepository;
import com.proyectouno.demo.repository.ReservaRepository;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private MensajeContactoRepository mensajeContactoRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    /**
     * Listar todos los clientes.
     */
    @GetMapping("/clientes")
    public ResponseEntity<List<ClienteDTO>> getAllClientes() {
        List<ClienteDTO> clientes = clienteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clientes);
    }

    /**
     * Obtener un cliente por ID.
     */
    @GetMapping("/clientes/{id}")
    public ResponseEntity<ClienteDTO> getClienteById(@PathVariable Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
        return ResponseEntity.ok(convertToDTO(cliente));
    }

    /**
     * Crear un nuevo cliente.
     */
    @PostMapping("/clientes")
    @Transactional
    public ResponseEntity<?> createCliente(@Valid @RequestBody ClienteDTO clienteDTO) {
        try {
            // Verificar si ya existe un cliente con el mismo DNI y email
            if (clienteRepository.findByDniAndEmail(clienteDTO.getDni(), clienteDTO.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("status", "error", "message", "Ya existe un cliente con el mismo DNI y email"));
            }

            Cliente cliente = convertToEntity(clienteDTO);
            cliente.setFechaCreacion(LocalDateTime.now());
            cliente = clienteRepository.save(cliente);

            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(cliente));
        } catch (ConstraintViolationException e) {
            String errorMessage = e.getConstraintViolations().stream()
                    .map(violation -> violation.getMessage())
                    .findFirst()
                    .orElse("Error de validación desconocido");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", errorMessage));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error al crear el cliente: " + e.getMessage()));
        }
    }

    /**
     * Actualizar un cliente existente.
     */
    @PutMapping("/clientes/{id}")
    @Transactional
    public ResponseEntity<?> updateCliente(@PathVariable Long id, @Valid @RequestBody ClienteDTO clienteDTO) {
        try {
            Cliente cliente = clienteRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));

            // Verificar si el nuevo DNI y email ya están registrados por otro cliente
            clienteRepository.findByDniAndEmail(clienteDTO.getDni(), clienteDTO.getEmail())
                    .ifPresent(existingCliente -> {
                        if (!existingCliente.getIdCliente().equals(id)) {
                            throw new IllegalStateException("Ya existe otro cliente con el mismo DNI y email");
                        }
                    });

            updateEntityFromDTO(cliente, clienteDTO);
            cliente.setFechaActualizacion(LocalDateTime.now());
            clienteRepository.save(cliente);

            return ResponseEntity.ok(convertToDTO(cliente));
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
                    .body(Map.of("status", "error", "message", "Error al actualizar el cliente: " + e.getMessage()));
        }
    }

    /**
     * Eliminar un cliente, siempre que no tenga mensajes o reservas asociadas.
     */
    @DeleteMapping("/clientes/{id}")
    @Transactional
    public ResponseEntity<?> deleteCliente(@PathVariable Long id) {
        try {
            Cliente cliente = clienteRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));

            // Verificar si el cliente tiene mensajes asociados
            if (!mensajeContactoRepository.findByCliente(cliente).isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("status", "error", "message", "No se puede eliminar el cliente porque tiene mensajes de contacto asociados"));
            }

            // Verificar si el cliente tiene reservas asociadas
            if (!reservaRepository.findByCliente(cliente).isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("status", "error", "message", "No se puede eliminar el cliente porque tiene reservas asociadas"));
            }

            clienteRepository.delete(cliente);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error al eliminar el cliente: " + e.getMessage()));
        }
    }

    private ClienteDTO convertToDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setNombre(cliente.getNombre());
        dto.setEmail(cliente.getEmail());
        dto.setDni(cliente.getDni());
        dto.setTelefono(cliente.getTelefono());
        dto.setDireccion(cliente.getDireccion());
        dto.setFechaNacimiento(cliente.getFechaNacimiento());
        dto.setTieneCondicionCronica(cliente.getTieneCondicionCronica());
        dto.setNotasEspeciales(cliente.getNotasEspeciales());
        dto.setAceptaNotificaciones(cliente.getAceptaNotificaciones());
        return dto;
    }

    private Cliente convertToEntity(ClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setEmail(dto.getEmail());
        cliente.setDni(dto.getDni());
        cliente.setTelefono(dto.getTelefono());
        cliente.setDireccion(dto.getDireccion());
        cliente.setFechaNacimiento(dto.getFechaNacimiento());
        cliente.setTieneCondicionCronica(dto.getTieneCondicionCronica());
        cliente.setNotasEspeciales(dto.getNotasEspeciales());
        cliente.setAceptaNotificaciones(dto.getAceptaNotificaciones());
        return cliente;
    }

    private void updateEntityFromDTO(Cliente cliente, ClienteDTO dto) {
        cliente.setNombre(dto.getNombre());
        cliente.setEmail(dto.getEmail());
        cliente.setDni(dto.getDni());
        cliente.setTelefono(dto.getTelefono());
        cliente.setDireccion(dto.getDireccion());
        cliente.setFechaNacimiento(dto.getFechaNacimiento());
        cliente.setTieneCondicionCronica(dto.getTieneCondicionCronica());
        cliente.setNotasEspeciales(dto.getNotasEspeciales());
        cliente.setAceptaNotificaciones(dto.getAceptaNotificaciones());
    }

    @ControllerAdvice
    class ClienteExceptionHandler {
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
}
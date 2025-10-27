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
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5500" })
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
        System.out.println("Listando todos los clientes");
        List<ClienteDTO> clientes = clienteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        System.out.println("Clientes encontrados: " + clientes.size());
        clientes.forEach(dto -> {
            if (dto.getIdCliente() == null) {
                System.err.println(
                        "Error: idCliente es null en DTO para cliente: " + dto.getNombre() + ", dni=" + dto.getDni());
            }
        });
        return ResponseEntity.ok(clientes);
    }

    /**
     * Obtener un cliente por ID.
     */
    @GetMapping("/clientes/{id}")
    public ResponseEntity<ClienteDTO> getClienteById(@PathVariable Long id) {
        System.out.println("Buscando cliente con ID: " + id);
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
        ClienteDTO dto = convertToDTO(cliente);
        System.out.println("Cliente encontrado: " + dto);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/clientes/dni/{dni}")
    public ResponseEntity<ClienteDTO> getClienteByDni(@PathVariable String dni) {
        System.out.println("Buscando cliente con DNI: " + dni);
        Optional<Cliente> clienteOpt = clienteRepository.findByDni(dni);
        if (clienteOpt.isEmpty()) {
            System.out.println("No se encontró cliente con DNI: " + dni);
            throw new ResourceNotFoundException("Cliente no encontrado con DNI: " + dni);
        }
        Cliente cliente = clienteOpt.get();
        ClienteDTO dto = convertToDTO(cliente);
        System.out.println("Cliente encontrado: id=" + cliente.getIdCliente() + ", nombre=" + cliente.getNombre()
                + ", DTO=" + dto);
        if (dto.getIdCliente() == null) {
            System.err.println("Error: idCliente es null en el DTO para el cliente con DNI: " + dni);
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Crear un nuevo cliente.
     */
    @PostMapping("/clientes")
    @Transactional
    public ResponseEntity<?> createCliente(@Valid @RequestBody ClienteDTO clienteDTO) {
        try {
            System.out.println("Intentando crear cliente: " + clienteDTO);
            // Buscar si ya existe un cliente con el mismo DNI
            if (clienteDTO.getDni() != null) {
                Optional<Cliente> existingByDni = clienteRepository.findByDni(clienteDTO.getDni());
                if (existingByDni.isPresent()) {
                    System.out.println("Cliente ya existe con DNI: " + clienteDTO.getDni() + ", id="
                            + existingByDni.get().getIdCliente());
                    return ResponseEntity.status(HttpStatus.OK).body(convertToDTO(existingByDni.get()));
                }
            }
            // Buscar si ya existe un cliente con el mismo email (si no es null)
            if (clienteDTO.getEmail() != null && !clienteDTO.getEmail().isEmpty()) {
                Optional<Cliente> existingByEmail = clienteRepository.findByEmail(clienteDTO.getEmail());
                if (existingByEmail.isPresent()) {
                    System.out.println("Cliente ya existe con email: " + clienteDTO.getEmail() + ", id="
                            + existingByEmail.get().getIdCliente());
                    return ResponseEntity.status(HttpStatus.OK).body(convertToDTO(existingByEmail.get()));
                }
            }
            // Crear nuevo cliente
            Cliente cliente = convertToEntity(clienteDTO);
            cliente.setFechaCreacion(LocalDateTime.now());
            Cliente saved = clienteRepository.save(cliente);
            System.out.println("Cliente creado exitosamente: id=" + saved.getIdCliente());
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));
        } catch (ConstraintViolationException ex) {
            String errorMessage = ex.getConstraintViolations().stream()
                    .map(violation -> violation.getMessage())
                    .findFirst()
                    .orElse("Error de validación desconocido");
            System.out.println("Error de validación al crear cliente: " + errorMessage);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", errorMessage));
        } catch (Exception ex) {
            System.out.println("Error inesperado al crear cliente: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", "Error al crear cliente: " + ex.getMessage()));
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
                        .body(Map.of("status", "error", "message",
                                "No se puede eliminar el cliente porque tiene mensajes de contacto asociados"));
            }

            // Verificar si el cliente tiene reservas asociadas
            if (!reservaRepository.findByCliente(cliente).isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("status", "error", "message",
                                "No se puede eliminar el cliente porque tiene reservas asociadas"));
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
        System.out.println("Convirtiendo cliente a DTO: id=" + cliente.getIdCliente() + ", nombre="
                + cliente.getNombre() + ", dni=" + cliente.getDni());
        ClienteDTO dto = new ClienteDTO();
        dto.setIdCliente(cliente.getIdCliente());
        dto.setNombre(cliente.getNombre());
        dto.setEmail(cliente.getEmail());
        dto.setDni(cliente.getDni());
        dto.setTelefono(cliente.getTelefono());
        dto.setDireccion(cliente.getDireccion());
        dto.setFechaNacimiento(cliente.getFechaNacimiento());
        dto.setTieneCondicionCronica(cliente.getTieneCondicionCronica());
        dto.setNotasEspeciales(cliente.getNotasEspeciales());
        dto.setAceptaNotificaciones(cliente.getAceptaNotificaciones());
        System.out.println("DTO creado: idCliente=" + dto.getIdCliente() + ", nombre=" + dto.getNombre() + ", dni="
                + dto.getDni());
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
            ex.getBindingResult().getFieldErrors()
                    .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
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
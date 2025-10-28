package com.proyectouno.demo.Controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.proyectouno.demo.models.Cliente;
import com.proyectouno.demo.models.MensajeContacto;
import com.proyectouno.demo.repository.ClienteRepository;
import com.proyectouno.demo.repository.MensajeContactoRepository;
import jakarta.validation.ConstraintViolationException;

import org.springframework.web.bind.annotation.*;

/**
 * Controlador para manejar los mensajes de contacto enviados desde el frontend.
 * Exponemos un endpoint POST en /api/contacto para recibir los datos del
 * formulario.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://127.0.0.1:5500", "http://localhost:5500" }) // Permite
                                                                                                          // CORS desde
                                                                                                          // frontend
public class ContactoController {
    @Autowired
    private ClienteRepository clienteRepository; // Repositorio para manejar clientes

    @Autowired
    private MensajeContactoRepository mensajeContactoRepository; // Repositorio para mensajes de contacto

    /**
     * Endpoint para recibir un formulario de contacto.
     * Si el cliente ya existe (dni + email) se reutiliza, si no se crea uno nuevo.
     * Luego se guarda el mensaje de contacto asociado al cliente.
     * 
     * @param datos Mapa con las claves: nombre, email, telefono, mensaje, dni
     * @return ResponseEntity con status y mensaje de éxito o error
     */

    // POST
    // ContactoController.java — POST separado y GET fuera del POST
    @PostMapping("/contacto")
    public ResponseEntity<Map<String, Object>> recibirContacto(@RequestBody Map<String, String> datos) {
        try {
            String nombre = datos.get("nombre");
            String email = datos.get("email");
            String telefono = datos.get("telefono");
            String mensajeTexto = datos.get("mensaje");
            String dni = datos.get("dni");

            Cliente cliente = clienteRepository.findByDni(dni).orElseGet(() -> {
                Cliente nuevo = new Cliente();
                nuevo.setNombre(nombre);
                nuevo.setEmail(email);
                nuevo.setTelefono(telefono);
                nuevo.setDni(dni);
                return clienteRepository.save(nuevo);
            });

            boolean updated = false;
            if (nombre != null && !nombre.equals(cliente.getNombre())) {
                cliente.setNombre(nombre);
                updated = true;
            }
            if (email != null && !email.equals(cliente.getEmail())) {
                cliente.setEmail(email);
                updated = true;
            }
            if (telefono != null && !telefono.equals(cliente.getTelefono())) {
                cliente.setTelefono(telefono);
                updated = true;
            }
            if (updated)
                clienteRepository.save(cliente);

            MensajeContacto mensaje = new MensajeContacto();
            mensaje.setCliente(cliente);
            mensaje.setMensaje(mensajeTexto);
            mensaje.setFechaEnvio(LocalDateTime.now());
            mensaje.setFechaRespuesta(null);
            mensajeContactoRepository.save(mensaje);

            return ResponseEntity
                    .ok(Map.of("status", "success", "message", "Formulario recibido y guardado correctamente."));
        } catch (ConstraintViolationException e) {
            String errorMessage = e.getConstraintViolations().stream()
                    .map(v -> v.getMessage()).findFirst().orElse("Error de validación desconocido");
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", errorMessage));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of("status", "error", "message", "Ocurrió un error al guardar el mensaje: " + e.getMessage()));
        }
    }

    // MÉTODO SEPARADO (fuera del POST): listado para admin
    @GetMapping("/mensajes")
    public ResponseEntity<?> obtenerTodosMensajes() {
        var mensajes = mensajeContactoRepository.findAll();
        var lista = mensajes.stream().map(m -> Map.of(
                "id", m.getId(),
                "mensaje", m.getMensaje(),
                "fechaEnvio", m.getFechaEnvio(),
                "estadoContestado", m.getEstadoContestado(),
                "cliente", Map.of(
                        "id", m.getCliente().getIdCliente(),
                        "nombre", m.getCliente().getNombre(),
                        "email", m.getCliente().getEmail(),
                        "dni", m.getCliente().getDni(),
                        "telefono", m.getCliente().getTelefono())))
                .toList();
        return ResponseEntity.ok(lista);
    }
}
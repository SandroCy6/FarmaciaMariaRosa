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
@CrossOrigin(origins = { "http://127.0.0.1:5500", "http://localhost:5500" }) // Permite CORS desde frontend
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
    @PostMapping("/contacto") // POST
    public ResponseEntity<?> recibirContacto(@RequestBody Map<String, String> datos) {
        try {
            // Extraer datos del request
            String nombre = datos.get("nombre");
            String email = datos.get("email");
            String telefono = datos.get("telefono");
            String mensajeTexto = datos.get("mensaje");
            String dni = datos.get("dni");

            // 1. Buscar cliente por dni y email
            // Si no existe, crear uno nuevo y guardarlo en la DB
            Cliente cliente = clienteRepository.findByDniAndEmail(dni, email)
                    .orElseGet(() -> {
                        Cliente nuevo = new Cliente();
                        nuevo.setNombre(nombre);
                        nuevo.setEmail(email);
                        nuevo.setTelefono(telefono);
                        nuevo.setDni(dni);
                        return clienteRepository.save(nuevo); // Guardar nuevo cliente
                    });

            // 2. Crear y guardar mensaje de contacto
            MensajeContacto mensaje = new MensajeContacto();
            mensaje.setCliente(cliente); // Asociar al cliente
            mensaje.setMensaje(mensajeTexto);
            mensaje.setFechaEnvio(LocalDateTime.now()); // Fecha actual
            mensaje.setFechaRespuesta(null); // Inicialmente sin respuesta

            mensajeContactoRepository.save(mensaje); // Guardar en DB

            // 3. Retornar respuesta exitosa al frontend
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Formulario recibido y guardado correctamente."));

        }  catch (ConstraintViolationException e) {
            // Manejar errores de validación de JPA
            String errorMessage = e.getConstraintViolations().stream()
                    .map(violation -> violation.getMessage())
                    .findFirst()
                    .orElse("Error de validación desconocido");
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", errorMessage));
        } catch (Exception e) {
            // Manejar otros errores
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "Ocurrió un error al guardar el mensaje: " + e.getMessage()));
        }
    }
}

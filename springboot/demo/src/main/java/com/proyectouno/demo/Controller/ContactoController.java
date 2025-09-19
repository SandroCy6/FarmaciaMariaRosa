package com.proyectouno.demo.Controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.proyectouno.demo.models.Cliente;
import com.proyectouno.demo.models.MensajeContacto;
import com.proyectouno.demo.repository.ClienteRepository;
import com.proyectouno.demo.repository.MensajeContactoRepository;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class ContactoController {
    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private MensajeContactoRepository mensajeContactoRepository;

    @PostMapping("/contacto")
    public ResponseEntity<?> recibirContacto(@RequestBody Map<String, String> datos) {
        try {
            String nombre = datos.get("nombre");
            String email = datos.get("email");
            String telefono = datos.get("telefono");
            String mensajeTexto = datos.get("mensaje");
            String dni = datos.get("dni");

            // 1. Buscar cliente por dni y email
            Cliente cliente = clienteRepository.findByDniAndEmail(dni, email)
                    .orElseGet(() -> {
                        Cliente nuevo = new Cliente();
                        nuevo.setNombre(nombre);
                        nuevo.setEmail(email);
                        nuevo.setTelefono(telefono);
                        nuevo.setDni(dni);
                        return clienteRepository.save(nuevo);
                    });

            // 2. Crear y guardar mensaje de contacto
            MensajeContacto mensaje = new MensajeContacto();
            mensaje.setCliente(cliente);
            mensaje.setMensaje(mensajeTexto);
            mensaje.setFechaEnvio(LocalDateTime.now());
            mensaje.setFechaRespuesta(null);

            mensajeContactoRepository.save(mensaje);

            // 3. Retornar respuesta exitosa
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Formulario recibido y guardado correctamente."
            ));

        } catch (Exception e) {
            // Retornar error 500 si algo falla
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "Ocurrió un error al guardar el mensaje."
            ));
        }
    }
}

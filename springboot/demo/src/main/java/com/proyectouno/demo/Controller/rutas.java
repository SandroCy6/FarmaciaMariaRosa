package com.proyectouno.demo.Controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController

@RequestMapping("/api")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})

public class rutas {

    @PostMapping("/contacto")
    public String recibirContacto(@RequestBody Map<String, String> datos) {
        String nombre = datos.get("nombre");
        String email = datos.get("email");
        String telefono = datos.get("telefono");
        String mensaje = datos.get("mensaje");

        return "Formulario recibido. Nombre: " + nombre + ", Email: " + email + ", Telefono: "+telefono +", Mensaje: " + mensaje;
    }
}

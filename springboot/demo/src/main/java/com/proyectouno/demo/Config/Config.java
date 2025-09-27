package com.proyectouno.demo.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración de CORS para permitir que el frontend
 * (localhost:5500) acceda a las APIs del backend.
 */

@Configuration
public class Config {
    /**
     * Bean que devuelve un WebMvcConfigurer personalizado para configurar CORS.
     * 
     * @return WebMvcConfigurer con reglas de CORS definidas
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            /**
             * Configura CORS para todas las rutas /api.
             * Permite solicitudes GET, POST, PUT, DELETE y OPTIONS
             * desde localhost:5500 con cualquier header y cookies.
             * 
             * @param registry Objeto para registrar las rutas CORS.
             */

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // aplica a todas las rutas bajo /api
                        .allowedOrigins("http://127.0.0.1:5500", "http://localhost:5500") // frontend permitido
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // métodos permitidos
                        .allowedHeaders("*") // cualquier header
                        .allowCredentials(true); // permite cookies
            }
        };
    }
}

package com.example.app.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.example.app.service.FirebaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/firebase")
@CrossOrigin(origins = "http://localhost:5173")
public class FirebaseController {

    @Autowired
    private FirebaseService firebaseService;

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> testConnection(@RequestBody Map<String, Object> data) {
        try {
            String id = UUID.randomUUID().toString();
            
            // Añadimos la información recibida al documento
            Map<String, Object> testData = new HashMap<>(data);
            testData.put("timestamp", System.currentTimeMillis());
            
            String result = firebaseService.saveDocument("test_connection", id, testData);
            
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("timestamp", result);
            response.put("id", id);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", e.getMessage());
            
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, Object> loginRequest) {
        try {
            String email = (String) loginRequest.get("email");
            String password = (String) loginRequest.get("password");
            
            // Validación básica
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email y contraseña son requeridos"
                ));
            }
            
            // Crear documento para guardar en Firebase
            Map<String, Object> loginData = new HashMap<>();
            loginData.put("email", email);
            loginData.put("timestamp", System.currentTimeMillis());
            loginData.put("success", true);
            
            // Añadir información adicional si existe
            if (loginRequest.containsKey("additionalInfo")) {
                loginData.put("additionalInfo", loginRequest.get("additionalInfo"));
            }
            
            // Generar ID único para el login y guardar en Firebase
            String loginId = UUID.randomUUID().toString();
            firebaseService.saveDocument("logins", loginId, loginData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login exitoso");
            response.put("loginId", loginId);
            response.put("timestamp", new Date().toString());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Error interno: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/user/{loginId}")
    public ResponseEntity<?> getUserData(@PathVariable String loginId) {
        try {
            Map<String, Object> userData = firebaseService.getDocument("logins", loginId);
            
            if (userData == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Error al obtener datos de usuario: " + e.getMessage()
            ));
        }
    }
}
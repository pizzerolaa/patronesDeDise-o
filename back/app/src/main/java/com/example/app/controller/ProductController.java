package com.example.app.controller;

import com.example.app.service.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private FirebaseService firebaseService;
    
    // Obtener todos los productos
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllProducts() {
        try {
            List<Map<String, Object>> products = firebaseService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Obtener un producto por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable String id) {
        try {
            Map<String, Object> product = firebaseService.getDocument("products", id);
            if (product != null) {
                return ResponseEntity.ok(product);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Crear un nuevo producto
    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody Map<String, Object> product) {
        try {
            // Validaciones básicas
            if (!validateProduct(product)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datos de producto inválidos");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            String timestamp = firebaseService.saveProduct(product);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("timestamp", timestamp);
            response.put("productId", product.get("id"));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Actualizar un producto existente
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        try {
            // Validaciones básicas
            if (!validateUpdates(updates)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datos de actualización inválidos");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Asegurarse de que el ID no cambie
            updates.put("id", id);
            
            String timestamp = firebaseService.updateProduct(id, updates);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("timestamp", timestamp);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Eliminar un producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable String id) {
        try {
            firebaseService.deleteProduct(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Producto eliminado correctamente");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Método para validar datos de producto
    private boolean validateProduct(Map<String, Object> product) {
        // Verificar que los campos obligatorios estén presentes y sean válidos
        if (product.get("name") == null || product.get("name").toString().trim().isEmpty()) {
            return false;
        }
        
        if (product.get("category") == null || product.get("category").toString().trim().isEmpty()) {
            return false;
        }
        
        // Validar que el precio sea positivo
        Object priceObj = product.get("price");
        if (priceObj == null) {
            return false;
        }
        double price;
        try {
            if (priceObj instanceof Number) {
                price = ((Number) priceObj).doubleValue();
            } else {
                price = Double.parseDouble(priceObj.toString());
            }
            if (price < 0) return false;
        } catch (NumberFormatException e) {
            return false;
        }
        
        // Validar que el stock sea positivo
        Object stockObj = product.get("stock");
        if (stockObj == null) {
            return false;
        }
        int stock;
        try {
            if (stockObj instanceof Number) {
                stock = ((Number) stockObj).intValue();
            } else {
                stock = Integer.parseInt(stockObj.toString());
            }
            if (stock < 0) return false;
        } catch (NumberFormatException e) {
            return false;
        }
        
        return true;
    }
    
    // Método para validar actualizaciones
    private boolean validateUpdates(Map<String, Object> updates) {
        // Si hay algún campo para actualizar, validarlo
        if (updates.containsKey("name") && (updates.get("name") == null || updates.get("name").toString().trim().isEmpty())) {
            return false;
        }
        
        if (updates.containsKey("category") && (updates.get("category") == null || updates.get("category").toString().trim().isEmpty())) {
            return false;
        }
        
        // Validar precio si está presente
        if (updates.containsKey("price")) {
            Object priceObj = updates.get("price");
            if (priceObj == null) {
                return false;
            }
            double price;
            try {
                if (priceObj instanceof Number) {
                    price = ((Number) priceObj).doubleValue();
                } else {
                    price = Double.parseDouble(priceObj.toString());
                }
                if (price < 0) return false;
            } catch (NumberFormatException e) {
                return false;
            }
        }
        
        // Validar stock si está presente
        if (updates.containsKey("stock")) {
            Object stockObj = updates.get("stock");
            if (stockObj == null) {
                return false;
            }
            int stock;
            try {
                if (stockObj instanceof Number) {
                    stock = ((Number) stockObj).intValue();
                } else {
                    stock = Integer.parseInt(stockObj.toString());
                }
                if (stock < 0) return false;
            } catch (NumberFormatException e) {
                return false;
            }
        }
        
        return true;
    }
}
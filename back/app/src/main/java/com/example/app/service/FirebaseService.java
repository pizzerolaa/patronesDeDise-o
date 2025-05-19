package com.example.app.service;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.List;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;

import org.springframework.stereotype.Service;

@Service
public class FirebaseService {

    private static final String COLLECTION_PRODUCTS = "products";

    private Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    // Guardar un documento en una colección
    public String saveDocument(String collection, String id, Object data) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> future;
        
        if (id != null) {
            future = getFirestore().collection(collection).document(id).set(data);
        } else {
            future = getFirestore().collection(collection).document().set(data);
        }
        
        return future.get().getUpdateTime().toString();
    }

    // Obtener un documento por su ID
    public Map<String, Object> getDocument(String collection, String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getFirestore().collection(collection).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        
        if (document.exists()) {
            return document.getData();
        } else {
            return null;
        }
    }

    // Métodos para gestión de productos
    
    // Guardar un producto
    public String saveProduct(Map<String, Object> product) throws ExecutionException, InterruptedException {
        String id = (String) product.get("id");
        if (id == null || id.isEmpty()) {
            // Generar ID aleatorio si no existe
            id = getFirestore().collection(COLLECTION_PRODUCTS).document().getId();
            product.put("id", id);
        }
        
        WriteResult result = getFirestore().collection(COLLECTION_PRODUCTS).document(id).set(product).get();
        return result.getUpdateTime().toString();
    }
    
    // Obtener todos los productos
    public List<Map<String, Object>> getAllProducts() throws ExecutionException, InterruptedException {
        List<Map<String, Object>> products = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = getFirestore().collection(COLLECTION_PRODUCTS).get();
        
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (QueryDocumentSnapshot document : documents) {
            products.add(document.getData());
        }
        
        return products;
    }
    
    // Actualizar un producto
    public String updateProduct(String id, Map<String, Object> updates) throws ExecutionException, InterruptedException {
        WriteResult result = getFirestore().collection(COLLECTION_PRODUCTS).document(id).update(updates).get();
        return result.getUpdateTime().toString();
    }
    
    // Eliminar un producto
    public void deleteProduct(String id) throws ExecutionException, InterruptedException {
        getFirestore().collection(COLLECTION_PRODUCTS).document(id).delete().get();
    }
}
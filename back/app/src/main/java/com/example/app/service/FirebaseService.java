package com.example.app.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class FirebaseService {

    private Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    // Guardar un documento en una colección
    public String saveDocument(String collection, String id, Object data) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> future;
        
        if (id != null) {
            // Si hay un ID específico, usarlo
            future = getFirestore().collection(collection).document(id).set(data);
        } else {
            // Si no hay ID, dejar que Firestore genere uno
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
}
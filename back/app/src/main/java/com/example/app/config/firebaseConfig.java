package com.example.app.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Configuration
public class firebaseConfig {
    
    private static final String FIREBASE_CONFIG_PATH = "clase10-a080a-firebase-adminsdk-fbsvc-f9a9e93de4.json";
    
    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                ClassPathResource resource = new ClassPathResource(FIREBASE_CONFIG_PATH);
                
                FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
                    .build();
                
                FirebaseApp.initializeApp(options);
                
                System.out.println("Conexión con Firebase inicializada exitosamente");
            } else {
                System.out.println("Firebase ya está inicializado");
            }
        } catch (IOException e) {
            System.err.println("Error al inicializar Firebase: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            ClassPathResource resource = new ClassPathResource(FIREBASE_CONFIG_PATH);
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
                .build();
            return FirebaseApp.initializeApp(options);
        }
        return FirebaseApp.getInstance();
    }
}
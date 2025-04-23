package tn.esprit.exception;

public class ResourceNotFoundException extends RuntimeException {

    // Constructeur pour passer un message d'erreur
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

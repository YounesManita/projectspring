package tn.esprit.requests;

public record AuthenticationRequest(
        String email,

        String password
) {

}

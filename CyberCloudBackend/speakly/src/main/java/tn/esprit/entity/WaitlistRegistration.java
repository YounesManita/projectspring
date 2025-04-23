package tn.esprit.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.catalina.User;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WaitlistRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private String email;
    private LocalDateTime registrationDate;
    private boolean notified = false;
    @ManyToOne
    @JoinColumn(name = "activity_id")
    @JsonBackReference
    private Activity activity; // Retirer CascadeType.ALL

}

package tn.esprit.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityReservationId;

    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private int numberOfSeats;
    private Date reservationDate;

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    @JsonBackReference
    private Activity activity; // Retirer CascadeType.ALL
}

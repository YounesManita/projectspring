package tn.esprit.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityId;

    private String name; // ✅ Ajout du champ "name"
    private String details;
    private String location;
    private int availableSeats;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;

    @Column(name = "image_path")
    private String imagePath;

    private double price;
    @OneToMany(mappedBy = "activity", cascade = CascadeType.REMOVE)
    private List<WaitlistRegistration> waitlistRegistrations;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Sérialise la relation, mais évite la récursion
    private List<ActivityReservation> reservations;
}

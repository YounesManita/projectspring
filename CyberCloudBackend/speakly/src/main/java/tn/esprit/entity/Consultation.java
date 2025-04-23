package tn.esprit.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String details;
    private String description;
    private LocalTime actualDuration;

    @JsonBackReference("appointment-consultations")
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    // Constructeurs
    public Consultation() {}

    public Consultation(String details, String description, LocalTime actualDuration, Appointment appointment) {
        this.details = details;
        this.description = description;
        this.actualDuration = actualDuration;
        this.appointment = appointment;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalTime getActualDuration() { return actualDuration; }
    public void setActualDuration(LocalTime actualDuration) { this.actualDuration = actualDuration; }

    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
}

package tn.esprit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entity.Appointment;
import tn.esprit.entity.Consultation;
import tn.esprit.service.AppointmentService;
import tn.esprit.service.ConsultationService;

import java.util.List;

@RestController
@RequestMapping("/consultations")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    @Autowired
    private AppointmentService appointmentService;

    // ✅ Ajouter une consultation avec association à un rendez-vous
    @PostMapping
    public ResponseEntity<Consultation> addConsultation(@RequestBody Consultation consultation) {
        if (consultation.getAppointment() != null && consultation.getAppointment().getId() != null) {
            Appointment appointment = appointmentService.getAppointmentById(consultation.getAppointment().getId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            consultation.setAppointment(appointment);
        }

        Consultation createdConsultation = consultationService.addConsultation(consultation);
        return new ResponseEntity<>(createdConsultation, HttpStatus.CREATED); // Assurer que l'objet créé est bien renvoyé avec le statut 201
    }


    // ✅ Récupérer toutes les consultations
    @GetMapping
    public List<Consultation> getAllConsultations() {
        return consultationService.getAllConsultations();
    }


    // ✅ Récupérer une consultation par ID
    @GetMapping("/{id}")
    public Consultation getConsultationById(@PathVariable Long id) {
        return consultationService.getConsultationById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
    }

    // ✅ Mettre à jour une consultation
    @PutMapping("/{id}")
    public Consultation updateConsultation(@PathVariable Long id, @RequestBody Consultation newConsultation) {
        return consultationService.updateConsultation(id, newConsultation);
    }

    // ✅ Supprimer une consultation
    @DeleteMapping("/{id}")
    public void deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
    }
}

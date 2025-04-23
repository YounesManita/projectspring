package tn.esprit.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import tn.esprit.entity.Activity;
import tn.esprit.entity.ActivityReservation;
import tn.esprit.exception.ResourceNotFoundException;
import tn.esprit.service.ActivityReservationServiceImpl;
import tn.esprit.service.IActivityReservationService;
import org.springframework.web.bind.annotation.*;
import tn.esprit.service.IActivityService;
import tn.esprit.service.EmailService;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.hibernate.query.sqm.tree.SqmNode.log;

@RestController
@RequestMapping("/reservations")
public class ActivityReservationController {

    private final IActivityReservationService reservationService;
    private final IActivityService activityService;
    private final EmailService emailService;
    private static final Logger logger = LoggerFactory.getLogger(ActivityReservationServiceImpl.class);
    public ActivityReservationController(IActivityReservationService reservationService,
                                         IActivityService activityService , EmailService emailService) {
        this.reservationService = reservationService;
        this.activityService = activityService;
        this.emailService = emailService;
    }

    @PostMapping("/activity/{activityId}/create")
    public ResponseEntity<?> createReservation(
            @PathVariable Long activityId,
            @Valid @RequestBody ActivityReservation reservation) {

        try {
            logger.info("Attempting to create reservation for activity {}", activityId);
            Activity activity = activityService.getActivityById(activityId)
                    .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

            reservation.setActivity(activity);
            reservation.setReservationDate(new Date());

            ActivityReservation createdReservation = reservationService.createReservation(reservation);
            logger.info("Successfully created reservation {}", createdReservation.getActivityReservationId());
            return ResponseEntity.ok(createdReservation);

        } catch (Exception e) {
            logger.error("Failed to create reservation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Failed to create reservation",
                            "message", e.getMessage(),
                            "timestamp", Instant.now()
                    ));
        }
    }

    @GetMapping("/{id}")
    public Optional<ActivityReservation> getReservationById(@PathVariable Long id) {
        return reservationService.getReservationById(id);
    }
    @PostMapping("/sendReminder/{reservationId}")
    public ResponseEntity<?> sendManualReminder(@PathVariable Long reservationId) {
        Optional<ActivityReservation> optionalReservation = reservationService.getReservationById(reservationId);
        if (optionalReservation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Reservation not found with ID: " + reservationId);
        }

        ActivityReservation reservation = optionalReservation.get();
        LocalDate activityDate = reservation.getActivity().getDate();

        String subject = "📅 Rappel de votre activité";
        String body = String.format(
                "Bonjour %s,\n\nCeci est un rappel manuel pour votre activité prévue le %s.\n\nÀ bientôt !",
                reservation.getFullName(),
                activityDate.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        );

        emailService.sendSimpleEmail(reservation.getEmail(), subject, body);

        return ResponseEntity.ok("Email de rappel envoyé à " + reservation.getEmail());
    }


    @GetMapping
    public List<ActivityReservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @PutMapping("/{id}")
    public ActivityReservation updateReservation(@PathVariable Long id,
                                                 @Valid @RequestBody ActivityReservation updatedReservation) {
        Optional<ActivityReservation> existingReservation = reservationService.getReservationById(id);
        if (!existingReservation.isPresent()) {
            throw new ResourceNotFoundException("Reservation not found with ID: " + id);
        }

        ActivityReservation reservation = existingReservation.get();
        reservation.setFullName(updatedReservation.getFullName());
        reservation.setEmail(updatedReservation.getEmail());
        reservation.setPhoneNumber(updatedReservation.getPhoneNumber());
        reservation.setNumberOfSeats(updatedReservation.getNumberOfSeats());

        return reservationService.updateReservation(reservation);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }
}
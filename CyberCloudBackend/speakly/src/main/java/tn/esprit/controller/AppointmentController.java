package tn.esprit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entity.Appointment;
import tn.esprit.repository.AppointmentRepository;
import tn.esprit.service.AppointmentService;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return appointmentService.createAppointment(appointment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment newAppointment) {
        Appointment updatedAppointment = appointmentService.updateAppointment(id, newAppointment);
        return updatedAppointment != null ? ResponseEntity.ok(updatedAppointment) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/calendar")
    public List<Map<String, Object>> getCalendarEvents() {
        List<Appointment> appointments = appointmentService.getAllAppointments();

        return appointments.stream()
            .filter(app -> app.getDate() != null && app.getStartTime() != null && app.getEndTime() != null)
            .map(app -> {
                Map<String, Object> event = new HashMap<>();

                String title = (app.getUserId() != null)
                    ? "Rendez-vous utilisateur " + app.getUserId()
                    : "Rendez-vous utilisateur inconnu";
                event.put("title", title);

                event.put("start", app.getDate().atTime(app.getStartTime()).toString());
                event.put("end", app.getDate().atTime(app.getEndTime()).toString());

                return event;
            }).collect(Collectors.toList());
    }

    @GetMapping("/available")
    public List<Map<String, Object>> getAvailableSlots(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Appointment> appointments = appointmentRepository.findByDate(date);
        List<LocalTime> takenSlots = appointments.stream()
            .filter(a -> !a.isAvailable())
            .flatMap(a -> Stream.of(a.getStartTime()))
            .toList();

        List<Map<String, Object>> availableSlots = new ArrayList<>();
        for (int hour = 9; hour <= 16; hour++) {
            LocalTime slot = LocalTime.of(hour, 0);
            if (!takenSlots.contains(slot)) {
                Map<String, Object> slotMap = new HashMap<>();
                slotMap.put("start", slot.toString());
                slotMap.put("end", slot.plusHours(1).toString());
                availableSlots.add(slotMap);
            }
        }
        return availableSlots;
    }

    //  @GetMapping("/available-appointments")
    //public List<Appointment> getAvailableAppointments() {
    //  return appointmentService.getAllAppointments()
    //        .stream()
    //      .filter(Appointment::isAvailable)
    //    .collect(Collectors.toList());
    //}
    @GetMapping("/available-slots/{date}")
    public List<Map<String, String>> getAvailableSlots(@PathVariable String date) {
        // Exemple simple pour retourner les créneaux disponibles
        List<Map<String, String>> availableSlots = new ArrayList<>();

        // Exemple de créneaux fixes pour 9h à 17h
        availableSlots.add(Map.of("start", "09:00", "end", "12:00"));
        availableSlots.add(Map.of("start", "12:00", "end", "15:00"));
        availableSlots.add(Map.of("start", "15:00", "end", "17:00"));

        // Retourne la liste des créneaux disponibles
        return availableSlots;
    }


}


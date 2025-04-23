package tn.esprit.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.entity.Appointment;
import tn.esprit.repository.AppointmentRepository;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment createAppointment(Appointment appointment) {
        if (!isAppointmentValid(appointment)) {
            throw new IllegalArgumentException("Rendez-vous invalide (horaire, chevauchement ou jour non autorisé).");
        }
        return appointmentRepository.save(appointment);
    }



    public Appointment updateAppointment(Long id, Appointment newAppointment) {
        return appointmentRepository.findById(id).map(appointment -> {
            appointment.setDate(newAppointment.getDate());
            appointment.setStartTime(newAppointment.getStartTime());
            appointment.setEndTime(newAppointment.getEndTime());
            appointment.setUserId(newAppointment.getUserId());
            appointment.setAvailable(newAppointment.isAvailable());
            return appointmentRepository.save(appointment);
        }).orElse(null);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public boolean isAppointmentValid(Appointment newAppointment) {
        // 1. Vérifier si c'est samedi ou dimanche
        DayOfWeek day = newAppointment.getDate().getDayOfWeek();
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            return false;
        }

        // 2. Vérifier que le créneau est entre 9h et 17h
        LocalTime start = newAppointment.getStartTime();
        LocalTime end = newAppointment.getEndTime();
        if (start.isBefore(LocalTime.of(9, 0)) || end.isAfter(LocalTime.of(17, 0))) {
            return false;
        }

        // 3. Vérifier la durée maximale
        Duration duration = Duration.between(start, end);
        if (duration.toHours() > 3) {
            return false;
        }

        // 4. Vérifier s’il y a un conflit avec un autre rendez-vous
        List<Appointment> sameDayAppointments = appointmentRepository.findByDate(newAppointment.getDate());
        for (Appointment existing : sameDayAppointments) {
            if (
                    (start.isBefore(existing.getEndTime()) && end.isAfter(existing.getStartTime()))
            ) {
                return false; // chevauchement
            }
        }

        return true;
    }


}


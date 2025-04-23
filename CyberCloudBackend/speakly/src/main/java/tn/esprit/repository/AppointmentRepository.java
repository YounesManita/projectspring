package tn.esprit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.entity.Appointment;

import java.time.LocalDate;
import java.util.List;


public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDate(LocalDate date);
}

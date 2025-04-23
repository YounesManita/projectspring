package tn.esprit.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tn.esprit.entity.Consultation;

import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    @Query("SELECT c FROM Consultation c JOIN FETCH c.appointment")
    List<Consultation> findAllWithAppointments();
}

package tn.esprit.repository;

import tn.esprit.entity.ActivityReservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityReservationRepository extends JpaRepository<ActivityReservation, Long> {
    List<ActivityReservation> findByUserId(Long userId);
}

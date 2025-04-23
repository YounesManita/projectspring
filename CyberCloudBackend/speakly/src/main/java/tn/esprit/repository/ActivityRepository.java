package tn.esprit.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    @Query("SELECT a FROM Activity a WHERE a.date = :date")
    List<Activity> findByDate(@Param("date") LocalDate date);
    @Query("SELECT a FROM Activity a WHERE a.date < :date")
    List<Activity> findByDateBefore(@Param("date") LocalDate date);

    @Query("SELECT a FROM Activity a WHERE a.date >= :date ORDER BY a.date ASC")
    List<Activity> findByDateGreaterThanEqual(@Param("date") LocalDate date);
    @Query("SELECT a FROM Activity a WHERE a.availableSeats > 0")
    List<Activity> findActivitiesWithAvailableSeats();
}

package tn.esprit.service;

import tn.esprit.entity.Activity;
import tn.esprit.entity.ActivityReservation;
import java.util.List;
import java.util.Optional;

public interface IActivityReservationService {
    ActivityReservation createReservation(ActivityReservation reservation);
    Optional<ActivityReservation> getReservationById(Long id);
    List<ActivityReservation> getAllReservations();
    void deleteReservation(Long id);

    ActivityReservation updateReservation(ActivityReservation reservation);

    Activity updateAvailableSeats(Long activityId, int seatsToRemove);

}

package tn.esprit.service;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tn.esprit.entity.Activity;
import tn.esprit.entity.ActivityReservation;
import tn.esprit.exception.ResourceNotFoundException;
import tn.esprit.repository.ActivityRepository;
import tn.esprit.repository.ActivityReservationRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ActivityReservationServiceImpl implements IActivityReservationService {
    private static final Logger logger = LoggerFactory.getLogger(ActivityReservationServiceImpl.class);

    private final ActivityReservationRepository reservationRepository;
    private final ActivityRepository activityRepository;
    public ActivityReservationServiceImpl(
            ActivityReservationRepository reservationRepository,
            ActivityRepository activityRepository) {
        this.reservationRepository = reservationRepository;
        this.activityRepository = activityRepository;
    }

    @Override
    public ActivityReservation createReservation(ActivityReservation reservation) {
        try {
            logger.debug("Creating reservation: {}", reservation);

            Activity activity = activityRepository.findById(reservation.getActivity().getActivityId())
                    .orElseThrow(() -> {
                        logger.error("Activity not found: {}", reservation.getActivity().getActivityId());
                        return new ResourceNotFoundException("Activity not found");
                    });

            if (reservation.getNumberOfSeats() > activity.getAvailableSeats()) {
                logger.warn("Not enough seats available. Requested: {}, Available: {}",
                        reservation.getNumberOfSeats(), activity.getAvailableSeats());
                throw new IllegalArgumentException("Not enough available seats");
            }

            activity.setAvailableSeats(activity.getAvailableSeats() - reservation.getNumberOfSeats());
            activityRepository.save(activity);
            logger.debug("Updated activity seats: {}", activity);

            ActivityReservation savedReservation = reservationRepository.save(reservation);
            logger.info("Successfully created reservation {}", savedReservation.getActivityReservationId());
            return savedReservation;

        } catch (Exception e) {
            logger.error("Error creating reservation", e);
            throw e; // Re-throw to trigger transaction rollback
        }
    }


    @Override
    public Optional<ActivityReservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    @Override
    public List<ActivityReservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    @Override
    public ActivityReservation updateReservation(ActivityReservation reservation) {
        return reservationRepository.save(reservation);

    }
    @Override
    public Activity updateAvailableSeats(Long activityId, int seatsToRemove) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + activityId));

        if (seatsToRemove > activity.getAvailableSeats()) {
            throw new IllegalArgumentException("Not enough available seats");
        }

        activity.setAvailableSeats(activity.getAvailableSeats() - seatsToRemove);
        return activityRepository.save(activity);
    }

}

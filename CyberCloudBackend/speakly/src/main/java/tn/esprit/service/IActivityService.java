package tn.esprit.service;

import tn.esprit.entity.Activity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IActivityService {
    Activity createActivity(Activity activity);
    Optional<Activity> getActivityById(Long id);
    List<Activity> getAllActivities();
    Activity updateActivity(Long id, Activity updatedActivity);
    void deleteActivity(Long id);
    boolean existsById(Long id);

    Activity updateAvailableSeats(Long id, int seats);

    List<Activity> findByDate(LocalDate today);
    List<Activity> recommanderActivitesSelonJour();

    void supprimerActivitesPassees();

    void notifyWaitlist(Long activityId);
    void addToWaitlist(Long id, String email);
}

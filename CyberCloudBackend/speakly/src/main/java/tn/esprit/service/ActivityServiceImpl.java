package tn.esprit.service;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import tn.esprit.entity.Activity;
import tn.esprit.entity.WaitlistRegistration;
import tn.esprit.exception.ResourceNotFoundException;
import tn.esprit.repository.ActivityRepository;
import org.springframework.stereotype.Service;
import tn.esprit.repository.WaitlistRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@Transactional
public class ActivityServiceImpl implements IActivityService {


    private final ActivityRepository activityRepository;
    private final WaitlistRepository waitlistRepository;
    private final WaitlistService waitlistService;

@Autowired
    private EmailService emailService;
    private static final Logger logger = LoggerFactory.getLogger(ActivityServiceImpl.class);
    @Autowired
    public ActivityServiceImpl(ActivityRepository activityRepository, WaitlistRepository waitlistRepository, WaitlistService waitlistService, EmailService emailService) {
        this.activityRepository = activityRepository;
        this.waitlistRepository = waitlistRepository;
        this.waitlistService = waitlistService;
        this.emailService = emailService;
    }

    @Override
    public Activity createActivity(Activity activity) {
        return activityRepository.save(activity);
    }

    @Override
    public Optional<Activity> getActivityById(Long id) {
        return activityRepository.findById(id);
    }

    @Override
    public List<Activity> getAllActivities() {
        return activityRepository.findByDateGreaterThanEqual(LocalDate.now());
    }

    @Override
    public Activity updateActivity(Long id, Activity updatedActivity) {
        return activityRepository.findById(id).map(activity -> {
            activity.setName(updatedActivity.getName());
            activity.setDetails(updatedActivity.getDetails());
            activity.setLocation(updatedActivity.getLocation());
            activity.setDate(updatedActivity.getDate());
            activity.setAvailableSeats(updatedActivity.getAvailableSeats());
            activity.setPrice(updatedActivity.getPrice());

            // Mise à jour de l'image uniquement si une nouvelle image est envoyée
            if (updatedActivity.getImagePath() != null && !updatedActivity.getImagePath().isEmpty()) {
                activity.setImagePath(updatedActivity.getImagePath());
            }

            return activityRepository.save(activity);
        }).orElseThrow(() -> new ResourceNotFoundException("Activity not found with ID: " + id));
    }

    @Override
    public Activity updateAvailableSeats(Long id, int seats) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        int oldSeats = activity.getAvailableSeats();
        activity.setAvailableSeats(seats); // Utilisez directement la nouvelle valeur

        Activity updatedActivity = activityRepository.save(activity);

        // Si des places sont ajoutées (état précédent = 0)
        if (oldSeats == 0 && seats > 0) {
            waitlistService.checkAndNotifyForActivity(id);
        }

        return updatedActivity;
    }

    @Override
    public List<Activity> findByDate(LocalDate date) {
        return activityRepository.findByDate(date);
    }

    @Override
    public void deleteActivity(Long id) {
        activityRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return activityRepository.existsById(id);
    }

    @Override
    public List<Activity> recommanderActivitesSelonJour() {
        // Get today's date
        LocalDate today = LocalDate.now();

        // Find activities happening today
        List<Activity> todayActivities = activityRepository.findByDate(today);

        // If no activities today, you could add fallback logic like:
        // - Get upcoming activities
        // - Get popular activities
        // - Get random activities

        return todayActivities;
    }
    @Scheduled(cron = "0 0 1 * * ?") // Exécution quotidienne à 1h du matin
    public void supprimerActivitesPassees() {
        LocalDate aujourdhui = LocalDate.now();
        List<Activity> activitesPassees = activityRepository.findByDateBefore(aujourdhui);

        if (!activitesPassees.isEmpty()) {
            activityRepository.deleteAll(activitesPassees);
            // Loguer le nombre d'activités supprimées
            logger.info("{} activités passées ont été supprimées.", activitesPassees.size());

        }
    }



    @Override
    public void addToWaitlist(Long activityId, String email) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        if (activity.getAvailableSeats() > 0) {
            throw new IllegalStateException("Activity has available seats");
        }

        WaitlistRegistration registration = new WaitlistRegistration();
        registration.setActivity(activity);
        registration.setEmail(email);
        registration.setRegistrationDate(LocalDateTime.now());

        waitlistRepository.save(registration);
    }

    @Scheduled(fixedRate = 60000) // Toutes les 5 minutes
    public void checkWaitlistAvailability() {
        List<Activity> activitiesWithNewSeats = activityRepository.findActivitiesWithAvailableSeats();

        activitiesWithNewSeats.forEach(activity -> {
            List<WaitlistRegistration> waitlist = waitlistRepository
                    .findByActivityAndNotifiedOrderByRegistrationDateAsc(activity, false);

            int seatsToAllocate = Math.min(activity.getAvailableSeats(), waitlist.size());

            if (seatsToAllocate > 0) {
                List<WaitlistRegistration> toNotify = waitlist.subList(0, seatsToAllocate);

                toNotify.forEach(registration -> {
                    notifyUser(registration);
                    registration.setNotified(true);
                });

                waitlistRepository.saveAll(toNotify);
                activity.setAvailableSeats(activity.getAvailableSeats() - seatsToAllocate);
                activityRepository.save(activity);
            }
        });
    }

    private void notifyUser(WaitlistRegistration registration) {
        Activity activity = registration.getActivity();
        String subject = "Place disponible pour " + activity.getName();
        String message = String.format(
                "Bonjour,\n\n" +
                        "Une place s'est libérée pour l'activité '%s'.\n\n" +
                        "Détails :\n" +
                        "- Date : %s\n" +
                        "- Lieu : %s\n" +
                        "- Prix : %.2f TND\n\n" +
                        "<a href='http://localhost:4200/activities/%d' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;'>" +
                        "Réserver maintenant</a>\n\n" +
                        "Ce lien expire dans 24 heures.\n\n" +
                        "Cordialement,\n" +
                        "L'équipe des activités",
                activity.getName(),
                activity.getDate().format(DateTimeFormatter.ofPattern("EEEE dd MMMM yyyy", Locale.FRENCH)),
                activity.getLocation(),
                activity.getPrice(),
                activity.getActivityId()
        );

        emailService.sendHtmlEmail(registration.getEmail(), subject, message);
    }

    @Override
    public void notifyWaitlist(Long activityId) {
        waitlistService.checkAndNotifyForActivity(activityId);
    }
}


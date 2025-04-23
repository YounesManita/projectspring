package tn.esprit.service;

import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import tn.esprit.entity.Activity;
import tn.esprit.entity.WaitlistRegistration;
import tn.esprit.exception.ResourceNotFoundException;
import tn.esprit.repository.WaitlistRepository;

import java.util.List;

// WaitlistService.java
@Service

public class WaitlistService {


    private final ActivityServiceImpl activityService;
   private final WaitlistRepository waitlistRepository;
   private final EmailService emailService;
    public WaitlistService(@Lazy ActivityServiceImpl activityService, WaitlistRepository waitlistRepository, EmailService emailService) {
        this.activityService = activityService;
        this.waitlistRepository = waitlistRepository;
        this.emailService = emailService;
    }
    @Transactional
    public void checkAndNotifyForActivity(Long activityId) {
        Activity activity = activityService.getActivityById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        if (activity.getAvailableSeats() > 0) {
            List<WaitlistRegistration> entries = waitlistRepository
                    .findByActivityAndNotifiedOrderByRegistrationDateAsc(activity, false);

            if (!entries.isEmpty()) {
                WaitlistRegistration firstEntry = entries.get(0);
                notifyUser(firstEntry);
                firstEntry.setNotified(true);
                waitlistRepository.save(firstEntry);
            }
        }
    }

    private void notifyUser(WaitlistRegistration registration) {
        String subject = "Place disponible pour " + registration.getActivity().getName();
        String message = String.format(
                "Bonjour,\n\nUne place s'est libérée pour l'activité '%s'.\n" +
                        "Vous avez 24h pour réserver avant que la place ne soit offerte au suivant.\n\n" +
                        "Cliquez ici pour réserver : http://localhost:4200/reservation/%d",
                registration.getActivity().getName(),
                registration.getActivity().getActivityId()
        );

        emailService.sendSimpleEmail(registration.getEmail(), subject, message);
    }
}
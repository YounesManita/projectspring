package tn.esprit.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.entity.Activity;
import tn.esprit.entity.WaitlistRegistration;
import tn.esprit.exception.ResourceNotFoundException;
import tn.esprit.repository.WaitlistRepository;
import tn.esprit.service.IActivityService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/activities")
public class ActivityController {

    private final IActivityService activityService;
    private final WaitlistRepository waitlistRepository; // final ajouté

    private final String uploadDir;


    public ActivityController(IActivityService activityService,WaitlistRepository waitlistRepository ) {
        this.activityService = activityService;
        this.waitlistRepository = waitlistRepository;
        this.uploadDir = System.getProperty("user.home") + "/uploads/";
        createUploadDirectory();
    }

    private void createUploadDirectory() {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<ResponseMessage> createActivity(
            @RequestParam("name") String name,
            @RequestParam("details") String details,
            @RequestParam("location") String location,
            @RequestParam("availableSeats") int availableSeats,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("price") double price,
            @RequestParam(value = "image", required = false) MultipartFile file) {

        try {
            String fileName = null;
            if (file != null && !file.isEmpty()) {
                fileName = saveUploadedFile(file);
            }

            Activity activity = new Activity();
            activity.setName(name);
            activity.setDetails(details);
            activity.setLocation(location);
            activity.setAvailableSeats(availableSeats);
            activity.setDate(date);
            activity.setPrice(price);
            activity.setImagePath(fileName); // Stocker uniquement le nom du fichier

            activityService.createActivity(activity);

            return ResponseEntity.ok(new ResponseMessage("Activité ajoutée avec succès !"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage("Erreur lors de l'ajout de l'activité"));
        }
    }

    private String saveUploadedFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        file.transferTo(filePath);
        return fileName;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Long id) {
        return activityService.getActivityById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with ID: " + id));
    }

    @GetMapping
    public List<Activity> getAllActivities() {
        return activityService.getAllActivities();
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Resource resource = new FileSystemResource(filePath);

            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .body(resource);
            }
        } catch (IOException e) {
            // Log the error
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseMessage> updateActivity(
            @PathVariable("id") Long id,
            @RequestParam("name") String name,
            @RequestParam("details") String details,
            @RequestParam("location") String location,
            @RequestParam("availableSeats") int availableSeats,
            @RequestParam("date") String date,
            @RequestParam("price") double price,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            Activity existingActivity = activityService.getActivityById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Activity not found with ID: " + id));

            existingActivity.setName(name);
            existingActivity.setDetails(details);
            existingActivity.setLocation(location);
            existingActivity.setAvailableSeats(availableSeats);
            existingActivity.setDate(LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            existingActivity.setPrice(price);

            if (image != null && !image.isEmpty()) {
                String fileName = saveUploadedFile(image);
                existingActivity.setImagePath(fileName);
            }

            activityService.updateActivity(id, existingActivity);
            return ResponseEntity.ok(new ResponseMessage("Activité mise à jour avec succès !"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage("Erreur lors de la mise à jour"));
        }
    }

    @PatchMapping("/{id}/seats")
    public ResponseEntity<Activity> updateSeats(
            @PathVariable Long id,
            @RequestParam int seats) {

        Activity updatedActivity = activityService.updateAvailableSeats(id, seats);

        // Vérification automatique de la waitlist
        if (seats > 0) {
            activityService.notifyWaitlist(id);
        }

        return ResponseEntity.ok(updatedActivity);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable("id") Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/today")
    public ResponseEntity<List<Activity>> getTodayActivities() {
        List<Activity> todayActivities = activityService.recommanderActivitesSelonJour();
        return ResponseEntity.ok(todayActivities);
    }
    @DeleteMapping("/cleanup")
    public ResponseEntity<Void> cleanupPastActivities() {
        activityService.supprimerActivitesPassees();
        return ResponseEntity.noContent().build();
    }
    // ActivityController.java
    @GetMapping("/{activityId}/waitlist/check")
    public ResponseEntity<Boolean> checkWaitlistStatus(
            @PathVariable Long activityId,
            @RequestParam String email) {

        Activity activity = activityService.getActivityById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        boolean exists = waitlistRepository.existsByActivityAndEmail(activity, email);
        return ResponseEntity.ok(exists);
    }
    // ActivityController.java
    @PostMapping("/{activityId}/waitlist")
    public ResponseEntity<?> joinWaitlist(
            @PathVariable Long activityId,
            @RequestBody Map<String, String> request) {

        String email = request.get("email");

        // Validation email
        if (email == null || !email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            return ResponseEntity.badRequest().body("Email invalide");
        }

        Activity activity = activityService.getActivityById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        if (activity.getAvailableSeats() > 0) {
            return ResponseEntity.badRequest().body("Des places sont encore disponibles");
        }

        if (waitlistRepository.existsByActivityAndEmail(activity, email)) {
            return ResponseEntity.badRequest().body("Email déjà inscrit");
        }

        WaitlistRegistration registration = new WaitlistRegistration();
        registration.setActivity(activity);
        registration.setEmail(email);
        registration.setRegistrationDate(LocalDateTime.now());

        waitlistRepository.save(registration);

        return ResponseEntity.ok().build();
    }
}
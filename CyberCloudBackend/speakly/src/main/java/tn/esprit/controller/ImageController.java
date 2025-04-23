package tn.esprit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.entity.Image;
import tn.esprit.service.IImageService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/images")
public class ImageController {

    @Autowired
    private IImageService imageService;

    /**
     * Télécharger une image pour un post de blog
     */
    @PostMapping("/upload")
    public ResponseEntity<Image> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("postId") Long postId,
            @RequestParam(value = "description", defaultValue = "") String description,
            @RequestParam(value = "orderIndex", defaultValue = "0") Integer orderIndex) {
        try {
            Image uploadedImage = imageService.uploadImage(postId, file, description, orderIndex);
            return new ResponseEntity<>(uploadedImage, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Télécharger plusieurs images pour un post de blog
     */
    @PostMapping("/upload-multiple")
    public ResponseEntity<List<Image>> uploadMultipleImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("postId") Long postId,
            @RequestParam(value = "descriptions", required = false) String[] descriptions,
            @RequestParam(value = "orderIndices", required = false) Integer[] orderIndices) {
        try {
            if (descriptions == null) descriptions = new String[0];
            if (orderIndices == null) orderIndices = new Integer[0];

            List<Image> uploadedImages = imageService.uploadMultipleImages(postId, files, descriptions, orderIndices);
            return new ResponseEntity<>(uploadedImages, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Récupérer toutes les images associées à un post
     */
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Image>> getImagesByPostId(@PathVariable Long postId) {
        List<Image> images = imageService.getImagesByPostId(postId);
        return new ResponseEntity<>(images, HttpStatus.OK);
    }

    /**
     * Récupérer une image par son ID
     */
    @GetMapping("/{imageId}")
    public ResponseEntity<Image> getImageById(@PathVariable Long imageId) {
        Image image = imageService.getImageById(imageId);
        return new ResponseEntity<>(image, HttpStatus.OK);
    }

    /**
     * Mettre à jour les métadonnées d'une image
     */
    @PutMapping("/{imageId}")
    public ResponseEntity<Image> updateImage(
            @PathVariable Long imageId,
            @RequestBody Map<String, Object> updates) {
        String description = (String) updates.getOrDefault("description", "");
        Integer orderIndex = (Integer) updates.getOrDefault("orderIndex", 0);

        Image updatedImage = imageService.updateImage(imageId, description, orderIndex);
        return new ResponseEntity<>(updatedImage, HttpStatus.OK);
    }

    /**
     * Supprimer une image
     */
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Supprimer toutes les images associées à un post
     */
    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> deleteImagesByPostId(@PathVariable Long postId) {
        imageService.deleteImagesByPostId(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

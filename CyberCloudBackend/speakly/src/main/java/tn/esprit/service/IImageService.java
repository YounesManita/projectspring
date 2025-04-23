package tn.esprit.service;

import org.springframework.web.multipart.MultipartFile;
import tn.esprit.entity.Image;

import java.io.IOException;
import java.util.List;

public interface IImageService {
    /**
     * Télécharger une image pour un post de blog
     * @param postId ID du post associé à l'image
     * @param file Fichier image à télécharger
     * @param description Description optionnelle de l'image
     * @param orderIndex Position de l'image dans le carrousel
     * @return L'image créée
     */
    Image uploadImage(Long postId, MultipartFile file, String description, Integer orderIndex) throws IOException;

    /**
     * Télécharger plusieurs images pour un post de blog
     * @param postId ID du post associé aux images
     * @param files Tableau de fichiers images
     * @param descriptions Tableau de descriptions
     * @param orderIndices Tableau de positions
     * @return Liste des images créées
     */
    List<Image> uploadMultipleImages(Long postId, MultipartFile[] files, String[] descriptions, Integer[] orderIndices) throws IOException;

    /**
     * Récupérer toutes les images associées à un post
     * @param postId ID du post
     * @return Liste des images
     */
    List<Image> getImagesByPostId(Long postId);

    /**
     * Récupérer une image par son ID
     * @param imageId ID de l'image
     * @return L'image
     */
    Image getImageById(Long imageId);

    /**
     * Mettre à jour les métadonnées d'une image
     * @param imageId ID de l'image
     * @param description Nouvelle description
     * @param orderIndex Nouvelle position dans le carrousel
     * @return L'image mise à jour
     */
    Image updateImage(Long imageId, String description, Integer orderIndex);

    /**
     * Supprimer une image
     * @param imageId ID de l'image à supprimer
     */
    void deleteImage(Long imageId);

    /**
     * Supprimer toutes les images associées à un post
     * @param postId ID du post
     */
    void deleteImagesByPostId(Long postId);
}
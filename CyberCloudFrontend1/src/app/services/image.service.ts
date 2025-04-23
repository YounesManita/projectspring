import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Image } from '../interfaces/BlogPost';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:8089/images';
  private baseUrl = 'http://localhost:8089';

  constructor(private http: HttpClient) {}

  /**
   * Télécharger une image pour un post de blog
   * @param postId ID du post associé à l'image
   * @param imageFile Fichier image à télécharger
   * @param description Description optionnelle de l'image
   * @param orderIndex Position de l'image dans le carrousel
   * @returns Observable contenant l'image créée
   */
  uploadImage(postId: number, imageFile: File, description: string = '', orderIndex: number = 0): Observable<Image> {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('postId', postId.toString());
    formData.append('description', description);
    formData.append('orderIndex', orderIndex.toString());
    
    return this.http.post<Image>(`${this.apiUrl}/upload`, formData).pipe(
      map(image => this.fixImageUrl(image))
    );
  }

  /**
   * Télécharger plusieurs images pour un post de blog
   * @param postId ID du post associé aux images
   * @param images Tableau d'objets contenant le fichier et les métadonnées
   * @returns Observable contenant un tableau des images créées
   */
  uploadMultipleImages(postId: number, images: {file: File, description: string, orderIndex: number}[]): Observable<Image[]> {
    const formData = new FormData();
    formData.append('postId', postId.toString());
    
    images.forEach((image, index) => {
      formData.append('files', image.file);
      formData.append(`descriptions[${index}]`, image.description);
      formData.append(`orderIndices[${index}]`, image.orderIndex.toString());
    });
    
    return this.http.post<Image[]>(`${this.apiUrl}/upload-multiple`, formData).pipe(
      map(imageArray => imageArray.map(image => this.fixImageUrl(image)))
    );
  }

  /**
   * Récupérer toutes les images associées à un post
   * @param postId ID du post
   * @returns Observable contenant un tableau d'images
   */
  getImagesByPostId(postId: number): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.apiUrl}/post/${postId}`).pipe(
      map(images => images.map(image => this.fixImageUrl(image)))
    );
  }

  /**
   * Récupérer une image par son ID
   * @param imageId ID de l'image
   * @returns Observable contenant l'image
   */
  getImageById(imageId: number): Observable<Image> {
    return this.http.get<Image>(`${this.apiUrl}/${imageId}`).pipe(
      map(image => this.fixImageUrl(image))
    );
  }

  /**
   * Mettre à jour les métadonnées d'une image
   * @param imageId ID de l'image
   * @param description Nouvelle description
   * @param orderIndex Nouvelle position dans le carrousel
   * @returns Observable contenant l'image mise à jour
   */
  updateImage(imageId: number, description: string, orderIndex: number): Observable<Image> {
    return this.http.put<Image>(`${this.apiUrl}/${imageId}`, { description, orderIndex }).pipe(
      map(image => this.fixImageUrl(image))
    );
  }

  /**
   * Supprimer une image
   * @param imageId ID de l'image à supprimer
   * @returns Observable vide
   */
  deleteImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${imageId}`);
  }

  /**
   * Supprimer toutes les images associées à un post
   * @param postId ID du post
   * @returns Observable vide
   */
  deleteImagesByPostId(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/post/${postId}`);
  }

  /**
   * Corrige l'URL de l'image en ajoutant le baseUrl si nécessaire
   * @param image L'objet image à corriger
   * @returns L'objet image avec l'URL corrigée
   */
  private fixImageUrl(image: Image): Image {
    if (image && image.url) {
      // Si l'URL est relative (commence par /), ajouter le baseUrl
      if (image.url.startsWith('/')) {
        image.url = `${this.baseUrl}${image.url}`;
      }
      // Correction pour les URLs qui pointent vers /uploads/images/
      else if (image.url.includes('/uploads/images/')) {
        // Remplacer le chemin par l'URL complète du serveur backend
        image.url = `${this.baseUrl}${image.url.substring(image.url.indexOf('/uploads/images/'))}`;
      }
      // Correction pour les URLs qui pointent vers localhost:4200
      else if (image.url.includes('localhost:4200')) {
        // Remplacer localhost:4200 par localhost:8080
        image.url = image.url.replace('localhost:4200', 'localhost:8080');
      }
    }
    return image;
  }
}
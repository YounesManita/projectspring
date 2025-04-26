import { Injectable } from '@angular/core';
import { BlogPost, BlogComment, Reaction, Image } from '../interfaces/BlogPost';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BadWordsFilterService } from './bad-words-filter.service';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class BlogpostService {
  private apiUrl = 'http://localhost:8089/blogposts';

  constructor(
    private http: HttpClient,
    private badWordsFilter: BadWordsFilterService,
    private imageService: ImageService
  ) {}
  id_user=localStorage.getItem('user_id');
  getAllPosts(): Observable<BlogPost[]> {
   const  token = localStorage.getItem('access_token');

   const  headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
    return this.http.get<BlogPost[]>(`${this.apiUrl}/all`, { headers });
  }

  getPostById(id: number): Observable<BlogPost> {
    const  token = localStorage.getItem('access_token');

   const  headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
    return this.http.get<BlogPost>(`${this.apiUrl}/get/${this.id_user}`, { headers });
  }

  createPost(post: BlogPost): Observable<BlogPost> {
    // Vérifier si le contenu contient des mots inappropriés
    if (!this.badWordsFilter.validateContent(post.title) || !this.badWordsFilter.validateContent(post.content)) {
      // Retourner un Observable qui émet une erreur
      return new Observable(observer => {
        observer.error(new Error('Contenu inapproprié détecté'));
      });
    }
    
    // Extraire les images du post pour les traiter séparément
    const imagesToUpload = post.images || [];
    const postWithoutImages = { ...post };
    delete postWithoutImages.images;
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
    // Créer d'abord le post sans les images
    return this.http.post<BlogPost>(`${this.apiUrl}/add/${this.id_user}`, postWithoutImages,{ headers }).pipe(
      switchMap(createdPost => {
        // Si aucune image à télécharger, retourner simplement le post créé
        if (imagesToUpload.length === 0) {
          return new Observable<BlogPost>(observer => observer.next(createdPost));
        }
        
        // Préparer les images pour le téléchargement
        const imageUploads = imagesToUpload.map((image: any, index: number) => {
          // Si l'image est déjà un objet File, l'utiliser directement
          if (image.file instanceof File) {
            return this.imageService.uploadImage(
              createdPost.postId,
              image.file,
              image.description || '',
              index
            );
          } else if (image.url && image.url.startsWith('data:')) {
            // Convertir les data URLs en fichiers
            const byteString = atob(image.url.split(',')[1]);
            const mimeString = image.url.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const file = new File([blob], `image-${index}.${mimeString.split('/')[1]}`, { type: mimeString });
            
            return this.imageService.uploadImage(
              createdPost.postId,
              file,
              image.description || '',
              index
            );
          }
          // Si l'image est déjà stockée (URL externe), la sauter
          return new Observable<Image>(observer => observer.next(image as Image));
        });
        
        // Télécharger toutes les images et récupérer le post mis à jour
        return forkJoin(imageUploads).pipe(
          map(uploadedImages => {
            createdPost.images = uploadedImages;
            return createdPost;
          })
        );
      })
    );
  }

  updatePost(id: number, post: BlogPost): Observable<BlogPost> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
    // Vérifier si le contenu contient des mots inappropriés
    if (!this.badWordsFilter.validateContent(post.title) || !this.badWordsFilter.validateContent(post.content)) {
      // Retourner un Observable qui émet une erreur
      return new Observable(observer => {
        observer.error(new Error('Contenu inapproprié détecté'));
      });
    }
    
    // Extraire les images du post pour les traiter séparément
    const imagesToUpload = post.images || [];
    const postWithoutImages = { ...post };
    delete postWithoutImages.images;
    
    // Mettre à jour d'abord le post sans les images
    return this.http.put<BlogPost>(`${this.apiUrl}/update/${id}`, postWithoutImages,{headers}).pipe(
      switchMap(updatedPost => {
        // Supprimer d'abord toutes les images existantes
        return this.imageService.deleteImagesByPostId(updatedPost.postId).pipe(
          switchMap(() => {
            // Si aucune nouvelle image à télécharger, retourner simplement le post mis à jour
            if (imagesToUpload.length === 0) {
              return new Observable<BlogPost>(observer => observer.next(updatedPost));
            }
            
            // Préparer les images pour le téléchargement
            const imageUploads = imagesToUpload.map((image: any, index: number) => {
              // Si l'image est déjà un objet File, l'utiliser directement
              if (image.file instanceof File) {
                return this.imageService.uploadImage(
                  updatedPost.postId,
                  image.file,
                  image.description || '',
                  index
                );
              } else if (image.url && image.url.startsWith('data:')) {
                // Convertir les data URLs en fichiers
                const byteString = atob(image.url.split(',')[1]);
                const mimeString = image.url.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                const file = new File([blob], `image-${index}.${mimeString.split('/')[1]}`, { type: mimeString });
                
                return this.imageService.uploadImage(
                  updatedPost.postId,
                  file,
                  image.description || '',
                  index
                );
              }
              // Si l'image est déjà stockée (URL externe), la sauter
              return new Observable<Image>(observer => observer.next(image as Image));
            });
            
            // Télécharger toutes les images et récupérer le post mis à jour
            return forkJoin(imageUploads).pipe(
              map(uploadedImages => {
                updatedPost.images = uploadedImages;
                return updatedPost;
              })
            );
          })
        );
      })
    );
  }

  deletePost(id: number): Observable<void> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
    // Supprimer d'abord toutes les images associées au post
    return this.imageService.deleteImagesByPostId(id).pipe(
      switchMap(() => {
        // Puis supprimer le post lui-même
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`,{headers});
      })
    );
  }
  
  getCommentsCount(postId: number): Observable<{count: number}> {
    return this.http.get<{count: number}>(`${this.apiUrl}/${postId}/comments/count`);
  }

  /**
   * Réagir à un post ou changer une réaction existante
   * @param postId ID du post
   * @param reaction Nouvelle réaction ou null pour supprimer la réaction
   * @returns Observable contenant le post mis à jour
   */
  reactToPost(postId: number, reaction: Reaction | null): Observable<BlogPost> {
    // Convertir l'enum en chaîne de caractères pour le backend
    const reactionValue = reaction ? reaction.toString() : null;
    return this.http.put<BlogPost>(`${this.apiUrl}/${postId}/reaction`, { reaction: reactionValue });
  }

  /**
   * Mettre à jour une réaction existante sur un post
   * @param postId ID du post
   * @param oldReaction Ancienne réaction
   * @param newReaction Nouvelle réaction ou null pour supprimer la réaction
   * @returns Observable contenant le post mis à jour
   */
  updateReaction(postId: number, oldReaction: Reaction, newReaction: Reaction | null): Observable<BlogPost> {
    // Convertir les enums en chaînes de caractères pour le backend
    const oldReactionValue = oldReaction ? oldReaction.toString() : null;
    const newReactionValue = newReaction ? newReaction.toString() : null;
    return this.http.put<BlogPost>(`${this.apiUrl}/${postId}/update-reaction`, { oldReaction: oldReactionValue, newReaction: newReactionValue });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/Comment';
import { BadWordsFilterService } from './bad-words-filter.service';

@Injectable({
    providedIn: 'root'
  })
  export class CommentService {
    private apiUrl = 'http://localhost:8089/blogcomments';
  
    constructor(
      private http: HttpClient,
      private badWordsFilter: BadWordsFilterService
    ) {}
    id_user=localStorage.getItem('user_id');
    
    createComment(postId: number, comment: Comment): Observable<Comment> {
         const  token = localStorage.getItem('access_token');
      
         const  headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
          
      // Vérifier si le contenu contient des mots inappropriés
      if (!this.badWordsFilter.validateContent(comment.content)) {
        // Retourner un Observable qui émet une erreur
        return new Observable(observer => {
          observer.error(new Error('Contenu inapproprié détecté'));
        });
      }
      
      const commentData = {
        ...comment,
        userId: comment.userId,
        userName: comment.userName
      };
      return this.http.post<Comment>(`${this.apiUrl}/add/${postId}/${this.id_user}`, commentData, { headers });
    }
  
    
    getAllComments(): Observable<Comment[]> {
      const  token = localStorage.getItem('access_token');
      
      const  headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
     });
       
      return this.http.get<Comment[]>(`${this.apiUrl}/all`, { headers });
    }
  
    // Récupérer un commentaire par son ID
    getCommentById(commentId: number): Observable<Comment> {
      const  token = localStorage.getItem('access_token');
      
      const  headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
     });
       
      return this.http.get<Comment>(`${this.apiUrl}/get/${commentId}`, { headers });
    }

    // Supprimer un commentaire
    deleteComment(commentId: number): Observable<void> {
      const  token = localStorage.getItem('access_token');
      
      const  headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
     });
       
      return this.http.delete<void>(`${this.apiUrl}/delete/${commentId}`, { headers });
    }
  
    // Mettre à jour un commentaire
    updateComment(commentId: number, comment: Comment): Observable<Comment> {
      const  token = localStorage.getItem('access_token');
      
      const  headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
     });
       
      // Vérifier si le contenu contient des mots inappropriés
      if (!this.badWordsFilter.validateContent(comment.content)) {
        // Retourner un Observable qui émet une erreur
        return new Observable(observer => {
          observer.error(new Error('Contenu inapproprié détecté'));
        });
      }
     
      return this.http.put<Comment>(`${this.apiUrl}/update/${commentId}`, comment, { headers });
    }
  
    
    getCommentsByPostId(postId: number): Observable<Comment[]> {
      const  token = localStorage.getItem('access_token');
      
      const  headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
     });
       
      return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`, { headers });
    }
  }
  
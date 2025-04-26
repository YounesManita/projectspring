import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogCommentResponse } from '../interfaces/BlogCommentResponse';
import { BadWordsFilterService } from './bad-words-filter.service';

@Injectable({
  providedIn: 'root'
})
export class BlogCommentResponseService {
  private apiUrl = 'http://localhost:8089/blogcommentresponses';

  constructor(
    private http: HttpClient,
    private badWordsFilter: BadWordsFilterService
  ) {}
  id_user=localStorage.getItem('user_id');



  // Créer une réponse à un commentaire
  createResponse(commentId: number, response: BlogCommentResponse): Observable<BlogCommentResponse> {
    // Vérifier si le contenu contient des mots inappropriés
    if (!this.badWordsFilter.validateContent(response.content)) {
      // Retourner un Observable qui émet une erreur
      return new Observable(observer => {
        observer.error(new Error('Contenu inapproprié détecté'));
      });
    }
    const  token = localStorage.getItem('access_token');

   const  headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
    
    const responseData = {
      ...response,
      userId: response.userId,
      userName: response.userName
    };
    return this.http.post<BlogCommentResponse>(`${this.apiUrl}/add/${commentId}/${this.id_user}`, responseData, { headers });
  }

  // Récupérer toutes les réponses
  getAllResponses(): Observable<BlogCommentResponse[]> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
     
    return this.http.get<BlogCommentResponse[]>(`${this.apiUrl}/all`, { headers });
  }

  // Récupérer une réponse par son ID
  getResponseById(id: number): Observable<BlogCommentResponse> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
     
    return this.http.get<BlogCommentResponse>(`${this.apiUrl}/get/${id}`, { headers });
  }

  // Mettre à jour une réponse
  updateResponse(id: number, response: BlogCommentResponse): Observable<BlogCommentResponse> {
    // Vérifier si le contenu contient des mots inappropriés
    if (!this.badWordsFilter.validateContent(response.content)) {
      // Retourner un Observable qui émet une erreur
      return new Observable(observer => {
        observer.error(new Error('Contenu inapproprié détecté'));
      });
    }
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
     
    return this.http.put<BlogCommentResponse>(`${this.apiUrl}/update/${id}`, response, { headers });
  }

  // Supprimer une réponse
  deleteResponse(id: number): Observable<void> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
     
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers });
  }

  // Récupérer les réponses par ID de commentaire
  getResponsesByCommentId(commentId: number): Observable<BlogCommentResponse[]> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
     
    return this.http.get<BlogCommentResponse[]>(`${this.apiUrl}/comment/${commentId}`,  { headers });
  }

  // Récupérer les réponses par ID d'utilisateur
  getResponsesByUserId(userId: number): Observable<BlogCommentResponse[]> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
     
    return this.http.get<BlogCommentResponse[]>(`${this.apiUrl}/user/${this.id_user}`,  { headers });
  }
}
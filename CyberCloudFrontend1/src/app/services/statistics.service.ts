import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = environment.apiUrl + '/statistics';

  constructor(private http: HttpClient) {}
  
  // Méthode pour formater les dates au format attendu par le backend (yyyy-MM-dd)
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Récupérer le nombre de posts par jour
  getPostsCountByDay(startDate?: Date, endDate?: Date): Observable<Map<string, number>> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('startDate', this.formatDate(startDate));
    }
    
    if (endDate) {
      params = params.set('endDate', this.formatDate(endDate));
    }
    
    return this.http.get<Map<string, number>>(`${this.apiUrl}/posts/daily`, { params });
  }

  // Récupérer le nombre de posts par mois
  getPostsCountByMonth(startDate?: Date, endDate?: Date): Observable<Map<string, number>> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('startDate', this.formatDate(startDate));
    }
    
    if (endDate) {
      params = params.set('endDate', this.formatDate(endDate));
    }
    
    return this.http.get<Map<string, number>>(`${this.apiUrl}/posts/monthly`, { params });
  }
  
  // Récupérer le nombre de posts par année
  getPostsCountByYear(startDate?: Date, endDate?: Date): Observable<Map<string, number>> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('startDate', this.formatDate(startDate));
    }
    
    if (endDate) {
      params = params.set('endDate', this.formatDate(endDate));
    }
    
    return this.http.get<Map<string, number>>(`${this.apiUrl}/posts/yearly`, { params });
  }

  // Récupérer le nombre de commentaires par jour
  getCommentsCountByDay(startDate?: Date, endDate?: Date): Observable<Map<string, number>> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('startDate', this.formatDate(startDate));
    }
    
    if (endDate) {
      params = params.set('endDate', this.formatDate(endDate));
    }
    
    return this.http.get<Map<string, number>>(`${this.apiUrl}/comments/daily`, { params });
  }

  // Récupérer le nombre de commentaires par mois
  getCommentsCountByMonth(startDate?: Date, endDate?: Date): Observable<Map<string, number>> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('startDate', this.formatDate(startDate));
    }
    
    if (endDate) {
      params = params.set('endDate', this.formatDate(endDate));
    }
    
    return this.http.get<Map<string, number>>(`${this.apiUrl}/comments/monthly`, { params });
  }
  
  // Récupérer le nombre de commentaires par année
  getCommentsCountByYear(startDate?: Date, endDate?: Date): Observable<Map<string, number>> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('startDate', this.formatDate(startDate));
    }
    
    if (endDate) {
      params = params.set('endDate', this.formatDate(endDate));
    }
    
    return this.http.get<Map<string, number>>(`${this.apiUrl}/comments/yearly`, { params });
  }

  // Récupérer la distribution des réactions
  getReactionsDistribution(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.apiUrl}/reactions/distribution`);
  }

  // Récupérer les posts les plus commentés
  getMostCommentedPosts(limit: number = 5): Observable<Map<number, number>> {
    return this.http.get<Map<number, number>>(`${this.apiUrl}/posts/most-commented?limit=${limit}`);
  }

  // Récupérer l'activité des utilisateurs
  getUsersActivity(limit: number = 10): Observable<Map<number, {posts: number, comments: number, total: number}>> {
    return this.http.get<Map<number, {posts: number, comments: number, total: number}>>(`${this.apiUrl}/users/activity?limit=${limit}`);
  }
}
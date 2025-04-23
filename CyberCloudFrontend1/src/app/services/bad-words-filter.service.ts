import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';

interface BadWordsLibrary {
  french: string[];
  english: string[];
  arabic: string[];
}

interface WebPurifyResponse {
  rsp: {
    found: string;
    expletive?: string | string[];
    error?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BadWordsFilterService {
  // Bibliothèque de mots inappropriés par langue (utilisée comme fallback)
  private badWordsLibrary: BadWordsLibrary = {
    french: [],
    english: [],
    arabic: []
  };
  // Liste combinée de tous les mots inappropriés
  private badWords: string[] = [];
  
  // Configuration WebPurify
  private webPurifyApiUrl = 'https://api1.webpurify.com/services/rest/';
  private webPurifyApiKey = environment.webPurifyApiKey;

  constructor(private http: HttpClient) {
    this.loadBadWordsLibrary(); // Charger la bibliothèque locale comme fallback
  }

  /**
   * Charge la bibliothèque de mots inappropriés depuis le fichier JSON
   */
  private loadBadWordsLibrary(): void {
    this.http.get<BadWordsLibrary>('assets/bad-words.json').subscribe({
      next: (data) => {
        this.badWordsLibrary = data;
        // Combiner tous les mots en une seule liste pour la vérification rapide
        this.badWords = [
          ...this.badWordsLibrary.french,
          ...this.badWordsLibrary.english,
          ...this.badWordsLibrary.arabic
        ];
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la bibliothèque de mots inappropriés:', error);
      }
    });
  }

  /**
   * Vérifie si le texte contient des mots inappropriés en utilisant l'API WebPurify
   * @param text Le texte à vérifier
   * @returns Un Observable avec un objet indiquant si le texte est valide et les mots inappropriés trouvés
   */
  checkContent(text: string): Observable<{ isValid: boolean, badWordsFound: string[] }> {
    if (!text) return of({ isValid: true, badWordsFound: [] });
    
    // Détecter la langue pour WebPurify
    const detectedLanguage = this.detectLanguage(text);
    const lang = this.mapLanguageToWebPurify(detectedLanguage);
    
    // Paramètres pour l'API WebPurify
    let params = new HttpParams()
      .set('api_key', this.webPurifyApiKey)
      .set('method', 'webpurify.live.check')
      .set('format', 'json')
      .set('text', text)
      .set('lang', lang)
      .set('semail', '1')
      .set('sphone', '1')
      .set('slink', '1')
      .set('rsp', '1'); // Pour obtenir les mots trouvés
    
    return this.http.get<WebPurifyResponse>(this.webPurifyApiUrl, { params }).pipe(
      map(response => {
        const found = parseInt(response.rsp.found, 10) > 0;
        const badWordsFound: string[] = [];
        
        // Si des mots inappropriés ont été trouvés et que la réponse contient les mots
        if (found && response.rsp.expletive) {
          if (Array.isArray(response.rsp.expletive)) {
            badWordsFound.push(...response.rsp.expletive);
          } else {
            badWordsFound.push(response.rsp.expletive as unknown as string);
          }
        }
        
        return {
          isValid: !found,
          badWordsFound
        };
      }),
      catchError(error => {
        console.error('Erreur lors de la vérification avec WebPurify:', error);
        // Fallback à la méthode locale en cas d'erreur
        return of(this.checkContentLocally(text));
      })
    );
  }
  
  /**
   * Méthode de fallback qui vérifie localement si le texte contient des mots inappropriés
   * @param text Le texte à vérifier
   * @returns Un objet indiquant si le texte est valide et les mots inappropriés trouvés
   */
  private checkContentLocally(text: string): { isValid: boolean, badWordsFound: string[] } {
    if (!text) return { isValid: true, badWordsFound: [] };
    
    const lowerText = text.toLowerCase();
    const foundBadWords: string[] = [];
    const detectedLanguage = this.detectLanguage(text);
    
    // Vérifier d'abord les mots de la langue détectée pour optimiser
    const primaryWordList = this.badWordsLibrary[detectedLanguage as keyof BadWordsLibrary] || [];
    
    // Vérifier les mots de la langue détectée
    primaryWordList.forEach(word => {
      const regex = new RegExp(`\\b${this.escapeRegExp(word)}\\b`, 'i');
      if (regex.test(lowerText)) {
        foundBadWords.push(word);
      }
    });
    
    // Si aucun mot inapproprié n'a été trouvé, vérifier les autres langues
    if (foundBadWords.length === 0) {
      // Vérifier les mots des autres langues
      this.badWords.forEach(word => {
        if (!primaryWordList.includes(word)) {
          const regex = new RegExp(`\\b${this.escapeRegExp(word)}\\b`, 'i');
          if (regex.test(lowerText)) {
            foundBadWords.push(word);
          }
        }
      });
    }
    
    return {
      isValid: foundBadWords.length === 0,
      badWordsFound: foundBadWords
    };
  }
  
  /**
   * Convertit le code de langue interne en code de langue WebPurify
   * @param language La langue détectée en interne
   * @returns Le code de langue pour WebPurify
   */
  private mapLanguageToWebPurify(language: string): string {
    switch (language) {
      case 'french': return 'fr';
      case 'arabic': return 'ar';
      case 'english':
      default: return 'en';
    }
  }
  
  /**
   * Échappe les caractères spéciaux dans une chaîne pour une utilisation dans une expression régulière
   * @param string La chaîne à échapper
   * @returns La chaîne échappée
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Détecte la langue probable du texte (simplifiée)
   * @param text Le texte à analyser
   * @returns La langue détectée ('french', 'english', 'arabic' ou 'unknown')
   */
  detectLanguage(text: string): string {
    // Caractères spécifiques à l'arabe
    const arabicPattern = /[؀-ۿ]/;
    if (arabicPattern.test(text)) {
      return 'arabic';
    }
    
    // Caractères accentués français
    const frenchPattern = /[éèêëàâäôöùûüÿçœæ]/i;
    if (frenchPattern.test(text)) {
      return 'french';
    }
    
    // Par défaut, on considère que c'est de l'anglais
    return 'english';
  }

  /**
   * Vérifie le contenu et affiche une alerte si des mots inappropriés sont trouvés
   * @param text Le texte à vérifier
   * @returns true si le contenu est valide, false sinon
   */
  validateContent(text: string): boolean {
    // Version synchrone pour compatibilité avec le code existant
    // Utilise la méthode locale comme vérification immédiate
    const localResult = this.checkContentLocally(text);
    
    if (!localResult.isValid) {
      Swal.fire({
        title: 'Contenu inapproprié',
        html: `Votre message contient des mots inappropriés.<br>Veuillez modifier votre contenu avant de publier.`,
        icon: 'warning',
        confirmButtonText: 'Compris'
      });
      return false;
    }
    
    // Lancer la vérification WebPurify en arrière-plan pour les cas où la vérification locale ne détecte rien
    this.checkContent(text).subscribe(result => {
      if (!result.isValid) {
        Swal.fire({
          title: 'Contenu inapproprié',
          html: `Votre message contient des mots inappropriés.<br>Veuillez modifier votre contenu avant de publier.`,
          icon: 'warning',
          confirmButtonText: 'Compris'
        });
        // Note: Cette alerte peut apparaître après que l'utilisateur ait déjà soumis le contenu
        // Une meilleure implémentation nécessiterait de modifier le CommentService pour utiliser des Observables
      }
    });
    
    return true;
  }
}
import { Component, OnInit } from '@angular/core';
import { BlogCommentResponse } from '../../../interfaces/BlogCommentResponse';
import { BlogCommentResponseService } from '../../../services/blog-comment-response.service';

@Component({
  selector: 'app-response-list',
  templateUrl: './response-list.component.html',
  styleUrls: ['./response-list.component.css']
})
export class ResponseListComponent implements OnInit {
  responses: BlogCommentResponse[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private responseService: BlogCommentResponseService) { }

  ngOnInit(): void {
    this.loadResponses();
  }

  loadResponses(): void {
    this.loading = true;
    this.error = null;
    
    this.responseService.getAllResponses().subscribe({
      next: (responses) => {
        this.responses = responses;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réponses:', err);
        this.error = 'Impossible de charger les réponses. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  deleteResponse(responseId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse?')) {
      this.responseService.deleteResponse(responseId).subscribe({
        next: () => {
          this.responses = this.responses.filter(response => response.responseId !== responseId);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.error = 'Impossible de supprimer la réponse. Veuillez réessayer plus tard.';
        }
      });
    }
  }
}
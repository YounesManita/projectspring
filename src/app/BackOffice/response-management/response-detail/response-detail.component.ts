import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogCommentResponse } from '../../../interfaces/BlogCommentResponse';
import { BlogCommentResponseService } from '../../../services/blog-comment-response.service';

@Component({
  selector: 'app-response-detail',
  templateUrl: './response-detail.component.html',
  styleUrls: ['./response-detail.component.css']
})
export class ResponseDetailComponent implements OnInit {
  response: BlogCommentResponse | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private responseService: BlogCommentResponseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadResponse(+id);
      }
    });
  }

  loadResponse(id: number): void {
    this.loading = true;
    this.responseService.getResponseById(id).subscribe({
      next: (response) => {
        this.response = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la réponse:', err);
        this.error = 'Impossible de charger la réponse. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  deleteResponse(responseId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse?')) {
      this.responseService.deleteResponse(responseId).subscribe({
        next: () => {
          this.router.navigate(['/admin/responses']);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.error = 'Impossible de supprimer la réponse. Veuillez réessayer plus tard.';
        }
      });
    }
  }
}
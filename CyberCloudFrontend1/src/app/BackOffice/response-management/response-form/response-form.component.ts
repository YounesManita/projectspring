import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogCommentResponse } from '../../../interfaces/BlogCommentResponse';
import { BlogCommentResponseService } from '../../../services/blog-comment-response.service';

@Component({
  selector: 'app-response-form',
  templateUrl: './response-form.component.html',
  styleUrls: ['./response-form.component.css']
})
export class ResponseFormComponent implements OnInit {
  responseForm: FormGroup;
  isEditMode: boolean = false;
  responseId: number | null = null;
  commentId: number | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private responseService: BlogCommentResponseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.responseForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]],
      userId: [null, Validators.required],
      userName: ['', Validators.required],
      commentId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.responseId = +id;
        this.loadResponse(this.responseId);
      }
      
      // Récupérer l'ID du commentaire si disponible dans les query params
      this.route.queryParamMap.subscribe(queryParams => {
        const commentId = queryParams.get('commentId');
        if (commentId) {
          this.commentId = +commentId;
          this.responseForm.patchValue({ commentId: this.commentId });
        }
      });
    });
  }

  loadResponse(id: number): void {
    this.loading = true;
    this.responseService.getResponseById(id).subscribe({
      next: (response) => {
        this.responseForm.patchValue({
          content: response.content,
          userId: response.userId,
          userName: response.userName,
          commentId: response.commentId
        });
        this.commentId = response.commentId;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la réponse:', err);
        this.error = 'Impossible de charger la réponse. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.responseForm.invalid) {
      return;
    }

    this.loading = true;
    const response: BlogCommentResponse = {
      ...this.responseForm.value,
      responseId: this.isEditMode ? this.responseId! : undefined,
      createdAt: new Date()
    };

    if (this.isEditMode && this.responseId) {
      this.responseService.updateResponse(this.responseId, response).subscribe({
        next: () => {
          this.router.navigate(['/admin/responses']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          this.error = 'Impossible de mettre à jour la réponse. Veuillez réessayer plus tard.';
          this.loading = false;
        }
      });
    } else {
      this.responseService.createResponse(response.commentId, response).subscribe({
        next: () => {
          this.router.navigate(['/admin/responses']);
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
          this.error = 'Impossible de créer la réponse. Veuillez réessayer plus tard.';
          this.loading = false;
        }
      });
    }
  }
}
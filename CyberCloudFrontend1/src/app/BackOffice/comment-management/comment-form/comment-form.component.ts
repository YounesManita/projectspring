import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../../../interfaces/Comment';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {
  commentForm: FormGroup;
  isEditMode: boolean = false;
  commentId: number | null = null;
  postId: number | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]],
      userId: [1], // Valeur par défaut pour l'admin connecté
      userName: ['Admin'], // Valeur par défaut pour l'admin connecté
      postId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.commentId = +id;
        this.loadComment(this.commentId);
        
        // En mode édition, on retire les validateurs pour les champs cachés
        this.commentForm.get('userId')?.clearValidators();
        this.commentForm.get('userName')?.clearValidators();
        this.commentForm.get('postId')?.clearValidators();
        
        // On met à jour l'état des validateurs
        this.commentForm.get('userId')?.updateValueAndValidity();
        this.commentForm.get('userName')?.updateValueAndValidity();
        this.commentForm.get('postId')?.updateValueAndValidity();
      } else {
        // En mode création, on utilise les valeurs par défaut pour l'admin connecté
        // Dans un cas réel, ces valeurs seraient récupérées depuis un service d'authentification
        this.commentForm.patchValue({
          userId: 1, // ID de l'admin connecté
          userName: 'Admin' // Nom de l'admin connecté
        });
      }
      
      // Get postId from query params if available
      this.route.queryParamMap.subscribe(queryParams => {
        const postId = queryParams.get('postId');
        if (postId) {
          this.postId = +postId;
          this.commentForm.patchValue({ postId: this.postId });
        }
      });
    });
  }

  loadComment(id: number): void {
    this.loading = true;
    this.commentService.getCommentById(id).subscribe({
      next: (comment) => {
        if (comment) {
          this.commentForm.patchValue({
            content: comment.content,
            userId: comment.userId,
            userName: comment.userName,
            postId: comment.postId
          });
          this.postId = comment.postId;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading comment:', err);
        this.error = 'Failed to load comment. Please try again later.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      return;
    }

    this.loading = true;
    const comment: Comment = {
      ...this.commentForm.value,
      commentId: this.isEditMode ? this.commentId! : undefined,
      createdAt: new Date()
    };
    
    // En mode création, on s'assure que les informations de l'admin sont bien définies
    if (!this.isEditMode) {
      // Dans un cas réel, ces valeurs seraient récupérées depuis un service d'authentification
      comment.userId = 1; // ID de l'admin connecté
      comment.userName = 'Admin'; // Nom de l'admin connecté
    }

    if (this.isEditMode && this.commentId) {
      this.commentService.updateComment(this.commentId, comment).subscribe({
        next: () => {
          this.router.navigate(['/admin/comments']);
        },
        error: (err) => {
          console.error('Error updating comment:', err);
          this.error = 'Failed to update comment. Please try again later.';
          this.loading = false;
        }
      });
    } else {
      this.commentService.createComment(comment.postId, comment).subscribe({
        next: () => {
          this.router.navigate(['/admin/comments']);
        },
        error: (err) => {
          console.error('Error creating comment:', err);
          this.error = 'Failed to create comment. Please try again later.';
          this.loading = false;
        }
      });
    }
  }
}
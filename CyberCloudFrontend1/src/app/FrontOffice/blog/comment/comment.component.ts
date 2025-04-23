import { Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../../../interfaces/Comment';
import { CommentService } from '../../../services/comment.service';
import Swal from 'sweetalert2';
import { CommentResponseComponent } from './comment-response/comment-response.component';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() postId!: number;
  @ViewChild('commentTextarea') commentTextarea!: ElementRef;
  @ViewChildren('responseComponent') responseComponents!: QueryList<CommentResponseComponent>;
  @Output() commentCountChanged = new EventEmitter<number>();

  comments: Comment[] = [];
  commentForm!: FormGroup;
  isEditing = false;
  selectedCommentId: number | null = null;
  
  // BehaviorSubject pour le compteur de commentaires
  private commentCountSubject = new BehaviorSubject<number>(0);
  commentCount$ = this.commentCountSubject.asObservable();

  constructor(
    private commentService: CommentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadComments();
  }

  initForm(): void {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  loadComments(): void {
    this.commentService.getCommentsByPostId(this.postId).subscribe({
      next: (comments) => {
        this.comments = comments.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Mettre à jour le compteur de commentaires
        this.updateCommentCount(this.comments.length);
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        Swal.fire('Erreur', 'Impossible de charger les commentaires.', 'error');
      }
    });
  }
  
  // Méthode pour mettre à jour le compteur de commentaires
  updateCommentCount(count: number): void {
    this.commentCountSubject.next(count);
    this.commentCountChanged.emit(count);
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }
    
    // Focus sur le champ de commentaire après soumission
    this.focusCommentInput();

    const commentData: Comment = {
      content: this.commentForm.value.content.trim(),
      createdAt: new Date(),
      postId: this.postId,
      userId: 1, // À remplacer par l'ID de l'utilisateur connecté
      userName: 'User' // À remplacer par le nom de l'utilisateur connecté
    };

    const observable = this.isEditing && this.selectedCommentId
      ? this.commentService.updateComment(this.selectedCommentId, commentData)
      : this.commentService.createComment(this.postId, commentData);

    observable.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.isEditing 
            ? 'Commentaire mis à jour' 
            : 'Commentaire ajouté',
          showConfirmButton: false,
          timer: 1500
        });
        this.resetForm();
        this.loadComments();
      },
      error: (err) => {
        console.error('Error submitting comment:', err);
        Swal.fire(
          'Erreur',
          this.isEditing
            ? 'Erreur lors de la mise à jour du commentaire.'
            : 'Erreur lors de l\'ajout du commentaire.',
          'error'
        );
      }
    });
  }

  focusCommentInput(): void {
    if (this.commentTextarea) {
      this.commentTextarea.nativeElement.focus();
    }
  }

  toggleResponseForm(commentId: number): void {
    // Trouver le composant de réponse correspondant au commentaire
    const responseComponent = this.responseComponents.find(comp => comp.commentId === commentId);
    if (responseComponent) {
      responseComponent.toggleResponseForm();
    }
  }

  editComment(comment: Comment): void {
    if (!comment.commentId) {
      Swal.fire('Erreur', 'ID du commentaire non trouvé', 'error');
      return;
    }

    this.isEditing = true;
    this.selectedCommentId = comment.commentId;
    this.commentForm.patchValue({
      content: comment.content
    });
    this.focusCommentField();
  }

  deleteComment(commentId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer ce commentaire ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteComment(commentId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Supprimé!',
              text: 'Le commentaire a été supprimé.',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadComments();
          },
          error: (err) => {
            console.error('Error deleting comment:', err);
            Swal.fire(
              'Erreur',
              'Erreur lors de la suppression du commentaire.',
              'error'
            );
          }
        });
      }
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedCommentId = null;
    this.commentForm.reset();
  }

  // Méthode pour focus sur le champ de commentaire
  focusCommentField(): void {
    setTimeout(() => {
      if (this.commentTextarea?.nativeElement) {
        this.commentTextarea.nativeElement.focus();
      }
    }, 0);
  }

  // Gestion des erreurs pour le template
  hasError(controlName: string, errorName: string): boolean {
    const control = this.commentForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }
}
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogCommentResponse } from '../../../../interfaces/BlogCommentResponse';
import { BlogCommentResponseService } from '../../../../services/blog-comment-response.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comment-response',
  templateUrl: './comment-response.component.html',
  styleUrls: ['./comment-response.component.css']
})
export class CommentResponseComponent implements OnInit {
  @Input() commentId!: number;
  responses: BlogCommentResponse[] = [];
  responseForm!: FormGroup;
  isEditing = false;
  selectedResponseId: number | null = null;
  showResponseForm = false;

  constructor(
    private responseService: BlogCommentResponseService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadResponses();
  }

  initForm(): void {
    this.responseForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  loadResponses(): void {
    this.responseService.getResponsesByCommentId(this.commentId).subscribe({
      next: (responses) => {
        this.responses = responses
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de charger les réponses.', 'error');
      }
    });
  }

  toggleResponseForm(): void {
    this.showResponseForm = !this.showResponseForm;
    if (!this.showResponseForm) {
      this.resetForm();
    } else {
      // Focus sur le champ de texte quand le formulaire est affiché
      setTimeout(() => {
        const textareaElement = document.querySelector(`#content-${this.commentId}`);
        if (textareaElement) {
          (textareaElement as HTMLTextAreaElement).focus();
        }
      }, 100);
    }
    
    // Notifier le parent pour mettre à jour l'UI
    this.loadResponses();
  }

  onSubmit(): void {
    if (this.responseForm.invalid) return;

    const responseData: BlogCommentResponse = {
      content: this.responseForm.value.content,
      createdAt: new Date(),
      commentId: this.commentId,
      userId: 1, // À remplacer par l'ID de l'utilisateur connecté
      userName: 'User' // À remplacer par le nom de l'utilisateur connecté
    };

    if (this.isEditing && this.selectedResponseId) {
      this.responseService.updateResponse(this.selectedResponseId, responseData).subscribe({
        next: () => {
          this.resetForm();
          this.loadResponses();
          Swal.fire('Succès', 'Réponse mise à jour avec succès.', 'success');
        },
        error: () => {
          Swal.fire('Erreur', 'Erreur lors de la mise à jour de la réponse.', 'error');
        }
      });
    } else {
      this.responseService.createResponse(this.commentId, responseData).subscribe({
        next: () => {
          this.resetForm();
          this.loadResponses();
          Swal.fire('Succès', 'Réponse ajoutée avec succès.', 'success');
        },
        error: () => {
          Swal.fire('Erreur', 'Erreur lors de l\'ajout de la réponse.', 'error');
        }
      });
    }
  }

  editResponse(response: BlogCommentResponse): void {
    this.isEditing = true;
    this.showResponseForm = true;
    if (!response.responseId) {
      Swal.fire('Erreur', 'ID de la réponse non trouvé', 'error');
      return;
    }
    this.selectedResponseId = response.responseId;
    this.responseForm.patchValue({
      content: response.content
    });
  }

  deleteResponse(responseId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer cette réponse ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.responseService.deleteResponse(responseId).subscribe({
          next: () => {
            this.loadResponses();
            Swal.fire('Succès', 'Réponse supprimée avec succès.', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Erreur lors de la suppression de la réponse.', 'error');
          }
        });
      }
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedResponseId = null;
    this.responseForm.reset();
  }
}
import { Component, OnInit,inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BlogPost, Reaction, Image } from '../../interfaces/BlogPost';
import { BlogpostService } from '../../services/blogpost.service';
import { NotificationService } from '../../services/notification.service';
import { CommentResponseComponent } from './comment/comment-response/comment-response.component';
import { ImageGeneratorService } from '../../services/image-generator.service';
declare var bootstrap: any;
import { NgForm } from '@angular/forms';

import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  imageForms: { description: string; imageUrl: SafeUrl | null }[] = [];

  blogPosts: BlogPost[] = [];
  images: Image[] = []; 
  filteredPosts: BlogPost[] = [];
  paginatedPosts: BlogPost[] = [];
  blogForm!: FormGroup;
  isEditing: boolean = false;
  selectedPostId: number | null = null;
  commentCounts: {[postId: number]: number} = {};
  sortOrder: 'newest' | 'oldest' = 'newest';
  expandedPosts: {[postId: number]: boolean} = {};
  selectedImages: { file: File, preview: string, description: string}[] = [];
  selectedFiles: FileList | null = null;
  location = window.location;
   postData=[];
  // Pagination
  currentPage = 1;
  itemsPerPage = 3; // Changé à 3 posts par page
  totalPages = 1;
  searchTerm = '';

  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'lists link image table wordcount'
  };

  constructor(
    private blogPostService: BlogpostService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadBlogPosts();
    
    // Initialiser les carousels après le chargement des posts
    setTimeout(() => {
      this.initCarousels();
    }, 1000);
  }
  
  // Initialiser les carousels Bootstrap
  initCarousels(): void {
    document.querySelectorAll('.carousel').forEach(carouselEl => {
      new bootstrap.Carousel(carouselEl, {
        interval: 5000
      });
    });
  }

  initForm(): void {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }
  
  toggleExpandPost(postId: number): void {
    this.expandedPosts[postId] = !this.expandedPosts[postId];
  }
  
  selectedPost: BlogPost | null = null;

  openPostDetailModal(post: BlogPost): void {
    this.selectedPost = post;
    // Ouvrir le modal
    const modalElement = document.getElementById('post-detail-modal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
      
      // Initialiser le carousel après l'ouverture du modal
      setTimeout(() => {
        const carouselElement = document.getElementById('carousel-detail');
        if (carouselElement) {
          new bootstrap.Carousel(carouselElement, {
            interval: 5000
          });
        }
      }, 500);
    }
  }
  
  // Ces méthodes sont maintenant gérées par le composant ImageUploadComponent
  // Nous gardons ces méthodes vides pour la compatibilité avec le code existant
  onFileSelected(event: any): void {
    // Géré par ImageUploadComponent
  }
  
  addImage(): void {
    // Géré par ImageUploadComponent
  }
  
  removeImage(index: number): void {
    // Géré par ImageUploadComponent
  }

  loadBlogPosts(): void {
    this.blogPostService.getAllPosts().subscribe({
      next: (res) => {
        this.blogPosts = res;
        this.filteredPosts = [...this.blogPosts];
        // Charger le nombre de commentaires pour chaque post
        this.blogPosts.forEach(post => {
          this.loadCommentsCount(post.postId);
        });
        // Appliquer le tri par date et la pagination
        this.sortPosts();
        
        // Initialiser les carousels après le chargement des posts
        setTimeout(() => {
          this.initCarousels();
        }, 500);
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de charger les posts.', 'error');
      }
    });
  }

  filterPosts(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (!this.searchTerm) {
      this.filteredPosts = [...this.blogPosts];
    } else {
      this.filteredPosts = this.blogPosts.filter(post => 
        post.title.toLowerCase().includes(this.searchTerm) || 
        post.content.toLowerCase().includes(this.searchTerm)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  sortPosts(): void {
    this.filteredPosts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return this.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    this.updatePagination();
  }

  changeSortOrder(order: 'newest' | 'oldest'): void {
    this.sortOrder = order;
    this.sortPosts();
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPosts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPosts = this.filteredPosts.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  loadCommentsCount(postId: number): void {
    this.blogPostService.getCommentsCount(postId).subscribe({
      next: (response) => {
        this.commentCounts[postId] = response.count;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du nombre de commentaires:', err);
        this.commentCounts[postId] = 0;
      }
    });
  }
  
  // Méthode pour mettre à jour le compteur de commentaires depuis le composant enfant
  updateCommentCount(postId: number, count: number): void {
    this.commentCounts[postId] = count;
  }

  onSubmit(): void {
    if (this.blogForm.invalid) return;

    const postData = this.blogForm.value;
    console.log('postData', postData);
    postData.userId = parseInt(localStorage.getItem('user_id') || '0', 10);
    
    if (this.selectedImages.length > 0) {
      postData.images = this.selectedImages.map((img, index) => ({
        url: img.preview,
        description: img.description,
        orderIndex: index
      }));
    }
  
    // Afficher un indicateur de chargement
    Swal.fire({
      title: 'Traitement en cours...',
      text: 'Veuillez patienter pendant la création de votre publication',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Fermer la modale avant d'afficher le Swal
    const modalElement = document.getElementById('blog-modal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }

    if (this.isEditing && this.selectedPostId !== null) {
      this.blogPostService.updatePost(this.selectedPostId, postData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Post mis à jour avec succès.',
            didClose: () => {
              // S'assurer que tous les overlays sont supprimés
              document.body.classList.remove('modal-open');
              const modalBackdrops = document.getElementsByClassName('modal-backdrop');
              while (modalBackdrops.length > 0) {
                modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
              }
              this.resetForm();
              this.loadBlogPosts();
            }
          });
        },
        error: () => {
          Swal.fire('Erreur', 'Erreur lors de la mise à jour du post.', 'error');
        }
      });
    } else {
      this.blogPostService.createPost(postData).subscribe({
        next: (createdPost) => {
          // Ajouter la notification immédiatement après la création réussie du post
          this.notificationService.addNotification(createdPost);
          
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Post créé avec succès.',
            didClose: () => {
              // S'assurer que tous les overlays sont supprimés
              document.body.classList.remove('modal-open');
              const modalBackdrops = document.getElementsByClassName('modal-backdrop');
              while (modalBackdrops.length > 0) {
                modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
              }
              this.resetForm();
              this.loadBlogPosts();
            }
          });
        },
        error: () => {
          Swal.fire('Erreur', 'Erreur lors de la création du post.', 'error');
        }
      });
    }
  }

  editPost(post: BlogPost): void {
    this.isEditing = true;
    this.selectedPostId = post.postId;
    this.blogForm.patchValue({
      title: post.title,
      content: post.content
    });
    
    this.selectedImages = [];
    if (post.images && post.images.length > 0) {
      post.images.forEach(img => {
        this.selectedImages.push({
          file: new File([], 'existing-image'),
          preview: img.url,
          description: img.description || ''
        });
      });
    }

    // Ouvrir le modal
    const modalElement = document.getElementById('blog-modal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  deletePost(post: BlogPost): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer ce post ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.blogPostService.deletePost(post.postId).subscribe({
          next: () => {
            Swal.fire('Succès', 'Post supprimé avec succès.', 'success');
            this.loadBlogPosts();
          },
          error: () => {
            Swal.fire('Erreur', 'Erreur lors de la suppression du post.', 'error');
          }
        });
      }
    });
  }

  reactToPost(post: BlogPost, reaction: string): void {
    const isTogglingOff = post.reaction === reaction;
    const newReaction = isTogglingOff ? null : reaction as Reaction;
    
    if (post.reaction && !isTogglingOff) {
      this.blogPostService.updateReaction(post.postId, post.reaction, newReaction).subscribe({
        next: (updatedPost: BlogPost) => {
          post.reaction = updatedPost.reaction;
          this.hideReactionPanel(post.postId);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la réaction:', error);
        }
      });
    } else {
      this.blogPostService.reactToPost(post.postId, newReaction).subscribe({
        next: (updatedPost: BlogPost) => {
          post.reaction = updatedPost.reaction;
          this.hideReactionPanel(post.postId);
        },
        error: (error) => {
          console.error('Erreur lors de la réaction au post:', error);
        }
      });
    }
  }
  
  showReactionPanel(postId: number | string): void {
    const panelId = typeof postId === 'string' ? `reaction-panel-${postId}` : `reaction-panel-${postId}`;
    const panel = document.getElementById(panelId);
    if (panel) {
      panel.classList.remove('d-none');
      panel.classList.add('d-block');
    }
  }
  
  hideReactionPanel(postId: number | string): void {
    const panelId = typeof postId === 'string' ? `reaction-panel-${postId}` : `reaction-panel-${postId}`;
    const panel = document.getElementById(panelId);
    if (panel) {
      setTimeout(() => {
        if (!panel.matches(':hover')) {
          panel.classList.remove('d-block');
          panel.classList.add('d-none');
        }
      }, 50);
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedPostId = null;
    this.blogForm.reset();
    this.selectedImages = [];
    this.selectedFiles = null;
  }

  refreshAndReset(): void {
    this.loadBlogPosts();
    this.resetForm();
    const modalElement = document.getElementById('blog-modal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
      
      // S'assurer que tous les overlays sont supprimés
      document.body.classList.remove('modal-open');
      const modalBackdrops = document.getElementsByClassName('modal-backdrop');
      while (modalBackdrops.length > 0) {
        modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
      }
    }
  }
  // Dans votre composant BlogComponent
handleImageError(event: any) {
  event.target.src = 'assets/img/default-image.jpg';
}

ngAfterViewInit() {
  // Initialiser tous les carrousels
  document.querySelectorAll('.carousel').forEach(carouselEl => {
    new bootstrap.Carousel(carouselEl, {
      interval: false // Désactive l'auto-rotation
    });
  });
}

  focusCommentInput(postId: number): void {
    setTimeout(() => {
      const commentInput = document.getElementById(`comment-input-${postId}`);
      if (commentInput) {
        commentInput.focus();
      }
    }, 0);
  }
  // Méthode améliorée pour afficher le menu déroulant
showDropdownMenu(postId: number | string) {
  // Fermer tous les menus déroulants ouverts d'abord
  document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
    if (openMenu.id !== `dropdown-menu-${postId}`) {
      openMenu.classList.remove('show');
    }
  });
  
  // Ouvrir ou fermer le menu sélectionné
  const menuId = typeof postId === 'string' ? `dropdown-menu-${postId}` : `dropdown-menu-${postId}`;
  const menu = document.getElementById(menuId);
  if (menu) {
    menu.classList.toggle('show');
    
    // S'assurer que le menu reste dans les limites de l'écran
    setTimeout(() => {
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      if (rect.right > viewportWidth) {
        menu.style.right = '0';
        menu.style.left = 'auto';
      }
    }, 0);
  }
  
  // Empêcher la propagation de l'événement
  event?.stopPropagation();
}

// Méthode pour encoder les URL pour le partage
encodeURIComponent(url: string): string {
  return window.encodeURIComponent(url);
}

  // Ajoute la méthode pour copier le lien du post
  copyPostLink(postId: number): void {
    const url = `${window.location.origin}/blog/${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      // Affiche un retour visuel (par exemple avec SweetAlert ou un toast)
      // Utilisation de SweetAlert si déjà utilisé dans le projet
      // @ts-ignore
      if (Swal) {
        Swal.fire({
          icon: 'success',
          title: 'Lien copié !',
          text: 'Le lien du post a été copié dans le presse-papiers.'
        });
      } else {
        alert('Lien copié dans le presse-papiers !');
      }
    }, () => {
      alert('Erreur lors de la copie du lien.');
    });
  }

  imageurl!: SafeUrl;

  private textService = inject(ImageGeneratorService);
  private sanitizer = inject(DomSanitizer);
  onSubmitPhoto(form: NgForm, index: number) {
    const description = this.imageForms[index].description;
    let formData = new FormData();
    formData.append('prompt', description);
  
    this.textService.textToImage(formData).subscribe({
      next: (res) => {
        let typedArray = new Uint8Array(res);
  
        const stringChar = typedArray.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');
  
        let base64String = btoa(stringChar);
        let dataUrl = 'data:image/jpg;base64,' + base64String;
  
        // ✅ Créer un fichier à partir du base64
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const file = new File([blob], `generated_image_${Date.now()}.jpg`, { type: 'image/jpeg' });
  
        // ✅ 1. Sauvegarder dans imageForms[index] pour affichage et gestion locale
        this.imageForms[index].imageUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
     
  
        // ✅ 2. Ajouter aussi dans generatedImages pour envoi global plus tard
        this.selectedImages.push({
          file: file,
          preview: dataUrl,
          description: description
        });
      },
      error: (error) => {
        alert('Erreur génération : ' + error.message);
      },
    });
  }
  
  addInput() {
    this.imageForms.push({ description: '', imageUrl: null });
  }
}
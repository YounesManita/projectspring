import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from '../../../interfaces/BlogPost';
import { BlogpostService } from '../../../services/blogpost.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  post: BlogPost | undefined = undefined;
  postId: number = 0;
  loading: boolean = true;
  error: string | null = null;
  commentCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogpostService
  ) {}

  ngOnInit(): void {

    console.log(localStorage.getItem('access_token'));
   console.log(localStorage.getItem('refresh_token'));
    console.log(localStorage.getItem('user_id'));
   
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.postId = +id;
        this.loadPost();
      } else {
        this.error = 'ID du post non trouvé';
        this.loading = false;
      }
    });
  }

  loadPost(): void {
    this.loading = true;
    this.blogPostService.getPostById(this.postId).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du post:', err);
        this.error = 'Impossible de charger le post. Veuillez réessayer plus tard.';
        this.loading = false;
        Swal.fire('Erreur', this.error, 'error');
      }
    });
  }
  
  // Méthode pour mettre à jour le compteur de commentaires
  updateCommentCount(count: number): void {
    this.commentCount = count;
    const countElement = document.getElementById('comment-count');
    if (countElement) {
      countElement.textContent = count.toString();
    }
  }
}
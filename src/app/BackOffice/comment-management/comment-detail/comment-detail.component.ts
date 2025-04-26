import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../../../interfaces/Comment';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.css']
})
export class CommentDetailComponent implements OnInit {
  comment: Comment | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadComment(+id);
      }
    });
  }

  loadComment(id: number): void {
    this.loading = true;
    this.commentService.getCommentById(id).subscribe({
      next: (comment) => {
        this.comment = comment;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading comment:', err);
        this.error = 'Failed to load comment. Please try again later.';
        this.loading = false;
      }
    });
  }

  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.router.navigate(['/admin/comments']);
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
          this.error = 'Failed to delete comment. Please try again later.';
        }
      });
    }
  }
}
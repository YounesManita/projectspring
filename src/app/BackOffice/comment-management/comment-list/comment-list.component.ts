import { Component, OnInit } from '@angular/core';
import { Comment } from '../../../interfaces/Comment';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  comments: Comment[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.loading = true;
    this.error = null;
    
    this.commentService.getAllComments().subscribe({
      next: (comments) => {
        this.comments = comments;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.error = 'Failed to load comments. Please try again later.';
        this.loading = false;
      }
    });
  }

  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(comment => comment.commentId !== commentId);
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
          this.error = 'Failed to delete comment. Please try again later.';
        }
      });
    }
  }
}
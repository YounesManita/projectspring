import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPost } from '../../../interfaces/BlogPost';
import { BlogpostService } from '../../../services/blogpost.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog: BlogPost | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private blogService: BlogpostService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadBlog(+id);
      }
    });
  }

  loadBlog(id: number): void {
    this.loading = true;
    this.blogService.getPostById(id).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading blog:', err);
        this.error = 'Failed to load blog. Please try again later.';
        this.loading = false;
      }
    });
  }

  deleteBlog(postId: number): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deletePost(postId).subscribe({
        next: () => {
          this.router.navigate(['/admin/blogs']);
        },
        error: (err) => {
          console.error('Error deleting blog:', err);
          this.error = 'Failed to delete blog. Please try again later.';
        }
      });
    }
  }
}
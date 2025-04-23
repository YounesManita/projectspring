import { Component, OnInit } from '@angular/core';
import { BlogPost } from '../../../interfaces/BlogPost';
import { BlogpostService } from '../../../services/blogpost.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: BlogPost[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private blogService: BlogpostService) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;
    
    this.blogService.getAllPosts().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading blogs:', err);
        this.error = 'Failed to load blogs. Please try again later.';
        this.loading = false;
      }
    });
  }

  deleteBlog(postId: number): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deletePost(postId).subscribe({
        next: () => {
          this.blogs = this.blogs.filter(blog => blog.postId !== postId);
        },
        error: (err) => {
          console.error('Error deleting blog:', err);
          this.error = 'Failed to delete blog. Please try again later.';
        }
      });
    }
  }
}
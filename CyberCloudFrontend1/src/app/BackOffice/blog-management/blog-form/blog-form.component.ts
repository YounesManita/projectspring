import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPost, Reaction } from '../../../interfaces/BlogPost';
import { BlogpostService } from '../../../services/blogpost.service';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent implements OnInit {
  blogForm: FormGroup;
  isEditMode: boolean = false;
  postId: number | null = null;
  loading: boolean = false;
  error: string | null = null;
  
  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'lists link image table wordcount'
  };

  constructor(
    private fb: FormBuilder,
    private blogService: BlogpostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      userId: [null]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.postId = +id;
        this.loadBlog(this.postId);
      }
    });

  }

  loadBlog(id: number): void {
    this.loading = true;
    this.blogService.getPostById(id).subscribe({
      next: (blog) => {
        this.blogForm.patchValue({
          title: blog.title,
          content: blog.content,
          userId: blog.userId
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading blog:', err);
        this.error = 'Failed to load blog. Please try again later.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      return;
    }

    this.loading = true;
    const blog: BlogPost = {
      ...this.blogForm.value,
      postId: this.isEditMode ? this.postId! : undefined,
      createdAt: new Date(),
      reaction: Reaction.LIKE // Default reaction
    };

    if (this.isEditMode && this.postId) {
      this.blogService.updatePost(this.postId, blog).subscribe({
        next: () => {
          this.router.navigate(['/admin/blogs']);
        },
        error: (err) => {
          console.error('Error updating blog:', err);
          this.error = 'Failed to update blog. Please try again later.';
          this.loading = false;
        }
      });
    } else {
      this.blogService.createPost(blog).subscribe({
        next: () => {
          this.router.navigate(['/admin/blogs']);
        },
        error: (err) => {
          console.error('Error creating blog:', err);
          this.error = 'Failed to create blog. Please try again later.';
          this.loading = false;
        }
      });
    }
  }
}
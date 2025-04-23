import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';


import { BlogComponent } from './blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { CommentComponent } from './comment/comment.component';
import { CommentResponseComponent } from './comment/comment-response/comment-response.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';

@NgModule({
  declarations: [
    BlogComponent,
    BlogDetailComponent,
    CommentComponent,
    CommentResponseComponent,
    ImageUploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    EditorModule
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  exports: [
    BlogComponent,
    BlogDetailComponent,
    CommentComponent,
    CommentResponseComponent,
    ImageUploadComponent
  ]
})
export class BlogModule { }
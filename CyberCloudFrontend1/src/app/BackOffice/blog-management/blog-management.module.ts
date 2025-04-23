import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';

const routes: Routes = [
  { path: '', component: BlogListComponent },
  { path: 'create', component: BlogFormComponent },
  { path: 'edit/:id', component: BlogFormComponent },
  { path: 'view/:id', component: BlogDetailComponent }
];

@NgModule({
  declarations: [
    BlogListComponent,
    BlogFormComponent,
    BlogDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    EditorModule
  ],
  exports: [
    RouterModule
  ]
})
export class BlogManagementModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { CommentDetailComponent } from './comment-detail/comment-detail.component';

const routes: Routes = [
  { path: '', component: CommentListComponent },
  { path: 'create', component: CommentFormComponent },
  { path: 'edit/:id', component: CommentFormComponent },
  { path: 'view/:id', component: CommentDetailComponent }
];

@NgModule({
  declarations: [
    CommentListComponent,
    CommentFormComponent,
    CommentDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CommentManagementModule { }
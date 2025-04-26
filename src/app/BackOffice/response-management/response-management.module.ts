import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ResponseListComponent } from './response-list/response-list.component';
import { ResponseFormComponent } from './response-form/response-form.component';
import { ResponseDetailComponent } from './response-detail/response-detail.component';

const routes: Routes = [
  { path: '', component: ResponseListComponent },
  { path: 'create', component: ResponseFormComponent },
  { path: 'edit/:id', component: ResponseFormComponent },
  { path: 'view/:id', component: ResponseDetailComponent }
];

@NgModule({
  declarations: [
    ResponseListComponent,
    ResponseFormComponent,
    ResponseDetailComponent
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
export class ResponseManagementModule { }
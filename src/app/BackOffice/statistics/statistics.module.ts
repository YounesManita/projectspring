import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BlogStatisticsComponent } from './blog-statistics/blog-statistics.component';

const routes: Routes = [
  { path: 'blog-statistics', component: BlogStatisticsComponent }
];

@NgModule({
  declarations: [
    BlogStatisticsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
  
})
export class StatisticsModule { }
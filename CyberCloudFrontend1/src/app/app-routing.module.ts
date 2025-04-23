import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Composants FrontOffice
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { BlogComponent } from './FrontOffice/blog/blog.component';
import { BlogDetailComponent } from './FrontOffice/blog/blog-detail/blog-detail.component';

// Composants BackOffice
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { HomeBackComponent } from './BackOffice/home-back/home-back.component';
import { BlogStatisticsComponent } from './BackOffice/statistics/blog-statistics/blog-statistics.component';

// Autres composants
import { NotfoundComponent } from './components/notfound/notfound.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '', component: AllTemplateFrontComponent,
    children: [
      { path: '', component: HomeFrontComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'blog/post/:id', component: BlogDetailComponent },
    ]
  },
  {
    path: 'admin', component: AllTemplateBackComponent,
    children: [
      { path: '', component: HomeBackComponent },
      { path: 'blogs', loadChildren: () => import('./BackOffice/blog-management/blog-management.module').then(m => m.BlogManagementModule) },
      { path: 'comments', loadChildren: () => import('./BackOffice/comment-management/comment-management.module').then(m => m.CommentManagementModule) },
      { path: 'responses', loadChildren: () => import('./BackOffice/response-management/response-management.module').then(m => m.ResponseManagementModule) },
      { path: 'blog-statistics', component: BlogStatisticsComponent },
    ]
  },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

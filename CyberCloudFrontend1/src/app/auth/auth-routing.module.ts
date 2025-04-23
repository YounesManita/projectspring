import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UnauthGuard} from './auth.guard';
import {LoginComponent} from "../components/login/login.component";
import {RegisterComponent} from "../components/register/register.component";
import {ForgotPasswordComponent} from "../components/forgot-password/forgot-password.component";
import {ResetPasswordComponent} from "../components/reset-password/reset-password.component";
import {VerifyUserComponent} from "../components/verify-user/verify-user.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'verify-account',
    component: VerifyUserComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [UnauthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}

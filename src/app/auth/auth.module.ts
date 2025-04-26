import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import {ResetPasswordComponent} from "../components/reset-password/reset-password.component";
import {LoginComponent} from "../components/login/login.component";
import {RegisterComponent} from "../components/register/register.component";
import {VerifyUserComponent} from "../components/verify-user/verify-user.component";
import {ForgotPasswordComponent} from "../components/forgot-password/forgot-password.component";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        LoginComponent,
        RegisterComponent,
        VerifyUserComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ]
})
export class AuthModule {
}

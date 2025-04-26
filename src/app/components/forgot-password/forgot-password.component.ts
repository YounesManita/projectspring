// src/app/components/forgot-password/forgot-password.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    try {
      const email = this.forgotPasswordForm.get('email')?.value;
      const response = await this.authService.requestPasswordReset(email);

      // Use the response from the backend as success message if available
      this.showSuccessMessage(response || 'Password reset code has been sent to your email.');

      // Redirect to reset password page after a short delay
      setTimeout(() => {
        this.router.navigate(['auth/reset-password'], {
          queryParams: { email: email }
        });
      }, 2000);
    } catch (error: any) {
      // Now we can directly use the error message from our service
      this.showErrorMessage(error.message || 'An error occurred while processing your request. Please try again later.');
      console.error('Password reset request error:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  showErrorMessage(message: string): void {
    this.errorMessage = message;
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
  }
}

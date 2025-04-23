// src/app/components/reset-password/reset-password.component.ts
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormsModule
  ],
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  email: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      code: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });

    // Get email from route parameters if provided
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {passwordMismatch: true};
  }

  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const code = this.resetPasswordForm.get('code')?.value;
    const newPassword = this.resetPasswordForm.get('newPassword')?.value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;

    try {
      const response = await this.authService.resetPassword(
        this.email,
        code,
        newPassword,
        confirmPassword
      );

      // Use the response from the backend as success message if available
      this.showSuccessMessage(response || 'Your password has been successfully reset.');

      // Redirect to login after success
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 3000);
    } catch (error: any) {
      // Now we can directly use the error message from our service
      this.showErrorMessage(error.message || 'An error occurred while resetting your password. Please try again.');
      console.error('Password reset error:', error);
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

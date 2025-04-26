// src/app/components/verify-user/verify-user.component.ts
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  styleUrls: ['./verify-user.component.scss']
})
export class VerifyUserComponent implements OnInit {
  verifyForm: FormGroup;
  isVerifying: boolean = false;
  isSuccess: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showVerificationForm: boolean = false;
  email: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.verifyForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Extract email and code from URL parameters if available
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const code = params['code'];

      if (email) {
        this.email = email;
        this.verifyForm.get('email')?.setValue(email);
      }

      if (email && code) {
        this.verifyForm.get('code')?.setValue(code);
        this.verifyAccount();
      } else {
        this.showVerificationForm = true;
      }
    });
  }

  async verifyAccount(): Promise<void> {
    if (this.verifyForm.invalid) {
      return;
    }

    this.isVerifying = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.verifyForm.get('email')?.value;
    const code = this.verifyForm.get('code')?.value;

    try {
      const response = await this.authService.verifyAccount(email, code);
      console.log('Verification successful:', response);
      this.isVerifying = false;
      this.isSuccess = true;
      this.showVerificationForm = false;
      this.successMessage = response;

      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 5000);
    } catch (error: any) {
      this.isVerifying = false;
      // Now we can directly use the error message from our service
      this.errorMessage = error.message || 'An error occurred during verification. The code may be invalid or expired.';
      console.error('Verification error:', error);
    }
  }
}

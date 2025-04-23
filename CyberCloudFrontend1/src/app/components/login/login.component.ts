import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  sessionExpired: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check if the route query parameter "sessionExpired" is present
    this.route.queryParams.subscribe(params => {
      this.sessionExpired = params['sessionExpired'] === 'true';
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    try {
      const {email, password} = this.loginForm.value;
      await this.authService.login(email, password);
      this.router.navigate(['/']);
    } catch (error: any) {
      // Now we can directly use the error message from our service
      this.showErrorMessage(error.message || 'An error occurred while processing your request.');
    } finally {
      this.isSubmitting = false;
    }
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.sessionExpired = false;
  }

  showErrorMessage(message: string): void {
    this.errorMessage = message;
  }
}

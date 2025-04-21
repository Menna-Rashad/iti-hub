import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { RegistrationService } from '../registration.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registrationForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  profilePicture: File | null = null;

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private oauthService: OAuthService
  ) {
    this.registrationForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required]),
        national_id: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{14}$/)]),
        linkedin: new FormControl(''),
        github: new FormControl(''),
      },
      { validators: this.passwordMatchValidator }
    );
    this.oauthService.configure({
      issuer: 'https://accounts.google.com',
      redirectUri: window.location.origin + '/login',
      clientId: '136248172784-g14vvg68t7sh2srb2oi9snebpkkhegcp.apps.googleusercontent.com',
      responseType: 'code',
      scope: 'openid profile email',
      showDebugInformation: true,
    });
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidIdToken()) {
        this.handleGoogleRegister();
      }
    });
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get FormControls() {
    return this.registrationForm.controls;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePicture = input.files[0];
    }
  }

  async handleSubmitForm() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValues = this.registrationForm.value;

    try {
      const response = await firstValueFrom(
        this.registrationService.registerUser({
          ...formValues,
          confirmPassword: formValues.confirmPassword,
          profilePicture: this.profilePicture,
        })
      );
      this.showNotification('🎉 Registration successful! Please verify your email.', 'success');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      this.errorMessage =
        error.error?.message || '⚠️ An error occurred during registration. Please try again.';
      this.showNotification(this.errorMessage, 'error');
    } finally {
      this.isLoading = false;
    }
  }

  registerWithGoogle(): void {
    this.isLoading = true;
    this.oauthService.initCodeFlow();
  }

  handleGoogleRegister(): void {
    const idToken = this.oauthService.getIdToken();
    this.registrationService.googleLogin(idToken).subscribe({
      next: (response) => {
        this.showNotification(
          response.message.includes('registered')
            ? '🎉 Account created with Google! Redirecting to dashboard...'
            : '🎉 Google login successful! Redirecting to dashboard...',
          'success'
        );
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        const errorMsg = error.error?.message || '❌ Google registration failed: Server error';
        this.showNotification(errorMsg, 'error');
        console.error('Google Registration Backend Error:', error);
      },
    });
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
    });
  }
}
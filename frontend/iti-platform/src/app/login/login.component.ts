import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AuthStateService } from '../services/auth-state.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authState: AuthStateService,
    private route: ActivatedRoute,
    private oauthService: OAuthService
  ) {
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
        this.handleGoogleLogin();
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getUserProfile().subscribe({
        next: (user: any) => {
          const redirectPath = this.getRedirectPath(user?.role);
          this.navigateWithErrorHandling(redirectPath);
        },
        error: () => {
          this.authService.logout();
          this.showNotification('⚠️ Session expired. Please log in again.', 'error');
        },
      });
    }

    const reset = this.route.snapshot.queryParamMap.get('reset');
    if (reset === '1') {
      this.showNotification('✅ Password changed successfully. Please log in.', 'success');
    }
  }

  login(): void {
    if (!this.email || !this.password) {
      this.showNotification('⚠️ Please enter your email and password!', 'error');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.authState.setLoggedIn(true);
        this.showNotification('🎉 Login successful! Redirecting...', 'success');
        this.email = '';
        this.password = '';

        const redirectPath = this.getRedirectPath(response.user?.role);
        this.navigateWithErrorHandling(redirectPath);

        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        const errorMsg =
          error.error?.message ||
          (error.status === 401 ? '❌ Invalid email or password!' : '⚠️ An error occurred. Please try again.');
        this.errorMessage = errorMsg;
        this.showNotification(errorMsg, 'error');
        console.error('Detailed API Error:', error);
      },
    });
  }

  navigateToResetPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/forgot-password']);
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
    });
  }

  loginWithGoogle(): void {
    this.isLoading = true;
    this.oauthService.initCodeFlow();
  }

  handleGoogleLogin(): void {
    const idToken = this.oauthService.getIdToken();
    this.authService.googleLogin(idToken).subscribe({
      next: (response) => {
        this.authState.setLoggedIn(true);
        this.showNotification('🎉 Google login successful! Redirecting...', 'success');

        const redirectPath = this.getRedirectPath(response.user?.role);
        this.navigateWithErrorHandling(redirectPath);

        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        const errorMsg = error.error?.message || '❌ Google login failed: Server error';
        this.showNotification(errorMsg, 'error');
        console.error('Google Login Backend Error:', error);
      },
    });
  }

  private getRedirectPath(role: string | undefined): string {
    if (role === 'admin') {
      return '/admin/dashboard';
    } else if (role === 'mentor') {
      return '/mentor/dashboard';
    }
    return '/main-content';
  }

  private navigateWithErrorHandling(path: string): void {
    this.router.navigate([path]).catch((err) => {
      console.error('Navigation Error:', err);
      this.showNotification('⚠️ Failed to redirect. Please try again.', 'error');
      this.router.navigate(['/']);
    });
  }
}
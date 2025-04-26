import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { AuthStateService } from '../services/auth-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  formSubmitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authState: AuthStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const reset = this.route.snapshot.queryParamMap.get('reset');
    if (reset === '1') {
      this.showNotification('✅ Password changed successfully. Please log in.', 'success');
    }

    // ✅ Google Identity Services Init
    google.accounts.id.initialize({
      client_id: '136248172784-g14vvg68t7sh2srb2oi9snebpkkhegcp.apps.googleusercontent.com',
      callback: (response: { credential: string }) => this.handleGoogleCallback(response),
    });

    google.accounts.id.renderButton(
      document.getElementById('google-login-button'),
      { theme: 'outline', size: 'large', width: '100%' }
    );
  }

  login(): void {
    this.formSubmitted = true;
    if (!this.email || !this.password) {
      this.showNotification('⚠️ Please enter your email and password!', 'error');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        const startTime = Date.now(); // temporary solution for undefined startTime
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        console.log(`API Request took ${timeTaken} ms`);

        if (timeTaken > 2000) {
          console.warn(`⚠️ The request took too long: ${timeTaken} ms`);
        }

        console.log('🚀 Full API Response:', response);

        if (response.token && response.user) {
          console.log('🔑 Received Token:', response.token);

          // ✅ Save token and full user data including profile_picture
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          this.authState.setLoggedIn(true);

          // ✅ Notify navbar to reload user data immediately
          window.dispatchEvent(new Event('storage'));

          if (response.user?.id) localStorage.setItem('user_id', response.user.id);
          if (response.user?.role) localStorage.setItem('role', response.user.role);

          this.showNotification('🎉 Login successful! Redirecting...', 'success');

          this.email = '';
          this.password = '';

          const role = response.user.role;
          let redirect = '/main-content';
          if (role === 'admin') redirect = '/admin/dashboard';
          else if (role === 'mentor') redirect = '/mentor/dashboard';

          setTimeout(() => this.router.navigate([redirect]), 1000);
        } else {
          this.showNotification('⚠️ Failed to log in. Please try again.', 'error');
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('❌ Login error:', error);
        this.showNotification(
          error.status === 401 ? '❌ Invalid email or password!' : '⚠️ An error occurred.',
          'error'
        );
      }
    });
  }

  handleGoogleCallback(response: { credential: string }): void {
    const idToken = response.credential;

    this.authService.googleLogin(idToken).subscribe({
      next: (res: any) => {
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('role', res.user.role);
        this.authState.setLoggedIn(true);

        this.showNotification('🎉 Google login successful!', 'success');

        const role = res.user.role;
        let redirect = '/main-content';
        if (role === 'admin') redirect = '/admin/dashboard';
        else if (role === 'mentor') redirect = '/mentor/dashboard';

        setTimeout(() => this.router.navigate([redirect]), 1000);
      },
      error: (err: any) => {
        console.error('❌ Google login failed:', err);
        this.showNotification('❌ Google login failed. Try again.', 'error');
      }
    });
  }

  navigateToResetPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/forgot-password']);
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
    });
  }
}
  
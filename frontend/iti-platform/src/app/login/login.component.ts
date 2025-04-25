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
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
    const startTime = Date.now();

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
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

          this.showNotification('🎉 Login successful! Redirecting...', 'success');

          this.email = '';
          this.password = '';

          let redirectPath = '/main-content';
          if (response.user.role === 'admin') {
            redirectPath = '/admin/dashboard';
          } else if (response.user.role === 'mentor') {
            redirectPath = '/mentor/dashboard';
          }

          setTimeout(() => {
            this.router.navigate([redirectPath]);
          }, 1000);

        } else {
          console.warn('⚠️ No token received from backend!');
          this.showNotification('⚠️ Failed to log in. Please try again.', 'error');
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('❌ API Error:', error);

        this.errorMessage =
          error.status === 401
            ? '❌ Invalid email or password!'
            : '⚠️ An error occurred. Please try again.';

        this.showNotification(this.errorMessage, 'error');
      }
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
    this.showNotification("🚀 Google login is under development", "success");
  }
}

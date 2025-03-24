import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Use CommonModule instead of BrowserModule
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
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
    CommonModule, // ✅ Fix the issue
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
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar // ✅ Fixed MatSnackBar injection issue
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.showNotification('⚠️ Please enter your email and password!', 'error');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const credentials = { email: this.email, password: this.password };
    
    // Start measuring time
    const startTime = Date.now(); // Store start time

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        // Measure time taken for the API request
        const endTime = Date.now();
        const timeTaken = endTime - startTime; // Calculate time in milliseconds
        console.log(`API Request took ${timeTaken} ms`);

        // Check if time taken is too long
        if (timeTaken > 2000) {
          console.warn(`⚠️ The request took too long: ${timeTaken} ms`);
        }

        // Handle API response
        console.log('🚀 Full API Response:', response); // ✅ Log full response

        if (response.token) {
          console.log('🔑 Received Token:', response.token); // ✅ Log the token
          localStorage.setItem('api_token', response.token);

          // Store mentorId and role in localStorage
          if (response.user?.id) {
            localStorage.setItem('user_id', response.user.id); // Store mentorId
          }
          if (response.user?.role) {
            localStorage.setItem('role', response.user.role); // Store user role
          }

          this.showNotification('🎉 Login successful! Redirecting...', 'success');

          // Clear email and password fields after successful login
          this.email = '';
          this.password = '';

          // Redirect based on user role
          const userRole = response.user?.role; // Assuming API returns user role
          const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/mentor/dashboard'; // Redirect to Mentor dashboard

          // Redirect with a slight delay to give feedback to the user
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

        // Show error notification
        this.showNotification(this.errorMessage, 'error');
      }
    });
  }

  navigateToResetPassword(event: Event): void {
    event.preventDefault(); // Prevent default link behavior
    this.router.navigate(['/forgot-password']); // Redirect to the forgot password page
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
    });
  }
}

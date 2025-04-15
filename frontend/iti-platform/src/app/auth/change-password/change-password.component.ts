import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  resetForm!: FormGroup;
  token: string = '';
  email: string = '';
  hidePassword: boolean = true;
  hideConfirm: boolean = true;
  success: string = '';
  error: string = '';
  loading: boolean = false;
  showWelcome: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get token and email from query params
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.email = this.route.snapshot.queryParamMap.get('email') || '';

    // Initialize the form with password and confirm password fields
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  // Toggle password visibility
  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  // Toggle confirm password visibility
  toggleConfirmPassword(): void {
    this.hideConfirm = !this.hideConfirm;
  }

  onSubmit(): void {
    // Check if form is valid
    if (this.resetForm.invalid) return;

    // Check if passwords match
    if (this.resetForm.errors?.['mismatch']) {
      this.snackBar.open('Passwords do not match!', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    this.loading = true;

    // Prepare the request data
    const data = {
      email: this.email,
      token: this.token,
      password: this.resetForm.value.password,
      password_confirmation: this.resetForm.value.confirmPassword
    };

    // Make HTTP POST request to change password
    this.http.post('http://127.0.0.1:8000/api/reset-password', data).subscribe({
      next: () => {
        this.success = 'Password successfully changed!';
        this.error = '';
        this.snackBar.open(this.success, 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });

        // Optionally redirect to login or another page
        setTimeout(() => {
          // Navigate to the login page after success
          window.location.href = '/login'; // Adjust the redirect logic as needed
        }, 2000);
      },
      error: (err) => {
        if (err.status === 422 && err.error?.errors) {
          const firstError = (Object.values(err.error.errors as { [key: string]: string[] })[0])[0];
          this.error = firstError;
        } else {
          this.error = err.error?.message || 'Something went wrong';
        }

        this.snackBar.open(this.error, 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

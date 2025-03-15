import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  token: string | null = null;

  constructor(private authService: AuthService) {}

  login(): void {
    const credentials = { email: this.email, password: this.password };
    this.authService.login(credentials).subscribe({
      next: (response: { token: string | null; }) => {
        console.log('Logged in successfully', response);
        // Store the token (e.g., in localStorage or a service variable)
        this.token = response.token;
        if (typeof response.token === "string") {
          localStorage.setItem('api_token', response.token);
        }
      },
      error: (error: any) => console.error('Login failed', error)
    });
  }
}


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';

interface AuthResponse {
  token: string;
  user: { id: string; role: string; email: string; [key: string]: any };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(data: { email: string, password: string }): Observable<AuthResponse> {
    const startTime = Date.now();
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response: AuthResponse) => {
        if (response.token) {
          this.storeUserData(response.token, response.user);
        }
      }),
      finalize(() => {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        console.log(`API Request took ${timeTaken} ms`);
        if (timeTaken > 2000) {
          console.warn(`⚠️ The request took too long: ${timeTaken} ms`);
        }
      })
    );
  }

  googleLogin(idToken: string): Observable<AuthResponse> {
    if (!idToken) {
      throw new Error('Google ID Token is required');
    }
    const startTime = Date.now();
    return this.http.post<AuthResponse>(`${this.apiUrl}/google-manual-login`, { id_token: idToken }).pipe(
      tap((response: AuthResponse) => {
        if (response.token) {
          this.storeUserData(response.token, response.user);
        }
      }),
      finalize(() => {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        console.log(`Google Login took ${timeTaken} ms`);
      })
    );
  }

  googleRegister(idToken: string): Observable<AuthResponse> {
    if (!idToken) {
      throw new Error('Google ID Token is required');
    }
    const startTime = Date.now();
    return this.http.post<AuthResponse>(`${this.apiUrl}/google-manual-register`, { id_token: idToken }).pipe(
      tap((response: AuthResponse) => {
        if (response.token) {
          this.storeUserData(response.token, response.user);
        }
      }),
      finalize(() => {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        console.log(`Google Registration took ${timeTaken} ms`);
      })
    );
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password-reset`, { email });
  }

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  storeUserData(token: string, user: any): void {
    localStorage.setItem('auth_token', token);
    if (user?.id) {
      localStorage.setItem('user_id', user.id);
    }
    if (user?.role) {
      localStorage.setItem('user_role', user.role);
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

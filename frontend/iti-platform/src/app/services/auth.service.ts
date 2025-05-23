import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(data: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        if (response.token) {          
          localStorage.setItem('auth_token', response.token); 
          localStorage.setItem('user_role', response.user.role); 
          localStorage.setItem('user_id', response.user.id);
        }
      })
    );
  }
  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password-reset`, { email });
  }
  
  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }
  googleLogin(id_token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google-login`, { id_token });
  }
  
}

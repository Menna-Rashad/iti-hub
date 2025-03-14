import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL of your Laravel backend
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Login method that sends credentials and receives a token
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/login`, credentials);
  }
}

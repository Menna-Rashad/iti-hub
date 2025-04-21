import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('password_confirmation', userData.confirmPassword);
    formData.append('national_id', userData.national_id);
    if (userData.linkedin) formData.append('linkedin', userData.linkedin);
    if (userData.github) formData.append('github', userData.github);
    if (userData.profilePicture) formData.append('profilePicture', userData.profilePicture);

    return this.http.post(`${this.apiUrl}/register`, formData);
  }

  googleLogin(idToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google-login`, { id_token: idToken });
  }
}
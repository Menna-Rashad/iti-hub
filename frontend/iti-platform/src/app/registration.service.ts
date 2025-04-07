import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  national_id: string;
  linkedin?: string;
  github?: string;
  profilePicture?: File | null;
}

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUrl = 'http://127.0.0.1:8000/api/register';

  constructor(private http: HttpClient) {}

  registerUser(data: RegistrationData) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('password_confirmation', data.confirmPassword);
    formData.append('national_id', data.national_id);
    formData.append('linkedin', data.linkedin || '');
    formData.append('github', data.github || '');
    if (data.profilePicture) {
      formData.append('profilePicture', data.profilePicture);
    }

    return this.http.post(this.apiUrl, formData);
  }
}

import { Injectable } from '@angular/core';
import axios from 'axios';

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  linkedin: string;
  github: string;
  profilePicture: File;
}
@Injectable({
  providedIn: 'root'
})





export class RegistrationService {
// Replace with your actual backend URL
private apiUrl = 'http://localhost:8000/api/register';

async registerUser(data: RegistrationData): Promise<any> {
  // Create FormData to bundle text and file data
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('confirmPassword', data.confirmPassword);
  formData.append('linkedin', data.linkedin);
  formData.append('github', data.github);
  formData.append('profilePicture', data.profilePicture);

  try {
    const response = await axios.post(this.apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    // Throw error details so you can handle them in your component
    throw error.response ? error.response.data : error;
  }
}
}

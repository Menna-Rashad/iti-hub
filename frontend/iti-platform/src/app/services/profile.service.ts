import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://127.0.0.1:8000/api/profile';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, {
      headers: this.getHeaders()
    });
  }

  updateProfile(data: any): Observable<any> {
    // We do not need to set 'Content-Type' for 'multipart/form-data' because 
    // the browser will automatically set it when using FormData
    return this.http.post(`${this.apiUrl}/update`, data, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')!,
      'Accept': 'application/json'
    });
  }
}

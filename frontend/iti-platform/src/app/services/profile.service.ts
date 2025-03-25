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
    return this.http.get(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  updateProfile(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        // لا تضيف Content-Type، الـ browser بيحطها تلقائيًا!
      })
    });
  }
  

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
      'Accept': 'application/json'
    });
  }
}

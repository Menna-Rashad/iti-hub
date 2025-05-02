import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FollowService {
  private baseUrl = 'http://127.0.0.1:8000/api/users';

  constructor(private http: HttpClient) {}

  private auth() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('auth_token')!
      })
    };
  }

  checkStatus(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}/status`, this.auth());
  }

  follow(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/follow`, {}, this.auth());
  }

  unfollow(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/unfollow`, {}, this.auth());
  }
}

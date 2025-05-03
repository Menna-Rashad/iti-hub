import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getTrackCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tracks/count`);
  }

  getTotalUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/total-users`);
  }

  getNewUsersThisMonth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/recent-users-this-month`);
  }

  getPublicNews(): Observable<any> {
    return this.http.get(`${this.baseUrl}/public/news`);
  }
}

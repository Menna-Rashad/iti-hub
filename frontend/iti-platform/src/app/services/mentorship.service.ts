import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MentorshipService {
  private baseUrl = 'http://localhost:8000/api/mentorship';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('No auth token found!');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  bookSession(data: any): Observable<any> {
    console.log('🚀 Sending booking request:', data);
    return this.http.post(`${this.baseUrl}/book`, data, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(error => {
          console.error('🔴 API Error:', error);
          return throwError(() => new Error(error.error?.message || 'Server error occurred'));
        })
      );
  }

  getUserSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sessions`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  cancelSession(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/cancel/${id}`, {}, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  rateSession(id: number, rating: number, feedback: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/rate/${id}`, 
      { mentor_rating: rating, mentee_feedback: feedback },
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.error?.message || 'Server error occurred'));
  }
}

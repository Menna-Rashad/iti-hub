import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MentorshipService {
  private baseUrl = 'http://localhost:8000/api/mentorship';  // Backend API URL

  constructor(private http: HttpClient) {}

  // Get Authorization token from localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('No auth token found!');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // 🟢 Book a mentorship session
  bookSession(data: any): Observable<any> {
    console.log('🚀 Sending booking request:', data);
    return this.http.post(`${this.baseUrl}/book`, data, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('🔴 API Error:', error);
          return throwError(() => new Error(error.error?.message || 'Server error occurred'));
        })
      );
  }

  // 🟢 Get user sessions
  getUserSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sessions`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // 🟠 Cancel a mentorship session
  cancelSession(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/cancel/${id}`, {}, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ⭐ Rate a mentorship session
  rateSession(id: number, rating: number, feedback: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/rate/${id}`,
      { mentor_rating: rating, mentee_feedback: feedback },
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // 🗑 Delete a mentorship session
  deleteSession(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Common error handler method
  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.error?.message || 'Server error occurred'));
  }
}

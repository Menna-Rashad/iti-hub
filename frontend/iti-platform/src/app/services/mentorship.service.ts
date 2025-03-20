import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MentorshipService {
  private baseUrl = 'http://127.0.0.1:8000/api/mentorship'; // ✅ Laravel API Base URL

  constructor(private http: HttpClient) {}

  // 🔐 **Get Authorization Headers**
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    console.log('🔐 Stored Token:', token);

    if (!token) {
      console.error('⚠️ No auth token found!');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ==============================
  // 🟢 **Public User Functions**
  // ==============================

  /** ✅ Fetch all available mentorship sessions */
  getAvailableMentorships(): Observable<any> {
    console.log('📡 Fetching available mentorship sessions...');
    return this.http
      .get(`${this.baseUrl}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Fetch all sessions booked by the current user */
  getUserSessions(): Observable<any[]> {
    console.log('📡 Fetching user sessions...');
    return this.http
      .get<any[]>(`${this.baseUrl}/sessions`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Set user's interest status in a mentorship session */
  setInterestStatus(sessionId: number, status: string): Observable<any> {
    console.log(`📍 Setting interest status '${status}' for session ID: ${sessionId}`);
    return this.http
      .post(
        `${this.baseUrl}/${sessionId}/interest`,
        { interest_status: status },
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /** ✅ Mark user as attending a session */
  // ✅ Mark session as attending
markAsAttending(sessionId: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/${sessionId}/attend`, {}, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
}

  cancelMentorship(sessionId: number): Observable<any> {
    console.log(`🛑 Deleting session with ID: ${sessionId}`);
    return this.http
        .delete(`${this.baseUrl}/${sessionId}/delete`, { headers: this.getAuthHeaders() })
        .pipe(catchError(this.handleError));
}


  /** ✅ Submit feedback and rating for a session */
  giveFeedback(sessionId: number, feedback: string, rating: number): Observable<any> {
    console.log(`📝 Giving feedback for session ID: ${sessionId}`);
    return this.http
      .put(
        `${this.baseUrl}/${sessionId}/feedback`,
        { feedback, rating },
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  // ==============================
  // 🔵 **Mentor-Specific Functions**
  // ==============================

  /** ✅ Create a new mentorship session (Mentor Only) */
  createMentorship(mentorshipData: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}`, mentorshipData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Fetch all sessions created by the mentor */
  getMentorSessions(): Observable<any[]> {
    console.log('📡 Fetching mentor sessions...');
    return this.http
      .get<any[]>(`${this.baseUrl}/mentor-sessions`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Cancel a mentorship session (Mentor Only) */
  // ✅ Cancel session
cancelSession(sessionId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/${sessionId}/cancel`, {}, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
}


  /** ✅ Delete a mentorship session (Mentor Only) */
  deleteSession(sessionId: number): Observable<any> {
    console.log(`🗑 Deleting session ID: ${sessionId}`);
    return this.http
      .delete(`${this.baseUrl}/${sessionId}/delete`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Rate a mentorship session */
 // ✅ Rate session
 rateSession(sessionId: number, rating: number, feedback: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/${sessionId}/rate`, { 
      mentor_rating: rating, 
      mentee_feedback: feedback 
  }, { headers: this.getAuthHeaders() })
  .pipe(catchError(this.handleError));
}


  // ==============================
  // ❌ **Error Handling**
  // ==============================

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Unknown error occurred';
    if (error.error && error.error.message) {
        errorMessage = error.error.message;
    }
    console.error('🔴 API Error:', errorMessage);
    return throwError(() => new Error(errorMessage)); 
}

}

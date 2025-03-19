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

  // 🔐 Get Authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
console.log("🔐 Stored Token:", token);

    if (!token) {
        console.error('⚠️ No auth token found!');
        return new HttpHeaders();
    }
    return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    });
}


  // 🟢 **Fetch All Available Mentorship Sessions**
  getAvailableMentorships(): Observable<any> {
    console.log('📡 Fetching available mentorship sessions...');
    return this.http
      .get(`${this.baseUrl}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // 🟢 **Create a New Mentorship Session**
  createMentorship(mentorshipData: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}`, mentorshipData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));  // ✅ التأكد من التعامل مع الأخطاء بشكل صحيح
  }
  
  // 🟢 **Fetch Sessions for a Mentor**
  getMentorSessions(): Observable<any[]> {
    console.log('📡 Fetching mentor sessions...');
    return this.http
      .get<any[]>(`${this.baseUrl}/mentor-sessions`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
}

  
  // 🟢 **Book a Mentorship Session**
  bookSession(data: any): Observable<any> {
    console.log('📡 Sending session data:', data);
    return this.http.post(`${this.baseUrl}`, data, { headers: this.getAuthHeaders() })
      .pipe(catchError((error) => {
        console.error('❌ API Error:', error);
        return throwError(() => new Error(error.error?.message || 'Server error occurred'));
      }));
  }
  
  
  

  // 🟢 **Fetch User’s Booked Sessions**
  getUserSessions(): Observable<any[]> {
    console.log('📡 Fetching user sessions...');
    return this.http
      .get<any[]>(`${this.baseUrl}/sessions`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // 🟠 **Cancel a Mentorship Session**
  cancelSession(sessionId: number): Observable<any> {
    const url = `${this.baseUrl}/${sessionId}/cancel`; // The API endpoint should match this
    console.log(`📡 Sending cancel request for session ID: ${sessionId}`);
    return this.http.post(url, {}, { headers: this.getAuthHeaders() }).pipe(
        catchError(this.handleError)
    );
}


  // ⭐ **Rate a Mentorship Session**
  rateSession(sessionId: number, rating: number, feedback: string): Observable<any> {
    console.log(`🌟 Rating session ID ${sessionId} with ${rating} stars.`);
    return this.http
      .post(
        `${this.baseUrl}/rate/${sessionId}`,
        { mentor_rating: rating, mentee_feedback: feedback },
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  // 🗑 **Delete a Mentorship Session**
  deleteSession(sessionId: number): Observable<any> {
    console.log(`🗑 Deleting session ID: ${sessionId}`);
    return this.http
      .delete(`${this.baseUrl}/delete/${sessionId}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // 🔄 **Mark Attendance for a Session**
  markAsAttending(sessionId: number): Observable<any> {
    console.log(`✅ Marking attendance for session ID: ${sessionId}`);
    return this.http
      .put(`${this.baseUrl}/${sessionId}/attend`, {}, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // 🔄 **Update Interest in a Session**
  setInterestStatus(sessionId: number, status: string): Observable<any> {
    console.log(`📍 Setting interest status '${status}' for session ID: ${sessionId}`);
    return this.http
      .put(`${this.baseUrl}/${sessionId}/interest`, { interest_status: status }, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // 📝 **Submit Feedback on a Session**
  giveFeedback(sessionId: number, feedback: string, rating: number): Observable<any> {
    console.log(`📝 Giving feedback for session ID: ${sessionId}`);
    return this.http
      .put(`${this.baseUrl}/${sessionId}/feedback`, { feedback, rating }, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }
  
  cancelMentorship(sessionId: number): Observable<any> {
    console.log(`🛑 Deleting session with ID: ${sessionId}`);
    return this.http
      .delete(`${this.baseUrl}/${sessionId}/delete`, { headers: this.getAuthHeaders() }) // Ensure correct DELETE request
      .pipe(catchError(this.handleError));
  }
  

  
  
  // ❌ **Error Handling**
  private handleError(error: any) {
    let errorMessage = 'Unknown error occurred';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    console.error('🔴 API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));  // إرجاع خطأ واضح
  }
  
}

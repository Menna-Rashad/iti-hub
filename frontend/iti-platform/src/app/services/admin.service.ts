import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8000/api/admin';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAdminDashboard(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboard`, { headers: this.getAuthHeaders() });
  }


  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`, { headers: this.getAuthHeaders() });
  }

  updateUserRole(id: number, role: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}/role`, { role }, { headers: this.getAuthHeaders() });
  }
  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/posts`, { headers: this.getAuthHeaders() });
  }
  
  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/${id}`, { headers: this.getAuthHeaders() });
  }
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8000/api/categories`, { headers: this.getAuthHeaders() });
  }  

  getAllComments(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/comments`, { headers: this.getAuthHeaders() });
  }


  deleteComment(commentId: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/comments/${commentId}`, { headers: this.getAuthHeaders() });
  }

  getAllSupportTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/support-tickets`, { headers: this.getAuthHeaders() });
  }  

  deleteSupportTicket(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/support-tickets/${id}`, { headers: this.getAuthHeaders() });
  }

  updateSupportTicketStatus(id: number, status: string): Observable<any> {
    return this.http.put(`http://localhost:8000/api/support-tickets/${id}/status`, { status }, { headers: this.getAuthHeaders() });
  }
  replyToSupportTicket(ticketId: number, formData: FormData) {
    return this.http.post<any>(`http://localhost:8000/api/admin/support-tickets/${ticketId}/reply`, formData, {
      headers: this.getAuthHeaders()
    });
  }
  
  getTicketReplies(ticketId: number) {
    return this.http.get<any>(`http://localhost:8000/api/admin/support-tickets/${ticketId}/replies`, {
      headers: this.getAuthHeaders()
    });
  }

  getAdminLogs() {
    return this.http.get<any[]>(`http://localhost:8000/api/admin/logs`, {
      headers: this.getAuthHeaders()
    });
  }
}

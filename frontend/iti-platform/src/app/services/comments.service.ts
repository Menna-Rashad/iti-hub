import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8000/api/forum';

  constructor(private http: HttpClient) {}

  getComments(postId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${postId}/comments`);
  }

  addComment(postId: number, commentData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const payload = {
      post_id: postId,
      ...commentData
    };
  
    return this.http.post(`${this.apiUrl}/posts/${postId}/comments`, payload, { headers });
  }

  updateComment(commentId: number, commentData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/comments/${commentId}`, commentData, { headers });
  }

  deleteComment(commentId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/comments/${commentId}`, { headers });
  }
}
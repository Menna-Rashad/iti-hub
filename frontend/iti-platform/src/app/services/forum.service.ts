import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs'; // Import map from RxJS

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = 'http://localhost:8000/api/forum';

  constructor(private http: HttpClient) { }

  createPost(postData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post(`${this.apiUrl}/posts`, postData, { headers });
  }
  
  getPosts(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/posts`, { headers });
  }
  
  getPost(id: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/posts/${id}`, { headers });
  }
  

  searchPosts(query: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/posts/search`, { params: { query }, headers });
  }

  vote(voteData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/vote`, voteData, { headers }).pipe(
      map((response: any) => ({
        upvotes: response.upvotes, // Match your API response
        downvotes: response.downvotes, // Match your API response
        action: response.action || 'added' // Default to 'added' if not provided; adjust based on your API
      }))
    );
  }

  createComment(postId: number, commentData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/posts/${postId}/comments`, commentData, { headers });
  }

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:8000/api/user', { headers });
  }
  
  deleteComment(commentId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/comments/${commentId}`, { headers });
  }
  
  updateComment(commentId: number, data: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/comments/${commentId}`, data, { headers });
  }

  // إضافة دوال التحديث والحذف للـ Post
  updatePost(postId: number, data: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/posts/${postId}`, data, { headers });
  }

  deletePost(postId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/posts/${postId}`, { headers });
  }
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = 'http://localhost:8000/api/forum';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createPost(postData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, postData, { headers: this.getAuthHeaders() });
  }

  getPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`, { headers: this.getAuthHeaders() });
  }

  getPost(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${id}`, { headers: this.getAuthHeaders() });
  }

  updatePost(postId: number | string, data: any): Observable<any> {
    const isFormData = data instanceof FormData;

    if (isFormData) {
      data.append('_method', 'PUT');
      return this.http.post(`${this.apiUrl}/posts/${postId}`, data, { headers: this.getAuthHeaders() });
    } else {
      return this.http.put(`${this.apiUrl}/posts/${postId}`, data, { headers: this.getAuthHeaders() });
    }
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${postId}`, { headers: this.getAuthHeaders() });
  }

  searchPosts(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/search`, { params: { query }, headers: this.getAuthHeaders() });
  }

  vote(voteData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/vote`, voteData, { headers: this.getAuthHeaders() }).pipe(
      map((response: any) => ({
        upvotes: response.upvotes,
        downvotes: response.downvotes,
        action: response.action || 'added'
      }))
    );
  }

  createComment(postId: number, commentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts/${postId}/comments`, commentData, { headers: this.getAuthHeaders() });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comments/${commentId}`, { headers: this.getAuthHeaders() });
  }

  updateComment(commentId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/comments/${commentId}`, data, { headers: this.getAuthHeaders() });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get('http://localhost:8000/api/user', { headers: this.getAuthHeaders() });
  }

  getTopContributors(): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:8000/api/top-contributors/all-users-scores');
  }

  getCategories(): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:8000/api/categories');
  }
}

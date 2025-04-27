import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = 'http://localhost:8000/api/forum';

  constructor(private http: HttpClient) {}

  createPost(postData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

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

  updatePost(postId: string, data: FormData): Observable<any> {
    const token = localStorage.getItem('auth_token');
  
    data.append('_method', 'PUT'); 
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post(`${this.apiUrl}/posts/${postId}`, data, { headers });
  }
  
  deletePost(postId: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/posts/${postId}`, { headers });
  }
  

  searchPosts(query: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/posts/search`, { params: { query }, headers });
  }

  vote(voteData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/vote`, voteData, { headers });
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

  getTopContributors(): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:8000/api/top-contributors/all-users-scores');
  }

  // جلب الفئات من الـ API
  getCategories(): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:8000/api/categories');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

getPosts(): Observable<any> {
  const token = localStorage.getItem('auth_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.apiUrl}/posts`, { headers });
}

createPost(postData: any) {
  const token = localStorage.getItem('auth_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post(`${this.apiUrl}/posts`, postData, { headers });
}

getPost(id: string): Observable<any> {
  const token = localStorage.getItem('auth_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.apiUrl}/forum/posts/${id}`, { headers }); 
}

  getComments(postId: string) {
    return this.http.get(`${this.apiUrl}/posts/${postId}/comments`);
  }

  createComment(commentData: any) {
    return this.http.post(`${this.apiUrl}/forum/comments`, commentData);
  }
  updatePost(postId: string, data: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/forum/posts/${postId}`, data, { headers });
  }
  getCategories() {
    return this.http.get(`${this.apiUrl}/categories`);
  }
  
  
}
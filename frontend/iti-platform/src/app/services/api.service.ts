import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // جلب كل البوستات
  getPosts(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/posts`, { headers });
  }

  // إنشاء بوست جديد
  createPost(postData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/posts`, postData, { headers });
  }

  // جلب بوست بناءً على ID
  getPost(id: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/forum/posts/${id}`, { headers }); 
  }

  // جلب التعليقات الخاصة بالبوست
  getComments(postId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${postId}/comments`);
  }

  // إنشاء تعليق جديد
  createComment(commentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forum/comments`, commentData);
  }

  // تحديث البوست
  updatePost(postId: string, data: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/forum/posts/${postId}`, data, { headers });
  }

  // جلب التصنيفات
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  deletePost(postId: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/forum/posts/${postId}`, { headers });
  }   
  
}

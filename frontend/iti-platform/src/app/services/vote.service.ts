import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private apiUrl = 'http://localhost:8000/api/forum/vote'; // المسار المعدل

  constructor(private http: HttpClient) { }

  // إرسال تصويت (upvote/downvote) للبوست أو التعليق
  handleVote(target_type: 'post' | 'comment', target_id: string, vote_type: 'upvote' | 'downvote'): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post(
      this.apiUrl,
      {
        target_type: target_type,
        target_id: target_id,
        vote_type: vote_type
      },
      { headers }
    ).pipe(
      // تحديث القيم في الواجهة مباشرة بعد التصويت
      tap(response => {
        // هنا يمكنك إضافة الكود لتحديث القيم مثل upvotes و downvotes على البوست أو التعليق مباشرة في الواجهة.
      })
    );
  }
  
}

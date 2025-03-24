import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
    private apiUrl = 'http://localhost:8000/api/forum/vote'; // المسار المعدل
  
    constructor(private http: HttpClient) { }
  
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
          );
          
      }
      
    }
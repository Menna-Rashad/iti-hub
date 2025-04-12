import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private apiUrl = 'http://localhost:8000/api/forum/vote';
  private jobVoteUrl = 'http://localhost:8000/api/jobs/vote';

  constructor(private http: HttpClient) {}

  handleVote(target_type: 'post' | 'comment' | 'job', target_id: number, vote_type: 'upvote' | 'downvote'): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const url = target_type === 'job' ? this.jobVoteUrl : this.apiUrl;

    return this.http.post(
      url,
      {
        target_type: target_type,
        target_id: target_id,
        vote_type: vote_type
      },
      { headers }
    ).pipe(
      map((response: any) => ({
        upvotes: response.upvotes,
        downvotes: response.downvotes,
        action: response.action || (response.upvotes === 0 && response.downvotes === 0 ? 'removed' : 'added')
      }))
    );
  }
}
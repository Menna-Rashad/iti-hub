import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TrackService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/tracks';

  getAllTracks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  searchTracksByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?name=${name}`);
  }

  getTracksCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/count`);
  }
}

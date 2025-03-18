import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private apiUrl = 'http://127.0.0.1:8000/api/jobs'; // API URL

  constructor(private http: HttpClient) {}

   // Get All Jobs
   getJobs(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}

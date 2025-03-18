import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = 'http://localhost:8000/api/jobs';

  constructor(private http: HttpClient) {}

  // جلب الوظائف
  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // إضافة وظيفة جديدة
  createJob(jobData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, jobData);
  }
}

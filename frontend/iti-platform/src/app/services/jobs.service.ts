import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Job {
  id: number;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  jobState: string;
  salaryRange: string;
  applyLink: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) { }

  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  createJob(job: Omit<Job, 'id' | 'createdAt'>): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job);
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OpenProject {
  id?: number;
  name: string;
  description: string;
  technologies?: string;
  github_url?: string;
  status: 'under_development' | 'completed' | 'in_review';
  category: string;
  project_file?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OpenProjectService {
  private apiUrl = 'http://localhost:8000/api/open-projects';

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<OpenProject[]> {
    return this.http.get<OpenProject[]>(this.apiUrl);
  }

  createProject(project: OpenProject): Observable<OpenProject> {
    return this.http.post<OpenProject>(this.apiUrl, project);
  }

  updateProject(id: number, project: OpenProject): Observable<OpenProject> {
    return this.http.put<OpenProject>(`${this.apiUrl}/${id}`, project);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Track {
  id: number;
  group_title: string;
  subgroup_title: string;
  track_title: string;
  slug: string;
  description: string;
  prerequisites: string[];
  delivery_approach: string;
  eligible_applicants: string[];
  selection_process: string[];
  deliverables: string;
  job_profiles: string[];
  certifications: string[];
  fundamental_courses: string[];
  core_courses: string[];
  soft_skills_courses: string[];
  targeted_outcomes: string[];
  program_hours: number;
  pdf_path: string;
}

@Injectable({
  providedIn: 'root'
})
export class TracksService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAllTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.baseUrl}/tracks`);
  }

  getTrackBySlug(slug: string): Observable<Track> {
    return this.http.get<Track>(`${this.baseUrl}/tracks/${slug}`);
  }
}

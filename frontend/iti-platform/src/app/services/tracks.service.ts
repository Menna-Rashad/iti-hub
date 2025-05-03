import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@angular/core';

export interface Department {
  id: number;
  name: string;
  slug: string;
}

export interface Program {
  id: number;
  name: string;
  slug: string;
}

export interface Track {
  id: number;
  name: string;
  slug: string;
  program_id: number;
  department_id: number;
  description?: string;
  program?: Program;
  department?: Department;
}

export interface CreateTrackDto {
  name: string;
  slug: string;
  program_id: number;
  department_id: number;
  description?: string;
}

export interface UpdateTrackDto extends Partial<CreateTrackDto> {}

@Injectable({ providedIn: 'root' })
export class TracksService {
  /** Base URL for admin endpoints */
  private readonly base = 'http://127.0.0.1:8000/api/admin';

  /** Shared Axios instance with cookie support */
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: this.base,
      withCredentials: true
    });

    // Automatically attach Bearer token if present
    this.http.interceptors.request.use(config => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers!['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
  }

  /** GET /api/admin/tracks */
  getAll(): Promise<Track[]> {
    return this.http.get<Track[]>('/tracks').then(r => r.data);
  }

  /** GET /api/admin/programs */
  getPrograms(): Promise<Program[]> {
    return this.http.get<Program[]>('/programs').then(r => r.data);
  }

  /** GET /api/admin/departments */
  getDepartments(): Promise<Department[]> {
    return this.http.get<Department[]>('/departments').then(r => r.data);
  }

  /** POST /api/admin/tracks */
  create(dto: CreateTrackDto): Promise<Track> {
    return this.http.post<Track>('/tracks', dto).then(r => r.data);
  }

  /** PUT /api/admin/tracks/{id} */
  update(id: number, dto: UpdateTrackDto): Promise<Track> {
    return this.http.put<Track>(`/tracks/${id}`, dto).then(r => r.data);
  }

  /** DELETE /api/admin/tracks/{id} */
  delete(id: number): Promise<void> {
    return this.http.delete(`/tracks/${id}`).then(() => void 0);
  }
}

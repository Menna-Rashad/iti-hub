/* ===================================================================
   AnnouncementService  –  uses /admin/news  +  /public/news
   Injects Bearer <token> on every request
   =================================================================== */
   import axios, { AxiosInstance } from 'axios';
   import { Injectable } from '@angular/core';
   
   export interface News {
     id: number;
     title: string;
     content: string;
     image: string | null;
     created_at: string;
   }
   
   export interface CreateNewsDto {
     title: string;
     content: string;
     image?: File;
     [k: string]: any;
   }
   export interface UpdateNewsDto {
     title?: string;
     content?: string;
     image?: File | null;
     [k: string]: any;
   }
   
   @Injectable({ providedIn: 'root' })
   export class AnnouncementService {
   
     private readonly base = 'http://127.0.0.1:8000/api';
   
     /** one shared Axios instance */
     private http: AxiosInstance = axios.create({
       baseURL: this.base,
       withCredentials: true
     });
   
     constructor() {
       /* 🔑 inject stored token */
       this.http.interceptors.request.use(cfg => {
         const token = localStorage.getItem('auth_token');
         if (token) cfg.headers!['Authorization'] = `Bearer ${token}`;
         return cfg;
       });
     }
   
     /* ========== ADMIN ROUTES (require Bearer) ========== */
     getAll()                           { return this.http.get <News[]>('/admin/news').then(r => r.data); }
     create(dto: CreateNewsDto)         { return this.http.post<News>('/admin/news', this.toFD(dto)).then(r => r.data); }
     update(id: number, dto: UpdateNewsDto) {
       return this.http.post<News>(`/admin/news/${id}?_method=PUT`, this.toFD(dto)).then(r => r.data);
     }
     delete(id: number)                 { return this.http.delete(`/admin/news/${id}`).then(() => void 0); }
   
     /* ------------- helpers ------------- */
     private toFD(obj: Record<string, any>): FormData {
       const fd = new FormData();
       Object.entries(obj).forEach(([k, v]) => {
         if (v !== undefined && v !== null) fd.append(k, v as Blob | string);
       });
       return fd;
     }
   }
   
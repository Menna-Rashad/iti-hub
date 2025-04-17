import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {
  private dashboardUrl = 'http://127.0.0.1:8000/api/user/dashboard';
  private tasksUrl = 'http://127.0.0.1:8000/api/tasks';

  constructor(private http: HttpClient) {}

  // 📊 جلب بيانات الداشبورد بالكامل
  getDashboardData(): Observable<any> {
    return this.http.get<any>(this.dashboardUrl);
  }

  // ✅ إنشاء مهمة جديدة
  createTask(task: any): Observable<any> {
    return this.http.post<any>(this.tasksUrl, task);
  }

  // ✏️ تعديل مهمة
  updateTask(task: any): Observable<any> {
    return this.http.put<any>(`${this.tasksUrl}/${task.id}`, {
      title: task.title,
      status: task.status
    });
  }

  // ❌ حذف مهمة
  deleteTask(taskId: number): Observable<any> {
    return this.http.delete<any>(`${this.tasksUrl}/${taskId}`);
  }

  // 🗂️ (اختياري) جلب جميع المهام لو استخدمتهم مستقلاً
  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.tasksUrl);
  }
}

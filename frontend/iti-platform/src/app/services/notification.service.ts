import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Notification {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  private apiUrl = 'http://localhost:8000/api/notifications'; // Updated to a default Laravel local URL

  constructor(private http: HttpClient) {
    this.loadNotifications();
  }

  private loadNotifications() {
    this.http.get<{ notifications: Notification[] }>(this.apiUrl).subscribe({
      next: (response) => {
        this.notificationsSubject.next(response.notifications);
        this.unreadCountSubject.next(response.notifications.filter(n => !n.is_read).length);
      },
      error: (err) => {
        console.error('Failed to load notifications:', err);
      }
    });
  }

  markAsRead(notificationId: number) {
    this.http.patch(`${this.apiUrl}/${notificationId}/read`, {}).subscribe({
      next: () => {
        const notifications = this.notificationsSubject.value.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        );
        this.notificationsSubject.next(notifications);
        this.unreadCountSubject.next(notifications.filter(n => !n.is_read).length);
      },
      error: (err) => {
        console.error('Failed to mark notification as read:', err);
      }
    });
  }

  markAllAsRead() {
    this.http.patch(`${this.apiUrl}/read-all`, {}).subscribe({
      next: () => {
        const notifications = this.notificationsSubject.value.map(n => ({ ...n, is_read: true }));
        this.notificationsSubject.next(notifications);
        this.unreadCountSubject.next(0);
      },
      error: (err) => {
        console.error('Failed to mark all notifications as read:', err);
      }
    });
  }

  clearAll() {
    this.http.delete(`${this.apiUrl}/clear-all`).subscribe({
      next: () => {
        this.notificationsSubject.next([]);
        this.unreadCountSubject.next(0);
      },
      error: (err) => {
        console.error('Failed to clear all notifications:', err);
      }
    });
  }

  deleteNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${notificationId}`).pipe(
      tap({
        next: () => {
          this.loadNotifications(); // Refresh notifications after deletion
        },
        error: (err) => {
          console.error('Failed to delete notification:', err);
        }
      })
    );
  }
}
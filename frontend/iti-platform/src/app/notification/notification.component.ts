import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService, Notification } from '../services/notification.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    MatSnackBarModule
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  menuOpen: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
      })
    );

    this.subscriptions.add(
      this.notificationService.unreadCount$.subscribe(unreadCount => {
        this.unreadCount = unreadCount;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId);
    this.snackBar.open('Notification marked as read', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['notification-snackbar', 'snackbar-success']
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
    this.snackBar.open('All notifications marked as read', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['notification-snackbar', 'snackbar-success']
    });
  }

  clearAll(): void {
    this.notificationService.clearAll();
    this.snackBar.open('All notifications cleared', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['notification-snackbar', 'snackbar-error']
    });
  }

  deleteNotification(notificationId: number): void {
    this.notificationService.deleteNotification(notificationId).subscribe({
      next: () => {
        this.snackBar.open('Notification deleted', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['notification-snackbar', 'snackbar-error']
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to delete notification', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['notification-snackbar', 'snackbar-error']
        });
      }
    });
  }

  formatTimestamp(date: string | Date): string {
    const now = new Date();
    const timestamp = new Date(date);
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  }

  getNotificationIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'maintenance_request_update':
        return 'home_repair_service';
      case 'rent_payment_confirmation':
        return 'attach_money';
      case 'lease_renewal_reminder':
        return 'schedule';
      default:
        return 'notifications';
    }
  }
}
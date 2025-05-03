// src/app/dashboard/logs/logs.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule }     from '@angular/material/card';
import { MatIconModule }     from '@angular/material/icon';

import { AdminService } from '../../services/admin.service';

/** shape returned by your API */
interface AdminLog {
  admin_name: string;
  action:     string;
  created_at: string;
}

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  logs: AdminLog[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  private loadLogs(): void {
    this.adminService.getAdminLogs().subscribe({
      next: (data: AdminLog[]) => {
        this.logs = data;
      },
      error: (err) => {
        console.error('Error loading logs:', err);
      }
    });
  }

  /** trackBy for *ngFor */
  trackLog(_: number, log: AdminLog): string {
    return log.created_at + log.admin_name;
  }
}

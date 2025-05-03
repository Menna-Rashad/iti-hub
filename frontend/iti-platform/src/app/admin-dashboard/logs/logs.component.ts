import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule }   from '@angular/material/card';
import { MatIconModule }   from '@angular/material/icon';

import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-logs',
  standalone: true,
  /* 👇 add MatCardModule & MatIconModule */
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

  /* dummy data for visual testing */
  logs = [
    { admin_name:'John Doe',  action:'Deleted user #25',        created_at:'2025-04-10T10:00:00Z' },
    { admin_name:'Jane Smith',action:'Updated post #102',       created_at:'2025-04-09T12:30:00Z' },
    { admin_name:'Ali Fahmy', action:'Changed ticket #56 Closed',created_at:'2025-04-08T15:45:00Z' }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    /* when backend ready:
       this.loadLogs();
    */
  }

  loadLogs() {
    this.adminService.getAdminLogs().subscribe({
      next: data => this.logs = data,
      error: err  => console.error('Error loading logs:', err)
    });
  }
}

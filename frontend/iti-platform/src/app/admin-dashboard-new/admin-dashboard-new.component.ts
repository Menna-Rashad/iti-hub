import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-dashboard-new',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard-new.component.html',
  styleUrls: ['./admin-dashboard-new.component.css']
})
export class AdminDashboardNewComponent implements OnInit {
  dashboardData: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAdminDashboard().subscribe((data) => {
      this.dashboardData = data;
    });
  }
}
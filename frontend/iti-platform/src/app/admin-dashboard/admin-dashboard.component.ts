import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private users: any[] = [];
  posts: any[] = [];

  constructor(private adminService: AdminService,
    private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.loadPosts();
  }

  fetchUsers(): void {
    const userList = document.getElementById('user-list');
    const noUsersMessage = document.getElementById('no-users-message');

    if (userList) userList.innerHTML = '';

    this.adminService.getAdminDashboard().subscribe({
      next: (data) => {
        this.users = data.users;

        if (this.users.length > 0) {
          if (noUsersMessage) noUsersMessage.style.display = 'none';
          this.users.forEach(user => {
            this.addUserRow(user);
          });
        } else {
          if (noUsersMessage) noUsersMessage.style.display = 'block';
        }
      },
      error: () => {
        console.error('Error fetching admin data.');
      }
    });
  }

  loadPosts(): void {
    this.http.get<any[]>('http://localhost:8000/api/admin/posts').subscribe({
      next: (posts) => this.posts = posts,
      error: (err) => console.error(err)
    });
  }

  deletePost(postId: number): void {
    this.http.delete(`http://localhost:8000/api/admin/posts/${postId}`).subscribe({
      next: () => this.loadPosts(),
      error: (err) => alert('فشل الحذف!')
    });
  }

  addUserRow(user: any): void {
    const userList = document.getElementById('user-list');

    if (userList) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <span class="badge bg-${this.getRoleColor(user.role)}">${user.role}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
            <i class="fas fa-trash"></i>
          </button>
          <button class="btn btn-sm btn-warning" onclick="promoteUser(${user.id})">
            <i class="fas fa-user-plus"></i>
          </button>
          <button class="btn btn-sm btn-info" onclick="editUser(${user.id})">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      `;
      userList.appendChild(row);
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return 'danger';
      case 'mentor': return 'success';
      case 'graduate': return 'primary';
      case 'student': return 'info';
      default: return 'secondary';
    }
  }
}

// Global functions to handle user actions (can be moved to a service)
function deleteUser(id: number) {
  alert(`User ID ${id} will be deleted!`);
}

function promoteUser(id: number) {
  alert(`User ID ${id} will be promoted!`);
}

function editUser(id: number) {
  alert(`Editing User ID ${id}`);
}

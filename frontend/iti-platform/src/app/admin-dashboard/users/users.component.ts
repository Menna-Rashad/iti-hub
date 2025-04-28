import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  roles: string[] = ['user', 'admin'];
  searchTerm: string = '';
  filteredUsers: any[] = [];
  
  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar 
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data; 
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this.showToast('User deleted successfully ✅');
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  updateRole(userId: number, newRole: string) {
    if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      this.adminService.updateUserRole(userId, newRole).subscribe({
        next: () => {
          this.loadUsers();
          this.showToast('User role updated successfully ✅');
        },
        error: (err) => {
          console.error('Error updating user role:', err);
        }
      });
    }
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      (user.name?.toLowerCase().includes(term) || user.email?.toLowerCase().includes(term))
    );
  }
  
  clearSearch() {
    this.searchTerm = '';
    this.filteredUsers = this.users;
  }

  showToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, 
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }
}

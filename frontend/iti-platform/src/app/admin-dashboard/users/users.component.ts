// src/app/dashboard/users/users.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { RouterModule }              from '@angular/router';
import { FormsModule }               from '@angular/forms';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatCardModule }       from '@angular/material/card';
import { MatButtonModule }     from '@angular/material/button';
import { MatIconModule }       from '@angular/material/icon';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatSelectModule }     from '@angular/material/select';

import { AdminService } from '../../services/admin.service';

/* ---------- confirmation dialog ---------- */
@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CommonModule],
  template: `
    <h2 mat-dialog-title class="d-flex align-items-center gap-2">
      <mat-icon color="warn">warning</mat-icon>
      Confirm Action
    </h2>

    <div mat-dialog-content>{{ data.message }}</div>

    <div mat-dialog-actions class="justify-content-end gap-2">
      <button mat-stroked-button (click)="ref.close(false)">Cancel</button>
      <button mat-flat-button color="warn" (click)="ref.close(true)">
        {{ data.okText }}
      </button>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public ref: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string; okText: string }
  ) {}
}

/* ---------- shape returned by your API ---------- */
export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

/* ---------- main Users component ---------- */
@Component({
  standalone: true,
  selector: 'app-users',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ConfirmDialogComponent
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: AppUser[] = [];
  filteredUsers: AppUser[] = [];
  roles     = ['user', 'admin'];
  searchTerm = '';

  constructor(
    private adminService: AdminService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...data];
      },
      error: () => this.toast('❌ Failed to load users')
    });
  }

  deleteUser(id: number): void {
    this.openConfirm(`Delete user #${id}?`, 'Delete')
      .then(ok => {
        if (!ok) throw 'cancel';
        return this.adminService.deleteUser(id).toPromise();
      })
      .then(() => {
        this.toast('User deleted ✅');
        this.loadUsers();
      })
      .catch(() => {
        /* cancelled or error */
      });
  }

  updateRole(userId: number, newRole: string): void {
    this.openConfirm(`Change role to ${newRole}?`, 'Update')
      .then(ok => {
        if (!ok) throw 'cancel';
        return this.adminService.updateUserRole(userId, newRole).toPromise();
      })
      .then(() => {
        this.toast('Role updated ✅');
        this.loadUsers();
      })
      .catch(() => {
        /* cancelled or error */
      });
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredUsers = [...this.users];
  }

  /** Returns the Bootstrap badge color for a given role */
  getRoleColor(role: string): 'primary' | 'danger' {
    return role === 'admin' ? 'danger' : 'primary';
  }

  /** trackBy for ngFor */
  trackUser(_: number, user: AppUser): number {
    return user.id;
  }

  /** show a snackbar message */
  private toast(msg: string): void {
    this.snack.open(msg, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  /** confirmation dialog helper */
  private openConfirm(message: string, okText: string): Promise<boolean> {
    return this.dialog
      .open(ConfirmDialogComponent, {
        width: '360px',
        data: { message, okText }
      })
      .afterClosed()
      .toPromise();
  }
}

/* ---------- users.component.ts (fixed) ----------------------------- */
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { MatCardModule }   from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AdminService } from '../../services/admin.service';

/* ---------- helper interface ---------- */
interface AppUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

/* ---------- confirmation dialog ---------- */
@Component({
  standalone: true,
  imports:[MatDialogModule, MatButtonModule, MatIconModule, CommonModule],
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

/* ---------- main Users component ---------- */
@Component({
  selector: 'app-users',
  standalone: true,
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
  roles: string[] = ['user', 'admin'];
  searchTerm = '';

  constructor(
    private adminService: AdminService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.users = [
      { id: 1, name:'John Doe',  email:'john@example.com',  role:'admin', created_at:'2025-04-01T10:00:00Z' },
      { id: 2, name:'Jane Smith',email:'jane@example.com', role:'user',  created_at:'2025-04-02T12:00:00Z' },
      { id: 3, name:'Ali Fahmy', email:'ali@example.com', role:'user',  created_at:'2025-04-03T14:00:00Z' }
    ];
    this.filteredUsers = [...this.users];
    // production: this.loadUsers();
  }

  /* ---------------- data loaders ---------------- */
  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: d => { this.users = d; this.filteredUsers = d; },
      error: e => console.error('Error loading users:', e)
    });
  }

  /* ---------------- deletion -------------------- */
  deleteUser(id: number) {
    this.openConfirm(`Delete user #${id}?`, 'Delete').then(ok => {
      if (!ok) return;
      this.filteredUsers = this.filteredUsers.filter(u => u.id !== id);
      this.toast('User deleted ✅');
    });
  }

  /* ---------------- role change ---------------- */
  updateRole(userId: number, newRole: string) {
    this.openConfirm(`Change role to ${newRole}?`, 'Update').then(ok => {
      if (!ok) return;
      this.filteredUsers = this.filteredUsers.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      );
      this.toast('Role updated ✅');
    });
  }

  /* ---------------- search / filter ------------- */
  filterUsers() {
    const t = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.name?.toLowerCase().includes(t) || u.email?.toLowerCase().includes(t)
    );
  }
  clearSearch() { this.searchTerm=''; this.filteredUsers=[...this.users]; }

  /* ---------------- helpers --------------------- */
  toast(msg: string) {
    this.snack.open(msg,'Close',{
      duration:3000,
      verticalPosition:'top',
      panelClass:['custom-snackbar']
    });
  }
  getRoleColor(role:string){ return role==='admin' ? 'danger' : 'primary'; }
  trackUser(_:number,u:AppUser){ return u.id; }

  /* ------------ open confirm dialog ------------ */
  private openConfirm(message:string, okText:string):Promise<boolean>{
    return this.dialog.open(ConfirmDialogComponent,{
      width:'360px',
      data:{message, okText}
    }).afterClosed().toPromise();
  }
}

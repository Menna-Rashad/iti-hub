// src/app/dashboard/posts/posts.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { RouterModule }              from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatCardModule }       from '@angular/material/card';
import { MatButtonModule }     from '@angular/material/button';
import { MatIconModule }       from '@angular/material/icon';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatSelectModule }     from '@angular/material/select';

import { AdminService } from '../../services/admin.service';

/* ---------- tiny confirm dialog ---------- */
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

/** shape returned by your API */
interface Post {
  id: number;
  title: string;
  content: string;
  category_id: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-posts',
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
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  categories: Category[] = [];

  searchTerm = '';
  selectedCategory = 'all';

  selectedPost: Post | null = null;
  showModal = false;

  constructor(
    private admin: AdminService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.loadCategories();
  }

  /** Fetch posts */
  private loadPosts(): void {
    this.admin.getAllPosts().subscribe({
      next: posts => this.posts = posts,
      error: () => this.toast('❌ Failed loading posts')
    });
  }

  /** Fetch categories */
  private loadCategories(): void {
    this.admin.getCategories().subscribe({
      next: cats => this.categories = cats,
      error: () => this.toast('❌ Failed loading categories')
    });
  }

  /** Resolve name from ID */
  getCategoryName(id: number): string {
    return this.categories.find(c => c.id === id)?.name || 'Unknown';
  }

  /** Filter logic drives the template’s *ngFor="filteredPosts()" */
  filteredPosts(): Post[] {
    const term = this.searchTerm.toLowerCase();
    return this.posts.filter(p => {
      const matchesSearch =
        p.title.toLowerCase().includes(term) ||
        p.content.toLowerCase().includes(term);
      const matchesCat =
        this.selectedCategory === 'all' ||
        this.getCategoryName(p.category_id) === this.selectedCategory;
      return matchesSearch && matchesCat;
    });
  }

  /** Reset filters */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
  }

  /** Open details */
  openPostModal(p: Post): void {
    this.selectedPost = p;
    this.showModal = true;
  }

  /** Close details */
  closeModal(): void {
    this.selectedPost = null;
    this.showModal = false;
  }

  /** Delete with confirm */
  deletePost(id: number): void {
    this.openConfirm(`Delete post #${id}?`, 'Delete').then(ok => {
      if (!ok) return;
      this.admin.deletePost(id).subscribe({
        next: () => {
          this.toast('Post deleted ✅');
          this.loadPosts();
        },
        error: () => this.toast('❌ Delete failed')
      });
    });
  }

  /** Show snackbar */
  private toast(msg: string): void {
    this.snack.open(msg, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  /** Confirm wrapper */
  private openConfirm(message: string, okText: string): Promise<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: { message, okText }
    }).afterClosed().toPromise();
  }

  /** trackBy for performance */
  trackPost(_: number, p: Post): number {
    return p.id;
  }
}

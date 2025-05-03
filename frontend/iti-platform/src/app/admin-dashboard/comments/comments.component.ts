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

/* ---------- API shapes ---------- */
interface AppPost {
  id: number;
  title: string;
}

interface AppComment {
  id: number;
  content: string;
  user: { name: string };
  post_id: number;
  created_at: string;
}

/* ---------- main Comments component ---------- */
@Component({
  selector: 'app-comments',
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
    ConfirmDialogComponent
  ],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  posts: AppPost[] = [];
  comments: AppComment[] = [];
  filteredComments: AppComment[] = [];
  searchTerm = '';

  selectedComment: AppComment | null = null;
  showModal = false;

  constructor(
    private admin: AdminService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.loadComments();
  }

  /** Load all posts for title lookup */
  private loadPosts(): void {
    this.admin.getAllPosts().subscribe({
      next: posts => this.posts = posts,
      error: () => this.toast('❌ Failed loading posts')
    });
  }

  /** Load comments list */
  private loadComments(): void {
    this.admin.getAllComments().subscribe({
      next: comments => {
        this.comments = comments;
        this.filteredComments = [...comments];
      },
      error: () => this.toast('❌ Failed loading comments')
    });
  }

  /** Get post title by ID */
  getPostTitle(id: number): string {
    return this.posts.find(p => p.id === id)?.title || 'Unknown Post';
  }

  /** Filter comments by content or author */
  filterComments(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredComments = this.comments.filter(c =>
      c.content.toLowerCase().includes(term) ||
      c.user.name.toLowerCase().includes(term)
    );
  }

  /** Reset the search */
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredComments = [...this.comments];
  }

  /** Show comment detail modal */
  openModal(c: AppComment): void {
    this.selectedComment = c;
    this.showModal = true;
  }

  /** Close detail modal */
  closeModal(): void {
    this.selectedComment = null;
    this.showModal = false;
  }

  /** Delete a comment */
  deleteComment(id: number): void {
    this.openConfirm(`Delete comment #${id}?`, 'Delete').then(ok => {
      if (!ok) return;
      this.admin.deleteComment(id).subscribe({
        next: () => {
          this.toast('Comment deleted ✅');
          this.loadComments();
        },
        error: () => this.toast('❌ Delete failed')
      });
    });
  }

  /** Show a MatSnackBar */
  private toast(msg: string): void {
    this.snack.open(msg, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  /** Confirmation wrapper */
  private openConfirm(message: string, okText: string): Promise<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: { message, okText }
    })
    .afterClosed()
    .toPromise();
  }

  /** trackBy for performance */
  trackComment(_: number, c: AppComment): number {
    return c.id;
  }
}

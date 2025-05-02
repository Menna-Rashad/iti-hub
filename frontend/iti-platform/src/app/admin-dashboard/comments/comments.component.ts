import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule }   from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';

import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {

  /* ---------------- Dummy data ---------------- */
  posts = [
    { id: 101, title: 'Welcome to the Forum' },
    { id: 102, title: 'How to Get Started' },
    { id: 103, title: 'Community Guidelines' },
  ];

  comments = [
    {
      id: 5,
      content: 'Great post! Really helped me understand the basics of the platform.',
      user: { name: 'John Doe' },
      post_id: 101,
      created_at: '2025-04-03T10:15:00Z',
    },
    {
      id: 6,
      content: 'Appreciate the insights—super useful for beginners like me.',
      user: { name: 'Jane Smith' },
      post_id: 102,
      created_at: '2025-04-04T09:20:00Z',
    },
    {
      id: 7,
      content:
        'Thanks for the community guidelines—very clear and helpful for new members!',
      user: { name: 'Ali Fahmy' },
      post_id: 103,
      created_at: '2025-04-05T14:30:00Z',
    },
  ];

  filteredComments = [...this.comments];
  searchTerm = '';

  /* modal state */
  selectedComment: any = null;
  showModal = false;

  constructor(private admin: AdminService,
              private snack: MatSnackBar) {}

  ngOnInit(): void {
    /** For real backend, uncomment: */
    // this.loadPosts();
    // this.loadComments();
  }

  /* --------- Optional real API calls --------- */
  loadPosts() { /* ... */ }
  loadComments() { /* ... */ }

  /* --------- Helpers & actions --------- */
  getPostTitle(id: number) {
    const p = this.posts.find(x => x.id === id);
    return p ? p.title : 'Unknown Post';
  }

  filterComments() {
    const t = this.searchTerm.toLowerCase();
    this.filteredComments = this.comments.filter(c =>
      c.content?.toLowerCase().includes(t) ||
      c.user?.name?.toLowerCase().includes(t)
    );
  }
  clearSearch() {
    this.searchTerm = '';
    this.filteredComments = [...this.comments];
  }

  openModal(c: any) { this.selectedComment = c; this.showModal = true; }
  closeModal()      { this.selectedComment = null; this.showModal = false; }

  /** Confirmation Snack‑bar delete **/
  deleteComment(id: number): void {

    const ref = this.snack.open(
      `Delete comment #${id}?`,
      'Delete',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['confirm-snackbar']   // blue accent bar
      }
    );

    ref.onAction().subscribe(() => {
      /* Dummy remove */
      this.comments = this.comments.filter(c => c.id !== id);
      this.filteredComments = [...this.comments];
      this.toast('Comment deleted ✅');

      /* Real call
      this.admin.deleteComment(id).subscribe({
        next: () => { this.loadComments(); this.toast('Comment deleted ✅'); }
      });
      */
    });
  }

  toast(msg: string) {
    this.snack.open(msg, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }
}

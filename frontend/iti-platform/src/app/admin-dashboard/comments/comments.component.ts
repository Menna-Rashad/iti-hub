import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatSnackBarModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: any[] = [];
  filteredComments: any[] = [];
  searchTerm: string = '';
  selectedComment: any = null;
  showModal: boolean = false;
  posts: any[] = [];

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadComments();
    this.loadPosts();
  }
  loadPosts() {
    this.adminService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
      }
    });
  }
  
  getPostTitle(postId: number): string {
    const post = this.posts.find(p => p.id === postId);
    return post ? post.title : 'Unknown Post';
  }
  
  loadComments() {
    this.adminService.getAllComments().subscribe({
      next: (data) => {
        this.comments = data;
        this.filteredComments = data;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
      }
    });
  }

  filterComments() {
    const term = this.searchTerm.toLowerCase();
    this.filteredComments = this.comments.filter(comment =>
      (comment.content?.toLowerCase().includes(term) || comment.user?.name?.toLowerCase().includes(term))
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredComments = this.comments;
  }

  openModal(comment: any) {
    this.selectedComment = comment;
    this.showModal = true;
  }

  closeModal() {
    this.selectedComment = null;
    this.showModal = false;
  }

  deleteComment(commentId: number) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.adminService.deleteComment(commentId).subscribe({
        next: () => {
          this.loadComments();
          this.showToast('Comment deleted successfully ✅');
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
        }
      });
    }
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

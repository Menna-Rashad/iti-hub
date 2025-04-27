import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  selectedPost: any = null;
  showModal: boolean = false;
  searchTerm: string = '';
  selectedCategory: string = 'all';
  categories: { id: number, name: string }[] = [];

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.loadCategories();
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
  

  loadCategories() {
    this.adminService.getCategories().subscribe({
      next: (data) => {
        this.categories = data; 
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }
  
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'No Category';
  }
    

  deletePost(id: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.adminService.deletePost(id).subscribe({
        next: () => {
          this.loadPosts();
          this.showToast('Post deleted successfully ✅');
        },
        error: (err) => {
          console.error('Error deleting post:', err);
        }
      });
    }
  }

  openPostModal(post: any) {
    this.selectedPost = post;
    this.showModal = true;
  }

  closeModal() {
    this.selectedPost = null;
    this.showModal = false;
  }

  showToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  filteredPosts() {
    return this.posts.filter(post => {
      const matchesSearch = (post.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                              post.content?.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesCategory = this.selectedCategory === 'all' || this.getCategoryName(post.category_id) === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }
  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'all';
  }
  
}

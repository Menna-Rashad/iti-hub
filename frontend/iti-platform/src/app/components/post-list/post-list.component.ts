import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  perPage: number = 5;
  searchQuery: string = '';
  categories: any[] = [];
  selectedCategoryId: number | null = null;
  selectedSort: string = 'newest';

  constructor(
    private forumService: ForumService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPaginatedPosts();
    this.getCategories(); 
  }
  getCategories(): void {
    this.forumService.getCategories().subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

loadPaginatedPosts(): void {
  this.forumService.getPostsPaginated(
    this.currentPage,
    this.perPage,
    this.selectedSort,
    this.selectedCategoryId || undefined 
  )
      .subscribe({
      next: (res: any) => {
        this.posts = res.data;
        this.totalPages = res.last_page;
      },
      error: (err: any) => {
        console.error('Error loading paginated posts:', err);
      },
    });
}

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadPaginatedPosts();
  }

  goToCreate(): void {
    this.router.navigate(['/posts/create']);
  }

search(): void {
  if (this.searchQuery.trim() === '') {
    this.loadPaginatedPosts();
    return;
  }

  this.forumService.searchPosts(this.searchQuery).subscribe({
    next: (response: any) => {
      this.posts = response.data || [];
      this.totalPages = 0; 
    },
    error: (err: any) => {
      console.error('Search error:', err);
    }
  });
}

}

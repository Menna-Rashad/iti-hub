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
  searchQuery: string = '';

  constructor(
    private forumService: ForumService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.forumService.getPosts().subscribe({
      next: (response: any) => {
        this.posts = response; // تأكدي إن API فعلاً بترجع array مش { data: [...] }
      },
      error: (error: any) => {
        console.error('Error loading posts:', error);
      }
    });
  }

  goToCreate(): void {
    this.router.navigate(['/posts/create']);
  }

  search(): void {
    if (this.searchQuery.trim() === '') {
      this.loadPosts();
      return;
    }

    this.forumService.searchPosts(this.searchQuery).subscribe({
      next: (response: any) => {
        this.posts = response.data || [];
      },
      error: (err: any) => {
        console.error('Search error:', err);
      }
    });
  }
}

import { Component } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class CreatePostComponent {
  postData = {
    title: '',
    content: '',
    category_id: 1,
    tags: ''
  };

  constructor(
    private forumService: ForumService,
    private router: Router
  ) { }

  submitPost(): void {
    if (!this.postData.title || !this.postData.content || !this.postData.category_id) {
      alert('Please fill in all required fields!');
      return;
    }

    this.forumService.createPost(this.postData).subscribe({
      next: (response) => {
        console.log('Post created successfully:', response);
        this.router.navigate(['/posts']);
      },
      error: (err) => {
        console.error('Error creating post:', err);
        alert('Failed to create the post!');
      }
    });
  }
}

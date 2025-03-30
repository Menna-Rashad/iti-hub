import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

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
    MatButtonModule,
    MatSelectModule
  ]
})
export class CreatePostComponent implements OnInit {
  postData = {
    title: '',
    content: '',
    category_id: null,
    tags: ''
  };

  categories = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Questions' },
    { id: 3, name: 'Feedback' }
  ];

  constructor(private forumService: ForumService, private router: Router) {}

  ngOnInit(): void {}

  submitPost(): void {
    if (!this.postData.title || !this.postData.content || !this.postData.category_id) {
      alert('Please fill in all required fields!');
      return;
    }

    this.forumService.createPost(this.postData).subscribe({
      next: () => this.router.navigate(['/main-content']),
      error: () => alert('Failed to create post.')
    });
  }
}

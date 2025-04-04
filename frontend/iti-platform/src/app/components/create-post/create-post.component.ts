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
  categories: any[] = [];
  postData = {
    title: '',
    content: '',
    category_id: null,
    tags: ''
  };
  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  // categories = [
  //   { id: 1, name: 'General' },
  //   { id: 2, name: 'Angular' },
  //   { id: 3, name: 'Feedback' },
  //   { id: 4, name: 'Laravel' }
  // ];
 
  constructor(private forumService: ForumService, private router: Router) {}

  ngOnInit(): void {
    this.getCategories();
  }
  getCategories(): void {
    this.forumService.getCategories().subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error('Error loading categories:', err),
    });
  }
  
  getCategoryName(id: number | null): string {
    const cat = this.categories.find(c => c.id === id);
    return cat ? cat.name : '';
  }
  
submitPost(): void {
  if (!this.postData.title || !this.postData.content || !this.postData.category_id) {
    alert('Please fill in all required fields!');
    return;
  }

  const formData = new FormData();
  formData.append('title', this.postData.title);
  formData.append('content', this.postData.content);
  formData.append('category_id', this.postData.category_id);
  formData.append('tags', this.postData.tags);

  this.selectedFiles.forEach(file => {
    formData.append('media[]', file);
  });

  this.forumService.createPost(formData).subscribe({
    next: () => this.router.navigate(['/main-content']),
    error: () => alert('Failed to create post.')
  });
}

onFileChange(event: any): void {
  this.selectedFiles = Array.from(event.target.files);
  this.previewUrls = [];

  this.selectedFiles.forEach(file => {
    const url = URL.createObjectURL(file);
    this.previewUrls.push(url);
  });
}

}

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

interface MediaFile extends File {
  preview?: string; // إضافة preview لكل ملف
}

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
  postData: {
    title: string;
    content: string;
    category_id: number | null;
    tags: string;
  } = {
    title: '',
    content: '',
    category_id: null,
    tags: ''
  };

  mediaFiles: MediaFile[] = [];

  categories: any[] = []; // الفئات التي سيتم تحميلها من الباك إند

  constructor(private forumService: ForumService, private router: Router) {}

  ngOnInit(): void {
    // جلب الفئات من الـ API عند تحميل المكون
    this.forumService.getCategories().subscribe(categories => {
      this.categories = categories; // حفظ الفئات المجلوبة في المصفوفة
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.mediaFiles = Array.from(event.target.files);

      // إضافة preview لكل ملف
      this.mediaFiles.forEach((file: MediaFile) => {
        file.preview = URL.createObjectURL(file);  // إضافة preview
      });
    }
  }

  removeFile(index: number): void {
    this.mediaFiles.splice(index, 1); // إزالة الملف من المصفوفة
  }

  submitPost(): void {
    if (!this.postData.title || !this.postData.content || !this.postData.category_id) {
      alert('Please fill in all required fields!');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.postData.title);
    formData.append('content', this.postData.content);
    formData.append('category_id', this.postData.category_id?.toString());
    formData.append('tags', this.postData.tags || '');

    this.mediaFiles.forEach(file => {
      formData.append('media[]', file);
    });

    this.forumService.createPost(formData).subscribe({
      next: () => this.router.navigate(['/main-content']),
      error: () => alert('Failed to create post.')
    });
  }
}

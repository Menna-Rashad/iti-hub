import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ForumService } from '../../services/forum.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class EditPostComponent implements OnInit {
  postId!: string;
  postForm!: FormGroup;
  existingMedia: string[] = [];
  newMediaFiles: File[] = [];
  categories: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id')!;
    this.forumService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.forumService.getPost(this.postId).subscribe(post => {
        this.postForm = this.fb.group({
          title: [post.title || ''],
          content: [post.content || ''],
          tags: [post.tags || ''],
          category_id: [post.category?.id || post.category_id]
        });
        this.existingMedia = post.media || [];
      });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.newMediaFiles = Array.from(input.files);
    }
  }

  removeMedia(file: string): void {
    this.existingMedia = this.existingMedia.filter(f => f !== file);
  }
  updatePost(): void {
    const formValue = this.postForm.value;
    console.log('form value:', formValue);
  
    const formData = new FormData();
  
    // ✅ تأكدي من وجود الـ form fields فعليًا
    formData.append('title', formValue['title']);
    formData.append('content', formValue['content']);
    formData.append('tags', formValue['tags']);
    formData.append('category_id', formValue['category_id'].toString());
  
    // ✅ تأكدي من إرسال existing media بشكل JSON String
    formData.append('existing_media', JSON.stringify(this.existingMedia || []));
  
    // ✅ ملفات جديدة
    this.newMediaFiles.forEach(file => {
      formData.append('media[]', file);
    });
  
    // ✅ أهم حاجة: إرسال `_method: PUT` عشان Laravel يفهم إن دي PUT
    formData.append('_method', 'PUT');
  
    // Call the update
    this.forumService.updatePost(this.postId, formData).subscribe({
      next: () => {
        alert('Post updated successfully');
        this.router.navigate(['/posts', this.postId]);
      },
      error: err => console.error('Update failed:', err)
    });
  }
  
  
}

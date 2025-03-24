import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class EditPostComponent implements OnInit {
  postId!: string;
  postForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id')!;
    this.api.getPost(this.postId).subscribe(post => {
      this.postForm = this.fb.group({
        title: [post.title],
        content: [post.content],
        tags: [post.tags],
        category_id: [post.category_id]
      });
    });
  }

  updatePost() {
    this.api.updatePost(this.postId, this.postForm.value).subscribe(() => {
      this.router.navigate(['/posts', this.postId]);
    });
  }
}

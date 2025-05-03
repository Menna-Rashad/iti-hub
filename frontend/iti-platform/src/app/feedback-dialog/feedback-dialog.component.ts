import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'; // ✅ هنا أضفنا MatDialogModule
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ForumService } from '../services/forum.service';

@Component({
  selector: 'app-feedback-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule // ✅ لازم علشان يتعرف على mat-dialog-content و mat-dialog-actions
  ],
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.css'],
})
export class FeedbackDialogComponent {
  type: 'question' | 'feedback' = 'question';
  content: string = '';
  submitted = false;

  constructor(
    private forumService: ForumService,
    private dialogRef: MatDialogRef<FeedbackDialogComponent>
  ) {}

  submit(): void {
    if (!this.content.trim()) {
      alert('Please write a suitable content.');
      return;
    }

    this.submitted = true;

    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

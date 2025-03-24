import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-comment-list',
  imports: [CommonModule, MatCardModule],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
})
export class CommentListComponent {
  @Input() comments: any[] = [];
}

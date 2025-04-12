import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Comment } from '../../../shared/models/comment.model';
import { ActionMenuComponent } from '../action-menu/action-menu.component';
import { VoteButtonsComponent } from '../vote-buttons/vote-buttons.component';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent {
  @Input() comments: Comment[] = [];
  @Input() loading = false;
  @Input() commentableType!: string;
  @Input() commentableId!: number;
} 
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Job } from '../../models/job.model';
import { ActionMenuComponent } from '../../../shared/components/action-menu/action-menu.component';
import { VoteButtonsComponent } from '../../../shared/components/vote-buttons/vote-buttons.component';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ActionMenuComponent,
    VoteButtonsComponent
  ],
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
  @Input() job!: Job;
  @Input() showFullContent = false;
  @Input() loading = false;
  @Input() currentUserId!: number;

  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() report = new EventEmitter<number>();
  @Output() voteUpdated = new EventEmitter<{
    id: number;
    upvotes: number;
    downvotes: number;
  }>();

  onEdit(): void {
    this.edit.emit(this.job.id);
  }

  onDelete(): void {
    this.delete.emit(this.job.id);
  }

  onReport(): void {
    this.report.emit(this.job.id);
  }

  onVoteUpdated(event: {
    targetType: 'post' | 'comment' | 'job';
    targetId: number;
    newCounts: { upvotes: number; downvotes: number };
    action: 'added' | 'removed';
  }): void {
    this.voteUpdated.emit({
      id: this.job.id,
      upvotes: event.newCounts.upvotes,
      downvotes: event.newCounts.downvotes
    });
  }
} 
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VoteButtonsComponent } from '../vote-buttons/vote-buttons.component';
import { JobCardComponent } from '../job-card/job-card.component';

export interface JobPost {
  id: number;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  jobState: string;
  salaryRange: string;
  createdAt: string;
  applyLink: string;
}

@Component({
  selector: 'app-job-post',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    VoteButtonsComponent,
    JobCardComponent
  ],
  templateUrl: './job-post.component.html',
  styleUrls: ['./job-post.component.css']
})
export class JobPostComponent {
  @Input() job!: JobPost;
  @Input() userName!: string;
  @Input() userAvatar!: string;
  @Input() currentUserId!: number;
  @Input() upvotes = 0;
  @Input() downvotes = 0;
  @Input() currentVote: number | null = null;

  @Output() showComments = new EventEmitter<void>();
  @Output() voteUpdated = new EventEmitter<number>();

  onVoteUpdated(vote: number) {
    this.voteUpdated.emit(vote);
  }
} 
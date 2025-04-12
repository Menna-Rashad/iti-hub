import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JobHeaderComponent } from '../job-header/job-header.component';
import { CommentListComponent } from '../../../shared/components/comment-list/comment-list.component';
import { CommentFormComponent } from '../../../shared/components/comment-form/comment-form.component';
import { JobService } from '../../services/job.service';
import { CommentService } from '../../../services/comments.service';
import { Job } from '../../models/job.model';
import { Comment } from '../../../shared/models/comment.model';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    JobHeaderComponent,
    CommentListComponent,
    CommentFormComponent
  ],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  job: Job | null = null;
  loading = true;
  comments: Comment[] = [];
  commentsLoading = true;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.loadJobDetails(+jobId);
      this.loadComments(+jobId);
    }
  }

  private loadJobDetails(jobId: number): void {
    this.jobService.getJobById(jobId).subscribe({
      next: (job) => {
        this.job = job;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.loading = false;
      }
    });
  }

  private loadComments(jobId: number): void {
    this.commentService.getComments(jobId.toString()).subscribe({
      next: (comments: Comment[]) => {
        this.comments = comments;
        this.commentsLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading comments:', error);
        this.commentsLoading = false;
      }
    });
  }

  onCommentAdded(comment: Comment): void {
    this.comments = [comment, ...this.comments];
  }
} 
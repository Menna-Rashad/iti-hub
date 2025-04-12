import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobDetailsComponent } from './job-details.component';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { JobService } from '../../services/job.service';
import { CommentService } from '../../shared/services/comment.service';
import { Job } from '../../models/job.model';
import { Comment } from '../../shared/models/comment.model';
import { of } from 'rxjs';

describe('JobDetailsComponent', () => {
  let component: JobDetailsComponent;
  let fixture: ComponentFixture<JobDetailsComponent>;
  let jobService: jasmine.SpyObj<JobService>;
  let commentService: jasmine.SpyObj<CommentService>;

  const mockJob: Job = {
    id: 1,
    title: 'Software Engineer',
    company_name: 'Tech Corp',
    location: 'Remote',
    job_type: 'full-time',
    job_state: 'remote',
    description: 'Looking for a skilled software engineer',
    requirements: 'Angular, TypeScript',
    salary_range: '100k-150k',
    apply_link: 'https://example.com/apply',
    created_at: '2024-04-12T00:00:00.000Z'
  };

  const mockComments: Comment[] = [
    {
      id: 1,
      content: 'Great opportunity!',
      user_id: 1,
      user_name: 'John Doe',
      user_avatar: 'avatar.jpg',
      commentable_type: 'Job',
      commentable_id: 1,
      created_at: '2024-04-12T00:00:00.000Z',
      updated_at: '2024-04-12T00:00:00.000Z'
    }
  ];

  beforeEach(async () => {
    const jobServiceSpy = jasmine.createSpyObj('JobService', ['getJobById']);
    const commentServiceSpy = jasmine.createSpyObj('CommentService', ['getComments']);

    await TestBed.configureTestingModule({
      imports: [
        JobDetailsComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        { provide: JobService, useValue: jobServiceSpy },
        { provide: CommentService, useValue: commentServiceSpy }
      ]
    }).compileComponents();

    jobService = TestBed.inject(JobService) as jasmine.SpyObj<JobService>;
    commentService = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;

    jobService.getJobById.and.returnValue(of(mockJob));
    commentService.getComments.and.returnValue(of(mockComments));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load job details and comments on init', () => {
    expect(jobService.getJobById).toHaveBeenCalledWith(1);
    expect(commentService.getComments).toHaveBeenCalledWith('Job', 1);
    expect(component.job).toEqual(mockJob);
    expect(component.comments).toEqual(mockComments);
    expect(component.loading).toBeFalse();
    expect(component.commentsLoading).toBeFalse();
  });

  it('should display job not found when job is null', () => {
    component.job = null;
    component.loading = false;
    fixture.detectChanges();

    const errorContainer = fixture.nativeElement.querySelector('.error-container');
    expect(errorContainer).toBeTruthy();
    expect(errorContainer.textContent).toContain('Job not found');
  });

  it('should add new comment to the list', () => {
    const newComment: Comment = {
      id: 2,
      content: 'New comment',
      user_id: 2,
      user_name: 'Jane Doe',
      user_avatar: 'avatar2.jpg',
      commentable_type: 'Job',
      commentable_id: 1,
      created_at: '2024-04-12T00:00:00.000Z',
      updated_at: '2024-04-12T00:00:00.000Z'
    };

    component.onCommentAdded(newComment);
    expect(component.comments).toEqual([newComment, ...mockComments]);
  });
}); 
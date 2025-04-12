import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobCardComponent } from './job-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { Job } from '../../models/job.model';

describe('JobCardComponent', () => {
  let component: JobCardComponent;
  let fixture: ComponentFixture<JobCardComponent>;

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
    created_at: '2024-04-12T00:00:00.000Z',
    user_id: 1,
    votes_count: 0,
    user_vote: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        JobCardComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JobCardComponent);
    component = fixture.componentInstance;
    component.job = mockJob;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display job title and company name', () => {
    const titleElement = fixture.nativeElement.querySelector('mat-card-title');
    const subtitleElement = fixture.nativeElement.querySelector('mat-card-subtitle');
    
    expect(titleElement.textContent).toContain(mockJob.title);
    expect(subtitleElement.textContent).toContain(mockJob.company_name);
  });

  it('should display job meta information', () => {
    const metaElements = fixture.nativeElement.querySelectorAll('.job-meta span');
    
    expect(metaElements[0].textContent).toContain(mockJob.job_type);
    expect(metaElements[1].textContent).toContain(mockJob.location);
    expect(metaElements[2].textContent).toContain(mockJob.job_state);
  });

  it('should display salary range when available', () => {
    const salaryElement = fixture.nativeElement.querySelector('.job-salary');
    expect(salaryElement.textContent).toContain(mockJob.salary_range);
  });

  it('should not display full content by default', () => {
    const descriptionElement = fixture.nativeElement.querySelector('.job-description');
    const requirementsElement = fixture.nativeElement.querySelector('.job-requirements');
    
    expect(descriptionElement).toBeNull();
    expect(requirementsElement).toBeNull();
  });

  it('should display full content when showFullContent is true', () => {
    component.showFullContent = true;
    fixture.detectChanges();

    const descriptionElement = fixture.nativeElement.querySelector('.job-description');
    const requirementsElement = fixture.nativeElement.querySelector('.job-requirements');
    
    expect(descriptionElement).toBeTruthy();
    expect(requirementsElement).toBeTruthy();
    expect(descriptionElement.textContent).toContain(mockJob.description);
    expect(requirementsElement.textContent).toContain(mockJob.requirements);
  });
}); 
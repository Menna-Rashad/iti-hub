import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobListComponent } from './job-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { JobService } from '../../services/job.service';
import { of } from 'rxjs';
import { Job } from '../../models/job.model';

describe('JobListComponent', () => {
  let component: JobListComponent;
  let fixture: ComponentFixture<JobListComponent>;
  let jobService: jasmine.SpyObj<JobService>;

  const mockJobs: Job[] = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      description: 'Looking for a skilled software engineer',
      requirements: ['Angular', 'TypeScript'],
      salary: '100k-150k',
      postedAt: new Date(),
      expiresAt: new Date(),
      isActive: true
    }
  ];

  beforeEach(async () => {
    const jobServiceSpy = jasmine.createSpyObj('JobService', ['getJobs']);

    await TestBed.configureTestingModule({
      declarations: [JobListComponent],
      imports: [
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterTestingModule
      ],
      providers: [
        { provide: JobService, useValue: jobServiceSpy }
      ]
    }).compileComponents();

    jobService = TestBed.inject(JobService) as jasmine.SpyObj<JobService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading state initially', () => {
    jobService.getJobs.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
  });

  it('should display jobs when loaded', () => {
    jobService.getJobs.and.returnValue(of(mockJobs));
    fixture.detectChanges();
    expect(component.jobs).toEqual(mockJobs);
    expect(component.isLoading).toBeFalse();
  });

  it('should show no jobs message when no jobs are available', () => {
    jobService.getJobs.and.returnValue(of([]));
    fixture.detectChanges();
    const noJobsElement = fixture.nativeElement.querySelector('.no-jobs');
    expect(noJobsElement).toBeTruthy();
  });

  it('should navigate to create job page when create button is clicked', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');
    const createButton = fixture.nativeElement.querySelector('button[mat-raised-button]');
    createButton.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/jobs/create']);
  });
}); 
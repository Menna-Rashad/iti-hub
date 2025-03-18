import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobsComponent } from './jobs.component';
import { JobService } from '../services/job.service';
import { of } from 'rxjs'; // Import the `of` function to mock observables

// Mock service for JobService
class MockJobService {
  getJobs() {
    // Mocked data returned by the service
    return of([
      { 
        title: 'Software Engineer', 
        company_name: 'Tech Company', 
        location: 'Remote', 
        job_type: 'Full-time', 
        job_state: 'Open', 
        salary_range: '$60,000 - $80,000', 
        apply_link: 'https://apply.com' 
      }
    ]);
  }
}

describe('JobsComponent', () => {
  let component: JobsComponent;
  let fixture: ComponentFixture<JobsComponent>;
  let jobService: JobService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobsComponent], // Component to test
      providers: [{ provide: JobService, useClass: MockJobService }] // Provide the mocked service
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsComponent);
    component = fixture.componentInstance;
    jobService = TestBed.inject(JobService); // Get the injected JobService instance
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch jobs on init', () => {
    spyOn(jobService, 'getJobs').and.callThrough(); // Spy on the getJobs method
    component.ngOnInit(); // Manually call ngOnInit to simulate component initialization
    expect(jobService.getJobs).toHaveBeenCalled(); // Check if getJobs was called
    expect(component.jobs.length).toBeGreaterThan(0); // Ensure jobs were fetched
  });

  it('should display jobs in the template', () => {
    component.jobs = [
      { 
        title: 'Software Engineer', 
        company_name: 'Tech Company', 
        location: 'Remote', 
        job_type: 'Full-time', 
        job_state: 'Open', 
        salary_range: '$60,000 - $80,000', 
        apply_link: 'https://apply.com' 
      }
    ];
    fixture.detectChanges(); // Detect changes to update the DOM
    const jobCards = fixture.nativeElement.querySelectorAll('.job-card');
    expect(jobCards.length).toBeGreaterThan(0); // Ensure job cards are rendered
  });
});

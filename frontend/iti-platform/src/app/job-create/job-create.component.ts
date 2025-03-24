import { Component } from '@angular/core';
import { JobService } from '../services/job.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-create',
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.css'],
})
export class JobCreateComponent {
  jobData = {
    title: '',
    company_name: '',
    location: '',
    job_type: '',
    job_state: '',
    description: '',
    requirements: '',
    salary_range: '',
    apply_link: '',
    is_available: true,
  };

  constructor(
    private jobService: JobService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.jobService.createJob(this.jobData).subscribe(() => {
      this.router.navigate(['/jobs']);
    });
  }
}

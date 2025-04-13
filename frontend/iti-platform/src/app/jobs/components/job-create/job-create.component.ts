import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-create',
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule
  ]
})
export class JobCreateComponent {
  jobData: Partial<Job> = {
    title: '',
    company_name: '',
    location: '',
    job_type: 'full-time',
    job_state: 'remote',
    description: '',
    requirements: '',
    salary_range: '',
    apply_link: '',
    is_available: true,
  };

  jobTypes = [
    { value: 'full-time', viewValue: 'Full Time' },
    { value: 'part-time', viewValue: 'Part Time' },
    { value: 'internship', viewValue: 'Internship' }
  ];

  jobStates = [
    { value: 'remote', viewValue: 'Remote' },
    { value: 'on-site', viewValue: 'On Site' },
    { value: 'hybrid', viewValue: 'Hybrid' }
  ];

  constructor(
    private jobService: JobService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.jobService.createJob(this.jobData).subscribe({
      next: () => {
        this.router.navigate(['/jobs']);
      },
      error: (error) => {
        console.error('Error creating job:', error);
      }
    });
  }
}

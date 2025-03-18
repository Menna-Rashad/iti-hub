import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-jobs',
  imports: [],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent {


  jobs: any[] = []; // an array to store the jobs

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.jobService.getJobs().subscribe(
      (data) => {
        this.jobs = data; // assign the fetched data to the jobs array
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }
}
